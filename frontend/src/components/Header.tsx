import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="bg-white shadow-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T41</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Think41 Store
            </span>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Products
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              About
            </Link>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Cart (0)
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
