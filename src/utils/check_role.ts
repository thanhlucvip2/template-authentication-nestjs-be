import { UserProfileModel } from '@Dto/user.dto';

export const checkRole = (userProfile: UserProfileModel, checkRole: string) => {
  const { role } = userProfile;

  return role === checkRole;
};
