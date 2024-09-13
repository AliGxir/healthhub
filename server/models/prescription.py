from models.__init__ import db, validates, date
from models.patient import Patient
from models.doctor import Doctor


class Prescription(db.Model):

    __tablename__ = "prescriptions"

    id = db.Column(db.Integer, primary_key=True)
    medication_name = db.Column(db.String, nullable=False)
    dosage = db.Column(db.String, nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    instructions = db.Column(db.Text)
    patient_id = db.Column(db.Integer, db.ForeignKey("patients.id"), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey("doctors.id"), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    patient = db.relationship("Patient", back_populates="prescriptions")
    doctor = db.relationship("Doctor", back_populates="prescriptions")

    serialized_rules = ("-patient", "-doctor")

    def __repr__(self):
        return f"""
            <Prescription #{self.id}:
                Medication Name: {self.medication_name}
                Dosage: {self.dosage}
                Start Date: {self.start_date}
                End Date: {self.end_date}
                Instructions: {self.instructions}
                Patient: {self.patient}
                Doctor: {self.doctor}
            >
        """

    @validates("medication_name")
    def validate_medication_name(self, _, medication_name):
        if not isinstance(medication_name, str):
            raise TypeError("Medication name must be of type string")
        elif len(medication_name) < 5:
            raise ValueError("Medication name must be greater than 5 characters")
        return medication_name

    @validates("dosage")
    def validate_dosage(Self, _, dosage):
        if not isinstance(dosage, str):
            raise TypeError("Dosage must be of type string")
        if len(dosage) < 1:
            raise ValueError("Dosage must be greater than 5 characters")
        return dosage

    @validates("start_date")
    def validate_start_date(self, _, start_date):
        if not isinstance(start_date, date):
            raise TypeError("Start date must be of type date")
        return start_date

    @validates("end_date")
    def validate_end_date(self, _, end_date):
        if not isinstance(end_date, date):
            raise TypeError("End date date must be of type date")
        return end_date

    @validates("instructions")
    def validate_instructions(self, _, instructions):
        if not isinstance(instructions, str):
            raise TypeError("Instructions must be of type string")
        if len(instructions) < 5:
            raise ValueError("Instructions must be greater than 5 characters")
        return instructions

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
