import { createContext } from 'react';

import { User } from '../types/api';

const UserContext = createContext<User>({ principal_id: null });

export default UserContext;
