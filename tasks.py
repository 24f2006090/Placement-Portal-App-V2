import pandas as pd
import os
from celery_config import celery
from app import create_app
from application.models import Student, Application, PlacementDrive, Company
from datetime import date, timedelta
from flask_mail import Message
from mail import mail
from application.models import User

app = create_app()

@celery.task
def export_student_applications(student_id):

    with app.app_context():

        student = Student.query.get(student_id)

        applications = Application.query.filter_by(
            student_id=student_id
        ).all()

        data = []

        for app_obj in applications:

            drive = PlacementDrive.query.get(app_obj.driveid)
            company = Company.query.get(drive.company_id)

            data.append({
                "Student ID": student.id,
                "Student Name": student.name,
                "Company": company.company_name,
                "Drive Title": drive.job_title,
                "Application Status": app_obj.status,
                "Application Date": getattr(app_obj, "created_at", "")
            })
        df = pd.DataFrame(data)

        os.makedirs("exports", exist_ok=True)

        filename = f"exports/student_{student_id}.csv"

        df.to_csv(filename, index=False)

        return filename
    
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

                msg.body = f"""
                        Hello {student.name},

                        Reminder!

                        The application deadline for the following placement drive is tomorrow.

                        Company ID : {drive.company_id}
                        Job Title  : {drive.job_title}
                        Deadline   : {drive.deadline}

                        Please apply before the deadline.

                        Placement Portal
                        """

                mail.send(msg)

        print("Daily Reminder Task Completed")


from flask_mail import Message

@celery.task
def monthly_activity_report():

    with app.app_context():

        total_drives = PlacementDrive.query.count()

        total_applications = Application.query.count()

        total_selected = Application.query.filter_by(
            status="selected"
        ).count()

        html = f"""

        <h2>Placement Activity Report</h2>

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

        </table>

        """

        msg = Message(

            subject="Monthly Placement Report",

            recipients=["user@admin.com"]

        )

        msg.html = html

        mail.send(msg)

        print("Monthly Report Sent")