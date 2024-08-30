from flask_restful import Resource
from models.avs import AVS
from schemas.avs_schema import AVSSchema
from config import db

avs_schema = AVSSchema(many=True, session=db.session)


class AVSs(Resource):
    def get(self):
        avss = avs_schema.dump(AVS.query)
        return avss, 200
