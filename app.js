require('dotenv').config({path : './configs/config.env'})

const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const session = require('express-session');
const express = require('express');
const fileUpload = require('express-fileupload')
const ejsLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const connectDb = require('./configs/db');

const path = require('path');

const app = express()

//Body parser 
app.use(express.urlencoded({extended : false}))
app.use(express.json())

//Middle ware 
app.use(fileUpload())

//data base
connectDb()

//passport config 
require('./configs/passport');

//session 
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave : false,
    saveUninitialized : false,
    store : MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
    })
}))



//passport initialize
app.use(passport.initialize())
app.use(passport.session())

//Connect flash
app.use(flash())


//public
app.use(express.static(path.join(__dirname,'node_modules','bootstrap','dist','css')))
app.use(express.static(path.join(__dirname,'node_modules','bootstrap','dist','js')))
app.use(express.static(path.join(__dirname,'node_modules','jquery','dist')))
app.use(express.static(path.join(__dirname,'node_modules','hover.css','css')))
app.use(express.static(path.join(__dirname,'public')))
app.use(express.static(path.join(__dirname,'node_modules','font-awesome','css')))

//view Engine
app.use(ejsLayout)
app.set('view engine', 'ejs')
app.set('layout','./layouts/mainLayout.ejs')
app.set('views', 'views')



//routes
app.use('/',require('./routes/index'))
app.use('/user',require('./routes/user'))
app.use('/admin',require('./routes/admin'))

//errors
app.use(require('./controllers/errorController').get404)
app.use(require('./controllers/errorController').get500)


const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log('app is runnig');
})