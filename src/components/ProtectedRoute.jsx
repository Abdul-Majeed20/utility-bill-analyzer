import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkUser } from "../redux/features/auth/authApi";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { user, loading, isLoggedIn } = useSelector((state) => state.auth);
  console.log("ProtectedRoute - user:", user, "loading:", loading);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(checkUser());
  }, [dispatch, location.pathname]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [user, loading, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? children : null;
}
