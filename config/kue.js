// const kue = require('kue');
// const queue = kue.createQueue();

// module.exports = queue;
const kue = require('kue');
const queue = kue.createQueue({
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
   
  }
});

module.exports = queue;
