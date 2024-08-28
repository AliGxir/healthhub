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
    patient_id = db.Column(db.Integer)
    doctor_id = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    billing = db.relationship(
        "Billing", back_populates="appointments", cascade="all, delete-orphan"
    )
    avs = db.relationship(
        "AVS", back_populates="appointments", cascade="all, delete-orphan"
    )

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
