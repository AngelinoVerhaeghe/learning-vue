import type { User, ApiUser } from '@/types/User';

export const transformUser = (apiUser: ApiUser): User => {
  return {
    id: apiUser.id,
    firstName: apiUser.first_name,
    lastName: apiUser.last_name,
    userName: apiUser.user_name,
    email: apiUser.email,
  };
};
