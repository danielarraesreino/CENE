"""
Testes para o app rag — ChatView com mock do Gemini.
Agente E — Guarda de Testes.
"""
import pytest
from unittest.mock import patch, MagicMock

RAG_URL = "/api/rag/chat/"


@pytest.mark.django_db
def test_rag_missing_message_returns_400(auth_client):
    """POST sem campo 'message' deve retornar 400."""
    response = auth_client.post(RAG_URL, {}, format="json")
    assert response.status_code == 400
    assert "error" in response.data


@pytest.mark.django_db
def test_rag_no_api_key_returns_500(auth_client, settings):
    """Sem GEMINI_API_KEY configurada o endpoint deve retornar 500."""
    with patch("rag.views.GEMINI_API_KEY", ""):
        response = auth_client.post(RAG_URL, {"message": "olá"}, format="json")
    assert response.status_code == 500
    assert "error" in response.data


@pytest.mark.django_db
def test_rag_unauthenticated_returns_401(api_client):
    """Usuário não autenticado deve receber 401."""
    response = api_client.post(RAG_URL, {"message": "olá"}, format="json")
    assert response.status_code == 401


@pytest.mark.django_db
def test_rag_streaming_with_mock_gemini(auth_client):
    """
    Com GEMINI_API_KEY mockada, a view deve retornar StreamingHttpResponse
    com o conteúdo gerado pelo modelo simulado.
    """
    mock_chunk = MagicMock()
    mock_chunk.text = "Olá! Estou aqui para ajudar."

    mock_chat = MagicMock()
    mock_chat.send_message.return_value = iter([mock_chunk])

    mock_model = MagicMock()
    mock_model.start_chat.return_value = mock_chat

    with patch("rag.views.GEMINI_API_KEY", "fake-key"), \
         patch("rag.views.genai.GenerativeModel", return_value=mock_model):
        response = auth_client.post(RAG_URL, {"message": "como estou?"}, format="json")

    assert response.status_code == 200
    content = b"".join(response.streaming_content).decode()
    assert "Olá" in content


@pytest.mark.django_db
def test_rag_timeout_returns_friendly_message(auth_client):
    """
    Se o LLM demorar mais de 15s (TimeoutError), a view deve retornar
    uma mensagem amigável em vez de um erro 500.
    """
    def _slow_stream():
        raise TimeoutError("LLM call exceeded 15s")
        yield  # torna função um generator

    mock_chat = MagicMock()
    mock_chat.send_message.side_effect = TimeoutError("LLM call exceeded 15s")

    mock_model = MagicMock()
    mock_model.start_chat.return_value = mock_chat

    with patch("rag.views.GEMINI_API_KEY", "fake-key"), \
         patch("rag.views.genai.GenerativeModel", return_value=mock_model), \
         patch("rag.views.signal"):  # mocka signal.alarm para não depender de Unix
        response = auth_client.post(RAG_URL, {"message": "teste timeout"}, format="json")

    assert response.status_code == 200
    content = b"".join(response.streaming_content).decode()
    assert "demorou" in content.lower() or "erro" in content.lower()
