"use client";

import React from "react";
import { useGetUserStats } from "@/hooks/dashboard/useDashboard";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const UserStats = () => {
  const { data, isLoading, error } = useGetUserStats();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
          <div className="h-64 bg-gray-100 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading user statistics</div>;
  }

  // Prepare data for user roles pie chart
  const userRolesData = {
    labels: data?.usersByRole?.map((item) => item.role) || [],
    datasets: [
      {
        data: data?.usersByRole?.map((item) => item.count) || [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for monthly user activity
  const monthlyUserData = {
    labels:
      data?.monthlyUserActivity?.map((item) => {
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        return months[item.month - 1];
      }) || [],
    datasets: [
      {
        label: "New Users",
        data: data?.monthlyUserActivity?.map((item) => item.count) || [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "User Roles Distribution",
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly User Registration",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">User Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium mb-2">User Roles</h3>
          <div className="h-64">
            {userRolesData.labels.length > 0 ? (
              <Pie data={userRolesData} options={pieOptions} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No user role data available</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">
            Monthly User Registration
          </h3>
          <div className="h-64">
            {monthlyUserData.labels.length > 0 ? (
              <Bar data={monthlyUserData} options={barOptions} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  No monthly registration data available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">User Activity Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Active Users</p>
            <p className="text-2xl font-bold">{data?.activeUsers || 0}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Most Active User</p>
            <p className="text-lg font-bold">
              {data?.mostActiveUser?.name || "N/A"}
            </p>
            <p className="text-sm text-gray-500">
              {data?.mostActiveUser?.loanCount || 0} loans
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Users with Overdue Books</p>
            <p className="text-2xl font-bold">
              {data?.usersWithOverdueBooks || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
