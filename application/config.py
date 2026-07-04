class Config:
    DEBUG = True
    SQLALCHEMY_TRACK_MODIFICATIONS = True

class LocalConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///db.sqlite3'
    DEBUG = True
    SECRET_KEY = '1234567890'
    SECURITY_PASSWORD_HASH = 'bcrypt'
    SECURITY_PASSWORD_SALT = 'this-is-password-salt'
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authorization-token'
    SECURITY_TOKEN_AUTHENTICATION_ENABLED = True
    CACHE_TYPE = "RedisCache"
    CACHE_REDIS_HOST = "localhost"
    CACHE_REDIS_PORT = 6379
    CACHE_DEFAULT_TIMEOUT = 300
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = "devansh.burman16@gmail.com"
    MAIL_PASSWORD = "----------------"
    MAIL_DEFAULT_SENDER = "devansh.burman16@gmail.com"

