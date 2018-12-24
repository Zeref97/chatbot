// # SimpleServer
// A simple chat bot server
var logger = require('morgan');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var router = express();
var FormData = require('form-data');
var fs = require('fs');
var https = require('https');

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
var server = http.createServer(app);
var request = require("request");
var flag = 0;

app.get('/', (req, res) => {
  res.send("Home page. Server running okay.");
});

// Đây là đoạn code để tạo Webhook
app.get('/webhook', function(req, res) {
  if (req.query['hub.verify_token'] === 'verify_token') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});
//setTimeout(sendVideoMessage("2347613611946588", "/home/tan/Downloads/video-1544167658.mp4"), 5000);
// Xử lý khi có người nhắn tin cho bot
app.post('/webhook', function(req, res) {
  var entries = req.body.entry;
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      if (message.message) {
        // If user send text
        if (message.message.text) {
          var text = message.message.text;
          var convert = text.toLowerCase();
          if (convert == "help"){
            var help = "We support some function: \n \ 1. Enable human detection \n \ 2. Disable human detection \n \ 3. Capture image / Take a photo \n \ 4. Capture video \n \ 5. Camera information ";
            sendMessage(senderId, help);
          }
          else if (convert == "enable human detection"){
            sendMessage(senderId, "The camera is enabled human detection. \n \ Detecting human intrusion!");
            flag = 1;
            sendImageMessage(senderId, "photo.png");
            sendVideoMessage(senderId, "video.mp4");
            sendMessage(senderId, "rtsp://14.161.48.60:5546");
          }
          else if (convert == "disable human detection"){
            sendMessage(senderId, "The camera is disabled human detection.");
            flag = 0;
          }
          else if (flag == 1){
            if(convert == "camera information"){
              sendMessage(senderId, "RTSP URL: rtsp://14.161.48.60:5546");
              sendMessage(senderId, "Resolution: 1280x720");
              sendMessage(senderId, "Codec: H264");
              sendMessage(senderId, "FPS: 10");
              sendMessage(senderId, "Human detection is enable.")
            }
            else if(convert == "capture image" || convert == "take a photo"){
              sendImageMessage(senderId, "photo.png");
            }
            else if(convert == "capture video"){
              sendVideoMessage(senderId, "video.mp4");
            }
            else{
              sendMessage(senderId, "I don't understand what you mean. You can send 'Help' to get support from us.");
            }
          }
          else if (flag == 0){
            if(convert == "camera information"){
              sendMessage(senderId, "RTSP URL: rtsp://14.161.48.60:5546");
              sendMessage(senderId, "Resolution: 1280x720");
              sendMessage(senderId, "Codec: H264");
              sendMessage(senderId, "FPS: 10");
              sendMessage(senderId, "Human detection is disable.");
            }
            else if(convert == "capture image" || convert == "take a photo"){
              sendImageMessage(senderId, "photo.png");
            }
            else if(convert == "capture video"){
              sendVideoMessage(senderId, "video.mp4");
            }
            else{
              sendMessage(senderId, text);
              //sendMessage(senderId, "I don't understand what you mean. You can send 'Help' to get support from us.");
            }
          }
          console.log(text); // In tin nhắn người dùng
          //sendMessage(senderId, "Tui là bot đây: " + text);
          //sendImageMessage(senderId, "/home/tan/Pictures/1.png");
          //sendVideoMessage(senderId, "/home/tan/Downloads/video-1544167658.mp4");
          //sendImageURL(senderId, "https://www.virginexperiencedays.co.uk/content/img/product/large/the-view-from-the-12102928.jpg")
        }
      }
    }
  }

  res.status(200).send("OK");
});


// Gửi thông tin tới REST API để trả lời
function sendMessage(senderId, message) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: "EAAHEPspGjzMBAPzQdOeybbnjl61kZBTylJZC2LHuJnWDeNOvlQcqT2OEsSZCiKaB6UQ66CC6HbFluyTHnffQPwX4WY4ytCv07XONar3K7YuPc3iMQft8ItYNtfIhLdSeVzTRNCCtBxz8CqRNxLX7dlZBlQWD1HaJTlWdRU8NCUzXapwRp0FM",
    },
    method: 'POST',
    json: {
      recipient: {
        id: senderId
      },
      message: {
        text: message
      },
    }
  });
}

function sendImageURL(senderId, message) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: "EAAHEPspGjzMBAITdFnR5wZBFW2nNExyvO9xgQniQvKswYZC6ZBxZCaXiiM4LQ41rBTGGaHuMqs7yNR7Fu7T3O029ZARlGF3uOEo77bxo5CnYfYgh8ORlanokMB3LTgrFPyxUHfH9lSJsJFR4SZCtRmfPAQMczGscDMqeKMfZABHLgZDZD",
    },
    method: 'POST',
    json: {
      recipient: {
        id: senderId
      },
      message: {
        attachment:{
          type: "image",
          payload:{
            url:message
          }
        }
      },
    }
  });
}

function sendImageMessage(recipientId, file_loc){
  var readStream = fs.createReadStream(file_loc);
  var messageData = new FormData();
  messageData.append('recipient', '{id:' +recipientId+ '}');
  messageData.append('message', '{attachment :{type:"image", payload:{}}}');
  messageData.append('filedata', readStream);
  callSendAPI(recipientId, messageData);
}

function sendVideoMessage(recipientId, file_loc){
  var readStream = fs.createReadStream(file_loc);
  var messageData = new FormData();
  messageData.append('recipient', '{id:' +recipientId+ '}');
  messageData.append('message', '{attachment :{type:"video", payload:{}}}');
  messageData.append('filedata', readStream);
  callSendAPI(recipientId, messageData);
}
// function sendImage(senderId, link) {
//   var fs = require('fs')
//   var img = fs.createReadStream('/home/tan/Pictures/1.png')
//   request({
//     url: 'https://graph.facebook.com/v2.6/me/messages',
//     qs: {
//       access_token: "EAAHEPspGjzMBAHxDjQDbCRZC3WQhus7LPZC4DKB89gJ0C7pnwMXv4csrQyvq2geXYFdIO7TcQ17s5Mdfbud6eY7EaN5LooyRWtT2TvBR5hZC4uvKrYyAhDcQvmgFsNZCWYJzbl5C3lNZBvFbrfj9ohNvDAgcMJIaPo1eOoVZCWRdvtW3QnBfb7",
//     },
//     method: 'POST',
//     json: {
//       recipient: {
//         id: senderId
//       },
//       message: {
//         attachment:{
//           type: "image",
//           payload:{
//           }
//         }
//       },
//       filedata: img,
//       type: 'image/png'
//     }
//   });
// }

function callSendAPI(recipientId, messageData) {
  var options = {
    method: 'post',
    host: 'graph.facebook.com',
    path: '/v2.6/me/messages?access_token=' + "EAAHEPspGjzMBAGkC3pGxSZBY0WZAAAhxLkDr0dNxSUQlhVT2Yn7IvzS1pUjPmmVJgj58GNxLBNZAm0LtxIhPW2Op9HT2sIcWVWMWqUbGXXrQ0ZCZAMxna998ypUMxiUfChnwgtiRQxDutZA7INwIlbu1YXbfa8rSBIZBtv2VZBtiYQZDZD",
    headers: messageData.getHeaders()
  };
  var request = https.request(options);
  messageData.pipe(request);

  request.on('error', function(error) {
    console.log("Unable to send message to recipient %s", recipientId);
    return;
  });
  request.on('response', function(res) {
    if (res.statusMessage == "OK") {
      console.log("Successfully sent message to recipient %s", recipientId);
    } else {
      console.log("Unable to send message to recipient %s", recipientId);
    }
    return;
  }); 
}

//app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000);
//app.set('ip', process.env.OPENSHIFT_NODEJS_IP || process.env.IP || "127.0.0.1");

server.listen(process.env.PORT || 3000);
//server.listen(app.get('port'), app.get('ip'), function() {
//  console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
//});
