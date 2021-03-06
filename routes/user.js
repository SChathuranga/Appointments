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
        if(err)
        {
          message = "Account creation failed!";
          res.render("signup.ejs", { message: message });
        }
        else
        {
         message = "Succesful! Your account has been created!";
         res.render('signup.ejs',{message: message});
        }
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
            res.redirect('/memberhome');
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
  var userId = req.session.adminId;
  if(userId == null){
    res.redirect("/adminlogin");
    return;
  }

  /*var sql = "SELECT * FROM `adminusers` WHERE `adminid`='" + userId + "'";

   db.query(sql, function(err, results) {
     res.render("dashboard.ejs", { user: user });
   });*/

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
  var userId = req.session.adminId;
  if (userId == null) {
    res.redirect("/adminlogin");
    return;
  }

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
  var userId = req.session.adminId;
  if (userId == null) {
    res.redirect("/adminlogin");
    return;
  }

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
  var userId = req.session.adminId;
  if (userId == null) {
    res.redirect("/adminlogin");
    return;
  }
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
  var userId = req.session.adminId;
  if (userId == null) {
    res.redirect("/adminlogin");
    return;
  }
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
  var userId = req.session.adminId;
  if (userId == null) {
    res.redirect("/adminlogin");
    return;
  }
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
  var userId = req.session.adminId;
  if (userId == null) {
    res.redirect("/adminlogin");
    return;
  }
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
  var userId = req.session.adminId;
  if (userId == null) {
    res.redirect("/adminlogin");
    return;
  }
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
  var userId = req.session.adminId;
  if (userId == null) {
    res.redirect("/adminlogin");
    return;
  }
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
  var userId = req.session.adminId;
  if (userId == null) {
    res.redirect("/adminlogin");
    return;
  }
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
// ------------------------------------------- find doctor by institute --------------------------------
exports.search = function(req, res){
  var sql = 'SELECT institutename from institutes where institutename like "%'+req.query.key+'%"';
  var query = db.query(sql, function(err,rows){
    if (err) throw err
    var data=[];
    for(i=0;i<rows.length;i++)
      {
        data.push(rows[i].institutename);
      }
      res.end(JSON.stringify(data));
  });
};
// ------------------------------------------- find doctor by name --------------------------------
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
// ------------------------------------------- find doctor by specialized field --------------------------------
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

//----------------------------- real time search - institute -----------------------

exports.findinstitute = function(req, res){
  var sql = 'SELECT institutename from institute where institutename like "%'+req.query.key+'%"';
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
// -------------------------------------------- member home navigation -------------------------------------
exports.memberhome = function (req, res) {
  res.render("userhome.ejs", { title: "Channel List", data: "" });
};
// ------------------------------------------------ myappointments navigation -----------------------------------
exports.myappointments = function (req, res) {
  var message = "";
  var userId = req.session.userId;

  var sql = "SELECT appid, userId, doctorname, institutename, speciality from myappointments WHERE 'userId' = '"+userId+"' ";
  db.query(sql, function(err, rows, results){
    if (err) {
      console.log(err);
      //req.flash('error', err);
      res.render("myappointments.ejs", {
        title: "Appointments List",
        data: ""
      });
    } else {
      console.log(rows);
      // render to views/user/list.ejs template file
      res.render("myappointments.ejs", {
        title: "Appointments List",
        data: rows
      });
    }
  });
};
// ----------------------------------------------- admin Home navigation -----------------------------------
exports.adminhome = function (req, res) {
  res.render('adminhome');
};
// ----------------------------------------------------- admin login -------------------------------------
exports.adminlogin = function(req, res){
  var message = "";
  var sess = req.session;

  if (req.method == "POST") {
    var post = req.body;
    var name = post.username;
    var pass = post.password;
    console.log('came here to admin login post');
    var sql = "SELECT adminid, username, admintype FROM `adminusers` WHERE `username`='" + name + "' and password = '" + pass + "'";
    db.query(sql, function(err, results) {
      if (results.length) {
        req.session.adminId = results[0].adminid;
        req.session.admin = results[0];
        console.log(results[0].adminid);
        res.render("adminhome", {username: req.session.admin.username});
      } else {
        message = "Wrong Credentials.";
        res.render("adminlogin.ejs", { message: message });
      }
    });
  } else {
    res.render("adminlogin", { message: message });
  }
};
//------------------------------------------- admin logout ----------------------------------------
exports.adminlogout = function(req, res) {
  req.session.destroy(function(err) {
    res.redirect("/adminlogin");
  });
};
//--------------------------------------------- delete appointment from my appointments -----------------------
exports.deleteappointment = function(req, res, next) {
  var user = { id: req.params.appId };
  console.log("came to delete");
  var sql = "DELETE FROM myappointments WHERE appId = '" + req.params.appId + "'";
  var query = db.query(sql, function(err, result) {
    if (err) throw err;
    else {
      res.redirect("/myappointments");
    }
  });
};
//------------------------------------------ echanneling -------------------------------------
exports.echannelingsearch = function(req, res){
  //code here
  if (req.method == "POST") {
    var post = req.body;
    var institute = req.body.institute;
    var doctor = req.body.doctor;
    var speciality = req.body.speciality;

    var sqlInstitute = "SELECT id from institutes where institutename = '"+ institute +"'";
    db.query(sql, function(err, rows, results){
      if(err)
      {
        console.log(err);
      }
      else
      {
        var sqlscript = "select doctors.doctorname, doctors.speciality from doctors join institutes on doctors.instituteid=institutes.id where doctors.doctorname='"+ doctor +"' and doctors.speciality='"+ speciality +"' and doctors.instituteid='"+ rows[0].id +"'";
        db.query(sql, function(err, rows, results) {
          if (err) {
            console.log(err);
            //req.flash('error', err);
            res.render("userhome.ejs", {
              title: "Appointments List",
              data: ""
            });
          } else {
            console.log(rows);
            res.render("userhome.ejs", {
              title: "Appointments List",
              data: rows
            });
          }
        });
      }
    });
    var sqlscript = "SELECT doctorname, instituteid, speciality from doctors where doctorname = '"+ doctor +"' and speciality = '"+ speciality +"' and instituteid = '" + institute +"' inner join institutes on doctors.instituteid = institutes.id";
    //INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "'
    //var sql = "SELECT  INTO `doctors` (`doctorname`, `address`, `contact`, `email`, `speciality`, `docregid`) VALUES ('" + doctorname + "', '" + address + "', '" + contact + "', '" + email + "', '" + speciality + "', '" + docregid + "')";
    db.query(sql, function(err, rows, results) {
      if (err) {
        console.log(err);
        //req.flash('error', err);
        res.render("memberhome.ejs", {
          title: "Appointments List",
          data: ""
        });
      } else {
        console.log(rows);
        // render to views/user/list.ejs template file
        res.render("memberhome.ejs", {
          title: "Appointments List",
          data: rows
        });
      }
    });
  } else {
    res.redirect("/memberhome");
  }
};
//---------------------------------- admin - view all appointments -----------------------------------
exports.allappointments = function(req, res) {
  var sql = "SELECT * FROM myappointments ORDER BY appid DESC";
  var query = db.query(sql, function(err, rows, results) {
    if (err) {
      console.log(err);
      //req.flash('error', err);
      res.render("allappointments.ejs", {
        title: "Appointments List",
        data: ""
      });
    } else {
      console.log(rows);
      // render to views/user/list.ejs template file
      res.render("allappointments.ejs", {
        title: "Appointments List",
        data: rows
      });
    }
  });
};