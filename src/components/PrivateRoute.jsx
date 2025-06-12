import { Navigate } from 'react-router-dom';
import { auth } from "../firebaseConfig";
import { useAuth } from "../context/authContext"; // ✅ make sure this path is correct


const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
