import { Open_Sans } from "next/font/google";
import NavigationBar from "./navigation/NavigationBar";

const openSans = Open_Sans({ subsets: ["latin"] });

export default function MainLayout({ children }) {
  return (
    <main
      className={`w-full flex flex-col min-h-screen items-center bg-slate-50 dark:bg-slate-950 ${openSans.className}`}
    >
      <NavigationBar />
      {children}
    </main>
  );
}
