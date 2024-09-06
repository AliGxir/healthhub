from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields, validate
from models.patient import Patient
from schemas.appointment_schema import AppointmentSchema
from config import ma


class PatientSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Patient
        load_instance = True
        fields = [
            "id",
            "first_name",
            "last_name",
            "password_hash",
            "date_of_birth",
            "gender",
            "address",
            "phone_number",
            "email",
            "insurance_id",
            "appointments",
            "patient_id"
        ]

    first_name = fields.String(required=True, validate=validate.Length(min=3, max=20))
    last_name = fields.String(required=True, validate=validate.Length(min=3, max=20))
    password_hash = fields.String(required=True, validate=validate.Length(min=8, max=50))
    email = fields.String(
        required=True,
        validate=[
            validate.Email(error="Invalid email format"),
            validate.Length(min=2, max=256),
        ],
    )
    date_of_birth = fields.Date(required=True)
    gender = fields.String(
        validate=validate.OneOf(
            [
                "female",
                "male",
                "cisgender",
                "transgender",
                "non-binary",
                "agender",
                "unsure",
                "not listed",
                "prefer not to answer"
            ]
        )
    )
    address = fields.String(validate=validate.Length(max=256))
    phone_number = fields.String(
        validate=validate.Regexp(
            r"^\d{3}-\d{3}-\d{4}$", error="Invalid phone number format"
        )
    )
    insurance_id = fields.String(validate=validate.Length(max=12))
    
    appointments = fields.List(fields.Nested("AppointmentSchema"))
