import React, { useEffect, useState } from 'react';
import { Video, Plus, Calendar, Clock, CheckCircle2, AlertCircle, Users, Check } from 'lucide-react';
import { apiFetch } from '../../lib/api.ts';

export function TeacherLiveClasses() {
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, { status: string; remarks?: string }>>({});
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // New Class Form
  const [title, setTitle] = useState('');
  const [programId, setProgramId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('16:00');
  const [endTime, setEndTime] = useState('17:30');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/mcl-studio');
  const [description, setDescription] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const loadData = () => {
    apiFetch<{ liveClasses: any[] }>('/api/teacher/live-classes')
      .then(res => {
        setClasses(res.liveClasses || []);
        if (res.liveClasses && res.liveClasses.length > 0 && !selectedClass) {
          selectClass(res.liveClasses[0]);
        }
      })
      .catch(() => {});

    apiFetch<{ students: any[] }>('/api/teacher/students')
      .then(res => setStudents(res.students || []))
      .catch(() => {});

    apiFetch<{ programs: any[] }>('/api/public/programs')
      .then(res => {
        setPrograms(res.programs || []);
        if (res.programs?.[0]) setProgramId(res.programs[0].id);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectClass = async (cls: any) => {
    setSelectedClass(cls);
    setMsg(null);
    try {
      const res = await apiFetch<{ attendance: any[] }>(`/api/teacher/live-classes/${cls.id}/attendance`);
      const map: Record<string, { status: string; remarks?: string }> = {};
      (res.attendance || []).forEach(att => {
        map[att.studentId] = { status: att.status, remarks: att.remarks };
      });
      setAttendanceRecords(map);
    } catch (e) {
      setAttendanceRecords({});
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !programId || !meetingLink) return;

    setScheduling(true);
    setMsg(null);

    try {
      await apiFetch('/api/teacher/live-classes', {
        method: 'POST',
        body: JSON.stringify({
          title,
          programId,
          date,
          startTime,
          endTime,
          meetingLink,
          description,
        }),
      });

      setShowScheduleModal(false);
      setTitle('');
      setDescription('');
      loadData();
      setMsg('Live class successfully scheduled!');
    } catch (err: any) {
      alert(err.message || 'Failed to schedule class.');
    } finally {
      setScheduling(false);
    }
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass) return;
    setSavingAttendance(true);
    setMsg(null);

    const records = students.map(st => ({
      studentId: st.id,
      studentName: st.name,
      status: attendanceRecords[st.id]?.status || 'present',
      remarks: attendanceRecords[st.id]?.remarks || '',
    }));

    try {
      await apiFetch(`/api/teacher/live-classes/${selectedClass.id}/attendance`, {
        method: 'POST',
        body: JSON.stringify({ records }),
      });
      setMsg('Attendance records successfully updated and saved in ledger!');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to record attendance');
    } finally {
      setSavingAttendance(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Live Classes & Attendance Roster
          </h1>
          <p className="text-xs text-slate-500">
            Schedule studio critiques and mark attendance (Present, Absent, Late, Excused).
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Class</span>
        </button>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Classes List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Your Classes</h3>

          <div className="space-y-2">
            {classes.map(cls => {
              const isSelected = selectedClass?.id === cls.id;
              return (
                <button
                  key={cls.id}
                  onClick={() => selectClass(cls)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs transition space-y-1.5 ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 line-clamp-1">{cls.title}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-100 text-slate-700">
                      {cls.status}
                    </span>
                  </div>
                  <div className="text-indigo-700 font-semibold">{cls.programTitle}</div>
                  <div className="text-slate-500">{cls.date} • {cls.startTime} - {cls.endTime}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Attendance Sheet (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          {selectedClass ? (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                    {selectedClass.programTitle}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">{selectedClass.title}</h2>
                  <div className="text-xs text-slate-500 mt-1">
                    Scheduled: {selectedClass.date} • {selectedClass.startTime} - {selectedClass.endTime} IST
                  </div>
                </div>

                <a
                  href={selectedClass.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Open Video Room</span>
                </a>
              </div>

              {/* Attendance Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span>Student Attendance Sheet</span>
                  </h3>
                  <button
                    onClick={handleSaveAttendance}
                    disabled={savingAttendance}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition"
                  >
                    {savingAttendance ? 'Saving...' : 'Save Attendance Records'}
                  </button>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Student Name</th>
                        <th className="px-4 py-3">Attendance Status</th>
                        <th className="px-4 py-3">Mentor Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.map(st => {
                        const currentStatus = attendanceRecords[st.id]?.status || 'present';
                        const currentRemarks = attendanceRecords[st.id]?.remarks || '';

                        return (
                          <tr key={st.id} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 font-semibold text-slate-900">
                              {st.name}
                            </td>

                            <td className="px-4 py-3">
                              <select
                                value={currentStatus}
                                onChange={e => {
                                  setAttendanceRecords({
                                    ...attendanceRecords,
                                    [st.id]: {
                                      status: e.target.value,
                                      remarks: currentRemarks,
                                    },
                                  });
                                }}
                                className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              >
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                                <option value="late">Late</option>
                                <option value="excused">Excused</option>
                              </select>
                            </td>

                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={currentRemarks}
                                onChange={e => {
                                  setAttendanceRecords({
                                    ...attendanceRecords,
                                    [st.id]: {
                                      status: currentStatus,
                                      remarks: e.target.value,
                                    },
                                  });
                                }}
                                placeholder="Optional note..."
                                className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 text-xs">
              Select a class from the list to view attendance.
            </div>
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-lg text-slate-900">Schedule New Live Studio Class</h3>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Class Topic / Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Masterclass on Breadboard Circuit Prototyping"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Program *</label>
                <select
                  value={programId}
                  onChange={e => setProgramId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                >
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Meeting Link (Google Meet / Zoom) *</label>
                <input
                  type="url"
                  required
                  value={meetingLink}
                  onChange={e => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/abc-defg-hij"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Agenda / Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Outline key topics or materials students should have ready..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={scheduling}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  {scheduling ? 'Scheduling...' : 'Schedule Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
