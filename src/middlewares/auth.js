// const CONFIG = require("../configs/config");
// const {validateToken, decodeToken, generaterefreshToken} = require("../users/utils/auth");

// // middleware to allow logged users and refresh tokens
// exports.isUserLoggedIn = async (req, res, next) => {
//   try {
//     if (validateToken(req)) {
//       res.locals.user = decodeToken(req.session.token);
//       req.session.token = await generaterefreshToken(req.session.token);
//       next();
//     } else {
//       req.flash("error",CONFIG.LOGIN_FIRST_MESSAGE);
//       res.redirect("/user/auth/login");
//     }
//   } catch (error) {
//     // console.error(error);
//     req.flash("error",CONFIG.LOGIN_FIRST_MESSAGE);
//     res.redirect("/user/auth/login");
//   }
// };


