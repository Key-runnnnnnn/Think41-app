import { Link } from "react-router-dom";
import type { Product } from "../types/Product";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link
      to={`/product/${product.productId}`}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      <div className="aspect-square bg-gray-200 flex items-center justify-center">
        {product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-sm">No Image</div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate mb-2">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>

        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-green-600">
            ${product.retailPrice.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">{product.category}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              product.stock > 0
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>

          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-gray-600">
              {product.rating.average > 0
                ? product.rating.average.toFixed(1)
                : "N/A"}
            </span>
          </div>
        </div>

        {product.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};
