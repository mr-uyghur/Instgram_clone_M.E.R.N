// nodemon app to start server
const express = require('express')
const app = express()
const mongoose = require('mongoose')
// Local Host Port
const PORT = 5000
const {MONGOURI} = require('./keys')

const cors = require('cors')
app.use(cors())

mongoose.connect(MONGOURI,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true 

})
mongoose.connection.on('connected', () => {
    console.log('connected to Mongo')
})

mongoose.connection.on('error', (err) => {
    console.log('error connecting:', err )
})

require('./models/user')
require('./models/post')

app.use(express.json())
// registering file in routes folder
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

app.listen(PORT, () => {
    console.log("Server is running on", PORT)
})

