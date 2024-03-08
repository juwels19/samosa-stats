import { clerkClient } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, isRejected } = await JSON.parse(req.body);

    const userToUpdate = await clerkClient.users.getUser(userId);

    await clerkClient.users.updateUser(userId, {
      privateMetadata: {
        ...userToUpdate.privateMetadata,
        rejected: isRejected,
      },
    });

    res.status(200).json({ message: "User permission updated" });
  } else {
    res.status(500).json({ message: "Request not valid" });
  }
}
