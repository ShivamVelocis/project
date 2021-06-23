require("dotenv").config(); //instatiate environment variables

let CONFIG = {}; //Make this global to use all over the application

CONFIG.NOT_AUTHORIZED = "Not authorized to access this resource";
CONFIG.TEXTAREA_PATTERN = /^[ A-Za-z0-9_.\/,<>&;]*$/;
CONFIG.TITLE_PATTERN = /^[ A-Za-z0-9_.\/,]*$/;
CONFIG.PASSWORD_PATTERN = /^[ A-Za-z0-9_.\/,<>]*$/;
CONFIG.EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

CONFIG.INVALID_NAME = "Please enter valid name";
CONFIG.INVALID_EMAIL = "Please enter valid email";
CONFIG.INVALID_ROLE = "Please enter valid role";
CONFIG.INVALID_STATUS = "Please enter valid status";
CONFIG.INVALID_USER_NAME = "Already used";
CONFIG.INVALID_PASSWORD = "Please enter valid password";
CONFIG.INVALID_MONGO_ID = "Please enter valid Mongodb ID";

module.exports = CONFIG;
