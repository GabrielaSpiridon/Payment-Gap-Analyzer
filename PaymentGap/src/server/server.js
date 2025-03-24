//npm install express
//npm install cors


import express from 'express';
import cors  from 'cors';

import authRouter from './routes/auth.js';
import regionRouter from './routes/regionRoutes.js';
import countryRouter from './routes/countryRoutes.js';
import locationRouter from './routes/locationRoutes.js';
import companyRouter from './routes/companyRoutes.js';
import companyRegionRouter from './routes/companyRegionRoutes.js';
import companyCountryRouter from './routes/companyCountryRoutes.js';
import departmentRouter from './routes/departmentRoutes.js';

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
app.use('/countries', countryRouter);
app.use('/locations', locationRouter);
app.use('/companies', companyRouter);
app.use('/companyRegions', companyRegionRouter);
app.use('/companyCountries', companyCountryRouter);
app.use('/departments', departmentRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
