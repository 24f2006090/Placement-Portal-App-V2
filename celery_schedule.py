from celery.schedules import crontab
from celery_config import celery

celery.conf.beat_schedule = {
    "daily-placement-reminders": {
        "task": "tasks.send_deadline_reminders",
        "schedule": crontab(hour=11, minute=42),
    },
    "monthly-report": {
        "task": "tasks.monthly_activity_report",
        "schedule": crontab(day_of_month=14, hour=11, minute=48),
    }
}