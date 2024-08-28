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