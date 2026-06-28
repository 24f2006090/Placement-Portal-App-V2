from app import app
from flask import jsonify,request,render_template
from flask_security import auth_required, roles_required,current_user,hash_password,verify_password
from application.models import User, Role, Student, Company, PlacementDrive, Application
from application.models import db

@app.route('/admin')
@auth_required('token')
@roles_required('admin')
def admin():
    return jsonify({
        "message":"Admin Dashboard"
    })

@app.route('/student')
@auth_required('token')
@roles_required('student')
def student():
    return jsonify({
        "message":"Student Dashboard"
    })

@app.route('/',methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/company')
@auth_required('token')
@roles_required('company')
def company():
    return jsonify({
        "message":"Company Dashboard"
    })

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    if not verify_password(
        data["password"],
        user.password
    ):
        return jsonify({
            "message": "Invalid Password"
        }), 401

    return jsonify({
        "message": "Login Successful",
        "user_id": user.id,
        "email": user.email,
        "auth_token": user.get_auth_token(),
        "role": user.roles[0].name
    }), 200
