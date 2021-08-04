require("dotenv").config(); //instatiate environment variables

let CONFIG = {}; //Make this global to use all over the application

//MODULE CONFIGS
CONFIG.MODULE_TITLE = "MODULE Mangement";
CONFIG.ADD_MODULE = "MODULE Rule";
CONFIG.UPDATE_MODULE = "Edit MODULE";
CONFIG.AUTH_FAIL_MESSAGE = "Not authorized to access the resource";
CONFIG.MODULE_ADD_SUCCESS = "MODULE  added successfully";
CONFIG.MODULE_UPDATE_SUCESS = "MODULE  updated successfully";
CONFIG.MODULE_DELETE_SUCCESS = "MODULE  deleted successfully";
CONFIG.MODULE_ADD_FAILED = "Adding module failed";
CONFIG.MODULE_UPDATE_FAILED = "Module update failed";
CONFIG.MODULE_DELETE_FAILED = "Module deletion failed";
CONFIG.NO_RULE_FOUND = "No record found";
CONFIG.MODULES_FETCH_SUCCESS = "All Modules data";
CONFIG.MODULE_FETCH_SUCCESS = "Module data";
CONFIG.RESOURSCE_MAPPING_SUCCESS = "Resource Mapped successfully";
CONFIG.RESOURSCE_MAPPING_FAILED = "Resource Mapped failed";
CONFIG.RESOURSCE_UNLINKED_SUCCESS = "Resource unlinked successfully";
CONFIG.RESOURSCE_UNLINKED_FAILED = "Resource unlinked failed";

//RESOURCE CONFIG
CONFIG.RESOURCE_ADD_SUCCESS = "Resource  added successfully";
CONFIG.RESOURCE_UPDATE_SUCESS = "Resource  updated successfully";
CONFIG.RESOURCE_DELETE_SUCCESS = "Resource  deleted successfully";
CONFIG.RESOURCE_ADD_FAILED = "Adding RESOURCE failed";
CONFIG.RESOURCE_UPDATE_FAILED = "Resource update failed";
CONFIG.RESOURCE_DELETE_FAILED = "Resource deletion failed";
CONFIG.NO_RESOURCE_FOUND = "No record found";
CONFIG.RESOURCE_FETCH_SUCCESS = "All resource data";
CONFIG.RESOURCE_FETCH_SUCCESS = "Resource data";
CONFIG.MODULE_MAPPING_SUCCESS = "Module Mapped successfully";
CONFIG.MODULE_MAPPING_FAILED = "Module Mapped failed";
// CONFIG.MODULE_UNLINKED_SUCCESS = "Module unlinked successfully";
// CONFIG.MODULE_UNLINKED_FAILED = "Module unlinked failed";

//request validation errors
CONFIG.NO_RESOURCE_OR_METHOD =
  "Please select resource/method for selected Module(s)";
CONFIG.MODULE_NOT_SELECTED = "Please select atleast a Module";
CONFIG.PERMISSION_NOT_SELECTED = "Please select Permission.";
CONFIG.ROLE_NOT_SELECTED = "Please select role name.";
CONFIG.INVALID_METHOD = "Please enter valid HTTP method(S)";
CONFIG.INVALID_MONGODB_ID = "Please enter valid  MongoDB ID";
CONFIG.EMPTY_ID = "id should not be empty";
CONFIG.INVALID_RESOURSCE_ID = "resourcesId should be a array";
CONFIG.INVALID_STATUS = "Status should be 1 or 0";

module.exports = CONFIG;
