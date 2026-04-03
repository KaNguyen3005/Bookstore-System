import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

export interface PendingAction {
  type: string;
  payload: any;
  timestamp: number;
}

export const useRequireAuth = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuthAction = (action: () => void, pendingMetadata?: { type: string; payload: any }) => {
    if (isAuthenticated) {
      action();
    } else {
      if (pendingMetadata) {
        const pendingAction: PendingAction = {
          ...pendingMetadata,
          timestamp: Date.now(),
        };
        sessionStorage.setItem('pendingAction', JSON.stringify(pendingAction));
      }
      
      // Save current location as 'from' for redirect back
      navigate('/login', { state: { from: location.pathname } });
    }
  };

  return { handleAuthAction };
};
