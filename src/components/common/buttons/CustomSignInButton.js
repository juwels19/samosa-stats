import { Button } from "@nextui-org/button";
import { SignInButton } from "@clerk/nextjs";

export default function CustomSignInButton(props) {
  const { label } = props;
  return (
    <SignInButton redirectUrl="/dashboard">
      <Button className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-8 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300">
        {label}
      </Button>
    </SignInButton>
  );
}
