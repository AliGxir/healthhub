from flask_restful import Resource
from models.doctor import Doctor
from schemas.doctor_schema import DoctorSchema
from config import db

doctors_schema = DoctorSchema(many=True, session=db.session)


class Doctors(Resource):
    def get(self):
        doctors = doctors_schema.dump(Doctor.query)
        return doctors, 200
