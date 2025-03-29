"use client";

import React from "react";
import { useGetDashboardStats } from "@/hooks/dashboard/useDashboard";
import { format } from "date-fns";

const RecentLoans = () => {
  const { data, isLoading, error } = useGetDashboardStats();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Loan Activity</h2>
        <div className="animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-b pb-3 mb-3">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">Error loading recent loan activity</div>
    );
  }

  const recentLoans = data?.recentLoans || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Recent Loan Activity</h2>

      {recentLoans.length === 0 ? (
        <p className="text-gray-500">No recent loan activity</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Book</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {loan.Book.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {loan.Book.author}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {loan.User.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {loan.User.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(new Date(loan.borrowDate), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        loan.status === "overdue"
                          ? "bg-red-100 text-red-800"
                          : loan.status === "borrowed"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {loan.status.charAt(0).toUpperCase() +
                        loan.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentLoans;
