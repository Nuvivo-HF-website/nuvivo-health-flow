// Centralized auth hook to prevent duplicate context usage
import { useAuth } from '@/contexts/EnhancedAuthContext';

export { useAuth };
export default useAuth;