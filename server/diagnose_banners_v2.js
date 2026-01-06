// diagnose_banners_v2.js
async function checkBanners() {
    const ports = [5000, 8000, 3000, 8080];

    if (typeof fetch === 'undefined') {
        console.error("fetch is not defined. Please use Node 18+");
        process.exit(1);
    }

    for (const port of ports) {
        const url = `http://localhost:${port}/api/banners`;
        console.log(`Trying ${url}...`);
        try {
            const res = await fetch(url);
            if (res.ok) {
                console.log(`Connected to ${url}`);
                const data = await res.json();
                console.log(`Found ${data.length} banners.`);

                // Handle { banners: [...] } format if applicable
                const banners = Array.isArray(data) ? data : (data.banners || []);

                let foundIssue = false;
                banners.forEach(b => {
                    console.log(`Banner ${b._id || 'unknown'}: ${b.image}`);
                    if (!b.image || (typeof b.image === 'string' && b.image.includes("image:1"))) {
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

checkBanners();
