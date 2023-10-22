import { NavbarItem } from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";
import { usePathname } from "next/navigation";

export default function NavigationItem(props) {
  const { item } = props;
  const pathname = usePathname();
  const isPageActive = pathname === item.path;
  return (
    <NavbarItem
      isActive={isPageActive}
      aria-label={`${item.label} Navigation Item`}
    >
      <Link
        href={item.path}
        color={isPageActive ? "primary" : "foreground"}
        aria-label={`${item.label} Navigation Link`}
      >
        {item.label}
      </Link>
    </NavbarItem>
  );
}
