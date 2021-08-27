require("dotenv").config(); //instatiate environment variables

let CONFIG = {}; //Make this global to use all over the application

//---------------Content Success Messages--------------------

CONFIG.CONTENT = "Content";
CONFIG.ADD_CONTENT_SUCCESS = "Content added successfully";
CONFIG.DELETE_CONTENT_SUCCESS = "Content deleted successfully";
CONFIG.UPDATE_CONTENT_SUCCESS = "Content updated successfully";

//----------------Content Error Messages-----------------------
CONFIG.FETCH_CONTENT_FAILED = "Error while fetching content";
CONFIG.NO_CONTENT_FOUND = "No Record Found";
CONFIG.FETCH_CONTENT_ERROR = "Error encountered while fetching content";
CONFIG.DELETE_CONTENT_FAILED = "Error while deleting content";
CONFIG.UPDATE_CONTENT_FAILED = "Error while updating content";
CONFIG.ADD_CONTENT_FAILED = "Error while adding content";

//---------------Content Validation Messages----------------------

//-----------------Invalid fields--------------------------------
CONFIG.INVALID_TITLE = "Please enter alphanumeric title only";
CONFIG.INVALID_DESCRIPTION = "Please enter alphanumeric description only";
CONFIG.INVALID_STATUS = "Please enter valid  content status";
CONFIG.INVALID_MONGO_ID = "Please enter valid  MongoDB ID";

//---------------------Empty fields---------------------------------
CONFIG.EMPTY_TITLE = "Title should not be empty";
CONFIG.EMPTY_DESCRIPTION = "Description should not be empty";
CONFIG.EMPTY_STATUS = "Please enter  content status";


//---------------------Regex Pattern--------------------------------
CONFIG.TEXTAREA_PATTERN = /^[ A-Za-z0-9_.\/'"@\$#\*\-!,<>&;]*$/;
CONFIG.TITLE_PATTERN = /^[ A-Za-z0-9_.\/,\?]*$/;
CONFIG.PASSWORD_PATTERN = /^[ A-Za-z0-9_.\/,<>]*$/;
CONFIG.EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

module.exports = CONFIG;
