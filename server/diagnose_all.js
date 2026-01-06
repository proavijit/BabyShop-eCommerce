// diagnose_all.js
async function checkAll() {
    const ports = [5000, 8000, 3000, 8080];

    if (typeof fetch === 'undefined') {
        console.error("fetch is not defined. Please use Node 18+");
        process.exit(1);
    }

    for (const port of ports) {
        const baseUrl = `http://localhost:${port}/api`;
        console.log(`Checking API at ${baseUrl}...`);

        try {
            // Check connectivity first
            const pRes = await fetch(`${baseUrl}/products`);
            if (!pRes.ok) {
                console.log(`Skipping ${port} (status ${pRes.status})`);
                continue;
            }

            console.log(`Connected to ${port}. Checking endpoints...`);

            const endpoints = ['products', 'brands', 'categories'];

            for (const ep of endpoints) {
                try {
                    const res = await fetch(`${baseUrl}/${ep}`);
                    const data = await res.json();
                    const items = Array.isArray(data) ? data : (data[ep] || []);
                    console.log(`Scanned ${items.length} ${ep}.`);

                    items.forEach(item => {
                        const img = item.image || (item.images && item.images[0]);
                        if (img && (typeof img === 'string' && img.includes("image:1"))) {
                            console.log(`!!! FOUND SUSPICIOUS IMAGE URL in ${ep}/${item._id}: ${img}`);
                        }
                    });
                } catch (e) {
                    console.log(`Error checking ${ep}: ${e.message}`);
                }
            }
            return; // Success on this port
        } catch (e) {
            // try next port
        }
    }
    console.log("Could not connect to API.");
}

checkAll();
