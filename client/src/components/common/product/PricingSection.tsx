interface PricingSectionProps {
    price: number;
    discountPrice?: number;
}

export default function PricingSection({ price, discountPrice }: PricingSectionProps) {
    const hasDiscount = discountPrice && discountPrice < price;
    const finalPrice = hasDiscount ? discountPrice! : price;
    const savings = hasDiscount ? price - discountPrice! : 0;

    return (
        <div className="space-y-2 py-6">
            <div className="flex items-baseline gap-4" aria-label="Price information">
                <span className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tighter">
                    ${finalPrice.toFixed(2)}
                </span>

                {hasDiscount && (
                    <span
                        className="text-xl md:text-2xl text-gray-400 line-through font-medium"
                        aria-label={`Original price was $${price.toFixed(2)}`}
                    >
                        ${price.toFixed(2)}
                    </span>
                )}
            </div>

            {hasDiscount && (
                <div className="flex items-center gap-2">
                    <span className="inline-block px-3 py-1 bg-red-50 text-babyshopRed text-xs font-bold rounded-full animate-pulse uppercase tracking-wider">
                        Save ${savings.toFixed(2)} Today
                    </span>
                </div>
            )}
        </div>
    );
}
