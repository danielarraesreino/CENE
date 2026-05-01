import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from lms.models import User

username = 'aluno_teste'
password = 'senha_teste_2026'
email = 'aluno@exemplo.com'

if not User.objects.filter(username=username).exists():
    User.objects.create_user(username=username, password=password, email=email, is_premium=True)
    print(f"User {username} created successfully.")
else:
    print(f"User {username} already exists.")
