from flask import session
from flask_restful import Resource
from models.patient import Patient
from models.doctor import Doctor
from schemas.patient_schema import PatientSchema
from schemas.doctor_schema import DoctorSchema
from config import db

patient_schema = PatientSchema(session=db.session)
doctor_schema = DoctorSchema(session=db.session)


class CheckSession(Resource):
    def get(self):
        try:
            if "patient_id" not in session and "doctor_id" not in session:
                return {"error": "Unauthorized"}, 403
            user = None
            if "patient_id" in session:
                user = db.session.get(Patient, session["patient_id"])
            elif "doctor_id" in session:
                user = db.session.get(Doctor, session["doctor_id"])
            if not user:
                return {"error": "User not found"}, 404
            if isinstance(user, Patient):
                return patient_schema.dump(user), 200
            else:
                return doctor_schema.dump(user), 200
        except Exception as e:
            return {"error": str(e)}, 422
