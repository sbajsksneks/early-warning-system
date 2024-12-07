import express from 'express';
import dotenv from 'dotenv';
import fileupload from 'express-fileupload';
import cors from 'cors';
import path from 'path';

// Import route
import DataRoute from './router/data.route.js';

const app = express();
dotenv.config({ path: './.env' });

app.use(express.json());
app.use(cors());
app.use(fileupload());

// Use routes
app.use('/api/data', DataRoute);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Handle all other routes by serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
