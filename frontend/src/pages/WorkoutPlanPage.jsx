import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const DIFFICULTY_COLOURS = {
  beginner:     'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced:     'bg-red-100 text-red-700',
};

const WorkoutPlanPage = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await axiosInstance.get('/api/workout-plans/my', {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setPlan(res.data);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load workout plan.');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchPlan();
  }, [user]);

  if (loading) return (
    <div className="min-h-screen bg-gym-cream flex items-center justify-center text-gray-500 text-sm">
      Loading...
    </div>
  );

  return (
    <div className="min-h-screen bg-gym-cream">
      <div className="px-8 py-5 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800">My Workout Plan</h1>
        <p className="text-sm text-gray-500 mt-1">Your personalised plan assigned by your trainer.</p>
      </div>

      <div className="px-8 py-8">
        {error ? (
          <div className="bg-white border border-gray-300 rounded-lg p-8 text-center text-gray-500 text-sm">
            {error}
          </div>
        ) : plan ? (
          <div className="max-w-3xl space-y-6">

            {/* Plan Header */}
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-gray-100 border-b border-gray-300 px-4 py-2 text-sm font-medium text-gray-700">
                Plan Details
              </div>
              <div className="p-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <span className="w-32 font-medium text-gray-700">Title</span>
                  <span>{plan.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-32 font-medium text-gray-700">Difficulty</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${DIFFICULTY_COLOURS[plan.difficulty] || ''}`}>
                    {plan.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-32 font-medium text-gray-700">Duration</span>
                  <span>{plan.durationWeeks} week{plan.durationWeeks !== 1 ? 's' : ''}</span>
                </div>
                {plan.notes && (
                  <div className="flex items-start gap-3">
                    <span className="w-32 font-medium text-gray-700">Notes</span>
                    <span>{plan.notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Exercises */}
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-gray-100 border-b border-gray-300 px-4 py-2 text-sm font-medium text-gray-700">
                Exercises ({plan.exercises.length})
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-2 font-semibold text-gray-700">#</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-700">Exercise</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-700">Sets</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-700">Reps</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-700">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.exercises.map((ex, i) => (
                    <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                      <td className="px-4 py-2 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-2 text-gray-700 font-medium">{ex.name}</td>
                      <td className="px-4 py-2 text-gray-600">{ex.sets}</td>
                      <td className="px-4 py-2 text-gray-600">{ex.reps}</td>
                      <td className="px-4 py-2 text-gray-500">{ex.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        ) : null}
      </div>
    </div>
  );
};

export default WorkoutPlanPage;
