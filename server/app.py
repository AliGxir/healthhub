# Remote library imports
from flask import request, make_response, session, redirect
from flask_restful import Resource
import os
from datetime import datetime
from functools import wraps


BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

# Local imports
from config import app, db, api
from models.patient import Patient
from models.doctor import Doctor
from models.prescription import Prescription
from models.appointment import Appointment
from models.billing import Billing
from models.avs import AVS
from schemas.patient_schema import PatientSchema

patients_schema = PatientSchema(many=True, session=db.session)
patient_schema = PatientSchema(many=True, session=db.session)

class Patients(Resource):
    def get(self):
        patients = patients_schema.dump(Patient.query)
        return patients, 200
    
class PatientById(Resource):
    def get(self, id):
        if patient := db.session.get(Patient, id):
            patient_schema = PatientSchema()
            return patient_schema.dump(patient), 200
        return {'error': 'Could not find that patient'}, 404
    
    def patch(self, id):
        if patient := db.session.get(Patient, id):
            try:
                data = request.json
                # Validate data
                patient_schema.validate(data)
                # Deserialize data and allow for partial updates
                updated_patient = patient_schema.load(data, instance=patient, partial=True)
                db.session.commit()
                # Serialize the data and package your JSON response
                return patient_schema.dump(updated_patient), 200
            except Exception as e:
                db.session.rollback()
                return {'error': str(e)}, 400
        return {'error': 'Patient not found'}, 404

    def delete(self, id):
        if patient := db.session.get(Patient, id):
            try:
                db.session.delete(patient)
                db.session.commit()
                return {'message': f'Patient #{id} has been deleted'}, 200
            except Exception as e:
                db.session.rollback()
                return {'error': str(e)}, 400
        return {'error': 'Could not find patient'}, 404
    

api.add_resource(Patients, "/patients")
api.add_resource(PatientById, "/patient/<int:id>")

if __name__ == "__main__":
    app.run(port=5555, debug=True)
