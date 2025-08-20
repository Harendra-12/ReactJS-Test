import { cn } from "@/lib/utils";
import { GalleryVerticalEnd, Loader2 } from "lucide-react";
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
import ErrorMessage from "../commonComponents/ErrorMessage";
import {
  requiredValidator,
  emailValidator,
  userNameValidator,
  fullNameValidator,
  minLengthValidator,
  passwordValidator,
} from "@/validation/valication";
import RequiredIndicator from "../commonComponents/RequiredIndicator";
import { pythonGetFunction, pythonPostFunction } from "@/globalFunctions/globalFunction";
import { toast } from "sonner";
import UsernameAvailable from "../commonComponents/UsernameAvailable";

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const username = watch("username");
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (username && !errors.username) {
        const available = await checkUsernameAvailability(username);
        setIsAvailable(available);
      }
    }, 200);
    return () => clearTimeout(delayDebounceFn);
  }, [username, errors]);

  const checkUsernameAvailability = async (username) => {
    if (!username) return;

    const payload = { username };
    try {
      // const res = await pythonPostFunction("check-username", payload);
      const res = await pythonGetFunction(`/check-username?username=${username}`);
      return res;
    } catch (error) {
      console.error("Error checking username:", error);
      return false;
    }
  };

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    const payload = {
      full_name: data.full_name,
      username: data.username,
      email: data.email,
      password: data.password,
    };

    try {
      const res = await pythonPostFunction("/signup", payload);
      if (res.status) {
        setIsLoading(false);
        toast.success(res?.message || "User created successfully!");
        reset();
        navigate("/login");
      } else {
        setIsLoading(false);
        if (res.errors.length > 0) {
          res.errors.forEach((error) => {
            toast.error(error.message);
          });
        } else {
          toast.error("Failed to create user!");
        }
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
              <CardTitle className="text-xl">Sign up with you email</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      {" "}
                      <Label htmlFor="name">
                        Full Name
                        <RequiredIndicator />
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        className={cn(
                          errors.full_name &&
                            "border-red-600 focus:border-red-600 focus:ring-red-600"
                        )}
                        {...register("full_name", {
                          ...requiredValidator,
                          ...fullNameValidator,
                        })}
                      />
                      {errors.full_name && (
                        <ErrorMessage text={errors.full_name.message} />
                      )}
                    </div>
                    <div className="grid gap-3">
                      {" "}
                      <Label htmlFor="username">
                        Username
                        <RequiredIndicator />
                      </Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="johndoe"
                        className={cn(
                          errors.username &&
                            "border-red-600 focus:border-red-600 focus:ring-red-600"
                        )}
                        {...register("username", {
                          ...requiredValidator,
                          ...userNameValidator,
                        })}
                      />{" "}
                      {isAvailable && (
                        <UsernameAvailable username={isAvailable} />
                      )}
                      {errors.username && (
                        <ErrorMessage text={errors.username.message} />
                      )}
                    </div>
                    <div className="grid gap-3">
                      {" "}
                      <Label htmlFor="email">
                        Email
                        <RequiredIndicator />
                      </Label>
                      <Input
                        id="email"
                        type="text"
                        placeholder="john@example.com"
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
                      {" "}
                      <div className="flex items-center">
                        <Label htmlFor="password">
                          Password
                          <RequiredIndicator />
                        </Label>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="********"
                        className={cn(
                          errors.password &&
                            "border-red-600 focus:border-red-600 focus:ring-red-600"
                        )}
                        {...register("password", {
                          ...requiredValidator,
                          ...minLengthValidator(8),
                          ...passwordValidator,
                        })}
                      />
                      {errors.password && (
                        <ErrorMessage text={errors.password.message} />
                      )}
                    </div>
                    <div className="grid gap-3">
                      {" "}
                      <div className="flex items-center">
                        <Label htmlFor="renter-password">
                          Renter Password
                          <RequiredIndicator />
                        </Label>
                      </div>
                      <Input
                        id="renter-password"
                        type="password"
                        className={cn(
                          errors.renterPassword &&
                            "border-red-600 focus:border-red-600 focus:ring-red-600"
                        )}
                        placeholder="********"
                        {...register("renterPassword", {
                          ...requiredValidator,
                          validate: (value) =>
                            value === watch("password") ||
                            "Passwords do not match",
                        })}
                      />
                      {errors.renterPassword && (
                        <ErrorMessage text={errors.renterPassword.message} />
                      )}
                    </div>{" "}
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
                        "Sign up"
                      )}
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link
                      to="/sign-in"
                      className="underline underline-offset-4"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our{" "}
            <Link
              target="_blank"
              to="https://www.amazon.in/Terms-Service-Social-Constant-Connection/dp/0062282484"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              target="_blank"
              to="https://www.amazon.in/Privacy-Policy-Complete-Guide-2024-ebook/dp/B0CMHBY2B7"
            >
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
