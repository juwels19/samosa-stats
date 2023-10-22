import { Button } from "@nextui-org/button";
import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function ThemeSwitchButton() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      isIconOnly
      variant="light"
      onClick={() => (theme === "light" ? setTheme("dark") : setTheme("light"))}
    >
      {theme === "light" ? (
        <FaMoon size="1.5rem" color="#020617" />
      ) : (
        <FaSun size="1.5rem" color="#8B93A7" />
      )}
    </Button>
  );
}
