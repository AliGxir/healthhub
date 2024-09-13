from flask_restful import Resource
from models.avs import AVS
from schemas.avs_schema import AVSSchema
from config import db
from flask import session 
from sqlalchemy.orm import joinedload
from models.appointment import Appointment  


avs_schema = AVSSchema(many=True, session=db.session)

class AVSs(Resource):
    def get(self):
        try: 
            patient_id = session.get("patient_id")
            doctor_id = session.get("doctor_id")
            
            if not patient_id and not doctor_id:
                return {"error": "User not authenticated"}, 401
            
            if patient_id:
                avss = AVS.query.options(joinedload(AVS.appointment)).filter(
                    AVS.appointment.has(patient_id=patient_id)
                ).all()
            elif doctor_id:
                avss = AVS.query.options(joinedload(AVS.appointment)).filter(
                    AVS.appointment.has(doctor_id=doctor_id)
                ).all()

            
            results = avs_schema.dump(avss)
            return results, 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400
