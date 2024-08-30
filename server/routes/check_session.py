from flask import session, make_response
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
            # Correctly check if both 'patient_id' and 'doctor_id' are not in session
            if "patient_id" not in session and "doctor_id" not in session:
                return{"error": "Unauthorized"}, 403
            
            # Fetch the user from the session, either patient or doctor
            user = None
            if "patient_id" in session:
                user = db.session.get(Patient, session["patient_id"])
            elif "doctor_id" in session:
                user = db.session.get(Doctor, session["doctor_id"])
            if not user:
                return {"error": "User not found"}, 404
            
            # Check if the user was found
            if isinstance(user, Patient):
                return patient_schema.dump(user), 200
            else:
                return doctor_schema.dump(user), 200
        except Exception as e:
            return {"error": str(e)}, 422
