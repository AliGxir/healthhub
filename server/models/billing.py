from models.__init__ import (
    db,
    SerializerMixin,
    validates,
    re,
)


class Billing(db.Model, SerializerMixin):

    __tablename__ = "billings"
    
    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer)
    amount_due = db.Column(db.Float, nullable=False)
    payment_status = db.Column(db.String, nullable=False)
    billing_date = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    
    appointments = db.relationship("Appointment", back_populates="billing")
    
    serialized_rules = ("-appointments",)
    
    def __repr__(self):
        return f"""
            <Billing #{self.id}:
                Appointment: {self.appointments}
                Amount Due: {self.amount_due}
                Payment Status: {self.payment_status}
                Billing Date: {self.billing_date}
            >
        """
    
    @validates("appointment_id")
    def validate_appointment_id(self, _, appointment_id):
        pass
    
    @validates("amount_due")
    def validate_amount_due(Self, _, amount_due):
        pass
    
    @validates("payment_status")
    def validate_payment_status(self, _, payment_status):
        pass
        
    @validates("billing_date")
    def validate_billing_date(self, _,billing_date):
        pass