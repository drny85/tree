"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { LoadScriptNext } from "@react-google-maps/api";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export function AddClientForm({ onOpenChange }: Props) {
  const createClient = useMutation(api.clients.createClient);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createClient({
        name: values.name,
        email: values.email || undefined,
        phone: values.phone,
        address: values.address || undefined,
        notes: values.notes || undefined,
      });
      form.reset();
      toast.success("Client added successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to add client");
      console.error(error);
    }
  }

  return (
    <div className="max-w-xl p-6 bg-white rounded-lg shadow-md dark:bg-slate-800">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium">
                  Full Name*
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    {...field}
                    className="mt-1 block w-full rounded-md capitalize border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="john@example.com"
                    {...field}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium">
                  Phone Number*
                </FormLabel>
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
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium">
                  Address
                </FormLabel>
                <FormControl>
                  <LoadScriptNext
                    googleMapsApiKey={
                      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
                    }
                    libraries={["places"]}
                    loadingElement={<div>Loading...</div>}
                  >
                    <AutocompleteComponent field={field} />
                  </LoadScriptNext>
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium">
                  Notes
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any special instructions or notes"
                    {...field}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    rows={3}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs" />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Save />
              Add Client
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

// Remove the useEffect in the main component that has the field reference error

import usePlacesAutocomplete from "use-places-autocomplete";

function AutocompleteComponent({ field }: { field: any }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleInput = (e: any) => {
    setValue(e.target.value);
    field.onChange(e.target.value);
  };

  const handleSelect = async (address: string, x: any) => {
    console.log("handleInput", x);
    setValue(address, false);
    field.onChange(address);
    clearSuggestions();
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          placeholder="Start typing an address"
          value={field.value || value || ""}
          onChange={handleInput}
          name={field.name}
          onBlur={field.onBlur}
          disabled={!ready}
          className="mt-1 block w-full capitalize rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {field.value && (
          <button
            type="button"
            onClick={() => {
              setValue("");
              field.onChange("");
              clearSuggestions();
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            aria-label="Clear input"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
      {status === "OK" && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {data.map(({ place_id, description, matched_substrings }) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description, matched_substrings)}
              className="relative cursor-pointer select-none py-2 px-3 text-gray-900 hover:bg-indigo-100 hover:text-indigo-900"
            >
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
