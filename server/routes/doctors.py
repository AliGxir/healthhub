from flask_restful import Resource
from models.doctor import Doctor
from schemas.doctor_schema import DoctorSchema
from config import db
from models.appointment import Appointment
from flask import session

doctors_schema = DoctorSchema(many=True, session=db.session)

class Doctors(Resource):
    def get(self):
        patient_id = session.get("patient_id")
        
        if not patient_id:
            return {"error": "User not authenticated"}, 401
        
        doctors = Doctor.query.join(Appointment).filter(Appointment.patient_id == patient_id).all()

        if not doctors:
            return {"message": "No doctors associated with this patient."}, 404

        result = doctors_schema.dump(doctors)
        return result, 200