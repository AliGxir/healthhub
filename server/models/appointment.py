from models.__init__ import (
    db,
    SerializerMixin,
    validates,
    re,
)


class Appointment(db.Model, SerializerMixin):

    __tablename__ = "appointments"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False)
    reason = db.Column(db.String)
    status = db.Column(db.String, nullable=False)
    patient_id = db.Column(db.Integer, ForeignKey("patients.id"), nullable=False)
    doctor_id = db.Column(db.Integer, ForeignKey("doctors.id"), nullable=False)
    billing_id = db.Column(db.Integer, ForeignKey("billings.id"), nullable=False)
    avs_id = db.Column(db.Integer, ForeignKey("avss.id"), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    patient = db.relationship("Patient", back_populates="appointments")
    doctor = db.relationship("Doctor", back_populates="appointments")
    billing = db.relationship("Billing", back_populates="appointments", cascade="all, delete-orphan")
    avs = db.relationship("AVS", back_populates="appointments", cascade="all, delete-orphan")

    def __repr__(self):
        return f"""
            <Appointment #{self.id}:
                Date: {self.date}
                Reason: {self.reason}
                Status: {self.status}
                Patient ID: {self.patient_id}
                Doctor ID: {self.doctor_id}
            >
        """

    serialized_rules = ("-billing", "-avs")
