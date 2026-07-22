import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'motion/react';
import type { Announcement, Course, AppUser } from '../App';

interface AnnouncementsPageProps {
  announcements: Announcement[];
  courses: Course[];
  currentUser: AppUser;
  selectedCourseId: string | null;
  onCreate: (a: Omit<Announcement, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Announcement>) => void;
  onDelete: (id: string) => void;
  onSelectCourse: (id: string) => void;
}

function ComposeDialog({ open, onClose, onSave, initial, courses, selectedCourseId }: {
  open: boolean; onClose: () => void; onSave: (d: any) => void;
  initial?: Partial<Announcement>; courses: Course[]; selectedCourseId: string | null;
}) {
  const [form, setForm] = useState({
    courseId: initial?.courseId ?? selectedCourseId ?? courses[0]?.id ?? '',
    title: initial?.title ?? '',
    content: initial?.content ?? '',
    pinned: initial?.pinned ?? false,
  });
  const h = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));
  const inp: React.CSSProperties = { width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid rgba(107,143,107,0.3)', background: '#EFF7F0', color: '#2D5016', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' };

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40" style={{ background: 'rgba(45,80,22,0.2)', backdropFilter: 'blur(3px)' }} />
        <Dialog.Content className="fixed z-50" style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)', background: '#F7F4EE', borderRadius: '20px', padding: '28px', width: '480px', maxWidth: '95vw', boxShadow: '0 20px 60px rgba(45,80,22,0.18)', border: '1px solid rgba(107,143,107,0.2)' }}>
          <Dialog.Title style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#2D5016', marginBottom: '20px' }}>
            {initial ? 'Edit Announcement' : 'Compose Announcement'}
          </Dialog.Title>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#4A6741', marginBottom: '5px' }}>Course</label>
              <select style={inp} value={form.courseId} onChange={h('courseId')}>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#4A6741', marginBottom: '5px' }}>Subject</label>
              <input style={inp} value={form.title} onChange={h('title')} placeholder="e.g. Important: Field Trip Rescheduled" />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#4A6741', marginBottom: '5px' }}>Message</label>
              <textarea style={{ ...inp, minHeight: '110px', resize: 'vertical' } as any} value={form.content} onChange={h('content')} placeholder="Write your announcement here…" />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.pinned}
                onChange={e => setForm(f => ({ ...f, pinned: e.target.checked }))}
                style={{ accentColor: '#2D5016', width: '16px', height: '16px' }}
              />
              <span style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#4A6741' }}>Pin to top</span>
            </label>
          </div>
          <div className="flex gap-3 mt-6 justify-end">
            <button onClick={onClose} style={{ padding: '9px 22px', borderRadius: '9999px', border: '1.5px solid rgba(107,143,107,0.4)', background: 'transparent', cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, color: '#6B8F6B', fontSize: '0.875rem' }}>Cancel</button>
            <button
              onClick={() => { onSave({ ...form, publishedAt: initial?.publishedAt ?? new Date().toISOString(), author: 'Dr. Nguyen' }); onClose(); }}
              style={{ padding: '9px 22px', borderRadius: '9999px', border: 'none', background: '#2D5016', color: '#F7F4EE', cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.875rem' }}
            >
              {initial ? 'Save Changes' : 'Publish'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function AnnouncementsPage({
  announcements, courses, currentUser, selectedCourseId,
  onCreate, onUpdate, onDelete, onSelectCourse,
}: AnnouncementsPageProps) {
  const [composeOpen, setComposeOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Announcement | null>(null);
  const [activeCourse, setActiveCourse] = useState(selectedCourseId ?? courses[0]?.id ?? '');

  const courseAnnouncements = announcements
    .filter(a => a.courseId === activeCourse)
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

  return (
    <div>
      {/* Course selector */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {courses.map(c => (
          <button key={c.id} onClick={() => { setActiveCourse(c.id); onSelectCourse(c.id); }}
            style={{ padding: '6px 16px', borderRadius: '9999px', cursor: 'pointer', border: `1.5px solid ${activeCourse === c.id ? '#2D5016' : 'rgba(107,143,107,0.3)'}`, background: activeCourse === c.id ? '#2D5016' : 'transparent', color: activeCourse === c.id ? '#F7F4EE' : '#4A6741', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', transition: 'all 0.15s' }}>
            {c.title.length > 28 ? c.title.slice(0, 28) + '…' : c.title}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-5">
        <p style={{ color: '#6B8F6B', fontSize: '0.875rem' }}>
          {courseAnnouncements.length} announcement{courseAnnouncements.length !== 1 ? 's' : ''}
        </p>
        {currentUser.role === 'admin' && (
          <button
            onClick={() => setComposeOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 18px', borderRadius: '9999px', border: 'none', background: '#C8714A', color: '#fff', cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.8rem' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 9V12H4L11 5L8 2L1 9Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M9 3L11 5" stroke="currentColor" strokeWidth="1.3" /></svg>
            Compose
          </button>
        )}
      </div>

      {courseAnnouncements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none" opacity="0.3">
            <path d="M8 22H14V42H8V22Z" stroke="#6B8F6B" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M14 22L44 12V52L14 42" stroke="#6B8F6B" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M44 18C47 18 50 20 50 23C50 26 47 28 44 28" stroke="#6B8F6B" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <p style={{ color: '#8FAF8F', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.9rem' }}>
            {currentUser.role === 'admin' ? 'Nothing posted yet — compose your first announcement' : 'No announcements yet — check back soon'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <AnimatePresence>
            {courseAnnouncements.map((ann, i) => (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  padding: '18px 20px', borderRadius: '16px',
                  background: ann.pinned ? 'rgba(212,168,83,0.08)' : '#EAF4EF',
                  border: ann.pinned ? '1.5px solid rgba(212,168,83,0.4)' : '1.5px solid rgba(107,143,107,0.2)',
                  position: 'relative',
                }}
              >
                {ann.pinned && (
                  <div style={{ position: 'absolute', top: '12px', right: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7 1L11 5L8 8L6.5 6.5L4 9L3 8L5.5 5.5L4 4L7 1Z" fill="#D4A853" /><path d="M1 11L3.5 8.5" stroke="#D4A853" strokeWidth="1.2" strokeLinecap="round" /></svg>
                    <span style={{ fontSize: '0.65rem', color: '#D4A853', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, letterSpacing: '0.05em' }}>PINNED</span>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '9999px', flexShrink: 0,
                    background: '#D4EDD8', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#2D5016',
                  }}>
                    {ann.author.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <p style={{ margin: 0, fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#2D5016' }}>
                        {ann.title}
                      </p>
                    </div>
                    <p style={{ margin: '0 0 10px', fontSize: '0.78rem', color: '#6B8F6B', fontWeight: 500 }}>
                      {ann.author} · <span style={{ color: '#8FAF8F' }}>{timeAgo(ann.publishedAt)}</span>
                    </p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#3D6132', lineHeight: 1.65 }}>
                      {ann.content}
                    </p>
                  </div>
                  {currentUser.role === 'admin' && (
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => setEditTarget(ann)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8FAF8F', padding: '4px' }}
                        title="Edit"
                      >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M10 2L13 5L5 13H2V10L10 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
                      </button>
                      <button
                        onClick={() => onDelete(ann.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C8714A', padding: '4px' }}
                        title="Delete"
                      >
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 4H12M5 4V3H10V4M6 7V11M9 7V11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><path d="M4 4L4.5 12H10.5L11 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ComposeDialog open={composeOpen} onClose={() => setComposeOpen(false)} onSave={onCreate} courses={courses} selectedCourseId={activeCourse} />
      {editTarget && (
        <ComposeDialog open={true} onClose={() => setEditTarget(null)} onSave={d => onUpdate(editTarget.id, d)} initial={editTarget} courses={courses} selectedCourseId={activeCourse} />
      )}
    </div>
  );
}
