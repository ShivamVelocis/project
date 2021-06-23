require("dotenv").config(); //instatiate environment variables

let CONFIG = {}; //Make this global to use all over the application

CONFIG.MODULE_TITLE = process.env.USER_TITLE || "User Management";
CONFIG.USER = "User";
CONFIG.ADD_TITLE = "Add User";
CONFIG.UPDATE_TITLE = "Update User";
CONFIG.DELETE_TITLE = "Delete User";
CONFIG.INSERT_MESSAGE = "User Inserted Successfully";
CONFIG.UPDATE_MESSAGE = "User Updated Successfully";
CONFIG.DELETE_MESSAGE = "User Deleted Successfully";
CONFIG.NO_RECORDS = "No Record(s) Found";

CONFIG.LOGIN_FAIL_MESSAGE = "Invalid Username or Password";
CONFIG.LOGIN_SUCCESS_MESSAGE = "Logged in success";
CONFIG.OTP_SUCCESS = "OTP send to your registered email address";
CONFIG.NOT_REGISTER_USER = "Not a registered user";
CONFIG.PASSWORD_SUCCESS_CHANGE = "Password changed successfully"
CONFIG.INVALID_NAME = "Please enter valid name";
CONFIG.INVALID_EMAIL = "Please enter valid email";
CONFIG.INVALID_ROLE = "Please enter valid role";
CONFIG.INVALID_STATUS = "Please enter valid status";
CONFIG.ALREADY_USED_USER_NAME = "Already used";
CONFIG.INSERT_USER_NAME = "Invalid username";
CONFIG.INVALID_PASSWORD = "Please enter valid password";
CONFIG.INVALID_MONGO_ID = "Please enter valid Mongodb ID";

CONFIG.LIMIT = 5;

CONFIG.TEXTAREA_PATTERN = /^[ A-Za-z0-9_.\/,<>]*$/;
CONFIG.TITLE_PATTERN = /^[ A-Za-z0-9_.\/,]*$/;
CONFIG.PASSWORD_PATTERN = /^[ A-Za-z0-9_.\/,<>]*$/;
CONFIG.EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

module.exports = CONFIG;
