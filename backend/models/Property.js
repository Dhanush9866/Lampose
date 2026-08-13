const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Property name is required'],
      trim: true
    },
    place: {
      type: String,
      required: [true, 'Place/Location is required'],
      trim: true
    },
    ownerName: {
      type: String,
      required: [true, 'Owner name is required'],
      trim: true
    },
    ownerMobile: {
      type: String,
      required: [true, 'Owner mobile number is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['PG', 'Hostel', 'Dormitory', 'Bachelor Room']
    },
    // Stay Type & Pricing Structure
    stayType: {
      type: String,
      default: 'Long Stay',
      enum: ['Short Stay', 'Long Stay', 'Both Short & Long Stay']
    },
    shortStayDuration: {
      type: String,
      default: '1-7 Days'
    },
    dailyPrice: {
      type: Number,
      default: 0
    },
    longStayDuration: {
      type: String,
      default: '1 Month+'
    },
    monthlyPrice: {
      type: Number,
      default: 0
    },
    rent: {
      type: Number,
      required: [true, 'Rent amount is required'],
      min: [0, 'Rent must be positive']
    },
    deposit: {
      type: Number,
      default: 0
    },
    address: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    },
    amenities: {
      type: [String],
      default: []
    },
    categoryDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

propertySchema.index({ name: 'text', place: 'text', ownerName: 'text' });

module.exports = mongoose.model('Property', propertySchema);
