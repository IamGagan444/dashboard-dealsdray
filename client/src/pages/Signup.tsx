
import { useState } from "react";
import { CreateUser } from "../components/createUser";
import { User } from "../types/user";



export function Signup() {

  const [listData, setListData] = useState<User[]>([]);
  const [user, setUser] = useState<User>();

  const handleAddUser = (newUser: User) => {
    setListData((prevList) => [...prevList, newUser]);
  };
  

  return (
    <section className=" flex items-center justify-center">
      <CreateUser user={user} onAddUser={handleAddUser} heading="Create Employee" />
    </section>
  );
}
