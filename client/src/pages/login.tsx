import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import { Input } from "../components/ui/input";
import { Errors, UserLogin } from "../types/user";
import axios from "axios";
import { baseApi } from "../lib/baseapi";
import { useState } from "react";
import Loading from "../components/Loading";
import CustomUser from "../context/userContext";
import Cookie from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Errors>();

  const { setUserData, setAuthnticated } = CustomUser();
  const naviagte = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema), // Don't forget to uncomment the zodResolver import
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: UserLogin) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    await axios
      .post(`${baseApi}/user-login`, formData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log("File uploaded:", response?.data?.data.accessToken);
        setUserData(response?.data?.data?.users);
        Cookie.set("token", response?.data?.data?.accessToken, {
          expires: 7,
          path: "/",
          sameSite: "Lax",
          secure: true,
        });
        Cookie.set("isAuthenticated", "true", { expires: 7 });
        setAuthnticated(true);
        naviagte("/dashboard");
        setLoading(false);
      })
      .catch((error) => {
        console.error("File upload error!", error);
        setError(error?.response?.data);
        setLoading(false);
      });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="  flex justify-center items-center ">
      <Form {...form}>
        <Card className="w-[350px] my-24 ">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl">Login</CardTitle>
          </CardHeader>
          <CardContent className="my-7">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} type="string" />
                        </FormControl>

                        <FormMessage content="" />
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
                            placeholder="password"
                            {...field}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {error?.success ? (
                  ""
                ) : (
                  <p className="w-full text-red-500 text-[12px]">
                    {error?.message}
                  </p>
                )}
              </div>
              <br />
              <div className="w-full flex justify-between ">
                <Button variant="outline">Cancel</Button>
                <Button type="submit">Login</Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center w-full">
              Don't have an account?{" "}
              <Link to={"/signup"} className=" text-sky-500">
                Signup
              </Link>
            </p>
          </CardFooter>
        </Card>
      </Form>
    </section>
  );
}
