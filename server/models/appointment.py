from models.__init__ import (
    db,
    SerializerMixin,
    validates,
    datetime,
    re,
)


class Appointment(db.Model, SerializerMixin):

    __tablename__ = "appointments"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False)
    reason = db.Column(db.String)
    status = db.Column(db.String, nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey("patients.id"), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey("doctors.id"), nullable=False)
    billing_id = db.Column(db.Integer, db.ForeignKey("billings.id"), nullable=False)
    avs_id = db.Column(db.Integer, db.ForeignKey("avss.id"), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    patient = db.relationship("Patient", back_populates="appointments")
    doctor = db.relationship("Doctor", back_populates="appointments")
    billing = db.relationship("Billing", back_populates="appointments")
    avs = db.relationship("AVS", back_populates="appointments")

    serialized_rules = ("-billing", "-avs")

    def __repr__(self):
        return f"""
            <Appointment #{self.id}:
                Date: {self.date}
                Reason: {self.reason}
                Status: {self.status}
                Patient: {self.patient}
                Doctor: {self.doctor}
                Billing: {self.billing}
                AVS: {self.avs}
            >
        """

    @validates("date")
    def validate_date(self, _, date):
        if not isinstance(date, datetime):
            raise TypeError("Date must be of type Datetime")
        return date

    @validates("reason")
    def validate_reason(Self, _, reason):
        if not isinstance(reason, str):
            raise TypeError("Reason must be a string")
        elif 6 < len(reason) < 20:
            raise ValueError("Reason must be 6-20 characters long")
        return reason

    @validates("status")
    def validate_status(self, _, status):
        if not isinstance(status, str):
            raise TypeError("Status must be a string")
        elif status not in ["scheduled", "completed", "canceled"]:
            raise ValueError(
                "Status must be one of the option: scheduled, completed, or canceled"
            )
        return status

    @validates("patient_id")
    def validate_patient_id(self, _, patient_id):
        if not isinstance(patient_id, int):
            raise TypeError("Patient_id must be of type integer")
        return patient_id

    @validates("doctor_id")
    def validate_doctor_id(self, _, doctor_id):
        if not isinstance(doctor_id, int):
            raise TypeError("Doctor_id must be of type integer")
        return doctor_id

    @validates("billing_id")
    def validate_billing_id(self, _, billing_id):
        if not isinstance(billing_id, int):
            raise TypeError("Billing_id must be of type integer")
        return billing_id

    @validates("avs_id")
    def validate_avs_id(self, _, avs_id):
        if not isinstance(avs_id, int):
            raise TypeError("Avs_id must be of type integer")
        return avs_id
