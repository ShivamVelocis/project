require("dotenv").config(); //instatiate environment variables

let CONFIG = {}; //Make this global to use all over the application
let PARENT_CONFIG = require('./../../configs/config')//condition file import

//Regex Patterns
CONFIG.TEXTAREA_PATTERN = PARENT_CONFIG.TEXTAREA_PATTERN ||/^[ A-Za-z0-9_.\/'"@\$#\*\-!,<>&;]*$/;
CONFIG.TITLE_PATTERN = PARENT_CONFIG.TITLE_PATTERN ||/^[ A-Za-z0-9_.\/,\?]*$/;

CONFIG.MODULE_TITLE = "Menu Management";
CONFIG.NO_RECORD_FOUND = PARENT_CONFIG.NO_RECORD_FOUND || "No Record(s) Found";
CONFIG.LIMIT = PARENT_CONFIG.LIMIT || 10;

CONFIG.LIST_OF_PAGE = "List of Menu";
CONFIG.ADD_TITLE = "Add Menu";
CONFIG.UPDATE_TITLE = "Update Menu";
CONFIG.DELETE_TITLE = "Delete Menu";
CONFIG.INSERT_MESSAGE = "Menu Inserted Successfully";
CONFIG.UPDATE_MESSAGE = "Menu Updated Successfully";
CONFIG.DELETE_MESSAGE = "Menu Deleted Successfully";



module.exports = CONFIG;
