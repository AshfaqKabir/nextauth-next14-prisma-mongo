import { getServerSession } from "next-auth";
import { authOptions } from "../libs/AuthOptions";
import LogoutBtn from "@/components/LogoutBtn";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  return (
    <main>
      <div>Protected Dashboard, hello: {session?.user?.email}</div>
      <LogoutBtn />
    </main>
  );
}
