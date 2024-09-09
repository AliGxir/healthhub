from marshmallow import fields, validate
from models.appointment import Appointment
from config import ma

class AppointmentSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Appointment
        load_instance = True
        fields = ["id", "date", "reason", "status", "patient_id", "doctor_id", "billing_id", "avs_id"]
    
    date = fields.DateTime(required=True)
    reason = fields.String(validate=validate.Length(min=6, max=50))
    status = fields.String(validate=validate.OneOf(["scheduled", "completed", "canceled"]))
    patient_id = fields.Integer(required=True)
    doctor_id = fields.Integer(required=True)
    billing_id = fields.Integer(allow_none=True)
    avs_id = fields.Integer(allow_none=True)
