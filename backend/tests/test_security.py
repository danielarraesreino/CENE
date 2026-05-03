"""
Testes de segurança crítica — Reibb LMS.
Agente A (Blindagem) + Agente E (Testes).

Cobre:
- VAPID keys carregadas de env vars (não hardcoded)
- bootstrap_test_user bloqueado em produção
- Criptografia AES com CLINICAL_ENCRYPTION_KEY dedicada
"""
import pytest
import base64
import secrets
from django.test import override_settings
from rest_framework.test import APIClient
from django.conf import settings


# ── Helpers ───────────────────────────────────────────────────────────────────

def _gen_aes_key() -> str:
    """Gera uma CLINICAL_ENCRYPTION_KEY válida (32 bytes em base64)."""
    return base64.b64encode(secrets.token_bytes(32)).decode()


# ── VAPID Keys ────────────────────────────────────────────────────────────────

class TestVapidSecurity:
    """Verifica que as chaves VAPID vêm de variáveis de ambiente."""

    def test_vapid_private_key_not_hardcoded_in_settings(self):
        """O arquivo settings.py não deve conter a chave privada em texto claro."""
        settings_path = (
            __import__('pathlib').Path(__file__).resolve()
            .parent.parent / 'backend' / 'settings.py'
        )
        content = settings_path.read_text(encoding='utf-8')
        assert 'BEGIN PRIVATE KEY' not in content, (
            "VAPID_PRIVATE_KEY em texto claro encontrada em settings.py! "
            "Mova para variável de ambiente imediatamente."
        )

    def test_vapid_public_key_not_hardcoded_in_settings(self):
        """A chave pública VAPID não deve estar hardcoded em settings.py."""
        settings_path = (
            __import__('pathlib').Path(__file__).resolve()
            .parent.parent / 'backend' / 'settings.py'
        )
        content = settings_path.read_text(encoding='utf-8')
        # A chave hardcoded original iniciava com "BJWO2ZUf"
        assert 'BJWO2ZUf' not in content, (
            "VAPID_PUBLIC_KEY hardcoded encontrada em settings.py!"
        )

    @override_settings(VAPID_PUBLIC_KEY='test_pub_key', VAPID_PRIVATE_KEY='test_priv_key')
    def test_vapid_keys_readable_from_settings(self):
        """Com env vars configuradas, as chaves devem estar acessíveis."""
        from django.conf import settings
        assert settings.VAPID_PUBLIC_KEY == 'test_pub_key'
        assert settings.VAPID_PRIVATE_KEY == 'test_priv_key'


# ── Bootstrap Endpoint ────────────────────────────────────────────────────────

@pytest.mark.django_db
class TestBootstrapSecurity:
    """Verifica que o endpoint de bootstrap está bloqueado em produção."""

    def setup_method(self):
        self.client = APIClient()

    @override_settings(DEBUG=False)
    def test_bootstrap_blocked_in_production(self):
        """Em produção (DEBUG=False), bootstrap deve retornar 403."""
        response = self.client.post(
            '/api/bootstrap-user/',
            {'username': 'hacker'},
            format='json'
        )
        assert response.status_code == 403
        assert 'desabilitado' in response.json().get('error', '').lower()

    @override_settings(DEBUG=True)
    def test_bootstrap_works_in_debug(self):
        """Em debug (DEBUG=True), bootstrap deve funcionar normalmente."""
        response = self.client.post(
            '/api/bootstrap-user/',
            {'username': 'test_security_user'},
            format='json'
        )
        assert response.status_code == 200
        assert response.json()['status'] == 'bootstrapped'

    @override_settings(DEBUG=False)
    def test_bootstrap_blocked_even_with_valid_payload(self):
        """O guard de produção deve bloquear independente do payload."""
        response = self.client.post(
            '/api/bootstrap-user/',
            {'username': 'admin'},
            format='json'
        )
        assert response.status_code == 403



# ── Criptografia AES ─────────────────────────────────────────────────────────

class TestEncryptionKey:
    """Verifica o comportamento da chave AES dedicada."""

    def test_dedicated_key_takes_priority_over_secret_key(self):
        """CLINICAL_ENCRYPTION_KEY deve ter prioridade sobre SECRET_KEY."""
        test_key = _gen_aes_key()
        with override_settings(CLINICAL_ENCRYPTION_KEY=test_key, DEBUG=False):
            from clinical.models import EncryptionHelper
            key = EncryptionHelper.get_key()
            # Deve retornar os primeiros 32 bytes do base64 decodificado
            expected = base64.b64decode(test_key)[:32].ljust(32, b'\x00')
            assert key == expected

    @override_settings(DEBUG=True, CLINICAL_ENCRYPTION_KEY='')
    def test_fallback_to_secret_key_in_debug(self):
        """Em DEBUG sem CLINICAL_ENCRYPTION_KEY, deve usar SECRET_KEY[:32]."""
        from importlib import reload
        import clinical.models as cm
        reload(cm)
        from django.conf import settings
        # Em DEBUG sem chave dedicada, deve usar o fallback
        key = cm.EncryptionHelper.get_key()
        assert key == settings.SECRET_KEY[:32].encode('utf-8')

    @override_settings(DEBUG=False, CLINICAL_ENCRYPTION_KEY='')
    def test_raises_in_production_without_key(self):
        """Em produção sem CLINICAL_ENCRYPTION_KEY, deve levantar ValueError."""
        from importlib import reload
        import clinical.models as cm
        reload(cm)
        with pytest.raises(ValueError, match='CLINICAL_ENCRYPTION_KEY'):
            cm.EncryptionHelper.get_key()

    def test_encrypt_decrypt_roundtrip_with_dedicated_key(self):
        """Dados criptografados com CLINICAL_ENCRYPTION_KEY devem ser descriptografáveis."""
        test_key = _gen_aes_key()
        with override_settings(CLINICAL_ENCRYPTION_KEY=test_key, DEBUG=False):
            from importlib import reload
            import clinical.models as cm
            reload(cm)

            original = "Dados clínicos sensíveis do paciente"
            encrypted = cm.EncryptionHelper.encrypt(original)

            assert encrypted is not None
            assert encrypted != original  # Deve estar criptografado

            decrypted = cm.EncryptionHelper.decrypt(encrypted)
            assert decrypted == original
