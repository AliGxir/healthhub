from flask_restful import Resource
from models.billing import Billing
from schemas.billing_schema import BillingSchema
from config import db

billings_schema = BillingSchema(many=True, session=db.session)


class Billings(Resource):
    def get(self):
        billings = billings_schema.dump(Billing.query)
        return billings, 200
