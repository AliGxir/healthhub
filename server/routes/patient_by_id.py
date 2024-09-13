from flask import request
from flask_restful import Resource
from models.patient import Patient
from schemas.patient_schema import PatientSchema
from config import db

patient_schema = PatientSchema(session=db.session)


class PatientById(Resource):
    def get(self, id):
        try:
            if patient := db.session.get(Patient, id):
                patient_schema = PatientSchema()
                return patient_schema.dump(patient), 200
            return {"error": "Could not find that patient"}, 404
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400

    def patch(self, id):
        if patient := db.session.get(Patient, id):
            try:
                data = request.json
                patient_schema.validate(data)
                updated_patient = patient_schema.load(
                    data, instance=patient, partial=True
                )
                db.session.commit()
                return patient_schema.dump(updated_patient), 200
            except Exception as e:
                db.session.rollback()
                return {"error": str(e)}, 400
        return {"error": "Patient not found"}, 404

    def delete(self, id):
        try:
            if patient := db.session.get(Patient, id):
                try:
                    db.session.delete(patient)
                    db.session.commit()
                    return {"message": f"Patient #{id} has been deleted"}, 200
                except Exception as e:
                    db.session.rollback()
                    return {"error": str(e)}, 400
            return {"error": "Could not find patient"}, 404
        except Exception as e:
            return {"error": str(e)}, 400
