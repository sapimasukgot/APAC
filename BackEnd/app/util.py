from itsdangerous import URLSafeSerializer

SECRET_KEY = "you WOULD never guess this"
serializer = URLSafeSerializer(SECRET_KEY)

def encrypt_id(id):
    return serializer.dumps(id)

def decrypt_id(encrypted_id):
    return serializer.loads(encrypted_id)