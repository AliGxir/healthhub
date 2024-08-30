from models.__init__ import (
    db,
    validates,
    datetime,
    date,
    re,
)


class Billing(db.Model):

    __tablename__ = "billings"

    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer)
    amount_due = db.Column(db.Float, nullable=False)
    payment_status = db.Column(db.String, nullable=False)
    billing_date = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    appointments = db.relationship(
        "Appointment", back_populates="billing", cascade="all, delete-orphan"
    )

    # serialized_rules = ("-appointments",)

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
        if not isinstance(appointment_id, int):
            raise TypeError("Appointment_id must be of type integer")
        return appointment_id

    @validates("amount_due")
    def validate_amount_due(Self, _, amount_due):
        if not isinstance(amount_due, float):
            raise TypeError("Amount due must be of type float")
        elif amount_due <= 0:
            raise ValueError("Amount due must be greater than zero")
        elif round(amount_due, 2) != amount_due:
            raise ValueError("Amount due must not have more than two decimal places.")
        return amount_due

    @validates("payment_status")
    def validate_payment_status(self, _, payment_status):
        if not isinstance(payment_status, str):
            raise TypeError("Payment status must be a string")
        elif payment_status not in ["unpaid", "paid", "pending"]:
            raise ValueError(
                "Status must be one of the option: unpaid, paid, or pending"
            )
        return payment_status

    @validates("billing_date")
    def validate_billing_date(self, _, billing_date):
        if not isinstance(billing_date, date):
            raise TypeError("Billing date date must be of type date")
        return billing_date
