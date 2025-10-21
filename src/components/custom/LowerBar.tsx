import { cn } from '@/lib/utils';
import { LayoutDashboard,  MessageCircle,  User } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

export function LowerBar() {
  const location = useLocation();

  const navItems = [
    { href: "/app/dashboard", icon: LayoutDashboard },
    { href: "/app/chat", icon: MessageCircle },
    { href: "/app/chat", icon: MessageCircle },
    { href: "/app/profile", icon: User },
  ];

  return (
    <>
      <div className="pt-[85px]" />
      <div className="bg-card-foreground fixed w-[90%] h-[80px] bottom-6 left-[5%] rounded-3xl shadow-lg">
        <div className="grid grid-cols-4 h-full">
          {navItems.map(({ href, icon: Icon }) => {
            const isActive =
              location.pathname === href ||
              location.pathname.startsWith(`${href}/`);

            return (
              <NavLink
                key={href}
                to={href}
                className={cn(
                  "m-2 flex items-center justify-center rounded-[18px] shadow-xl transition-all duration-200",
                  isActive
                    ? "bg-card text-card-foreground scale-105"
                    : "text-card hover:scale-105 hover:bg-card/20"
                )}
              >
                <Icon className="size-8" />
              </NavLink>
            );
          })}
        </div>
      </div>
    </>
  );
}
