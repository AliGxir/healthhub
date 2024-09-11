from flask_restful import Resource
from models.doctor import Doctor
from schemas.doctor_schema import DoctorSchema
from config import db
from flask import session

doctors_schema = DoctorSchema(many=True, session=db.session)

class AllDoctors(Resource):
    def get(self):
        patient_id = session.get("patient_id")
        doctor_id = session.get("doctor_id")
        
        if not patient_id and not doctor_id:
            return {"error": "User not authenticated"}, 401
        
        doctors = Doctor.query.all()

        if not doctors:
            return {"message": "No doctors found."}, 404

        result = doctors_schema.dump(doctors)
        return result, 200