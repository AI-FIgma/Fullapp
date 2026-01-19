import { ShieldCheck, Shield, Stethoscope, Dumbbell } from 'lucide-react';
import type { UserRole } from '../App';

interface UserBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
}

export function UserBadge({ role, size = 'md' }: UserBadgeProps) {
  if (role === 'member' || role === 'user') return null;

  const getIconClass = () => {
    switch (size) {
      case 'sm': return 'w-3 h-3';
      case 'lg': return 'w-4 h-4';
      default: return 'w-3.5 h-3.5';
    }
  };

  const iconClass = getIconClass();

  if (role === 'vet') {
    return (
      <span className="inline-flex items-center gap-0.5 bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full" title="Verified Veterinarian">
        <Stethoscope className={iconClass} />
        <span className="text-xs font-medium ml-1">Vet</span>
      </span>
    );
  }

  if (role === 'trainer') {
    return (
      <span className="inline-flex items-center gap-0.5 bg-green-100 text-green-600 px-2 py-0.5 rounded-full" title="Certified Trainer">
        <Dumbbell className={iconClass} />
        <span className="text-xs font-medium ml-1">Trainer</span>
      </span>
    );
  }

  if (role === 'admin') {
    return (
      <span className="inline-flex items-center gap-0.5 bg-red-100 text-red-600 px-2 py-0.5 rounded-full" title="Admin">
        <ShieldCheck className={iconClass} />
        <span className="text-xs font-medium ml-1">Admin</span>
      </span>
    );
  }

  if (role === 'moderator') {
    return (
      <span className="inline-flex items-center gap-0.5 bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full" title="Moderator">
        <Shield className={iconClass} />
        <span className="text-xs font-medium ml-1">Mod</span>
      </span>
    );
  }

  return null;
}