const express = require('express');
const router = express.Router();
const { database } = require('../config/helpers');

/* GET All Products. */
router.get('/', function (req, res) {
  let page = (req.query.page != undefined && req.query.page != 0) ? req.query.page : 1;
  let limit = (req.query.limit != undefined && req.query.limit != 0) ? req.query.limit : 10;

  let startValue, endValue;

  if (page > 0) {
    startValue = (page * limit) - limit;
    endValue = page * limit;
  } else {
    startValue = 0;
    endValue = 10;
  }
  database.table('products as p')
    .join([
      {
        table: 'categories as c',
        on: 'p.cat_id = c.id'
      }
    ])
    .withFields([
      'c.title as category',
      'p.title as name',
      'p.price',
      'p.quantity',
      'p.image',
      'p.id'
    ])
    .slice(startValue, endValue)
    .sort({ id: .1 })
    .getAll()
    .then(prods => {
      if (prods.length > 0) {
        res.status(200).json({
          count: prods.length,
          products: prods
        });
      } else {
        res.json({ message: 'No products found' });
      }
    }).catch(err => console.log(err));

});


/* Get Single Product */
router.get('/:prodId', function (req, res) {

  let productId = req.params.prodId;

  database.table('products as p')
    .join([
      {
        table: 'categories as c',
        on: 'p.cat_id = c.id'
      }
    ])
    .withFields([
      'c.title as category',
      'p.title as name',
      'p.price',
      'p.quantity',
      'p.image',
      'p.images',
      'p.id'
    ])
    .filter({ 'p.id': productId })
    .get()
    .then(prod => {
      if (prod) {
        res.status(200).json(prod);
      } else {
        res.json({ message: `No product found with Product ID: ${productId}` });
      }
    }).catch(err => console.log(err));

});

/* GET ALL PRODUCTS FROM PARTICULAR CATEGORY */
router.get('/category/:catName', (req, res) => {
  let page = (req.query.page != undefined && req.query.page != 0) ? req.query.page : 1;
  let limit = (req.query.limit != undefined && req.query.limit != 0) ? req.query.limit : 10;

  let catTitle = req.params.catName;
  let startValue, endValue;

  if (page > 0) {
    startValue = (page * limit) - limit;
    endValue = page * limit;
  } else {
    startValue = 0;
    endValue = 10;
  }
  database.table('products as p')
    .join([
      {
        table: 'categories as c',
        on: `p.cat_id = c.id WHERE c.title LIKE '%${catTitle}%'`
      }
    ])
    .withFields([
      'c.title as category',
      'p.title as name',
      'p.price',
      'p.quantity',
      'p.image',
      'p.id'
    ])
    .slice(startValue, endValue)
    .sort({ id: .1 })
    .getAll()
    .then(prods => {
      if (prods.length > 0) {
        res.status(200).json({
          count: prods.length,
          products: prods
        });
      } else {
        res.json({ message: `No products found under ${catTitle} category.` });
      }
    }).catch(err => console.log(err));
});

module.exports = router;
