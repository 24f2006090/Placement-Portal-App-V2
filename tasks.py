import os
import csv
from celery_config import celery
from app import create_app
from application.models import Student, Application, PlacementDrive, Company
from datetime import date, datetime, timedelta
from flask_mail import Message
from mail import mail
from application.models import User

app = create_app()

@celery.task
def export_student_applications(student_id):
    with app.app_context():
        student = Student.query.get(student_id)
        if not student:
            return {
                "status": "failed",
                "message": "Student not found"
            }
        applications = Application.query.filter_by(
            student_id=student_id
        ).all()
        os.makedirs("exports", exist_ok=True)
        filename = f"exports/student_{student_id}.csv"
        with open(filename, "w", newline="", encoding="utf-8") as csvfile:
            fieldnames = [
                "Student ID",
                "Student Name",
                "Company",
                "Drive Title",
                "Application Status",
                "Application Date"
            ]
            writer = csv.DictWriter(
                csvfile,
                fieldnames=fieldnames
            )
            writer.writeheader()
            for app_obj in applications:
                drive = PlacementDrive.query.get(app_obj.driveid)
                company = Company.query.get(drive.company_id)
                writer.writerow({
                    "Student ID": student.id,
                    "Student Name": student.name,
                    "Company": company.company_name,
                    "Drive Title": drive.job_title,
                    "Application Status": app_obj.status,
                    "Application Date": (app_obj.application_date.strftime("%Y-%m-%d %H:%M:%S")
                        if app_obj.application_date 
                        else ""
                    )
                })
        return {
            "status": "completed",
            "filename": filename
        }

@celery.task
def send_deadline_reminders():
    with app.app_context():
        tomorrow = date.today() + timedelta(days=1)
        drives = PlacementDrive.query.filter_by(status="approved").all()
        for drive in drives:
            if drive.deadline != tomorrow:
                continue
            students = Student.query.filter(
                Student.branch == drive.elig_branch,
                Student.year == drive.elig_year,
                Student.cgpa >= drive.min_cgpa
            ).all()
            for student in students:
                user = User.query.get(student.user_id)
                msg = Message(
                    subject="Placement Drive Reminder",
                    recipients=[user.email]
                )
                msg.body = f"""Hello {student.name},
Reminder!
The application deadline for the following placement drive is tomorrow.
Company ID : {drive.company_id}
Job Title  : {drive.job_title}
Deadline   : {drive.deadline}
Please apply before the deadline.
Placement Portal"""
                mail.send(msg)
    print("Daily Reminder Task Completed")

@celery.task
def monthly_activity_report():
    with app.app_context():
        today = datetime.now()
        current_month_start = today.replace(
            day=1,
            hour=0,
            minute=0,
            second=0,
            microsecond=0
        )
        prev_month_end = current_month_start - timedelta(days=1)
        prev_month_start = prev_month_end.replace(
            day=1,
            hour=0,
            minute=0,
            second=0,
            microsecond=0
        )
        total_drives = PlacementDrive.query.filter(
            PlacementDrive.created_at >= prev_month_start,
            PlacementDrive.created_at < current_month_start
        ).count()
        total_applications = Application.query.filter(
            Application.application_date >= prev_month_start,
            Application.application_date < current_month_start
        ).count()
        total_selected = Application.query.filter(
            Application.status == "selected",
            Application.application_date >= prev_month_start,
            Application.application_date < current_month_start
        ).count()
        report_month = prev_month_start.strftime("%B %Y")
        html = f"""<h2>Placement Activity Report - {report_month}</h2>
<table border="1" cellpadding="8">
    <tr>
        <th>Total Drives</th>
        <td>{total_drives}</td>
    </tr>
    <tr>
        <th>Total Applications</th>
        <td>{total_applications}</td>
    </tr>
    <tr>
        <th>Total Selected</th>
        <td>{total_selected}</td>
    </tr>
</table>"""
        msg = Message(
            subject=f"Monthly Placement Report - {report_month}",
            recipients=["devansh.burman16@gmail.com"]
        )
        msg.html = html
        mail.send(msg)
        print(f"Monthly Report Sent for {report_month}")