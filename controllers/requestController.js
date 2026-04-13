const Request = require('../models/Request');
const Food = require('../models/Food');

const createRequest = async (req, res) => {
  const { foodId } = req.body;
  try {
    const food = await Food.findById(foodId);
    if (!food || !food.isAvailable) {
      return res.status(400).json({ message: 'Food not available' });
    }
    const existing = await Request.findOne({ food: foodId, ngo: req.user._id, status: 'pending' });
    if (existing) return res.status(400).json({ message: 'Request already sent' });

    const request = await Request.create({
      food: foodId,
      ngo: req.user._id,
      restaurant: food.restaurant
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ ngo: req.user._id })
      .populate('food', 'name quantity expiry location')
      .populate('restaurant', 'name email');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIncomingRequests = async (req, res) => {
  try {
    const requests = await Request.find({ restaurant: req.user._id })
      .populate('food', 'name quantity')
      .populate('ngo', 'name email');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRequestStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    // Check if the current user is authorized to update this status
    const isRestaurant = request.restaurant.toString() === req.user._id.toString();
    const isNgo = request.ngo.toString() === req.user._id.toString();

    if (!isRestaurant && !(isNgo && status === 'completed')) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = status;
    await request.save();

    // If accepted, food is no longer available
    if (status === 'accepted') {
      await Food.findByIdAndUpdate(request.food, { isAvailable: false });
      
      // Auto-reject other pending requests for the same food
      await Request.updateMany(
        { food: request.food, _id: { $ne: request._id }, status: 'pending' },
        { status: 'rejected' }
      );
    }
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRequest, getMyRequests, getIncomingRequests, updateRequestStatus };
