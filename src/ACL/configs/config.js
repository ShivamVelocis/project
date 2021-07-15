require("dotenv").config(); //instatiate environment variables

let CONFIG = {}; //Make this global to use all over the application

CONFIG.AUTH_FAIL_MESSAGE = "Not authorized to access the resource"


module.exports = CONFIG;
