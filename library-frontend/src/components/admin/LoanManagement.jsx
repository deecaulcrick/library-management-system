"use client";

import React, { useState, useEffect } from "react";
import { useGetAdminLoans, useUpdateLoanStatus, useRecordFinePayment } from "@/hooks/loans/useAdminLoans";
import { format } from "date-fns";
import { toast } from "sonner";
import { 
  ArrowPathIcon, 
  DocumentCheckIcon, 
  ExclamationCircleIcon,
  CreditCardIcon, 
  CheckCircleIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

// Status badge component
const StatusBadge = ({ status }) => {
  const statusStyles = {
    borrowed: "bg-blue-100 text-blue-800",
    overdue: "bg-red-100 text-red-800",
    returned: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-gray-100 text-gray-800",
  };

  return (
    <span 
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Loan actions component
const LoanActions = ({ loan, onUpdateStatus, onRecordPayment }) => {
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [fineAmount, setFineAmount] = useState(loan.fineAmount || 0);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [showFineInput, setShowFineInput] = useState(false);
  const [showPaymentInput, setShowPaymentInput] = useState(false);

  // Define possible actions based on loan status
  const getAvailableActions = () => {
    switch (loan.status) {
      case "borrowed":
        return [
          { 
            label: "Mark as Returned", 
            action: () => onUpdateStatus(loan.id, "returned"),
            icon: <DocumentCheckIcon className="w-4 h-4 mr-2" />
          },
          { 
            label: "Mark as Overdue", 
            action: () => setShowFineInput(true),
            icon: <ExclamationCircleIcon className="w-4 h-4 mr-2" />
          }
        ];
      case "overdue":
        return [
          { 
            label: "Mark as Returned", 
            action: () => onUpdateStatus(loan.id, "returned"),
            icon: <DocumentCheckIcon className="w-4 h-4 mr-2" />
          },
          { 
            label: "Record Fine Payment", 
            action: () => setShowPaymentInput(true),
            icon: <CreditCardIcon className="w-4 h-4 mr-2" />
          },
          { 
            label: "Update Fine Amount", 
            action: () => setShowFineInput(true),
            icon: <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
          }
        ];
      case "pending":
        return [
          { 
            label: "Approve", 
            action: () => onUpdateStatus(loan.id, "borrowed"),
            icon: <CheckCircleIcon className="w-4 h-4 mr-2" />
          },
          { 
            label: "Cancel", 
            action: () => onUpdateStatus(loan.id, "cancelled"),
            icon: <ExclamationCircleIcon className="w-4 h-4 mr-2" />
          }
        ];
      default:
        return [];
    }
  };

  const handleFineSubmit = (e) => {
    e.preventDefault();
    onUpdateStatus(loan.id, "overdue", parseFloat(fineAmount));
    setShowFineInput(false);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    onRecordPayment(loan.id, parseFloat(paymentAmount));
    setShowPaymentInput(false);
    setPaymentAmount("");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsActionsOpen(!isActionsOpen)}
        className="text-gray-500 hover:text-blue-600 p-1 rounded-full focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
        </svg>
      </button>

      {isActionsOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            {getAvailableActions().map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  action.action();
                  setIsActionsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {showFineInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-medium mb-4">Set Fine Amount</h3>
            <form onSubmit={handleFineSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fine Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={fineAmount}
                  onChange={(e) => setFineAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowFineInput(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPaymentInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-medium mb-4">Record Payment</h3>
            <form onSubmit={handlePaymentSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Fine: ${loan.fineAmount}
                </label>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Paid: ${loan.finePaid || 0}
                </label>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={loan.fineAmount - (loan.finePaid || 0)}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentInput(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Filter component
const LoanFilters = ({ filters, setFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFilters(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      status: "",
      userId: "",
      bookId: "",
      startDate: "",
      endDate: "",
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <FunnelIcon className="w-5 h-5 mr-2" />
        Filter Loans
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={localFilters.status}
              onChange={(e) => setLocalFilters({ ...localFilters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="borrowed">Borrowed</option>
              <option value="overdue">Overdue</option>
              <option value="returned">Returned</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User ID
            </label>
            <input
              type="text"
              value={localFilters.userId}
              onChange={(e) => setLocalFilters({ ...localFilters, userId: e.target.value })}
              placeholder="Enter user ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book ID
            </label>
            <input
              type="text"
              value={localFilters.bookId}
              onChange={(e) => setLocalFilters({ ...localFilters, bookId: e.target.value })}
              placeholder="Enter book ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={localFilters.startDate}
              onChange={(e) => setLocalFilters({ ...localFilters, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={localFilters.endDate}
              onChange={(e) => setLocalFilters({ ...localFilters, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-end space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
              Apply Filters
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Reset
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

// Main component
const LoanManagement = () => {
  const [filters, setFilters] = useState({
    status: "",
    userId: "",
    bookId: "",
    startDate: "",
    endDate: "",
    page: 1,
  });

  const { data, isLoading, error, refetch } = useGetAdminLoans(filters);
  const updateLoanStatus = useUpdateLoanStatus();
  const recordPayment = useRecordFinePayment();

  // Properly extract loans from the nested API response
  const loans = data?.loans || [];
  const pagination = data?.pagination || { totalItems: 0, currentPage: 1, totalPages: 1, itemsPerPage: 10 };

  // Handle updating loan status
  const handleUpdateStatus = (loanId, status, fineAmount) => {
    updateLoanStatus.mutate(
      { loanId, status, fineAmount },
      {
        onSuccess: () => {
          toast.success(`Loan marked as ${status}`);
        }
      }
    );
  };

  // Handle recording payment
  const handleRecordPayment = (loanId, amount) => {
    recordPayment.mutate(
      { loanId, amount },
      {
        onSuccess: () => {
          toast.success(`Payment of $${amount} recorded`);
        }
      }
    );
  };

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700 mb-6">
        Error loading loans: {error.message || "An error occurred"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Loan Management</h1>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
        >
          <ArrowPathIcon className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      <LoanFilters filters={filters} setFilters={setFilters} />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading loans...</p>
          </div>
        ) : (
          <>
            {loans.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No loans found matching your criteria
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Book
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Borrow Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fine
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loans.map((loan) => (
                        <tr key={loan.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {loan.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {loan.Book?.title || "Book not found"}
                            </div>
                            <div className="text-sm text-gray-500">ID: {loan.bookId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {loan.User?.name || "User not found"}
                            </div>
                            <div className="text-sm text-gray-500">ID: {loan.userId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {loan.borrowDate ? format(new Date(loan.borrowDate), "MMM d, yyyy") : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {loan.dueDate ? format(new Date(loan.dueDate), "MMM d, yyyy") : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={loan.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {loan.fineAmount > 0 ? (
                              <div>
                                <div className="text-red-600 font-medium">${loan.fineAmount.toFixed(2)}</div>
                                {loan.finePaid > 0 && (
                                  <div className="text-gray-500 text-xs">
                                    Paid: ${loan.finePaid.toFixed(2)}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-500">None</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <LoanActions 
                              loan={loan} 
                              onUpdateStatus={handleUpdateStatus} 
                              onRecordPayment={handleRecordPayment} 
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination controls */}
                {pagination.totalPages > 1 && (
                  <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button 
                        onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
                        disabled={pagination.currentPage <= 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, page: Math.min(pagination.totalPages, (prev.page || 1) + 1) }))}
                        disabled={pagination.currentPage >= pagination.totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}</span> to{" "}
                          <span className="font-medium">
                            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                          </span>{" "}
                          of <span className="font-medium">{pagination.totalItems}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
                            disabled={pagination.currentPage <= 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                          <button
                            onClick={() => setFilters(prev => ({ ...prev, page: Math.min(pagination.totalPages, (prev.page || 1) + 1) }))}
                            disabled={pagination.currentPage >= pagination.totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LoanManagement;
