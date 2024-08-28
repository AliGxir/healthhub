from models.__init__ import (
    db,
    SerializerMixin,
    hybrid_property,
    flask_bcrypt,
    validates,
    re,
)


class Billing(db.Model, SerializerMixin):

    __tablename__ = "billings"