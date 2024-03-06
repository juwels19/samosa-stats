import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { useRouter } from "next/router";
import Head from "next/head";
import { Button } from "@nextui-org/react";
import UserCard from "@/components/UserCard";

export default function Approvals(props) {
  const { pendingUsers, acceptedUsers, isAdmin, isApprover } = props;
  const router = useRouter();

  return (
    <div className="z-10 py-8 px-10 flex flex-col max-w-5xl items-center text-center justify-between gap-8">
      <Head>
        <title>Approvals | Samosa Stats</title>
      </Head>
      <div
        className={`grid ${
          isAdmin ? "grid-cols-2" : "grid-cols-1"
        } grid-flow-row justify-center gap-4`}
      >
        <Button
          onClick={() => router.push("/dashboard")}
          color="primary"
          radius="sm"
        >
          Go to dashboard
        </Button>
        {isAdmin && (
          <Button
            onClick={() => router.push("/setup")}
            color="primary"
            radius="sm"
          >
            Go to event setup
          </Button>
        )}
      </div>
      <p className="text-3xl text-center mb-2 font-semibold">
        The FRC Degenerates
      </p>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-48`}>
        <div className="flex flex-col gap-4">
          <p className="text-2xl text-center font-semibold">Pending Degens</p>
          {pendingUsers.length === 0 && (
            <p>Nobody wants to join the degeneracy :(</p>
          )}
          {pendingUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-2xl text-center font-semibold">Approved Degens</p>
          {acceptedUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              isAdmin={isAdmin}
              isApprover={isApprover}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { userId } = getAuth(context.req);
  const user = await clerkClient.users.getUser(userId);
  const users = await clerkClient.users.getUserList();
  if (!user.privateMetadata.approver) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: true,
      },
    };
  }

  const pendingUsers = [];
  users.map((user) => {
    if (!user.privateMetadata.approved) {
      pendingUsers.push({
        id: user.id,
        imageUrl: user.imageUrl,
        privateMetadata: user.privateMetadata,
        firstName: user.firstName,
        lastName: user.lastName,
        approved: false,
      });
    }
  });

  const acceptedUsers = [];
  users.map((user) => {
    if (user.privateMetadata.approved) {
      acceptedUsers.push({
        id: user.id,
        imageUrl: user.imageUrl,
        privateMetadata: user.privateMetadata,
        firstName: user.firstName,
        lastName: user.lastName,
        approved: true,
      });
    }
  });

  console.log(user.privateMetadata);

  return {
    props: {
      isAdmin: user.privateMetadata.admin ? true : false,
      isApprover: user.privateMetadata.approver,
      pendingUsers,
      acceptedUsers,
    },
  };
}
