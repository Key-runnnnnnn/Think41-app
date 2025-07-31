import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { SearchFilters } from "./SearchFilters";
import { Pagination } from "./Pagination";
import { ApiService } from "../services/ApiService";
import type { Product, ProductsResponse } from "../types/Product";

export const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
    hasNext: false,
    hasPrev: false,
  });

  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    category: "",
    brand: "",
    department: "",
    minPrice: "",
    maxPrice: "",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        ...filters,
        minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
      };

      const response: ProductsResponse = await ApiService.getProducts(params);

      if (response.success) {
        setProducts(response.data);
        setPagination(response.pagination);
      } else {
        setError("Failed to fetch products");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page ?? 1, // Reset to page 1 when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>

      <SearchFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        loading={loading}
      />

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="mb-6 text-gray-600">
            Showing {products.length} of {pagination.totalItems} products
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No products found matching your criteria.
              </p>
            </div>
          )}

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
          />
        </>
      )}
    </div>
  );
};
