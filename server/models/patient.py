from models.__init__ import (
    db,
    SerializerMixin,
    hybrid_property,
    association_proxy,
    flask_bcrypt,
    validates,
    re,
)


class Patient(db.Model, SerializerMixin):

    __tablename__ = "patients"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    gender = db.Column(db.String)
    address = db.Column(db.String)
    phone_number = db.Column(db.String)
    email = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column("password", db.String, nullable=False)
    insurance_id = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    appointments = db.relationship(
        "Appointment", back_populates="patients", cascade="all, delete-orphan"
    )
    prescriptions = db.relationship(
        "Prescription", back_populates="patient", cascase="all, delete-orphan"
    )
    billings = association_proxy("appointment", "billing")
    medical_records = association_proxy("appoinment", "medical_record")

    def __repr__(self):
        return f"""
            <Patient #{self.id}:
                First Name: {self.first_name}
                Last Name: {self.last_name}
                DOB: {self.date_of_birth}
                Gender: {self.gender}
                Address: {self.address}
                Phone number: {self.phone_number}
                Email: {self.email}
                Insurance ID: {self.insurance_id}
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

    @validates("gender")
    def validate_gender(self, _, gender):
        if not isinstance(gender, str):
            raise TypeError("Gender must be a string")
        elif not [
            "woman",
            "man",
            "cisgender",
            "transgender",
            "nonbinary",
            "genderqueer",
            "genderfluid",
            "agender",
            "unsure",
            "not listed",
            "prefer not to answer",
        ]:
            raise ValueError("please select from one of the options")
        return gender

    @validates("address")
    def validate_address(self, _, address):
        if not isinstance(address, str):
            raise TypeError("Address must be a string")
        elif len(address) > 255:
            raise ValueError("Address must be under 255 characters")
        return address

    @validates("phone_number")
    def validate_phone_number(self, _, phone_number):
        if not isinstance(phone_number, str):
            raise TypeError("Phone number must be a string")
        elif not re.match(r"^\(\d{3}\) \d{3}-\d{4}$", phone_number):
            raise ValueError("Phone number must be in a proper format")
        return phone_number

    @validates("insurance_id")
    def validate_insurance_id(self, _, insurance_id):
        if not isinstance(insurance_id, str):
            raise TypeError("Insurance ID must be a string")
        if len(insurance_id) > 12:
            raise ValueError("Insurance ID is too long")
        return insurance_id
