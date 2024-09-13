from flask_restful import Resource
from models.billing import Billing
from schemas.billing_schema import BillingSchema
from config import db

billing_schema = BillingSchema(session=db.session)


class BillingById(Resource):
    def get(self, id):
        try:
            if billing := db.session.get(Billing, id):
                billing_schema = BillingSchema()
                return billing_schema.dump(billing), 200
            return {"error": "Could not find that billing"}, 404
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400
