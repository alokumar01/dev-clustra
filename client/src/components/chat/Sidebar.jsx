// src/components/chat/Sidebar.jsx


import { LogOutIcon } from 'lucide-react';
import { MessageSquare, Users, Settings2, CircleUserRoundIcon, PhoneCallIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'next/navigation';

export default function Sidebar({ activeIcon, onIconClick }) {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();


  const icons = [
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'groups', icon: Users, label: 'Groups' },
    { id: 'profile', icon: CircleUserRoundIcon, label: 'Profile'},
    { id: 'calls', icon: PhoneCallIcon, label: 'Calls'},
    { id: 'settings', icon: Settings2, label: 'Settings'},
    // { id: 'logout', icon: LogOutIcon, label: 'Logout'}


  ];

  return (
    <div className="w-15 bg-white shadow-sm flex flex-col items-center py-4 gap-4 md:flex">
      {/* Logo */}
      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
        Dev Chat
      </div>

      {/* Icons */}
      {icons.map(({ id, icon: Icon, label }) => (
        <Button
          variant="ghost"
          key={id}
          onClick={() => onIconClick(id)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
            activeIcon === id
              ? 'bg-orange-100 text-orange-600'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
          title={label}
        >
          <Icon size={20} />
        </Button>
      ))}

      <div className="mt-auto">
        {/* // Logout button */}
        <Button
          variant="ghost"
          onClick={async () => {
            await logout();
            router.replace('/login');
          }}
          className={`w-10 h-10  rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
            'text-gray-500 hover:bg-red-500'
          }`}

          title="Logout"
        >
          <LogOutIcon size={20} />
        </Button>
      </div>
    </div>
  );
}
