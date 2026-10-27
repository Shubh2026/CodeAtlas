from models.user import User
from config import DATABASE_URL

class UserService:
    def __init__(self):
        self.database_url = DATABASE_URL

    def get_user(self, user_id):
        return User(user_id, "Ada Lovelace")

    def create_user(self, name):
        return User(2, name)
