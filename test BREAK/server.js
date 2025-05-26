const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Contact API',
      version: '1.0.0',
      description: 'API for managing contacts',
      contact: {
        name: 'Your Name',
        email: 'your-email@example.com'
      }
    },
    basePath: '/'
  },
  apis: ['./server.js'], // Points to where your API docs are located
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Setup Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Define the contact schema and model
const contactSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  favoriteColor: String,
  birthday: String
});

const Contact = mongoose.model("Contact", contactSchema);

// Serve index.html on root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoints for contacts

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     description: Get all contacts
 *     responses:
 *       200:
 *         description: A list of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   favoriteColor:
 *                     type: string
 *                   birthday:
 *                     type: string
 */
app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Error fetching contacts" });
  }
});

/**
 * @swagger
 * /contacts:
 *   post:
 *     description: Add a new contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               favoriteColor:
 *                 type: string
 *               birthday:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact created successfully
 *       400:
 *         description: Invalid data
 */
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

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     description: Update a contact
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the contact to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               favoriteColor:
 *                 type: string
 *               birthday:
 *                 type: string
 *     responses:
 *       204:
 *         description: Contact updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Contact not found
 */
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

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Error updating contact' });
  }
});

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     description: Delete a contact
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the contact to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       404:
 *         description: Contact not found
 */
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
