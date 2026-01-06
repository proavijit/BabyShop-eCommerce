// diagnose_products.js
async function checkProducts() {
    const ports = [5000, 8000, 3000, 8080];

    if (typeof fetch === 'undefined') {
        console.error("fetch is not defined. Please use Node 18+");
        process.exit(1);
    }

    for (const port of ports) {
        const url = `http://localhost:${port}/api/products`; // Assume public or I can't access it
        console.log(`Trying ${url}...`);
        try {
            const res = await fetch(url);
            if (res.ok) {
                console.log(`Connected to ${url}`);
                const data = await res.json();
                // Pagination handling? usually { products: [...], ... } or just array
                const products = Array.isArray(data) ? data : (data.products || []);
                console.log(`Found ${products.length} products.`);

                let foundIssue = false;
                products.forEach(p => {
                    const img = p.image || (p.images && p.images[0]);
                    if (img && (typeof img === 'string' && img.includes("image:1"))) {
                        console.log(`!!! FOUND SUSPICIOUS IMAGE URL in Product ${p._id}: ${img}`);
                        foundIssue = true;
                    }
                    // Also check all images
                    if (p.images && Array.isArray(p.images)) {
                        p.images.forEach(i => {
                            if (typeof i === 'string' && i.includes("image:1")) {
                                console.log(`!!! FOUND SUSPICIOUS IMAGE URL within array in Product ${p._id}: ${i}`);
                                foundIssue = true;
                            }
                        })
                    }
                });

                if (!foundIssue) console.log("No obvious 'image:1' URLs found in products.");
                return;
            }
        } catch (e) {
            console.log(`Failed to connect to ${port} for products...`);
        }
    }
    console.log("Could not fetch products.");
}

checkProducts();
