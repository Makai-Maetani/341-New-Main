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

   
    const contactList = contacts.map(c => 
      `${c.firstName} ${c.lastName} - ${c.email} - Favorite Color: ${c.favoriteColor} - Birthday: ${c.birthday}`
    ).join('\n');

    
    const responseText = `${contactList}\n\nNEW CONTACTS`;

    res.type('text/plain').send(responseText); 
  } catch (err) {
    res.status(500).json({ error: "Error fetching contacts" });
  }
});

app.post('/contacts', async (req, res) => {
  const { firstName, lastName, email, favoriteColor, birthday } = req.body;

  if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newContact = new Contact({ firstName, lastName, email, favoriteColor, birthday });
    const savedContact = await newContact.save();
    res.status(201).json({ id: savedContact._id });
  } catch (err) {
    res.status(500).json({ error: 'Error creating contact' });
  }
});

app.put('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, favoriteColor, birthday } = req.body; 

  
  if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      id, 
      { firstName, lastName, email, favoriteColor, birthday }, 
      { new: true } 
    );

    if (!updatedContact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    // Send 204
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Error updating contact' });
  }
});

app.delete('/contacts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting contact' });
  }
});


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Web Server is listening at port ' + port);
});

