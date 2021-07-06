# The Wall App - Backend
This project is a REST API created with NODE.JS and Express.js to be used by [The Wall App Frontend](https://github.com/Ronan-Fernandes/the_wall_app_frontend)

The frontend is hosted on Heroku: https://the-wall-app-frontend.herokuapp.com

The backend is hosted on heroku: https://the-wall-app-backend.herokuapp.com

## Installation
Make sure you have MangoDB and NODE.JS installed first.
Clone the project and install it's dependencies.

```bash
git clone git@github.com:Ronan-Fernandes/the_wall_app_backend.git  
# or
git clone https://github.com/Ronan-Fernandes/the_wall_app_backend.git

cd the_wall_app_backend

npm install

sudo service mongod start # to run the mongoDB service
```

Create a .env file in the project root folder and configure the environment variables.
```bash
MONGO_URL=mongodb://localhost:27017
DB_NAME=the_wall_app
PORT=3333
EMAIL=
EMAIL_PASSWORD=
SECRET_KEY=your_secret_key
```

A gmail account was created just to send the welcome email for new users.

The gmail login and password for the environment variables was sent in the project's delivery email along with the production app links and repos.

## usage
Once the variables are ready and mongoDB service are running you can start the app.
To run the app:
```bash
npm start
```

## Tests
The tests was coded with Jest and supertest.
To run the tests:
```bash
npm test
```

## improvements to do
- [ ] Improve test coverage with more test cases
- [ ] New features like edit user, change password and delete user
