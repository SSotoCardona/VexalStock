import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { getCartItems, getMessages } from '@/api/backendClient';
import { ShoppingBag, Heart, MessageCircle, Plus, User, Menu, X, Search, LogOut } from 'lucide-react';
import { Button } from '@/componentes/ui/button';
import { Badge } from '@/componentes/ui/badge';
import { useQuery } from '@tanstack/react-query';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const { data: cartItems = [] } = useQuery({
    queryKey: ['cart-count', user?.email],
    queryFn: () => user ? getCartItems(user.email) : [],
    enabled: !!user,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: unreadMessages = [] } = useQuery({
    queryKey: ['unread-count', user?.email],
    queryFn: () => user ? getMessages({ receiverEmail: user.email, unreadOnly: true }) : [],
    enabled: !!user,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const navLinks = [
    { to: '/', label: 'Explorar', icon: Search },
    { to: '/sell', label: 'Vender', icon: Plus },
    { to: '/favorites', label: 'Favoritos', icon: Heart },
    { to: '/cart', label: 'Carrito', icon: ShoppingBag, count: cartItems.length },
    { to: '/messages', label: 'Mensajes', icon: MessageCircle, count: unreadMessages.length },
    { to: '/my-orders', label: 'Pedidos', icon: ShoppingBag },
    { to: '/profile', label: 'Perfil', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-semibold tracking-tight">VexalStock</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`
                }
              >
                <link.icon className="w-4 h-4" />
                <span className="hidden lg:inline">{link.label}</span>
                {link.count > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
                    {link.count}
                  </Badge>
                )}
              </NavLink>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-sm text-muted-foreground"
              onClick={logout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                    isActive ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`
                }
              >
                <link.icon className="w-4 h-4" />
                {link.label}
                {link.count > 0 && (
                  <Badge className="ml-auto bg-primary text-primary-foreground text-[10px]">
                    {link.count}
                  </Badge>
                )}
              </NavLink>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground"
              onClick={logout}
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}