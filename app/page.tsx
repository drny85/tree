"use client";

import Image from "next/image";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

import { companyInfo } from "@/typing";
import { Authenticated, Unauthenticated } from "convex/react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-svh flex flex-col">
      <header className="sticky top-0 z-10 bg-green-600 p-4 border-b-2 border-green-700 flex flex-row justify-between items-center text-white">
        <div className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="Breidys Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-xl font-bold">Breidys Tree Services</span>
        </div>
        <div className="flex items-center gap-5 ml-auto pr-2">
          <Unauthenticated>
            <SignInButton />
          </Unauthenticated>
        </div>
        <div className="flex items-center gap-5">
          <Authenticated>
            <Link href={"/protected"} className="font-medium">
              Admin
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
              Transform your outdoor space with our expert landscaping services.
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
              Ensure the health and beauty of your trees with our professional
              care.
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
              Safe and efficient tree removal services for any situation.
            </p>
          </div>
        </section>
        <section className="text-center mt-8">
          <h2 className="text-3xl font-bold text-green-700">Contact Us</h2>
          <p className="mt-4 text-lg text-gray-700">
            At {companyInfo.name}, we are committed to preserving the beauty and
            health of your trees with expert care and sustainable solutions.
            Whether you need pruning, removal, or routine maintenance, our team
            is here to help. Contact us today and let’s nurture your outdoor
            space together!
          </p>
          <Button variant="outline" className="mt-4">
            Get a Quote
          </Button>
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
