from flask import session, request
from flask_restful import Resource
from models.patient import Patient
from models.doctor import Doctor
from schemas.patient_schema import PatientSchema
from schemas.doctor_schema import DoctorSchema

from config import db

patient_schema = PatientSchema(session=db.session)
doctor_schema = DoctorSchema(session=db.session)

class Login(Resource):
    def post(self):
        try:
            #get email and password
            data = request.json
            
            #query db by patient email
            patient = Patient.query.filter_by(email=data.get("email")).first()
            if not patient:
                doctor = Doctor.query.filter_by(email=data.get("email")).first()
                
            #if patient/doctor exists and authenticate
            if patient and patient.authenticate(data.get("password_hash")):
                session["patient_id"] = patient.id 
                return patient_schema.dump(patient), 200
            
            if doctor and doctor.authenticate(data.get("password_hash")):
                session["doctor_id"] = doctor.id
                return doctor_schema.dump(doctor), 200
            return {'error': 'Invalid Credentials'}, 403
        except Exception as e:
            return {'error': "Invalid Credentials"}, 403
