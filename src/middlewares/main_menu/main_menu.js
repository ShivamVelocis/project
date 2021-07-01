const main_meuModel = require("./models/main_menuModel");

exports.main_menu = async (req, res, next) => {
  try {
    if (res.locals.isAuth) {
      let menuData = await main_meuModel.find({}, null, {
        sort: { menu_priority: 1 },
      });
      let filtered = menuData.filter((value) => {
        return value.menu_title != "Login";
      }); 
      res.locals.main_menu = filtered;
    } else {
      let menuData = await main_meuModel.find({ authrequired: false }, null, {
        sort: { menu_priority: 1 },
      });
      let filtered = menuData.filter((value) => {
        return value.menu_title != "Logout";
      });
      res.locals.main_menu = filtered;
    }
    next();
  } catch (error) {
    res.locals.main_menu = null;
    next();
  }
};
