# HealthHub

This is an full stack application for a healthcare to store medical records that can be accessed by both doctors and patients using the same portal. Appointments can be scheduled by patients and modified by both types of user.


## Intro to Project

- This project was made to complete the assignment `Phase 5 Project` for the `SE-West-060324` class for the [Flatiron](https://flatironschool.com/) Software Engineering Boot Camp.
- The Flask-React application was completed using the following: React (using Vite) for the front-end and Flask-SQLAlchemy for the back-end. 


## Dependencies

- The following is needed to run this application: `React`, `React Router`, `react-router-dom`, `Flask`, `SQLAlchemy`, `Semantic UI`, `Marshmallow`, `Bcrypt`,`Yup`,  `Formik`, `Semantic UI`, and `react-hot-toast`.

- You must have access to these dependencies in the directory that you are running this application in. If your environment does not already have these requirements, you may install them by going to websites and following the installation instructions:

- [Node.JS](https://www.npmjs.com/package/node)

- [React Router DOM](https://www.npmjs.com/package/react-router-dom)

- [React Router](https://www.npmjs.com/package/react-router)

- [Yup](https://www.npmjs.com/package/yup)

- [React Hot Toast](https://www.npmjs.com/package/react-hot-toast)

- [Semantic UI](https://www.npmjs.com/package/semantic-ui)

- [Formik](https://www.npmjs.com/package/formik)

- [Flask](https://pypi.org/project/Flask/)

- [Bcrypt](https://www.npmjs.com/package/bcrypt)

- [SQLAlchemy](https://pypi.org/project/SQLAlchemy/)

- [Marshmallow](https://pypi.org/project/marshmallow/)



- Note: delete package-lock.json and install your own dependencies!!!


## Starting the Application

- Fork and clone this repo, and open in your favorite code editor.
- Run `npm install` and `npm shell` to install necessary packages in the client folder.
- Run  `pipenv install` and `pipenv shell` to install necessary packages in the server folder. 
- Make sure nothing is currently running on `http://localhost:5173/` (client) and `http://127.0.0.1:5555` (server).
- Run python server/app.py to run the Flask application

- next, you will need to create a .env and add the following: 

```console
PIPENV_IGNORE_VIRTUALENVS = 1
FLASK_APP=app.py
FLASK_RUN_PORT=5555
APP_SECRET="SEE NOTE BELOW"
```
Note: 
- In your terminal, run `python -c 'import secrets; print(secrets.token_hex())’` to generate your own session secret key.
- Copy the result into the .env file as the value for the secret key.
- MAKE SURE TO ADD .env TO YOUR .gitignore.

DATABASE
- cd server
- then run the follow commands:
```console
flask db init
flask db upgrade
python seed.py (this will seed the database)
```

## Using the Application

All users can: 
- log in, and log out of account
- look at their appointments and filter by date
- update their appointments

Patients can:
- sign up
- see all their doctors
- schedule an new appointment

Doctors can:
- see all their patients

## Contributor
Alicia Yu    
[Github](https://github.com/AliGxir)  
[LinkedIn](https://www.linkedin.com/in/alicia-yu-2310196b/)  
[Medium](https://medium.com/@aliciayu22)

## Acknowledgement
Special thanks to Flatiron School for providing the learning environment and resources that contributed to the development of this project.

# Future roadmap

- enhance styling
- update appointments, prescriptions, and AVSs for doctors
- include payment method for billings
- better calender for scheduling appointments with available time slots
- third party authentication
- email notification upon signup
- chat/AI chatbot 


## License

- This project is is made in conjunction with the standard `MIT` license provided by `GitHub` upon creation of a new repository. A copy of the license is included with this project in a file named: `LICENSE`.