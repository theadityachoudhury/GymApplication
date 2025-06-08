import ProfileHeader from './ProfileHeader';
import ProfileEditForm from './ProfileEditForm';
import { getAuthState, useAppSelector } from '@/hooks/redux';
import { Role } from '@/types/auth/user.enum';
import CoachProfileEditForm from './CoachProfileEditForm';
import AdminProfileEditForm from './AdminProfileEditForm';

function GeneralInformation() {
	const { userDetail } = useAppSelector(getAuthState);
	console.log(userDetail);

	return (
		<>
			<ProfileHeader />
			{userDetail?.role.toUpperCase() === Role.CLIENT && <ProfileEditForm />}
			{userDetail?.role.toUpperCase() === Role.COACH && <CoachProfileEditForm />}
			{userDetail?.role.toUpperCase() === Role.ADMIN && <AdminProfileEditForm />}
		</>
	);
}

export default GeneralInformation;
