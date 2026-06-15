// src/components/chat/Sidebar.jsx


import { MessageSquare, Users, Settings2, CircleUserRoundIcon, PhoneCallIcon } from 'lucide-react';

export default function Sidebar({ activeIcon, onIconClick }) {
  const icons = [
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'groups', icon: Users, label: 'Groups' },
    { id: 'profile', icon: CircleUserRoundIcon, label: 'Profile'},
    { id: 'calls', icon: PhoneCallIcon, label: 'Calls'},
    { id: 'settings', icon: Settings2, label: 'Settings'}

  ];

  return (
    <div className="w-15 bg-white shadow-sm flex flex-col items-center py-4 gap-4 md:flex">
      {/* Logo */}
      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
        Dev C
      </div>
      {/* Icons */}
      {icons.map(({ id, icon: Icon, label }) => (
        <button
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
        </button>
      ))}
    </div>
  );
}