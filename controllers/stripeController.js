
const User = require('../models/userModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createAccount = async(req , res) =>{
    const { userId } = req.body;

    // Create a new Stripe account
    const account = await stripe.accounts.create({
      type: 'express',
    });
  
      await User.findByIdAndUpdate(userId, { stripeAccountId: account.id });
  
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'http://localhost:3000/',
      return_url: 'http://localhost:3000/',
      type: 'account_onboarding',
    });
  
    res.send({ url: accountLink.url });
}
module.exports = { createAccount }