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
import { Button } from "@/components/custom/button";
import { PasswordInput } from "@/components/custom/password-input";
import { cn } from "@/lib/utils";
import { getErroMessage } from "@/lib/rtk-error-validation";
import { useRouter } from "next/navigation";
import { useUpdateUserPasswordMutation } from "@/store/services/user";
import { logout } from "@/store/slice/auth";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> { }

const formSchema = z.object({
  new_password: z.string()
    .min(1, {
      message: "Please enter your password",
    })
    .min(7, {
      message: "Password must be at least 7 characters long",
    }),
  confirm_password: z
    .string()
    .min(1, {
      message: "Please enter your password",
    })
    .min(7, {
      message: "Password must be at least 7 characters long",
    }),
}).superRefine(({ confirm_password, new_password }, ctx) => {
  if (confirm_password !== new_password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match",
      path: ['confirm_password']
    });
  }
});

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [updatePassword, { isLoading }] = useUpdateUserPasswordMutation();
  const dispatch = useDispatch()
  const { push } = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  const { handleSubmit } = form;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await updatePassword({ new_password: data.new_password }).unwrap();
      dispatch(logout())
      push("/login");
    } catch (error) {
      console.log({ error })
      const errorMessage = getErroMessage(error);
      toast.error(errorMessage)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>new password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="flex items-center justify-between">
                    <FormLabel>confirm password</FormLabel>
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
