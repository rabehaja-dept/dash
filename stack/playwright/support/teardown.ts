/**
 * @TODO: Wire these up to the playwright e2e test runners, and account for
 * when a user removes the DB from the application
 */

// // Use this to delete a user by their email
// import { getEnv } from "~/utils";
// import { installGlobals } from "@remix-run/node/globals";
// import { prisma } from "~/db.server";

// installGlobals();

// const deleteUser = async () => {
//   const userName = getEnv("TEST_USER_EMAIL", {
//     default: "testuser@example.com",
//   });

//   if (!userName) {
//     throw new Error("email required for login");
//   }
//   if (!userName.endsWith("@example.com")) {
//     throw new Error("All test emails must end in @example.com");
//   }

//   await prisma.user.delete({ where: { email: userName } });
// };

// export default deleteUser;

export {};
