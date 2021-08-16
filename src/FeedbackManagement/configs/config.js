require('dotenv').config();//instatiate environment variables

let CONFIG = {} //Make this global to use all over the application
const PARENT_CONFIG = require("../../configs/config");

CONFIG.ADD_FEEDBACK_SUCCESSFULLY = "Feedback added successfully";
CONFIG.DELETE_FEEDBACK_SUCCESSFULLY = "Feedback deleted successfully";
CONFIG.UPDATE_FEEDBACK_SUCCESSFULLY = "Feedback updated successfully"
CONFIG.ADD_CONTENT_FAILED = "Error while adding feedback"
CONFIG.FETCH_CONTENT_FAILED = "Error while fecting feedback"
CONFIG.NO_CONTENT_FOUND = "No Record Found"
CONFIG.FETCH_CONTENT_ERROR = "Error encountered while fetching feedback"
CONFIG.DELETE_CONTENT_FAILED = "Error while deleting feedback"
CONFIG.UPDATE_CONTENT_FAILED = "Error while updating feedback"
CONFIG.EMPTY_TITLE = "Title should not be empty";
CONFIG.EMPTY_DESCRIPTION = "Description should not be empty";
CONFIG.EMPTY_STATUS = "Please select  content status";
CONFIG.INVALID_TITLE = "Please enter alphanumeric title only";
CONFIG.INVALID_DESCRIPTION = "Please enter alphanumeric description only";
CONFIG.INVALID_MONGO_ID = "Please enter valid  MongoDB ID";

CONFIG.TEXTAREA_PATTERN=PARENT_CONFIG.TEXTAREA_PATTERN || /^[ A-Za-z0-9_.\/'"@\$#\*\-!,<>&;]*$/;
CONFIG.TITLE_PATTERN=PARENT_CONFIG.TITLE_PATTERN || /^[ A-Za-z0-9_.\/,?!#@%$^]*$/;
CONFIG.PASSWORD_PATTERN=PARENT_CONFIG.PASSWORD_PATTERN || /^[ A-Za-z0-9_.\/,<>]*$/;
CONFIG.EMAIL_PATTERN=PARENT_CONFIG.EMAIL_PATTERN || /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
CONFIG.INVALID_NAME=PARENT_CONFIG.INVALID_NAME || "Please enter valid name";
CONFIG.INVALID_EMAIL=PARENT_CONFIG.INVALID_EMAIL || "Please enter valid email";
CONFIG.INVALID_ROLE=PARENT_CONFIG.INVALID_ROLE || "Please enter valid role";
CONFIG.INVALID_STATUS=PARENT_CONFIG.INVALID_STATUS || "Please enter valid status";
CONFIG.INVALID_USER_NAME=PARENT_CONFIG.INVALID_USER_NAME || "Already used";
CONFIG.INVALID_PASSWORD=PARENT_CONFIG.INVALID_PASSWORD || "Please enter valid password";
CONFIG.EMPTY_NAME=PARENT_CONFIG.EMPTY_NAME || "Name should not be empty";
CONFIG.EMPTY_EMAIL=PARENT_CONFIG.EMPTY_EMAIL || "Email should not be empty";
CONFIG.EMPTY_USER_ROLE=PARENT_CONFIG.EMPTY_USER_ROLE || "User role should not be empty";
CONFIG.EMPTY_USER_STATUS=PARENT_CONFIG.EMPTY_USER_STATUS || "User status should not be empty";
CONFIG.EMPTY_USER_NAME=PARENT_CONFIG.EMPTY_USER_NAME || "User name should not be empty";
CONFIG.EMPTY_PASSWORD=PARENT_CONFIG.EMPTY_PASSWORD || "Password should not be empty";
CONFIG.EMPTY_MONGO_ID=PARENT_CONFIG.EMPTY_MONGO_ID || "MongoID should not be empty";
CONFIG.LOGIN_FIRST_MESSAGE=PARENT_CONFIG.LOGIN_FIRST_MESSAGE || "Please login first";
module.exports = CONFIG;