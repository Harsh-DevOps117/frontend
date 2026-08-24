'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem('user_name');
    if (storedName) {
      setUserName(storedName);
    } else {
      setUserName(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user_name');
    setUserName(null);
    router.push('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const isDashboard = pathname === '/dashboard';
  const isLoggedIn = userName !== null || isDashboard;
  const displayString = userName || 'Guest User';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href={isLoggedIn ? "/dashboard" : "/"} className="navbar-logo">
          OogWay
        </Link>
        <div className="navbar-links">
          {isLoggedIn ? (
            <div className="user-menu">
              <div className="user-avatar">
                <span>{getInitials(displayString)}</span>
              </div>
              <span className="user-name">{displayString}</span>
              <button onClick={handleLogout} className="btn btn-ghost logout-btn">
                Log Out
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link href="/signup" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
