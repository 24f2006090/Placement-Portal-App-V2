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

