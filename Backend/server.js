const express = require('express');
const dotenv = require('dotenv');
const connectToMongodb = require('./db/connectToMongodb');
const cookieParser = require('cookie-parser');


const authRoutes = require('./routes/authroutes');
const messageRoutes = require('./routes/messageroutes');
const userRoutes = require('./routes/userroutes');

const app = express();

dotenv.config();
// console.log("port " ,process.env.PORT); // Should log the value from the `.env` file
// console.log("mongodb uri" ,process.env.MONGO_DB_URI); // Should log your MongoDB URI

const PORT = process.env.PORT || 5000;

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser()); // to parse the incoming requests with cookies (from req.cookies)



app.use("/api/auth",authRoutes) 
app.use("/api/messages",messageRoutes) 
app.use("/api/users",userRoutes)

app.get('/', (req, res) => {
  res.send('Hello World');
  });

app.listen(PORT, () => {
  connectToMongodb();
  console.log(`Server is running on port ${PORT}`);
});