from models.__init__ import db, validates, datetime
from models.patient import Patient
from models.doctor import Doctor


class Appointment(db.Model):

    __tablename__ = "appointments"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False)
    reason = db.Column(db.String)
    status = db.Column(db.String, nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey("patients.id"), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey("doctors.id"), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    patient = db.relationship("Patient", back_populates="appointments")
    doctor = db.relationship("Doctor", back_populates="appointments")
    billing = db.relationship(
        "Billing", back_populates="appointment", cascade="all, delete-orphan"
    )
    avs = db.relationship(
        "AVS", back_populates="appointment", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"""
            <Appointment #{self.id}:
                Date: {self.date}
                Reason: {self.reason}
                Status: {self.status}
                Patient: {self.patient.id}
                Doctor: {self.doctor.id}
                Billing: {self.billing.id}
                AVS: {self.avs.id}
            >
        """

    @validates("date")
    def validate_date(self, _, date):
        if not isinstance(date, datetime):
            raise TypeError("Date must be of type Datetime")
        return date

    @validates("reason")
    def validate_reason(self, _, reason):
        if not isinstance(reason, str):
            raise TypeError("Reason must be a string")
        elif not 6 <= len(reason) <= 50:
            raise ValueError("Reason must be 6-50 characters long")
        return reason

    @validates("status")
    def validate_status(self, _, status):
        if not isinstance(status, str):
            raise TypeError("Status must be a string")
        elif status not in ["scheduled", "completed", "canceled"]:
            raise ValueError(
                "Status must be one of the options: scheduled, completed, or canceled"
            )
        return status

    @validates("patient_id")
    def validate_patient_id(self, _, patient_id):
        if not isinstance(patient_id, int):
            raise TypeError("Patient_id must be of type integer")
        if not db.session.query(
            Patient.query.filter_by(id=patient_id).exists()
        ).scalar():
            raise ValueError("Patient_id does not exist")
        return patient_id

    @validates("doctor_id")
    def validate_doctor_id(self, _, doctor_id):
        if not isinstance(doctor_id, int):
            raise TypeError("Doctor_id must be of type integer")
        if not db.session.query(Doctor.query.filter_by(id=doctor_id).exists()).scalar():
            raise ValueError("Doctor_id does not exist")
        return doctor_id
