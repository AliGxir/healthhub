from models.__init__ import (
    db,
    SerializerMixin,
    hybrid_property,
    flask_bcrypt,
    validates,
    re,
)


class AVS(db.Model, SerializerMixin):

    __tablename__ = "avss"