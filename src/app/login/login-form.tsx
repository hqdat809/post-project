"use client";

import { LoginUserInput, LoginUserSchema } from "@/lib/validations/user.schema";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { apiLoginUser } from "@/apiRequests/api-requests";
import FormInput from "@/components/FormInput";
import Link from "next/link";
import { handleApiError } from "@/lib/helpers";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const methods = useForm<LoginUserInput>({
    resolver: zodResolver(LoginUserSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  async function LoginUserFunction(credentials: LoginUserInput) {
    try {
      await apiLoginUser(JSON.stringify(credentials));

      toast.success("Logged in successfully");
      return router.push("/profile");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      if (error instanceof Error) {
        handleApiError(error);
      } else {
        toast.error(error.message);
        console.log("Error message:", error.message);
      }
    }
  }

  const onSubmitHandler: SubmitHandler<LoginUserInput> = (values) => {
    LoginUserFunction(values);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5 shadow-slate-800"
      >
        <FormInput label="Email" name="email" type="email" />
        <FormInput label="Password" name="password" type="password" />

        <div className="text-right">
          <Link href="#" className="">
            Forgot Password?
          </Link>
        </div>
        <button className="w-full py-3 font-semibold rounded-lg outline-none border-none flex justify-center bg-slate-800 text-white">
          Login
        </button>
        <span className="block">
          Need an account?{" "}
          <Link href="/register" className="text-ct-blue-600">
            Sign Up Here
          </Link>
        </span>
      </form>
    </FormProvider>
  );
}
