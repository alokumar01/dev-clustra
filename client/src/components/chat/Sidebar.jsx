// src/components/chat/Sidebar.jsx
import { MessageSquare, Users, Settings } from 'lucide-react';

export default function Sidebar({ activeIcon, onIconClick }) {
  const icons = [
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-[60px] bg-white shadow-sm flex flex-col items-center py-4 gap-4 hidden md:flex">
      {/* Logo */}
      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
        C
      </div>
      {/* Icons */}
      {icons.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onIconClick(id)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
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