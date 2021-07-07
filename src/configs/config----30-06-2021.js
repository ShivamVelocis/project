require('dotenv').config();//instatiate environment variables

let CONFIG = {} //Make this global to use all over the application

CONFIG.TEXT_FIELD_EXPRESSION = /^[ A-Za-z0-9_.\/,]*$/;
CONFIG.TEXTAREA_FIRLD_EXPRESSION = /^[ A-Za-z0-9_.\/,<>]*$/;


CONFIG.TEXTAREA_PATTERN =/^[ A-Za-z0-9_.\/,<>@!*'"+#$-]*$/
CONFIG.TITLE_PATTERN =/^[ A-Za-z0-9_.\/,?!#@%$^]*$/
CONFIG.PASSWORD_PATTERN= /^[ A-Za-z0-9_.\/,<>]*$/
CONFIG.EMAIL_PATTERN =/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

module.exports = CONFIG;