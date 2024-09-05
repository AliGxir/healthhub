from flask_restful import Resource
from models.billing import Billing
from schemas.billing_schema import BillingSchema
from config import db
from flask import session 
from sqlalchemy.orm import joinedload

billings_schema = BillingSchema(many=True, session=db.session)


class Billings(Resource):
    def get(self):
        current_patient_id = session.get("patient_id")
        
        if not current_patient_id:
            return {"error": "User not authenticated"}, 401
        
        billings = Billing.query.options(joinedload(Billing.appointments)).filter(Billing.patient_id == current_patient_id).all()
        
        results = billings_schema.dump(billings)
        return results, 200
