import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'motion/react';
import type { Course, Enrollment, AppUser } from '../App';

interface CoursesPageProps {
  courses: Course[];
  enrollments: Enrollment[];
  currentUser: AppUser;
  onEnroll: (courseId: string) => void;
  onWithdraw: (courseId: string) => void;
  onCreateCourse: (course: Omit<Course, 'id'>) => void;
  onUpdateCourse: (id: string, updates: Partial<Course>) => void;
  onSelectCourse: (courseId: string) => void;
  setActivePage: (p: any) => void;
}

const categoryColors: Record<string, string> = {
  Algorithms: '#6B8F6B',
  'Web Dev': '#D4A853',
  'AI / ML': '#C8714A',
  Systems: '#4A6741',
  Security: '#8FAF8F',
  Databases: '#4A6741',
};

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" opacity="0.35">
        <path d="M40 72 C40 72 10 54 10 30 C10 12 40 6 40 6 C40 6 70 12 70 30 C70 54 40 72 40 72 Z"
          stroke="#6B8F6B" strokeWidth="1.5" fill="rgba(107,143,107,0.1)" />
        <line x1="40" y1="72" x2="40" y2="6" stroke="#6B8F6B" strokeWidth="1" strokeDasharray="4 3" />
        <path d="M40 42 C28 38 18 30 16 22" stroke="#6B8F6B" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M40 56 C52 52 62 44 64 36" stroke="#6B8F6B" strokeWidth="1" strokeDasharray="3 3" />
      </svg>
      <p style={{ color: '#8FAF8F', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.95rem' }}>
        No courses yet — the grove awaits
      </p>
    </div>
  );
}

function CourseFormDialog({
  open, onClose, onSave, initial,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initial?: Partial<Course>;
}) {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    instructor: initial?.instructor ?? '',
    category: initial?.category ?? 'Ecology',
    duration: initial?.duration ?? '8 weeks',
  });

  const handle = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: '10px',
    border: '1.5px solid rgba(107,143,107,0.3)', background: '#EFF7F0',
    color: '#2D5016', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40" style={{ background: 'rgba(45,80,22,0.2)', backdropFilter: 'blur(3px)' }} />
        <Dialog.Content
          className="fixed z-50"
          style={{
            left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
            background: '#F7F4EE', borderRadius: '20px', padding: '28px',
            width: '440px', maxWidth: '95vw', boxShadow: '0 20px 60px rgba(45,80,22,0.18)',
            border: '1px solid rgba(107,143,107,0.2)',
          }}
        >
          <Dialog.Title style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '1.15rem', color: '#2D5016', marginBottom: '20px' }}>
            {initial ? 'Edit Course' : 'Create New Course'}
          </Dialog.Title>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#4A6741', marginBottom: '5px' }}>Course Title</label>
              <input style={inputStyle} value={form.title} onChange={handle('title')} placeholder="e.g. Introduction to Forest Ecology" />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#4A6741', marginBottom: '5px' }}>Description</label>
              <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' } as any} value={form.description} onChange={handle('description')} placeholder="What will students learn?" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#4A6741', marginBottom: '5px' }}>Instructor</label>
                <input style={inputStyle} value={form.instructor} onChange={handle('instructor')} placeholder="Dr. Reed" />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#4A6741', marginBottom: '5px' }}>Duration</label>
                <input style={inputStyle} value={form.duration} onChange={handle('duration')} placeholder="8 weeks" />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#4A6741', marginBottom: '5px' }}>Category</label>
              <select style={inputStyle} value={form.category} onChange={handle('category')}>
                {['Algorithms', 'Web Dev', 'AI / ML', 'Systems', 'Security', 'Databases'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-6 justify-end">
            <button onClick={onClose} style={{ padding: '9px 22px', borderRadius: '9999px', border: '1.5px solid rgba(107,143,107,0.4)', background: 'transparent', cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, color: '#6B8F6B', fontSize: '0.875rem' }}>
              Cancel
            </button>
            <button
              onClick={() => { onSave(form); onClose(); }}
              style={{ padding: '9px 22px', borderRadius: '9999px', border: 'none', background: '#2D5016', color: '#F7F4EE', cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.875rem' }}
            >
              {initial ? 'Save Changes' : 'Create Course'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function CoursesPage({
  courses, enrollments, currentUser, onEnroll, onWithdraw,
  onCreateCourse, onUpdateCourse, onSelectCourse, setActivePage,
}: CoursesPageProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Course | null>(null);

  const isEnrolled = (courseId: string) =>
    enrollments.some(e => e.userId === currentUser.id && e.courseId === courseId);

  const displayCourses = currentUser.role === 'user'
    ? courses
    : courses;

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p style={{ color: '#6B8F6B', fontSize: '0.875rem' }}>
            {currentUser.role === 'user'
              ? `${enrollments.filter(e => e.userId === currentUser.id).length} enrolled · ${courses.length} available`
              : `${courses.length} courses · ${enrollments.length} total enrollments`}
          </p>
        </div>
        {currentUser.role === 'admin' && (
          <button
            onClick={() => setCreateOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '9px 20px', borderRadius: '9999px', border: 'none',
              background: '#C8714A', color: '#fff', cursor: 'pointer',
              fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.875rem',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#B05E39'}
            onMouseLeave={e => e.currentTarget.style.background = '#C8714A'}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1V14M1 7.5H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            New Course
          </button>
        )}
      </div>

      {displayCourses.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
          <AnimatePresence>
            {displayCourses.map((course, i) => {
              const enrolled = isEnrolled(course.id);
              const accentColor = categoryColors[course.category] ?? '#6B8F6B';
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{
                    background: '#EAF4EF', borderRadius: '18px',
                    border: `1.5px solid ${enrolled ? 'rgba(107,143,107,0.4)' : 'rgba(107,143,107,0.15)'}`,
                    overflow: 'hidden', display: 'flex', flexDirection: 'column',
                  }}
                >
                  {/* Course color bar */}
                  <div style={{ height: '6px', background: accentColor, opacity: 0.7 }} />
                  <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Category badge */}
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: '9999px',
                      background: `${accentColor}22`, color: accentColor,
                      fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.68rem',
                      letterSpacing: '0.04em', textTransform: 'uppercase', alignSelf: 'flex-start',
                    }}>
                      {course.category}
                    </span>
                    <h3 style={{ margin: 0, fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#2D5016', lineHeight: 1.35 }}>
                      {course.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B8F6B', lineHeight: 1.5, flex: 1 }}>
                      {course.description}
                    </p>
                    <div className="flex items-center gap-3" style={{ fontSize: '0.75rem', color: '#8FAF8F' }}>
                      <span>👤 {course.instructor}</span>
                      <span>·</span>
                      <span>⏱ {course.duration}</span>
                    </div>
                    {enrolled && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ flex: 1, height: '4px', borderRadius: '9999px', background: 'rgba(107,143,107,0.2)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${enrollments.find(e => e.userId === currentUser.id && e.courseId === course.id)?.progress ?? 0}%`, background: '#6B8F6B', borderRadius: '9999px' }} />
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#6B8F6B', fontWeight: 600 }}>
                          {enrollments.find(e => e.userId === currentUser.id && e.courseId === course.id)?.progress ?? 0}%
                        </span>
                      </div>
                    )}
                    {/* Actions */}
                    <div className="flex gap-2 mt-1">
                      {currentUser.role === 'user' ? (
                        enrolled ? (
                          <>
                            <button
                              onClick={() => { onSelectCourse(course.id); setActivePage('materials'); }}
                              style={{
                                flex: 1, padding: '8px', borderRadius: '9999px', border: 'none',
                                background: '#2D5016', color: '#F7F4EE', cursor: 'pointer',
                                fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.8rem',
                              }}
                            >
                              Continue Learning
                            </button>
                            <button
                              onClick={() => onWithdraw(course.id)}
                              style={{
                                padding: '8px 14px', borderRadius: '9999px', cursor: 'pointer',
                                border: '1.5px solid rgba(200,113,74,0.4)', background: 'transparent',
                                fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#C8714A',
                              }}
                            >
                              Withdraw
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => onEnroll(course.id)}
                            style={{
                              flex: 1, padding: '8px', borderRadius: '9999px', border: 'none',
                              background: '#C8714A', color: '#fff', cursor: 'pointer',
                              fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.8rem',
                            }}
                          >
                            Enroll Now
                          </button>
                        )
                      ) : (
                        <>
                          <button
                            onClick={() => { onSelectCourse(course.id); setActivePage('materials'); }}
                            style={{
                              flex: 1, padding: '8px', borderRadius: '9999px', border: 'none',
                              background: '#2D5016', color: '#F7F4EE', cursor: 'pointer',
                              fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.8rem',
                            }}
                          >
                            Manage
                          </button>
                          <button
                            onClick={() => setEditTarget(course)}
                            style={{
                              padding: '8px 14px', borderRadius: '9999px', cursor: 'pointer',
                              border: '1.5px solid rgba(107,143,107,0.4)', background: 'transparent',
                              fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#4A6741',
                            }}
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <CourseFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={data => onCreateCourse(data)}
      />
      {editTarget && (
        <CourseFormDialog
          open={true}
          onClose={() => setEditTarget(null)}
          onSave={data => onUpdateCourse(editTarget.id, data)}
          initial={editTarget}
        />
      )}
    </div>
  );
}
