import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Signup } from "./pages/Signup";
import { ThemeProvider } from "./components/theme-provider";
import { UserContextProvider } from "./context/userContext";
import { useState } from "react";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import DashboardProtect from "./protectedRoute/DashboardProtect";
import Cookies from "js-cookie";
import Login from "./pages/login";
import ContactUs from "./pages/ContactUs";
import Dashboar from "./pages/Dashboar";
import CreateEmploye from "./pages/CreateEmploye";
import EmployeeList from "./pages/EmployeeList";
export default function App() {
  const [userData, setUserData] = useState(null);
  const getAuthStatus = (cookieValue: string | undefined): boolean => {
    return cookieValue === "true"; // Convert the string "true" to the boolean true
  };
  
  const [isAuthenticated, setAuthnticated] = useState<boolean>(
    getAuthStatus(Cookies.get("isAuthenticated"))
  )

  return (
    <div>
      <UserContextProvider
        value={{ userData, setUserData, isAuthenticated, setAuthnticated }}
      >
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<Login/>} />
              <Route path="/signup" element={<Signup />} />
                <Route path="/contact-us" element={<ContactUs />} />

              <Route
                element={<DashboardProtect isAuthenticated={isAuthenticated} />}
              >
                <Route path="/dashboard" element={<Dashboar />} />
                <Route path="/dashboard/create-employee" element={<CreateEmploye />} />
                <Route path="/dashboard/employee-list" element={<EmployeeList />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </UserContextProvider>
    </div>
  );
}
