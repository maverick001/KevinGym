import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import axiosInstance from '../axiosConfig';

const BOOKED_CLASSES = [
  { id: 'CLS-101', classroom: 'Studio A',  time: 'Mar 24 · 7:00 AM'  },
  { id: 'CLS-204', classroom: 'Studio B',  time: 'Mar 25 · 6:30 PM'  },
  { id: 'CLS-089', classroom: 'Spin Room', time: 'Mar 26 · 8:00 AM'  },
  { id: 'CLS-317', classroom: 'Studio A',  time: 'Mar 28 · 12:00 PM' },
  { id: 'CLS-142', classroom: 'Studio C',  time: 'Mar 29 · 9:00 AM'  },
  { id: 'CLS-256', classroom: 'Yoga Loft', time: 'Mar 30 · 6:00 AM'  },
];

const INITIAL_NOTIFICATIONS = [
  { datetime: 'Mar 23 · 9:00 AM',  content: 'Your booking for C-001 is confirmed.' },
  { datetime: 'Mar 23 · 10:30 AM', content: 'Reminder: Power Yoga tomorrow at 7:00 AM.' },
  { datetime: 'Mar 22 · 2:15 PM',  content: 'Class C-003 location changed to Studio B.' },
  { datetime: 'Mar 22 · 4:00 PM',  content: 'Monthly membership renewed successfully.' },
  { datetime: 'Mar 21 · 11:00 AM', content: 'New class added: Dance Cardio on Mar 29.' },
  { datetime: 'Mar 21 · 3:45 PM',  content: "Kevin's Gym will be closed on Apr 1 (holiday)." },
];

const formatDatetime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

const MemberPanel = () => {
  const { user } = useAuth();
  const { notifications: liveNotifications } = useNotifications();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [membership, setMembership] = useState({ status: 'trial', description: '', canBookClass: true, canAccessContent: true });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [flaggedNotifs, setFlaggedNotifs] = useState(new Set());

  useEffect(() => {
    if (liveNotifications.length > 0) {
      setNotifications(liveNotifications.map((n) => ({
        datetime: n.createdAt ? formatDatetime(n.createdAt) : '—',
        content: n.message,
      })));
    }
  }, [liveNotifications]);

  const authHeader = { headers: { Authorization: `Bearer ${user?.token}` } };

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, membershipRes] = await Promise.all([
          axiosInstance.get('/api/auth/profile', authHeader),
          axiosInstance.get('/api/membership/status', authHeader),
        ]);
        setProfile({ name: profileRes.data.name, email: profileRes.data.email });
        setMembership(membershipRes.data);
      } catch {
        alert('Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    setLoading(true);
    try {
      await axiosInstance.put('/api/auth/profile', profile, authHeader);
      setEditing(false);
    } catch {
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const [firstName, ...lastParts] = (profile.name || '').split(' ');
  const lastName = lastParts.join(' ');

  const inputClass = 'w-full px-2 py-1.5 border border-gray-300 rounded text-sm text-gray-600';
  const labelClass = 'w-28 flex-shrink-0 px-2 py-1.5 bg-gray-100 border border-gray-300 rounded text-sm text-gray-700';

  if (loading && !profile.name) {
    return <div className="min-h-screen bg-gym-cream flex items-center justify-center text-gray-500 text-sm">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gym-cream">
      {/* Hero */}
      <div className="px-8 py-5 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800">Member Panel</h1>
        <p className="text-sm text-gray-500 mt-1">View your profile, manage booked classes, and check your notifications.</p>
      </div>

      {/* Three-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-8 py-8">

        {/* User Profile */}
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gray-100 border-b border-gray-300 px-4 py-2 text-sm font-medium text-gray-700">
            User Profile
          </div>
          <div className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className={labelClass}>First Name</span>
              <input
                type="text"
                value={firstName}
                disabled={!editing}
                onChange={(e) => setProfile({ ...profile, name: `${e.target.value} ${lastName}`.trim() })}
                className={inputClass}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className={labelClass}>Last Name</span>
              <input
                type="text"
                value={lastName}
                disabled={!editing}
                onChange={(e) => setProfile({ ...profile, name: `${firstName} ${e.target.value}`.trim() })}
                className={inputClass}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className={labelClass}>Email</span>
              <input
                type="email"
                value={profile.email}
                disabled={!editing}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className={labelClass}>Phone</span>
              <input type="text" placeholder="—" disabled={!editing} className={inputClass} />
            </div>
            <div className="flex items-center gap-2">
              <span className={labelClass}>Member Since</span>
              <input type="text" defaultValue="Jan 2024" disabled className={inputClass} />
            </div>
            <div className="flex items-center gap-2">
              <span className={labelClass}>Membership</span>
              <div className="flex-1 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${
                  membership.status === 'active'    ? 'bg-green-100 text-green-700' :
                  membership.status === 'trial'     ? 'bg-blue-100 text-blue-700'  :
                  membership.status === 'suspended' ? 'bg-yellow-100 text-yellow-700' :
                                                      'bg-red-100 text-red-700'
                }`}>{membership.status}</span>
                <span className="text-xs text-gray-500">{membership.description}</span>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-1.5 border border-gray-400 rounded text-sm text-gray-700 hover:bg-gray-50"
              >
                Edit Profile
              </button>
              <button
                onClick={handleSave}
                disabled={loading || !editing}
                className="px-4 py-1.5 border border-gray-400 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>

        {/* Booked Classes */}
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gray-100 border-b border-gray-300 px-4 py-2 text-sm font-medium text-gray-700">
            Booked Classes
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-2 font-semibold text-gray-700">Class ID</th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">Classroom</th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">Time</th>
              </tr>
            </thead>
            <tbody>
              {BOOKED_CLASSES.map((cls, i) => (
                <tr key={cls.id} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                  <td className="px-4 py-2 text-gray-600">{cls.id}</td>
                  <td className="px-4 py-2 text-gray-600">{cls.classroom}</td>
                  <td className="px-4 py-2 text-gray-600">{cls.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex gap-2 p-4 border-t border-gray-200">
            <button className="px-4 py-1.5 border border-gray-400 rounded text-sm text-gray-700 hover:bg-gray-50">
              Reschedule
            </button>
            <button className="px-4 py-1.5 border border-red-400 rounded text-sm text-red-500 hover:bg-red-50">
              Cancel Booking
            </button>
            <button
              onClick={() => navigate('/class-booking')}
              disabled={!membership.canBookClass}
              title={!membership.canBookClass ? membership.description : ''}
              className="px-4 py-1.5 border border-green-500 rounded text-sm text-green-600 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Browse New Class
            </button>
            <button
              onClick={() => navigate('/workout-plan')}
              className="px-4 py-1.5 border border-gray-400 rounded text-sm text-gray-700 hover:bg-gray-50"
            >
              Workout Plan
            </button>
          </div>
        </div>

        {/* System Notifications */}
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gray-100 border-b border-gray-300 px-4 py-2 text-sm font-medium text-gray-700">
            System Notifications
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-2 font-semibold text-gray-700">Date/Time</th>
                <th className="text-left px-4 py-2 font-semibold text-gray-700">Content</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((msg, i) => {
                const isSelected = selectedNotif === i;
                const isFlagged = flaggedNotifs.has(i);
                const rowClass = isSelected ? 'bg-blue-50' : isFlagged ? 'bg-yellow-50' : i % 2 === 1 ? 'bg-gray-50' : '';
                return (
                  <tr key={i} onClick={() => setSelectedNotif(i)} className={`cursor-pointer ${rowClass} hover:bg-blue-50`}>
                    <td className={`px-4 py-2 whitespace-nowrap ${isFlagged ? 'font-medium text-yellow-800' : 'text-gray-600'}`}>{msg.datetime}</td>
                    <td className={`px-4 py-2 ${isFlagged ? 'font-medium text-yellow-800' : 'text-gray-600'}`}>{msg.content}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex justify-between p-4 border-t border-gray-200">
            <button
              onClick={() => {
                if (selectedNotif === null) return;
                setFlaggedNotifs(prev => {
                  const next = new Set(prev);
                  next.has(selectedNotif) ? next.delete(selectedNotif) : next.add(selectedNotif);
                  return next;
                });
              }}
              className="px-4 py-1.5 border border-gray-400 rounded text-sm text-gray-700 hover:bg-gray-50"
            >
              Flag
            </button>
            <button
              onClick={() => {
                if (selectedNotif === null) return;
                setFlaggedNotifs(prev => {
                  const next = new Set();
                  prev.forEach(idx => { if (idx < selectedNotif) next.add(idx); else if (idx > selectedNotif) next.add(idx - 1); });
                  return next;
                });
                setNotifications(prev => prev.filter((_, i) => i !== selectedNotif));
                setSelectedNotif(null);
              }}
              className="px-4 py-1.5 border border-red-400 rounded text-sm text-red-500 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MemberPanel;
