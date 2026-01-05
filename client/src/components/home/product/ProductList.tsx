import ProductSection from "./ProductSection";

export default function ProductList() {
    return (
        <div className="mt-10 space-y-16">
            <ProductSection
                title="Featured Picks"
                description="Specially curated for your little one"
                query={{ isFeatured: true }}
                viewAllLink="/shop?featured=true"
            />
            <ProductSection
                title="Trending Style"
                description="What other parents are loving"
                query={{ trending: true }}
                viewAllLink="/shop?trending=true"
                accentColor="bg-amber-400"
            />
            <ProductSection
                title="Exclusive Deals"
                description="Premium quality, better prices"
                query={{ isBestDeal: true }}
                viewAllLink="/shop?deals=true"
                accentColor="bg-rose-400"
            />
        </div>
    );
}