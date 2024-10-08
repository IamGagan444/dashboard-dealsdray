import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { User } from "../types/user";
import axios from "axios";
import { baseApi } from "../lib/baseapi";
import { Button } from "../components/ui/button";
import { PenLine, Trash2 } from "lucide-react";



const EmployeeList = () => {

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
       
        setListData(response?.data?.data?.users || []);
        setUser(response?.data?.data?.me);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const deleteUser= async(userId:string|undefined)=>{
    await axios.delete(`${baseApi}/delete-user/${userId}`,{
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      withCredentials: true,
    })

    setListData((prev)=>prev._id!=userId)
  }

console.log(listData);
  return (
    <div className="h-screen flex items-center justify-center ">
      <div className="w-full m-6">
      
      
        <br />
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow className="capitalize">
              <TableHead className="!w-[50px]">unique id</TableHead>
              <TableHead>image</TableHead>
              <TableHead>name</TableHead>
              <TableHead className="text-righ">email</TableHead>
              <TableHead>mobile no</TableHead>
              <TableHead className="text-righ">desigation</TableHead>
              <TableHead>gender</TableHead>
              
              <TableHead className="text-center">action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listData.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium  truncate text-ellipsis w-[50px]">{item._id}</TableCell>
                <TableCell>  <img src={item?.profile} alt="" className="size-8" /> </TableCell>
                <TableCell>{item.username}</TableCell>
                <TableCell className="text-">
                  {item.email}
                </TableCell>
                <TableCell className="text-">
                  {item.phoneNo}
                </TableCell>
                <TableCell className="text-">
                  {item.role}
                </TableCell>
                <TableCell className="text-">
                  {item.gender}
                </TableCell>
                <TableCell className="text- flex items-center justify-center space-x-4">
                  <Button variant={"outline"}><PenLine /></Button>
                  <Button variant={"outline"} onClick={()=>deleteUser(item?._id)}><Trash2 /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">{listData?.length} users </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default EmployeeList;
