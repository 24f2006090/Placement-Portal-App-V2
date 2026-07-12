from celery.schedules import crontab

from celery_config import celery


celery.conf.beat_schedule = {

    "daily-placement-reminders": {

        "task": "tasks.send_deadline_reminders",

        "schedule": crontab(hour=9, minute=0),

    },

    "monthly-report": {

        "task": "tasks.monthly_activity_report",

        "schedule": crontab(
            day_of_month=1,
            hour=9,
            minute=0
        ),

    }

}