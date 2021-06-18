require('dotenv').config();//instatiate environment variables

let CONFIG = {} //Make this global to use all over the application

CONFIG.MODULE_TITLE = process.env.USER_TITLE   || 'User Management';
CONFIG.USER = 'User';
CONFIG.ADD_TITLE = 'Add User';
CONFIG.UPDATE_TITLE = 'Update User';
CONFIG.DELETE_TITLE = 'Delete User';
CONFIG.INSERT_MESSAGE = 'User Inserted Successfully';
CONFIG.UPDATE_MESSAGE = 'User Updated Successfully';
CONFIG.DELETE_MESSAGE = 'User Deleted Successfully';
CONFIG.NO_RECORDS = 'No Record(s) Found';

CONFIG.LOGIN_FAIL_MESSAGE = 'Invalid Username or Password';
CONFIG.LOGIN_SUCCESS_MESSAGE = 'Logged in success';

CONFIG.LIMIT  = 5;


module.exports = CONFIG;