import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ApiService } from "../services/ApiService";

export const DepartmentsList = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/departments");
        const data = await response.json();
        setDepartments(data.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  if (loading) {
    return (
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Shop by Department
      </h2>
      <div className="space-y-2">
        {departments.map((dept) => (
          <Link
            key={dept._id}
            to={`/departments/${dept.slug || dept.name.toLowerCase()}`}
            className="block p-3 rounded-lg hover:bg-blue-50 transition-colors border border-gray-200"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">{dept.name}</span>
              <span className="text-sm text-gray-500">
                {dept.productCount || 0} products
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
