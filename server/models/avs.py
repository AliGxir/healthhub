from models.__init__ import (
    db,
    SerializerMixin,
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