const express = require('express');
const app = express();
const port = process.env.PORT;

const axios = require('axios');
const https = require('https');

const agent = new https.Agent({  
  rejectUnauthorized: false
});

app.get('/loa-hands/homeData', (req, res) => {
  axios({
    url : 'https://m-lostark.game.onstove.com/News/Event/Now',
    method : 'GET',
    httpsAgent : agent
  })
  .then(({data}) => {
    res.send(data)
  })
})

app.get('/loa-hands/timer', (req, res) => {
  axios({
    url : 'http://m.inven.co.kr/lostark/timer/',
    method : 'GET',
    httpsAgent : agent
  })
  .then(({data}) => {
    res.send(data)
  })
})

// app.post('/loa-hands/userInfo', (req, res) => {
//   const name = req.body.name;
//   const encoded = encodeURIComponent(name);
//   const userData = await fetch(baseUrl+'Character/'+encoded)
//   .then(httpRes => httpRes.text());

//   axios({
//     url : 'http://m.inven.co.kr/lostark/timer/',
//     method : 'GET',
//     httpsAgent : agent
//   })
//   .then(({data}) => {
//     res.send(data)
//   })
// })

app.listen(port, () => {
  console.log('Server is connected on port'+port)
})
