const axios = require("axios");
require('dotenv').config();


const token=process.env.TOKEN

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

}

module.exports = {acaoAjuda,acaoContato,acaoLocation,acaonaopermitida,acaonaopermitidaNew}