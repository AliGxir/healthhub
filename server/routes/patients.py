# class Patients(Resource):
#     def get(self):
#         try:
#             serialized_patients = [
#                 patient.to_dict(
#                     rules=("-_password_hash", "-appointments", "-prescriptions")
#                 )
#                 for patient in Patient.query
#             ]
#             return make_response(serialized_patients, 200)
#         except Exception as e:
#             return make_response({"error": str(e)}, 400)