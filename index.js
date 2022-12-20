const express = require('express');
const app = express()


const agendas = []


app.listen(8000, () => {
    console.log(agendas)
    console.log("listen port 8000")
})



app.get("/teste", (req,res) => {
    console.log("teste")
    res.send("ok")
})