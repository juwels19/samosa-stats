import { Inter } from "next/font/google";
import Link from "next/link";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
import Image from "next/image";
import CustomSignInButton from "@/components/common/buttons/CustomSignInButton";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
        <div className="flex flex-col justify-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
            Welcome to Samosa Stats
          </h1>
          <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">
            The home of degenerate FRC fantasy robotics
          </p>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <CustomSignInButton label="Get Started" />
          </div>
        </div>
        <Image
          src="/hero-pic.png"
          height={500}
          width={500}
          alt="Degenerate FRC robotics"
        />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const { userId } = getAuth(req);
  if (userId) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: true,
      },
      props: {
        ...buildClerkProps(req),
      },
    };
  }
  return {
    props: {
      userId: userId,
      ...buildClerkProps(req),
    },
  };
}
