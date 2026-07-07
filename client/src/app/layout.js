import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css"
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/components/Provider/AuthProvider";
import SocketProvider from "@/components/Provider/SocketProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DevClustra - Real Time Collaboration Tool",
  description: "Designed & Developed By Aalok Kumar",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* {children} */}
        <Toaster />
        <AuthProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
