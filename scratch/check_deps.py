import os
import ast
import re

def get_imports(directory):
    imports = set()
    for root, dirs, files in os.walk(directory):
        if 'venv' in dirs:
            dirs.remove('venv')
        if '.git' in dirs:
            dirs.remove('.git')
        for file in files:
            if file.endswith('.py'):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        tree = ast.parse(f.read())
                    for node in ast.walk(tree):
                        if isinstance(node, ast.Import):
                            for n in node.names:
                                imports.add(n.name.split('.')[0])
                        elif isinstance(node, ast.ImportFrom):
                            if node.module:
                                imports.add(node.module.split('.')[0])
                except Exception as e:
                    print(f"Error parsing {path}: {e}")
    return imports

def get_requirements(req_file):
    reqs = set()
    if not os.path.exists(req_file):
        return reqs
    with open(req_file, 'r') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            # Handle standard reqs, git links, etc.
            match = re.match(r'^([a-zA-Z0-9_\-]+)', line)
            if match:
                reqs.add(match.group(1).lower().replace('-', '_'))
    return reqs

backend_dir = 'backend'
req_file = 'backend/requirements.txt'

found_imports = get_imports(backend_dir)
declared_reqs = get_requirements(req_file)

# Common standard library modules to ignore
stdlib = {
    'os', 'sys', 'pathlib', 'datetime', 'time', 're', 'json', 'ast', 'signal', 'logging', 
    'abc', 'typing', 'collections', 'functools', 'itertools', 'io', 'base64', 'hashlib', 
    'uuid', 'math', 'random', 'threading', 'multiprocessing', 'subprocess', 'shutil', 
    'glob', 'tempfile', 'inspect', 'traceback', 'warnings', 'copy', 'pickle', 'csv', 
    'urllib', 'http', 'socket', 'ssl', 'select', 'selectors', 'asyncio', 'enum', 
    'importlib', 'pkg_resources', 'site', 'decimal', 'fractions', 'statistics', 
    'argparse', 'getopt', 'configparser', 'getpass', 'platform', 'resource', 'mimetypes',
    'email', 'smtplib', 'poplib', 'imaplib', 'telnetlib', 'ftplib', 'xml', 'html', 
    'sqlite3', 'zlib', 'gzip', 'bz2', 'lzma', 'zipfile', 'tarfile', 'crypt', 'hashlib',
    'secrets', 'hmac', 'token', 'tokenize', 'keyword', 'linecache', 'pydoc', 'unittest',
    'doctest', 'timeit'
}

# Local apps to ignore (checking directories in backend/)
local_apps = {d for d in os.listdir(backend_dir) if os.path.isdir(os.path.join(backend_dir, d))}

# Django submodules/builtins
ignored = stdlib.union(local_apps).union({'django', 'rest_framework', 'rest_framework_simplejwt', 'corsheaders', 'whitenoise', 'dj_database_url', 'pythonjsonlogger', 'dotenv', 'bleach', 'pywebpush', 'PIL', 'google'})
# google is handled by google-generativeai in reqs
# PIL is handled by Pillow in reqs
# pythonjsonlogger is handled by python-json-logger in reqs
# dotenv is handled by python-dotenv in reqs

# Manual mapping for discrepancies
mapping = {
    'PIL': 'pillow',
    'google': 'google_generativeai',
    'pythonjsonlogger': 'python_json_logger',
    'dotenv': 'python_dotenv',
}

missing = []
for imp in found_imports:
    imp_lower = imp.lower().replace('-', '_')
    if imp_lower in ignored or imp in ignored:
        continue
    
    # Check mapping
    mapped = mapping.get(imp, imp_lower)
    if mapped not in declared_reqs:
        missing.append(imp)

print("Found imports:", sorted(list(found_imports)))
print("Declared requirements:", sorted(list(declared_reqs)))
print("Missing potential dependencies:", missing)
