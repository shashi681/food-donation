const Food = require('../models/Food');

const addFood = async (req, res) => {
  const { name, quantity, expiry, location } = req.body;
  try {
    const food = await Food.create({
      name, 
      quantity, 
      expiry, 
      location,
      restaurant: req.user._id
    });
    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllFood = async (req, res) => {
  try {
    const foods = await Food.find({ isAvailable: true }).populate('restaurant', 'name email');
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyFood = async (req, res) => {
  try {
    const foods = await Food.find({ restaurant: req.user._id });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addFood, getAllFood, getMyFood };
