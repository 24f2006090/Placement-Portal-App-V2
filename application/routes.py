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
    if not user.active:
        return jsonify({
            "message": "Your account has been blacklisted"
        }), 403
    if user.has_role("company"):
        company = Company.query.filter_by(
            user_id=user.id
        ).first()
        if not company:
            return jsonify({
                "message": "Company profile not found"
            }), 404
        if company.status == "rejected":
            return jsonify({
                "message": "Your Company Account got Rejected. Please contact Admin for more details"
            }), 403
        if company.status == "blacklisted":
            return jsonify({
                "message": "Your Company Account is Blocked. Please contact Admin for more details"
            }), 403
        if company.status != "approved":
            return jsonify({
                "message": "Your Company Account is waiting for Admin approval"
            }), 403
    return jsonify({
        "message": "Login Successful",
        "user_id": user.id,
        "email": user.email,
        "auth_token": user.get_auth_token(),
        "role": user.roles[0].name
    }), 200

@app.route('/api/register/student', methods=['POST'])
def register_student():
    credentials = request.get_json()
    if app.security.datastore.find_user(email=credentials["email"]):
        return jsonify({
            "message": "User already exists"
        }), 400
    app.security.datastore.create_user(
        email=credentials["email"],
        username=credentials["username"],
        password=hash_password(credentials["password"]),
        roles=['student']
    )
    db.session.commit()
    user = User.query.filter_by(email=credentials["email"]).first()
    student = Student(
        user_id=user.id,
        name=credentials["username"],
        branch=credentials["branch"],
        cgpa=credentials["cgpa"],
        year=credentials["year"]
    )
    db.session.add(student)
    db.session.commit()
    return jsonify({
        "message": "Student created successfully"
    }), 201


@app.route('/api/company/register', methods=['POST'])
def register_company():
    credentials = request.get_json()
    if app.security.datastore.find_user(email=credentials["email"]):
        return jsonify({
            "message": "User already exists"
        }), 400
    app.security.datastore.create_user(
        email=credentials["email"],
        username=credentials["username"],
        password=hash_password(credentials["password"]),
        roles=['company']
    )
    db.session.commit()
    user = User.query.filter_by(email=credentials["email"]).first()
    company = Company(
        user_id=user.id,
        company_name=credentials["company_name"],
        website=credentials["website"],
        status='pending'
    )
    db.session.add(company)
    db.session.commit()
    return jsonify({
        "message": "Company registered successfully"
    }), 201
