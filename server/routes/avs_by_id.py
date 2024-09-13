from flask_restful import Resource
from models.avs import AVS
from schemas.avs_schema import AVSSchema
from config import db

avs_schema = AVSSchema(session=db.session)


class AVSById(Resource):
    def get(self, id):
        try:
            if avs := db.session.get(AVS, id):
                avs_schema = AVSSchema()
                return avs_schema.dump(avs), 200
            return {"error": "Could not find that avs"}, 404
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400        
