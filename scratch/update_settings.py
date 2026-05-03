import sys

file_path = "/home/dan/Área de Trabalho/reibb/backend/backend/settings.py"
with open(file_path, 'r') as f:
    content = f.read()

old_block = """REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50,
}"""

new_block = """REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/day',
        'user': '5000/day',
        'llm': '100/day',
    },
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50,
}"""

if old_block in content:
    new_content = content.replace(old_block, new_block)
    with open(file_path, 'w') as f:
        f.write(new_content)
    print("Successfully updated settings.py")
else:
    print("Could not find the target block in settings.py")
    # Print a snippet to debug
    start_idx = content.find("REST_FRAMEWORK = {")
    if start_idx != -1:
        print("Found START of block. Snippet:")
        print(content[start_idx:start_idx+200])
    else:
        print("REST_FRAMEWORK not found at all!")
