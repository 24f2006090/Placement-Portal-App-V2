from app import app
from flask import jsonify,request
from flask_security import auth_required, roles_required,current_user  ,hash_password
from application.models import User, Role, Student, Company, PlacementDrive, Application
from application.models import db

@app.route('/admin')
@auth_required()
@roles_required('admin')
def admin():
    return jsonify({
        "message":"Admin Dashboard"
    })

@app.route('/student')
@auth_required()
@roles_required('student')
def student():
    return jsonify({
        "message":"Student Dashboard"
    })

@app.route('/')
def home():
    return jsonify({
        "message": "Placement Portal Running"
    })

@app.route('/company')
@auth_required()
@roles_required('company')
def company():
    return jsonify({
        "message":"Company Dashboard"
    })


@app.route('/api/register/student', methods=['POST'])
def register_student():

    credentials = request.get_json()

    if app.security.datastore.find_user(email=credentials["email"]):
        return jsonify({
            "message": "User already exists"
        }), 400

    app.security.datastore.create_user(email=credentials["email"],username=credentials["username"],
        password=hash_password(credentials["password"]),roles=['student'])
    
    db.session.commit()

    user = User.query.filter_by(email=credentials["email"]).first()
    
    student = Student(user_id=user.id,branch=credentials["branch"],cgpa=credentials["cgpa"],year=credentials["year"])

    db.session.add(student)
    db.session.commit()

    return jsonify({
        "message":"Student created successfully"
    }), 201

@app.route('/api/register/company', methods=['POST'])
def register_company():

    credentials = request.get_json()
    if app.security.datastore.find_user(email=credentials["email"]):
        return jsonify({
            "message":"User already exists"
        }), 400

    app.security.datastore.create_user(email=credentials["email"],username=credentials["username"],password=hash_password(credentials["password"]),roles=['company'])

    db.session.commit()

    user = User.query.filter_by(email=credentials["email"]).first()

    company = Company(user_id=user.id,company_name=credentials["company_name"],website=credentials["website"],status='pending')

    db.session.add(company)
    db.session.commit()

    return jsonify({
        "message":"Company registered successfully"
    }), 201