import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'motion/react';
import type { CourseMaterial, Course, AppUser } from '../App';

interface MaterialsPageProps {
  materials: CourseMaterial[];
  courses: Course[];
  currentUser: AppUser;
  selectedCourseId: string | null;
  viewedMaterials: Set<string>;
  isMember: boolean;
  onUpload: (m: Omit<CourseMaterial, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<CourseMaterial>) => void;
  onDelete: (id: string) => void;
  onMarkViewed: (id: string) => void;
  onSelectCourse: (id: string) => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  slides: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="3" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 8L11 10L8 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 17H15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  reading: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 3H10L10 15H4C3.4 15 3 14.6 3 14V4C3 3.4 3.4 3 4 3Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 3H16C16.6 3 17 3.4 17 4V14C17 14.6 16.6 15 16 15H10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 3V15" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6 7H8M6 9.5H8M13 7H15M13 9.5H15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  recording: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7.5L13.5 10L8 12.5V7.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),
};

const typeColors: Record<string, string> = {
  slides: '#6B8F6B',
  reading: '#D4A853',
  recording: '#C8714A',
};

const typeLabels: Record<string, string> = {
  slides: 'Slides',
  reading: 'Reading',
  recording: 'Recording',
};

function MaterialFormDialog({ open, onClose, onSave, initial, courses, selectedCourseId }: {
  open: boolean; onClose: () => void;
  onSave: (d: any) => void;
  initial?: Partial<CourseMaterial>;
  courses: Course[];
  selectedCourseId: string | null;
}) {
  const [form, setForm] = useState({
    courseId: initial?.courseId ?? selectedCourseId ?? courses[0]?.id ?? '',
    title: initial?.title ?? '',
    type: initial?.type ?? 'slides',
    fileSize: initial?.fileSize ?? '2.4 MB',
    uploadedAt: initial?.uploadedAt ?? new Date().toISOString(),
  });
  const h = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: '10px',
    border: '1.5px solid rgba(107,143,107,0.3)', background: '#EFF7F0',
    color: '#2D5016', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40" style={{ background: 'rgba(45,80,22,0.2)', backdropFilter: 'blur(3px)' }} />
        <Dialog.Content className="fixed z-50" style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)', background: '#F7F4EE', borderRadius: '20px', padding: '28px', width: '400px', maxWidth: '95vw', boxShadow: '0 20px 60px rgba(45,80,22,0.18)', border: '1px solid rgba(107,143,107,0.2)' }}>
          <Dialog.Title style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#2D5016', marginBottom: '20px' }}>
            {initial ? 'Edit Material' : 'Upload Material'}
          </Dialog.Title>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#4A6741', marginBottom: '5px' }}>Course</label>
              <select style={inputStyle} value={form.courseId} onChange={h('courseId')}>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#4A6741', marginBottom: '5px' }}>Title</label>
              <input style={inputStyle} value={form.title} onChange={h('title')} placeholder="e.g. Week 2 Lecture Slides" />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#4A6741', marginBottom: '5px' }}>Type</label>
              <select style={inputStyle} value={form.type} onChange={h('type')}>
                <option value="slides">Lecture Slides</option>
                <option value="reading">Reading</option>
                <option value="recording">Recording</option>
              </select>
            </div>
            <div
              style={{
                border: '2px dashed rgba(107,143,107,0.3)', borderRadius: '12px', padding: '20px',
                textAlign: 'center', background: 'rgba(234,244,239,0.5)',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ margin: '0 auto 8px', display: 'block' }}>
                <path d="M14 20V10M10 14L14 10L18 14" stroke="#6B8F6B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 22H22" stroke="#6B8F6B" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p style={{ fontSize: '0.8rem', color: '#8FAF8F', margin: 0, fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}>
                Drop file here or click to browse
              </p>
              <p style={{ fontSize: '0.7rem', color: '#B8CEB8', margin: '4px 0 0', fontFamily: 'Inter, sans-serif' }}>
                PDF, PPTX, MP4 · max 500 MB
              </p>
            </div>
          </div>
          <div className="flex gap-3 mt-6 justify-end">
            <button onClick={onClose} style={{ padding: '9px 22px', borderRadius: '9999px', border: '1.5px solid rgba(107,143,107,0.4)', background: 'transparent', cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, color: '#6B8F6B', fontSize: '0.875rem' }}>Cancel</button>
            <button onClick={() => { onSave(form); onClose(); }} style={{ padding: '9px 22px', borderRadius: '9999px', border: 'none', background: '#2D5016', color: '#F7F4EE', cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.875rem' }}>
              {initial ? 'Save Changes' : 'Upload'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function MaterialsPage({
  materials, courses, currentUser, selectedCourseId,
  viewedMaterials, isMember, onUpload, onUpdate, onDelete, onMarkViewed, onSelectCourse,
}: MaterialsPageProps) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CourseMaterial | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [activeCourse, setActiveCourse] = useState(selectedCourseId ?? courses[0]?.id ?? '');

  const course = courses.find(c => c.id === activeCourse);
  const courseMaterials = materials.filter(m => m.courseId === activeCourse);
  const filtered = filter === 'all' ? courseMaterials : courseMaterials.filter(m => m.type === filter);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div>
      {/* Course selector */}
      {courses.length > 0 && (
        <div className="flex gap-2 mb-5 flex-wrap">
          {courses.map(c => (
            <button
              key={c.id}
              onClick={() => { setActiveCourse(c.id); onSelectCourse(c.id); }}
              style={{
                padding: '6px 16px', borderRadius: '9999px', cursor: 'pointer',
                border: `1.5px solid ${activeCourse === c.id ? '#2D5016' : 'rgba(107,143,107,0.3)'}`,
                background: activeCourse === c.id ? '#2D5016' : 'transparent',
                color: activeCourse === c.id ? '#F7F4EE' : '#4A6741',
                fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem',
                transition: 'all 0.15s',
              }}
            >
              {c.title.length > 28 ? c.title.slice(0, 28) + '…' : c.title}
            </button>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-2">
          {['all', 'slides', 'reading', 'recording'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '5px 14px', borderRadius: '9999px', border: 'none', cursor: 'pointer',
                background: filter === f ? '#EAF4EF' : 'transparent',
                color: filter === f ? '#2D5016' : '#8FAF8F',
                fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem',
                borderWidth: filter === f ? '1.5px' : '0', borderStyle: 'solid',
                borderColor: filter === f ? 'rgba(107,143,107,0.3)' : 'transparent',
              }}
            >
              {f === 'all' ? 'All' : typeLabels[f]}
            </button>
          ))}
        </div>
        {currentUser.role === 'admin' && (
          <button
            onClick={() => setUploadOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 18px',
              borderRadius: '9999px', border: 'none', background: '#C8714A', color: '#fff',
              cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.8rem',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 10V3M4 6L7 3L10 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Upload
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <svg width="60" height="72" viewBox="0 0 60 72" fill="none" opacity="0.3">
            <path d="M10 12H36L50 26V64C50 66.2 48.2 68 46 68H10C7.8 68 6 66.2 6 64V16C6 13.8 7.8 12 10 12Z" stroke="#6B8F6B" strokeWidth="1.5" />
            <path d="M36 12V26H50" stroke="#6B8F6B" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M18 42H42M18 50H34" stroke="#6B8F6B" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <p style={{ color: '#8FAF8F', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.9rem' }}>
            {currentUser.role === 'admin' ? 'No materials yet — upload the first one' : 'No materials available yet'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <AnimatePresence>
            {filtered.map((mat, i) => {
              const viewed = viewedMaterials.has(mat.id);
              const color = typeColors[mat.type] ?? '#6B8F6B';
              return (
                <motion.div
                  key={mat.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '14px 18px', borderRadius: '14px',
                    background: '#EAF4EF',
                    border: `1.5px solid ${viewed ? 'rgba(107,143,107,0.3)' : 'rgba(107,143,107,0.12)'}`,
                    position: 'relative',
                  }}
                >
                  {/* Type icon */}
                  <div style={{ color, flexShrink: 0 }}>{typeIcons[mat.type]}</div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p style={{ margin: 0, fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#2D5016' }}>
                        {mat.title}
                      </p>
                      {viewed && (
                        <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '9999px', background: 'rgba(107,143,107,0.15)', color: '#4A6741', fontWeight: 700, letterSpacing: '0.04em' }}>
                          VIEWED
                        </span>
                      )}
                      {isMember && currentUser.role === 'user' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.62rem', padding: '2px 7px', borderRadius: '9999px', background: 'linear-gradient(135deg, rgba(249,228,160,0.4), rgba(232,200,74,0.25))', border: '1px solid rgba(212,168,83,0.4)', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, color: '#7A5C00', letterSpacing: '0.03em' }}>
                          <svg width="8" height="9" viewBox="0 0 8 9" fill="none"><path d="M4 8.5 C4 8.5 1 6.5 1 4 C1 1.5 4 0.5 4 0.5 C4 0.5 7 1.5 7 4 C7 6.5 4 8.5 4 8.5 Z" fill="#B8860B" /></svg>
                          PRIORITY
                        </span>
                      )}
                    </div>
                    <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: '#8FAF8F' }}>
                      {typeLabels[mat.type]} · {mat.fileSize} · {formatDate(mat.uploadedAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {currentUser.role === 'user' ? (
                      <>
                        {!viewed && (
                          <button
                            onClick={() => onMarkViewed(mat.id)}
                            style={{
                              padding: '6px 14px', borderRadius: '9999px', border: 'none',
                              background: '#2D5016', color: '#F7F4EE', cursor: 'pointer',
                              fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.78rem',
                            }}
                          >
                            {mat.type === 'recording' ? 'Watch' : 'View'}
                          </button>
                        )}
                        <button
                          style={{
                            padding: '6px 14px', borderRadius: '9999px',
                            border: '1.5px solid rgba(107,143,107,0.3)', background: 'transparent',
                            cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.78rem', color: '#4A6741',
                          }}
                        >
                          Download
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditTarget(mat)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8FAF8F', padding: '4px' }}
                          title="Edit"
                        >
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                            <path d="M10 2L13 5L5 13H2V10L10 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onDelete(mat.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C8714A', padding: '4px' }}
                          title="Delete"
                        >
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                            <path d="M3 4H12M5 4V3H10V4M6 7V11M9 7V11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                            <path d="M4 4L4.5 12H10.5L11 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <MaterialFormDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSave={onUpload}
        courses={courses}
        selectedCourseId={activeCourse}
      />
      {editTarget && (
        <MaterialFormDialog
          open={true}
          onClose={() => setEditTarget(null)}
          onSave={d => onUpdate(editTarget.id, d)}
          initial={editTarget}
          courses={courses}
          selectedCourseId={activeCourse}
        />
      )}
    </div>
  );
}
