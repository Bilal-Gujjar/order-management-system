const e = require('express');
const knex = require('../db/knex.js');

const listAllProducts = async () => {
    const data = await knex.raw(`SELECT * FROM "product";`);
    return data.rows;
}

const getProductById = async (id) => {
    const product = await knex.select('*').from('product').where('product_id', id).first();
    return product;
}

const updateProductById = async (id, updatedProduct) => {
    await knex('product')
        .where('product_id', id)
        .update(updatedProduct);
    return getProductById(id);
}

const updateProductQuantity = async (id, quantity) => {

    await knex('product')
        .where('product_id', id)
        .update({ quantity });
}

const productPricebyId = async (id) => {
    const productPricebyId = await knex.select('price').from('product').where('product_id', id).first();
    return productPricebyId;
}



module.exports = {
    listAllProducts,
    getProductById,
    updateProductById,
    updateProductQuantity,
    productPricebyId
}