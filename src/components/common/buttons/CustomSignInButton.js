import { Button } from "@nextui-org/button";
import { SignInButton } from "@clerk/nextjs";

export default function CustomSignInButton(props) {
  return (
    <SignInButton redirectUrl="/dashboard">
      <Button color="primary">Sign In</Button>
    </SignInButton>
  );
}
