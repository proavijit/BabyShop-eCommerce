const fetch = require('node-fetch'); // Assuming node-fetch is available, or use built-in fetch for Node 18+

/*
  Simple script to fetch banners and check for invalid image URLs.
*/

async function checkBanners() {
    const ports = [5000, 8000, 3000, 8080];

    for (const port of ports) {
        const url = `http://localhost:${port}/api/banners`;
        console.log(`Trying ${url}...`);
        try {
            const res = await fetch(url);
            if (res.ok) {
                console.log(`Connected to ${url}`);
                const data = await res.json();
                console.log(`Found ${data.length} banners.`);

                let foundIssue = false;
                data.forEach(b => {
                    console.log(`Banner ${b._id}: ${b.image}`);
                    if (!b.image || b.image.includes("image:1")) {
                        console.log("!!! FOUND SUSPICIOUS IMAGE URL !!!");
                        foundIssue = true;
                    }
                });

                if (!foundIssue) console.log("No obvious 'image:1' URLs found in banners.");
                return;
            } else {
                console.log(`Status ${res.status} from ${port}`);
            }
        } catch (e) {
            console.log(`Failed to connect to ${port}: ${e.message}`);
        }
    }
    console.log("Could not fetch banners from any common port.");
}

// Check if fetch is available (Node 18+)
if (!globalThis.fetch) {
    console.log("Fetch not available globally, trying require...");
    try {
        globalThis.fetch = require('node-fetch');
    } catch (e) {
        console.error("Please run with Node 18+ or install node-fetch");
        process.exit(1);
    }
}

checkBanners();
