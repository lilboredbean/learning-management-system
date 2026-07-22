import { useState, useMemo } from 'react';
import { AuthPage } from './components/AuthPage';
import { Layout, type PageName } from './components/Layout';
import { CoursesPage } from './components/CoursesPage';
import { MaterialsPage } from './components/MaterialsPage';
import { AssignmentsPage } from './components/AssignmentsPage';
import { AnnouncementsPage } from './components/AnnouncementsPage';
import { ProgressTrackerPage } from './components/ProgressTrackerPage';
import { ProfilePage } from './components/ProfilePage';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isMember: boolean;
}

export interface UserProfile {
  userId: string;
  name: string;
  bio: string;
  skills: string[];
  collaborationMode: 'online' | 'offline' | 'both';
  availabilitySlots: string[];
  availabilityNote: string;
  isMember: boolean;
  courseIds: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  duration: string;
  studentsCount: number;
}

export interface CourseMaterial {
  id: string;
  courseId: string;
  title: string;
  type: 'slides' | 'reading' | 'recording';
  fileSize: string;
  uploadedAt: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  userId: string;
  submittedAt: string;
  content: string;
  isLate: boolean;
  needsResubmission: boolean;
  score?: number;
}

export interface Announcement {
  id: string;
  courseId: string;
  title: string;
  content: string;
  publishedAt: string;
  author: string;
  pinned: boolean;
}

export interface Enrollment {
  userId: string;
  courseId: string;
  enrolledAt: string;
  progress: number;
  lastActive: string;
}

// ─── Seed data ───────────────────────────────────────────────────────────────

const now = new Date();
const days = (n: number) => new Date(now.getTime() + n * 86400000).toISOString();

const INITIAL_COURSES: Course[] = [
  { id: 'c1', title: 'Data Structures & Algorithms', description: 'Master the fundamental building blocks of efficient software — arrays, trees, graphs, sorting, and dynamic programming — with hands-on coding exercises.', instructor: 'Dr. Nguyen', category: 'Algorithms', duration: '8 weeks', studentsCount: 24 },
  { id: 'c2', title: 'Full-Stack Web Development', description: 'Build modern web applications end-to-end using React, Node.js, and PostgreSQL, covering REST APIs, authentication, and deployment pipelines.', instructor: 'Prof. Lin', category: 'Web Dev', duration: '10 weeks', studentsCount: 18 },
  { id: 'c3', title: 'Machine Learning Fundamentals', description: 'Understand supervised and unsupervised learning, neural networks, and model evaluation — with practical Python projects using scikit-learn and PyTorch.', instructor: 'Dr. Marsh', category: 'AI / ML', duration: '10 weeks', studentsCount: 31 },
  { id: 'c4', title: 'Systems Design & Architecture', description: 'Learn to design scalable, fault-tolerant distributed systems covering load balancing, caching, databases, message queues, and real-world case studies.', instructor: 'Dr. Nguyen', category: 'Systems', duration: '7 weeks', studentsCount: 15 },
];

const INITIAL_MATERIALS: CourseMaterial[] = [
  { id: 'm1', courseId: 'c1', title: 'Week 1: Arrays, Stacks & Queues', type: 'slides', fileSize: '3.2 MB', uploadedAt: days(-14) },
  { id: 'm2', courseId: 'c1', title: 'Introduction to Big-O Notation — Reading', type: 'reading', fileSize: '1.1 MB', uploadedAt: days(-13) },
  { id: 'm3', courseId: 'c1', title: 'Week 1 Lecture Recording', type: 'recording', fileSize: '420 MB', uploadedAt: days(-13) },
  { id: 'm4', courseId: 'c1', title: 'Week 2: Trees, Heaps & Graphs', type: 'slides', fileSize: '4.8 MB', uploadedAt: days(-7) },
  { id: 'm5', courseId: 'c1', title: 'Cracking the Coding Interview — Ch. 4 (Trees)', type: 'reading', fileSize: '850 KB', uploadedAt: days(-7) },
  { id: 'm6', courseId: 'c1', title: 'Week 2 Lecture Recording', type: 'recording', fileSize: '380 MB', uploadedAt: days(-6) },
  { id: 'm7', courseId: 'c2', title: 'Week 1: HTML, CSS & React Basics', type: 'slides', fileSize: '2.9 MB', uploadedAt: days(-10) },
  { id: 'm8', courseId: 'c2', title: 'React Docs: Thinking in React', type: 'reading', fileSize: '1.4 MB', uploadedAt: days(-9) },
  { id: 'm9', courseId: 'c2', title: 'Week 1 Lecture Recording', type: 'recording', fileSize: '390 MB', uploadedAt: days(-9) },
  { id: 'm10', courseId: 'c3', title: 'Week 1: Linear Regression & Loss Functions', type: 'slides', fileSize: '5.1 MB', uploadedAt: days(-5) },
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
  { id: 'a1', courseId: 'c1', title: 'Implement a Binary Search Tree', description: 'Build a BST class in the language of your choice supporting insert, search, delete, and in-order traversal. Include unit tests and an analysis of time complexity for each operation.', dueDate: days(-5), maxScore: 100 },
  { id: 'a2', courseId: 'c1', title: 'Graph Shortest-Path Problem', description: 'Implement both Dijkstra\'s and BFS shortest-path algorithms on a weighted directed graph. Compare their outputs and runtime on at least 3 test cases. Write a brief reflection on when to use each.', dueDate: days(-1), maxScore: 150 },
  { id: 'a3', courseId: 'c1', title: 'Dynamic Programming Capstone', description: 'Solve 5 classic DP problems (coin change, longest common subsequence, knapsack, edit distance, matrix chain multiplication) and write a 500-word analysis of the patterns you identified across them.', dueDate: days(14), maxScore: 200 },
  { id: 'a4', courseId: 'c2', title: 'Build a REST API with Node.js', description: 'Create a CRUD REST API for a simple task manager using Express and PostgreSQL. Include input validation, error handling middleware, and at least 10 integration tests using Jest and Supertest.', dueDate: days(3), maxScore: 100 },
  { id: 'a5', courseId: 'c2', title: 'Full-Stack Feature: Authentication', description: 'Add JWT-based authentication (register, login, protected routes) to the task manager API from Assignment 1, and build a React login/register UI that persists the token in localStorage.', dueDate: days(10), maxScore: 120 },
];

const INITIAL_SUBMISSIONS: Submission[] = [
  { id: 'sub1', assignmentId: 'a1', userId: 'u1', submittedAt: days(-6), content: 'class BinarySearchTree { constructor() { this.root = null; } insert(value) {…', isLate: false, needsResubmission: false, score: 92 },
  { id: 'sub2', assignmentId: 'a2', userId: 'u1', submittedAt: days(-1), content: 'I implemented Dijkstra\'s using a min-heap priority queue and BFS using a standard queue…', isLate: false, needsResubmission: true },
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  { id: 'an1', courseId: 'c1', title: 'Welcome to Data Structures & Algorithms!', content: 'Hi everyone — thrilled to have you here! Please make sure your development environment is set up before Thursday\'s session (see the setup guide in Week 1 materials). Post any issues in the discussion board and we\'ll sort it out together.', publishedAt: days(-12), author: 'Dr. Nguyen', pinned: false },
  { id: 'an2', courseId: 'c1', title: 'Assignment 2 Feedback — Revision Needed', content: 'Great work overall on the Graph assignment! A few submissions are missing the runtime comparison section — please make sure to benchmark both algorithms with concrete input sizes. I\'ve left inline comments in the gradebook. Revisions due this Friday.', publishedAt: days(-1), author: 'Dr. Nguyen', pinned: true },
  { id: 'an3', courseId: 'c1', title: 'Office Hours Moved — Week 4', content: 'Heads up: office hours this Thursday are shifted to 4–5 pm instead of the usual 2–3 pm slot. Same video link as always. Come with questions about the DP capstone — we\'ll do live problem-solving together.', publishedAt: days(-0.2), author: 'Dr. Nguyen', pinned: false },
  { id: 'an4', courseId: 'c2', title: 'Welcome to Full-Stack Web Dev!', content: 'Welcome, builders! Before our first session, please clone the starter repo (link in Week 1 slides) and confirm Node 20+ and PostgreSQL 16 are running locally. Looking forward to shipping things together this term.', publishedAt: days(-8), author: 'Prof. Lin', pinned: false },
];

const INITIAL_ENROLLMENTS: Enrollment[] = [
  { userId: 'u1', courseId: 'c1', enrolledAt: days(-14), progress: 45, lastActive: days(-0.1) },
  { userId: 'u1', courseId: 'c2', enrolledAt: days(-10), progress: 20, lastActive: days(-1) },
];

const INITIAL_VIEWED: string[] = ['m1', 'm2', 'm7'];

const INITIAL_PROFILES: UserProfile[] = [
  { userId: 'u1', name: 'Maya Chen', bio: 'CS junior exploring full-stack and ML. Love pair-programming on algorithm problems.', skills: ['Python', 'React', 'Data Viz'], collaborationMode: 'online', availabilitySlots: ['Mon–Fri', 'Evenings'], availabilityNote: 'PST timezone, 90-min sessions preferred', isMember: false, courseIds: ['c1', 'c2'] },
  { userId: 's1', name: 'Liam Foster', bio: 'Backend-focused dev looking for project partners. Let\'s build something real together.', skills: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker'], collaborationMode: 'online', availabilitySlots: ['Weekends', 'Afternoons'], availabilityNote: '', isMember: true, courseIds: ['c1', 'c3'] },
  { userId: 's2', name: 'Priya Nair', bio: 'ML researcher and paper-reading enthusiast. Open to study groups and research discussions.', skills: ['PyTorch', 'Python', 'NLP', 'Research Writing'], collaborationMode: 'both', availabilitySlots: ['Mon–Fri', 'Mornings', 'Weekends'], availabilityNote: 'Mornings 9–11 am EST preferred', isMember: true, courseIds: ['c1', 'c3', 'c4'] },
  { userId: 's3', name: 'Jordan Blake', bio: 'Competitive programmer, deep-diver into DSA. Up for timed practice sessions.', skills: ['C++', 'Algorithms', 'Competitive Coding', 'Java'], collaborationMode: 'offline', availabilitySlots: ['Mon–Fri', 'Afternoons'], availabilityNote: 'Campus library, Building B', isMember: false, courseIds: ['c1'] },
  { userId: 's4', name: 'Ava Torres', bio: 'Frontend dev passionate about accessible, beautiful interfaces. Great at CSS wizardry.', skills: ['React', 'UI/UX', 'Figma', 'Testing'], collaborationMode: 'online', availabilitySlots: ['Evenings', 'Weekends'], availabilityNote: '', isMember: false, courseIds: ['c2'] },
  { userId: 's5', name: 'Sam Park', bio: 'DevOps and distributed systems nerd. Loves debugging gnarly infrastructure problems.', skills: ['Go', 'Docker', 'Kubernetes', 'System Design'], collaborationMode: 'online', availabilitySlots: ['Flexible'], availabilityNote: 'Usually free Tue/Thu evenings', isMember: true, courseIds: ['c4'] },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

let _id = 100;
const uid = () => String(++_id);

// ─── App ────────────────────────────────────────────────────────────────────

export default function App() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activePage, setActivePage] = useState<PageName>('courses');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>('c1');

  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [materials, setMaterials] = useState<CourseMaterial[]>(INITIAL_MATERIALS);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(INITIAL_ENROLLMENTS);
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [viewedMaterials, setViewedMaterials] = useState<Set<string>>(new Set(INITIAL_VIEWED));
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>(INITIAL_PROFILES);
  // maps assignmentId → how many times the current user has resubmitted
  const [resubmissionCounts, setResubmissionCounts] = useState<Record<string, number>>({});

  // ── Auth ──
  const handleLogin = (email: string, _pw: string, role: 'user' | 'admin') => {
    const name = role === 'admin' ? 'Dr. Nguyen' : 'Maya Chen';
    const id = role === 'admin' ? 'admin1' : 'u1';
    const isMember = userProfiles.find(p => p.userId === id)?.isMember ?? false;
    setCurrentUser({ id, name, email, role, isMember });
    setActivePage('courses');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthMode('login');
  };

  // ── Courses ──
  const createCourse = (data: Omit<Course, 'id'>) => {
    setCourses(cs => [...cs, { ...data, id: `c${uid()}`, studentsCount: 0 }]);
  };
  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(cs => cs.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  // ── Enrollments ──
  const enroll = (courseId: string) => {
    if (!currentUser) return;
    if (enrollments.some(e => e.userId === currentUser.id && e.courseId === courseId)) return;
    setEnrollments(es => [...es, { userId: currentUser.id, courseId, enrolledAt: new Date().toISOString(), progress: 0, lastActive: new Date().toISOString() }]);
  };
  const withdraw = (courseId: string) => {
    if (!currentUser) return;
    setEnrollments(es => es.filter(e => !(e.userId === currentUser.id && e.courseId === courseId)));
  };

  // ── Materials ──
  const uploadMaterial = (data: Omit<CourseMaterial, 'id'>) => {
    setMaterials(ms => [...ms, { ...data, id: `m${uid()}`, uploadedAt: new Date().toISOString() }]);
  };
  const updateMaterial = (id: string, updates: Partial<CourseMaterial>) => {
    setMaterials(ms => ms.map(m => m.id === id ? { ...m, ...updates } : m));
  };
  const deleteMaterial = (id: string) => {
    setMaterials(ms => ms.filter(m => m.id !== id));
  };
  const markViewed = (id: string) => {
    setViewedMaterials(s => new Set([...s, id]));
    if (currentUser) {
      setEnrollments(es => es.map(e => {
        if (e.userId === currentUser.id) {
          const total = materials.filter(m => m.courseId === e.courseId).length;
          const viewed = [...viewedMaterials, id].filter(v => materials.some(m => m.id === v && m.courseId === e.courseId)).length;
          return { ...e, progress: Math.min(100, Math.round((viewed / Math.max(total, 1)) * 70 + 15)) };
        }
        return e;
      }));
    }
  };

  // ── Assignments ──
  const createAssignment = (data: Omit<Assignment, 'id'>) => {
    setAssignments(as => [...as, { ...data, id: `a${uid()}` }]);
  };
  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments(as => as.map(a => a.id === id ? { ...a, ...updates } : a));
  };
  const deleteAssignment = (id: string) => {
    setAssignments(as => as.filter(a => a.id !== id));
  };
  const submitAssignment = (assignmentId: string, content: string) => {
    if (!currentUser) return;
    const assignment = assignments.find(a => a.id === assignmentId);
    const isLate = assignment ? new Date(assignment.dueDate) < new Date() : false;
    setSubmissions(ss => ss.filter(s => !(s.assignmentId === assignmentId && s.userId === currentUser.id)).concat({
      id: `sub${uid()}`, assignmentId, userId: currentUser.id,
      submittedAt: new Date().toISOString(), content, isLate, needsResubmission: false,
    }));
  };
  const resubmitAssignment = (assignmentId: string, content: string) => {
    if (!currentUser) return;
    setSubmissions(ss => ss.map(s =>
      s.assignmentId === assignmentId && s.userId === currentUser.id
        ? { ...s, content, needsResubmission: false, submittedAt: new Date().toISOString() }
        : s
    ));
    setResubmissionCounts(rc => ({ ...rc, [assignmentId]: (rc[assignmentId] ?? 0) + 1 }));
  };

  // ── Profile & Membership ──
  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    setUserProfiles(ps => ps.map(p => p.userId === currentUser.id ? { ...p, ...updates } : p));
  };

  const toggleMembership = () => {
    if (!currentUser) return;
    const newVal = !userProfiles.find(p => p.userId === currentUser.id)?.isMember;
    setUserProfiles(ps => ps.map(p => p.userId === currentUser.id ? { ...p, isMember: newVal } : p));
    setCurrentUser(u => u ? { ...u, isMember: newVal } : u);
  };

  // ── Announcements ──
  const createAnnouncement = (data: Omit<Announcement, 'id'>) => {
    setAnnouncements(as => [{ ...data, id: `an${uid()}` }, ...as]);
  };
  const updateAnnouncement = (id: string, updates: Partial<Announcement>) => {
    setAnnouncements(as => as.map(a => a.id === id ? { ...a, ...updates } : a));
  };
  const deleteAnnouncement = (id: string) => {
    setAnnouncements(as => as.filter(a => a.id !== id));
  };

  // ── Plant progress ──
  const plantProgress = useMemo(() => {
    if (!currentUser) return { percentage: 0, droop: false };

    if (currentUser.role === 'admin') {
      const totalEnrollments = enrollments.length;
      const totalSubs = submissions.length;
      const onTimeSubs = submissions.filter(s => !s.isLate && !s.needsResubmission).length;
      const totalAssignments = assignments.length;
      const submissionRate = totalAssignments > 0 ? totalSubs / (totalAssignments * Math.max(totalEnrollments, 1)) : 0.5;
      const onTimeRate = totalSubs > 0 ? onTimeSubs / totalSubs : 0.7;
      const engagementScore = Math.min(1, (totalEnrollments / 10) * 0.4 + submissionRate * 0.3 + onTimeRate * 0.3);
      return { percentage: Math.round(engagementScore * 100), droop: engagementScore < 0.35 };
    }

    const userEnrollments = enrollments.filter(e => e.userId === currentUser.id);
    const enrolledIds = userEnrollments.map(e => e.courseId);
    const enrollmentScore = Math.min(userEnrollments.length * 15, 30);
    const enrolledMaterials = materials.filter(m => enrolledIds.includes(m.courseId));
    const viewedCount = enrolledMaterials.filter(m => viewedMaterials.has(m.id)).length;
    const viewScore = enrolledMaterials.length > 0 ? (viewedCount / enrolledMaterials.length) * 35 : 0;
    const userSubs = submissions.filter(s => s.userId === currentUser.id);
    const enrolledAssignments = assignments.filter(a => enrolledIds.includes(a.courseId));
    const onTimeSubs = userSubs.filter(s => !s.isLate && !s.needsResubmission).length;
    const submissionScore = enrolledAssignments.length > 0 ? (onTimeSubs / enrolledAssignments.length) * 35 : 0;
    const percentage = Math.round(enrollmentScore + viewScore + submissionScore);

    // Members never droop from pending resubmissions — only from genuinely unsubmitted overdue work
    const hasLateOrPending = currentUser.isMember
      ? userSubs.some(s => s.isLate && !s.content)
      : userSubs.some(s => s.isLate || s.needsResubmission);

    return { percentage: Math.max(percentage, userEnrollments.length > 0 ? 12 : 5), droop: hasLateOrPending };
  }, [currentUser, enrollments, materials, viewedMaterials, assignments, submissions]);

  // ── Visible courses (users see all; admins see all) ──
  const visibleCourses = courses;

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} mode={authMode} setMode={setAuthMode} />;
  }

  const pageProps = {
    courses: visibleCourses,
    enrollments,
    submissions,
    assignments,
    materials,
    announcements,
    currentUser,
    selectedCourseId,
    onSelectCourse: (id: string) => setSelectedCourseId(id),
    setActivePage,
  };

  return (
    <Layout
      currentUser={currentUser}
      activePage={activePage}
      setActivePage={setActivePage}
      plantPercentage={plantProgress.percentage}
      plantDroop={plantProgress.droop}
      onLogout={handleLogout}
      selectedCourseTitle={selectedCourse?.title}
    >
      {activePage === 'courses' && (
        <CoursesPage
          courses={visibleCourses}
          enrollments={enrollments}
          currentUser={currentUser}
          onEnroll={enroll}
          onWithdraw={withdraw}
          onCreateCourse={createCourse}
          onUpdateCourse={updateCourse}
          onSelectCourse={(id) => setSelectedCourseId(id)}
          setActivePage={setActivePage}
        />
      )}
      {activePage === 'materials' && (
        <MaterialsPage
          materials={materials}
          courses={currentUser.role === 'user'
            ? visibleCourses.filter(c => enrollments.some(e => e.userId === currentUser.id && e.courseId === c.id))
            : visibleCourses}
          currentUser={currentUser}
          selectedCourseId={selectedCourseId}
          viewedMaterials={viewedMaterials}
          isMember={currentUser.isMember}
          onUpload={uploadMaterial}
          onUpdate={updateMaterial}
          onDelete={deleteMaterial}
          onMarkViewed={markViewed}
          onSelectCourse={(id) => setSelectedCourseId(id)}
        />
      )}
      {activePage === 'assignments' && (
        <AssignmentsPage
          assignments={assignments}
          submissions={submissions}
          courses={currentUser.role === 'user'
            ? visibleCourses.filter(c => enrollments.some(e => e.userId === currentUser.id && e.courseId === c.id))
            : visibleCourses}
          currentUser={currentUser}
          selectedCourseId={selectedCourseId}
          isMember={currentUser.isMember}
          resubmissionCounts={resubmissionCounts}
          maxResubmissions={2}
          onCreateAssignment={createAssignment}
          onUpdateAssignment={updateAssignment}
          onDeleteAssignment={deleteAssignment}
          onSubmit={submitAssignment}
          onResubmit={resubmitAssignment}
          onSelectCourse={(id) => setSelectedCourseId(id)}
          onGoToProfile={() => setActivePage('profile')}
        />
      )}
      {activePage === 'announcements' && (
        <AnnouncementsPage
          announcements={announcements}
          courses={currentUser.role === 'user'
            ? visibleCourses.filter(c => enrollments.some(e => e.userId === currentUser.id && e.courseId === c.id))
            : visibleCourses}
          currentUser={currentUser}
          selectedCourseId={selectedCourseId}
          onCreate={createAnnouncement}
          onUpdate={updateAnnouncement}
          onDelete={deleteAnnouncement}
          onSelectCourse={(id) => setSelectedCourseId(id)}
        />
      )}
      {activePage === 'progress' && currentUser.role === 'admin' && (
        <ProgressTrackerPage
          courses={visibleCourses}
          enrollments={enrollments}
          submissions={submissions}
          assignments={assignments}
          materials={materials}
          currentUser={currentUser}
          selectedCourseId={selectedCourseId}
          onSelectCourse={(id) => setSelectedCourseId(id)}
        />
      )}
      {activePage === 'profile' && currentUser.role === 'user' && (
        <ProfilePage
          currentUser={currentUser}
          userProfile={userProfiles.find(p => p.userId === currentUser.id) ?? userProfiles[0]}
          allProfiles={userProfiles}
          courses={visibleCourses}
          onUpdateProfile={updateProfile}
          onToggleMembership={toggleMembership}
        />
      )}
    </Layout>
  );
}
