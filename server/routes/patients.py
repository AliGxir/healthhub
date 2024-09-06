from flask_restful import Resource
from models.patient import Patient
from schemas.patient_schema import PatientSchema
from config import db
from models.appointment import Appointment
from flask import session

patients_schema = PatientSchema(many=True, session=db.session)

    
class Patients(Resource):
    def get(self):
        doctor_id = session.get("doctor_id")
        
        if not doctor_id:
            return {"error": "User not authenticated"}, 401
        
        patients = Patient.query.join(Appointment).filter(Appointment.doctor_id == doctor_id).all()

        if not patients:
            return {"message": "No patients associated with this doctor."}, 404

        result = patients_schema.dump(patients)
        return result, 200
