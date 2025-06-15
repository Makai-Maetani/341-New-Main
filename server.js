const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;


dotenv.config();

const app = express();

// === View Engine Setup ===
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts); // enable layout support
app.set('layout', 'layout'); // default layout file is views/layout.ejs

// === Middleware ===
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'your-secret-key', 
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});


// === Swagger Setup ===
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
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// === MongoDB Connection ===
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// === Mongoose Models ===
const contactSchema = new mongoose.Schema({
  dishName: String,        
  chefName: String,
  instructions: String,
  bakingTime: String,
  ingredients: String,
  countryOfOrigin: String,
  calories: Number         
});
const Contact = mongoose.model("Contact", contactSchema);

const accountSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // O auth stuff
  email: { type: String, required: true, unique: true },
  birthdate: { type: Date, required: true }
});
const Account = mongoose.model('Account', accountSchema);

// === Github Oauth ===

// Add this after your app.use(session(...)) but before your routes
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  (accessToken, refreshToken, profile, done) => {
    // This is where you handle the user data
    return done(null, profile);
  }
));

app.use(passport.initialize());
app.use(passport.session());

// === Routes ===

// Home page
app.use((req, res, next) => {
  console.log('Session:', req.session);
  next();
});


app.get('/', (req, res) => {
  res.render('home'); // don't pass user manually
});

app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/'); // redirect if already logged in
  res.render('login'); // render login.ejs
});

// GitHub Auth Routes 
app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    req.session.user = {
      id: req.user.id,
      username: req.user.username,
      provider: 'github'
    };
    res.redirect('/');
  }
);


app.get('/signup', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('signup');
});



// logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.redirect('/');
  });
});


// Handle signup form submission
app.post('/signup', async (req, res) => {
  const { username, password, email, birthdate } = req.body;

  try {
    const existingUser = await Account.findOne({ username });
    if (existingUser) {
      return res.status(400).send('Username already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Account({
      username,
      password: hashedPassword,
      email,
      birthdate
    });

    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).send('Internal server error');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Account.findOne({ username });
    if (!user) {
      return res.redirect('/login?error=1');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.redirect('/login?error=1');
    }

    req.session.user = {
      id: user._id,
      username: user.username
    };

    return res.redirect('/?success=1');
  } catch (err) {
    console.error('Login error:', err);
    return res.redirect('/login?error=1');
  }
});



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
// POST /contacts
app.post('/contacts', async (req, res) => {
  const { dishName, chefName, calories, instructions, bakingTime, ingredients, countryOfOrigin } = req.body;

  if (!dishName || !chefName || !calories || !instructions || !bakingTime || !ingredients || !countryOfOrigin) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newRecipe = new Contact({ 
      dishName,
      chefName,
      calories,
      instructions,
      bakingTime,
      ingredients,
      countryOfOrigin
    });
    const savedRecipe = await newRecipe.save();
    res.status(201).json({ id: savedRecipe._id });
  } catch (err) {
    res.status(500).json({ error: 'Error creating recipe' });
  }
});

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     description: Get all recipes
 *     responses:
 *       200:
 *         description: A list of recipes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   chefName:
 *                     type: string
 *                   instructions:
 *                     type: string
 *                   bakingTime:
 *                     type: string
 *                   ingredients:
 *                     type: string
 *                   countryOfOrigin:
 *                     type: string
 */
app.put('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const { dishName, chefName, calories, instructions, bakingTime, ingredients, countryOfOrigin } = req.body;

  if (!dishName || !chefName || !calories || !instructions || !bakingTime || !ingredients || !countryOfOrigin) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const updatedRecipe = await Contact.findByIdAndUpdate(
      id,
      { dishName, chefName, calories, instructions, bakingTime, ingredients, countryOfOrigin },
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.status(200).json(updatedRecipe);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Error updating recipe' });
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

// === Old test signup console log route (commented out) ===
// app.post('/auth/signup', (req, res) => {
//   const { username, password, email, birthdate } = req.body;

//   // TODO: Add real validation and database logic here
//   console.log("Signup data:", { username, password, email, birthdate });

//   res.send('Signup successful!'); // Or redirect to login/dashboard
// });

// === Start Server ===
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Web Server is listening at port ' + port);
});
