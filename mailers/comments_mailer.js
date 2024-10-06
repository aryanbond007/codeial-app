const nodeMailer = require('../config/nodemailer');


exports.newComment = (comment)=>{
    console.log('inside mailer', comment);

    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: 'codeial@gmail.com',
        to: comment.user.email,
        subject: "new Comment published",
        html: htmlString
    },(err, info)=>{
        if(err){
            console.log('error in sending email',err);
            return;
        }
        console.log('message sent', info);
        return;
    });
}