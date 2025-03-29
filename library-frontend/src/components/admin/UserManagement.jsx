"use client";

import React, { useState } from "react";
import { 
  useGetAllUsers, 
  useUpdateUser, 
  useDeleteUser 
} from "@/hooks/users";

import {
  ArrowPathIcon,
  UserCircleIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Role badge component
const RoleBadge = ({ role }) => {
  const roleStyles = {
    admin: "bg-purple-100 text-purple-800",
    student: "bg-blue-100 text-blue-800",
    librarian: "bg-green-100 text-green-800",
    faculty: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
        roleStyles[role] || "bg-gray-100 text-gray-800"
      }`}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

// Status badge component
const StatusBadge = ({ status }) => {
  const statusStyles = {
    active: "bg-green-100 text-green-800",
    suspended: "bg-red-100 text-red-800",
    inactive: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    role: "",
    page: 1,
    limit: 10,
  });

  // Fetch users data
  const { data, isLoading, error, refetch } = useGetAllUsers(filters);
  const updateUserRole = useUpdateUser();
  const deleteUser = useDeleteUser();

  // Extract users and pagination from the response
  const users = data?.users || [];
  const pagination = data?.pagination || {
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
  };

  // Handle user search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Apply search filter
  const handleApplySearch = () => {
    setFilters((prev) => ({
      ...prev,
      name: searchTerm,
      page: 1, // Reset to first page on new search
    }));
  };

  // Clear filters
  const handleClearSearch = () => {
    setSearchTerm("");
    setFilters({
      name: "",
      email: "",
      role: "",
      page: 1,
      limit: 10,
    });
  };

  // Handle user role update
  const handleRoleUpdate = (userId, newRole) => {
    updateUserRole.mutate(
      { id: userId, userData: { role: newRole } },
      {
        onSuccess: () => {
          toast.success(`User role updated to ${newRole}`);
          setIsEditDialogOpen(false);
          setEditingUser(null);
        },
      }
    );
  };

  // Handle user deletion
  const handleDeleteUser = () => {
    if (!userToDelete) return;

    deleteUser.mutate(userToDelete, {
      onSuccess: () => {
        toast.success("User deleted successfully");
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
      },
    });
  };

  // Open edit dialog
  const openEditDialog = (user) => {
    setEditingUser({ ...user });
    setIsEditDialogOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (userId) => {
    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  // Handle sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  // Filter and sort users locally
  const filteredAndSortedUsers = [...users].sort((a, b) => {
    if (sortBy === "name") {
      return sortDirection === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === "email") {
      return sortDirection === "asc"
        ? a.email.localeCompare(b.email)
        : b.email.localeCompare(a.email);
    } else if (sortBy === "role") {
      return sortDirection === "asc"
        ? a.role.localeCompare(b.role)
        : b.role.localeCompare(a.role);
    } else if (sortBy === "createdAt") {
      return sortDirection === "asc"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700 mb-6">
        Error loading users: {error.message || "An error occurred"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Management</h1>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
        >
          <ArrowPathIcon className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Search and filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.key === "Enter" && handleApplySearch()}
              placeholder="Search users by name..."
              className="pl-10 pr-4 py-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleApplySearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Search
            </button>
            <button
              onClick={handleClearSearch}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : (
          <>
            {filteredAndSortedUsers.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No users found matching your criteria
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("name")}
                        >
                          <div className="flex items-center">
                            Name
                            <ChevronUpDownIcon className="w-4 h-4 ml-1" />
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("email")}
                        >
                          <div className="flex items-center">
                            Email
                            <ChevronUpDownIcon className="w-4 h-4 ml-1" />
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("role")}
                        >
                          <div className="flex items-center">
                            Role
                            <ChevronUpDownIcon className="w-4 h-4 ml-1" />
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("createdAt")}
                        >
                          <div className="flex items-center">
                            Joined
                            <ChevronUpDownIcon className="w-4 h-4 ml-1" />
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAndSortedUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <UserCircleIcon className="h-8 w-8 text-gray-500" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {user.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <RoleBadge role={user.role} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={user.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.createdAt
                              ? format(new Date(user.createdAt), "MMM d, yyyy")
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => openEditDialog(user)}
                              className="text-blue-600 hover:text-blue-900 mx-2"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => openDeleteDialog(user.id)}
                              className="text-red-600 hover:text-red-900 mx-2"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination controls */}
                {pagination.totalPages > 1 && (
                  <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-between">
                      <button
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            page: Math.max(1, prev.page - 1),
                          }))
                        }
                        disabled={pagination.currentPage <= 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <div className="flex items-center">
                        <p className="text-sm text-gray-700">
                          Page{" "}
                          <span className="font-medium">
                            {pagination.currentPage}
                          </span>{" "}
                          of{" "}
                          <span className="font-medium">
                            {pagination.totalPages}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            page: Math.min(
                              pagination.totalPages,
                              prev.page + 1
                            ),
                          }))
                        }
                        disabled={
                          pagination.currentPage >= pagination.totalPages
                        }
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to user details below.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={editingUser.email}
                  disabled
                  className="col-span-3 bg-gray-100"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <select
                  id="role"
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="student">Student</option>
                  <option value="librarian">Librarian</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleRoleUpdate(editingUser.id, editingUser.role)}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
