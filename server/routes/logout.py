from flask import session
from flask_restful import Resource
# from models.patient import Patient
# from models.doctor import Doctor
# from schemas.patient_schema import PatientSchema
# from schemas.doctor_schema import DoctorSchema

# from config import db, api 

class Logout(Resource):
    def delete(self):
        #if there is a patient/doctor in session
        if session.get("patient_id"):
            #remove user in session
            del session["patient_id"]
            return {}, 204
        elif session.get("doctor_id"):
            del session["doctor_id"]
            return {}, 204
        return {'error': "Unauthorized"}, 401
