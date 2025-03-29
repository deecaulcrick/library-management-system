import AdminLoginForm from "@/components/auth/AdminLoginForm";
import React, { Suspense } from "react";

const AdminLogin = () => {
  return (
    <section className="h-screen p-6 flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-700">
      <div className="w-full max-w-[650px] bg-white rounded-lg shadow-xl p-8 md:p-10">
        <Suspense fallback={<div className="w-full p-4">Loading admin login form...</div>}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </section>
  );
};

export default AdminLogin;
