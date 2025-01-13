import { v2 as cloudinary } from 'cloudinary'
import productModel from '../models/productModel.js'
import mongoose from 'mongoose';

// Function for add product
const addProduct = async(req, res) => {
    try {
        const {name, description, price, category, subCategory, sizes, bestseller} = req.body;
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'});
                return result.secure_url
            })
        )

        // console.log(name, description, price, category, subCategory, sizes, bestseller)
        // console.log(imagesUrl)

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData)

        const product = new productModel(productData);
        await product.save()
        res.json({success: true, message: "Product Added"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message:error.message})
    }
}

// Function for List product
const listProducts = async(req, res) => {
    try {
        
        const products = await productModel.find({});
        res.json({success: true, products})

    } catch (error) {
        console.log(error);
        res.json({success: false, message:error.message})
    }
}

// Function for removing product
const removeProduct = async(req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success: true, message: "Product Removed"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message:error.message})
    }
}

// Function for single product info
const singleProduct = async (req, res) => {
    try {
        // console.log("Received itemId:", req.params.itemId || req.query.itemId || req.body.itemId);
        // const { itemId } = req.body;
        const currentId = new mongoose.Types.ObjectId(req.params.itemId || req.query.itemId || req.body.itemId)
        console.log(currentId);
        const product = await productModel.findOne({_id: currentId});
        console.log("pp: ",product)
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Updating the product:
// Updating the product:
const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;
        const { itemId } = req.params;

        // Retrieve existing product data
        const existingProduct = await productModel.findById(itemId);
        console.log("Existing Product:", existingProduct);
        if (!existingProduct) {
            return res.json({ success: false, message: "Product not found" });
        }

        // Handle new image uploads if provided
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];
        console.log("Image 1:",image1)
        console.log("Image 2:", image2)
        console.log("Image 3:", image3)
        console.log("Image 4:", image4)
        console.log("req.files:", req.files);

        // Upload new images and retrieve their URLs
        const images = [image1, image2, image3, image4].filter(Boolean);
        const uploadedImages = images.length > 0 
            ? await Promise.all(images.map(async (image) => {
                const result = await cloudinary.uploader.upload(image.path, { resource_type: 'image' });
                return result.secure_url;
            }))
            : [];

        // Combine new images with existing images in respective positions
        const finalImages = [
            (uploadedImages[0] !== undefined ? uploadedImages[0] : existingProduct.image[0]),
            // uploadedImages[0] || existingProduct.image[0],
            uploadedImages[1] || existingProduct.image[1],
            uploadedImages[2] || existingProduct.image[2],
            uploadedImages[3] || existingProduct.image[3],
        ].filter(Boolean); // Remove any null or undefined entries
        console.log("Final Images:", finalImages);

        // Construct updated product data
        const updatedProductData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true",
            sizes: JSON.parse(sizes),
            image: finalImages,
            date: Date.now()
        };

        // Update the product in the database
        const updatedProduct = await productModel.findByIdAndUpdate(itemId, updatedProductData, { new: true });
        console.log("Updated Product:", updatedProduct);

        res.json({ success: true, message: "Product Updated", product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        res.json({ success: false, message: error.message });
    }
};







export {listProducts, addProduct, removeProduct, singleProduct, updateProduct}