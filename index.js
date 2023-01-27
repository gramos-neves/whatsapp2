const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const {
  acaoAjuda,
  acaoLocation,
  acaoContato,
  acaonaopermitidaNew,
  acaonaopermitida,
} = require("./action");

const app = express();

app.use(body_parser.json());

const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN;

var agendas = [];
var arrStatus = [];
var arrayEmails = [];

app.listen(8080, () => {
  // console.log(agendas)
  console.log("webhook is listening 8080");
});

app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let challange = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];

  //console.log(challange)
  //console.log(token)
  // console.log(mode)
  if (mode && token) {
    if (mode === "subscribe" && token === mytoken) {
      res.status(200).send(challange);
    } else {
      res.status(403).send("ok");
    }
  }
});

app.post("/webhook", async (req, res) => {
  let body_param = req.body;
  const agenda = {};

  // console.log(JSON.stringify(body_param,null,2));

  if (body_param.object) {
    if (
      body_param.entry &&
      body_param.entry[0].changes &&
      body_param.entry[0].changes[0].value.messages &&
      body_param.entry[0].changes[0].value.messages[0]
    ) {
      let phon_no_id =
        body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body_param.entry[0].changes[0].value.messages[0].from;

      // console.log("from: " + from)

      var expr = body_param.entry[0].changes[0].value.messages?.[0].type;

      switch (expr) {
        case "text":
          let msg_body =
            req.body.entry[0].changes[0].value.messages?.[0].text.body;
          let text_id = body_param.entry[0].changes[0].value.messages?.[0].id;

          if (msg_body == "/ajuda") {
            //  await acaoAjuda(from,phon_no_id)
            await acaoAjuda(from, phon_no_id, token);
            //await acaoAjuda(from,phon_no_id,token)
          } else {
            await acaonaopermitidaNew(from, phon_no_id, text_id, token);
          }
          break;
        case "button":
          let button =
            body_param.entry[0].changes[0].value.messages?.[0].button;
          let wamid =
            body_param.entry[0].changes[0].value.messages?.[0].context;

          //console.log(wamid)
          agenda.button = button.text;
          agenda.wamid = wamid.id;
          agenda.from = from;
          agenda.phon_no_id = phon_no_id;
          agenda.body = body_param;

          agendas.push(agenda);
          //console.log('button')
          break;
        case "sticker":
          let sticker_id =
            body_param.entry[0].changes[0].value.messages?.[0].id;
          await acaonaopermitidaNew(from, phon_no_id, sticker_id, token);
          //console.log('sticker')
          break;
        case "image":
          await acaonaopermitida(from, phon_no_id, token);
          //console.log('image')
          break;
        case "document":
          await acaonaopermitida(from, phon_no_id, token);
          //console.log('document')
          break;
        case "video":
          await acaonaopermitida(from, phon_no_id, token);
          //console.log('video')
          break;
        case "audio":
          await acaonaopermitida(from, phon_no_id, token);
          //console.log('audio')
          break;
        case "location":
          await acaonaopermitida(from, phon_no_id, token);
          //console.log('location')
          break;
        case "interactive":
          let button_reply =
            body_param.entry[0].changes[0].value.messages?.[0].interactive.type;

          if (button_reply == "button_reply") {
            let button_reply_id =
              body_param.entry[0].changes[0].value.messages?.[0].interactive
                .button_reply.id;
            if (button_reply_id == "Contato") {
              await acaoContato(from, phon_no_id, token);
            } else if (button_reply_id == "Location_icesp") {
              await acaoLocation(from, phon_no_id, token);
            }
          }

          break;
        default:
          console.log("default");
      }


      res.sendStatus(200);
    } else {
      var status = !!body_param.entry[0].changes[0].value.statuses;

      if (status === true) {
        let phon_no_id =
          body_param.entry[0].changes[0].value.metadata.phone_number_id;
        let from =
          body_param.entry[0].changes[0].value.statuses[0].recipient_id;
        let statu = body_param.entry[0].changes[0].value.statuses[0].status;
        //   console.log(body_param.entry[0].changes[0].value)
       // arrStatus.push(body_param.entry[0].changes[0].value);
        arrStatus.push(body_param);
      }

      res.sendStatus(200);
    }
  }
});

app.get("/listen", (req, res) => {
  let agendasNew = agendas;
  agendas = [];

  res.status(200).send(JSON.stringify(agendasNew));
});

app.get("/status", (req, res) => {
  let statusNew = arrStatus;
  arrStatus = [];
  // console.log(statusNew)
  //res.status(200).send(JSON.stringify(statusNew));
  res.status(200).send(statusNew);
});




app.post("/powerautomate", (req, res) => {
   console.log(req.body)

//var email = 'GUILHERME NEVES DA SILVA RAMOS <guilherme.ramos@hc.fm.usp.br>, diego.plima@hc.fm.usp.br, carlos.brocca@hc.fm.usp.br'
//var email = 'GUILHERME NEVES DA SILVA RAMOS <guilherme.ramos@hc.fm.usp.br>'
var email = req.body;
var emails = email.para.split(',')


emails.map(resp => {
     var teste = resp.match(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)
     let pessoa = {}
     pessoa.email =  teste[0];   
     arrayEmails.push(pessoa);
})

 //console.log(arrayEmails)

 res.status(200).send(); 
});


app.get("/powerautomate/listen", (req, res) => {
   let emails =  arrayEmails;
   if(arrayEmails != []){
     console.log(arrayEmails)
   }
   arrayEmails = []
   res.status(200).send(JSON.stringify(emails));
 });