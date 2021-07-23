require("dotenv").config(); //instatiate environment variables

let CONFIG = {}; //Make this global to use all over the application

CONFIG.MODULE_TITLE = "ACL Mangement";
CONFIG.ADD_ACL = "ACL Rule";
CONFIG.UPDATE_ACL = "Edit ACL Rule";
CONFIG.AUTH_FAIL_MESSAGE = "Not authorized to access the resource";
CONFIG.ACL_ADD_SUCCESS = "ACL RULE added successfully";
CONFIG.ACL_UPDATE_SUCESS = "ACL RULE updated successfully";
CONFIG.ACL_DELETE_SUCCESS = "ACL RULE deleted successfully";
CONFIG.ACL_ADD_FAILED = "";
CONFIG.ACL_UPDATE_FAILED = "";
CONFIG.ACL_DELETE_FAILED = "";
CONFIG.NO_RULE_FOUND = "No record found"




//request validation errors
CONFIG.NO_RESOURCE_OR_METHOD = "Please select resource/method for selected Module(s)";
CONFIG.MODULE_NOT_SELECTED = "Please select atleast a Module"
CONFIG.PERMISSION_NOT_SELECTED = "Please select Permission."
CONFIG.ROLE_NOT_SELECTED = "Please select role name."



CONFIG.RULE_ALREADY_ADDED = "Rule already present in db"


module.exports = CONFIG;
