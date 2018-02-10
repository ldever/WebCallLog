const express = require('express')
const callLogData = require('./callLogData')
const app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
  res.send('GET /call_log for json call log data')
})

const data = callLogData()

app.get('/call_log', function (req, res) {
  res.json(data)
})

app.listen(3000, function () {
  console.log('call log api listening on port 3000')
})
