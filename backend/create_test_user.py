import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

if not User.objects.filter(username='testuser').exists():
    User.objects.create_user('testuser', 'testuser@example.com', 'testpass123')
    print("Test user created.")
else:
    print("Test user already exists.")
