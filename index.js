const express = require('express');
const app = express()



app.listen(8000, () => {
    console.log("listen port 8000")
})



app.get("/teste", (req,res) => {

    res.send("ok")
})