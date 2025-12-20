import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/productModel.js";
import Category from "./models/categoryModel.js";
import Brand from "./models/brandModel.js";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

// Sample Brands
const sampleBrands = [
    {
        name: "BabyLove",
        image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400"
    },
    {
        name: "TinyTots",
        image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400"
    },
    {
        name: "Little Angels",
        image: "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=400"
    },
    {
        name: "Cuddle & Co",
        image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400"
    },
    {
        name: "Happy Baby",
        image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400"
    },
    {
        name: "Bambino",
        image: "https://images.unsplash.com/photo-1558877385-8c7f5e5d6e8e?w=400"
    },
    {
        name: "Precious Moments",
        image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400"
    }
];

// Sample Categories
const sampleCategories = [
    {
        name: "Clothing & Apparel",
        image: "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=600",
        categoryType: "Featured"
    },
    {
        name: "Feeding & Nursing",
        image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600",
        categoryType: "Hot Categories"
    },
    {
        name: "Toys & Entertainment",
        image: "https://images.unsplash.com/photo-1558877385-8c7f5e5d6e8e?w=600",
        categoryType: "Featured"
    },
    {
        name: "Bath & Skincare",
        image: "https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=600",
        categoryType: "Top Categories"
    },
    {
        name: "Nursery & Decor",
        image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600",
        categoryType: "Featured"
    },
    {
        name: "Travel & Gear",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600",
        categoryType: "Hot Categories"
    },
    {
        name: "Health & Safety",
        image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600",
        categoryType: "Top Categories"
    },
    {
        name: "Diapers & Potty",
        image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600",
        categoryType: "Hot Categories"
    }
];

// Sample Products
const sampleProducts = [
    {
        name: "Organic Cotton Baby Onesie Set (Pack of 5)",
        description: "Soft, breathable organic cotton onesies perfect for newborns. Includes 5 different colors with snap closures for easy diaper changes. Hypoallergenic and gentle on sensitive skin.",
        price: 1299,
        discountPrice: 1599,
        stock: 45,
        ageGroup: "0-6 Months",
        isFeatured: true,
        categoryName: "Clothing & Apparel",
        brandName: "BabyLove",
        images: [
            "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=800",
            "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800"
        ]
    },
    {
        name: "Baby Sleeping Bag - Winter Edition",
        description: "Cozy and warm sleeping bag designed for safe sleep. TOG 2.5 rating perfect for winter nights. Features shoulder snaps and bottom zipper for easy access.",
        price: 2499,
        discountPrice: 3299,
        stock: 28,
        ageGroup: "6-12 Months",
        isFeatured: true,
        categoryName: "Clothing & Apparel",
        brandName: "Cuddle & Co",
        images: [
            "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800"
        ]
    },
    {
        name: "Silicone Baby Feeding Set",
        description: "Complete feeding set including plate, bowl, cup, and spoon. Made from food-grade silicone, BPA-free, microwave and dishwasher safe. Suction base prevents spills.",
        price: 899,
        discountPrice: 1199,
        stock: 67,
        ageGroup: "6-12 Months",
        isFeatured: false,
        categoryName: "Feeding & Nursing",
        brandName: "Happy Baby",
        images: [
            "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800"
        ]
    },
    {
        name: "Wooden Baby Activity Gym",
        description: "Montessori-inspired wooden play gym with hanging toys. Helps develop motor skills, hand-eye coordination, and sensory awareness. Natural wood finish, non-toxic paint.",
        price: 3499,
        discountPrice: 4299,
        stock: 15,
        ageGroup: "0-6 Months",
        isFeatured: true,
        categoryName: "Toys & Entertainment",
        brandName: "Little Angels",
        images: [
            "https://images.unsplash.com/photo-1558877385-8c7f5e5d6e8e?w=800"
        ]
    },
    {
        name: "Diaper Bag Backpack - Multi-Pocket",
        description: "Spacious diaper bag with 15+ pockets, insulated bottle holders, and changing pad included. Water-resistant fabric, USB charging port, and stroller straps.",
        price: 2199,
        discountPrice: 2899,
        stock: 34,
        ageGroup: "0-6 Months",
        isFeatured: false,
        categoryName: "Travel & Gear",
        brandName: "TinyTots",
        images: [
            "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800"
        ]
    },
    {
        name: "Baby Monitor with Camera - HD Night Vision",
        description: "Smart baby monitor with 1080p HD camera, two-way audio, temperature sensor, and lullaby player. Night vision up to 5 meters, mobile app compatible.",
        price: 4999,
        discountPrice: 6499,
        stock: 22,
        ageGroup: "0-6 Months",
        isFeatured: true,
        categoryName: "Health & Safety",
        brandName: "Precious Moments",
        images: [
            "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800"
        ]
    },
    {
        name: "Teething Toys Set - Natural Rubber",
        description: "Set of 4 teething toys made from 100% natural rubber. Different textures and shapes to soothe sore gums. Easy to grip, freezer-safe, and dishwasher safe.",
        price: 699,
        discountPrice: 999,
        stock: 89,
        ageGroup: "6-12 Months",
        isFeatured: false,
        categoryName: "Toys & Entertainment",
        brandName: "Happy Baby",
        images: [
            "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800"
        ]
    },
    {
        name: "Baby Bath Tub with Temperature Indicator",
        description: "Ergonomic baby bath tub with built-in temperature indicator that changes color. Non-slip surface, drain plug, and newborn support insert included.",
        price: 1799,
        discountPrice: 2299,
        stock: 31,
        ageGroup: "0-6 Months",
        isFeatured: false,
        categoryName: "Bath & Skincare",
        brandName: "BabyLove",
        images: [
            "https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=800"
        ]
    },
    {
        name: "Stroller Rain Cover - Universal Fit",
        description: "Transparent rain cover that fits most strollers. Provides full protection from rain and wind while maintaining visibility. Easy to install and fold.",
        price: 599,
        stock: 56,
        ageGroup: "0-6 Months",
        isFeatured: false,
        categoryName: "Travel & Gear",
        brandName: "TinyTots",
        images: [
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800"
        ]
    },
    {
        name: "Baby Hooded Towel Set (Pack of 2)",
        description: "Ultra-soft bamboo hooded towels with cute animal designs. Highly absorbent, hypoallergenic, and quick-drying. Perfect for bath time and swimming.",
        price: 1099,
        discountPrice: 1499,
        stock: 42,
        ageGroup: "0-6 Months",
        isFeatured: false,
        categoryName: "Bath & Skincare",
        brandName: "Cuddle & Co",
        images: [
            "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800"
        ]
    },
    {
        name: "Baby Carrier - Ergonomic 4-in-1",
        description: "Versatile baby carrier with 4 carrying positions. Padded shoulder straps, lumbar support, and breathable mesh panels. Suitable from newborn to toddler.",
        price: 3299,
        discountPrice: 4199,
        stock: 19,
        ageGroup: "0-6 Months",
        isFeatured: true,
        categoryName: "Travel & Gear",
        brandName: "Little Angels",
        images: [
            "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800"
        ]
    },
    {
        name: "Nursery Night Light - Star Projector",
        description: "Soothing star projector night light with 8 color modes and timer function. Plays gentle lullabies and white noise. Remote control included.",
        price: 1499,
        discountPrice: 1999,
        stock: 38,
        ageGroup: "0-6 Months",
        isFeatured: false,
        categoryName: "Nursery & Decor",
        brandName: "Precious Moments",
        images: [
            "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800"
        ]
    },
    {
        name: "Baby Milestone Blanket - Monthly Photo Prop",
        description: "Soft fleece blanket with month markers for tracking baby's growth. Perfect for monthly photo shoots. Machine washable, 40x40 inches.",
        price: 899,
        stock: 51,
        ageGroup: "0-6 Months",
        isFeatured: false,
        categoryName: "Nursery & Decor",
        brandName: "BabyLove",
        images: [
            "https://images.unsplash.com/photo-1519689373023-dd07c7988603?w=800"
        ]
    },
    {
        name: "Baby Nail Care Set - Electric Trimmer",
        description: "Safe electric nail trimmer with LED light and 6 grinding heads for different ages. Quiet operation, USB rechargeable, and includes nail file and scissors.",
        price: 1299,
        stock: 44,
        ageGroup: "0-6 Months",
        isFeatured: false,
        categoryName: "Health & Safety",
        brandName: "Happy Baby",
        images: [
            "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800"
        ]
    },
    {
        name: "Toddler Learning Tower - Kitchen Helper",
        description: "Adjustable wooden learning tower that grows with your child. Helps toddlers safely reach countertops. Anti-slip platform and safety rails included.",
        price: 5499,
        discountPrice: 6999,
        stock: 12,
        ageGroup: "1-3 Years",
        isFeatured: true,
        categoryName: "Toys & Entertainment",
        brandName: "Bambino",
        images: [
            "https://images.unsplash.com/photo-1558877385-8c7f5e5d6e8e?w=800"
        ]
    },
    {
        name: "Baby Swaddle Blankets - Muslin (Pack of 3)",
        description: "Breathable muslin swaddle blankets in beautiful prints. 47x47 inches, gets softer with each wash. Multi-purpose: swaddle, nursing cover, stroller cover.",
        price: 1599,
        discountPrice: 2099,
        stock: 63,
        ageGroup: "0-6 Months",
        isFeatured: false,
        categoryName: "Clothing & Apparel",
        brandName: "Cuddle & Co",
        images: [
            "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800"
        ]
    },
    {
        name: "Baby Bottle Warmer & Sterilizer 2-in-1",
        description: "Fast bottle warmer and steam sterilizer in one device. Fits all bottle sizes, auto shut-off, and keeps bottles warm. BPA-free materials.",
        price: 2799,
        discountPrice: 3499,
        stock: 27,
        ageGroup: "0-6 Months",
        isFeatured: false,
        categoryName: "Feeding & Nursing",
        brandName: "Happy Baby",
        images: [
            "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800"
        ]
    },
    {
        name: "Baby Playmat - Extra Large Foam",
        description: "Non-toxic XPE foam playmat, 78x70 inches. Waterproof, easy to clean, reversible design. Provides cushioned surface for tummy time and play.",
        price: 3999,
        discountPrice: 4999,
        stock: 18,
        ageGroup: "0-6 Months",
        isFeatured: true,
        categoryName: "Toys & Entertainment",
        brandName: "Little Angels",
        images: [
            "https://images.unsplash.com/photo-1558877385-8c7f5e5d6e8e?w=800"
        ]
    },
    {
        name: "Premium Diapers - Overnight Protection (Size 3)",
        description: "Ultra-absorbent diapers with 12-hour leak protection. Soft, breathable material with wetness indicator. Hypoallergenic and fragrance-free. Pack of 84.",
        price: 1899,
        discountPrice: 2299,
        stock: 95,
        ageGroup: "6-12 Months",
        isFeatured: true,
        categoryName: "Diapers & Potty",
        brandName: "BabyLove",
        images: [
            "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800"
        ]
    },
    {
        name: "Baby Humidifier - Cool Mist Ultrasonic",
        description: "Whisper-quiet humidifier with 3L capacity, runs up to 30 hours. Auto shut-off when empty, adjustable mist levels, and optional night light feature.",
        price: 2299,
        discountPrice: 2999,
        stock: 33,
        ageGroup: "0-6 Months",
        isFeatured: false,
        categoryName: "Nursery & Decor",
        brandName: "Precious Moments",
        images: [
            "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800"
        ]
    }
];

const seedDatabase = async () => {
    try {
        await connectDB();

        console.log("\n🗑️  Clearing existing data...");
        await Product.deleteMany({});
        await Category.deleteMany({});
        await Brand.deleteMany({});
        console.log("✅ Database cleared");

        // Step 1: Create Brands
        console.log("\n📦 Creating brands...");
        const createdBrands = await Brand.insertMany(sampleBrands);
        console.log(`✅ Created ${createdBrands.length} brands`);

        // Step 2: Create Categories
        console.log("\n📁 Creating categories...");
        const createdCategories = await Category.insertMany(sampleCategories);
        console.log(`✅ Created ${createdCategories.length} categories`);

        // Step 3: Create Products with proper relationships
        console.log("\n�️  Creating products...");

        // Create a map for quick lookups
        const brandMap = {};
        createdBrands.forEach(brand => {
            brandMap[brand.name] = brand._id;
        });

        const categoryMap = {};
        createdCategories.forEach(category => {
            categoryMap[category.name] = category._id;
        });

        // Map products to their categories and brands
        const productsToInsert = sampleProducts.map(product => {
            const { categoryName, brandName, ...productData } = product;

            return {
                ...productData,
                category: categoryMap[categoryName],
                brand: brandMap[brandName]
            };
        });

        const createdProducts = await Product.insertMany(productsToInsert);
        console.log(`✅ Created ${createdProducts.length} products`);

        // Summary
        console.log("\n" + "=".repeat(60));
        console.log("📊 DATABASE SEEDING SUMMARY");
        console.log("=".repeat(60));
        console.log(`\n✅ Brands: ${createdBrands.length}`);
        createdBrands.forEach(brand => console.log(`   - ${brand.name}`));

        console.log(`\n✅ Categories: ${createdCategories.length}`);
        createdCategories.forEach(cat => console.log(`   - ${cat.name} (${cat.categoryType})`));

        console.log(`\n✅ Products: ${createdProducts.length}`);
        console.log(`   - Featured Products: ${createdProducts.filter(p => p.isFeatured).length}`);
        console.log(`   - Total Stock Units: ${createdProducts.reduce((sum, p) => sum + p.stock, 0).toLocaleString()}`);
        console.log(`   - Total Stock Value: ৳${createdProducts.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}`);

        console.log("\n" + "=".repeat(60));
        console.log("🎉 Database seeding completed successfully!");
        console.log("=".repeat(60) + "\n");

        process.exit(0);
    } catch (error) {
        console.error("\n❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
