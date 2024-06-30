"use client";

import { HTMLAttributes } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/custom/button";
import { PasswordInput } from "@/components/custom/password-input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useLoginMutation } from "@/store/services/auth";
import { getErroMessage } from "@/lib/rtk-error-validation";
import { useRouter } from "next/navigation";

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> { }

const formSchema = z.object({
  email: z.string().min(1, { message: "Please enter your email" }),
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
  const [login, { isLoading }] = useLoginMutation();
  const { toast } = useToast();
  const { push } = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit } = form;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await login({
        usernameOrEmail: data.email,
        password: data.password,
      }).unwrap()

      push("/");
    } catch (error) {
      const errorMessage = getErroMessage(error);

      // FOR DEVELOPMENT =================
      if ((error as any).status === 'FETCH_ERROR') {
        push("/");
      }
      // =================================

      toast({
        className:
          "fixed top-5 z-[100] flex max-h-screen w-full flex-col-reverse p-4  sm:right-5 sm:flex-col w-fit",
        variant: "destructive",
        description: errorMessage,
      });
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Username or email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-muted-foreground hover:opacity-75"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="mt-2" loading={isLoading}>
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
