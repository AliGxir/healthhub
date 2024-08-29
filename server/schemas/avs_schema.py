from marshmallow import fields, validate
from models.appointment import Appointment
from config import ma

class AppointmentSchema(ma.SQLAlchemySchema):
    class Meta():
        model = Appointment
        load_instance = True
        fields = ["id", "record_date", "notes", "diagnosis", "treatment"]
        
    record_date = fields.Date(required=True)
    notes = fields.String(validate=validate.Length(max=256))
    diagnosis = fields.String(validate=validate.Length(max=256))
    treatment = fields.String(validate=validate.Length(max=256))
