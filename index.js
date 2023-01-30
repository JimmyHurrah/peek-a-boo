require('dotenv').config();
var AWS = require('aws-sdk');
var util = require('util');

AWS.config.update({
  accessKeyId: process.env.PEEKABOO_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.PEEKABOO_AWS_SECRET_ACCESS_KEY,
  region: process.env.PEEKABOO_AWS_REGION
});

var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var params = {
  QueueUrl: process.env.PEEKABOO_AWS_QUEUE_URL, 
  MaxNumberOfMessages: 1,
  // A value of 0 means the messages will be retrieved, but will not be deleted from the queue. 
  VisibilityTimeout: 0,
};

function peekMessages() {
  console.log("Peek a boo!...");
  sqs.receiveMessage(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      if (data.Messages) {
        data.Messages.forEach(function(message) {
          console.log(util.inspect(JSON.parse(JSON.parse(message.Body).Message), {depth: null, colors: true}));
        });
      }
    }
  });
  setTimeout(peekMessages, 5000);
}

peekMessages();
