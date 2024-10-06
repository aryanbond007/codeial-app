const User = require('../models/user');
const fs = require("fs");
const path=require("path");

// let's keep it same as before
module.exports.profile = async function(req, res){
   
    const user = await User.findById(req.params.id)
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    }




// module.exports.update = async function(req, res){

//     if(req.user.id == req.params.id){
//         try{  
//             let user = await User.findById(req.params.id);
//             User.uploadedAvatar(req,res,function(err){
//                 if(err){
//                     console.log("Multer error ",err);
//                 }
//                 console.log(req.file);
//                 user.name=req.body.name;
//                 user.email=req.body.email;
//                 if(req.file){
//                     //if avatar profile pic already availale then delete it using fs and path
//                     if(user.avatar){
//                         fs.unlinkSync(path.join(__dirname,"..",user.avatar));
                        
//                     }
//                     user.avatar=User.avatarPath + '/' + req.file.filename;
//                     // user.avatar=req.file.path;
//                 }
//                 user.save();
//                 return res.redirect("back");
//             });


//         } catch (err) {
//             console.log(err);
//             req.flash('error',err);
//             return res.redirect("back");
//         }
//     } else {
//         req.flash('error','Unauthorized')
//         return res.status(401).send("Unauthorized");
//     }



// }

module.exports.update = async function(req, res) {
    if (req.user.id == req.params.id) {
        try {
            let user = await User.findById(req.params.id);
            
            // Using Multer to handle avatar upload
            User.uploadedAvatar(req, res, function(err) {
                if (err) {
                    console.log("Multer error:", err);
                    req.flash('error', 'Error uploading file');
                    return res.redirect('back');
                }

                // Log the uploaded file (req.file)
                console.log(req.file);

                // Update user's name and email from the form submission
                user.name = req.body.name;
                user.email = req.body.email;

                // Check if a new avatar is uploaded
                if (req.file) {
                    // If an avatar already exists, delete the old one
                    if (user.avatar) {
                        try {
                            // Construct the path to the old avatar file
                            let oldAvatarPath = path.join(__dirname, '..', user.avatar);
                            
                            // Check if file exists before attempting to delete
                            if (fs.existsSync(oldAvatarPath)) {
                                fs.unlinkSync(oldAvatarPath);
                                console.log("Old avatar deleted:", oldAvatarPath);
                            } else {
                                console.log("Old avatar not found:", oldAvatarPath);
                            }
                        } catch (error) {
                            console.error("Error deleting old avatar:", error);
                        }
                    }

                    // Update the user's avatar path with the new uploaded file
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }

                // Save the updated user information
                user.save();

                req.flash('success', 'Profile updated successfully!');
                return res.redirect('back');
            });
        } catch (err) {
            console.log("Error:", err);
            req.flash('error', 'Something went wrong, please try again.');
            return res.redirect('back');
        }
    } else {
        req.flash('error', 'Unauthorized');
        return res.status(401).send('Unauthorized');
    }
};

    //     const user = await User.findByIdAndUpdate(req.params.id, req.body);
    //         req.flash('success', 'Updated!');
    //         return res.redirect('back');
        


    // }else{
    //     req.flash('error', 'Unauthorized!');
    //     return res.status(401).send('Unauthorized');
    // }
// }catch(err){
//     console.log(err);
// }
// }


// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){

    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create = async function(req, res){
    if (req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }
try{
    const user = await User.findOne({email: req.body.email});
         if(err){req.flash('error', err); return}
 
         if (user){
             return res.redirect('back');
         }

            await User.create(req.body)
                 
 
                 return res.redirect('/users/sign-in');
             }catch(err){
                console.log('error in creating user',err);
                return res.redirect('back');

           
        }

    }


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    
    req.logout(function(err) {
      if (err) { return next(err); }
     
    });
    req.flash('success', 'You have logged out!');

   
      
    return res.redirect('/');
}