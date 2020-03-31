// In this file we have added condition to check whether user is authenticated or not so that 
//we can lock certain routes
module.exports = {
    //conidtion goes in dashboard route if not logged in so to send user to login route
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'Please log in to view that resource');
      res.redirect('/user/login');
    },
    //condition goes in any route if redirected from and dashboard and session is alive to 
    //redirect back to dashboard
    forwardAuthenticated: function(req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.redirect('/dashboard');      
    }
  };