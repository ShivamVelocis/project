require("dotenv").config(); //instatiate environment variables

let CONFIG = {}; //Make this global to use all over the application

CONFIG.MODULE_TITLE = process.env.USER_TITLE || "User Management";
CONFIG.USER = "User";
CONFIG.ADD_TITLE = "Add User";
CONFIG.UPDATE_TITLE = "Update User";
CONFIG.DELETE_TITLE = "Delete User";
CONFIG.LOGIN_TITLE = "Login User";
CONFIG.FORGET_PASSWORD_TITLE = "Forget password";
CONFIG.RESET_PASSWORD_TITLE = "Reset Password"
CONFIG.INSERT_MESSAGE = "User Inserted Successfully";
CONFIG.UPDATE_MESSAGE = "User Updated Successfully";
CONFIG.DELETE_MESSAGE = "User Deleted Successfully";
CONFIG.NO_RECORDS = "No Record(s) Found";

CONFIG.LOGIN_FAIL_MESSAGE = "Invalid Username or Password";
CONFIG.LOGIN_SUCCESS_MESSAGE = "Logged in success";
CONFIG.OTP_SUCCESS = "OTP send to your registered email address,If you are a registered user";
CONFIG.NOT_REGISTER_USER = "Not a registered user";
CONFIG.PASSWORD_SUCCESS_CHANGE = "Password changed successfully";
CONFIG.INVALID_NAME = "Please enter valid name";
CONFIG.INVALID_EMAIL = "Please enter valid email";
CONFIG.INVALID_ROLE = "Please enter valid role";
CONFIG.INVALID_STATUS = "Please enter valid status";
CONFIG.ALREADY_USED_USER_NAME = "Already used";
CONFIG.INSERT_USER_NAME = "Invalid username";
CONFIG.INVALID_PASSWORD = "Please enter valid password";
CONFIG.INVALID_MONGO_ID = "Please enter valid Mongodb ID";
CONFIG.EMPTY_USER_NAME = "User name is empty should not be empty";
CONFIG.INVALID_USER_NAME ="Invalid username"

CONFIG.LIMIT = 5;

CONFIG.TEXTAREA_PATTERN = /^[ A-Za-z0-9_.\/,<>]*$/;
CONFIG.TITLE_PATTERN = /^[ A-Za-z0-9_.\/,]*$/;
CONFIG.PASSWORD_PATTERN = /^[ A-Za-z0-9_.\/,<>]*$/;
CONFIG.EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

module.exports = CONFIG;
