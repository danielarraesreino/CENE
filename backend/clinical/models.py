from django.db import models
from django.conf import settings
from django.utils import timezone
import json
import base64
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
import os
import logging

logger = logging.getLogger(__name__)

# Helper de Criptografia AES-256
class EncryptionHelper:
    @staticmethod
    def get_key():
        # Usa a SECRET_KEY do Django como base para a chave de criptografia
        # Em produção, deve ser uma chave de 32 bytes separada e segura
        key = settings.SECRET_KEY[:32].encode('utf-8')
        return key

    @staticmethod
    def encrypt(text):
        if not text: return None
        key = EncryptionHelper.get_key()
        iv = os.urandom(16)
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        
        padder = padding.PKCS7(128).padder()
        padded_data = padder.update(text.encode('utf-8')) + padder.finalize()
        
        encrypted = encryptor.update(padded_data) + encryptor.finalize()
        return base64.b64encode(iv + encrypted).decode('utf-8')

    @staticmethod
    def decrypt(encrypted_text):
        if not encrypted_text: return None
        try:
            key = EncryptionHelper.get_key()
            data = base64.b64decode(encrypted_text.encode('utf-8'))
            iv = data[:16]
            encrypted = data[16:]
            
            cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
            decryptor = cipher.decryptor()
            
            decrypted_padded = decryptor.update(encrypted) + decryptor.finalize()
            
            unpadder = padding.PKCS7(128).unpadder()
            decrypted = unpadder.update(decrypted_padded) + unpadder.finalize()
            
            return decrypted.decode('utf-8')
        except Exception as e:
            logger.error(f"Erro de descriptografia: {str(e)}", exc_info=True)
            return "[Erro ao descriptografar]"

# Campos que serão salvos criptografados
class EncryptedField(models.TextField):
    def from_db_value(self, value, expression, connection):
        return EncryptionHelper.decrypt(value)

    def get_prep_value(self, value):
        return EncryptionHelper.encrypt(value)

class RPD(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='rpds')
    timestamp = models.DateTimeField(default=timezone.now)
    
    situacao = EncryptedField()
    pensamento_automatico = EncryptedField()
    emocoes_iniciais = models.JSONField()  # Lista de {emocao, intensidade}
    comportamento = EncryptedField(null=True, blank=True)
    distorcoes_cognitivas = models.JSONField() # Lista de strings
    resposta_alternativa = EncryptedField()
    emocoes_finais = models.JSONField() # Lista de {emocao, intensidade}
    
    grau_crenca_inicial = models.IntegerField(default=100)
    grau_crenca_final = models.IntegerField(default=50)
    
    tags = models.JSONField(default=list, blank=True)
    is_deleted = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-timestamp']

class TriggerLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='triggers')
    timestamp = models.DateTimeField(default=timezone.now)
    
    gatilho = EncryptedField()
    intensidade_impulso = models.IntegerField() # 0-10
    intensidade_final = models.IntegerField(null=True, blank=True)
    tecnica_utilizada = models.CharField(max_length=100)
    sucesso = models.BooleanField(default=True)
    notas = EncryptedField(null=True, blank=True)
    
    class Meta:
        ordering = ['-timestamp']

class MoodLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='moods')
    timestamp = models.DateTimeField(default=timezone.now)
    
    mood = models.IntegerField() # 1-10
    emotions = models.JSONField(default=list)
    notes = EncryptedField(null=True, blank=True)
    activities = models.JSONField(default=list)
    
    class Meta:
        ordering = ['-timestamp']

class Goal(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='clinical_goals')
    title = models.CharField(max_length=200)
    description = EncryptedField(null=True, blank=True)
    category = models.CharField(max_length=50) # Saude, Relacionamentos, etc.
    
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(null=True, blank=True)
    
    target_value = models.IntegerField(null=True, blank=True)
    current_value = models.IntegerField(default=0)
    unit = models.CharField(max_length=50, null=True, blank=True)
    
    status = models.CharField(max_length=20, default='active') # active, completed, abandoned
    priority = models.CharField(max_length=20, default='medium')
    
    milestones = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class SafetyPlan(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='safety_plan')
    
    warning_signs = models.JSONField(default=list)
    coping_strategies = models.JSONField(default=list)
    social_contacts = models.JSONField(default=list) # {name, phone, relationship}
    professionals = models.JSONField(default=list) # {name, phone, specialty}
    safe_places = models.JSONField(default=list)
    reasons_to_live = models.JSONField(default=list)
    
    updated_at = models.DateTimeField(auto_now=True)

class Journal(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='journal_entries')
    date = models.DateField(default=timezone.now)
    content = EncryptedField()
    entry_type = models.CharField(max_length=50, default='free') # gratitude, reflection, free
    mood_score = models.IntegerField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
