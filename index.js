const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
require('dotenv').config();

const {acaoAjuda} =   require('./action')

const app = express();

app.use(body_parser.json());

const token=process.env.TOKEN
const mytoken=process.env.MYTOKEN 

var agendas = []
var arrStatus =[]

app.listen(8080, ()=> {
   // console.log(agendas)
    console.log("webhook is listening 8080")
})

app.get("/webhook", (req,res) => {
    let mode = req.query["hub.mode"];
    let challange = req.query["hub.challenge"]
    let token =req.query["hub.verify_token"];

    //console.log(challange)
    //console.log(token)
    // console.log(mode)
 if(mode && token){
        if(mode ==='subscribe' && token===mytoken){
            res.status(200).send(challange);
        }else{
            res.status(403).send("ok")
        }
    }
});

app.post("/webhook", async  (req,res) => {
    let body_param = req.body;
    const agenda = {} 

// console.log(JSON.stringify(body_param,null,2));

    if(body_param.object){
       
        if(body_param.entry && body_param.entry[0].changes && 
            body_param.entry[0].changes[0].value.messages &&
            body_param.entry[0].changes[0].value.messages[0]){

                let phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
                let from = body_param.entry[0].changes[0].value.messages[0].from;
       
               // console.log("from: " + from)
               
            var expr = body_param.entry[0].changes[0].value.messages?.[0].type;

                switch(expr){
                    case 'text':
                        
                        let msg_body = req.body.entry[0].changes[0].value.messages?.[0].text.body;
                        let text_id = body_param.entry[0].changes[0].value.messages?.[0].id;
                        
            
                        if(msg_body == '/ajuda'){
                            await acaoAjuda(from,phon_no_id)
                        }else{
                          await acaonaopermitidaNew(from,phon_no_id,text_id);
                        }
                        break;
                    case 'button':
                        let button = body_param.entry[0].changes[0].value.messages?.[0].button;
                        let wamid = body_param.entry[0].changes[0].value.messages?.[0].context;

                        //console.log(wamid)
                        agenda.button = button.text
                        agenda.wamid = wamid.id
                        agenda.from = from
                        agenda.phon_no_id = phon_no_id
                        agenda.body = body_param
         
                        agendas.push(agenda)
                        //console.log('button')
                        break;
                    case 'sticker':
                        let sticker_id = body_param.entry[0].changes[0].value.messages?.[0].id; 
                       await acaonaopermitidaNew(from,phon_no_id,sticker_id)  
                        //console.log('sticker')
                        break;
                    case 'image':
                       await acaonaopermitida(from,phon_no_id)
                        //console.log('image')
                        break;   
                    case 'document':
                       await acaonaopermitida(from,phon_no_id)  
                        //console.log('document')
                        break;
                    case 'video':
                      await  acaonaopermitida(from,phon_no_id)  
                        //console.log('video')
                        break;
                    case 'audio':
                      await  acaonaopermitida(from,phon_no_id)  
                        //console.log('audio')
                        break;
                    case 'location':
                      await  acaonaopermitida(from,phon_no_id)  
                        //console.log('location')
                        break;
                    case 'interactive':
                       let button_reply = body_param.entry[0].changes[0].value.messages?.[0].interactive.type
                       
                        if(button_reply == 'button_reply'){
                            let button_reply_id = body_param.entry[0].changes[0].value.messages?.[0].interactive.button_reply.id
                            if(button_reply_id == 'Contato'){
                             await  acaoContato(from,phon_no_id) 
                            }else if(button_reply_id == 'Location_icesp'){
                              await  acaoLocation(from,phon_no_id) 
                            }
                        } 
                      
                         break;    
                    default:  
                        console.log("default")
                }   

               res.sendStatus(200)
            }else{

               var status = !!body_param.entry[0].changes[0].value.statuses
                 
               if(status === true){
                   let phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
                   let from = body_param.entry[0].changes[0].value.statuses[0].recipient_id;
                   let statu = body_param.entry[0].changes[0].value.statuses[0].status;
                //   console.log(body_param.entry[0].changes[0].value) 
                   arrStatus.push(body_param.entry[0].changes[0].value)
                          
               }


               res.sendStatus(200)
            }
    }
})



app.get("/listen", (req, res) => {
    let agendasNew = agendas;
    agendas = [] 

   res.status(200).send(JSON.stringify(agendasNew));
  });

  app.get("/status", (req, res) => {
    let statusNew = arrStatus;
    arrStatus = [] 
    
   // console.log(statusNew)
   //res.status(200).send(JSON.stringify(statusNew));
   res.status(200).send(statusNew);
  });


async function acaonaopermitida(from, phon_no_id){
    await axios({
        method: "POST",
        url:"https://graph.facebook.com/v15.0/"+phon_no_id+"/messages",
        data:{
            messaging_product:"whatsapp",
            recipient_type: "individual",
            to:from,
            type: "text",
            text:{
                body: 'Ação não permitida!'
            }
        },
        headers: {
            "Content-Type":"application/json",
            "Authorization":"Bearer "+token
        }
    })

}

async function acaonaopermitidaNew(from, phon_no_id,wam_id){
    await axios({
        method: "POST",
        url:"https://graph.facebook.com/v15.0/"+phon_no_id+"/messages",
        data:{
            messaging_product:"whatsapp",
            context: {
                message_id: ""+wam_id+""
              },
            to:from,
            type: "text",
            text:{
                preview_url: false,
                body: 'Ação não permitida!'
            }
        },
        headers: {
            "Content-Type":"application/json",
            "Authorization":"Bearer "+token
        }
    })

}


async function acaoLocation(from, phon_no_id){
    await axios({
        method: "POST",
        url:"https://graph.facebook.com/v15.0/"+phon_no_id+"/messages",
        data:{
            messaging_product:"whatsapp",
            recipient_type: "individual",
            to:from,
            type: "location",
            location: {
                longitude: "-46.6681363",
                latitude: "-23.5560378",
                name: "Instituto do Câncer do Estado de São Paulo",
                address: "Av. Dr. Arnaldo, 251 - Cerqueira César, São Paulo - SP, 01246-000"
              }
        },
        headers: {
            "Content-Type":"application/json",
            "Authorization":"Bearer "+token
        }
    })

}


async function acaoContato(from, phon_no_id){
    await axios({
        method: "POST",
        url:"https://graph.facebook.com/v15.0/"+phon_no_id+"/messages",
        data:{
            messaging_product:"whatsapp",
            recipient_type: "individual",
            to:from,
            type: "contacts",
            contacts: [{
                addresses: [{
                    street: "Av. Dr. Arnaldo, 251 - Cerqueira César",
                    city: "São Paulo",
                    state: "SP",
                    zip: "01246-000",
                    country: "Brasil",
                    country_code: "55",
                    type: "HOME"
                  }],
                birthday: "2023-02-02",
                emails: [{
                    email: "ICESP@ICESP.COM.BR",
                    type: "WORK"
                  }],
                name: {
                  formatted_name: "ICESP",
                  first_name: "Instituto do Câncer do Estado de São Paulo",
                  last_name: "",
                  middle_name: "",
                  suffix: "",
                  prefix: ""
                },
                org: {
                  company: "ICESP",
                  department: "MEDICINA",
                  title: ""
                },
                phones: [{
                    phone: "1138932000",
                    type: "HOME"
                  }],
                urls: [{
                    url: "https://www.icesp.org.br",
                    type: "WORK"
                  }]
              }] 

        },
        headers: {
            "Content-Type":"application/json",
            "Authorization":"Bearer "+token
        }
    })

}


/*
async function acaoAjuda(from, phon_no_id){
    await axios({
        method: "POST",
        url:"https://graph.facebook.com/v15.0/"+phon_no_id+"/messages",
        data:{
            messaging_product:"whatsapp",
            recipient_type: "individual",
            to:from,
            type: "interactive",
            interactive: {
                type: "button",
                body: {
                  text: "INFORMAÇÃO ICESP"
                },
                action: {
                  buttons: [
                    {
                      type: "reply",
                      reply: {
                        id: "Location_icesp",
                        title: "Localização ICEP"
                      }
                    },
                    {
                      type: "reply",
                      reply: {
                        id: "Contato",
                        title: "Contato"
                      }
                    }
                  ]
                }
              } 
            
        },
        headers: {
            "Content-Type":"application/json",
            "Authorization":"Bearer "+token
        }
    })

}*/




