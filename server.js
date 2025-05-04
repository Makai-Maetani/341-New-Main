// //Express Web Server

// const express = require('express');
// const mongoose = require('mongoose');
// const app = express();

// //const mongodb = require('./db/connect');

// mongoose.connect('mongodb+srv://kaibackvalley:Admin@cluster340.kkwtjbb.mongodb.net/contacts');

// const UserSchema = new mongoose.Schema({
//   name: String,
//   age: Number
// });

// const UserModel = mongoose.model("users", UserSchema);

// app.listen(3001, () =>{
//   console.log("Server is running");
// });

// app.get("/getUsers", (req, res) => { 
//   res.json(UserModel.find());
// });

// app.get('/', (req, res) => {
//   res.send("Makai Maetani");
// });

// const port = 3000;
 
// app.listen(process.env.PORT || port, () => {
//   console.log('Web Server is listening at port ' + (process.env.PORT || port));
// });

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Load .env variables
const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

const contactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  favoriteColor: String,
  birthday: String
});

const Contact = mongoose.model("Contact", contactSchema);

app.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Error fetching contacts" });
  }
});

app.get('/', (req, res) => {
  res.send("Makai Maetani");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Web Server is listening at port ' + port);
});

