from marshmallow import fields, validate
from models.billing import Billing
from config import ma

class BillingSchema(ma.SQLAlchemySchema):
    class Meta():
        model = Billing
        load_instance = True
        fields = ["id", "appointment_id", "amount_due", "payment_status", "billing_date"]
        
    appointment_id = fields.Integer(require=True)
    amount_due = fields.Float(required=True)
    payment_status = fields.String(validate=validate.OneOf(["unpaid", "paid", "pending"]))
    billing_date = fields.Date(required=True)
