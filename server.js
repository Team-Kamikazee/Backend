import * as dotenv from 'dotenv' 
import mongoose from 'mongoose'
dotenv.config({path:'./config.env'})

import app from './app.js'
const DB = process.env.DB

// !Dont Move this function
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log('DB connection successful!'));

const PORT = process.env.PORT;
const server = app.listen(PORT,()=> {
    console.log(`App running on port : ${PORT}`)
})

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});

