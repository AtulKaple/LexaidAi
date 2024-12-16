import Sidebar from "@/components/Form/Sidebar";
import Title from "@/components/Form/Title";
import Navbar from "@/components/Navbar";
import localFont from "next/font/local";


const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className=" flex flex-col items-center " >
        <Navbar/>
        <Title/>
        </div>
        <div className="flex flex-col lg:flex-row w-full h-full " >
        <Sidebar/>
        {children}
        </div>
      </body>
    </html>
  );
}
