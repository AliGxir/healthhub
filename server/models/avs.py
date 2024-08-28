from models.__init__ import (
    db,
    SerializerMixin,
    association_proxy,
    validates,
    re,
)


class AVS(db.Model, SerializerMixin):

    __tablename__ = "avss"
    
    id = db.Column(db.Integer, primary_key=True)
    record_date = db.Column(db.DateTime, nullable=False)
    notes = db.Column(db.Text)
    diagnosis = db.Column(db.String)
    treatment = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    
    appointments = db.relationship("Appointment", back_populates="avss")
    patient = association_proxy("appointments", "avs")
    doctor = association_proxy("appointments", "avs")
    
    serialize_rules = ("-appointments",)
    
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
        pass
    
    @validates("notes")
    def validate_notes(Self, _, notes):
        pass
    
    @validates("diagnosis")
    def validate_diagnosis(self, _, diagnosis):
        pass
        
    @validates("treatment")
    def validate_treatment(self, _,treatment):
        pass