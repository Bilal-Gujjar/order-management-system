const orderModel = require('../models/orderModel.js');
const productModel = require('../models/productModel.js');

const getOrders = async (req, res) => {
    const orders = await orderModel.listAllOrders();
    res.status(200).send(orders);
}

const getOrderById = async (req, res) => {
    const id = req.params.id;
    const order = await orderModel.findOrderById(id);
    res.status(200).send(order);
}

const createOrder = async (req, res) => {

    const { productId, quantity, customerId } = req.body;

    const product = await productModel.getProductById(productId);

    if (!product) {
        return res.status(404).send({ message: 'Product not found' });
    }
    if (product.quantity < quantity) {
        return res.status(400).send({ message: 'Not enough quantity available' });
    }
    const orderList = await orderModel.createOrder(productId, quantity, customerId);

    res.status(201).send(orderList);
}

module.exports = {
    getOrders,
    getOrderById,
    createOrder
}
