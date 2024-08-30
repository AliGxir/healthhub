from flask import session, request
from flask_restful import Resource
from models.patient import Patient
from models.doctor import Doctor
from schemas.patient_schema import PatientSchema
from schemas.doctor_schema import DoctorSchema
from config import db

patient_schema = PatientSchema(session=db.session)
doctor_schema = DoctorSchema(session=db.session)

class Login(Resource):
    def post(self):
        try:
            #get email and password
            data = request.json
            #query db by user email
            user = User.query.filter_by(email=data.get("email")).first()
            #if user exists and authenticate
            if user and user.authenticate(data.get("password_hash")):
                session['user_id'] = user.id
                return user_schema.dump(user), 200
            return {'error': 'Invalid Credentials'}, 403
        except Exception as e:
            return {'error': "Invalid Credentials"}, 403
