const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export async function apiRequest(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorData.message || 'حدث خطأ في الاتصال بالخادم');
    }
    return await res.json();
  } catch (err) {
    console.warn(`[API] Failed to call ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // Auth
  login: (username, password, portalRole = 'student') =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, portalRole }),
    }),
  changePassword: (userId, newPassword) =>
    apiRequest(`/auth/change-password/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
    }),
  register: (data) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getUsers: () => apiRequest('/auth/users'),
  updateUserStatus: (id, status) =>
    apiRequest(`/auth/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  // Assignments
  getAssignments: (onlyPublished = true, classroom = null, type = null) => {
    const params = new URLSearchParams();
    if (onlyPublished !== null) params.append('onlyPublished', onlyPublished);
    if (classroom) params.append('classroom', classroom);
    if (type) params.append('type', type);
    return apiRequest(`/assignments?${params.toString()}`);
  },
  getAssignmentById: (id) => apiRequest(`/assignments/${id}`),
  createAssignment: (data, teacherId) =>
    apiRequest(`/assignments${teacherId ? `?teacherId=${teacherId}` : ''}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteAssignment: (id) =>
    apiRequest(`/assignments/${id}`, { method: 'DELETE' }),

  // Progress
  getStudentProgress: (studentId) =>
    apiRequest(`/progress/student/${studentId}`),
  getLiveBoard: () => apiRequest('/progress/live'),
  startProgress: (assignmentId, studentId) =>
    apiRequest(`/progress/start/${assignmentId}?studentId=${studentId}`, {
      method: 'POST',
    }),
  updateProgress: (id, data) =>
    apiRequest(`/progress/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  sendEncouragement: (id, message) =>
    apiRequest(`/progress/${id}/message`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
  grantExtraMinutes: (id, minutes) =>
    apiRequest(`/progress/${id}/extra-minutes`, {
      method: 'POST',
      body: JSON.stringify({ minutes }),
    }),
  gradeSubmission: (id, data) =>
    apiRequest(`/progress/${id}/grade`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Announcements
  getAnnouncements: (classroom) =>
    apiRequest(`/announcements${classroom ? `?classroom=${classroom}` : ''}`),

  // Videos
  getVideos: (studentId) =>
    apiRequest(`/videos${studentId ? `?studentId=${studentId}` : ''}`),
  createVideo: (data) =>
    apiRequest('/videos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  recordView: (id, studentId, data) =>
    apiRequest(`/videos/${id}/view?studentId=${studentId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Skills
  getSkills: (studentId) => apiRequest(`/skills/student/${studentId}`),
  claimSkill: (studentId, skillKey, claimed) =>
    apiRequest(`/skills/claim?studentId=${studentId}&skillKey=${skillKey}&claimed=${claimed}`, {
      method: 'POST',
    }),
  confirmSkill: (studentId, skillKey, confirmed) =>
    apiRequest(`/skills/confirm?studentId=${studentId}&skillKey=${skillKey}&confirmed=${confirmed}`, {
      method: 'POST',
    }),

  // Dashboard
  getStats: () => apiRequest('/dashboard/stats'),
  getParentDashboard: (parentId) => apiRequest(`/dashboard/parent/${parentId}`),

  // Notifications
  getMyNotifications: (userId, role) =>
    apiRequest(`/manager/notifications/my?userId=${userId}&role=${encodeURIComponent(role)}`),
  markNotificationRead: (id, userId, userName, userRole) =>
    apiRequest(`/manager/notifications/${id}/read?userId=${userId}&userName=${encodeURIComponent(userName)}&userRole=${encodeURIComponent(userRole)}`, {
      method: 'POST',
    }),
  acknowledgeNotification: (id, userId, userName, userRole) =>
    apiRequest(`/manager/notifications/${id}/acknowledge?userId=${userId}&userName=${encodeURIComponent(userName)}&userRole=${encodeURIComponent(userRole)}`, {
      method: 'POST',
    }),

  // Operations: Attendance & Schedules
  getStudentAttendanceStats: (studentId) =>
    apiRequest(`/attendance/students/stats/${studentId}`),
  getClassSchedule: (classroom) =>
    apiRequest(`/schedule?classroom=${encodeURIComponent(classroom)}`),

  // Operations: Parent Requests
  createParentRequest: (data) =>
    apiRequest('/parent-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getParentRequests: (parentId) =>
    apiRequest(`/parent-requests/parent/${parentId}`),

  // Student Disciplinary & Behavioral Notices
  acknowledgeNotice: (noticeId, parentNotes) =>
    apiRequest(`/dashboard/parent/notices/${noticeId}/acknowledge`, {
      method: 'POST',
      body: JSON.stringify({ parentNotes }),
    }),
  getStudentDisciplineNotices: (studentId, category, status) => {
    const params = new URLSearchParams();
    if (studentId) params.append('studentId', studentId);
    if (category) params.append('category', category);
    if (status) params.append('status', status);
    return apiRequest(`/dashboard/student-notices?${params.toString()}`);
  },
};
