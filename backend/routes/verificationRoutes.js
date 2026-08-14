const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const VerificationRequest = require('../models/VerificationRequest');

/**
 * @route   GET /api/verifications
 * @desc    Fetch all verification requests from MongoDB Atlas
 * @access  Public / Admin
 */
router.get('/', async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { ownerMobileE164: { $regex: search, $options: 'i' } },
        { token: { $regex: search, $options: 'i' } },
        { lastError: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const items = await VerificationRequest.find(query)
      .sort({ createdAt: -1 })
      .populate('property', 'name category place ownerName');

    return res.json({
      success: true,
      count: items.length,
      data: items,
      items: items, // Dual format for frontend compatibility
    });
  } catch (error) {
    console.error('❌ [GET /api/verifications Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching verification requests.',
    });
  }
});

/**
 * @route   POST /api/verifications
 * @desc    Create a new verification request in MongoDB Atlas
 * @access  Public / Admin
 */
router.post('/', async (req, res) => {
  try {
    const { ownerMobileE164, status, lastError, attempts } = req.body;

    if (!ownerMobileE164) {
      return res.status(400).json({
        success: false,
        message: 'Owner mobile number is required.',
      });
    }

    const token = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    const newRequest = await VerificationRequest.create({
      ownerMobileE164,
      token,
      status: status || 'pending',
      lastError: lastError || '',
      attempts: attempts || 1,
      expiresAt,
    });

    console.log(`✅ [Verification Created] ID: ${newRequest._id} | Mobile: ${ownerMobileE164}`);

    return res.status(201).json({
      success: true,
      data: newRequest,
    });
  } catch (error) {
    console.error('❌ [POST /api/verifications Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error creating verification request.',
    });
  }
});

/**
 * @route   PUT /api/verifications/:id
 * @desc    Update a verification request in MongoDB Atlas
 * @access  Public / Admin
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, attempts, lastError, ownerMobileE164 } = req.body;

    const updated = await VerificationRequest.findByIdAndUpdate(
      id,
      {
        ...(status && { status }),
        ...(attempts !== undefined && { attempts }),
        ...(lastError !== undefined && { lastError }),
        ...(ownerMobileE164 && { ownerMobileE164 }),
        ...(status === 'verified' && { respondedAt: new Date() }),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Verification request not found.' });
    }

    console.log(`✏️ [Verification Updated] ID: ${id} | Status: ${updated.status}`);

    return res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('❌ [PUT /api/verifications/:id Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error updating verification request.',
    });
  }
});

/**
 * @route   DELETE /api/verifications/:id
 * @desc    Delete a verification request from MongoDB Atlas
 * @access  Public / Admin
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await VerificationRequest.findByIdAndDelete(id);
    console.log(`🗑️ [Verification Deleted] ID: ${id}`);
    return res.json({
      success: true,
      message: 'Verification request deleted successfully.',
    });
  } catch (error) {
    console.error('❌ [DELETE /api/verifications/:id Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting verification request.',
    });
  }
});

module.exports = router;
