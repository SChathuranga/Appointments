//---------------------------------------------guest home page call------------------------------------------------------
exports.guest = function(req, res){
  message = '';
  if(req.method == "GET"){
    res.render('index');
  }
  else{
    res.render('index');
  }
};
//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;
      var fname= post.first_name;
      var lname= post.last_name;
      var mob= post.mob_no;

      var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "')";

      var query = db.query(sql, function(err, result) {

         message = "Succesfully! Your account has been created.";
         res.render('signup.ejs',{message: message});
      });

   } else {
      res.render('signup');
   }
};

//-----------------------------------------------login page call------------------------------------------------------
exports.login = function(req, res){
   var message = '';
   var sess = req.session;

   if(req.method == "POST"){
      var post  = req.body;
      var name= post.username;
      var pass= post.password;

      var sql="SELECT id, first_name, last_name, user_name FROM `users` WHERE `user_name`='"+name+"' and password = '"+pass+"'";
      db.query(sql, function(err, results){
         if(results.length){
            req.session.userId = results[0].id;
            req.session.user = results[0];
            console.log(results[0].id);
            res.redirect('/home/dashboard');
         }
         else{
            message = 'Wrong Credentials.';
            res.render('login.ejs',{message: message});
         }

      });
   } else {
      res.render('login',{message: message});
   }

};
//-----------------------------------------------dashboard page functionality----------------------------------------------

exports.dashboard = function(req, res, next){

   var user =  req.session.user,
   userId = req.session.userId;
   console.log('ddd='+userId);
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";

   db.query(sql, function(err, results){
      res.render('dashboard.ejs', {user:user});
   });
};
//------------------------------------logout functionality----------------------------------------------
exports.logout=function(req,res){
   req.session.destroy(function(err) {
      res.redirect("/login");
   })
};
//--------------------------------render user details after login--------------------------------
exports.profile = function(req, res){

   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
   db.query(sql, function(err, result){
      res.render('profile.ejs',{data:result});
   });
};
//---------------------------------edit users details after login----------------------------------
exports.editprofile=function(req,res){
   var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

   var sql="SELECT * FROM `users` WHERE `id`='"+userId+"'";
   db.query(sql, function(err, results){
      res.render('edit_profile.ejs',{data:results});
   });
};
//---------------------------------edit users details after login----------------------------------
exports.institute = function(req, res){
  /*var userId = req.session.userId;
  if(userId == null){
    res.redirect("/login");
    return;
  }*/

  if(req.method == "POST")
  {
    var post = req.body;
    var institutename = req.body.institutename;
    var address = req.body.address;
    var contact = req.body.contact;

    //INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "'
    var sql = "INSERT INTO `institutes` (`institutename`, `address`, `contact`) VALUES ('"+ institutename +"', '"+ address +"', '"+ contact +"')";
    var query = db.query(sql, function(err, result) {
      if(err){
        message = "Sign Up failed! Try Again!"
        res.render("signup.ejs", {message: message});
      }
      else
      {
        message = "Succesful! Your institute has been created.";
        res.render('institute.ejs',{message: message});
      } <!-- NB: success and failure msgs are not displayed fix it in institute.ejs -->
    });
  }
  else
  {
    res.render('institute');
  }
};

//---------------------------------add doctor details after login----------------------------------
exports.doctor = function(req, res){
  /*var userId = req.session.userId;
  if(userId == null){
    res.redirect("/login");
    return;
  }*/

  if(req.method == "POST")
  {
    var post = req.body;
    var doctorname = req.body.doctorname;
		var address = req.body.address;
		var contact = req.body.contact;
		var email = req.body.email;
		var speciality = req.body.speciality;
		var docregid = req.body.docregid;

    //INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "'
    var sql = "INSERT INTO `doctors` (`doctorname`, `address`, `contact`, `email`, `speciality`, `docregid`) VALUES ('"+ doctorname +"', '"+ address +"', '"+ contact +"', '"+ email +"', '"+ speciality +"', '"+ docregid +"')";
    var query = db.query(sql, function(err, result) {
      if(err){
        message = "Sign Up failed! Try Again!"
        res.render("doctor.ejs", {message: message});
      }
      else
      {
        message = "Succesful! Your doctor has been registered.";
        res.render('doctor.ejs',{message: message});
      } <!-- NB: success and failure msgs are not displayed fix it in doctor.ejs -->
    });
  }
  else
  {
    res.render('doctor');
  }
};
//---------------------------------view institutes details after login----------------------------------
exports.institutelist = function(req, res){
    var sql = "SELECT * FROM users ORDER BY id DESC";
    var query = db.query(sql, function(err, rows, results) {
      if (err) {
        console.log(err);
				req.flash('error', err)
				res.render('instituteview.ejs', {
					title: 'User List',
					data: ''
				})
			}
      else {
        console.log(rows);
				// render to views/user/list.ejs template file
				res.render('instituteview', {
					title: 'User List',
					data: rows
				});
			}
  });
};
