from flask import Flask
from application.models import User, Role
from application.models import db
from application.config import LocalConfig
from flask_security import Security, SQLAlchemyUserDatastore    
from flask_security import hash_password
from application.resources import api
from cache import cache
from mail import mail

def create_app():
    app = Flask(__name__)
    app.config.from_object(LocalConfig)
    db.init_app(app)
    cache.init_app(app)
    api.init_app(app)
    mail.init_app(app)
    
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    app.security = Security(app, datastore)

    app.app_context().push()
    return app


app = create_app()

from application.routes import *
with app.app_context():
    db.create_all()
    app.security.datastore.find_or_create_role(name='admin', description='Administrator')
    app.security.datastore.find_or_create_role(name='student', description='Student')
    app.security.datastore.find_or_create_role(name='company', description='Company')
    db.session.commit() 

    if not app.security.datastore.find_user(email='user@admin.com'):
        app.security.datastore.create_user(email='user@admin.com',password=hash_password('admin@1234'),username='admin',roles=['admin'])

    if not app.security.datastore.find_user(email='student@user.com'):
        app.security.datastore.create_user(email='student@user.com',password=hash_password('student@1234'),username='student',roles=['student'])
    
    db.session.commit()


if __name__ == '__main__':    
    app.run() 