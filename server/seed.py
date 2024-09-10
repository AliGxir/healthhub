from faker import Faker
from app import app, db
from models.patient import Patient
from models.doctor import Doctor
from models.appointment import Appointment
from models.billing import Billing
from models.avs import AVS
from models.prescription import Prescription
from datetime import datetime, timedelta
import random
from random import sample
from werkzeug.security import generate_password_hash

# Initialize Faker
faker = Faker()


def seed_data():
    with app.app_context():
        # Delete old data
        Patient.query.delete()
        Doctor.query.delete()
        Appointment.query.delete()
        AVS.query.delete()
        Billing.query.delete()
        Prescription.query.delete()
        
        patients = []
        for _ in range(20):
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
                phone_number = faker.numerify(text="###-###-####"),
                email = faker.email(),
                password_hash="password",
                insurance_id = faker.bothify(text='???-########'),
                created_at=faker.date_time_this_decade()
            )
            patients.append(patient)
            db.session.add(patient)
        db.session.commit()
        
        
        specialties = [
            "internal medicine",
            "family medicine",
            "neurology",
            "urology",
            "plastic surgery",
            "cardiology",
            "hematology",
            "pediatrics",
            "sports medicine",
            "emergency medicine",
            "dermatology",
            "immunology",
            "orthopedics",
            "geriatrics",
            "general surgery",
            "neonatology",
            "infectious diseases",
            "surgery",
            "obstetrics and gynaecology",
            "psychiatry",
            "gastroenterology",
            "endocrinology",
            "ophthalmology",
            "radiology",
            "intensive care medicine"
        ]
        
        doctors = []
        for _ in range(20):
            doctor = Doctor(
                first_name = faker.first_name(),
                last_name = faker.last_name(),
                specialty = random.choice(specialties),
                phone_number = faker.numerify(text="###-###-####"),
                email = faker.email(),
                password_hash="password", 
                created_at = faker.date_time_this_decade()
            )
            doctors.append(doctor)
            db.session.add(doctor)
        db.session.commit()
        
        
        
        
        statuses = ["scheduled", "completed", "canceled"]
                
        appointments = []
        for _ in range(20):
            appointment = Appointment(
                date=datetime.fromisoformat("2024-12-16 23:27:51.881689"),
                # date=faker.date_time_this_year(),
                reason=faker.sentence(5),
                status=random.choice(statuses),
                patient_id=random.choice(patients).id,
                doctor_id=random.choice(doctors).id,
                created_at=faker.date_time_this_decade()
            )
            appointments.append(appointment)
            db.session.add(appointment)
        db.session.commit()
        

        billings = []
        for _ in range(20):
            billing = Billing(
                amount_due=round(faker.pyfloat(left_digits=3, right_digits=2, positive=True), 2),
                payment_status=random.choice(["unpaid", "paid", "pending"]),
                billing_date=faker.date_time_this_year(),
                appointment_id=sample(appointments, 1)[0].id,
                created_at=faker.date_time_this_decade()
            )
            billings.append(billing)
            db.session.add(billing)
        db.session.commit()
        
        
        avs_records = []
        for _ in range(20):
            avs = AVS(
                record_date=faker.date_time_this_year(),
                notes=faker.sentence(10),
                diagnosis=faker.sentence(10),
                treatment=faker.sentence(10),
                appointment_id=sample(appointments, 1)[0].id,
                created_at=faker.date_time_this_decade()
            )
            avs_records.append(avs)
            db.session.add(avs)
        db.session.commit()
        

        prescriptions = []
        for _ in range(20):
            prescription = Prescription(
                medication_name=faker.word() + " " + faker.word(),
                dosage=f"{random.randint(1, 10)} mg",
                start_date=faker.date_this_year(),
                end_date=(faker.date_this_year() + timedelta(days=random.randint(7, 30))),
                instructions=faker.sentence(nb_words=10),
                patient_id=random.choice(patients).id,
                doctor_id=random.choice(doctors).id,
                created_at=faker.date_time_this_decade()
            )
            prescriptions.append(prescription)
            db.session.add(prescription)
        db.session.commit()


if __name__ == "__main__":
    with app.app_context():
        seed_data()