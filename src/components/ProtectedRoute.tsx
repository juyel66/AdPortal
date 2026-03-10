import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/reduxHooks";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
