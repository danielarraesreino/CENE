import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

user, created = User.objects.get_or_create(username='testuser', defaults={'email': 'testuser@example.com'})
user.set_password('testpass123')
user.save()

if created:
    print("Test user created with password 'testpass123'.")
else:
    print("Test user password reset to 'testpass123'.")
