const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => {
  const { category } = req.query;
  try {
    // fetch the full list of products from DummyJSON
    const response = await axios.get('https://dummyjson.com/products');
    let products = response.data && response.data.products ? response.data.products : [];

    // If a category filter was provided, apply it
    if (category) {
      products = products.filter(
        (p) => p.category && p.category.toLowerCase() === category.toLowerCase()
      );
    }

    res.json({ products });
  } catch (err) {
    console.error('Error fetching products from DummyJSON:', err.message || err);
    // forward a generic error response
    if (err.response) {
      // upstream service returned a response
      res
        .status(err.response.status)
        .json({ error: 'Failed to fetch products from upstream service' });
    } else {
      res.status(502).json({ error: 'Unable to reach products service' });
    }
  }
});

module.exports = router;
