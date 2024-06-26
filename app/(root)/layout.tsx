import { getServerSession } from "next-auth";
import { authOptions } from "../libs/AuthOptions";
import { redirect } from "next/navigation";

export default async function ProtectedRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/signin");
  }
  return <main suppressHydrationWarning={true}>{children}</main>;
}
