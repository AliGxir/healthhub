from flask import session, request
from flask_restful import Resource
from models.appointment import Appointment
from schemas.appointment_schema import AppointmentSchema
from config import db

appointments_schema = AppointmentSchema(many=True, session=db.session)
appointment_schema = AppointmentSchema(session=db.session)


class Appointments(Resource):
    def get(self):
        patient_id = session.get("patient_id")
        doctor_id = session.get("doctor_id")
        
        if not patient_id and not doctor_id:
            return {"error": "User not authenticated"}, 401


        filter_type = request.args.get('filter', 'all')
        now = db.func.now()  

        query = Appointment.query
        
        if patient_id:
            query = query.filter(Appointment.patient_id == patient_id)
        elif doctor_id:
            query = query.filter(Appointment.doctor_id == doctor_id)

        if filter_type == 'past':
            query = query.filter(Appointment.date < now)
        elif filter_type == 'future':
            query = query.filter(Appointment.date >= now)

        appointments = query.all()
        serialized_appointments = appointments_schema.dump(appointments)
        return serialized_appointments, 200

    
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