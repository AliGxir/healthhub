from flask_restful import Resource
from models.prescription import Prescription
from schemas.prescription_schema import PrescriptionSchema
from config import db

prescription_schema = PrescriptionSchema(session=db.session)


class PrescriptionById(Resource):
    def get(self, id):
        try:
            if prescription := db.session.get(Prescription, id):
                prescription_schema = PrescriptionSchema()
                return prescription_schema.dump(prescription), 200
            return {"error": "Could not find that prescription"}, 404
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400
