import { redirect } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import AdminStudents from "./students";

export default async function AdminPage() {
  const profile = await requireProfile();

  if (!profile.isAdmin) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-slate-900">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Welcome back, {profile.name}
        </p>

        <div className="mt-8">
          <AdminStudents />
        </div>
      </div>
    </main>
  );
}