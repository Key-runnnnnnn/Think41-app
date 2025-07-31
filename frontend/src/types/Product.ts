export interface Product {
  _id: string;
  productId: number;
  name: string;
  brand: string;
  category: string;
  department: string;
  cost: number;
  retailPrice: number;
  sku: string;
  distributionCenterId: number;
  description: string;
  colors: string[];
  isActive: boolean;
  stock: number;
  tags: string[];
  images: string[];
  sizes: string[];
  createdAt: string;
  updatedAt: string;
  profitMargin: number;
  profitPercentage: string;
  id: string;
  rating: {
    average: number;
    count: number;
  };
  seoData: {
    metaTitle: string;
    metaDescription: string;
  };
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

export interface ErrorResponse {
  success: false;
  message: string;
}
