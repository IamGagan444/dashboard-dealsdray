import React, { useState } from "react";
import { User } from "../types/user";
import { CreateUser } from "../components/createUser";

const CreateEmploye = () => {
  const [listData, setListData] = useState<User[]>([]);
  const [user, setUser] = useState<User>();

  const handleAddUser = (newUser: User) => {
    setListData((prevList) => [...prevList, newUser]);
  };

  return (
    <div className="block my-24 ">
      <div className="w-fit p-4 mx-auto">
        <CreateUser user={user} onAddUser={handleAddUser} heading="Create Employee" />

      </div>
    </div>
  );
};

export default CreateEmploye;
