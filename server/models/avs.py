from models.__init__ import db, validates, association_proxy, date


class AVS(db.Model):

    __tablename__ = "avss"

    id = db.Column(db.Integer, primary_key=True)
    record_date = db.Column(db.Date, nullable=False)
    notes = db.Column(db.Text)
    diagnosis = db.Column(db.String)
    treatment = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    appointments = db.relationship(
        "Appointment", back_populates="avs", cascade="all, delete-orphan"
    )
    patient_id = association_proxy("appointments", "patient_id")
    doctor_id = association_proxy("appointments", "doctor_id")

    def __repr__(self):
        return f"""
            <AVS #{self.id}:
                Record Date: {self.record_date}
                Notes: {self.notes}
                Diagnosis: {self.diagnosis}
                Treatment: {self.treatment}
                Patient: {self.patient}
                Doctor: {self.doctor}
            >
        """

    @validates("record_date")
    def validate_record_date(self, _, record_date):
        if not isinstance(record_date, date):
            raise TypeError("Record date must be of type date")
        return record_date

    @validates("notes")
    def validate_notes(Self, _, notes):
        if not isinstance(notes, str):
            raise TypeError("Notes must be of type string")
        if len(notes) < 5:
            raise ValueError("Notes must be greater than 5 characters")
        return notes

    @validates("diagnosis")
    def validate_diagnosis(self, _, diagnosis):
        if not isinstance(diagnosis, str):
            raise TypeError("Diagnosis must be of type string")
        if len(diagnosis) < 5:
            raise ValueError("Diagnosis must be greater than 5 characters")
        return diagnosis

    @validates("treatment")
    def validate_treatment(self, _, treatment):
        if not isinstance(treatment, str):
            raise TypeError("Treatment must be of type string")
        if len(treatment) < 5:
            raise ValueError("Treatment must be greater than 5 characters")
        return treatment
