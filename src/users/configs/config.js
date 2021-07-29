require("dotenv").config(); //instatiate environment variables

let CONFIG = {}; //Make this global to use all over the application
let GLOBAL_CONFIG = require("../utils/requiredWrapper").requireF('../../configs/config')//condition file import


CONFIG.MODULE_TITLE = process.env.USER_TITLE || "User Management";
CONFIG.USER = GLOBAL_CONFIG.USER || "User";
CONFIG.ADD_TITLE = "Add User";
CONFIG.UPDATE_TITLE = "Update User";
CONFIG.DELETE_TITLE = "Delete User";
CONFIG.LOGIN_TITLE = "User login";
CONFIG.USER_LIST_TITLE = "Users List";
CONFIG.UPLOAD_PICTURE_TITLE = "Upload Profile Picture"
CONFIG.FORGET_PASSWORD_TITLE = "Forget password";
CONFIG.RESET_PASSWORD_TITLE = "Reset Password";
CONFIG.INSERT_MESSAGE = "User Inserted Successfully";
CONFIG.UPDATE_MESSAGE = "User Updated Successfully";
CONFIG.DELETE_MESSAGE = "User Deleted Successfully";
CONFIG.PROFILE_PICTURE_SUCCESS = "Profile picture updated successfully"
CONFIG.NO_RECORDS = "No Record(s) Found";
CONFIG.CHANGE_PASSWORD_ERROR ="Enter current valid password"
CONFIG.CHANGE_PASSWORD_SUCCESS = "Your password update with new password"

// Validaton messages
CONFIG.LOGIN_FAIL_MESSAGE = "Invalid Username or Password";
CONFIG.LOGIN_SUCCESS_MESSAGE = "Logged in success";
// CONFIG.OTP_SUCCESS = "Check your inbox for the next steps. If you don't receive an email, and it's not in your spam folder this could mean you signed up with a different address.";
CONFIG.OTP_SUCCESS = "OTP successfully send"
CONFIG.NOT_REGISTER_USER = "Not a registered user";
CONFIG.PASSWORD_SUCCESS_CHANGE = "Password changed successfully";
CONFIG.FORGET_PASSWORD_LINK_EXPIRATED = "Link expired";
CONFIG.EMPTY_OTP = "OTP must not be empty"
CONFIG.INVALID_OTP = "OTP must be 4 digits long nuber"
CONFIG.WRONG_OTP = "Please use valid OTP"
CONFIG.INVALID_NAME = "Please enter valid name";
CONFIG.INVALID_EMAIL = "Please enter valid email";
CONFIG.INVALID_ROLE = "Please enter valid role";
CONFIG.INVALID_STATUS = "Please enter valid status";
CONFIG.INSERT_USER_NAME = "Please enter valid username";
CONFIG.INVALID_PASSWORD = "Please enter valid password";
CONFIG.INVALID_MONGO_ID = "Please enter valid Mongodb ID";
CONFIG.INVALID_USER_NAME = "Please enter valid username";
CONFIG.EMAIL_ALREADY_EXIST = "Email already in use"
CONFIG.USERNAME_ALREADY_EXIST = "Username already in use"
CONFIG.TOO_LARGE_IMAGE = "Image should be smaller than 2mb"
CONFIG.EMPTY_USER_NAME = "Username should not be empty";
CONFIG.INVALID_NEW_PASSWORD = "Please enter valid new password";
CONFIG.EMPTY_PASSWORD ="Password should not be empty"
CONFIG.EMPTY_NEW_PASSWORD ="New password should not be empty"
CONFIG.INVALID_CONFIRM_PASSWORD = "Please enter valid confirm password";
CONFIG.EMPTY_CONFIRM_PASSWORD ="New password should not be empty"
CONFIG.NEW_CONFIRM_ERROR ="New password and confirm password should be same"

CONFIG.LIMIT = 5;

//Regex Patterns
CONFIG.TEXTAREA_PATTERN = GLOBAL_CONFIG.TEXTAREA_PATTERN ||/^[ A-Za-z0-9_.\/'"@\$#\*\-!,<>&;]*$/;
CONFIG.TITLE_PATTERN = GLOBAL_CONFIG.TITLE_PATTERN ||/^[ A-Za-z0-9_.\/,\?]*$/;
CONFIG.PASSWORD_PATTERN = GLOBAL_CONFIG.PASSWORD_PATTERN || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/;
CONFIG.EMAIL_PATTERN =GLOBAL_CONFIG.EMAIL_PATTERN ||  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

module.exports = CONFIG;
