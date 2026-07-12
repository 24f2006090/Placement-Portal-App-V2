from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
from datetime import datetime
db = SQLAlchemy()

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    fs_uniquifier = db.Column(db.String, unique=True, nullable=False)
    active = db.Column(db.Boolean(), default=True)
    roles = db.relationship('Role', secondary='user_roles',backref='bearer')

class Role(db.Model,RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String, unique=True)
    description = db.Column(db.String)

class UserRoles(db.Model):
    __tablename__ = 'user_roles'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer,db.ForeignKey('user.id'))
    name = db.Column(db.String(100))
    branch = db.Column(db.String(50))
    cgpa = db.Column(db.Float)
    year = db.Column(db.Integer)
    phone = db.Column(db.String(15))
    resume = db.Column(db.String())
class Company(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer,db.ForeignKey('user.id'))
    company_name = db.Column(db.String(100))
    website = db.Column(db.String(200))
    status = db.Column(db.String(20),default='pending')

class PlacementDrive(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer,db.ForeignKey('company.id'))
    job_title = db.Column(db.String(100))
    description = db.Column(db.String(200))
    min_cgpa = db.Column(db.Float)
    elig_branch = db.Column(db.String(100))
    elig_year = db.Column(db.Integer)
    deadline = db.Column(db.Date)
    status = db.Column(db.String(20),default='pending')
    created_at = db.Column(db.DateTime,default=datetime.now)

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer,db.ForeignKey('student.id'))
    driveid = db.Column(db.Integer,db.ForeignKey('placement_drive.id'))
    status = db.Column(db.String(15),default='applied')
    interview_date = db.Column(db.String(20))
    interview_time = db.Column(db.String(20))
    interview_mode = db.Column(db.String(20))
    interview_venue = db.Column(db.String(200))
    application_date = db.Column(db.DateTime,default=datetime.now)
