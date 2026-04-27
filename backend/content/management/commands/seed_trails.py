from django.core.management.base import BaseCommand
from content.models import Trail

class Command(BaseCommand):
    help = 'Seeds the database with initial trails'

    def handle(self, *args, **options):
        trails_data = [
            {
                "id": 1,
                "title": "A Gênese do Rei Bebê",
                "category": "Fundamentos",
                "order": 1,
                "is_premium": False,
                "type": "narrative",
                "audio_url": "/audio/A_GENESE_DO_REI_BEBE.MP3",
                "content": {
                    "stages": [
                        {"id": "womb", "title": "O Ventre", "description": "A ilusão de onipotência no útero."},
                        {"id": "birth", "title": "O Trauma do Nascimento", "description": "A primeira grande frustração."},
                        {"id": "ego", "title": "O Surgimento do Rei Bebê", "description": "O ego imaturo como defesa."},
                        {"id": "addiction", "title": "A Substância como Solução", "description": "A busca pelo paraíso perdido."}
                    ]
                }
            },
            {
                "id": 2,
                "title": "Mitos da Adição",
                "category": "Fundamentos",
                "order": 2,
                "is_premium": False,
                "type": "myth_reveal",
                "content": {
                    "myths": [
                        {"id": "m1", "title": "Posso parar quando quiser", "description": "A crença de controle total.", "truth": "A adição altera os circuitos de decisão no cérebro.", "endGame": "A aceitação da impotência é o primeiro passo."},
                        {"id": "m2", "title": "O problema é a substância", "description": "Focar apenas no objeto do vício.", "truth": "A substância é apenas o sintoma de um mal-estar interno.", "endGame": "Precisamos tratar a causa, não apenas o sintoma."}
                    ]
                }
            },
            {
                "id": 3,
                "title": "O Quiz do Autoconhecimento",
                "category": "Recuperação",
                "order": 3,
                "is_premium": False,
                "type": "quiz",
                "content": {
                    "questions": [
                        {"id": "q1", "text": "Qual o principal gatilho do Rei Bebê?", "options": ["Frustração", "Alegria", "Fome"], "correctIndex": 0},
                        {"id": "q2", "text": "A rendição significa derrota total?", "options": ["Sim", "Não, significa aceitação", "Às vezes"], "correctIndex": 1}
                    ]
                }
            },
            {
                "id": 4,
                "title": "A Prática da Rendição",
                "category": "Recuperação",
                "order": 4,
                "is_premium": True,
                "type": "resistance",
                "content": {
                    "phases": ["exaustão", "derrota", "rendição"],
                    "resistanceSteps": 5
                }
            }
        ]

        for data in trails_data:
            trail, created = Trail.objects.update_or_create(
                id=data['id'],
                defaults=data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Trail '{trail.title}' created."))
            else:
                self.stdout.write(self.style.SUCCESS(f"Trail '{trail.title}' updated."))
