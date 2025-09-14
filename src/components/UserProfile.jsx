import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  // Safety check - make sure user is an object with expected properties
  if (typeof user !== 'object' || user === null) {
    console.error("UserProfile - user is not an object:", user);
    return <div>Error: Invalid user data</div>;
  }

  // Debug: Log user object to console
  console.log("UserProfile - user object:", user);

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {String(user.name || "N/A")}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {String(user.email || "N/A")}
        </p>
      </div>
      
      <button
        onClick={handleLogout}
        className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
      >
        Đăng xuất
      </button>
    </div>
  );
}
