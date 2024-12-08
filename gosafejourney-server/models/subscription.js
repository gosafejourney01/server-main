import mongoose from 'mongoose';

const subscriptionSchema = mongoose.Schema({
  email: String,
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;