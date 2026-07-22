import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'motion/react';
import type { Assignment, Submission, Course, AppUser } from '../App';

interface AssignmentsPageProps {
  assignments: Assignment[];
  submissions: Submission[];
  courses: Course[];
  currentUser: AppUser;
  selectedCourseId: string | null;
  isMember: boolean;
  resubmissionCounts: Record<string, number>;
  maxResubmissions: number;
  onCreateAssignment: (a: Omit<Assignment, 'id'>) => void;
  onUpdateAssignment: (id: string, updates: Partial<Assignment>) => void;
  onDeleteAssignment: (id: string) => void;
  onSubmit: (assignmentId: string, content: string) => void;
  onResubmit: (assignmentId: string, content: string) => void;
  onSelectCourse: (id: string) => void;
  onGoToProfile: () => void;
}

function AssignmentFormDialog({ open, onClose, onSave, initial, courses, selectedCourseId }: {
  open: boolean; onClose: () => void;
  onSave: (d: any) => void;
  initial?: Partial<Assignment>;
  courses: Course[];
  selectedCourseId: string | null;
}) {
  const defaultDue = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
  const [form, setForm] = useState({
    courseId: initial?.courseId ?? selectedCourseId ?? courses[0]?.id ?? '',
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    dueDate: initial?.dueDate ? new Date(initial.dueDate).toISOString().slice(0, 10) : defaultDue,
    maxScore: String(initial?.maxScore ?? 100),
  });
  const h = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));
  const inp: React.CSSProperties = { width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid rgba(107,143,107,0.3)', background: '#EFF7F0', color: '#2D5016', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' };

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40" style={{ background: 'rgba(45,80,22,0.2)', backdropFilter: 'blur(3px)' }} />
        <Dialog.Content className="fixed z-50" style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)', background: '#F7F4EE', borderRadius: '20px', padding: '28px', width: '440px', maxWidth: '95vw', boxShadow: '0 20px 60px rgba(45,80,22,0.18)', border: '1px solid rgba(107,143,107,0.2)' }}>
          <Dialog.Title style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#2D5016', marginBottom: '20px' }}>
            {initial ? 'Edit Assignment' : 'Create Assignment'}
          </Dialog.Title>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#4A6741', marginBottom: '5px' }}>Course</label>
              <select style={inp} value={form.courseId} onChange={h('courseId')}>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#4A6741', marginBottom: '5px' }}>Title</label>
              <input style={inp} value={form.title} onChange={h('title')} placeholder="e.g. Field Observation Journal" />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#4A6741', marginBottom: '5px' }}>Instructions</label>
              <textarea style={{ ...inp, minHeight: '70px', resize: 'vertical' } as any} value={form.description} onChange={h('description')} placeholder="Describe what students should submit…" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#4A6741', marginBottom: '5px' }}>Due Date</label>
                <input type="date" style={inp} value={form.dueDate} onChange={h('dueDate')} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#4A6741', marginBottom: '5px' }}>Max Score</label>
                <input type="number" style={inp} value={form.maxScore} onChange={h('maxScore')} />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6 justify-end">
            <button onClick={onClose} style={{ padding: '9px 22px', borderRadius: '9999px', border: '1.5px solid rgba(107,143,107,0.4)', background: 'transparent', cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, color: '#6B8F6B', fontSize: '0.875rem' }}>Cancel</button>
            <button
              onClick={() => { onSave({ ...form, maxScore: Number(form.maxScore), dueDate: new Date(form.dueDate).toISOString() }); onClose(); }}
              style={{ padding: '9px 22px', borderRadius: '9999px', border: 'none', background: '#2D5016', color: '#F7F4EE', cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.875rem' }}
            >
              {initial ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SubmitDialog({ open, onClose, onSave, assignment, isResubmit }: {
  open: boolean; onClose: () => void; onSave: (content: string) => void;
  assignment: Assignment | null; isResubmit: boolean;
}) {
  const [text, setText] = useState('');
  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40" style={{ background: 'rgba(45,80,22,0.2)', backdropFilter: 'blur(3px)' }} />
        <Dialog.Content className="fixed z-50" style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)', background: '#F7F4EE', borderRadius: '20px', padding: '28px', width: '480px', maxWidth: '95vw', boxShadow: '0 20px 60px rgba(45,80,22,0.18)', border: '1px solid rgba(107,143,107,0.2)' }}>
          <Dialog.Title style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#2D5016', marginBottom: '6px' }}>
            {isResubmit ? 'Resubmit Assignment' : 'Submit Assignment'}
          </Dialog.Title>
          <p style={{ fontSize: '0.82rem', color: '#6B8F6B', marginBottom: '18px' }}>{assignment?.title}</p>
          <div style={{ background: '#EAF4EF', borderRadius: '12px', padding: '14px', marginBottom: '14px', fontSize: '0.82rem', color: '#4A6741', lineHeight: 1.6 }}>
            {assignment?.description}
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Write your submission here…"
            style={{ width: '100%', minHeight: '120px', padding: '12px', borderRadius: '12px', border: '1.5px solid rgba(107,143,107,0.3)', background: '#EFF7F0', color: '#2D5016', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
          />
          <div className="flex gap-3 mt-5 justify-end">
            <button onClick={onClose} style={{ padding: '9px 22px', borderRadius: '9999px', border: '1.5px solid rgba(107,143,107,0.4)', background: 'transparent', cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, color: '#6B8F6B', fontSize: '0.875rem' }}>Cancel</button>
            <button
              onClick={() => { if (text.trim()) { onSave(text); onClose(); setText(''); } }}
              style={{ padding: '9px 22px', borderRadius: '9999px', border: 'none', background: isResubmit ? '#C8714A' : '#2D5016', color: '#F7F4EE', cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.875rem' }}
            >
              {isResubmit ? 'Resubmit' : 'Submit'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function AssignmentsPage({
  assignments, submissions, courses, currentUser, selectedCourseId,
  isMember, resubmissionCounts, maxResubmissions,
  onCreateAssignment, onUpdateAssignment, onDeleteAssignment,
  onSubmit, onResubmit, onSelectCourse, onGoToProfile,
}: AssignmentsPageProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Assignment | null>(null);
  const [submitTarget, setSubmitTarget] = useState<Assignment | null>(null);
  const [isResubmit, setIsResubmit] = useState(false);
  const [activeCourse, setActiveCourse] = useState(selectedCourseId ?? courses[0]?.id ?? '');
  const [dismissedUpgrade, setDismissedUpgrade] = useState<Set<string>>(new Set());

  const courseAssignments = assignments.filter(a => a.courseId === activeCourse);

  const getUserSubmission = (assignmentId: string) =>
    submissions.find(s => s.assignmentId === assignmentId && s.userId === currentUser.id);

  const isLate = (dueDate: string) => new Date(dueDate) < new Date();

  const getStatus = (assignment: Assignment) => {
    const sub = getUserSubmission(assignment.id);
    if (!sub) {
      if (isLate(assignment.dueDate)) return 'overdue';
      return 'pending';
    }
    if (sub.needsResubmission) return 'resubmit';
    if (sub.isLate) return 'late';
    return 'ontime';
  };

  const statusConfig = {
    pending: { label: 'Not Submitted', bg: 'rgba(234,244,239,0.8)', border: 'rgba(107,143,107,0.2)', badge: null },
    overdue: { label: 'Overdue', bg: '#FDF5E8', border: 'rgba(212,168,83,0.3)', badge: { text: 'OVERDUE', bg: '#FDF5E8', color: '#D4A853' } },
    ontime: { label: 'Submitted on time', bg: '#EDF7ED', border: 'rgba(107,143,107,0.4)', badge: { text: 'ON TIME ✓', bg: 'rgba(107,143,107,0.15)', color: '#2D5016' } },
    late: { label: 'Submitted late', bg: '#FDF5E8', border: 'rgba(212,168,83,0.35)', badge: { text: 'LATE', bg: 'rgba(212,168,83,0.2)', color: '#C8714A' } },
    resubmit: { label: 'Resubmission needed', bg: '#FDF0DC', border: 'rgba(200,113,74,0.35)', badge: { text: 'REVISE ↩', bg: 'rgba(200,113,74,0.15)', color: '#C8714A' } },
  };

  const formatDue = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / 86400000);
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

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
          {courseAssignments.length} assignment{courseAssignments.length !== 1 ? 's' : ''}
        </p>
        {currentUser.role === 'admin' && (
          <button
            onClick={() => setCreateOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 18px', borderRadius: '9999px', border: 'none', background: '#C8714A', color: '#fff', cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.8rem' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            New Assignment
          </button>
        )}
      </div>

      {courseAssignments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <svg width="56" height="64" viewBox="0 0 56 64" fill="none" opacity="0.3">
            <rect x="6" y="4" width="44" height="56" rx="6" stroke="#6B8F6B" strokeWidth="1.5" />
            <path d="M16 22H40M16 32H32M16 42H24" stroke="#6B8F6B" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M33 42L37 46L44 38" stroke="#6B8F6B" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p style={{ color: '#8FAF8F', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.9rem' }}>
            {currentUser.role === 'admin' ? 'No assignments yet — create one' : 'No assignments here yet'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <AnimatePresence>
            {courseAssignments.map((assignment, i) => {
              const status = currentUser.role === 'user' ? getStatus(assignment) : 'pending';
              const config = statusConfig[status as keyof typeof statusConfig];
              const sub = getUserSubmission(assignment.id);
              const late = isLate(assignment.dueDate);

              return (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.06 }}
                  style={{
                    padding: '18px 20px', borderRadius: '16px',
                    background: currentUser.role === 'user' ? config.bg : '#EAF4EF',
                    border: `1.5px solid ${currentUser.role === 'user' ? config.border : 'rgba(107,143,107,0.2)'}`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Left */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 style={{ margin: 0, fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#2D5016' }}>
                          {assignment.title}
                        </h4>
                        {currentUser.role === 'user' && config.badge && (
                          <span style={{ padding: '2px 9px', borderRadius: '9999px', background: config.badge.bg, color: config.badge.color, fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                            {config.badge.text}
                          </span>
                        )}
                      </div>
                      <p style={{ margin: '0 0 8px', fontSize: '0.8rem', color: '#6B8F6B', lineHeight: 1.5 }}>
                        {assignment.description}
                      </p>
                      <div className="flex items-center gap-3" style={{ fontSize: '0.75rem', color: late && !sub ? '#C8714A' : '#8FAF8F' }}>
                        <span>📅 {formatDue(assignment.dueDate)}</span>
                        <span>·</span>
                        <span>🏆 {assignment.maxScore} pts</span>
                        {currentUser.role === 'admin' && (
                          <>
                            <span>·</span>
                            <span>{submissions.filter(s => s.assignmentId === assignment.id).length} submissions</span>
                          </>
                        )}
                      </div>
                      {sub && currentUser.role === 'user' && (
                        <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#6B8F6B' }}>
                          Submitted: {new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          {sub.score !== undefined && <span style={{ marginLeft: '8px', fontWeight: 600, color: '#2D5016' }}>· Score: {sub.score}/{assignment.maxScore}</span>}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 items-end shrink-0">
                      {currentUser.role === 'user' ? (() => {
                        const usedCount = resubmissionCounts[assignment.id] ?? 0;
                        const atLimit = !isMember && usedCount >= maxResubmissions;
                        const showUpgrade = atLimit && status === 'resubmit' && !dismissedUpgrade.has(assignment.id);
                        return (
                          <>
                            {(status === 'pending' || status === 'overdue') && (
                              <button
                                onClick={() => { setSubmitTarget(assignment); setIsResubmit(false); }}
                                style={{ padding: '7px 16px', borderRadius: '9999px', border: 'none', background: late ? '#D4A853' : '#2D5016', color: '#fff', cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                              >
                                {late ? 'Submit Late' : 'Submit'}
                              </button>
                            )}
                            {status === 'resubmit' && !atLimit && (
                              <button
                                onClick={() => { setSubmitTarget(assignment); setIsResubmit(true); }}
                                style={{ padding: '7px 16px', borderRadius: '9999px', border: 'none', background: '#C8714A', color: '#fff', cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                              >
                                Resubmit
                              </button>
                            )}
                            {/* Resubmission counter for non-members */}
                            {!isMember && (status === 'resubmit' || usedCount > 0) && (
                              <span style={{ fontSize: '0.7rem', color: usedCount >= maxResubmissions ? '#C8714A' : '#8FAF8F', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                {usedCount}/{maxResubmissions} resubmits used
                              </span>
                            )}
                            {(status === 'ontime' || status === 'late') && (
                              <span style={{ padding: '6px 12px', borderRadius: '9999px', background: 'rgba(107,143,107,0.1)', fontSize: '0.75rem', color: '#4A6741', fontWeight: 600 }}>
                                Submitted ✓
                              </span>
                            )}
                          </>
                        );
                      })() : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditTarget(assignment)}
                            style={{ background: 'none', border: '1.5px solid rgba(107,143,107,0.3)', borderRadius: '9999px', cursor: 'pointer', color: '#4A6741', padding: '6px 12px', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.78rem' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteAssignment(assignment.id)}
                            style={{ background: 'none', border: '1.5px solid rgba(200,113,74,0.3)', borderRadius: '9999px', cursor: 'pointer', color: '#C8714A', padding: '6px 12px', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.78rem' }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gentle upgrade prompt — shown inline, never a hard block */}
                  {currentUser.role === 'user' && !isMember && status === 'resubmit' &&
                    (resubmissionCounts[assignment.id] ?? 0) >= maxResubmissions &&
                    !dismissedUpgrade.has(assignment.id) && (
                    <div style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.35)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                        <path d="M10 18 C10 18 3 13.5 3 8 C3 4 10 2 10 2 C10 2 17 4 17 8 C17 13.5 10 18 10 18 Z" fill="rgba(212,168,83,0.3)" stroke="#D4A853" strokeWidth="1.3" />
                        <line x1="10" y1="18" x2="10" y2="2" stroke="#E8C84A" strokeWidth="0.8" strokeDasharray="2 1.8" />
                      </svg>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: '0 0 2px', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.8rem', color: '#7A5C00' }}>
                          You've used all {maxResubmissions} resubmissions for this assignment
                        </p>
                        <p style={{ margin: 0, fontSize: '0.74rem', color: '#8B7030', lineHeight: 1.5 }}>
                          Grove Members get unlimited resubmissions before the deadline, plus priority material access and a plant that never droops.
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => onGoToProfile()}
                          style={{ padding: '6px 14px', borderRadius: '9999px', border: 'none', background: 'linear-gradient(135deg, #E8C84A, #D4A853)', color: '#5A3E00', cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                        >
                          ✦ Learn more
                        </button>
                        <button
                          onClick={() => setDismissedUpgrade(s => new Set([...s, assignment.id]))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B8CEB8', padding: '4px' }}
                          title="Dismiss"
                        >
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 2L11 11M11 2L2 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <AssignmentFormDialog open={createOpen} onClose={() => setCreateOpen(false)} onSave={d => onCreateAssignment(d)} courses={courses} selectedCourseId={activeCourse} />
      {editTarget && (
        <AssignmentFormDialog open={true} onClose={() => setEditTarget(null)} onSave={d => onUpdateAssignment(editTarget.id, d)} initial={editTarget} courses={courses} selectedCourseId={activeCourse} />
      )}
      <SubmitDialog
        open={!!submitTarget}
        onClose={() => setSubmitTarget(null)}
        onSave={content => {
          if (submitTarget) {
            isResubmit ? onResubmit(submitTarget.id, content) : onSubmit(submitTarget.id, content);
          }
        }}
        assignment={submitTarget}
        isResubmit={isResubmit}
      />
    </div>
  );
}
