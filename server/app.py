# Remote library imports
from flask import request, make_response, session, redirect
from flask_restful import Resource
import os
from datetime import datetime
from functools import wraps


BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

# Local imports
from config import app, db, api
from models.patient import Patient
from models.doctor import Doctor
from models.prescription import Prescription
from models.appointment import Appointment
from models.billing import Billing
from models.avs import AVS
from schemas.patient_schema import PatientSchema
from schemas.doctor_schema import DoctorSchema
from schemas.appointment_schema import AppointmentSchema
from schemas.billing_schema import BillingSchema
from schemas.prescription_schema import PrescriptionSchema

patients_schema = PatientSchema(many=True, session=db.session)
patient_schema = PatientSchema(session=db.session)
doctors_schema = DoctorSchema(many=True, session=db.session)
doctor_schema = DoctorSchema(session=db.session)
appointments_schema = AppointmentSchema(many=True, session=db.session)
appointment_schema = AppointmentSchema(session=db.session)
billings_schema = BillingSchema(many=True, session=db.session)
billing_schema = BillingSchema(session=db.session)
prescriptions_schema = PrescriptionSchema(many=True, session=db.session)
prescription_schema = PrescriptionSchema(session=db.session)

class Patients(Resource):
    def get(self):
        patients = patients_schema.dump(Patient.query)
        return patients, 200

class PatientById(Resource):
    def get(self, id):
        if patient := db.session.get(Patient, id):
            patient_schema = PatientSchema()
            return patient_schema.dump(patient), 200
        return {"error": "Could not find that patient"}, 404
    
    def patch(self, id):
        if patient := db.session.get(Patient, id):
            try:
                data = request.json
                # Validate data
                patient_schema.validate(data)
                # Deserialize data and allow for partial updates
                updated_patient = patient_schema.load(data, instance=patient, partial=True)
                db.session.commit()
                # Serialize the data and package your JSON response
                return patient_schema.dump(updated_patient), 200
            except Exception as e:
                db.session.rollback()
                return {"error": str(e)}, 400
        return {"error": "Patient not found"}, 404

    def delete(self, id):
        if patient := db.session.get(Patient, id):
            try:
                db.session.delete(patient)
                db.session.commit()
                return {"message": f"Patient #{id} has been deleted"}, 200
            except Exception as e:
                db.session.rollback()
                return {"error": str(e)}, 400
        return {"error": "Could not find patient"}, 404
    
class Doctors(Resource):
    def get(self):
        doctors = doctors_schema.dump(Doctor.query)
        return doctors, 200
    
class DoctorById(Resource):
    def get(self, id):
        if doctor := db.session.get(Doctor, id):
            doctor_schema = DoctorSchema()
            return doctor_schema.dump(doctor), 200
        return {"error": "Could not find that doctor"}, 404
class Appointments(Resource):
    def get(self):
        appointments =  appointments_schema.dump(Appointment.query)
        return appointments, 200
    
class AppointmentById(Resource):
    def get(self, id):
        if  appointment := db.session.get(Appointment, id):
            appointment_schema =  AppointmentSchema()
            return  appointment_schema.dump( appointment), 200
        return {"error": "Could not find that appointment"}, 404
    
    def patch(self, id):
        if appointment := db.session.get(Appointment, id):
            try:
                data = request.json
                # Validate data
                appointment_schema.validate(data)
                # Deserialize data and allow for partial updates
                updated_appointment = appointment_schema.load(data, instance=appointment, partial=True)
                db.session.commit()
                # Serialize the data and package your JSON response
                return appointment_schema.dump(updated_appointment), 200
            except Exception as e:
                db.session.rollback()
                return {"error": str(e)}, 400
        return {"error": "Appointment not found"}, 404

    def delete(self, id):
        if appointment := db.session.get(Appointment, id):
            try:
                db.session.delete(appointment)
                db.session.commit()
                return {"message": f"Appointment #{id} has been deleted"}, 200
            except Exception as e:
                db.session.rollback()
                return {"error": str(e)}, 400
        return {"error": "Could not find appointment"}, 404

class AVSs(Resource):
    def get(self):
        avss = avss_schema.dump(AVS.query)
        return avss, 200
    
class AVSById(Resource):
    def get(self, id):
        if avs := db.session.get(AVS, id):
            avs_schema = AVSSchema()
            return avs_schema.dump(avs), 200
        return {"error": "Could not find that avs"}, 404
    
class Billings(Resource):
    def get(self):
        billings = billings_schema.dump(Billing.query)
        return billings, 200
    
class BillingById(Resource):
    def get(self, id):
        if billing := db.session.get(Billing, id):
            billing_schema = BillingSchema()
            return billing_schema.dump(billing), 200
        return {"error": "Could not find that billing"}, 404

class Prescriptions(Resource):
    def get(self):
        prescriptions = prescriptions_schema.dump(Prescription.query)
        return prescriptions, 200
    
class PrescriptionById(Resource):
    def get(self, id):
        if prescription := db.session.get(Prescription, id):
            prescription_schema = PrescriptionSchema()
            return prescription_schema.dump(prescription), 200
        return {"error": "Could not find that prescription"}, 404

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


if __name__ == "__main__":
    app.run(port=5555, debug=True)
