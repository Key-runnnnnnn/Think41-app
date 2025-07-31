# Think41 E-commerce Database Design

## Overview

This document outlines the MongoDB database schema designed for the Think41 e-commerce application based on the analysis of the products.csv file containing ~29,121 products.

## Database Statistics

- **Total Products**: 29,120
- **Categories**: 26 unique categories
- **Departments**: 2 (Men: 13,131, Women: 15,989)
- **Brands**: 1000+ unique brands
- **Distribution Centers**: Multiple centers

## Database Models

### 1. Product Model (`products` collection)

#### Core Fields (from CSV)

- `productId`: Unique product identifier (from CSV id)
- `name`: Product name
- `brand`: Brand name (indexed)
- `category`: Product category (indexed, enum validated)
- `department`: Men/Women (indexed)
- `cost`: Manufacturing/wholesale cost
- `retailPrice`: Selling price (indexed)
- `sku`: Stock Keeping Unit (unique, indexed)
- `distributionCenterId`: Reference to distribution center

#### Extended E-commerce Fields

- `description`: Product description
- `images`: Array of product images with URLs and alt text
- `sizes`: Array of available sizes with individual stock levels
- `colors`: Array of available colors
- `stock`: Total stock quantity
- `isActive`: Product availability status
- `weight`: Product weight for shipping
- `dimensions`: Length, width, height
- `tags`: Array of searchable tags
- `rating`: Average rating and review count
- `seoData`: SEO metadata including slug, meta title, description

#### Indexes

- Text index on name, description, brand for search
- Compound indexes on category+department, brand+category
- Price range index for filtering

### 2. Category Model (`categories` collection)

- `name`: Category name (unique, indexed)
- `description`: Category description
- `department`: Target department
- `parentCategory`: Reference for hierarchical categories
- `isActive`: Category status
- `sortOrder`: Display order
- `image`: Category image
- `seoData`: SEO optimization data

### 3. Brand Model (`brands` collection)

- `name`: Brand name (unique, indexed)
- `description`: Brand description
- `logo`: Brand logo image
- `website`: Brand website URL
- `isActive`: Brand status
- `country`: Brand origin country
- `establishedYear`: Brand establishment year
- `seoData`: SEO metadata

### 4. User Model (`users` collection)

- `firstName`, `lastName`: User name
- `email`: Unique email (indexed)
- `password`: Encrypted password
- `phone`: Contact number
- `dateOfBirth`: User birthday
- `gender`: User gender
- `isActive`: Account status
- `isEmailVerified`: Email verification status
- `role`: customer/admin/manager
- `preferences`: Shopping preferences (department, categories, brands, price range)
- `addresses`: Array of shipping addresses
- `lastLogin`: Last login timestamp
- `loginCount`: Total login count

### 5. Cart Model (`carts` collection)

- `user`: Reference to User
- `items`: Array of cart items with product, quantity, size, color, price
- `isActive`: Cart status
- Virtuals: `totalItems`, `totalAmount`

### 6. Order Model (`orders` collection)

- `orderNumber`: Unique order identifier
- `user`: Reference to User
- `items`: Array of ordered items with product details
- `status`: Order status (pending → confirmed → processing → shipped → delivered)
- `paymentStatus`: Payment status
- `shippingAddress`: Delivery address
- `billingAddress`: Billing address
- `pricing`: Subtotal, tax, shipping, discount, total
- `shipping`: Shipping method, tracking, delivery dates
- `payment`: Payment method and transaction details
- `orderHistory`: Status change log

### 7. DistributionCenter Model (`distributioncenters` collection)

- `centerId`: Unique center identifier
- `name`: Center name
- `address`: Complete address information
- `contact`: Contact details
- `isActive`: Operational status
- `capacity`: Storage capacity
- `servingRegions`: Areas served
- `operatingHours`: Weekly schedule

### 8. Review Model (`reviews` collection)

- `user`: Reference to User
- `product`: Reference to Product
- `order`: Reference to Order (for verified purchases)
- `rating`: 1-5 star rating
- `title`: Review title
- `content`: Review content
- `images`: Review images
- `isVerifiedPurchase`: Purchase verification
- `isApproved`: Moderation status
- `helpfulCount`: Helpful votes
- `size`, `color`: Product variant reviewed
- `fit`: Size fit feedback
- `quality`, `value`: Additional ratings

## Key Design Decisions

### 1. Denormalization for Performance

- Product documents include frequently accessed data to reduce joins
- Category and brand names stored directly in products for fast filtering

### 2. Flexible Schema

- Size/color variants stored as arrays to handle different product types
- Extensible address and preference structures

### 3. Indexing Strategy

- Compound indexes for common query patterns
- Text search index for product search functionality
- Department and category indexes for filtering

### 4. Data Integrity

- Enum validation for categories and departments
- Required field validation
- Unique constraints on SKUs and email addresses

### 5. SEO Optimization

- Slug generation for all public-facing entities
- Meta title and description fields
- URL-friendly identifiers

## API Endpoints

### Products

- `GET /api/products` - List products with filtering and pagination
- `GET /api/products/featured` - Get featured products
- `GET /api/products/category/:category` - Products by category
- `GET /api/products/:id` - Single product details

### Categories

- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Category details

### Brands

- `GET /api/brands` - List all brands
- `GET /api/brands/:id` - Brand details

## Data Import

The system includes a comprehensive data import script (`scripts/importData.js`) that:

1. **Parses CSV data** and validates fields
2. **Creates normalized data** for categories, brands, and distribution centers
3. **Generates additional fields** like descriptions, SEO data, and stock levels
4. **Imports data in batches** for memory efficiency
5. **Creates database indexes** for optimal performance

### Import Command

```bash
npm run import
```

## Environment Setup

1. **Copy environment file**:

   ```bash
   cp .env.example .env
   ```

2. **Configure MongoDB URI** in `.env`:

   ```
   MONGO_URI=mongodb://localhost:27017/think41_ecommerce
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Import data**:

   ```bash
   npm run import
   ```

5. **Start server**:
   ```bash
   npm run dev
   ```

## Performance Considerations

### Indexes

- Strategic compound indexes for common query patterns
- Text search indexes for product search
- Sparse indexes for optional fields

### Pagination

- Efficient pagination with skip/limit
- Cursor-based pagination option for large datasets

### Caching Strategy

- Redis integration planned for:
  - Frequently accessed product data
  - Category and brand lists
  - Search results
  - User sessions

### Query Optimization

- Projection to exclude unnecessary fields
- Aggregation pipelines for complex queries
- Virtuals for calculated fields

## Future Enhancements

1. **Authentication & Authorization**

   - JWT-based authentication
   - Role-based access control
   - OAuth integration

2. **Advanced Features**

   - Wishlist functionality
   - Product recommendations
   - Inventory management
   - Analytics and reporting

3. **Performance Optimizations**

   - Redis caching layer
   - CDN integration for images
   - Database sharding for scale

4. **Additional Models**
   - Coupons and promotions
   - Shipping providers
   - Tax configurations
   - Analytics events

This database design provides a solid foundation for a scalable e-commerce platform while maintaining flexibility for future enhancements.
