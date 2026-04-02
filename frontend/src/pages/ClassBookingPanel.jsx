import { useState } from 'react';

const MY_BOOKED = [
  { cls: 'Power Yoga',  vendor: 'Happy Yoga Studio',   date: 'Mar 24', time: '7:00 AM'  },
  { cls: 'HIIT Blast',  vendor: 'Iron Pulse Fitness',  date: 'Mar 25', time: '6:30 PM'  },
  { cls: 'Spin Cycle',  vendor: 'Knockout Club',        date: 'Mar 26', time: '8:00 AM'  },
  { cls: 'Core Crush',  vendor: 'Strength Roots Gym',  date: 'Mar 28', time: '12:00 PM' },
];

const AVAILABLE = [
  { cls: 'Boxing Basics',    vendor: 'Knockout Club',         date: 'Mar 24', time: '5:30 PM'  },
  { cls: 'Zumba Party',      vendor: 'Dance & Shine Studio',  date: 'Mar 25', time: '7:00 PM'  },
  { cls: 'Kettlebell Flow',  vendor: 'Iron Pulse Fitness',    date: 'Mar 26', time: '6:00 AM'  },
  { cls: 'Stretch & Restore',vendor: 'Happy Yoga Studio',     date: 'Mar 27', time: '1:00 PM'  },
  { cls: 'TRX Strength',     vendor: 'Strength Roots Gym',    date: 'Mar 28', time: '7:30 AM'  },
  { cls: 'Dance Cardio',     vendor: 'Dance & Shine Studio',  date: 'Mar 29', time: '11:00 AM' },
];

const ClassBookingPanel = () => {
  const [booked, setBooked]         = useState(MY_BOOKED);
  const [available, setAvailable]   = useState(AVAILABLE);
  const [selectedBooked, setSelectedBooked]     = useState(null);
  const [selectedAvailable, setSelectedAvailable] = useState(null);
  const [search, setSearch]         = useState('');

  const handleBook = () => {
    if (selectedAvailable === null) return;
    const cls = available[selectedAvailable];
    setBooked([...booked, cls]);
    setAvailable(available.filter((_, i) => i !== selectedAvailable));
    setSelectedAvailable(null);
  };

  const handleCancel = () => {
    if (selectedBooked === null) return;
    const cls = booked[selectedBooked];
    setAvailable([...available, cls]);
    setBooked(booked.filter((_, i) => i !== selectedBooked));
    setSelectedBooked(null);
  };

  const filtered = available.filter(
    (c) =>
      c.cls.toLowerCase().includes(search.toLowerCase()) ||
      c.vendor.toLowerCase().includes(search.toLowerCase())
  );

  const thClass = 'text-left px-4 py-2 font-semibold text-gray-700';
  const tdClass = 'px-4 py-2 text-gray-600';

  return (
    <div className="min-h-screen bg-gym-cream">
      {/* Hero */}
      <div className="px-8 py-5 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800">Class Booking</h1>
        <p className="text-sm text-gray-500 mt-1">
          Browse and book our weekly classes below. Questions? Call us at (555) 012-3456.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-8 py-8">

        {/* My Booked Classes */}
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-2">My Booked Classes</h2>
          <div className="border-b-2 border-gray-400 mb-3" />
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className={thClass}>Class</th>
                <th className={thClass}>Course Vendor</th>
                <th className={thClass}>Date</th>
                <th className={thClass}>Time</th>
              </tr>
            </thead>
            <tbody>
              {booked.map((c, i) => (
                <tr
                  key={i}
                  onClick={() => setSelectedBooked(i)}
                  className={`cursor-pointer ${selectedBooked === i ? 'bg-green-50' : i % 2 === 1 ? 'bg-gray-50' : ''} hover:bg-green-50`}
                >
                  <td className={tdClass}>{c.cls}</td>
                  <td className={tdClass}>{c.vendor}</td>
                  <td className={tdClass}>{c.date}</td>
                  <td className={tdClass}>{c.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex gap-2 mt-4">
            <button className="px-4 py-1.5 border border-gray-400 rounded text-sm text-gray-700 hover:bg-gray-50">
              Reschedule
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-1.5 border border-gray-400 rounded text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Available Classes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold text-gray-800">Available Classes</h2>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-gym-green w-40"
            />
          </div>
          <div className="border-b-2 border-gray-400 mb-3" />
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className={thClass}>Class</th>
                <th className={thClass}>Course Vendor</th>
                <th className={thClass}>Date</th>
                <th className={thClass}>Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={i}
                  onClick={() => setSelectedAvailable(available.indexOf(c))}
                  className={`cursor-pointer ${selectedAvailable === available.indexOf(c) ? 'bg-green-50' : i % 2 === 1 ? 'bg-gray-50' : ''} hover:bg-green-50`}
                >
                  <td className={tdClass}>{c.cls}</td>
                  <td className={tdClass}>{c.vendor}</td>
                  <td className={tdClass}>{c.date}</td>
                  <td className={tdClass}>{c.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <button
              onClick={handleBook}
              disabled={selectedAvailable === null}
              className="px-5 py-1.5 bg-gym-green text-white rounded text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Book Class
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClassBookingPanel;
