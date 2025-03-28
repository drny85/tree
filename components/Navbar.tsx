import { companyInfo } from "@/typing";
import { UserButton } from "@clerk/nextjs";
import { Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-slate-900/80 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Company Name */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 relative rounded-full">
              <Image
                src="/logo.png"
                alt="Company Logo"
                fill
                sizes="100%"
                className="object-contain rounded-full"
              />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              {companyInfo.name}
            </span>
          </div>

          {/* Navigation Links and User Button */}
          <div className="flex items-center space-x-6">
            <Link
              href="/protected"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              <Users size={20} />
              <span>Clients</span>
            </Link>

            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
