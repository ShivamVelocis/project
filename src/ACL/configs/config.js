require("dotenv").config(); //instatiate environment variables

let CONFIG = {}; //Make this global to use all over the application

// Response message
CONFIG.MODULE_TITLE = "ACL Mangement";
CONFIG.ADD_ACL = "ACL Rule(s)";
CONFIG.UPDATE_ACL = "Edit ACL Rule";
CONFIG.AUTH_FAIL_MESSAGE = "Not authorized to access the resource";
CONFIG.ACL_ADD_SUCCESS = "ACL RULE added successfully";
CONFIG.ACL_UPDATE_SUCESS = "ACL RULE updated successfully";
CONFIG.ACL_DELETE_SUCCESS = "ACL RULE deleted successfully";
CONFIG.NO_RULE_FOUND = "No record(s) found";

//request validation errors
CONFIG.NO_RESOURCE_OR_METHOD =
  "Please select resource/method for selected Module(s)";
CONFIG.MODULE_NOT_SELECTED = "Please select atleast a Module";
CONFIG.PERMISSION_NOT_SELECTED = "Please select Permission.";
CONFIG.ROLE_NOT_SELECTED = "Please select role name.";
CONFIG.INVALID_MONGODB_ID = "Please enter valid  MongoDB ID";
CONFIG.INVALID_RESOURCE = "Resources should be a array";
CONFIG.INVALID_ROLE = "Role should not be empty";
CONFIG.RULE_ALREADY_ADDED = "Rule already present in db";
CONFIG.EMPTY_ID = "id is required";


// 

module.exports = CONFIG;
