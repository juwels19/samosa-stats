import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
} from "@nextui-org/navbar";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/router";
import { Open_Sans } from "next/font/google";
import ThemeSwitchButton from "../common/buttons/ThemeSwitchButton";
import { navigationItems } from "@/data/navigation";
import NavigationItem from "./NavigationItem";
import CustomSignInButton from "../common/buttons/CustomSignInButton";

const openSans = Open_Sans({ subsets: ["latin"] });

export default function NavigationBar(props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={() => setIsMenuOpen(!isMenuOpen)}
      aria-label="Navigation Bar"
      className="bg-slate-100 dark:bg-slate-950"
      classNames={{
        base: "justify-start",
        wrapper: "min-w-full",
      }}
    >
      <NavbarContent justify="start">
        <NavbarBrand>
          <p
            className="text-inherit pl-4 font-bold hover:cursor-pointer"
            onClick={() => router.push("/")}
          >
            Samosa Stats
          </p>
        </NavbarBrand>
      </NavbarContent>
      {/* <NavbarContent justify="center" className="hidden gap-6 md:flex">
        {navigationItems.map((item) => (
          <NavigationItem key={item.label} item={item} />
        ))}
      </NavbarContent> */}
      <NavbarContent justify="end">
        <ThemeSwitchButton />
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <CustomSignInButton label="Sign In" />
        </SignedOut>
        {/* <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden"
        />
        <NavbarMenu
          className={`${openSans.className} bg-slate-100 dark:bg-slate-950`}
        >
          {navigationItems.map((item) => (
            <NavigationItem key={item.label} item={item} />
          ))}
        </NavbarMenu> */}
      </NavbarContent>
    </Navbar>
  );
}
