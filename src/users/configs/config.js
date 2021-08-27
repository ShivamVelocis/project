require("dotenv").config(); //instatiate environment variables

let CONFIG = {}; //Make this global to use all over the application
let GLOBAL_CONFIG = require("../utils/requiredWrapper").requireF(
  "../../configs/config"
); //condition file import

//-----------------User success message---------------
CONFIG.INSERT_MESSAGE = "User Inserted Successfully";
CONFIG.UPDATE_MESSAGE = "User Updated Successfully";
CONFIG.DELETE_MESSAGE = "User Deleted Successfully";
CONFIG.USER_ADD_SUCCESS = "User added successfully";
CONFIG.USER_UPDATE_SUCCESS = "User data updated";
CONFIG.PROFILE_PICTURE_SUCCESS = "Profile picture updated successfully";
CONFIG.CHANGE_PASSWORD_SUCCESS = "Your password update with new password";
CONFIG.USER_USER_DATA = "User data";
CONFIG.USER_REMOVE_SUCCESS = "User removed";
CONFIG.USER_IMAGE_UPLOADED = "Image uploaded";
CONFIG.OTP_SUCCESS = "OTP successfully send";
CONFIG.PASSWORD_SUCCESS_CHANGE = "Password changed successfully";
CONFIG.LOGIN_SUCCESS_MESSAGE = "Logged in success";

//--------------------Error messages--------------------
CONFIG.NO_RECORDS = "No Record(s) Found";
CONFIG.NO_DATA_FOUND = "No data found";
CONFIG.CHANGE_PASSWORD_ERROR = "Incorrect current password";
CONFIG.NO_FILE_SELECTED = "No file selected";
CONFIG.NOT_REGISTER_USER = "Not a registered user";
CONFIG.FORGET_PASSWORD_LINK_EXPIRATED = "Link expired";
CONFIG.EMAIL_ALREADY_EXIST = "Email already in use";
CONFIG.USERNAME_ALREADY_EXIST = "Username already in use";
CONFIG.LOGIN_FAIL_MESSAGE = "Invalid Username or Password";

// CONFIG.OTP_SUCCESS = "Check your inbox for the next steps. If you don't receive an email, and it's not in your spam folder this could mean you signed up with a different address.";

//---------------------Validaton messages-----------------

//-----------------------Invalid fields-------------------
CONFIG.INVALID_OTP = "OTP must be 4 digits long nuber";
CONFIG.CHARACTER_ONLY = "Allow characters only";
CONFIG.WRONG_OTP = "Please use valid OTP";
CONFIG.INVALID_NAME = "Please enter valid name";
CONFIG.INVALID_EMAIL = "Please enter valid email";
CONFIG.INVALID_ROLE = "Please enter valid role";
CONFIG.INVALID_STATUS = "Please enter valid status";
CONFIG.INSERT_USER_NAME = "Please enter valid username";
CONFIG.INVALID_PASSWORD = "Current password required";
CONFIG.INVALID_MONGO_ID = "Please enter valid Mongodb ID";
CONFIG.INVALID_USER_NAME = "Please enter valid username";
CONFIG.INVALID_NEW_PASSWORD = "Please enter valid new password";
CONFIG.INVALID_CONFIRM_PASSWORD = "Please enter valid confirm password";
CONFIG.INVALID_USER_ID = "Invalid user ID";
CONFIG.INVALID_MONGODB_ID = "Invalid mongodb ID";
CONFIG.EMPTY_OTP = "OTP must not be empty";
CONFIG.TOO_LARGE_IMAGE = "Image should be smaller than 2mb";
CONFIG.NEW_CONFIRM_ERROR = "New password and confirm password should be same";
CONFIG.INVALID_USER_STATUS = "Status should be 1 oer 0";

//----------------------------Empty fields---------------------------
// CONFIG.EMPTY_CONFIRM_PASSWORD = "New password should not be empty";
CONFIG.EMPTY_USER_NAME = "Username should not be empty";
CONFIG.EMPTY_PASSWORD = "Password should not be empty";
CONFIG.EMPTY_NEW_PASSWORD = "New password should not be empty";
CONFIG.EMPTY_CURRENT_PASSWORD = "Current password should not be empty";
CONFIG.EMPTY_CONFIRM_PASSWORD = "Confirm password should not be empty";
CONFIG.EMPTY_ID = "id is required";
//-----------------------------Regex Patterns-------------------------
CONFIG.TEXTAREA_PATTERN = /^[ A-Za-z0-9_.\/'"@\$#\*\-!,<>&;]*$/;
CONFIG.TITLE_PATTERN = /^[ A-Za-z0-9_.\/,\?]*$/;
CONFIG.PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/;
CONFIG.EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
CONFIG.NUMBERONLYREGEX = /^[ 0-9]*$/;
CONFIG.CHARONLYREGEX = /^[ A-Za-z]*$/;
CONFIG.ALPHANUMERICONLYREGEX = /^[ A-Za-z0-9]*$/;
CONFIG.TEXTFIELDREGEX = /^[ A-Za-z0-9_.\/,]*$/;
CONFIG.TEXTAREAREGEX = /^[ A-Za-z0-9_.\/,<>]*$/;
CONFIG.EMAILREGEX = /^[\-0-9a-zA-Z\.\+_]+@[\-0-9a-zA-Z\.\+_]+\.[a-zA-Z]{2,}$/;

CONFIG.LIMIT = 5;

module.exports = CONFIG;
