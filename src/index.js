const express = require('express')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.listen(3000, ()=> {
    console.log("app is listening at port 3000")
})

app.get('/', (req, res) => {
    res.status(200).json({
        'status': 'success'
    })
})
