from models.__init__ import (
    db,
    SerializerMixin,
    hybrid_property,
    association_proxy,
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
        "Prescription", back_populates="doctors", cascade="all, delete-orphan"
    )
    avss = association_proxy("appointments", "avs")

    def __repr__(self):
        return f"""
            <Patient #{self.id}:
                First Name: {self.first_name}
                Last Name: {self.last_name}
                Specialty: {self.specialty}
                Phone number: {self.phone_number}
                Email: {self.email}
            >
        """

    def __init__(self, email, password_hash=None, **kwargs):
        super().__init__(email=email, **kwargs)
        if password_hash:
            self.password_hash = password_hash

    serialize_rules = ("-_password_hash", "-appointments", "-prescriptions")

    @hybrid_property
    def password_hash(self):
        raise AttributeError("Passwords are private")

    @password_hash.setter
    def password_hash(self, new_pw):
        if not isinstance(new_pw, str):
            raise TypeError("Passwords must be a string")
        elif len(new_pw) < 8:
            raise ValueError("Passwords must be at least 8 characters")
        hashed_pw = flask_bcrypt.generate_password_hash(new_pw).decode("utf-8")
        self._password_hash = hashed_pw

    def authenticate(self, pw_to_check):
        return flask_bcrypt.check_password_hash(self._password_hash, pw_to_check)

    @validates("first_name", "last_name")
    def validate_name(self, _, name):
        if not isinstance(name, str):
            raise TypeError("Names must be strings")
        elif len(name) > 50:
            raise ValueError("Names must be less than 50 characters long")
        return name

    @validates("email")
    def validate_email(self, _, email):
        if not isinstance(email, str):
            raise TypeError("Email must be a string")
        elif not re.match(r"^[\w\.-]+@([\w]+\.)+[\w-]{2,}$", email):
            raise ValueError("Email must be in a proper format")
        return email

    @validates("specialty")
    def validate_specialty(self, _, specialty):
        specialties_list = [
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
            "intensive care medicine",
        ]
        if specialty not in specialties_list:
            raise ValueError("Specialty must be one of the specialty in list")
        elif not isinstance(specialty, str) or not specialty:
            raise TypeError("Specialty must be a string and not empty")
        return specialty

    @validates("phone_number")
    def validate_phone_number(self, _, phone_number):
        if not isinstance(phone_number, str):
            raise TypeError("Phone number must be a string")
        elif not re.match(r"^\(\d{3}\) \d{3}-\d{4}$", phone_number):
            raise ValueError("Phone number must be in a proper format")
        return phone_number
