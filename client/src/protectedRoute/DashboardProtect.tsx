import { Navigate, Outlet } from "react-router-dom";

const DashboardProtect = ({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) => {
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }
  return <Outlet />;
};

export default DashboardProtect;
