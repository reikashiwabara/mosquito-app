import type { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import type { User } from '../types';

interface ProtectedRouteProps {
  user: User | null;
  children: ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
