"use client";
import { DollarSign, Menu, Quote, Users, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Menu toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile menu dropdown */}
      {isOpen && (
        <div className="absolute top-16 right-0 left-0 bg-white dark:bg-slate-900 shadow-lg border-b border-gray-200 dark:border-slate-700">
          <div className="px-4 py-3 space-y-3">
            <Link
              href={"/owner/quotes"}
              className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Quote size={20} />
              <span>Quotes</span>
            </Link>
            <Link
              href={"/owner/earnings"}
              className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <DollarSign size={20} />
              <span>Earning</span>
            </Link>
            <Link
              href={"/owner"}
              className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Users size={20} />
              <span>Clients</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileMenu;
