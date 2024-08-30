from flask_restful import Resource
from models.patient import Patient
from schemas.patient_schema import PatientSchema
from config import db

patients_schema = PatientSchema(many=True, session=db.session)


class Patients(Resource):
    def get(self):
        patients = patients_schema.dump(Patient.query)
        return patients, 200
