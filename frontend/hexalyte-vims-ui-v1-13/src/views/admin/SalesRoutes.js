import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { createAxiosInstance } from 'api/axiosInstance';

const BASE_URL = 'https://api.test.hexalyte.com/v1/';
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function SalesRoutes() {
  const [routes, setRoutes] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editRoute, setEditRoute] = useState(null);
  const [form, setForm] = useState({ RouteName: '', Area: '', AssignedRepID: '', VisitDay: '', Notes: '' });

  const api = createAxiosInstance();

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await api.get(`${BASE_URL}salesroutes`);
      setRoutes(res.data.routes || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get(`${BASE_URL}user`);
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
        await api.put(`${BASE_URL}salesroutes/${editRoute.RouteID}`, form);
      } else {
        await api.post(`${BASE_URL}salesroutes`, form);
      }
      Swal.fire({ icon: 'success', title: editRoute ? 'Route Updated!' : 'Route Created!', timer: 1500, showConfirmButton: false });
      setShowModal(false); fetchRoutes();
    } catch (err) {
      Swal.fire('Error', err?.response?.data?.message || 'Failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    const { isConfirmed } = await Swal.fire({ title: 'Delete this route?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#e53e3e' });
    if (!isConfirmed) return;
    await api.delete(`${BASE_URL}salesroutes/${id}`);
    fetchRoutes();
  };

  const dayColor = { Monday: 'bg-blue-100 text-blue-700', Tuesday: 'bg-green-100 text-green-700', Wednesday: 'bg-yellow-100 text-yellow-700', Thursday: 'bg-orange-100 text-orange-700', Friday: 'bg-purple-100 text-purple-700', Saturday: 'bg-pink-100 text-pink-700', Sunday: 'bg-red-100 text-red-700' };

  return (
    <div className="px-4 md:px-10 py-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Sales Routes</h2>
          <p className="text-gray-500 text-sm mt-1">Manage sales rep routes and territories</p>
        </div>
        <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow">
          + Add Route
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {routes.length === 0 ? (
            <div className="col-span-3 text-center py-20 text-gray-400">No routes found. Create your first sales route.</div>
          ) : routes.map(route => (
            <div key={route.RouteID} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{route.RouteName}</h3>
                  <p className="text-gray-500 text-sm">{route.Area || 'No area specified'}</p>
                </div>
                {route.VisitDay && <span className={`px-2 py-1 rounded-full text-xs font-semibold ${dayColor[route.VisitDay] || 'bg-gray-100 text-gray-700'}`}>{route.VisitDay}</span>}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <span>{route.salesRep ? `${route.salesRep.firstname} ${route.salesRep.lastname}` : <span className="text-gray-400 italic">Unassigned</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" /></svg>
                  <span>{route.customers?.length || 0} Customers</span>
                </div>
                {route.Notes && <p className="text-gray-400 text-xs italic mt-2">{route.Notes}</p>}
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => openEdit(route)} className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-1.5 rounded-lg text-sm font-medium">Edit</button>
                <button onClick={() => handleDelete(route.RouteID)} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-1.5 rounded-lg text-sm font-medium">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-6">{editRoute ? 'Edit Route' : 'New Sales Route'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Route Name *</label>
                <input required value={form.RouteName} onChange={e => setForm(f => ({...f, RouteName: e.target.value}))} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="e.g. Colombo North" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area / Territory</label>
                <input value={form.Area} onChange={e => setForm(f => ({...f, Area: e.target.value}))} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="e.g. Pettah, Maradana" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Sales Rep</label>
                <select value={form.AssignedRepID} onChange={e => setForm(f => ({...f, AssignedRepID: e.target.value}))} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <option value="">-- Select Rep --</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.firstname} {u.lastname}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visit Day</label>
                <select value={form.VisitDay} onChange={e => setForm(f => ({...f, VisitDay: e.target.value}))} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <option value="">-- Select Day --</option>
                  {DAYS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={form.Notes} onChange={e => setForm(f => ({...f, Notes: e.target.value}))} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" rows={2} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold">{editRoute ? 'Update' : 'Create'} Route</button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
