const menuModel = require("../models/MenuModel");
const CONFIG = require("./../config/config");




module.exports = async function (req, res, next) {
  try {
    let results = await menuModel.find({ menu_status:1 }).sort({ menu_priority: 'asc' });
    if (results.length > 0) {
      res.locals.menu = results;
      //console.log(results)
    }else{
      res.locals.menu=false;
    }
    
  } catch (error) {
    //res.locals.menu=false;
    console.log("Error in menu get...........",error);
  }
  
  next();
}