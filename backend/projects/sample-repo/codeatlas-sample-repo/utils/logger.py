from datetime import datetime

def log(message):
    timestamp = datetime.now().isoformat()
    print(f"[{timestamp}] {message}")
