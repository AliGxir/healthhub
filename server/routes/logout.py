from flask import session, request
from flask_restful import Resource

class Logout(Resource):
    def delete(self):
        if session.get("patient_id"):
            del session["patient_id"]
            return {}, 204
        elif session.get("doctor_id"):
            del session["doctor_id"]
            return {}, 204
        return {'error': "Unauthorized"}, 401
