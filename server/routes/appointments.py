from flask_restful import Resource
from models.appointment import Appointment
from schemas.appointment_schema import AppointmentSchema
from config import db

appointments_schema = AppointmentSchema(many=True, session=db.session)


class Appointments(Resource):
    def get(self):
        appointments = appointments_schema.dump(Appointment.query)
        return appointments, 200
