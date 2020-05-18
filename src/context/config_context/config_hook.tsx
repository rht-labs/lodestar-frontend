import { useContext } from 'react';

import { ConfigContext } from './config_context';

export const useConfig = () => useContext(ConfigContext);
