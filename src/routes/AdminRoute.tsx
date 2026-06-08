import { Navigate } from "react-router-dom";

import { useAuth }
from "../hooks/useAuth";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {

  const { role } = useAuth();

  if (role !== "ADMIN") {

    return <Navigate to="/" />;
  }

  return children;
}