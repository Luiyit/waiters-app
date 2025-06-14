"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <div className="grid grid-rows-[auto_1fr] items-center justify-items-center min-h-screen p-8 gap-8">
      {/* User Info Section */}
      <div className="w-full max-w-md p-4 bg-white dark:bg-gray-100 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-800 dark:bg-gray-700 rounded-full"></div>
          <div>
            <h2 className="text-lg font-semibold">{session?.user?.name || "Loading..."}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{session?.user?.role || "Loading..."}</p>
          </div>
        </div>
      </div>

      <main className="flex flex-col gap-8 items-center w-full">
        {/* Navigation Links */}
        <div className="grid grid-cols-1 gap-4 w-full max-w-md">
          <Link 
            href="/products"
            className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center"
          >
            Products
          </Link>
          <Link 
            href="/tables"
            className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-center"
          >
            Tables
          </Link>
          <Link 
            href="/orders"
            className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-center"
          >
            Orders
          </Link>
          <button 
            onClick={handleLogout}
            className="p-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}
