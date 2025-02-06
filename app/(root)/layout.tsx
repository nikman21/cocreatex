import { auth } from "@/auth";
import Footer from "@/components/Footer";
import { Messaging } from "@/components/Messaging";
import Navbar from "@/components/Navbar";


export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      {session && <Messaging />}
      <Footer />
    </div>
  );
}
