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
   });
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
        message = "Sign Up failed! Try Again!";
        res.render("signup.ejs", {message: message});
      }
      else
      {
        message = "Succesful! Your institute has been created.";
        res.render('institute.ejs',{message: message});
      } //<!-- NB: success and failure msgs are not displayed fix it in institute.ejs -->
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
        message = "Sign Up failed! Try Again!";
        res.render("doctor.ejs", {message: message});
      }
      else
      {
        message = "Succesful! Your doctor has been registered.";
        res.render('doctor.ejs',{message: message});
      } // <!-- NB: success and failure msgs are not displayed fix it in doctor.ejs -->
    });
  }
  else
  {
    res.render('doctor');
  }
};
//---------------------------------view institutes details after login----------------------------------
exports.institutelist = function(req, res){
    var sql = "SELECT * FROM institutes ORDER BY id DESC";
    var query = db.query(sql, function(err, rows, results) {
      if (err) {
        console.log(err);
				//req.flash('error', err)
				res.render('instituteview.ejs', {
					title: 'Institutes List',
					data: ''
				});
			}
      else {
        console.log(rows);
				// render to views/user/list.ejs template file
				res.render('instituteview.ejs', {
					title: 'Institutes List',
					data: rows
				});
			}
  });
};
//--------------------------------edit institute navigation ----------------------------------------

exports.instituteedit = function(req, res){

  if(req.method == "GET") {
    console.log(req.params.id);
    var sql = "SELECT * FROM institutes WHERE id = '" + req.params.id + "' ";
    var query = db.query(sql, function(err, rows, fields) {
      if(err) throw err;
      // if user not found
      if (rows.length <= 0) {
        req.flash('error', 'Institute not found with id = ' + req.params.id);
        res.redirect('institutelist');
      }
      else { // if user found
        // render to views/user/edit.ejs template file
        console.log("came here");
        console.log(rows[0].id);
        res.render('instituteedit', {
          title: 'Edit Institute',
          //data: rows[0],
          id: rows[0].id,
          institutename: rows[0].institutename,
          address: rows[0].address,
          contact: rows[0].contact
        });
      }
    });
  }
};
//---------------------------------update institute details after login----------------------------------
exports.instituteupdate = function(req,res){
  console.log("came to update part");
  var post = req.body;
  var institutename= req.body.institutename;
  var address= req.body.address;
  var contact= req.body.contact;
  console.log(contact);
  //INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "'
  var sql = "UPDATE `institutes` SET institutename = '"+ institutename +"', address = '"+ address +"', contact = '"+ contact +"' WHERE id = '"+ req.params.id +"'";
  var query = db.query(sql, function(err, result) {
    if(err){
      console.log(err);
      message = "Update failed! Try Again!";
      res.redirect("/institutelist");
    }
    else
    {
      console.log("sucess");
      message = "Succesful! Your institute has been created.";
      res.redirect('/institutelist');
    } // <!-- NB: success and failure msgs are not displayed fix it in institute.ejs -->
  });

};

//---------------------------------delete institute----------------------------------
exports.deleteinstitute = function(req, res, next){
  var user = {id: req.params.id};
  console.log("came to delete");
  var sql = "DELETE FROM institutes WHERE id = '"+ req.params.id +"'";
  var query = db.query(sql, function(err,result){
    if (err) throw err;
    else {
      res.redirect('/institutelist');
    }
  });
};
//---------------------------------view doctors details after login----------------------------------
exports.doctorslist = function(req, res){
    var sql = "SELECT * FROM doctors ORDER BY id DESC";
    var query = db.query(sql, function(err, rows, results) {
      if (err) {
        console.log(err);
				//req.flash('error', err);
				res.render('doctorview.ejs', {
					title: 'Doctors List',
					data: ''
				});
			}
      else {
        console.log(rows);
				// render to views/user/list.ejs template file
				res.render('doctorview.ejs', {
					title: 'Doctors List',
					data: rows
				});
			}
  });
};

//--------------------------------edit doctor edit navigation ----------------------------------------
exports.doctoredit = function(req, res){

  if(req.method == "GET") {
    console.log(req.params.id);
    var sql = "SELECT * FROM doctors WHERE id = '" + req.params.id + "' ";
    var query = db.query(sql, function(err, rows, fields) {
      if(err) throw err
      // if user not found
      if (rows.length <= 0) {
        req.flash('error', 'Doctor not found with id = ' + req.params.id);
        res.redirect('doctorslist');
      }
      else { // if user found
        // render to views/user/edit.ejs template file
        console.log("came here");
        console.log(rows[0].id);
        res.render('doctoredit', {
          title: 'Edit Doctor',
          //data: rows[0],
          id: rows[0].id,
          doctorname: rows[0].doctorname,
          address: rows[0].address,
          contact: rows[0].contact,
          email: rows[0].email,
          speciality: rows[0].speciality,
          docregid: rows[0].docregid
        });
      }
    });
  }
};
//---------------------------------update doctor details----------------------------------
exports.doctorupdate = function(req,res){
  console.log("came to update part");
  var post = req.body;
  var doctorname= req.body.doctorname;
  var address= req.body.address;
  var contact= req.body.contact;
  var email = req.body.email;
  var speciality = req.body.speciality;
  var docregid = req.body.docregid;
  console.log(contact);
  //INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "'
  var sql = "UPDATE `doctors` SET doctorname = '"+ doctorname +"', address = '"+ address +"', contact = '"+ contact +"', email = '"+ email +"', speciality = '"+ speciality +"', docregid = '"+ docregid +"' WHERE id = '"+ req.params.id +"'";
  var query = db.query(sql, function(err, result) {
    if(err){
      console.log(err);
      message = "Update failed! Try Again!";
      res.redirect("/doctorslist");
    }
    else
    {
      console.log("sucess");
      message = "Succesful! Your institute has been created.";
      res.redirect('/doctorslist');
    } // <!-- NB: success and failure msgs are not displayed fix it in institute.ejs -->
  });

};

//---------------------------------delete doctor----------------------------------
exports.deletedoctor = function(req, res, next){
  var user = {id: req.params.id};
  console.log("came to delete");
  var sql = "DELETE FROM doctors WHERE id = '"+ req.params.id +"'";
  var query = db.query(sql, function(err,result){
    if (err) throw err
    else {
      res.redirect('/doctorslist');
    }
  });
};

exports.search = function(req, res){
  var sql = 'SELECT first_name from users where first_name like "%'+req.query.key+'%"';
  var query = db.query(sql, function(err,rows){
    if (err) throw err
    var data=[];
    for(i=0;i<rows.length;i++)
      {
        data.push(rows[i].first_name);
      }
      res.end(JSON.stringify(data));
  });
};

exports.finddoctor = function(req, res){
  var sql = 'SELECT doctorname from doctors where doctorname like "%'+req.query.key+'%"';
  var query = db.query(sql, function(err,rows){
    if (err) throw err
    var data=[];
    for(i=0;i<rows.length;i++)
      {
        data.push(rows[i].doctorname);
      }
      res.end(JSON.stringify(data));
  });
};

exports.findbyspeciality = function(req, res){
  var sql = 'SELECT speciality from doctors where speciality like "%'+req.query.key+'%"';
  var query = db.query(sql, function(err,rows){
    if (err) throw err
    var data=[];
    for(i=0;i<rows.length;i++)
      {
        data.push(rows[i].speciality);
      }
      res.end(JSON.stringify(data));
  });
};

exports.echanneling = function(req,res){
  res.render('echanneling');
};
