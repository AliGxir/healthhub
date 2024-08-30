from flask import request
from flask_restful import Resource
from models.patient import Patient
from schemas.patient_schema import PatientSchema
from config import db

patient_schema = PatientSchema(session=db.session)


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
                updated_patient = patient_schema.load(
                    data, instance=patient, partial=True
                )
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
