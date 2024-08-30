# Remote library imports
import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

# Local imports
from config import app, api, db
from routes.patients import Patients
from routes.patient_by_id import PatientById
from routes.doctors import Doctors
from routes.doctor_by_id import DoctorById
from routes.prescriptions import Prescriptions
from routes.prescription_by_id import PrescriptionById
from routes.appointments import Appointments
from routes.appointment_by_id import AppointmentById
from routes.billings import Billings
from routes.billing_by_id import BillingById
from routes.avss import AVSs
from routes.avs_by_id import AVSById
from routes.check_session import CheckSession
from routes.login import Login
from routes.signup import Signup
from routes.logout import Logout


# Resources
api.add_resource(Patients, "/patients")
api.add_resource(PatientById, "/patients/<int:id>")
api.add_resource(Doctors, "/doctors")
api.add_resource(DoctorById, "/doctors/<int:id>")
api.add_resource(Appointments, "/appointments")
api.add_resource(AppointmentById, "/appointments/<int:id>")
api.add_resource(AVSs, "/avss")
api.add_resource(AVSById, "/avss/<int:id>")
api.add_resource(Billings, "/billings")
api.add_resource(BillingById, "/billings/<int:id>")
api.add_resource(Prescriptions, "/prescriptions")
api.add_resource(PrescriptionById, "/prescriptions/<int:id>")
api.add_resource(CheckSession, "/check-session")
api.add_resource(Login, "/login")
api.add_resource(Signup, "/signup")
api.add_resource(Logout, "/logout")


if __name__ == "__main__":
    app.run(port=5555, debug=True)
