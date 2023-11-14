import { Inter } from "next/font/google";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="z-10 py-8 px-4 flex flex-col max-w-5xl items-center justify-between gap-8">
      <p className="text-3xl text-center text-bold">Welcome to Samosa Stats</p>
      <p className="text-xl text-center">The home of degenerate FRC Fantasy</p>
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
