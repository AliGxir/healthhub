from flask import session, request
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from schemas.patient_schema import PatientSchema
from models.patient import Patient  
from config import db

patient_schema = PatientSchema(session=db.session)

class Signup(Resource):
    def post(self):
        try:
            data = request.json
            
            existing_patient = db.session.query(Patient).filter_by(email=data.get("email")).first()
            if existing_patient:
                return {"error": "Email already exists. Please use a different email."}, 400

            new_patient = patient_schema.load(data)
            new_patient.password_hash = request.json.get("password_hash") 

            db.session.add(new_patient)
            db.session.commit()

            session["patient_id"] = new_patient.id
            serialized_patient = patient_schema.dump(new_patient)
            return serialized_patient, 201

        except IntegrityError as e:
            db.session.rollback()
            return {"error": "This email is already registered. Please use another email address."}, 400

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400
