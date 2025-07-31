import type { ProductsResponse, ProductResponse } from "../types/Product";

const API_BASE_URL = "http://localhost:5000/api";

export class ApiService {
  static async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    department?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, value.toString());
        }
      });
    }

    const url = `${API_BASE_URL}/products${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    return response.json();
  }

  static async getProductById(id: string | number): Promise<ProductResponse> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    return response.json();
  }

  static async getCategories(): Promise<string[]> {
    // This is a helper method to get unique categories
    // We'll extract this from the products data
    const response = await this.getProducts({ limit: 1000 });
    const categories = [
      ...new Set(response.data.map((product) => product.category)),
    ];
    return categories.sort();
  }

  static async getBrands(): Promise<string[]> {
    // This is a helper method to get unique brands
    const response = await this.getProducts({ limit: 1000 });
    const brands = [...new Set(response.data.map((product) => product.brand))];
    return brands.sort();
  }

  static async getDepartments(): Promise<string[]> {
    // This is a helper method to get unique departments
    const response = await this.getProducts({ limit: 1000 });
    const departments = [
      ...new Set(response.data.map((product) => product.department)),
    ];
    return departments.sort();
  }
}
