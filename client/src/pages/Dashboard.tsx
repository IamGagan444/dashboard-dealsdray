import { useEffect, useState } from "react";
import { CreateUser } from "../components/createUser";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import axios from "axios";
import { baseApi } from "../lib/baseapi";
import { User } from "../types/user";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const Dashboard = () => {
  // const numbers = Array.from({ length: 100 }, (_, i) => i + 1);
  const [listData, setListData] = useState<User[]>([]);
  const [user, setUser] = useState<User>();
  

  useEffect(() => {
    axios
      .get(`${baseApi}/get-all-users`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data.data);
        setListData(response?.data?.data?.users || []);
        setUser(response?.data?.data?.me);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleAddUser = (newUser: User) => {
    setListData((prevList) => [...prevList, newUser]);
  };

  return (
    <>
      <section className="h-screen mt-[4.5rem] ">
        <h1 className="mt-[5rem] mx-6 text-3xl font-bold">
          {user?.username} -: <span className="text-sky-500">{user?.role}</span>
        </h1>
        <div className="flex custom700:flex-row  flex-col justify-around items-center my-8 mx-2 ">
          <Card className=" w-full custom400:w-[350px] my-4 custom700:my-0">
            <CardHeader>
              <CardTitle>You have {listData?.length} User</CardTitle>
              <CardDescription>
                Deploy your new project in one-click.
              </CardDescription>
            </CardHeader>

            <ScrollArea
              className={`${listData?.length > 10 ? "h-450px" : "h-fit"} px-4 `}
            >
              {listData?.map((item) => (
                <div key={item?._id}>
                  <p>
                    {item.role}:- {item.username}
                  </p>
                  {listData.length > 1 ? <Separator className="my-2" /> : ""}
                </div>
              ))}
            </ScrollArea>
          </Card>

          <CreateUser user={user} onAddUser={handleAddUser} />
        </div>
      </section>
    </>
  );
};

export default Dashboard;
