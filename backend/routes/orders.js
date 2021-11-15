var express = require('express');
const app = require('../app');
var router = express.Router();
const { database } = require('../config/helpers');

/* GET All Orders listing. */
router.get('/', function (req, res) {
  database.table('orders_details as od')
    .join([
      {
        table: 'orders as o',
        on: 'o.id = od.order_id'
      },
      {
        table: 'products as p',
        on: 'p.id = od.product_id'
      },
      {
        table: 'users as u',
        on: 'u.id = o.user_id'
      }
    ])
    .withFields(['o.id', 'p.title as name', 'p.description', 'p.price', 'u.username'])
    .sort({ id: 1 })
    .getAll()
    .then(orders => {
      if (orders.length > 0) {
        res.status(200).json(orders);
      } else {
        res.json({ message: 'No Orders Found!!' });
      }
    }).catch(err => console.log(err));
});

/* Get Single Product */
router.get('/:orderId', (req, res) => {
  let orderId = req.params.orderId;
  database.table('orders_details as od')
    .join([
      {
        table: 'orders as o',
        on: 'o.id = od.order_id'
      },
      {
        table: 'products as p',
        on: 'p.id = od.product_id'
      },
      {
        table: 'users as u',
        on: 'u.id = o.user_id'
      }
    ])
    .withFields(['o.id', 'p.title as name', 'p.description', 'p.price', 'u.username'])
    .filter({ 'o.id': orderId })
    .getAll()
    .then(orders => {
      if (orders.length > 0) {
        res.status(200).json(orders);
      } else {
        res.json({ message: `No Orders Found with OrderId: ${orderId}` });
      }
    }).catch(err => console.log(err));
});

/** PLACE A NEW ORDER */
router.post('/new', (req, res) => {
  let { userId, products } = req.body;

  // console.log(userId); return false;
  database.table('orders')
    .insert({
      user_id: userId
    }).then((newOrderId) => {
      if (newOrderId.insertId > 0) {

        products.forEach(async (p) => {
          let data = await database.table('products').filter({ id: p.id }).withFields(['quantity']).get();

          let inCart = p.inCart;

          if (data.quantity > 0) {
            data.quantity = data.quantity - inCart;

            if (data.quantity < 0) {
              data.quantity = 0;
            }
          } else {
            data.quantity = 0;
          }

          database.table('orders_details')
            .insert({
              order_id: newOrderId.insertId,
              product_id: p.id,
              quantity: p.inCart
            }).then(newId => {
              database.table('products')
                .filter({ id: p.id })
                .update({
                  quantity: data.quantity
                }).then(success => { }).catch(err => console.log(err));
            }).catch(err => console.log(err));

        })

      } else {
        res.json({ message: 'New order failed while adding order details', success: false });
      }

      res.json({
        message: `Order successfully placed with order id ${newOrderId.insertId}`,
        success: true,
        order_id: newOrderId,
        products: products
      });

    }).catch(err => console.log(err));
});

/** FAKE PAYMENT GATEWAY CALL */
router.post('/payment', (req, res) => {
  setTimeout(() => {
    res.status(200).json({ success: true });
  }, 3000);
});

module.exports = router;
