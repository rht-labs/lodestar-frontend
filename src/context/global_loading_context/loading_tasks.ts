import { useSession } from '../session_context/session_context';
import { useConfig } from '../config_context/config_hook';

type LoadingTask = () => Promise<void>;
export const LOADING_TASKS: LoadingTask[] = [
  async () => {
    const { checkAuthStatus } = useSession();
    checkAuthStatus();
  },
  async () => {
    const { fetchConfig } = useConfig();
    fetchConfig();
  },
];
