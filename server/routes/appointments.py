from flask import session, request
from flask_restful import Resource
from models.appointment import Appointment
from schemas.appointment_schema import AppointmentSchema
from config import db

appointments_schema = AppointmentSchema(many=True, session=db.session)
appointment_schema = AppointmentSchema(session=db.session)


class Appointments(Resource):
    def get(self):
        appointments = appointments_schema.dump(Appointment.query)
        return appointments, 200
    
    def post(self):
        try: 
            data = request.json
            new_appointment = appointment_schema.load(data)
            db.session.add(new_appointment)
            db.session.commit()

            serialized_appointment = appointment_schema.dump(new_appointment)
            return serialized_appointment, 201
        except Exception as e:
            db.session.rollback()
            return ({"error": str(e)}, 422)