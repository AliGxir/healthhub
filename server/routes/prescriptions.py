from flask import session, request
from flask_restful import Resource
from models.prescription import Prescription
from schemas.prescription_schema import PrescriptionSchema
from config import db

prescriptions_schema = PrescriptionSchema(many=True, session=db.session)

class Prescriptions(Resource):
    def get(self):

        patient_id = session.get("patient_id")
        doctor_id = session.get("doctor_id")
        
        if not patient_id and not doctor_id:
            return {"error": "User not authenticated"}, 401

        if patient_id:
            prescriptions = Prescription.query.filter_by(patient_id=patient_id).all()
        elif doctor_id:
            prescriptions = Prescription.query.filter_by(doctor_id=doctor_id).all()
        
        results = prescriptions_schema.dump(prescriptions)
        return results, 200
