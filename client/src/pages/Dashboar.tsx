import React from "react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboar = () => {
  const naviagte = useNavigate();
  return (
    <div className="h-screen flex items-center justify-center ">
      <div className="w-fit p-4">
        <h1 className="text-4xl font-bold text-center">Welcome to Dashboard</h1>
        <br />

        <div className="flex justify-center items-center space-x-8 my-4">
          <Button
            variant="outline"
            onClick={() => naviagte("/dashboard/create-employee")}
          >
            Create Employee
          </Button>
          <Button
            type="submit"
            onClick={() => naviagte("/dashboard/employee-list")}
          >
            Employee list
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboar;
