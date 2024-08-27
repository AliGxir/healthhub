# Remote library imports
from flask import request, make_response, session, redirect
from flask_restful import Resource
import os
from datetime import datetime
from functools import wraps


BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.environ.get("DB_URI", f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}")

# Local imports
from config import app, db, api
from models.patient import Patient
from models.doctor import Doctor
from models.prescription import Prescription
from models.appointment import Appointment
from models.billing import Billing
from models.avs import AVS

