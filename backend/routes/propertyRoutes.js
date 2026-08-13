const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const { getIsInMemory, getMemoryStore } = require('../config/db');
const sampleProperties = require('../seedData');

let inMemoryStore = getMemoryStore();
if (inMemoryStore.length === 0) {
  inMemoryStore.push(...sampleProperties);
}

// @route   GET /api/properties
// @desc    Get all properties (with optional filter by category, search, place, stayType)
router.get('/', async (req, res) => {
  try {
    const { category, search, place, stayType } = req.query;

    if (getIsInMemory()) {
      let filtered = [...inMemoryStore];
      if (category && category !== 'All') {
        filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }
      if (stayType && stayType !== 'All') {
        filtered = filtered.filter(p => p.stayType && p.stayType.toLowerCase().includes(stayType.toLowerCase()));
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          p =>
            p.name.toLowerCase().includes(q) ||
            p.place.toLowerCase().includes(q) ||
            p.ownerName.toLowerCase().includes(q)
        );
      }
      if (place) {
        filtered = filtered.filter(p => p.place.toLowerCase().includes(place.toLowerCase()));
      }
      return res.json({ success: true, count: filtered.length, data: filtered, mode: 'in-memory' });
    }

    // Mongoose query
    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (stayType && stayType !== 'All') {
      query.stayType = { $regex: stayType, $options: 'i' };
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { place: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } }
      ];
    }
    if (place) {
      query.place = { $regex: place, $options: 'i' };
    }

    const properties = await Property.find(query).sort({ createdAt: -1 });

    if (properties.length === 0 && !category && !search && !place && !stayType) {
      await Property.insertMany(sampleProperties);
      const seeded = await Property.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: seeded.length, data: seeded, mode: 'mongodb' });
    }

    res.json({ success: true, count: properties.length, data: properties, mode: 'mongodb' });
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ success: false, error: 'Server Error', message: err.message });
  }
});

// @route   GET /api/properties/:id
// @desc    Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsInMemory()) {
      const prop = inMemoryStore.find(p => p._id === id);
      if (!prop) return res.status(404).json({ success: false, error: 'Property not found' });
      return res.json({ success: true, data: prop });
    }

    const prop = await Property.findById(id);
    if (!prop) return res.status(404).json({ success: false, error: 'Property not found' });
    res.json({ success: true, data: prop });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// @route   POST /api/properties
// @desc    Create a new property onboarding entry
router.post('/', async (req, res) => {
  try {
    const {
      name,
      place,
      ownerName,
      ownerMobile,
      category,
      stayType,
      shortStayDuration,
      dailyPrice,
      longStayDuration,
      monthlyPrice,
      rent,
      deposit,
      address,
      imageUrl,
      amenities,
      categoryDetails
    } = req.body;

    // Validation
    if (!name || !place || !ownerName || !ownerMobile || !category) {
      return res.status(400).json({
        success: false,
        error: 'Missing mandatory fields: Name, Place, Owner Name, Owner Mobile No, and Category are required.'
      });
    }

    const validCategories = ['PG', 'Hostel', 'Dormitory', 'Bachelor Room'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      });
    }

    const determinedRent = rent !== undefined ? Number(rent) : (monthlyPrice || dailyPrice || 0);

    const newPropertyData = {
      name,
      place,
      ownerName,
      ownerMobile,
      category,
      stayType: stayType || 'Long Stay',
      shortStayDuration: shortStayDuration || '1-7 Days',
      dailyPrice: Number(dailyPrice || 0),
      longStayDuration: longStayDuration || '1 Month+',
      monthlyPrice: Number(monthlyPrice || 0),
      rent: determinedRent,
      deposit: Number(deposit || 0),
      address: address || '',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      amenities: Array.isArray(amenities) ? amenities : [],
      categoryDetails: categoryDetails || {}
    };

    if (getIsInMemory()) {
      const createdItem = {
        _id: 'prop_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        ...newPropertyData,
        createdAt: new Date().toISOString()
      };
      inMemoryStore.unshift(createdItem);
      return res.status(201).json({
        success: true,
        message: 'Property onboarded successfully!',
        data: createdItem
      });
    }

    const property = await Property.create(newPropertyData);
    res.status(201).json({
      success: true,
      message: 'Property onboarded successfully!',
      data: property
    });
  } catch (err) {
    console.error('Error creating property:', err);
    res.status(500).json({ success: false, error: 'Failed to onboard property', message: err.message });
  }
});

// @route   DELETE /api/properties/:id
// @desc    Delete a property
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsInMemory()) {
      const idx = inMemoryStore.findIndex(p => p._id === id);
      if (idx !== -1) {
        inMemoryStore.splice(idx, 1);
        return res.json({ success: true, message: 'Property deleted successfully' });
      }
      return res.status(404).json({ success: false, error: 'Property not found' });
    }

    const prop = await Property.findByIdAndDelete(id);
    if (!prop) return res.status(404).json({ success: false, error: 'Property not found' });
    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete property' });
  }
});

module.exports = router;
