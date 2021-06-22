require('dotenv').config();//instatiate environment variables

let CONFIG = {} //Make this global to use all over the application

CONFIG.MODULE_TITLE = process.env.USER_TITLE || "Content Management";
CONFIG.CONTENT = "Content";
CONFIG.ADD_TITLE = "Add Content";
CONFIG.UPDATE_TITLE = "Update Content";
CONFIG.DELETE_TITLE = "Delete Content";
CONFIG.ADD_CONTENT_FAILED = "Error while adding content"
CONFIG.FETCH_CONTENT_FAILED = "Error while fecting content"
CONFIG.NO_CONTENT_FOUND = "No content added yet!"
CONFIG.FETCH_CONTENT_ERROR = "Error encountered while fetching content"
CONFIG.DELETE_CONTENT_FAILED = "Error while deleting content"
CONFIG.UPDATE_CONTENT_FAILED = "Error while updating content"
module.exports = CONFIG;