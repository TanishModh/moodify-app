import multiprocessing

# Bind to the port the app will be served on
bind = "0.0.0.0:8000"

# Use a single worker to reduce memory usage
workers = 1

# Use a single thread per worker
threads = 1

# Timeout after 30 seconds of no activity
timeout = 30

# Keep connections alive for 5 seconds
keepalive = 5

# Worker class - using sync for better memory management
worker_class = 'sync'

# Maximum requests per worker before it gets restarted
max_requests = 1000
max_requests_jitter = 50

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Preload the application to save memory
preload_app = True

# Set environment variables
raw_env = [
    'DJANGO_SETTINGS_MODULE=backend.settings',
]
