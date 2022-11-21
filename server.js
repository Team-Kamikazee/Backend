import * as dotenv from 'dotenv' 
import mongoose from 'mongoose'
dotenv.config({path:'./config.env'})

import app from './app.js'
const DB = process.env.DB

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log('DB connection successful!'));

const PORT = process.env.PORT;
app.listen(PORT,()=> {
    console.log(`App running on port : ${PORT}`)
})

