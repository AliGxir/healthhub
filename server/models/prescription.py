from models.__init__ import (
    db,
    SerializerMixin,
    validates,
    re,
)


class Prescription(db.Model, SerializerMixin):

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