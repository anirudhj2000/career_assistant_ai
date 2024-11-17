import type { Metadata } from "next";
import "./globals.css";
import ShowJobsModal from "@/components/showJobsModal";
import Sidebar from "@/components/MobileSidebar";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <Navbar />
        {children}
        <ShowJobsModal />
        <Sidebar />
      </body>
    </html>
  );
}
