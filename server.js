const express = require("express");
const { JSDOM } = require("jsdom");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = process.env.PORT ?? 3001;

const axios = require("axios");
const https = require("https");

const agent = new https.Agent({
  rejectUnauthorized: false,
});

const baseUrl = "https://m-lostark.game.onstove.com/Profile/";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/loa-hands/event", async (req, res) => {
  const { data } = await axios({
    url: "https://m-lostark.game.onstove.com/News/Event/Now",
    method: "GET",
    httpsAgent: agent,
  });

  if (data.includes("서비스 점검")) {
    res.status(403).send({ message: "서비스 점검중입니다." });
  }
  res.status(504).send({ message: "timeout" });

  // res.send(data);
});

app.get("/loa-hands/calendar", (req, res) => {
  axios({
    url: "http://m.inven.co.kr/lostark/timer/",
    method: "GET",
    httpsAgent: agent,
  }).then(({ data }) => {
    res.send(data);
  });
});

app.post("/loa-hands/userInfo", async (req, res) => {
  const name = req.body.name;
  const encoded = encodeURIComponent(name);
  const { data: info } = await axios({
    url: `${baseUrl}Character/${encoded}`,
    method: "GET",
    httpsAgent: agent,
  });

  if (info.includes("서비스 점검")) {
    return res.status(403).send({ message: "서비스 점검중입니다." });
  }
  if (info.includes("alert('캐릭터 정보가 없습니다.")) {
    return res.status(403).send({ message: "캐릭터 정보가 없습니다." });
  }
  return res.send(info);
});

app.post("/loa-hands/userCollection", async (req, res) => {
  const [memberNo, pcId, worldNo] = req.body.member;

  const { data: col } = await axios({
    url: `${baseUrl}GetCollection?${new URLSearchParams({
      memberNo,
      pcId,
      worldNo,
    }).toString()}`,
    method: "GET",
    httpsAgent: agent,
  });

  res.send(col);
});

app.listen(port, () => {
  console.log("Server is connected on port" + port);
});
