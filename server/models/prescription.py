from models.__init__ import (
    db,
    SerializerMixin,
    validates,
    re,
)


class Prescription(db.Model, SerializerMixin):

    __tablename__ = "prescriptions"
    
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())