import Razorpay from 'razorpay';

var instance = new Razorpay({
  key_id: 'rzp_test_yNzD02xyEt05fe',
  key_secret: 'G2RPEjWOVXATfzWUKK3kmVBO',
});

export const payment = async (req, res) => {
  const { amount, currency, receipt, notes } = req.body;
  const payment_capture = 1;
  const options = {
    amount: amount * 100,
    currency,
    receipt,
    payment_capture,
    notes,
  };
  try {
    const response = await instance.orders.create(options);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
    res.send({ error: err });
  }
};
