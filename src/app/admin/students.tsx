"use client";

import { useEffect, useState } from "react";

type Student = {
  id: string;
  name: string;
  email: string;
  isPaid: boolean;
  isAdmin: boolean;
};

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/students")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.students ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Loading students...</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-6 py-4 text-left">Name</th>
            <th className="px-6 py-4 text-left">Email</th>
            <th className="px-6 py-4 text-center">Paid</th>
            <th className="px-6 py-4 text-center">Admin</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr
              key={student.id}
              className="border-t"
            >
              <td className="px-6 py-4 font-medium">
                {student.name}
              </td>

              <td className="px-6 py-4">
                {student.email}
              </td>

              <td className="px-6 py-4 text-center">
                {student.isPaid ? "✅" : "❌"}
              </td>

              <td className="px-6 py-4 text-center">
                {student.isAdmin ? "👑" : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}