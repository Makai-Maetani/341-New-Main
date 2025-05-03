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
const app = express();

app.use(express.json()); // to parse JSON bodies

// Connect to MongoDB
mongoose.connect('mongodb+srv://kaibackvalley:Admin@cluster340.kkwtjbb.mongodb.net/contacts', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// Define Contact schema
const contactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  favoriteColor: String,
  birthday: String
});

// Create the Contact model
const Contact = mongoose.model("Contact", contactSchema);

// Seed contacts (optional, only run once)
// Uncomment this block once to insert initial data

const contacts = [
  {
    firstName: "Reimu",
    lastName: "Hakurei",
    email: "touhou6@gmail.com",
    favoriteColor: "red",
    birthday: "07/14/2001"
  },
  {
    firstName: "Marisa",
    lastName: "Kirisame",
    email: "magicspark@gmail.com",
    favoriteColor: "yellow",
    birthday: "09/14/2001"
  },
  {
    firstName: "Sanae",
    lastName: "Kochiya",
    email: "suwako@gmail.com",
    favoriteColor: "green",
    birthday: "10/14/2001"
  }
];

Contact.insertMany(contacts)
  .then(() => console.log("Contacts inserted"))
  .catch(err => console.log(err));


// Route to get all contacts
app.get("/getContacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Error fetching contacts" });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send("Makai Maetani");
});

// Start the server (only one listen)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Web Server is listening at port ' + port);
});
