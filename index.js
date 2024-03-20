// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('./config');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const secretKey = 'your_secret_key';

// Connect to MongoDB
mongoose.connect('mongodb+srv://shekkylar18:Abcd1234@cluster0.pwa9c69.mongodb.net/users?retryWrites=true&w=majority&appName=Cluster0/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Define user schema
const userSchema = new mongoose.Schema({
    username: { type: String },
    email: { type: String, required: [true, 'Email is required'], unique: true, match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'] },
    password: { type: String, required: [true, 'Password is required'], minlength: [8, 'Password must be at least 8 characters long'] },
    phone: { type: String, validate: [/^\d{10}$/, 'Please enter a valid phone number'] },
    isPublic: { type: Boolean, default: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});


// Define User model
const User = mongoose.model('User', userSchema);

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        console.log(err)
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, secretKey, (err, decodedToken) => {
        if (err) {
            console.log(err)
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        req.user = decodedToken;
        next();
    });
};


// Express middleware to parse JSON body
app.use(express.json());

// Route to register a new user
app.post('/api/users', async (req, res) => {
    const { username, email, password, phone, isPublic, role } = req.body;

    try {
        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'email already exists' });
        }

        // Create new user object
        const newUser = new User({
            username,
            email,
            password,
            phone,
            isPublic,
            role
        });

        // Save the new user to the database
        await newUser.save();

        // Return the newly created user
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// API endpoint for user login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by username and password
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ email: user.email, role: user.role }, secretKey, { expiresIn: '1h' });

        // Return the token in the response
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to retrieve user profile
app.get('/api/myprofile', authenticateUser, async (req, res) => {
    try {
        // Get username from decoded token
        const { email } = req.user;

        // Find user by username
        const user = await User.findOne({ email });
        // Check if user exists
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to allow admin to view all profiles
app.get('/api/profiles/all', authenticateUser, async (req, res) => {
    try {
        const { role } = req.user;
        let allProfiles

        if (role ==="admin"){
            allProfiles = await User.find();
        }else{
            allProfiles = await User.find({"isPublic": true});
        }
        res.json(allProfiles);
    } catch (error) {
        console.error('Error retrieving all profiles:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
