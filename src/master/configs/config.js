require("dotenv").config(); //instatiate environment variables

let CONFIG = {}; //Make this global to use all over the application

CONFIG.MODULE_TITLE = "MODULE Mangement";
CONFIG.ADD_MODULE = "MODULE Rule";
CONFIG.UPDATE_MODULE = "Edit MODULE Rule";
CONFIG.AUTH_FAIL_MESSAGE = "Not authorized to access the resource";
CONFIG.MODULE_ADD_SUCCESS = "MODULE RULE added successfully";
CONFIG.MODULE_UPDATE_SUCESS = "MODULE RULE updated successfully";
CONFIG.MODULE_DELETE_SUCCESS = "MODULE RULE deleted successfully";
CONFIG.MODULE_ADD_FAILED = "";
CONFIG.MODULE_UPDATE_FAILED = "";
CONFIG.MODULE_DELETE_FAILED = "";
CONFIG.NO_RULE_FOUND = "No record found"




//request validation errors
CONFIG.NO_RESOURCE_OR_METHOD = "Please select resource/method for selected Module(s)";
CONFIG.MODULE_NOT_SELECTED = "Please select atleast a Module"
CONFIG.PERMISSION_NOT_SELECTED = "Please select Permission."
CONFIG.ROLE_NOT_SELECTED = "Please select role name."



CONFIG.RULE_ALREADY_ADDED = "Rule already present in db"


module.exports = CONFIG;
