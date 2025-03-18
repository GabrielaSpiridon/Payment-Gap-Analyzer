//npm install express
//npm install cors


import express from 'express';
import cors  from 'cors';

import authRouter from './routes/auth.js';
import regionRouter from './routes/regionRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


app.use('/auth', authRouter);
app.use('/regions', regionRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
