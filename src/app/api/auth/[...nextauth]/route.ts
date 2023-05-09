import NextAuth from "next-auth";

import { authOptions } from "@/utils/prisma";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
