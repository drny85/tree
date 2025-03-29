"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ExplorePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen">
      <div className="relative min-h-svh flex items-center">
        <Image
          src="/tree1.png"
          alt="Tree Service Hero"
          fill
          className="object-cover brightness-70"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              BREIDYS' TREE CARE,
            </motion.h1>
            <motion.h2
              className="text-3xl font-light text-white mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              Nurturing Nature.
            </motion.h2>
            <motion.p
              className="text-lg text-gray-200 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Enhance the beauty and health of your outdoor space with our
              expert tree care and landscaping services. Let us create a
              thriving, green environment for you to enjoy!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-gray-900 hover:bg-gray-100 hover:scale-105 transition-transform"
                onClick={() => {
                  router.push("/main");
                }}
              >
                Explore more
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
