const http = require('http');
const request = require('request');
const {clientId, secretKey} = require('./env.json');

console.log('started');

http.createServer((req, res) => {
  var code = req.url.split("=")[1];
  if (code) {
    request.post('https://github.com/login/oauth/access_token', {
      form: {
        client_id: clientId,
        client_secret: secretKey,
        code: code
      }
    }, (err, r, body) => {
      res.writeHead(301, {
        'Location': 'http://localhost:3000?' + body
      });
      res.end();
    })
    
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(5000);
