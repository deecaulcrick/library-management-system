import DashboardStats from "@/components/admin/DashboardStats";
import RecentLoans from "@/components/admin/RecentLoans";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import PopularBooks from "@/components/admin/PopularBooks";
import UserStats from "@/components/admin/UserStats";

const Page = () => {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="h1 gradient-text mb-6">Admin Dashboard</h1>

        {/* Dashboard statistics */}
        <DashboardStats />

        <UserStats />

        {/* Recent loan activity with link to full loans management */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Loan Activity</h2>
            <Link
              href="/admin/dashboard/loans"
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              Manage All Loans
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <RecentLoans />
        </div>

        {/* Popular books section */}
        <PopularBooks />

        {/* User management link */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">User Management</h2>
            <Link
              href="/admin/dashboard/students"
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              Manage All Users
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <p className="text-gray-600 mt-2">
            Access the user management panel to view, edit, and manage student
            accounts.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Page;
