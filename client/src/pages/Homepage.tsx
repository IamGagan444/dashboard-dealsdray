import React from "react";
import { Calendar } from "../components/ui/calendar";
import { ModeToggle } from "../components/ModeToggle";

const Homepage = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div className="flex flex-col justify-center items-center h-screen ">
     
        <h1 className="md:text-5xl sm:text-3xl font-semibold text-2xl text-center dark:text-white text-black ">
          Welcome to DealsDray
        </h1>
       
    
      <br />
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    </div>
  );
};

export default Homepage;
