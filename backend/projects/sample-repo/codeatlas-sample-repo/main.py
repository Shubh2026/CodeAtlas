from services.user_service import UserService
from utils.logger import log

def main():
    service = UserService()
    user = service.get_user(1)
    log(f"Loaded user: {user.name}")

if __name__ == "__main__":
    main()
