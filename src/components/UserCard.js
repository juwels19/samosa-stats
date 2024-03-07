import { Button, Tooltip, User } from "@nextui-org/react";
import { useState } from "react";

export default function UserCard(props) {
  const { user, isAdmin, isApprover, setPendingUsersArr, setAcceptedUsersArr } =
    props;
  const [isApprovalLoading, setIsApprovalLoading] = useState(false);
  const [isRevokeLoading, setIsRevokeLoading] = useState(false);
  const [isToggleApproverLoading, setIsToggleApproverLoading] = useState(false);

  const roles = [];

  if (user.privateMetadata.admin) roles.splice(0, 0, "Admin");
  if (user.privateMetadata.approver)
    roles.splice(roles.length === 0 ? 0 : 1, 0, "Approver");
  if (user.approved) roles.push("Member");

  const onAccept = async (userIdToApprove) => {
    setIsApprovalLoading(true);
    const body = { userId: userIdToApprove, isApproved: true };
    await fetch("/api/users/approve", {
      method: "POST",
      body: JSON.stringify(body),
    });
    setAcceptedUsersArr((oldArr) => [
      ...oldArr,
      {
        id: user.id,
        imageUrl: user.imageUrl,
        privateMetadata: { ...user.privateMetadata, approved: true },
        firstName: user.firstName,
        lastName: user.lastName,
        approved: true,
      },
    ]);
    setPendingUsersArr((oldArr) =>
      oldArr.filter((item) => item.id !== userIdToApprove)
    );
    setIsApprovalLoading(false);
  };

  const onRevoke = async (userIdToRevoke) => {
    setIsRevokeLoading(true);
    const body = { userId: userIdToRevoke, isApproved: false };
    await fetch("/api/users/approve", {
      method: "POST",
      body: JSON.stringify(body),
    });
    setPendingUsersArr((oldArr) => [
      ...oldArr,
      {
        id: user.id,
        imageUrl: user.imageUrl,
        privateMetadata: { ...user.privateMetadata, approved: true },
        firstName: user.firstName,
        lastName: user.lastName,
        approved: false,
      },
    ]);
    setAcceptedUsersArr((oldArr) =>
      oldArr.filter((item) => item.id !== userIdToRevoke)
    );
    setIsRevokeLoading(false);
  };

  const onToggleApprover = async (userIdToToggle) => {
    setIsToggleApproverLoading(true);
    const body = {
      userId: userIdToToggle,
      isApprover: !user.privateMetadata.approver,
    };
    await fetch("/api/users/approver", {
      method: "POST",
      body: JSON.stringify(body),
    });
    setAcceptedUsersArr((oldArr) => {
      const newArr = oldArr.map((item) => {
        if (item.id === userIdToToggle)
          return {
            ...item,
            privateMetadata: {
              ...user.privateMetadata,
              approver: !user.privateMetadata.approver,
            },
          };
        return item;
      });
      return newArr;
    });
    setIsToggleApproverLoading(false);
  };

  return (
    <div className="flex flex-row justify-between gap-4">
      <User
        name={`${user.firstName} ${user.lastName}`}
        description={roles.length > 0 ? roles.join(", ") : undefined}
        avatarProps={{ src: user.imageUrl }}
        className="min-w-fit"
      />
      {!user.approved && isApprover && (
        <div className="grid grid-flow-col gap-2 min-w-fit">
          <Button
            color="success"
            onClick={() => onAccept(user.id)}
            isLoading={isApprovalLoading}
          >
            Accept
          </Button>
        </div>
      )}
      {user.approved && (
        <div className="grid grid-flow-row gap-2 ">
          {isAdmin && (
            <Button
              color={user.privateMetadata.approver ? "warning" : "secondary"}
              isLoading={isToggleApproverLoading}
              onClick={() => onToggleApprover(user.id)}
            >
              {user.privateMetadata.approver
                ? "Revoke approver"
                : "Add approver"}
            </Button>
          )}
          <Button
            color="danger"
            onClick={() => onRevoke(user.id)}
            isLoading={isRevokeLoading}
          >
            Revoke access
          </Button>
        </div>
      )}
    </div>
  );
}
