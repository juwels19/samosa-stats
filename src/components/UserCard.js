import { Button, Tooltip, User } from "@nextui-org/react";

export default function UserCard(props) {
  const { user, isAdmin, isApprover } = props;

  const roles = [];

  if (user.privateMetadata.admin) roles.splice(0, 0, "Admin");
  if (user.privateMetadata.approver)
    roles.splice(roles.length === 0 ? 0 : 1, 0, "Approver");
  if (user.approved) roles.push("Member");

  return (
    <div className="flex flex-row justify-between gap-4 min-w-fit">
      <User
        name={`${user.firstName} ${user.lastName}`}
        description={roles.length > 0 ? roles.join(", ") : undefined}
        avatarProps={{ src: user.imageUrl }}
        className="min-w-fit"
      />
      {!user.approved && (
        <div className="grid grid-flow-col gap-2 min-w-fit">
          <Button color="success">Accept</Button>
          <Button color="danger" variant="light">
            Reject
          </Button>
        </div>
      )}
      {user.approved && (
        <div className="grid grid-flow-row md:grid-flow-col gap-2 min-w-fit">
          {(isApprover || isAdmin) && (
            <Button
              color={user.privateMetadata.approver ? "warning" : "secondary"}
            >
              {user.privateMetadata.approver
                ? "Revoke approver"
                : "Add approver"}
            </Button>
          )}
          <Button color="danger">Remove</Button>
        </div>
      )}
    </div>
  );
}
