from flask_restful import Resource
from models.prescription import Prescription
from schemas.prescription_schema import PrescriptionSchema
from config import db

prescriptions_schema = PrescriptionSchema(many=True, session=db.session)


class Prescriptions(Resource):
    def get(self):
        prescriptions = prescriptions_schema.dump(Prescription.query)
        return prescriptions, 200
