const productModel = require('../models/productModel.js');

const getProducts = async (req, res) => {
    const products = await productModel.listAllProducts();
    res.status(200).send(products);
}

const getProductById = async (req, res) => {
    const productId = req.params.id;
    
    const product = await productModel.getProductById(productId);
    if (!product) {
        return res.status(404).send({ message: 'Product not found' });
    }
    res.status(200).send(product);
}

const updateProduct = async (req, res) => {
    const productId = req.params.id;
    const updates = req.body;

    try {
        const updatedProduct = await productModel.updateProductById(productId, updates);
        if (!updatedProduct) {
            return res.status(404).send({ message: 'Product not found' });
        }
        res.status(200).send(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred while updating the product' });
    }
}


module.exports = {
    getProducts,
    getProductById,
    updateProduct,
}
