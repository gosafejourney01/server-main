import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import propertyRoutes from './routes/properties.js';
import roomRoutes from './routes/rooms.js';
import userRoutes from './routes/users.js';
import propertyBookingRoutes from './routes/propertyBookings.js';
import subscriptionRoutes from './routes/subscriptions.js';
import paymentRoutes from './routes/payment.js';
import adminRoutes from './routes/admin.js';

const app = express();
// const cors = require('cors');


app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use('/properties', propertyRoutes);
app.use('/rooms', roomRoutes);
app.use('/property-bookings', propertyBookingRoutes);
app.use('/user', userRoutes);
app.use('/subscription', subscriptionRoutes);
app.use('/payment', paymentRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Hello to GoSafeJourney API');
});

const CONNECTION_URL =  "mongodb+srv://vinayak:vinayakvinayak@cluster0.8brift4.mongodb.net/?retryWrites=true&w=majority";
// const CONNECTION_URL = "mongodb+srv://gosafejourney:Project118@gosafejourney-server.ha7kifh.mongodb.net/?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

mongoose.set("strictQuery", false);

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
  .catch((error) => console.log(error.message));
