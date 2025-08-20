import { cn } from "@/lib/utils";
import { AlertCircleIcon, GalleryVerticalEnd, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import RequiredIndicator from "../commonComponents/RequiredIndicator";
import { emailValidator, requiredValidator } from "@/validation/valication";
import ErrorMessage from "../commonComponents/ErrorMessage";
import { pythonPostFunction } from "@/globalFunctions/globalFunction";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useDispatch } from "react-redux";

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [checkRetellKey, setCheckRetellKey] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  // check is user already login
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/list");
    }
  }, []);

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    const payload = {
      email: data.email,
      password: data.password,
    };

    try {
      const res = await pythonPostFunction("/login", payload);
      if (res.status) {
        localStorage.setItem("auth", res.data.retall_api_key);
        setIsLoading(false);
        // if (res.data?.retail_api_key) {
        //   setCheckRetellKey(false);
        //   toast.success("User logged in successfully!");
        //   localStorage.setItem("token", res.data?.retail_api_key);
        //   localStorage.setItem("userData", JSON.stringify(res.data));
        //   dispatch({ type: "SET_TOKEN", payload: res.data?.retail_api_key });
        //   dispatch({ type: "SET_USER_DATA", payload: res.data });
        //   navigate("/list");
        // } else {
        //   setCheckRetellKey(true);
        // }
        if (res.data?.token) {
          setCheckRetellKey(false);
          toast.success("User logged in successfully!");
          localStorage.setItem("token", res.data?.token);
          localStorage.setItem("userData", JSON.stringify(res.data));
          dispatch({ type: "SET_TOKEN", payload: res.data?.token });
          dispatch({ type: "SET_USER_DATA", payload: res.data });
          window.location.reload();
          navigate("/list");
        } else {
          setCheckRetellKey(true);
        }
      } else {
        setIsLoading(false);
        toast.error(res?.message || "Failed to login user!");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setIsLoading(false);
      toast.error("Failed to create user!");
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="https://webviotechnologies.com/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Webvio Technology Pvt. Ltd.
        </Link>
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="email">
                        Email <RequiredIndicator />
                      </Label>
                      <Input
                        id="email"
                        type="text"
                        placeholder="johndoe"
                        className={cn(
                          errors.email &&
                            "border-red-600 focus:border-red-600 focus:ring-red-600"
                        )}
                        {...register("email", {
                          ...requiredValidator,
                          ...emailValidator,
                        })}
                      />
                      {errors.email && (
                        <ErrorMessage text={errors.email.message} />
                      )}
                    </div>
                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="password">
                          Password <RequiredIndicator />
                        </Label>
                        {/* <Link to="#" className="ml-auto text-sm underline-offset-4 hover:underline" >Forgot your password?</Link> */}
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className={cn(
                          errors.password &&
                            "border-red-600 focus:border-red-600 focus:ring-red-600"
                        )}
                        {...register("password", { ...requiredValidator })}
                      />
                      {errors.password && (
                        <ErrorMessage text={errors.password.message} />
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full cursor-pointer"
                      disabled={!isValid || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-1 animate-spin" />{" "}
                          Submitting...
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link
                      to="/sign-up"
                      className="underline underline-offset-4"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        {/* {checkRetellKey && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Unable to process your request.</AlertTitle>
            <AlertDescription>
              <p>Your account in under verification </p>
              <ul className="list-inside list-disc text-sm">
                <li>wait for atleast 48 hours</li>
                <li>check your email for verification confirmation</li>
                <li>then try again</li>
              </ul>
            </AlertDescription>
          </Alert>
        )} */}
      </div>
    </div>
  );
};

export default Signin;
