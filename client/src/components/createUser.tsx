import * as React from "react";
import { z } from "zod";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Errors, User} from "../types/user";
import axios from "axios";
import { baseApi } from "../lib/baseapi";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  username: z.string().min(2, { message: "Too short" }),
  email: z.string().email({ message: "invalid email address" }),
  password: z
    .string()
    .min(2, { message: "password must be at least 8 characters" }),
  role: z.string().min(2, { message: "role is required" }),
  phoneNo: z
    .string()
    .min(10, { message: "phone number is required" })
    .max(10, { message: "phone number is required" }),

  gender: z.string().min(2, { message: "gender is required" }),
  profile: z
  .instanceof(File) 
  .refine((file) => file.size > 0, "Profile image is required"), 

});

interface CreateUserProps {
  user?: User;
  onAddUser: (newUser: User) => void; 
  heading:string
}

export function CreateUser({ user, onAddUser ,heading}: CreateUserProps) {
  const [error, setError] = React.useState<Errors>();
  const roles = ["hr", "manager", "sales"];
  const [loading, setLoading] = React.useState(false);
  const naviagte = useNavigate();

  const availableRoles = roles.filter((role) => role !== user?.role);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "",
      phoneNo: "",
      gender: "",
      profile: null,
    },
  });

  const onSubmit = async (data: User) => {
    console.log("Form Data before submission:", data); 
  
    setLoading(true);
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("username", data.username);
    formData.append("password", data.password);
    formData.append("phoneNo", data.phoneNo);
    formData.append("role", data.role);
    formData.append("gender", data.gender);
    console.log(data.profile)
  formData.append("profile", data.profile);
    
    try {
      const response = await axios.post(`${baseApi}/user-registration`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response message:", response.data.message);
      form.reset(); 
     
      naviagte("/dashboard/employee-list");
   
      setLoading(false);
    } catch (error) {
      console.error("Error:", error?.response?.data?.message); 
      setError(error.response.data);
      
      setLoading(false);
    }
  };
  

  if (loading) {
    return <Loading />;
  }

  return (
    <Form {...form}>
      <Card className="w-full custom400:w-[400px] capitalize">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl"> {heading}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="r2" />
                        <Label htmlFor="r2">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="r3" />
                        <Label htmlFor="r3">Female</Label>
                      </div>
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          
                          const file = e.target.files[0]; 
                          field.onChange(file); 
                          console.log("Selected file:", file); 
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Controller
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              {availableRoles.map((item) => (
                                <SelectItem value={item} key={item}>
                                  {item}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {error?.message && (
              <p className="w-full text-red-500 text-[12px]">{error.message}</p>
            )}
            <div className="w-full flex justify-between mt-4">
              <Button variant="outline" type="button"  onClick={() => form.reset()}>Cancel</Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
}

