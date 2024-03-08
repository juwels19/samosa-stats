import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { useRouter } from "next/router";
import Head from "next/head";
import { Button } from "@nextui-org/react";
import UserCard from "@/components/UserCard";
import { useState } from "react";

export default function Approvals(props) {
  const { pendingUsers, acceptedUsers, rejectedUsers, isAdmin, isApprover } =
    props;
  const [pendingUsersArr, setPendingUsersArr] = useState(pendingUsers);
  const [acceptedUsersArr, setAcceptedUsersArr] = useState(acceptedUsers);
  const [rejectedUsersArr, setRejectedUsersArr] = useState(rejectedUsers);
  const router = useRouter();

  return (
    <div className="z-10 py-8 px-10 flex flex-col max-w-7xl items-center text-center justify-between gap-8">
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
      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-2 lg:gap-8`}
      >
        <div className="flex flex-col gap-4">
          <p className="text-2xl text-center font-semibold">Pending Degens</p>
          {pendingUsersArr.length === 0 && (
            <p>Nobody wants to join the degeneracy... big sad</p>
          )}
          {pendingUsersArr.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              isAdmin={isAdmin}
              isApprover={isApprover}
              setPendingUsersArr={setPendingUsersArr}
              setAcceptedUsersArr={setAcceptedUsersArr}
              setRejectedUsersArr={setRejectedUsersArr}
            />
          ))}
        </div>
        <div className="flex flex-col gap-4 min-w-min">
          <p className="text-2xl text-center font-semibold">Approved Degens</p>
          {acceptedUsersArr.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              isAdmin={isAdmin}
              isApprover={isApprover}
              setPendingUsersArr={setPendingUsersArr}
              setAcceptedUsersArr={setAcceptedUsersArr}
              setRejectedUsersArr={setRejectedUsersArr}
            />
          ))}
        </div>
        <div className="flex flex-col gap-4 min-w-min ">
          <p className="text-2xl text-center font-semibold">
            Pranit's Pick List <br />
            (Rejected Degens)
          </p>
          {rejectedUsersArr.length === 0 && (
            <p>Wow, can't believe Pranit wouldn't pick anyone</p>
          )}
          {rejectedUsersArr.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              isAdmin={isAdmin}
              isApprover={isApprover}
              setPendingUsersArr={setPendingUsersArr}
              setAcceptedUsersArr={setAcceptedUsersArr}
              setRejectedUsersArr={setRejectedUsersArr}
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
  const users = await clerkClient.users.getUserList({ limit: 100 });
  if (!user.privateMetadata.approver || !user.privateMetadata.approved) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: true,
      },
    };
  }

  const pendingUsers = [];
  const acceptedUsers = [];
  const rejectedUsers = [];
  users.map((user) => {
    if (user.privateMetadata.rejected) {
      rejectedUsers.push({
        id: user.id,
        imageUrl: user.imageUrl,
        privateMetadata: user.privateMetadata,
        firstName: user.firstName,
        lastName: user.lastName,
        approved: false,
        rejected: true,
      });
      return;
    }
    if (!user.privateMetadata.approved) {
      pendingUsers.push({
        id: user.id,
        imageUrl: user.imageUrl,
        privateMetadata: user.privateMetadata,
        firstName: user.firstName,
        lastName: user.lastName,
        approved: false,
      });
    } else {
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

  return {
    props: {
      isAdmin: user.privateMetadata.admin ? true : false,
      isApprover: user.privateMetadata.approver ? true : false,
      pendingUsers,
      acceptedUsers,
      rejectedUsers,
    },
  };
}
