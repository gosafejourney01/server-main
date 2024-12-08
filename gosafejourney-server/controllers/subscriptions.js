import Subscription from "../models/subscription.js";

export const createSubscription = async (req, res) => {
  const subscription = req.body;

  const newSubscription = new Subscription({ ...subscription });

  try {
    await newSubscription.save();

    res.status(201).json(newSubscription);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}
