import { createContext } from 'react';

import { User } from '../types/api';

const defaultUser = { principal_id: null };

const UserContext = createContext<User>(defaultUser);

export default UserContext;
