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