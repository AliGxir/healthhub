from models.__init__ import (
    db,
    SerializerMixin,
    hybrid_property,
    flask_bcrypt,
    validates,
    re,
)


class Doctor(db.Model, SerializerMixin):

    __tablename__ = "doctors"
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    specialty = db.Column(db.String, nullable=False)
    phone_number = db.Column(db.String)
    email = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column("password", db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    
    appointments = db.relationship(
        "Appointment", back_populates="doctors", cascade="all, delete-orphan"
    )
    prescriptions = db.relationship(
        "Prescription", back_populates="doctors", cascase="all, delete-orphan"
    )
    
    def __init__(self, email, password_hash=None, **kwargs):
        super().__init__(email=email, **kwards)
        if password_hash:
            self.password_hash = password_hash

    serialize_rules = ("-_password_hash", "-appointments", "-prescriptions")