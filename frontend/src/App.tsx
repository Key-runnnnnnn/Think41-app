import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { ProductGrid } from "./components/ProductGrid";
import { ProductDetail } from "./components/ProductDetail";
import { DepartmentPage } from "./components/DepartmentPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<ProductGrid />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/departments/:slug" element={<DepartmentPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          About Think41 Store
        </h1>
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-4">
            Welcome to Think41 Store, your one-stop destination for quality
            products across multiple categories. We offer a wide range of items
            from trusted brands to meet all your shopping needs.
          </p>
          <p className="text-gray-600 mb-4">
            Our platform features over 29,000 products across various categories
            including:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            <li>Sleep & Lounge</li>
            <li>Swim</li>
            <li>Undergarments</li>
            <li>Socks</li>
            <li>And many more...</li>
          </ul>
          <p className="text-gray-600">
            Built with modern technology including React, TypeScript, Tailwind
            CSS, and powered by a robust REST API.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
