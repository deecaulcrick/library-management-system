"use client";

import React from "react";
import { useGetDashboardStats } from "@/hooks/dashboard/useDashboard";
import {
  BookOpenIcon,
  UserGroupIcon,
  BookmarkIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const StatCard = ({ title, value, icon: Icon, bgColor }) => (
  <div
    className={`${bgColor} p-6 rounded-lg shadow-md flex items-center justify-between`}
  >
    <div>
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
    <div className="bg-white p-3 rounded-full">
      <Icon className="w-8 h-8 text-gray-700" />
    </div>
  </div>
);

const DashboardStats = () => {
  const { data, isLoading, error } = useGetDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 p-6 rounded-lg shadow-md h-32 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">Error loading dashboard statistics</div>
    );
  }

  const stats = [
    {
      title: "Total Books",
      value: data?.counts?.totalBooks || 0,
      icon: BookOpenIcon,
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Users",
      value: data?.counts?.totalUsers || 0,
      icon: UserGroupIcon,
      bgColor: "bg-green-50",
    },
    {
      title: "Active Loans",
      value: data?.counts?.activeLoans || 0,
      icon: BookmarkIcon,
      bgColor: "bg-yellow-50",
    },
    {
      title: "Overdue Loans",
      value: data?.counts?.overdueLoans || 0,
      icon: ClockIcon,
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          bgColor={stat.bgColor}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
