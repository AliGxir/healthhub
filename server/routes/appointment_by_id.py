from flask_restful import Resource
from models.appointment import Appointment
from schemas.appointment_schema import AppointmentSchema
from flask import request
from config import db


appointment_schema = AppointmentSchema(session=db.session)


class AppointmentById(Resource):
    def get(self, id):
        try:
            if appointment := db.session.get(Appointment, id):
                appointment_schema = AppointmentSchema()
                return appointment_schema.dump(appointment), 200
            return {"error": "Could not find that appointment"}, 404
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400

    def patch(self, id):
        if appointment := db.session.get(Appointment, id):
            try:
                data = request.json
                appointment_schema.validate(data)
                updated_appointment = appointment_schema.load(
                    data, instance=appointment, partial=True
                )
                db.session.commit()
                return appointment_schema.dump(updated_appointment), 200
            except Exception as e:
                db.session.rollback()
                return {"error": str(e)}, 400
        return {"error": "Appointment not found"}, 404

    def delete(self, id):
        if appointment := db.session.get(Appointment, id):
            try:
                db.session.delete(appointment)
                db.session.commit()
                return {"message": f"Appointment #{id} has been deleted"}, 200
            except Exception as e:
                db.session.rollback()
                return {"error": str(e)}, 400
        return {"error": "Could not find appointment"}, 404
