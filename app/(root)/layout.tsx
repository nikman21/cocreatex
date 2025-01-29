import Footer from "@/components/Footer";
import { Messaging } from "@/components/Messaging"
import Navbar from "@/components/Navbar";
import { SanityLive } from "@/sanity/lib/live";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Messaging/>
      <Footer />

    </div>
  );
}
