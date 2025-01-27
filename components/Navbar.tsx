import { auth, signIn, signOut } from '@/auth';
import { BadgePlus, LogOut } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="bg-white border-b-[5px] border-black shadow-100 px-6 py-4">
      <nav className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-3xl max-sm:2xl font-black tracking-wide bg-black text-white px-4 py-2 max-sm:px-3 max-sm:py-1 rounded-lg shadow-100 hover:shadow-none transition-all">
          CoCreateX
        </Link>

        {/* Right Side Content */}
        <div className="flex items-center gap-5 max-sm:gap-3">
          {session && session?.user ? (
            <>
              {/* Create Button */}
              <Link href="/project/create">
                <button className="flex items-center gap-2 border-[4px] border-black bg-primary text-white font-bold px-4 py-2 max-sm:px-3 max-sm:py-1 rounded-lg shadow-100 hover:shadow-none transition">
                  <BadgePlus className="size-6 max-sm:size-4" />
                  <span className="max-sm:hidden">Create</span>
                </button>
              </Link>

              {/* Logout */}
              <form action={async () => { "use server"; await signOut({ redirectTo: "/" }) }}>
                <button className="flex items-center gap-2 border-[4px] border-black bg-red-500 text-white font-bold px-4 py-2 max-sm:px-3 max-sm:py-1 rounded-lg shadow-100 hover:shadow-none transition">
                  <LogOut className="size-6 max-sm:size-4" />
                  <span className="max-sm:hidden">Logout</span>
                </button>
              </form>

              {/* User Profile */}
              <Link href={`/user/${session?.id}`}>
                <Avatar className="size-12 max-sm:size-11 border-[3px] border-black shadow-100 hover:shadow-none transition">
                  <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                  <AvatarFallback>
                    {session?.user?.name?.split(" ")[0][0]}
                    {session?.user?.name?.split(" ").slice(-1)[0][0]}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </>
          ) : (
            <form action={async () => { 'use server'; await signIn('github') }}>
              <button className="border-[4px] border-black bg-secondary text-white font-bold px-4 py-2 rounded-lg shadow-100 hover:shadow-none transition">
                Login
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
