const main_meuModel = require("./models/main_menuModel");

exports.main_menu = async (req, res, next) => {
  try {
    let menuData = await main_meuModel.find({},null,{sort:{"menu_priority":1}});
    let result = menuData.filter((val) => {
      if (val.menu_title == "Login") {
        if (res.locals.isAuth) {
          return false;
        } else {
          return true;
        }
      }
      if (val.menu_title == "Logout") {
        if (res.locals.isAuth) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    });
    if (menuData) {
      res.locals.main_menu = result;
    }
    next();
  } catch (error) {
    res.locals.main_menu = null;
    next();
  }
};
