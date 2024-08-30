from flask import session, request
from flask_restful import Resource
from schemas.patient_schema import PatientSchema
from config import db

patient_schema = PatientSchema(session=db.session)

class Signup(Resource):
    def post(self):
        try:
            # Get user input data
            data = request.json
            # Validate patient information
            # patient_schema.validate(data)
            # Create new patient schema
            new_patient = patient_schema.load(data)
            # Hash password
            new_patient.password_hash = request.json.get("password_hash")
            db.session.add(new_patient)
            db.session.commit()
            # Add patient id to cookies
            session['patient_id'] = new_patient.id
            serialized_patient = patient_schema.dump(new_patient)
            return serialized_patient, 201
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 400


