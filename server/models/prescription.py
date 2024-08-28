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
        pass
    
    @validates("dosage")
    def validate_dosage(Self, _, dosage):
        pass
    
    @validates("start_date")
    def validate_start_date(self, _, start_date):
        pass
        
    @validates("end_date")
    def validate_end_date(self, _, end_date):
        pass
        
    @validates("instructions")
    def validate_instructions(self, _, instructions):
        pass
        
    @validates("patient_id")
    def validate_patient_id(self, _, patient_id):
        pass
        
    @validates("doctor_id")
    def validate_doctor_id(self, _, doctor_id):
        pass