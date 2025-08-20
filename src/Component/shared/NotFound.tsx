
import { useNavigate } from "react-router-dom";
import notfound from "../../assets/404-RORXqSi_.png";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
   
      <img
        src={notfound}
        alt="404 Not Found"
        className="max-w-md w-full mb-6"
      />

   
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        Oops! Page not found
      </h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      {/* زرار يرجع للـ Home */}
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-yellow-600 text-white font-medium rounded-lg shadow hover:bg-orange-600 transition-all duration-200"
      >
        Back to Login
      </button>
    </div>
  );
}
