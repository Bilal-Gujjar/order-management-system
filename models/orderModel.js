const knex = require('../db/knex.js');
const productModel = require('./productModel.js')


const listAllOrders = async () => {
    const data = await knex.raw(`SELECT * FROM "order";`);
    const orders = data.rows;

    for (let i = 0; i < orders.length; i++) {
        let orderItem = await knex.raw(`SELECT order_item_id, product_id, quantity, base_price, total_price FROM "order_item" WHERE order_id = ${orders[i].order_id};`);
        orders[i].order_items = orderItem.rows;
    }

    return orders;
}

const findOrderById = async (id) => {
    const data = await knex.raw(`SELECT * FROM "order" WHERE order_id = ${id};`);
    const order = data.rows[0];
    const orderItem = await knex.raw(`SELECT order_item_id, product_id, quantity, base_price, total_price FROM "order_item" WHERE order_id = ${order.order_id};`);
    order.order_items = orderItem.rows;
    return order;
}


const createOrder = async (productId, quantity, customerId) => {
    
    const productList = await knex.raw(`SELECT * FROM "product" WHERE product_id = ${productId};`);
    const productCount = productList.rows[0].quantity;
    const newProductCount = productCount - quantity;
    await productModel.updateProductQuantity(productId, newProductCount);
    const basePrice = await productModel.productPricebyId(productId);
    const totalPrice = basePrice.price * quantity;
  
    const orderData = {
        customer_id: customerId,
        grand_total: totalPrice,
    };

    const orderId = await knex("order").insert(orderData).returning("order_id");
    const orderIdValue = orderId[0].order_id;

    const orderItemData = {
        order_id: orderIdValue,
        product_id: productId,
        quantity: quantity,
        base_price: basePrice.price,
        total_price: totalPrice,
    };

    await knex("order_item").insert(orderItemData);

    return orderItemData;

};


module.exports = {
    listAllOrders,
    findOrderById,
    createOrder,
}
