"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, useAuth, UserButton } from "@clerk/nextjs";
import Image from "next/image";

import { ContactForm } from "@/components/ContactForm";
import { ModeToggle } from "@/components/ModeToggle";
import { api } from "@/convex/_generated/api";
import { companyInfo } from "@/typing";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import Link from "next/link";
import GetQuoteButton from "@/components/GetQuoteButton";

export default function Home() {
  const { userId } = useAuth();

  const user = useQuery(api.users.user, { clerkUserId: userId ?? "" });
  return (
    <div className="min-h-svh flex flex-col max-w-7xl mx-auto">
      <header className="sticky top-0 z-10 bg-green-600 p-4 border-b-2 border-green-700 flex flex-row justify-between items-center text-white">
        <div className="flex items-center space-x-2">
          <Image
            src="/main-logo.png"
            alt="Breidys Logo"
            width={40}
            height={40}
            className="rounded-full bg-white"
          />
          <span className="text-xl font-bold">Breidys Tree Services</span>
        </div>
        <div className="flex items-center gap-5 ml-auto pr-2">
          <Unauthenticated>
            <ModeToggle className="dark:bg-primary bg-green-600" />
            <SignInButton />
          </Unauthenticated>
        </div>
        <div className="flex items-center gap-5">
          <Authenticated>
            <ModeToggle className="dark:bg-primary bg-green-600" />
            <Link
              href={user?.role === "owner" ? "/owner" : "/protected"}
              className="font-medium"
            >
              Dashboard
            </Link>
            <UserButton />
          </Authenticated>
        </div>
      </header>
      <main className="p-8 flex flex-col gap-8 justify-between">
        <section className="text-center">
          <h1 className="text-5xl font-bold text-green-700">
            Welcome to Breidys Tree Services
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Your trusted partner in landscaping, tree care, and removal.
          </p>
        </section>
        <h2 className="text-4xl font-bold text-green-700 text-center">
          Services
        </h2>
        <section className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <Image
              src="/tree3.png"
              alt="Landscaping"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
            <h2 className="text-2xl font-semibold mt-4 text-green-700">
              Landscaping
            </h2>
            <p className="text-gray-700">
              Enhance the beauty and health of your outdoor space with our
              expert tree care and landscaping services. Let us create a
              thriving, green environment for you to enjoy!
            </p>
          </div>
          <div className="flex-1">
            <Image
              src="/tree2.png"
              alt="Tree Care"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
            <h2 className="text-2xl font-semibold mt-4 text-green-700">
              Tree Care
            </h2>
            <p className="text-gray-700">
              Protect and enhance the natural beauty of your landscape with our
              professional tree care services. From expert pruning and
              maintenance to disease prevention and removal, we ensure your
              trees stay healthy, vibrant, and safe for years to come
            </p>
          </div>
          <div className="flex-1">
            <Image
              src="/tree1.png"
              alt="Tree Removal"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
            <h2 className="text-2xl font-semibold mt-4 text-green-700">
              Tree Removal
            </h2>
            <p className="text-gray-700">
              Whether you’re dealing with a hazardous tree, storm damage, or
              simply making space for a new project, our skilled team provides
              safe, efficient, and professional tree removal services tailored
              to your needs
            </p>
          </div>
        </section>
        <section className="text-center mt-8">
          <h2 className="text-4xl font-bold text-green-700">Contact Us</h2>
          <p className="mt-4 text-lg text-gray-700">
            At {companyInfo.name}, we are committed to preserving the beauty and
            health of your trees with expert care and sustainable solutions.
            Whether you need pruning, removal, or routine maintenance, our team
            is here to help. Contact us today and let’s nurture your outdoor
            space together!
          </p>
          <div className="mt-8 mb-8">
            <ContactForm />
          </div>
          <GetQuoteButton />
        </section>
      </main>
      <footer className="bg-green-600 p-4 text-center text-white">
        <p>
          &copy; {new Date().getFullYear()} Breidys Tree Services. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
