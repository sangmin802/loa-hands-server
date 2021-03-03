const express = require('express');
const {JSDOM} = require('jsdom');
const bodyParser = require('body-parser');
const path = require('path')
const app = express();
const port = process.env.PORT;
// const port = 3001

const axios = require('axios');
const https = require('https');

const agent = new https.Agent({  
  rejectUnauthorized: false
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}))

app.all('/*', function(req, res, next) {
  const allowedOrigins = ['https://sangmin802.github.io/loa-hands/'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header("Access-Control-Allow-Origin", "https://sangmin802.github.io/loa-hands/, ");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
})

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

app.post('/loa-hands/userInfo', async (req, res) => {
  const baseUrl = 'https://m-lostark.game.onstove.com/Profile/';

  const name = req.body.name;

  const encoded = encodeURIComponent(name);
  const {data : info} = await axios({
    url : `${baseUrl}Character/${encoded}`,
    method : 'GET',
    httpsAgent : agent
  });
  if(info.includes("alert('캐릭터 정보가 없습니다.")) res.send('noChar');

  const doc = new JSDOM(info);

  const script = doc.window.document.body.getElementsByTagName('script');
  const [,memberNo,,pcId,,worldNo] = script[10]?.textContent?.split('\'') ?? null;

  const {data : col} = await axios({
    url : `${baseUrl}GetCollection?${new URLSearchParams({memberNo, pcId, worldNo}).toString()}`,
    method : 'GET',
    httpsAgent : agent
  });
  
  res.send({info, col})
})

app.listen(port, () => {
  console.log('Server is connected on port'+port)
})
