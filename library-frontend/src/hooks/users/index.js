import {
  useGetAllUsers,
  useGetUserById,
  useUpdateUser,
  useDeleteUser,
  useGetUserLoanHistory,
  USERS_QUERY_KEY
} from './useUsers';

import {
  useGetAdminUsers,
  useGetAdminUserById,
  useUpdateUserRole,
  useToggleUserStatus,
  ADMIN_USERS_QUERY_KEY
} from './useAdminUsers';

export {
  // Regular user hooks
  useGetAllUsers,
  useGetUserById,
  useUpdateUser,
  useDeleteUser,
  useGetUserLoanHistory,
  USERS_QUERY_KEY,
  
  // Admin-specific hooks
  useGetAdminUsers,
  useGetAdminUserById,
  useUpdateUserRole,
  useToggleUserStatus,
  ADMIN_USERS_QUERY_KEY
};
