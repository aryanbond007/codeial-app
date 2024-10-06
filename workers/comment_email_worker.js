const queue = require('../config/kue');
const commentsMailers = require('../mailers/comments_mailer');

queue.process('emails', function(job, done){
    console.log('emails workers is doing a job',job.data);

    commentsMailers.newComment(job.data);

    done();
})