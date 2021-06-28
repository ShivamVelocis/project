require("dotenv").config(); //instatiate environment variables

let CONFIG = {}; //Make this global to use all over the application
let GLOBAL_CONFIG = require("../utils/requiredWrapper").requireF('../../configs/config')


CONFIG.MODULE_TITLE = process.env.USER_TITLE || "User Management";
CONFIG.USER = GLOBAL_CONFIG.USER || "User";
CONFIG.ADD_TITLE = "Add User";
CONFIG.UPDATE_TITLE = "Update User";
CONFIG.DELETE_TITLE = "Delete User";
CONFIG.LOGIN_TITLE = "Login User";
CONFIG.FORGET_PASSWORD_TITLE = "Forget password";
CONFIG.RESET_PASSWORD_TITLE = "Reset Password";
CONFIG.INSERT_MESSAGE = "User Inserted Successfully";
CONFIG.UPDATE_MESSAGE = "User Updated Successfully";
CONFIG.DELETE_MESSAGE = "User Deleted Successfully";
CONFIG.NO_RECORDS = "No Record(s) Found";
CONFIG.FORGET_PASSWORD_LINK_EXPIRATED = "Link expired";
CONFIG.INVALID_OTP = "Invalid OTP"
CONFIG.CHANGE_PASSWORD_ERROR ="Some error encounter during data fetching"
CONFIG.CHANGE_PASSWORD_SUCCESS = "Your password update with new password"

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
CONFIG.INVALID_USER_NAME = "Invalid username";
CONFIG.EMAIL_ALREADY_EXIST = "Email already in use"
CONFIG.USERNAME_ALREADY_EXIST = "Username already in use"

CONFIG.LIMIT = 5;

CONFIG.TEXTAREA_PATTERN = GLOBAL_CONFIG.TEXTAREA_PATTERN ||/^[ A-Za-z0-9_.\/'"@\$#\*\-!,<>&;]*$/;
CONFIG.TITLE_PATTERN = GLOBAL_CONFIG.TITLE_PATTERN ||/^[ A-Za-z0-9_.\/,\?]*$/;
CONFIG.PASSWORD_PATTERN = GLOBAL_CONFIG.PASSWORD_PATTERN || /^[ A-Za-z0-9_.\/,<>]*$/;
CONFIG.EMAIL_PATTERN =GLOBAL_CONFIG.EMAIL_PATTERN ||  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

module.exports = CONFIG;
