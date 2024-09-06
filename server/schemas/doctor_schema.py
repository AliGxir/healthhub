from marshmallow import fields, validate
from models.doctor import Doctor
from config import ma

class DoctorSchema(ma.SQLAlchemySchema):
    class Meta():
        model = Doctor
        load_instance = True
        fields = ["id", "first_name", "last_name", "specialty", "phone_number", "email", "doctor_id"]
        
    first_name = fields.String(required=True, validate=validate.Length(min=3, max=20))
    last_name = fields.String(required=True, validate=validate.Length(min=3, max=20))
    password_hash = fields.String(validate=validate.Length(min=8, max=50))
    email = fields.String(
        required=True,
        validate=[
            validate.Email(error="Invalid email format"),
            validate.Length(min=2, max=256),
        ],
    )
    specialty = fields.String(validate=validate.OneOf([ 
            "internal medicine",
            "family medicine",
            "neurology",
            "urology",
            "plastic surgery",
            "cardiology",
            "hematology",
            "pediatrics",
            "sports medicine",
            "emergency medicine",
            "dermatology",
            "immunology",
            "orthopedics",
            "geriatrics",
            "general surgery",
            "neonatology",
            "infectious diseases",
            "surgery",
            "obstetrics and gynaecology",
            "psychiatry",
            "gastroenterology",
            "endocrinology",
            "ophthalmology",
            "radiology",
            "intensive care medicine"
    ]))
    phone_number = fields.String(
        validate=validate.Regexp(
            r"^\d{3}-\d{3}-\d{4}$", error="Invalid phone number format"
        )
    )
