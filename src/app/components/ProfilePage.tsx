import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoldenLeafBadge } from './Layout';
import type { AppUser, UserProfile, Course } from '../App';

interface ProfilePageProps {
  currentUser: AppUser;
  userProfile: UserProfile;
  allProfiles: UserProfile[];
  courses: Course[];
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onToggleMembership: () => void;
}

const MODE_OPTIONS = [
  { value: 'online', label: 'Online', icon: '💻' },
  { value: 'offline', label: 'In-person', icon: '🏫' },
  { value: 'both', label: 'Both', icon: '✨' },
] as const;

const AVAILABILITY_SLOTS = ['Mon–Fri', 'Weekends', 'Mornings', 'Afternoons', 'Evenings', 'Flexible'];

const SKILL_SUGGESTIONS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Java', 'C++', 'Go',
  'SQL', 'PostgreSQL', 'MongoDB', 'Machine Learning', 'Data Analysis', 'Docker',
  'Algorithms', 'System Design', 'UI/UX', 'Figma', 'Git', 'Testing',
];

function SkillChip({ label, onRemove, readOnly }: { label: string; onRemove?: () => void; readOnly?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        padding: '4px 10px', borderRadius: '9999px',
        background: 'rgba(107,143,107,0.14)', border: '1px solid rgba(107,143,107,0.3)',
        fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.75rem', color: '#2D5016',
      }}
    >
      {label}
      {!readOnly && onRemove && (
        <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8FAF8F', padding: '0', lineHeight: 1, display: 'flex', alignItems: 'center' }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 2L9 9M9 2L2 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
      )}
    </span>
  );
}

function CollaboratorCard({ profile, courses, isYou }: { profile: UserProfile; courses: Course[]; isYou: boolean }) {
  const sharedCourses = courses.filter(c => profile.courseIds.includes(c.id));
  const modeConfig = MODE_OPTIONS.find(m => m.value === profile.collaborationMode);
  const [connected, setConnected] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: '#EAF4EF', borderRadius: '18px', padding: '18px 20px',
        border: isYou ? '2px solid rgba(107,143,107,0.45)' : '1.5px solid rgba(107,143,107,0.2)',
        position: 'relative', display: 'flex', flexDirection: 'column', gap: '12px',
      }}
    >
      {isYou && (
        <span style={{ position: 'absolute', top: '12px', right: '14px', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '9999px', background: '#D4EDD8', color: '#2D5016', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, letterSpacing: '0.04em' }}>
          YOU
        </span>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <div style={{
          width: '44px', height: '44px', borderRadius: '9999px', flexShrink: 0,
          background: profile.isMember ? 'linear-gradient(135deg, #F9E4A0, #E8C84A)' : '#D4EDD8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#2D5016',
        }}>
          {profile.name.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p style={{ margin: 0, fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#2D5016' }}>
              {profile.name}
            </p>
            {profile.isMember && <GoldenLeafBadge />}
          </div>
          <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#8FAF8F' }}>
            {sharedCourses.length > 0 ? `${sharedCourses.length} shared course${sharedCourses.length > 1 ? 's' : ''}` : 'No shared courses'}
          </p>
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#4A6741', lineHeight: 1.55 }}>{profile.bio}</p>
      )}

      {/* Skills */}
      {profile.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {profile.skills.map(s => <SkillChip key={s} label={s} readOnly />)}
        </div>
      )}

      {/* Mode + Availability */}
      <div className="flex flex-wrap gap-2">
        {modeConfig && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '9999px', background: 'rgba(45,80,22,0.08)', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.73rem', color: '#2D5016' }}>
            {modeConfig.icon} {modeConfig.label}
          </span>
        )}
        {profile.availabilitySlots.map(slot => (
          <span key={slot} style={{ padding: '4px 10px', borderRadius: '9999px', background: 'rgba(212,168,83,0.12)', border: '1px solid rgba(212,168,83,0.3)', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.73rem', color: '#7A5C00' }}>
            {slot}
          </span>
        ))}
      </div>
      {profile.availabilityNote && (
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B8F6B', fontStyle: 'italic' }}>"{profile.availabilityNote}"</p>
      )}

      {/* Action */}
      {!isYou && (
        <button
          onClick={() => setConnected(c => !c)}
          style={{
            alignSelf: 'flex-start', padding: '7px 18px', borderRadius: '9999px', cursor: 'pointer',
            border: connected ? 'none' : '1.5px solid rgba(107,143,107,0.4)',
            background: connected ? '#2D5016' : 'transparent',
            color: connected ? '#F7F4EE' : '#4A6741',
            fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.78rem',
            transition: 'all 0.2s',
          }}
        >
          {connected ? '✓ Connected' : 'Connect'}
        </button>
      )}
    </motion.div>
  );
}

export function ProfilePage({ currentUser, userProfile, allProfiles, courses, onUpdateProfile, onToggleMembership }: ProfilePageProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<UserProfile>(userProfile);
  const [skillInput, setSkillInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<'all' | 'online' | 'offline' | 'both'>('all');

  const filteredSuggestions = SKILL_SUGGESTIONS.filter(
    s => s.toLowerCase().includes(skillInput.toLowerCase()) && !draft.skills.includes(s)
  ).slice(0, 6);

  const addSkill = (s: string) => {
    const trimmed = s.trim();
    if (trimmed && !draft.skills.includes(trimmed)) {
      setDraft(d => ({ ...d, skills: [...d.skills, trimmed] }));
    }
    setSkillInput('');
    setShowSuggestions(false);
  };

  const removeSkill = (s: string) => setDraft(d => ({ ...d, skills: d.skills.filter(x => x !== s) }));

  const toggleSlot = (slot: string) => {
    setDraft(d => ({
      ...d,
      availabilitySlots: d.availabilitySlots.includes(slot)
        ? d.availabilitySlots.filter(x => x !== slot)
        : [...d.availabilitySlots, slot],
    }));
  };

  const handleSave = () => {
    onUpdateProfile(draft);
    setEditing(false);
  };

  const handleDiscard = () => {
    setDraft(userProfile);
    setEditing(false);
  };

  const otherProfiles = allProfiles.filter(p => p.userId !== currentUser.id);
  const filteredOthers = filter === 'all' ? otherProfiles : otherProfiles.filter(p => p.collaborationMode === filter || (filter !== 'both' && p.collaborationMode === 'both'));

  const inp: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: '10px',
    border: '1.5px solid rgba(107,143,107,0.3)', background: '#EFF7F0',
    color: '#2D5016', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* ── My Profile Card ─────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ margin: 0, fontFamily: 'Quicksand, sans-serif', fontWeight: 700, color: '#2D5016' }}>My Profile</h3>
          {!editing && (
            <button onClick={() => setEditing(true)} style={{ padding: '7px 18px', borderRadius: '9999px', border: '1.5px solid rgba(107,143,107,0.4)', background: 'transparent', cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#4A6741' }}>
              Edit Profile
            </button>
          )}
        </div>

        <div style={{ background: '#EAF4EF', borderRadius: '20px', border: '1.5px solid rgba(107,143,107,0.25)', overflow: 'hidden' }}>
          {/* Card header blob */}
          <div style={{ position: 'relative', background: '#2D5016', padding: '24px 24px 36px', overflow: 'hidden' }}>
            <svg style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.15 }} width="200" height="160" viewBox="0 0 200 160">
              <path d="M140,10 Q190,-10 200,60 Q210,130 150,150 Q90,170 60,120 Q30,70 80,20 Q110,-5 140,10 Z" fill="#8FAF8F" />
            </svg>
            <div className="flex items-center gap-4 relative z-10">
              <div style={{
                width: '64px', height: '64px', borderRadius: '9999px', flexShrink: 0,
                background: userProfile.isMember ? 'linear-gradient(135deg, #F9E4A0, #E8C84A)' : 'rgba(212,237,216,0.9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#2D5016',
                border: userProfile.isMember ? '2px solid rgba(232,200,74,0.7)' : '2px solid rgba(143,175,143,0.4)',
              }}>
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h2 style={{ margin: 0, color: '#F7F4EE', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '1.2rem' }}>
                    {currentUser.name}
                  </h2>
                  {userProfile.isMember && <GoldenLeafBadge />}
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(234,244,239,0.75)' }}>{currentUser.email}</p>
              </div>
            </div>
          </div>

          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {editing ? (
              <>
                {/* Bio */}
                <div>
                  <label style={{ display: 'block', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#4A6741', marginBottom: '6px' }}>Short Bio</label>
                  <textarea
                    style={{ ...inp, minHeight: '70px', resize: 'vertical' } as any}
                    value={draft.bio}
                    onChange={e => setDraft(d => ({ ...d, bio: e.target.value }))}
                    placeholder="Tell other students about yourself…"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label style={{ display: 'block', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#4A6741', marginBottom: '6px' }}>Skills & Expertise</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {draft.skills.map(s => <SkillChip key={s} label={s} onRemove={() => removeSkill(s)} />)}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      ref={inputRef}
                      style={inp}
                      value={skillInput}
                      onChange={e => { setSkillInput(e.target.value); setShowSuggestions(true); }}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                      placeholder="Type a skill and press Enter…"
                    />
                    {showSuggestions && filteredSuggestions.length > 0 && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20, marginTop: '4px', background: '#F7F4EE', borderRadius: '12px', border: '1px solid rgba(107,143,107,0.3)', boxShadow: '0 8px 24px rgba(45,80,22,0.12)', overflow: 'hidden' }}>
                        {filteredSuggestions.map(s => (
                          <button key={s} onMouseDown={() => addSkill(s)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 14px', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: '#2D5016' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#EAF4EF'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Collaboration Mode */}
                <div>
                  <label style={{ display: 'block', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#4A6741', marginBottom: '8px' }}>Preferred Collaboration Mode</label>
                  <div className="flex gap-2">
                    {MODE_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setDraft(d => ({ ...d, collaborationMode: opt.value }))}
                        style={{
                          flex: 1, padding: '8px', borderRadius: '9999px', cursor: 'pointer',
                          border: `1.5px solid ${draft.collaborationMode === opt.value ? '#2D5016' : 'rgba(107,143,107,0.3)'}`,
                          background: draft.collaborationMode === opt.value ? '#2D5016' : 'transparent',
                          color: draft.collaborationMode === opt.value ? '#F7F4EE' : '#4A6741',
                          fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem',
                          transition: 'all 0.15s',
                        }}
                      >
                        {opt.icon} {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label style={{ display: 'block', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#4A6741', marginBottom: '8px' }}>Availability</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {AVAILABILITY_SLOTS.map(slot => (
                      <button
                        key={slot}
                        onClick={() => toggleSlot(slot)}
                        style={{
                          padding: '5px 14px', borderRadius: '9999px', cursor: 'pointer',
                          border: `1.5px solid ${draft.availabilitySlots.includes(slot) ? '#D4A853' : 'rgba(107,143,107,0.3)'}`,
                          background: draft.availabilitySlots.includes(slot) ? 'rgba(212,168,83,0.15)' : 'transparent',
                          color: draft.availabilitySlots.includes(slot) ? '#7A5C00' : '#6B8F6B',
                          fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.78rem',
                          transition: 'all 0.15s',
                        }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  <input
                    style={inp}
                    value={draft.availabilityNote}
                    onChange={e => setDraft(d => ({ ...d, availabilityNote: e.target.value }))}
                    placeholder="Any extra details (e.g. 'PST timezone, 2-hr sessions preferred')"
                  />
                </div>

                {/* Save / Cancel */}
                <div className="flex gap-3">
                  <button onClick={handleDiscard} style={{ padding: '9px 22px', borderRadius: '9999px', border: '1.5px solid rgba(107,143,107,0.4)', background: 'transparent', cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, color: '#6B8F6B', fontSize: '0.875rem' }}>
                    Discard
                  </button>
                  <button onClick={handleSave} style={{ padding: '9px 22px', borderRadius: '9999px', border: 'none', background: '#2D5016', color: '#F7F4EE', cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.875rem' }}>
                    Save Profile
                  </button>
                </div>
              </>
            ) : (
              <>
                {userProfile.bio && (
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#3D6132', lineHeight: 1.65 }}>{userProfile.bio}</p>
                )}

                {/* Skills (read) */}
                <div>
                  <p style={{ margin: '0 0 8px', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#6B8F6B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skills</p>
                  {userProfile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {userProfile.skills.map(s => <SkillChip key={s} label={s} readOnly />)}
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.82rem', color: '#8FAF8F', fontStyle: 'italic' }}>No skills added yet</p>
                  )}
                </div>

                {/* Mode + Availability (read) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <p style={{ margin: '0 0 8px', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#6B8F6B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Collaboration</p>
                    <span style={{ padding: '5px 14px', borderRadius: '9999px', background: 'rgba(45,80,22,0.09)', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#2D5016' }}>
                      {MODE_OPTIONS.find(m => m.value === userProfile.collaborationMode)?.icon}{' '}
                      {MODE_OPTIONS.find(m => m.value === userProfile.collaborationMode)?.label}
                    </span>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 8px', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', color: '#6B8F6B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Availability</p>
                    {userProfile.availabilitySlots.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {userProfile.availabilitySlots.map(s => (
                          <span key={s} style={{ padding: '3px 9px', borderRadius: '9999px', background: 'rgba(212,168,83,0.13)', border: '1px solid rgba(212,168,83,0.3)', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.72rem', color: '#7A5C00' }}>{s}</span>
                        ))}
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.82rem', color: '#8FAF8F', fontStyle: 'italic', margin: 0 }}>Not set</p>
                    )}
                    {userProfile.availabilityNote && (
                      <p style={{ margin: '5px 0 0', fontSize: '0.75rem', color: '#6B8F6B', fontStyle: 'italic' }}>"{userProfile.availabilityNote}"</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Membership panel */}
        <div style={{
          marginTop: '14px', padding: '16px 20px', borderRadius: '16px',
          background: userProfile.isMember ? 'linear-gradient(135deg, rgba(249,228,160,0.25), rgba(232,200,74,0.12))' : 'rgba(234,244,239,0.7)',
          border: userProfile.isMember ? '1.5px solid rgba(212,168,83,0.4)' : '1.5px solid rgba(107,143,107,0.2)',
          display: 'flex', alignItems: 'center', gap: '14px',
        }}>
          <div style={{ flex: 1 }}>
            {userProfile.isMember ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <GoldenLeafBadge />
                  <p style={{ margin: 0, fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: '#7A5C00' }}>Grove Member</p>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#8B7030', lineHeight: 1.5 }}>
                  Unlimited resubmissions before deadline · Priority material access · Your plant never droops from resubmissions
                </p>
              </>
            ) : (
              <>
                <p style={{ margin: '0 0 3px', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: '#4A6741' }}>Grove Free</p>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#6B8F6B', lineHeight: 1.5 }}>
                  Up to 2 resubmissions per assignment · Standard material access
                </p>
              </>
            )}
          </div>
          {/* Demo toggle */}
          <button
            onClick={onToggleMembership}
            style={{
              padding: '8px 16px', borderRadius: '9999px', cursor: 'pointer', flexShrink: 0,
              border: 'none',
              background: userProfile.isMember ? 'rgba(107,143,107,0.2)' : 'linear-gradient(135deg, #E8C84A, #D4A853)',
              color: userProfile.isMember ? '#4A6741' : '#5A3E00',
              fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.78rem',
              transition: 'all 0.2s',
            }}
          >
            {userProfile.isMember ? 'Switch to Free' : '✦ Try Member'}
          </button>
        </div>
      </section>

      {/* ── Study Buddies ──────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 style={{ margin: '0 0 2px', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, color: '#2D5016' }}>Study Buddies</h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B8F6B' }}>Find classmates to collaborate with</p>
          </div>
          <div className="flex gap-2">
            {(['all', 'online', 'offline', 'both'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '5px 14px', borderRadius: '9999px', border: 'none', cursor: 'pointer',
                  background: filter === f ? '#2D5016' : 'rgba(107,143,107,0.12)',
                  color: filter === f ? '#F7F4EE' : '#6B8F6B',
                  fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.78rem',
                  transition: 'all 0.15s',
                }}
              >
                {f === 'all' ? 'All' : f === 'online' ? '💻 Online' : f === 'offline' ? '🏫 In-person' : '✨ Both'}
              </button>
            ))}
          </div>
        </div>

        {/* Own profile card first */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
          <CollaboratorCard
            key={userProfile.userId}
            profile={{ ...userProfile, name: currentUser.name }}
            courses={courses}
            isYou={true}
          />
          <AnimatePresence>
            {filteredOthers.map((p, i) => (
              <motion.div key={p.userId} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.05 }}>
                <CollaboratorCard profile={p} courses={courses} isYou={false} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {filteredOthers.length === 0 && (
          <div className="flex flex-col items-center py-10 gap-2">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.3">
              <circle cx="18" cy="16" r="7" stroke="#6B8F6B" strokeWidth="1.5" />
              <circle cx="32" cy="16" r="7" stroke="#6B8F6B" strokeWidth="1.5" />
              <path d="M4 40C4 33 10 29 18 29" stroke="#6B8F6B" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M44 40C44 33 38 29 32 29" stroke="#6B8F6B" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p style={{ color: '#8FAF8F', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.88rem' }}>No buddies match this filter</p>
          </div>
        )}
      </section>
    </div>
  );
}
