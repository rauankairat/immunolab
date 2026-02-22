import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) redirect("/unauth");
  if (user.role !== "ADMIN") redirect("/unauth"); // or /unauth

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Dashboard</h1>
      <p>Only admins can see this page.</p>
    </div>
  );
}