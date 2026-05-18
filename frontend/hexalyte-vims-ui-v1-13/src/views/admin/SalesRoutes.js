import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { createAxiosInstance } from 'api/axiosInstance';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DAY_STYLE = {
  Monday:    { pill: 'bg-blue-50 text-blue-700 ring-blue-200',    dot: 'bg-blue-500' },
  Tuesday:   { pill: 'bg-green-50 text-green-700 ring-green-200', dot: 'bg-green-500' },
  Wednesday: { pill: 'bg-yellow-50 text-yellow-700 ring-yellow-200', dot: 'bg-yellow-500' },
  Thursday:  { pill: 'bg-orange-50 text-orange-700 ring-orange-200', dot: 'bg-orange-500' },
  Friday:    { pill: 'bg-purple-50 text-purple-700 ring-purple-200', dot: 'bg-purple-500' },
  Saturday:  { pill: 'bg-pink-50 text-pink-700 ring-pink-200',    dot: 'bg-pink-500' },
  Sunday:    { pill: 'bg-red-50 text-red-700 ring-red-200',       dot: 'bg-red-500' },
};

const DayBadge = ({ day }) => {
  const s = DAY_STYLE[day] || { pill: 'bg-gray-100 text-gray-600 ring-gray-200', dot: 'bg-gray-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {day}
    </span>
  );
};

export default function SalesRoutes() {
  const [routes, setRoutes]     = useState([]);
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editRoute, setEditRoute] = useState(null);
  const [search, setSearch]     = useState('');
  const [filterDay, setFilterDay] = useState('');
  const [form, setForm] = useState({ RouteName: '', Area: '', AssignedRepID: '', VisitDay: '', Notes: '' });

  const api = createAxiosInstance();

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await api.get('salesroutes');
      setRoutes(res.data.routes || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('user');
      setUsers(res.data.users || res.data || []);
    } catch (e) {}
  };

  useEffect(() => { fetchRoutes(); fetchUsers(); }, []);

  const openAdd = () => {
    setEditRoute(null);
    setForm({ RouteName: '', Area: '', AssignedRepID: '', VisitDay: '', Notes: '' });
    setShowModal(true);
  };

  const openEdit = (route) => {
    setEditRoute(route);
    setForm({ RouteName: route.RouteName, Area: route.Area || '', AssignedRepID: route.AssignedRepID || '', VisitDay: route.VisitDay || '', Notes: route.Notes || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editRoute) {
        await api.put(`salesroutes/${editRoute.RouteID}`, form);
      } else {
        await api.post('salesroutes', form);
      }
      Swal.fire({ icon: 'success', title: editRoute ? 'Route Updated!' : 'Route Created!', timer: 1500, showConfirmButton: false });
      setShowModal(false);
      fetchRoutes();
    } catch (err) {
      Swal.fire('Error', err?.response?.data?.message || 'Failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Delete this route?', icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#d33', cancelButtonColor: '#6b7280', confirmButtonText: 'Yes, delete it!'
    });
    if (!isConfirmed) return;
    await api.delete(`salesroutes/${id}`);
    fetchRoutes();
  };

  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const filtered = routes.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.RouteName.toLowerCase().includes(q) || (r.Area || '').toLowerCase().includes(q);
    const matchDay    = !filterDay || r.VisitDay === filterDay;
    return matchSearch && matchDay;
  });

  return (
    <>
      <div className="w-full min-h-screen p-6">
        <div className="w-full mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sales Routes</h1>
              <p className="mt-1 text-sm text-gray-500">Manage sales rep routes and customer territories</p>
            </div>
            <button
              onClick={openAdd}
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Route
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by route name or area..."
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="min-w-[160px]">
                <select
                  value={filterDay}
                  onChange={e => setFilterDay(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">All Days</option>
                  {DAYS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => { setSearch(''); setFilterDay(''); }}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </button>
                <button
                  onClick={fetchRoutes}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
            {(search || filterDay) && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">Active filters:</span>
                {search && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Search: "{search}"
                    <button onClick={() => setSearch('')} className="ml-1 text-blue-600 hover:text-blue-800">×</button>
                  </span>
                )}
                {filterDay && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Day: {filterDay}
                    <button onClick={() => setFilterDay('')} className="ml-1 text-purple-600 hover:text-purple-800">×</button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Summary Cards */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-6 py-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Routes',   value: routes.length,                                             color: 'text-blue-600',   bg: 'bg-blue-100',   icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
                { label: 'Assigned',       value: routes.filter(r => r.AssignedRepID).length,               color: 'text-green-600',  bg: 'bg-green-100',  icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                { label: 'Unassigned',     value: routes.filter(r => !r.AssignedRepID).length,              color: 'text-orange-600', bg: 'bg-orange-100', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
                { label: `Today (${todayName.slice(0,3)})`, value: routes.filter(r => r.VisitDay === todayName).length, color: 'text-indigo-600', bg: 'bg-indigo-100', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
              ].map((c, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
                  <div className={`p-2.5 rounded-md ${c.bg}`}>
                    <svg className={`h-5 w-5 ${c.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={c.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">{c.label}</p>
                    <p className="text-xl font-bold text-gray-900">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Route Cards Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-52">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm flex flex-col items-center justify-center py-20">
              <svg className="w-14 h-14 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-base font-semibold text-gray-500">No routes found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or create a new sales route</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(route => (
                <div key={route.RouteID} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-200 overflow-hidden">
                  {/* Card top accent */}
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                          {route.RouteName[0].toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-base leading-tight">{route.RouteName}</h3>
                          <p className="text-gray-400 text-xs mt-0.5">{route.Area || 'No area specified'}</p>
                        </div>
                      </div>
                      {route.VisitDay && <DayBadge day={route.VisitDay} />}
                    </div>

                    <div className="space-y-2.5 text-sm border-t border-gray-50 pt-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {route.salesRep
                          ? <span className="font-medium text-gray-700">{route.salesRep.firstname} {route.salesRep.lastname}</span>
                          : <span className="text-gray-400 italic text-xs">Unassigned</span>}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                        </svg>
                        <span className="text-gray-600">{route.customers?.length || 0} Customers</span>
                      </div>
                      {route.Notes && (
                        <p className="text-gray-400 text-xs italic bg-gray-50 rounded px-2 py-1">{route.Notes}</p>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4 pt-3 border-t border-gray-50">
                      <button
                        onClick={() => openEdit(route)}
                        className="flex-1 inline-flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{flexShrink:0}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(route.RouteID)}
                        className="flex-1 inline-flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{flexShrink:0}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* ── Add / Edit Route Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 overflow-y-auto p-4 pt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-md"
          >
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">

              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  {editRoute ? 'Edit Route' : 'New Sales Route'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-5">

                  {/* Section: Route Info */}
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Route Details
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Route Name <span className="text-red-500">*</span></label>
                    <input
                      required
                      value={form.RouteName}
                      onChange={e => setForm(f => ({ ...f, RouteName: e.target.value }))}
                      placeholder="e.g. Colombo North"
                      className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Area / Territory</label>
                    <input
                      value={form.Area}
                      onChange={e => setForm(f => ({ ...f, Area: e.target.value }))}
                      placeholder="e.g. Pettah, Maradana"
                      className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                  </div>

                  {/* Section: Assignment */}
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2 pt-1">
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Assignment
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sales Rep</label>
                      <select
                        value={form.AssignedRepID}
                        onChange={e => setForm(f => ({ ...f, AssignedRepID: e.target.value }))}
                        className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white"
                      >
                        <option value="">— Select Rep —</option>
                        {users.map(u => <option key={u.id} value={u.id}>{u.firstname} {u.lastname}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Visit Day</label>
                      <select
                        value={form.VisitDay}
                        onChange={e => setForm(f => ({ ...f, VisitDay: e.target.value }))}
                        className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white"
                      >
                        <option value="">— Select Day —</option>
                        {DAYS.map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      rows={2}
                      value={form.Notes}
                      onChange={e => setForm(f => ({ ...f, Notes: e.target.value }))}
                      placeholder="Optional notes…"
                      className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none"
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors focus:outline-none flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {editRoute ? 'Update Route' : 'Create Route'}
                  </button>
                </div>
              </form>

            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
