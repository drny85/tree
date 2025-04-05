"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  description: z.string().min(16, "Description must be at least 16 characters"),
});

export default function QuotePage() {
  const { userId } = useAuth();
  const user = useQuery(api.users.current);

  const [quoteSent, setQuoteSent] = useState(false);
  const createQuote = useMutation(api.quotes.createQuote);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      description: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue("name", `${user.firstName} ${user.lastName}`);
      form.setValue("email", user.email);
    }
  }, [user]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userId) {
      toast.error("You must be logged in to request a quote.");
      return;
    }
    await createQuote({
      clientEmail: values.email,
      clientName: values.name,
      clientPhone: values.phone,
      description: values.description,
      clerkUserId: userId,
      date: new Date().toISOString(),
    });
    toast.success("Quote Request Submitted", {
      description: "We will get back to you shortly.",
    });
    setQuoteSent(true);
    console.log(values);

    try {
    } catch (error) {
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
      console.error(error);
    }
  }

  if (quoteSent) {
    return (
      <div className="flex h-screen mx-auto container items-center justify-center">
        <Card>
          <div className="container mx-auto px-10 py-8 justify-center">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-2 ">
                Quote Request Submitted
              </h1>
              <p className="">We will get back to you shortly.</p>
            </div>
          </div>
          <Link href="/protected" className="mt-4 w-fit self-center px-6">
            <Button className="px-16" onClick={() => setQuoteSent(false)}>
              Got It
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 text-white">Get a Quote</h1>
        <p className="text-gray-200">
          Fill out the form below and we'll get back to you with a custom quote.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      className="capitalize"
                    />
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
                    <Input
                      placeholder="john@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(800) 456-7890"
                      {...field}
                      maxLength={14}
                      onChange={(e) => {
                        // Format phone number as (XXX) XXX-XXXX
                        const value = e.target.value.replace(/\D/g, "");
                        const formattedValue = value
                          .replace(
                            /(\d{3})(\d{0,3})(\d{0,4})/,
                            (_, p1, p2, p3) => {
                              let result = "";
                              if (p1) result += `(${p1})`;
                              if (p2) result += ` ${p2}`;
                              if (p3) result += `-${p3}`;
                              return result;
                            },
                          )
                          .trim();
                        field.onChange(formattedValue);
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your project..."
                      className="h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full  hover:bg-slate-500">
              Request Quote
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
