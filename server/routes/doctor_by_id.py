from flask_restful import Resource
from models.doctor import Doctor
from schemas.doctor_schema import DoctorSchema
from config import db

doctor_schema = DoctorSchema(session=db.session)


class DoctorById(Resource):
    def get(self, id):
        try:
            if doctor := db.session.get(Doctor, id):
                doctor_schema = DoctorSchema()
                return doctor_schema.dump(doctor), 200
            return {"error": "Could not find that doctor"}, 404
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400
