from unittest import result

from flask_restful import Api, Resource
from flask_security import auth_required, roles_required,current_user
from flask import request
from .models import Student, Company, PlacementDrive, Application,db

api = Api()

class AdminDashboardAPI(Resource):
    @auth_required()
    @roles_required('admin')
    def get(self):
        return {
            "students": Student.query.count(),
            "companies": Company.query.count(),
            "drives": PlacementDrive.query.count(),
            "applications": Application.query.count()
        }
api.add_resource(
    AdminDashboardAPI,
    '/api/admin/dashboard'
)

class CompanyListAPI(Resource):
    @auth_required()
    @roles_required('admin')
    def get(self):
        companies = Company.query.all()
        return[
            {
                "id": c.id,
                "company_name": c.company_name,
                "website": c.website,
                "status": c.status
            }
            for c in companies
        ]
    
api.add_resource(
    CompanyListAPI,
    '/api/companies'
)

class CompanyApprovalAPI(Resource):
    @auth_required()
    @roles_required('admin')
    def put(self,company_id):
        company = Company.query.get(company_id)
        if not company:
            return {
                "message": "Company not found"
            }, 404

        company.status = "approved"
        db.session.commit()

        return {
            "message": "Company approved successfully"
        }
    
api.add_resource(
    CompanyApprovalAPI,
    '/api/company/<int:company_id>/approve'
)

class DrivecreateAPI(Resource):
    @auth_required()
    @roles_required('company')
    def post(self):
        data = request.get_json()
        company_user = current_user.id
        company = Company.query.filter_by(
            user_id=company_user
        ).first()
        drive = PlacementDrive(
            company_id=company.id,
            job_title=data["job_title"],
            description=data["description"],
            min_cgpa=data["min_cgpa"],
            elig_branch=data["elig_branch"],
            elig_year=data["elig_year"],
            status="pending"
        )

        db.session.add(drive)
        db.session.commit()

        return {
            "message": "Placement Drive Created"
        }, 201
    
api.add_resource(
    DrivecreateAPI,
    '/api/drive/create'
)

class ListDrivesAPI(Resource):

    @auth_required()
    @roles_required('admin')
    def get(self):

        drives = PlacementDrive.query.all()

        return [
            {
                "id": d.id,
                "job_title": d.job_title,
                "company_id": d.company_id,
                "status": d.status
            }
            for d in drives
        ]
    
api.add_resource(
    ListDrivesAPI,
    '/api/drives'
)
class DriveapproveAPI(Resource):

    @auth_required()
    @roles_required('admin')
    def put(self, drive_id):

        drive = PlacementDrive.query.get(drive_id)

        if not drive:
            return {
                "message": "Drive not found"
            }, 404

        drive.status = "approved"

        db.session.commit()

        return {
            "message": "Drive approved"
        }, 200
    
api.add_resource(
    DriveapproveAPI,
    '/api/drive/<int:drive_id>/approve'
)

class StudentDriveListAPI(Resource):
    @auth_required()
    @roles_required('student')
    def get(self):
        drives = PlacementDrive.query.filter_by(status='approved').all()
        return [
            {
                "id": d.id,
                "job_title": d.job_title,
                "description": d.description,
                "min_cgpa": d.min_cgpa,
                "elig_branch": d.elig_branch,
                "elig_year": d.elig_year
            }
            for d in drives
        ]
    
api.add_resource(
    StudentDriveListAPI,
    '/api/student/drives'
)   

class ApplyDriveAPI(Resource):
    @auth_required()
    @roles_required('student')
    def post(self, drive_id):

        student = Student.query.filter_by(user_id=current_user.id).first()
        drive = PlacementDrive.query.get(drive_id)
        if not student:
            return {
                "message": "Student profile not found"
            }, 404
        if not drive:
            return {
                "message": "Drive not found"
            }, 404

        if drive.status != "approved":
            return {
                "message": "Drive not approved"
            }, 400
        if student.cgpa < drive.min_cgpa:
            return {
                "message": "CGPA criteria not satisfied"
            }, 400

        if student.branch != drive.elig_branch:
            return {
                "message": "Branch not eligible"
            }, 400

        if student.year != drive.elig_year:
            return {
                "message": "Year not eligible"
            }, 400
        
        existing = Application.query.filter_by(
            student_id=student.id,
            driveid=drive_id
        ).first()

        if existing:
            return {
                "message": "Already applied"
            }, 400

        application = Application(
            student_id=student.id,
            driveid=drive_id,
            status="applied"
        )

        db.session.add(application)
        db.session.commit()

        return {
            "message": "Applied successfully"
        }, 201
    
api.add_resource(
    ApplyDriveAPI,
    '/api/apply/<int:drive_id>'
)

class StudentApplicationsAPI(Resource):
    @auth_required()
    @roles_required('student')
    def get(self):
        student = Student.query.filter_by(
            user_id=current_user.id
        ).first()

        applications = Application.query.filter_by(
            student_id=student.id
        ).all()

        return [
            {
                "application_id": a.id,
                "drive_id": a.driveid,
                "status": a.status
            }
            for a in applications
        ]
    
api.add_resource(
    StudentApplicationsAPI,
    '/api/student/applications'
)

class ApplicantsDriveAPI(Resource):
    @auth_required()
    @roles_required('company')
    def get(self, drive_id):
        applications = Application.query.filter_by(driveid=drive_id).all()
        result = []

        for app in applications:
            student = Student.query.get(app.student_id)
            result.append({
                "application_id": app.id,
                "student_id": student.id,
                "name": student.name,
                "branch": student.branch,
                "cgpa": student.cgpa,
                "year": student.year,
                "status": app.status
            })
        return result

api.add_resource(
    ApplicantsDriveAPI,
    '/api/drive/<int:drive_id>/applicants'
)
class ApplicationStatusUpdateAPI(Resource):
    @auth_required()
    @roles_required('company')
    def put(self, application_id):
        data = request.get_json()

        application = Application.query.get(
            application_id
        )

        if not application:
            return {
                "message": "Application not found"
            }, 404
        application.status = data["status"]
        db.session.commit()

        return {
            "message": "Status updated"
        }

api.add_resource(
    ApplicationStatusUpdateAPI,
    '/api/application/<int:application_id>/status'
)

class AllApplicationsAPI(Resource):

    @auth_required()
    @roles_required('admin')
    def get(self):

        applications = Application.query.all()

        result = []

        for a in applications:

            student = Student.query.get(a.student_id)

            drive = PlacementDrive.query.get(a.driveid)

            result.append({

                "application_id": a.id,
                "student_name": student.name,
                "drive_name": drive.job_title,
                "status": a.status

            })

        return result

api.add_resource(
    AllApplicationsAPI,
    '/api/admin/applications'
)

class StudentListAPI(Resource):
    @auth_required()
    @roles_required('admin')
    def get(self):
        students = Student.query.all()

        return [
            {
                "id": s.id,
                "name": s.name,
                "branch": s.branch,
                "cgpa": s.cgpa,
                "year": s.year
            }
            for s in students
        ]

api.add_resource(
    StudentListAPI,
    '/api/students'
)

class SearchStudentAPI(Resource):
    @auth_required()
    @roles_required('admin')
    def get(self):
        branch = request.args.get('branch')
        students = Student.query.filter_by(branch=branch).all()

        return [
            {
                "id": s.id,
                "cgpa": s.cgpa,
                "year": s.year
            }
            for s in students
        ]

api.add_resource(
    SearchStudentAPI,
    '/api/search/students'
)

class SearchDriveAPI(Resource):
    @auth_required()
    @roles_required('admin')
    def get(self):
        title = request.args.get('title')
        drives = PlacementDrive.query.filter(PlacementDrive.job_title.contains(title)).all()

        return [
            {
                "id": d.id,
                "job_title": d.job_title,
                "status": d.status
            }
            for d in drives
        ]

api.add_resource(
    SearchDriveAPI,
    '/api/search/drives'
)

class CompanyDriveAPI(Resource):

    @auth_required()
    @roles_required('company')
    def get(self):
        company = Company.query.filter_by(user_id=current_user.id).first()
        drives = PlacementDrive.query.filter_by(company_id=company.id).all()

        return [
            {
                "id": d.id,
                "job_title": d.job_title,
                "status": d.status
            }
            for d in drives
        ]

api.add_resource(
    CompanyDriveAPI,
    '/api/company/drives'
)

class DriveDetailsAPI(Resource):
    @auth_required()
    def get(self, drive_id):
        drive = PlacementDrive.query.get(drive_id)
        if not drive:
            return {
                "message": "Drive not found"
            }, 404

        return {
            "id": drive.id,
            "job_title": drive.job_title,
            "description": drive.description,
            "min_cgpa": drive.min_cgpa,
            "elig_branch": drive.elig_branch,
            "elig_year": drive.elig_year,
            "status": drive.status
        }

api.add_resource(
    DriveDetailsAPI,
    '/api/drive/<int:drive_id>'
)

class SearchApplicantAPI(Resource):
    @auth_required()
    @roles_required('company')
    def get(self):
        branch = request.args.get('branch')
        students = Student.query.filter_by(branch=branch).all()

        return [
            {
                "id": s.id,
                "branch": s.branch,
                "cgpa": s.cgpa
            }
            for s in students
        ]

api.add_resource(
    SearchApplicantAPI,
    '/api/search/applicants'
)

class DeleteDriveAPI(Resource):
    @auth_required()
    @roles_required('company')
    def delete(self, drive_id):
        company = Company.query.filter_by(user_id=current_user.id).first()
        drive = PlacementDrive.query.get(drive_id)

        if not drive:
            return {
                "message": "Drive not found"
            }, 404

        if drive.company_id != company.id:
            return {
                "message": "You can delete only your own drives"
            }, 403

        db.session.delete(drive)
        db.session.commit()

        return {
            "message": "Drive deleted"
        }, 200

api.add_resource(
    DeleteDriveAPI,
    '/api/drive/<int:drive_id>/delete'
)
class CompleteDriveAPI(Resource):

    @auth_required()
    @roles_required('admin')
    def put(self, drive_id):

        drive = PlacementDrive.query.get(drive_id)

        if not drive:
            return {
                "message": "Drive not found"
            }, 404

        drive.status = "completed"

        db.session.commit()

        return {
            "message": "Drive marked completed"
        }, 200


api.add_resource(
    CompleteDriveAPI,
    '/api/drive/<int:drive_id>/complete'
)

class BlacklistCompanyAPI(Resource):

    @auth_required()
    @roles_required('admin')
    def put(self, company_id):

        company = Company.query.get(company_id)

        if not company:
            return {
                "message":"Company not found"
            },404

        company.status = "blacklisted"

        drives = PlacementDrive.query.filter_by(
            company_id=company.id
        ).all()

        for drive in drives:

            drive.status = "cancelled"

            applications = Application.query.filter_by(
                driveid=drive.id
            ).all()

            for app in applications:
                app.status = "cancelled"

        db.session.commit()

        return {
            "message":"Company blacklisted"
        },200

api.add_resource(
    BlacklistCompanyAPI,
    '/api/company/<int:company_id>/blacklist'
)

class BlacklistStudentAPI(Resource):

    @auth_required()
    @roles_required('admin')
    def put(self, student_id):

        student = Student.query.get(student_id)

        if not student:
            return {
                "message":"Student not found"
            },404

        applications = Application.query.filter_by(
            student_id=student.id
        ).all()

        for app in applications:
            app.status = "cancelled"

        db.session.commit()

        return {
            "message":"Student blacklisted"
        },200

api.add_resource(
    BlacklistStudentAPI,
    '/api/student/<int:student_id>/blacklist'
)

class ApplicationDetailsAPI(Resource):

    @auth_required()
    @roles_required('admin')
    def get(self, application_id):

        app = Application.query.get(application_id)

        if not app:
            return {
                "message":"Application not found"
            },404

        student = Student.query.get(app.student_id)

        return {
            "application_id": app.id,
            "student_id": student.id,
            "branch": student.branch,
            "cgpa": student.cgpa,
            "status": app.status
        }

api.add_resource(
    ApplicationDetailsAPI,
    '/api/application/<int:application_id>'
)