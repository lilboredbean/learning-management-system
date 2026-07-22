import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import type { Course, Enrollment, Submission, Assignment, CourseMaterial, AppUser } from '../App';

interface ProgressTrackerPageProps {
  courses: Course[];
  enrollments: Enrollment[];
  submissions: Submission[];
  assignments: Assignment[];
  materials: CourseMaterial[];
  currentUser: AppUser;
  selectedCourseId: string | null;
  onSelectCourse: (id: string) => void;
}

const COLORS = ['#6B8F6B', '#D4A853', '#C8714A', '#8FAF8F', '#4A6741'];

const mockStudents = [
  { id: 's1', name: 'Maya Chen', email: 'maya@grove.edu', lastActive: '2 hours ago', attendance: 94, materialsRate: 88, submittedOnTime: 3, totalDue: 3, needsAttention: false },
  { id: 's2', name: 'Liam Foster', email: 'liam@grove.edu', lastActive: '1 day ago', attendance: 72, materialsRate: 65, submittedOnTime: 2, totalDue: 3, needsAttention: true },
  { id: 's3', name: 'Priya Nair', email: 'priya@grove.edu', lastActive: '3 hours ago', attendance: 100, materialsRate: 95, submittedOnTime: 3, totalDue: 3, needsAttention: false },
  { id: 's4', name: 'Jordan Blake', email: 'jordan@grove.edu', lastActive: '5 days ago', attendance: 58, materialsRate: 40, submittedOnTime: 1, totalDue: 3, needsAttention: true },
  { id: 's5', name: 'Ava Torres', email: 'ava@grove.edu', lastActive: '1 hour ago', attendance: 88, materialsRate: 78, submittedOnTime: 3, totalDue: 3, needsAttention: false },
  { id: 's6', name: 'Sam Park', email: 'sam@grove.edu', lastActive: '6 hours ago', attendance: 82, materialsRate: 72, submittedOnTime: 2, totalDue: 3, needsAttention: false },
];

const engagementData = [
  { week: 'Wk 1', engaged: 92, submissions: 85 },
  { week: 'Wk 2', engaged: 88, submissions: 78 },
  { week: 'Wk 3', engaged: 76, submissions: 72 },
  { week: 'Wk 4', engaged: 82, submissions: 80 },
  { week: 'Wk 5', engaged: 78, submissions: 68 },
  { week: 'Wk 6', engaged: 85, submissions: 75 },
];

const submissionBreakdown = [
  { name: 'On Time', value: 58 },
  { name: 'Late', value: 22 },
  { name: 'Missing', value: 20 },
];

const materialsByType = [
  { type: 'Slides', viewed: 82, total: 100 },
  { type: 'Readings', viewed: 68, total: 100 },
  { type: 'Recordings', viewed: 55, total: 100 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#F7F4EE', border: '1px solid rgba(107,143,107,0.3)', borderRadius: '10px', padding: '10px 14px' }}>
        <p style={{ margin: '0 0 4px', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.8rem', color: '#2D5016' }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ margin: '2px 0', fontSize: '0.75rem', color: p.color }}>
            {p.name}: <strong>{p.value}%</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ background: '#EAF4EF', borderRadius: '16px', padding: '18px 20px', border: '1.5px solid rgba(107,143,107,0.2)' }}>
      <p style={{ margin: '0 0 6px', fontSize: '0.75rem', color: '#8FAF8F', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ margin: 0, fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: color ?? '#2D5016', lineHeight: 1.2 }}>{value}</p>
      {sub && <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: '#8FAF8F' }}>{sub}</p>}
    </div>
  );
}

export function ProgressTrackerPage({
  courses, enrollments, submissions, assignments, materials, currentUser, selectedCourseId, onSelectCourse,
}: ProgressTrackerPageProps) {
  const [activeCourse, setActiveCourse] = useState(selectedCourseId ?? courses[0]?.id ?? '');
  const [view, setView] = useState<'overview' | 'students'>('overview');

  const courseEnrollments = enrollments.filter(e => e.courseId === activeCourse);
  const courseAssignments = assignments.filter(a => a.courseId === activeCourse);
  const courseSubmissions = submissions.filter(s => courseAssignments.some(a => a.id === s.assignmentId));
  const onTimeRate = courseSubmissions.length > 0 ? Math.round((courseSubmissions.filter(s => !s.isLate).length / courseSubmissions.length) * 100) : 0;

  return (
    <div>
      {/* Course selector */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {courses.map(c => (
          <button key={c.id} onClick={() => { setActiveCourse(c.id); onSelectCourse(c.id); }}
            style={{ padding: '6px 16px', borderRadius: '9999px', cursor: 'pointer', border: `1.5px solid ${activeCourse === c.id ? '#2D5016' : 'rgba(107,143,107,0.3)'}`, background: activeCourse === c.id ? '#2D5016' : 'transparent', color: activeCourse === c.id ? '#F7F4EE' : '#4A6741', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.8rem', transition: 'all 0.15s' }}>
            {c.title.length > 30 ? c.title.slice(0, 30) + '…' : c.title}
          </button>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex rounded-full p-1" style={{ background: 'rgba(107,143,107,0.12)', display: 'inline-flex' }}>
          {(['overview', 'students'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: '6px 18px', borderRadius: '9999px', border: 'none', cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', fontWeight: 600, fontSize: '0.82rem', transition: 'all 0.15s', background: view === v ? '#2D5016' : 'transparent', color: view === v ? '#F7F4EE' : '#6B8F6B' }}>
              {v === 'overview' ? 'Overview' : 'Students'}
            </button>
          ))}
        </div>
      </div>

      {view === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '14px' }}>
            <StatCard label="Enrolled Students" value={String(courseEnrollments.length || mockStudents.length)} sub="active learners" />
            <StatCard label="Avg. Attendance" value="82%" sub="past 4 weeks" color="#4A6741" />
            <StatCard label="Submissions" value={`${courseSubmissions.length || 14}`} sub="total received" />
            <StatCard label="On-Time Rate" value={`${onTimeRate || 68}%`} sub="of all submissions" color={onTimeRate < 50 ? '#C8714A' : '#2D5016'} />
            <StatCard label="Materials Read" value="74%" sub="avg. completion" color="#6B8F6B" />
            <StatCard label="Need Attention" value="2" sub="students disengaged" color="#C8714A" />
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            {/* Engagement line chart */}
            <div style={{ background: '#EAF4EF', borderRadius: '16px', padding: '18px', border: '1.5px solid rgba(107,143,107,0.2)' }}>
              <h4 style={{ margin: '0 0 16px', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#2D5016' }}>
                Weekly Engagement
              </h4>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={engagementData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke="rgba(107,143,107,0.1)" strokeDasharray="4 4" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#8FAF8F', fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#8FAF8F', fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="engaged" stroke="#6B8F6B" strokeWidth={2.5} dot={{ r: 4, fill: '#6B8F6B' }} name="Engagement" />
                  <Line type="monotone" dataKey="submissions" stroke="#D4A853" strokeWidth={2.5} dot={{ r: 4, fill: '#D4A853' }} name="Submissions" strokeDasharray="5 3" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2 justify-center">
                <span style={{ fontSize: '0.7rem', color: '#6B8F6B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '14px', height: '2.5px', background: '#6B8F6B', display: 'inline-block', borderRadius: '2px' }} /> Engagement
                </span>
                <span style={{ fontSize: '0.7rem', color: '#D4A853', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '14px', height: '2.5px', background: '#D4A853', display: 'inline-block', borderRadius: '2px', border: '1px dashed #D4A853' }} /> Submissions
                </span>
              </div>
            </div>

            {/* Submission pie */}
            <div style={{ background: '#EAF4EF', borderRadius: '16px', padding: '18px', border: '1.5px solid rgba(107,143,107,0.2)' }}>
              <h4 style={{ margin: '0 0 16px', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#2D5016' }}>
                Submission Status
              </h4>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={160}>
                  <PieChart>
                    <Pie data={submissionBreakdown} cx="50%" cy="50%" innerRadius={38} outerRadius={60} dataKey="value" stroke="none">
                      {submissionBreakdown.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {submissionBreakdown.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: COLORS[i], flexShrink: 0 }} />
                      <div>
                        <p style={{ margin: 0, fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.8rem', color: '#2D5016' }}>{item.value}%</p>
                        <p style={{ margin: 0, fontSize: '0.7rem', color: '#8FAF8F' }}>{item.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Materials bar chart */}
          <div style={{ background: '#EAF4EF', borderRadius: '16px', padding: '18px', border: '1.5px solid rgba(107,143,107,0.2)' }}>
            <h4 style={{ margin: '0 0 16px', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#2D5016' }}>
              Material Completion by Type
            </h4>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={materialsByType} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid horizontal={false} stroke="rgba(107,143,107,0.1)" strokeDasharray="4 4" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#8FAF8F', fontFamily: 'Inter, sans-serif' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="type" tick={{ fontSize: 12, fill: '#4A6741', fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }} axisLine={false} tickLine={false} width={70} />
                <Tooltip formatter={(v) => [`${v}%`, 'Avg. Completion']} contentStyle={{ background: '#F7F4EE', border: '1px solid rgba(107,143,107,0.3)', borderRadius: '10px', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem' }} />
                <Bar dataKey="viewed" fill="#8FAF8F" radius={[0, 6, 6, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {view === 'students' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {mockStudents.map((student, i) => (
            <div
              key={student.id}
              style={{
                padding: '16px 20px', borderRadius: '14px',
                background: student.needsAttention ? 'rgba(212,168,83,0.08)' : '#EAF4EF',
                border: student.needsAttention ? '1.5px solid rgba(200,113,74,0.3)' : '1.5px solid rgba(107,143,107,0.2)',
                display: 'flex', alignItems: 'center', gap: '14px',
              }}
            >
              {/* Avatar */}
              <div style={{ width: '38px', height: '38px', borderRadius: '9999px', background: student.needsAttention ? '#FDF0DC' : '#D4EDD8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: student.needsAttention ? '#C8714A' : '#2D5016', flexShrink: 0 }}>
                {student.name.charAt(0)}
              </div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex items-center gap-2 mb-1">
                  <p style={{ margin: 0, fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.88rem', color: '#2D5016' }}>{student.name}</p>
                  {student.needsAttention && (
                    <span style={{ padding: '2px 8px', borderRadius: '9999px', background: 'rgba(200,113,74,0.15)', color: '#C8714A', fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.62rem', letterSpacing: '0.05em' }}>
                      NEEDS ATTENTION
                    </span>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: '0.73rem', color: '#8FAF8F' }}>Last active: {student.lastActive}</p>
              </div>
              {/* Stats */}
              <div className="flex gap-5 shrink-0">
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: student.attendance < 70 ? '#C8714A' : '#2D5016' }}>{student.attendance}%</p>
                  <p style={{ margin: 0, fontSize: '0.65rem', color: '#8FAF8F' }}>Attendance</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: student.materialsRate < 60 ? '#C8714A' : '#2D5016' }}>{student.materialsRate}%</p>
                  <p style={{ margin: 0, fontSize: '0.65rem', color: '#8FAF8F' }}>Materials</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, fontFamily: 'Quicksand, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: student.submittedOnTime < student.totalDue ? '#D4A853' : '#2D5016' }}>{student.submittedOnTime}/{student.totalDue}</p>
                  <p style={{ margin: 0, fontSize: '0.65rem', color: '#8FAF8F' }}>On Time</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
