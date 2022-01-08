import { createContext } from 'react';

import { SessionData } from '../types/api';

const anonymousSession = { principal_id: null };

const SessionContext = createContext<SessionData>(anonymousSession);

export default SessionContext;
