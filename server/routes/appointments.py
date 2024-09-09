from flask import session, request
from flask_restful import Resource
from models.appointment import Appointment
from models.billing import Billing
from models.avs import AVS
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

# def post(self):
#         try: 
#             data = request.json
#             new_appointment = appointment_schema.load(data)
#             db.session.add(new_appointment)
#             db.session.commit()

#             serialized_appointment = appointment_schema.dump(new_appointment)
#             return serialized_appointment, 201
#         except Exception as e:
#             db.session.rollback()
#             return ({"error": str(e)}, 422)    
        
    # def post(self):
    #     try: 
    #         data = request.json
    #         new_billing = Billing(
    #             appointment_id=data.get("appointment_id"),
    #             amount_due=data.get("amount_due", 0.0), 
    #             payment_status=data.get("payment_status", "pending"), 
    #             billing_date=data.get("billing_date") 
    #         )
    #         db.session.add(new_billing)
    #         db.session.flush()  # This will populate new_billing.id with the generated ID

    #         new_avs = AVS(
    #             appointment_id=data.get("appointment_id"),
    #             record_date=data.get("record_date"),
    #             diagnosis=data.get("diagnosis"),
    #             treatment=data.get("treatment"),
    #             notes=data.get("avs_notes", "")  
    #         )
    #         db.session.add(new_avs)
    #         db.session.flush()  # Populate new_avs.id with the generated ID

    #         data['billing_id'] = new_billing.id
    #         data['avs_id'] = new_avs.id

    #         new_appointment = appointment_schema.load(data)
    #         db.session.add(new_appointment)
    #         db.session.commit()

    #         serialized_appointment = appointment_schema.dump(new_appointment)
    #         return serialized_appointment, 201

    #     except Exception as e:
    #         db.session.rollback()
    #         return ({"error": str(e)}, 422)
    def post(self):
        try: 
            data = request.json
            
            # Create the appointment first without billing and AVS information
            new_appointment = appointment_schema.load(data, partial=True)  # Load partial data, allowing missing billing_id and avs_id
            db.session.add(new_appointment)
            db.session.flush()  # This will populate new_appointment.id with the generated ID

            # Create the Billing and AVS using the new appointment's ID
            new_billing = Billing(
                appointment_id=new_appointment.id,  # Use the generated appointment ID
                amount_due=data.get("amount_due", 0.0), 
                payment_status=data.get("payment_status", "pending"), 
                billing_date=data.get("billing_date")
            )
            db.session.add(new_billing)
            db.session.flush()  # Populate new_billing.id with the generated ID

            new_avs = AVS(
                appointment_id=new_appointment.id,  # Use the generated appointment ID
                status=data.get("status", "pending"),
                notes=data.get("avs_notes", "")
            )
            db.session.add(new_avs)
            db.session.flush()  # Populate new_avs.id with the generated ID

            # Update appointment with the generated billing_id and avs_id
            new_appointment.billing_id = new_billing.id
            new_appointment.avs_id = new_avs.id

            db.session.commit()  # Commit all changes at once

            serialized_appointment = appointment_schema.dump(new_appointment)
            return serialized_appointment, 201

        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 422

