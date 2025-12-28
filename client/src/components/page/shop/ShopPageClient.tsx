import { useSearchParams } from "next/navigation";



interface ProductResponse {
    products: Product[];
    total: number
}

interface Props {
    categories: CategoryResponse;
    brands: BrandResponse;
    products: ProductResponse;
}
export default function ShopPageClient({ categories, brands, products }: Props) {
    const searchParams = useSearchParams();
    const [category, setCategory] = useState<string | null>(searchParams.get("category"));
    const [brand, setBrand] = useState<string | null>(searchParams.get("brand"));
    const [search, setSearch] = useState<string | null>(searchParams.get("search") || "");
    const [sort, setSort] = useState<string | null>(searchParams.get("sort") || "asc");
    const [page, setPage] = useState<number>(Number(searchParams.get("page")) || 1);
    const [limit, setLimit] = useState<number>(Number(searchParams.get("limit")) || 10);



    return (
        <div>
            <h1>Shop Page</h1>
        </div>
    )
}   