# Placement Portal Application V2

## Project Overview

The Placement Portal Application is a multi-user web application developed for managing campus placement activities.

The application has three types of users:

- Admin
- Company
- Student

The Admin manages companies, students, placement drives, and applications.

Companies can create placement drives, view applicants, shortlist students, schedule interviews, and update application results.

Students can view placement drives, apply for eligible drives, track application status, upload resumes, and export their application history.

## Technologies Used

### Backend

- Flask
- Flask-SQLAlchemy
- Flask-RESTful
- Flask-Security
- SQLite
- Redis
- Celery
- Celery Beat
- Flask-Caching
- Flask-Mail

### Frontend

- VueJS
- Bootstrap 5
- HTML
- JavaScript

## Project Features

### Admin Features

- Admin Login
- View Dashboard Statistics
- Approve Companies
- Blacklist Companies
- Approve Placement Drives
- Reject Placement Drives
- View Students
- Blacklist Students
- Search Students
- Search Companies
- Search Placement Drives
- View Placement Statistics

### Company Features

- Company Registration and Login
- Update Company Profile
- Create Placement Drives
- View Created Placement Drives
- View Student Applications
- Shortlist Students
- Reject Students
- Select Students
- Schedule Interviews
- Mark Placement Drives as Completed
- View Total Applicants

### Student Features

- Student Registration and Login
- Update Student Profile
- Upload Resume
- View Approved Placement Drives
- Search Placement Drives
- Search Drives by Company Name
- Apply for Placement Drives
- Eligibility Validation
- Prevention of Duplicate Applications
- View Application Status
- View Interview Details
- View Placement History
- Export Application History as CSV

## Background Jobs

The application uses Celery and Redis for background processing.

The following background jobs are implemented:

### Daily Placement Deadline Reminder

A scheduled Celery task sends reminders to students about upcoming placement drive deadlines.

### Monthly Placement Activity Report

A monthly placement activity report is generated and sent to the Admin through email.

The report contains:

- Total Placement Drives
- Total Applications
- Total Selected Students

### Student Application CSV Export

Students can request an export of their placement application history.

The CSV export is processed asynchronously using Celery.

## Steps to Run the Application

### Step 1: Open the Project Folder

Open the terminal and move to the project directory.

```bash
cd Placement-Portal
```

### Step 2: Create Virtual Environment

Create a Python virtual environment.

```bash
python -m venv venv
```

Activate the virtual environment.

For Windows:

```bash
venv\Scripts\activate
```

For Linux/macOS:

```bash
source venv/bin/activate
```

### Step 3: Install Required Packages

Install the required Python packages using:

```bash
pip install -r requirements.txt
```

### Step 4: Start Redis Server

Open a terminal and start Redis:

```bash
redis-server
```

Keep this terminal running.

### Step 5: Start Flask Application

Open another terminal and activate the virtual environment.

```bash
venv\Scripts\activate
```

Run the Flask application:

```bash
python app.py
```

Keep this terminal running.

### Step 6: Start Celery Worker

Open another terminal and activate the virtual environment.

```bash
venv\Scripts\activate
```

Start the Celery worker:

```bash
celery -A celery_config.celery worker --loglevel=info --pool=solo
```

Keep this terminal running.

### Step 7: Start Celery Beat

Open another terminal and activate the virtual environment.

```bash
venv\Scripts\activate
```

Start Celery Beat:

```bash
celery -A celery_config.celery beat --loglevel=info
```

Keep this terminal running.

## Required Terminals

The application requires four terminals to run all functionalities.

### Terminal 1 - Redis

```bash
redis-server
```

### Terminal 2 - Flask Application

```bash
python app.py
```

### Terminal 3 - Celery Worker

```bash
celery -A celery_config.celery worker --loglevel=info --pool=solo
```

### Terminal 4 - Celery Beat

```bash
celery -A celery_config.celery beat --loglevel=info
```

## Application Workflow

### Admin Workflow

1. Login using Admin credentials.
2. View dashboard statistics.
3. Approve registered companies.
4. Approve or reject placement drives.
5. Search students, companies, and drives.
6. Blacklist companies or students.
7. Monitor placement applications and statistics.

### Company Workflow

1. Register as a Company.
2. Login to the application.
3. Wait for Admin approval.
4. Create placement drives after approval.
5. Wait for placement drive approval.
6. View students who applied for placement drives.
7. Shortlist or reject students.
8. Schedule interviews.
9. Update the final selection status.
10. Mark placement drives as completed.

### Student Workflow

1. Register as a Student.
2. Login to the application.
3. Complete or update the student profile.
4. Upload resume.
5. View approved placement drives.
6. Search drives by job title or company name.
7. Apply for eligible placement drives.
8. View application status.
9. View interview details.
10. View placement history.
11. Export application history as CSV.

## Database

The application uses SQLite as the database.

The database is created programmatically using SQLAlchemy models.

The main database tables are:

- User
- Role
- UserRoles
- Student
- Company
- PlacementDrive
- Application

## Important Notes

- Redis must be running before starting Celery Worker and Celery Beat.
- Celery Worker must be running for asynchronous CSV export.
- Celery Beat must be running for scheduled reminders and monthly reports.
- The Flask application must be running to access the Placement Portal.
- The Admin user is created programmatically and does not have a registration page.
- Companies must be approved by the Admin before creating placement drives.
- Placement drives must be approved by the Admin before they are visible to students.
- Students cannot apply multiple times to the same placement drive.
- Student eligibility is checked before submitting an application.

## Project Author

**Name:** Devansh Burman  
**Roll Number:** 24F2006090  
**Project:** Placement Portal Application V2  
**Course:** Application Development 2
