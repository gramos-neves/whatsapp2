
const express = require('express');
const body_parser = require('body_parser');
const axios = require("axios");

const app = express();

app.use(body_parser.json());

const {WebhookClient} = require('@google-cloud/dialogflow');
const dialogflow = require('@google-cloud/dialogflow');
const sessionClient = new dialogflow.SessionsClient({keyFilename: 'arquivo.json'});


app.post('/webhookDialogFlow', (req,res) => {
     const agent = new WebhookClient({req,res});
     intentMap.set('nomedaintecao', nomedafuncao);
     agent.handleRequest(intentMap);
})

function nomedafuncao(agent){

}


function isBlank(str){
    return (!str || /^\s*$/.test(str));
}

async function detecIntent(
    projectId,
    sessionId,
    query,
    contexts,
    languagecode
){
    const sessionPath = sessionClient.projectAgentSessionPath(projectId,sessionId);

    const request = {session: sessionPath, queryInput: {
        text:{
            text:query,
            languageCode: languagecode
        }
    }};

    if(contexts && contexts.length > 0){
        request.queryParams ={
            contexts: contexts
        }
    }

    const responses= await sessionClient.detectIntent(request);
    return responses[0];
}

async function executeQueries(projectId, sessionId, queries, languagecode){
    let context;
    let intentResponse;
    for(const query of queries){
        try {
            console.log(`Pergunta: ${query}`)
            intentResponse = await detecIntent(
                projectId,sessionId,query,context,languagecode
            );

            if(isBlank(intentResponse.queryResult.fullfillmentText)){
                console.log('Sem resposta definida no DialogFlow');
                return null;
            }else{
                console.log('Resposta definida no dialogflow');
                return `${intentResponse.queryResult.fullfillmentText}`
            }


        } catch (error) {
            console.log(error)
        }
    }
}


app.post("/webhook", async (req,res) => {
    let h = req.body;

     if(req.body.object){
        if(req.body.entry &&
            req.body.entry[0].changes &&
            req.body.entry[0].changes[0] &&
            req.body.entry[0].changes[0].value.messages &&
            req.body.entry[0].changes[0].value.messages[0]){
                let phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
                let from = body_param.entry[0].changes[0].value.messages[0].from;
                let msg_from = body_param.entry[0].changes[0].value.messages[0].text.body;
                 
                let textoResposta = await executeQueries('zdg-9n0', from, [msg_body], 'pt-br');

                console.log(textoResposta)


            }
     }

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