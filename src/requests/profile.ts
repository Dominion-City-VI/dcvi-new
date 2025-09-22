import { PROFILE } from '@/constants/api';
import dcviServer from '@/servers/dcvi';

// get
export const getProfile = () => dcviServer.get<IDCVIServerRes<TProfileInfo>>(PROFILE.USER_INFO);
