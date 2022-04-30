const AuthUtils = {};

AuthUtils.redirect = (session) => {
  if ("admin" == session.role) {
    res.redirect("/admin/ngo-list");
  } else if ("ngo" == session.role) {
    res.redirect("/ngo/donorview");
  } else if ("donor" == session.role) {
    res.redirect("/donor/");
  } else {
    res.redirect("/admin/ngo-list");
  }
};
