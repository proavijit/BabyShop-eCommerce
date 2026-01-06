interface PricingSectionProps {
    price: number;
    discountPrice?: number;
}

export default function PricingSection({ price, discountPrice }: PricingSectionProps) {
    const hasDiscount = discountPrice && discountPrice < price;
    const finalPrice = hasDiscount ? discountPrice! : price;
    const savings = hasDiscount ? price - discountPrice! : 0;

    return (
        <div className="py-4">
            <div className="flex items-center gap-3 flex-wrap" aria-label="Price information">
                {hasDiscount && (
                    <span
                        className="text-xl text-gray-400 line-through font-medium"
                        aria-label={`Original price was $${price.toFixed(2)}`}
                    >
                        ${price.toFixed(2)}
                    </span>
                )}

                <span className={`text-3xl md:text-4xl font-extrabold tracking-tight ${hasDiscount ? 'text-babyshopRed' : 'text-gray-900'}`}>
                    ${finalPrice.toFixed(2)}
                </span>
            </div>
        </div>
    );
}
