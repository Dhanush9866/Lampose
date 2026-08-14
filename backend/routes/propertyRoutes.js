const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const { getIsInMemory, getMemoryStore } = require('../config/db');
const sampleProperties = require('../seedData');

const multer = require('multer');
const cloudinary = require('cloudinary').v2;

let inMemoryStore = getMemoryStore();
if (inMemoryStore.length === 0) {
  inMemoryStore.push(...sampleProperties);
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

// @route   POST /api/properties/upload-image
// @desc    Upload single image to Cloudinary and return secure URL
router.post('/upload-image', upload.single('image'), async (req, res) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`\n☁️  [${timestamp}] [Cloudinary Upload] Single image upload initiated...`);

  try {
    let dataUri;
    let originalName = 'uploaded_image';
    let sizeBytes = 0;

    if (req.file) {
      const mime = req.file.mimetype || 'image/jpeg';
      sizeBytes = req.file.size || req.file.buffer.length;
      originalName = req.file.originalname || originalName;
      dataUri = `data:${mime};base64,${req.file.buffer.toString('base64')}`;
      console.log(`   📄 File: "${originalName}" | Type: ${mime} | Size: ${(sizeBytes / 1024).toFixed(1)} KB`);
    } else if (req.body && req.body.image) {
      dataUri = req.body.image.startsWith('data:')
        ? req.body.image
        : `data:image/jpeg;base64,${req.body.image}`;
      console.log(`   📄 Payload: Base64 Data URI string received`);
    } else {
      console.warn(`   ⚠️ [Upload Rejected] No file or image payload found in request body.`);
      return res.status(400).json({ success: false, error: 'No image file provided' });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'ozbu2jhp';
    const apiKey = process.env.CLOUDINARY_API_KEY || '785979326795591';
    const apiSecret = process.env.CLOUDINARY_API_SECRET || '1EDPPk-MX49n0nZogTk4bgrJfCI';

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret
    });

    console.log(`   ⏳ Uploading to Cloudinary account: "${cloudName}" (Folder: "lampose_accommodations")...`);
    const uploadStart = Date.now();

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'lampose_accommodations',
      resource_type: 'auto'
    });

    const duration = Date.now() - uploadStart;
    console.log(`   ✅ [Cloudinary Success] Stored in ${duration}ms!`);
    console.log(`   🔗 Secure URL: ${result.secure_url}`);
    console.log(`   🆔 Public ID:  ${result.public_id}\n`);

    res.json({
      success: true,
      message: 'Image uploaded to Cloudinary successfully!',
      url: result.secure_url,
      urls: [result.secure_url],
      public_id: result.public_id
    });
  } catch (err) {
    console.error(`   ❌ [Cloudinary Upload Error]:`, err.message || err);
    res.status(500).json({ success: false, error: 'Cloudinary Upload Failed', message: err.message });
  }
});

// @route   POST /api/properties/upload-images
// @desc    Batch upload multiple images (up to 10) to Cloudinary and return array of secure URLs
router.post('/upload-images', upload.array('images', 10), async (req, res) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`\n☁️  [${timestamp}] [Cloudinary Batch Upload] Starting batch image processing...`);

  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'ozbu2jhp';
    const apiKey = process.env.CLOUDINARY_API_KEY || '785979326795591';
    const apiSecret = process.env.CLOUDINARY_API_SECRET || '1EDPPk-MX49n0nZogTk4bgrJfCI';

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret
    });

    let dataUris = [];

    if (req.files && req.files.length > 0) {
      console.log(`   📦 Received ${req.files.length} multipart file(s) for upload:`);
      dataUris = req.files.map((file, idx) => {
        const mime = file.mimetype || 'image/jpeg';
        const kb = ((file.size || file.buffer.length) / 1024).toFixed(1);
        console.log(`      [#${idx + 1}] "${file.originalname}" (${mime}, ${kb} KB)`);
        return `data:${mime};base64,${file.buffer.toString('base64')}`;
      });
    } else if (req.body && Array.isArray(req.body.images)) {
      console.log(`   📦 Received ${req.body.images.length} Base64 image strings in JSON body.`);
      dataUris = req.body.images.map(img => {
        return img.startsWith('data:') ? img : `data:image/jpeg;base64,${img}`;
      });
    } else if (req.body && req.body.image) {
      console.log(`   📦 Received single image string in JSON body.`);
      const img = req.body.image;
      dataUris = [img.startsWith('data:') ? img : `data:image/jpeg;base64,${img}`];
    } else {
      console.warn(`   ⚠️ [Batch Upload Rejected] No files provided in "images" field.`);
      return res.status(400).json({ success: false, error: 'No image files provided for upload' });
    }

    console.log(`   ⏳ Sending ${dataUris.length} photos concurrently to Cloudinary folder "lampose_accommodations"...`);
    const batchStart = Date.now();

    const uploadPromises = dataUris.map(dataUri =>
      cloudinary.uploader.upload(dataUri, {
        folder: 'lampose_accommodations',
        resource_type: 'auto'
      })
    );

    const results = await Promise.all(uploadPromises);
    const urls = results.map(r => r.secure_url);
    const duration = Date.now() - batchStart;

    console.log(`   ✅ [Batch Cloudinary Success] ${urls.length} photos stored in ${duration}ms!`);
    urls.forEach((u, i) => console.log(`      [#${i + 1}] ${u}`));
    console.log('');

    res.json({
      success: true,
      message: `${urls.length} image(s) uploaded to Cloudinary successfully!`,
      urls,
      url: urls[0] || ''
    });
  } catch (err) {
    console.error(`   ❌ [Batch Cloudinary Upload Error]:`, err.message || err);
    res.status(500).json({ success: false, error: 'Cloudinary Batch Upload Failed', message: err.message });
  }
});

// @route   GET /api/properties
// @desc    Get all properties (with optional filter by category, search, place, stayType)
router.get('/', async (req, res) => {
  const timestamp = new Date().toLocaleTimeString();
  try {
    const { category, search, place, stayType } = req.query;
    console.log(`\n📋 [${timestamp}] [API GET /properties] Query filters -> category: "${category || 'All'}", search: "${search || 'None'}"`);

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

      console.log(`   📊 [In-Memory Mode] Returning ${filtered.length} property listing(s)`);
      return res.json({
        success: true,
        count: filtered.length,
        data: filtered
      });
    }

    const query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (stayType && stayType !== 'All') {
      query.stayType = { $regex: stayType, $options: 'i' };
    }
    if (place) {
      query.place = { $regex: place, $options: 'i' };
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { place: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } }
      ];
    }

    const properties = await Property.find(query).sort({ createdAt: -1 });
    console.log(`   📊 [MongoDB Mode] Returning ${properties.length} property listing(s)`);

    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (err) {
    console.error(`   ❌ [GET /properties Error]:`, err.message);
    res.status(500).json({ success: false, error: 'Server Error fetching properties', message: err.message });
  }
});

// @route   GET /api/properties/:id
// @desc    Get single property details
router.get('/:id', async (req, res) => {
  const timestamp = new Date().toLocaleTimeString();
  const { id } = req.params;
  console.log(`\n🔍 [${timestamp}] [API GET /properties/${id}] Fetching property details...`);

  try {
    if (getIsInMemory()) {
      const property = inMemoryStore.find(p => p._id === id);
      if (!property) {
        console.warn(`   ⚠️ Property with ID "${id}" not found in memory store`);
        return res.status(404).json({ success: false, error: 'Property not found' });
      }
      return res.json({ success: true, data: property });
    }

    const property = await Property.findById(id);
    if (!property) {
      console.warn(`   ⚠️ Property with ID "${id}" not found in MongoDB`);
      return res.status(404).json({ success: false, error: 'Property not found' });
    }

    console.log(`   ✅ Loaded details for: "${property.name}" (${property.category})`);
    res.json({ success: true, data: property });
  } catch (err) {
    console.error(`   ❌ [GET /properties/${id} Error]:`, err.message);
    res.status(500).json({ success: false, error: 'Server Error', message: err.message });
  }
});

// @route   POST /api/properties
// @desc    Create a new property onboarding entry
router.post('/', async (req, res) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`\n📝 [${timestamp}] [API POST /properties] Onboarding new accommodation...`);

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
      images,
      employeeEmail,
      amenities,
      categoryDetails
    } = req.body;

    const assignedEmpEmail = employeeEmail || req.headers['x-user-email'] || 'N/A';

    console.log(`\n========================================================================`);
    console.log(`📝 [NEW ONBOARDING SUBMISSION] ${timestamp}`);
    console.log(`🏠 Property Name:    "${name}"`);
    console.log(`📍 Place / Location: "${place}"`);
    console.log(`🏷️  Category:         ${category} (${stayType || 'Long Stay'})`);
    console.log(`👤 Owner Name:       "${ownerName}"`);
    console.log(`📞 Owner Mobile:     "${ownerMobile}"`);
    console.log(`👨‍💼 Onboarded By:     "${assignedEmpEmail}"`);
    console.log(`💰 Pricing:          Monthly: ₹${monthlyPrice || rent || 0} | Daily: ₹${dailyPrice || 0} | Deposit: ₹${deposit || 0}`);
    console.log(`✨ Amenities:        ${Array.isArray(amenities) && amenities.length > 0 ? amenities.join(', ') : 'None'}`);
    console.log(`========================================================================`);

    // Validation
    if (!name || !place || !ownerName || !ownerMobile || !category) {
      console.warn(`   ⚠️ [Validation Failed] Missing mandatory fields.`);
      return res.status(400).json({
        success: false,
        error: 'Missing mandatory fields: Name, Place, Owner Name, Owner Mobile No, and Category are required.'
      });
    }

    const validCategories = ['PG', 'Hostel', 'Dormitory', 'Bachelor Room'];
    if (!validCategories.includes(category)) {
      console.warn(`   ⚠️ [Validation Failed] Invalid category: "${category}".`);
      return res.status(400).json({
        success: false,
        error: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      });
    }

    const determinedRent = rent !== undefined ? Number(rent) : (monthlyPrice || dailyPrice || 0);

    const determinedImages = Array.isArray(images) && images.length > 0
      ? images
      : (imageUrl ? [imageUrl] : ['/lampose-logo-splash.png']);

    console.log(`   📸 Image Gallery: Storing ${determinedImages.length} photo(s)`);
    determinedImages.forEach((img, i) => console.log(`      [#${i + 1}] ${img}`));

    const newPropertyData = {
      name,
      place,
      ownerName,
      ownerMobile,
      category,
      employeeEmail: assignedEmpEmail !== 'N/A' ? assignedEmpEmail : '',
      stayType: stayType || 'Long Stay',
      shortStayDuration: shortStayDuration || '1-7 Days',
      dailyPrice: Number(dailyPrice || 0),
      longStayDuration: longStayDuration || '1 Month+',
      monthlyPrice: Number(monthlyPrice || 0),
      rent: determinedRent,
      deposit: Number(deposit || 0),
      address: address || '',
      imageUrl: determinedImages[0] || imageUrl || '/lampose-logo-splash.png',
      images: determinedImages,
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
      console.log(`   ✅ [In-Memory Success] Property created with ID: ${createdItem._id}`);
      console.log(`========================================================================\n`);
      return res.status(201).json({
        success: true,
        message: 'Property onboarded successfully!',
        data: createdItem
      });
    }

    const property = await Property.create(newPropertyData);
    console.log(`   ✅ [MongoDB Success] Saved to database! Document ID: ${property._id}`);
    console.log(`========================================================================\n`);

    res.status(201).json({
      success: true,
      message: 'Property onboarded successfully!',
      data: property
    });
  } catch (err) {
    console.error(`   ❌ [POST /properties Error]:`, err.message);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    res.status(500).json({ success: false, error: 'Server Error onboarding property', message: err.message });
  }
});

// @route   PUT /api/properties/:id
// @desc    Update an existing property
router.put('/:id', async (req, res) => {
  const timestamp = new Date().toLocaleTimeString();
  const { id } = req.params;
  console.log(`\n✏️  [${timestamp}] [API PUT /properties/${id}] Updating property...`);

  try {
    if (getIsInMemory()) {
      const index = inMemoryStore.findIndex(p => p._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Property not found' });
      }
      inMemoryStore[index] = { ...inMemoryStore[index], ...req.body, updatedAt: new Date().toISOString() };
      console.log(`   ✅ [In-Memory Updated] Property ID: ${id}`);
      return res.json({ success: true, message: 'Property updated successfully', data: inMemoryStore[index] });
    }

    const property = await Property.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    console.log(`   ✅ [MongoDB Updated] Property ID: ${id}`);
    res.json({ success: true, message: 'Property updated successfully', data: property });
  } catch (err) {
    console.error(`   ❌ [PUT /properties/${id} Error]:`, err.message);
    res.status(500).json({ success: false, error: 'Server Error updating property', message: err.message });
  }
});

// @route   DELETE /api/properties/:id
// @desc    Delete a property
router.delete('/:id', async (req, res) => {
  const timestamp = new Date().toLocaleTimeString();
  const { id } = req.params;
  console.log(`\n🗑️  [${timestamp}] [API DELETE /properties/${id}] Deleting property...`);

  try {
    if (getIsInMemory()) {
      const index = inMemoryStore.findIndex(p => p._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Property not found' });
      }
      const deleted = inMemoryStore.splice(index, 1);
      console.log(`   ✅ [In-Memory Deleted] Property ID: ${id} ("${deleted[0].name}")`);
      return res.json({ success: true, message: 'Property deleted successfully', data: deleted[0] });
    }

    const property = await Property.findByIdAndDelete(id);
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    console.log(`   ✅ [MongoDB Deleted] Property ID: ${id} ("${property.name}")`);
    res.json({ success: true, message: 'Property deleted successfully', data: property });
  } catch (err) {
    console.error(`   ❌ [DELETE /properties/${id} Error]:`, err.message);
    res.status(500).json({ success: false, error: 'Server Error deleting property', message: err.message });
  }
});

module.exports = router;
