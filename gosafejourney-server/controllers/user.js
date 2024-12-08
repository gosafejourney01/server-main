import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import otpGenerator from 'otp-generator';
import User from '../models/user.js';
import Otp from '../models/otp.js';
import { sendMail } from '../functions/sendMail.js';

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email }).populate('property').populate('propertyBookings');
    if (!existingUser) return res.status(404).json({ message: 'User doesn\'t exist.' });

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid Credentials.' });

    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: '24h' });
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

export const signup = async (req, res) => {
  const { firstName, lastName, email, phone, password, confirmPassword } = req.body;
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists.' });
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords don\'t match.' });

    const OTP = otpGenerator.generate(6, {
      digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
    })

    const status = await sendMail(email, OTP);

    const otp = new Otp({ email: email, otp: OTP })

    if (status == 1) {
      const salt = await bcrypt.genSalt(10);
      otp.otp = await bcrypt.hash(otp.otp, salt);
      const result = await otp.save();
      return res.status(200).send("Otp send successfully!");
    }
    return res.status(500).json({ message: 'Otp did not sent' });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

export const verify = async (req, res) => {
  const { firstName, lastName, email, phone, password, confirmPassword, otp } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists.' });
    if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords don\'t match.' });

    const optHolder = await Otp.find({
      email: email
    })

    if (optHolder.length === 0) return res.status(400).send("Incorrect/Expired OTP!");

    const rightOtpFind = optHolder[optHolder.length - 1];
    const validUser = await bcrypt.compare(otp, rightOtpFind.otp);

    if (rightOtpFind.email === email && validUser) {

      const hashedPassword = await bcrypt.hash(password, 12);
      const result = await User.create({ firstName: firstName, lastName: lastName, email: email, password: hashedPassword, fullName: `${firstName} ${lastName}`, phone: phone })
      const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: '1h' });

      const otpDelete = await Otp.deleteMany({
        email: rightOtpFind.email
      })

      return res.status(200).json({ result, token });

    } else {
      return res.status(400).send("Wrong OTP!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
}

export const updateUser = async (req, res) => {
  const { id: _id } = req.params;
  const user = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No User with that id');

  const existingUser = await User.findOne({ _id });

  if (user.newPassword) {
    const isPasswordCorrect = await bcrypt.compare(req.body.currentPassword, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid Credentials.', status: 400 });
    const hashedPassword = await bcrypt.hash(user.newPassword, 12);
    user.password = hashedPassword;
  }

  const updatedUser = await User.findByIdAndUpdate(_id, user, { new: true });

  res.json(updatedUser);
};

export const getUser = async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No User with that id');

  const user = await User.findOne({ _id });

  res.json(user);
};



export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(400).json({ message: 'User does not exist.' });
    // if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords don\'t match.' });

    const OTP = otpGenerator.generate(6, {
      digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false
    })

    const status = await sendMail(email, OTP);

    const otp = new Otp({ email: email, otp: OTP })

    if (status == 1) {
      const salt = await bcrypt.genSalt(10);
      otp.otp = await bcrypt.hash(otp.otp, salt);
      const result = await otp.save();
      return res.status(200).send("Otp send successfully!");
    }
    return res.status(500).json({ message: 'Otp did not sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
}

export const resetPassword = async (req, res) => {
  const { password, otp, email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User does not exist.' });

    const optHolder = await Otp.find({
      email: email
    })

    if (optHolder.length === 0) return res.status(400).send("Incorrect/Expired OTP!");

    const rightOtpFind = optHolder[optHolder.length - 1];
    const validUser = await bcrypt.compare(otp, rightOtpFind.otp);

    if (rightOtpFind.email === email && validUser) {
      const hashedPassword = await bcrypt.hash(password, 12);
      password = hashedPassword;
      const updatedUser = await User.findByIdAndUpdate(user._id, { password })
      const otpDelete = await Otp.deleteMany({
        email: rightOtpFind.email
      })
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).send("Wrong OTP!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
}
