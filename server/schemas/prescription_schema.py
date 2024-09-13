from marshmallow import fields, validate
from models.prescription import Prescription
from config import ma


class PrescriptionSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Prescription
        load_instance = True
        fields = [
            "id",
            "medication_name",
            "dosage",
            "start_date",
            "end_date",
            "instructions",
            "patient_id",
            "doctor_id",
            "doctor",
            "patient",
        ]

    medication_name = fields.String(validate=validate.Length(min=5, max=20))
    dosage = fields.String(required=True, validate=validate.Length(min=1, max=50))
    start_date = fields.Date(required=True)
    end_date = fields.Date(required=True)
    patient_id = fields.Integer(require=True)
    doctor_id = fields.Integer(require=True)

    doctor = fields.Nested("DoctorSchema", only=("first_name", "last_name", "id"))
    patient = fields.Nested("PatientSchema", only=("first_name", "last_name", "id"))
