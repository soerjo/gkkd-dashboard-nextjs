"use client";

import { HTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/custom/button";
import { PasswordInput } from "@/components/custom/password-input";
import { cn } from "@/lib/utils";
import { useLoginMutation } from "@/store/services/auth";
import { getErroMessage } from "@/lib/rtk-error-validation";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Input, Button } from "@heroui/react";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/assets/EyePasswordIcon";

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> { }

const formSchema = z.object({
  email: z.string().min(1, { message: "Please enter your user or email" }),
  password: z
    .string()
    .min(1, {
      message: "Please enter your password",
    })
    .min(7, {
      message: "Password must be at least 7 characters long",
    }),
});

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [login, { isLoading }] = useLoginMutation();
  const { push } = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, formState: { isSubmitting, errors }  } = form;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await login({
        usernameOrEmail: data.email,
        password: data.password,
      }).unwrap()

      push("/");
    } catch (error) {
      const errorMessage = getErroMessage(error);
      toast.error(errorMessage)

    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} id="auth-login" className="flex flex-col gap-4">
                    <Input
                      labelPlacement="outside"
                      placeholder="your username or email"
                      variant="faded"
                      label="Username or Email"
                      isInvalid={!!errors.email}
                      errorMessage={errors.email?.message}
                      {...form.register("email")}
                    />
                    <Input
                      labelPlacement="outside"
                      placeholder="*********"
                      variant="faded"
                      label="Password"
                      type={isVisible ? "text" : "password"}
                      isInvalid={!!errors.password}
                      errorMessage={errors.password?.message}
                      {...form.register("password")}
                      endContent={
                        <button
                          aria-label="toggle password visibility"
                          className="focus:outline-none"
                          type="button"
                          onClick={toggleVisibility}
                        >
                          {isVisible ? (
                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                          ) : (
                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                          )}
                        </button>
                      }
                    />
                     <Button
                      className="mt-4"
                      color="primary"
                      isLoading={isLoading}
                      variant="solid"
                      type="submit"
                      form="auth-login"
                      size="lg"
                    >
                      Submit
                    </Button>
        </form>
      </Form>
    </div>
  );
}
