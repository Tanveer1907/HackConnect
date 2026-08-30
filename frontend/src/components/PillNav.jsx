import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import './PillNav.css';

const PillNav = ({
  className = '',
  ease = 'power3.easeOut',
  initialLoadAnimation = true
}) => {
  const location = useLocation();
  const activeHref = location.pathname;
  const { theme, toggleTheme } = useTheme();
  const { user, token, logout } = useAuth();

  const [hasNotifications, setHasNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navItemsRef = useRef(null);
  const logoRef = useRef(null);

  // Define navigation items dynamically
  const items = useMemo(() => {
    return token
      ? [
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Hackathons', href: '/hackathons' },
          { label: 'Teams', href: '/teams' },
          { label: 'Internships', href: '/internships' },
          { label: 'Chat', href: '/chat' },
          ...(user?.role === 'admin' ? [{ label: '🛡️ Moderation', href: '/admin/moderation' }] : [])
        ]
      : [
          { label: 'Home', href: '/' },
          { label: 'Hackathons', href: '/hackathons' },
          { label: 'Find Teams', href: '/teams' },
          { label: 'Internships', href: '/internships' }
        ];
  }, [token, user?.role]);

  // Check unread messages for notification dot
  useEffect(() => {
    const fetchNotifications = async () => {
      if (token && user) {
        try {
          if (location.pathname === '/chat') {
            localStorage.setItem('lastChatVisit', Date.now().toString());
            setHasNotifications(false);
            return;
          }
          const { getMyChats } = await import('../services/api');
          const chatRes = await getMyChats();
          const lastVisit = parseInt(localStorage.getItem('lastChatVisit') || '0');
          if (chatRes.data && chatRes.data.length > 0) {
            const hasUnread = chatRes.data.some(chat => {
              const lastMsg = chat.latestMessage;
              if (!lastMsg) return false;
              const isFromOthers = lastMsg.sender !== user._id && lastMsg.sender?._id !== user._id;
              const isNew = new Date(lastMsg.createdAt).getTime() > lastVisit;
              return isFromOthers && isNew;
            });
            setHasNotifications(hasUnread);
          }
        } catch (err) {
          console.error('Failed to fetch notifications', err);
        }
      }
    };
    fetchNotifications();

    if (location.pathname === '/chat') {
      setHasNotifications(false);
      localStorage.setItem('lastChatVisit', Date.now().toString());
    }
  }, [token, user, location.pathname]);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, idx) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        if (w === 0 || h === 0) return;

        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector('.pill-label');
        const white = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        tlRefs.current[idx]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.25, xPercent: -50, duration: 0.5, ease, overwrite: 'auto' }, 0);

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 0.35, ease, overwrite: 'auto' }, 0);
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 8), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 0.35, ease, overwrite: 'auto' }, 0);
        }

        tlRefs.current[idx] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 1 });
    }

    if (initialLoadAnimation) {
      const logo = logoRef.current;
      const navItems = navItemsRef.current;

      if (logo) {
        gsap.fromTo(logo, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease });
      }

      if (navItems) {
        gsap.fromTo(navItems, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease });
      }
    }

    return () => window.removeEventListener('resize', onResize);
  }, [items, ease, initialLoadAnimation, location.pathname]);

  const handleEnter = i => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.25,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLeave = i => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3.5, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: -45, y: -3.5, duration: 0.3, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10, scaleY: 0.95 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease,
            transformOrigin: 'top center'
          }
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          scaleY: 0.95,
          duration: 0.2,
          ease,
          transformOrigin: 'top center',
          onComplete: () => {
            gsap.set(menu, { visibility: 'hidden' });
          }
        });
      }
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const renderAvatar = () => {
    if (!user) {
      return (
        <div className="w-full h-full bg-slate-700 flex items-center justify-center text-slate-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      );
    }
    if (user.profileImage) {
      return <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />;
    }
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] flex items-center justify-center text-xs font-bold text-white uppercase">
        {user.name ? user.name.charAt(0) : 'U'}
      </div>
    );
  };

  const logoDestination = token ? '/dashboard' : '/';

  const isDarkMode = theme === 'dark';
  const baseColor = isDarkMode ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.88)';
  const pillBg = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)';
  const pillText = isDarkMode ? 'rgba(241, 245, 249, 0.85)' : '#1e293b';
  const hoverText = '#ffffff';

  const cssVars = {
    '--base': baseColor,
    '--pill-bg': pillBg,
    '--hover-text': hoverText,
    '--pill-text': pillText
  };

  return (
    <div className="pill-nav-container">
      <nav className={`pill-nav ${className}`} aria-label="Primary" style={cssVars}>
        {/* LOGO */}
        <div className="pill-nav-left">
          <Link
            className="pill-logo"
            to={logoDestination}
            aria-label="HackConnect Home"
            ref={logoRef}
          >
            <div className="pill-logo-icon">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <span className="hidden sm:inline font-extrabold tracking-tight">HackConnect</span>
          </Link>
        </div>

        {/* DESKTOP NAV PILLS */}
        <div className="pill-nav-items desktop-only" ref={navItemsRef}>
          <ul className="pill-list" role="menubar">
            {items.map((item, i) => {
              const isActive = activeHref === item.href;
              const isChat = item.href === '/chat';

              return (
                <li key={item.href || `item-${i}`} role="none">
                  <Link
                    role="menuitem"
                    to={item.href}
                    className={`pill${isActive ? ' is-active' : ''}`}
                    aria-label={item.label}
                    onMouseEnter={() => handleEnter(i)}
                    onMouseLeave={() => handleLeave(i)}
                  >
                    <span
                      className="hover-circle"
                      aria-hidden="true"
                      ref={el => {
                        circleRefs.current[i] = el;
                      }}
                    />
                    <span className="label-stack relative">
                      <span className="pill-label flex items-center gap-1.5">
                        {item.label}
                        {isChat && hasNotifications && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
                        )}
                      </span>
                      <span className="pill-label-hover flex items-center gap-1.5" aria-hidden="true">
                        {item.label}
                        {isChat && hasNotifications && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                        )}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* RIGHT SIDE ACTIONS */}
        <div className="pill-nav-right">
          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-amber-500 dark:text-blue-300 hover:scale-105 transition-all"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* AUTH STATUS */}
          {token ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" title="View Profile" className="relative group">
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 border border-white/20 overflow-hidden shadow-sm transition group-hover:scale-105 group-hover:border-blue-500">
                  {renderAvatar()}
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="hidden sm:block text-xs font-bold text-rose-500 dark:text-rose-400 px-3 py-1.5 rounded-full hover:bg-rose-500/10 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-500 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-sm transition"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            className="mobile-menu-button mobile-only"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            ref={hamburgerRef}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </nav>

      {/* MOBILE POPOVER MENU */}
      <div className="mobile-menu-popover mobile-only" ref={mobileMenuRef} style={cssVars}>
        <ul className="mobile-menu-list">
          {items.map((item, i) => (
            <li key={item.href || `mobile-item-${i}`}>
              <Link
                to={item.href}
                className={`mobile-menu-link${activeHref === item.href ? ' is-active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>{item.label}</span>
                {item.href === '/chat' && hasNotifications && (
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                )}
              </Link>
            </li>
          ))}
          {token && (
            <li>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="mobile-menu-link text-rose-400 w-full text-left"
              >
                🚪 Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PillNav;
