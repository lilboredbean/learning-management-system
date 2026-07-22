import { PlantWidget } from './PlantWidget';
import { motion } from 'motion/react';

export type PageName = 'courses' | 'materials' | 'assignments' | 'announcements' | 'progress' | 'profile';

interface NavItem {
  id: PageName;
  label: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
  userOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    id: 'courses',
    label: 'Courses',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 8L9 6L12 8L9 10L6 8Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M5 15H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'materials',
    label: 'Materials',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M4 3H11L15 7V15C15 15.6 14.6 16 14 16H4C3.4 16 3 15.6 3 15V4C3 3.4 3.4 3 4 3Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 3V7H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6 10H12M6 12.5H10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'assignments',
    label: 'Assignments',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="3" y="2" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 7H12M6 10H10M6 13H8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M10 13L11.5 14.5L14 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'announcements',
    label: 'Announcements',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 7H5V13H3V7Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M5 7L13 4V16L5 13" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <circle cx="15" cy="5" r="2" fill="currentColor" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: 'progress',
    label: 'Progress',
    adminOnly: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 14L6 10L9 12L12 7L15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 16H15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    userOnly: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2.5 16C2.5 13 5.5 11 9 11C12.5 11 15.5 13 15.5 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

function GoldenLeafBadge() {
  return (
    <span
      title="Member"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '3px',
        padding: '1px 6px', borderRadius: '9999px',
        background: 'linear-gradient(135deg, #F9E4A0, #E8C84A)',
        border: '1px solid rgba(212,168,83,0.5)',
      }}
    >
      <svg width="9" height="10" viewBox="0 0 9 10" fill="none">
        <path d="M4.5 9 C4.5 9 1 7 1 4 C1 1.5 4.5 0.5 4.5 0.5 C4.5 0.5 8 1.5 8 4 C8 7 4.5 9 4.5 9 Z" fill="#B8860B" />
        <line x1="4.5" y1="9" x2="4.5" y2="0.5" stroke="#F9E4A0" strokeWidth="0.6" strokeDasharray="1.5 1.2" />
      </svg>
      <span style={{ fontSize: '0.58rem', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, color: '#7A5C00', letterSpacing: '0.03em' }}>
        MEMBER
      </span>
    </span>
  );
}

interface LayoutProps {
  currentUser: { name: string; email: string; role: 'user' | 'admin'; isMember: boolean };
  activePage: PageName;
  setActivePage: (p: PageName) => void;
  plantPercentage: number;
  plantDroop: boolean;
  onLogout: () => void;
  children: React.ReactNode;
  selectedCourseTitle?: string;
}

export function Layout({
  currentUser,
  activePage,
  setActivePage,
  plantPercentage,
  plantDroop,
  onLogout,
  children,
  selectedCourseTitle,
}: LayoutProps) {
  const visibleNavItems = navItems.filter(item => {
    if (item.adminOnly && currentUser.role !== 'admin') return false;
    if (item.userOnly && currentUser.role !== 'user') return false;
    return true;
  });

  const userLabel = currentUser.role === 'admin' ? 'Instructor' : 'Student';
  const userColor = currentUser.role === 'admin' ? '#C8714A' : '#6B8F6B';

  const pageTitle: Record<PageName, string> = {
    courses: 'Courses',
    materials: 'Materials',
    assignments: 'Assignments',
    announcements: 'Announcements',
    progress: 'Progress Tracker',
    profile: 'My Profile',
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F7F4EE' }}>
      {/* Sidebar */}
      <aside className="flex flex-col" style={{ width: '220px', minWidth: '220px', background: '#EAF4EF', borderRight: '1px solid rgba(107,143,107,0.2)', padding: '20px 14px' }}>
        {/* Brand */}
        <div className="flex items-center gap-2 mb-7 px-1">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="13" fill="#2D5016" />
            <path d="M14 23 C14 23 7 18 7 12 C7 7.5 14 5.5 14 5.5 C14 5.5 21 7.5 21 12 C21 18 14 23 14 23 Z" fill="#8FAF8F" />
            <line x1="14" y1="23" x2="14" y2="5.5" stroke="#D4EDD8" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
          <span style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#2D5016' }}>Grove LMS</span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {visibleNavItems.map(item => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 12px', borderRadius: '12px', border: 'none',
                  background: isActive ? '#2D5016' : 'transparent',
                  color: isActive ? '#F7F4EE' : '#4A6741',
                  cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.88rem',
                  transition: 'all 0.15s', width: '100%',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(107,143,107,0.15)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ opacity: isActive ? 1 : 0.75 }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Plant widget */}
        <div className="mt-4 mb-3">
          <PlantWidget percentage={plantPercentage} droop={plantDroop} role={currentUser.role} />
        </div>

        {/* User info */}
        <div className="flex items-center gap-2 px-2 py-2 rounded-xl" style={{ border: '1px solid rgba(107,143,107,0.2)', background: 'rgba(255,255,255,0.5)' }}>
          <div
            className="flex items-center justify-center rounded-full shrink-0"
            style={{
              width: '32px', height: '32px',
              background: currentUser.role === 'admin' ? '#FDF0DC' : (currentUser.isMember ? 'linear-gradient(135deg, #F9E4A0, #E8C84A)' : '#D4EDD8'),
              color: userColor, fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.85rem',
            }}
          >
            {currentUser.name.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="flex items-center gap-1">
              <p style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.78rem', color: '#2D5016', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                {currentUser.name}
              </p>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <p style={{ fontSize: '0.65rem', color: userColor, fontWeight: 600, margin: 0 }}>{userLabel}</p>
              {currentUser.isMember && <GoldenLeafBadge />}
            </div>
          </div>
          <button onClick={onLogout} title="Logout" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8FAF8F', padding: '2px' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2H2C1.4 2 1 2.4 1 3V11C1 11.6 1.4 12 2 12H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M9 4L13 7L9 10M13 7H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="relative flex items-center px-8 py-5 shrink-0 overflow-hidden" style={{ borderBottom: '1px solid rgba(107,143,107,0.15)', background: '#F7F4EE' }}>
          <svg className="absolute right-0 top-0 h-full opacity-10 pointer-events-none" viewBox="0 0 300 80" style={{ width: '300px' }}>
            <path d="M200,0 Q280,-10 300,40 Q320,90 240,80 Q160,70 180,20 Q190,0 200,0 Z" fill="#6B8F6B" />
          </svg>
          <div>
            <h2 style={{ margin: 0, fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '1.3rem', color: '#2D5016' }}>
              {pageTitle[activePage]}
            </h2>
            {selectedCourseTitle && activePage !== 'profile' && (
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B8F6B', fontWeight: 500 }}>{selectedCourseTitle}</p>
            )}
          </div>
        </header>

        <motion.div
          key={activePage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 overflow-y-auto"
          style={{ padding: '28px 32px' }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

export { GoldenLeafBadge };
