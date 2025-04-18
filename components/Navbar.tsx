import { companyInfo } from "@/typing";
import { checkRole } from "@/utils/roles";
import { UserButton } from "@clerk/nextjs";
import { DollarSign, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MobileMenu from "./MobileMenu";
import { ModeToggle } from "./ModeToggle";

export async function Navbar() {
  const isOwner = await checkRole("owner");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-slate-900/80 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Company Name */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 relative rounded-full">
              <Image
                src="/main-logo.png"
                alt="Company Logo"
                fill
                sizes="100%"
                priority
                className="object-contain rounded-full bg-white"
              />
            </div>
            <Link href={isOwner ? "/owner" : "/protected"}>
              <span className="text-xl font-semibold text-gray-900 dark:text-white hidden md:flex hover:cursor-pointer">
                {companyInfo.name}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links and User Button */}
          <div className="hidden md:flex items-center space-x-6">
            {isOwner && (
              <>
                <Link
                  href={"/owner/quotes"}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  <span>Quotes</span>
                </Link>
                <Link
                  href={"/owner/earnings"}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  <DollarSign size={20} />
                  <span>Earning</span>
                </Link>
                <Link
                  href={"/owner"}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  <Users size={20} />
                  <span>Clients</span>
                </Link>
              </>
            )}

            <ModeToggle />
            <UserButton />
          </div>

          {/* Mobile menu button and user controls */}
          <div className="flex md:hidden items-center space-x-4">
            <ModeToggle />
            <UserButton />
            {isOwner && <MobileMenu />}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Mobile menu component
