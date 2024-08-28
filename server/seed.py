from faker import Faker
from app import app, db
from models.patient import Patient
from datetime import datetime
import random
from werkzeug.security import generate_password_hash

# Initialize Faker
faker = Faker()

def seed_data():
    with app.app_context():
        # Delete old data
        Patient.query.delete()
        
        patients = []
        for _ in range(5):
            patient = Patient(
                first_name = faker.first_name(),
                last_name = faker.last_name(),
                date_of_birth = faker.date_of_birth(minimum_age=18, maximum_age=90),
                gender = random.choice([
                    "female",
                    "male",
                    "cisgender",
                    "transgender",
                    "non-binary",
                    "agender",
                    "unsure",
                    "not listed",
                    "prefer not to answer"
                ]),
                address = faker.address(),
                phone_number = faker.numerify(text="(###) ###-####"),
                email = faker.email(),
                password_hash="password",
                insurance_id = faker.bothify(text='???-########'),
                created_at=faker.date_time_this_decade()
            )
            patients.append(patient)
            db.session.add(patient)
        db.session.commit()

if __name__ == "__main__":
    with app.app_context():
        seed_data()