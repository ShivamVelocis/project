let roleAssignment =async (req, res, next) => {
    // console.log(req.originalUrl)
    // console.log(req.method)
  try {
    if (req.session && req.session.token && validateToken(req.session.token)) {
      let tokenUser = decodeToken(req.session.token);
      console.log(tokenUser)
      let dbUser = await userModel.findOne({ _id: tokenUser.userId });
      console.log(dbUser)
      let dbUserRole = await roldeModel.findOne({ _id: dbUser.role_id });
      console.log(dbUserRole)
      res.locals.userRole = dbUserRole.title;
      return next();
    } else {
        console.log("role assigner guest user")
      res.locals.userRole = "guest";
      return next();
    }
  } catch (error) {
    console.error(error);
    req.flash("error", error);
    res.redirect("/user/auth/login");
  }
};

module.exports = {roleAssignment}