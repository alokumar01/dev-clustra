import { Boxes, LogOutIcon } from 'lucide-react';
import { MessageSquare, Users, Settings2, CircleUserRoundIcon, PhoneCallIcon, UserRoundPlusIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Sidebar({ activeIcon, onIconClick }) {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();


  const icons = [
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'groups', icon: Users, label: 'Groups' },
    { id: 'profile', icon: CircleUserRoundIcon, label: 'Profile'},
    { id: 'calls', icon: PhoneCallIcon, label: 'Calls'},
    { id: 'settings', icon: Settings2, label: 'Settings'},
    { id: 'invite', icon: UserRoundPlusIcon , label: 'Invite'}
  ];

  return (
    <aside className="hidden h-full w-[60px] shrink-0 flex-col items-center border-r border-border/70 bg-background/90 px-3 py-4 shadow-sm backdrop-blur-xl md:flex">
      <div className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm shadow-blue-600/20" title="DevClustra">
        <Boxes className="size-5" />
      </div>

      <nav className="flex flex-1 flex-col items-center gap-2" aria-label="Chat navigation">
        {icons.map(({ id, icon: Icon, label }) => (
          <Button
            variant="ghost"
            key={id}
            onClick={() => onIconClick(id)}
            className={cn(
              "size-9 rounded-2xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer",
              activeIcon === id && "bg-blue-600 text-white hover:bg-blue-600 hover:text-white"
            )}
            title={label}
            aria-label={label}
          >
            <Icon className="size-5" />
          </Button>
        ))}
      </nav>

      <Button
        variant="ghost"
        onClick={async () => {
          await logout();
          router.replace('/login');
        }}
        className="size-11 cursor-pointer rounded-2xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        title="Logout"
        aria-label="Logout"
      >
        <LogOutIcon className="size-5" />
      </Button>
    </aside>
  );
}
