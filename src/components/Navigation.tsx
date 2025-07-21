
import { ArrowLeft, Home, User, LogOut, DollarSign } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GradientButton } from '@/components/ui/gradient-button';
import { useAuth } from '@/hooks/useAuth';

interface NavigationProps {
  title?: string;
  showBack?: boolean;
}

export const Navigation = ({ title, showBack = true }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleBack = () => {
    // If we're on a specific tool page, go back to dashboard
    if (location.pathname === '/clarity-coach' || 
        location.pathname === '/niche-validation' || 
        location.pathname === '/business-model') {
      navigate('/dashboard');
    } else {
      // Otherwise use browser back
      window.history.back();
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="flex items-center justify-between p-6 bg-white/5 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center gap-4">
        {showBack && (
          <button
            onClick={handleBack}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        {title && (
          <h1 className="text-2xl font-bold gradient-text">{title}</h1>
        )}
        
        {!title && (
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Pricing link - visible on all pages */}
        <button
          onClick={() => navigate('/pricing')}
          className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10"
        >
          <DollarSign className="w-4 h-4" />
          <span>Pricing</span>
        </button>

        {user && (
          <>
            <div className="text-white text-sm">
              {user.email}
            </div>
            <GradientButton
              onClick={handleSignOut}
              variant="secondary"
              size="sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </GradientButton>
          </>
        )}
      </div>
    </nav>
  );
};
