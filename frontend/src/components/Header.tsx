import { Link } from "react-router-dom";
import { useState } from "react";

export const Header = () => {
  const [showDepartments, setShowDepartments] = useState(false);

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
              All Products
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowDepartments(!showDepartments)}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors flex items-center"
              >
                Departments
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showDepartments && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-4">
                    <div className="space-y-2">
                      <Link
                        to="/departments/men"
                        className="block p-2 rounded hover:bg-gray-100 text-gray-700"
                        onClick={() => setShowDepartments(false)}
                      >
                        Men's Department
                      </Link>
                      <Link
                        to="/departments/women"
                        className="block p-2 rounded hover:bg-gray-100 text-gray-700"
                        onClick={() => setShowDepartments(false)}
                      >
                        Women's Department
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

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

      {/* Close dropdown when clicking outside */}
      {showDepartments && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDepartments(false)}
        ></div>
      )}
    </header>
  );
};
