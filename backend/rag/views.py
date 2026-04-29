import os
import signal
import google.generativeai as genai
from django.http import StreamingHttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rag.models import ChatMessage

# Configure Gemini
# No mundo real, a chave viria do env. 
# Para desenvolvimento, usaremos o placeholder ou o valor real se disponível.
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

from clinical.models import RPD, MoodLog, TriggerLog

LLM_TIMEOUT_SECONDS = 15

def _timeout_handler(signum, frame):
    raise TimeoutError("LLM call exceeded 15s")

class ChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        message_text = request.data.get('message')
        if not message_text:
            return Response({"error": "Message is required"}, status=400)

        # Buscar contexto clínico recente do usuário
        recent_rpds = RPD.objects.filter(user=request.user, is_deleted=False).order_by('-timestamp')[:3]
        recent_moods = MoodLog.objects.filter(user=request.user).order_by('-timestamp')[:5]
        recent_triggers = TriggerLog.objects.filter(user=request.user).order_by('-timestamp')[:3]

        clinical_context = "\n\nCONTEXTO CLÍNICO DO USUÁRIO:\n"
        if recent_rpds:
            clinical_context += "Pensamentos Recentes (RPDs):\n"
            for r in recent_rpds:
                clinical_context += f"- Situação: {r.situacao} | Pensamento: {r.pensamento_automatico}\n"
        
        if recent_moods:
            clinical_context += "Humor Recente:\n"
            for m in recent_moods:
                clinical_context += f"- {m.timestamp.strftime('%d/%m')}: {m.mood}/10 | Notas: {m.notes or 'Sem notas'}\n"

        # System Prompt (Portal Renascer)
        system_prompt = (
            "Você é o Assistente Renascer, um guia especializado em prevenção à recaída "
            "e recuperação emocional. Sua abordagem deve ser empática, clara e baseada "
            "nos princípios da TCC (Terapia Cognitivo-Comportamental) e no conceito do 'Rei Bebê'. "
            "Ajude o usuário a identificar gatilhos e a manter a sobriedade. "
            "Você tem acesso ao histórico clínico recente do usuário abaixo. Use-o para ser mais "
            "específico em suas orientações, sem ser invasivo."
            f"{clinical_context}"
        )

        # Log user message
        ChatMessage.objects.create(user=request.user, role='user', content=message_text)

        if not GEMINI_API_KEY:
            return Response({"error": "Gemini API Key not configured on server."}, status=500)

        model = genai.GenerativeModel(
            model_name="gemini-2.0-flash",
            system_instruction=system_prompt
        )

        def stream_response():
            # Instala handler de timeout SIGALRM (Unix apenas — Gunicorn workers)
            signal.signal(signal.SIGALRM, _timeout_handler)
            signal.alarm(LLM_TIMEOUT_SECONDS)
            try:
                chat = model.start_chat(history=[])
                response = chat.send_message(message_text, stream=True)
                
                full_response = ""
                for chunk in response:
                    if chunk.text:
                        text = chunk.text
                        full_response += text
                        yield text
                
                # Log assistant message
                ChatMessage.objects.create(user=request.user, role='assistant', content=full_response)
            except TimeoutError:
                yield "Desculpe, o assistente demorou muito para responder. Tente novamente em instantes."
            except Exception as e:
                yield f"Erro ao processar mensagem: {str(e)}"
            finally:
                signal.alarm(0)  # Sempre cancela o alarm

        return StreamingHttpResponse(stream_response(), content_type='text/plain')
