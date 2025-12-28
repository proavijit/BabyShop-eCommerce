import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load models
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";

dotenv.config({ path: path.join(__dirname, "../.env") });

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw new Error("MONGO_URI not found in environment variables");
        }
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const populateSlugs = async () => {
    await connectDB();

    try {
        console.log("Populating product slugs...");
        const products = await Product.find({});
        let productCount = 0;
        for (const product of products) {
            if (!product.slug) {
                await product.save();
                productCount++;
                console.log(`Updated product: ${product.name} -> ${product.slug}`);
            }
        }
        console.log(`Successfully updated ${productCount} products.`);

        console.log("Populating category slugs...");
        const categories = await Category.find({});
        let categoryCount = 0;
        for (const category of categories) {
            if (!category.slug) {
                await category.save();
                categoryCount++;
                console.log(`Updated category: ${category.name} -> ${category.slug}`);
            }
        }
        console.log(`Successfully updated ${categoryCount} categories.`);

        console.log("Migration complete!");
    } catch (error) {
        console.error(`Migration failed: ${error.message}`);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

populateSlugs();
