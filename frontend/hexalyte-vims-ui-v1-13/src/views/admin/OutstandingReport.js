import React, { useState, useEffect, useCallback } from 'react';
import { createAxiosInstance } from 'api/axiosInstance';

const BASE_URL = 'https://api.test.hexalyte.com/v1/';

export default function OutstandingReport() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({});
  const [repPerf, setRepPerf] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('outstanding');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [filterRep, setFilterRep] = useState('');
  const [users, setUsers] = useState([]);

  const api = createAxiosInstance();

  const fetchOutstanding = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterRep) params.salesRepId = filterRep;
      const res = await api.get(`${BASE_URL}outstanding/balances`, { params });
      setData(res.data.outstanding || []);
      setSummary(res.data.summary || {});
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [filterRep]);

  const fetchRepPerf = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const res = await api.get(`${BASE_URL}outstanding/rep-performance`, { params: { year: now.getFullYear(), month: now.getMonth() + 1 } });
      setRepPerf(res.data.reps || []);
    } catch (e) {}
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get(`${BASE_URL}user`);
      setUsers(res.data.users || res.data || []);
    } catch (e) {}
  };

  useEffect(() => { fetchUsers(); }, []);
  useEffect(() => { if (tab === 'outstanding') fetchOutstanding(); else fetchRepPerf(); }, [tab, fetchOutstanding]);

  const filtered = data.filter(d => {
    const q = search.toLowerCase();
    return !q || (d.Name || '').toLowerCase().includes(q) || (d.CompanyName || '').toLowerCase().includes(q);
  });

  const typeColor = { Retailer: 'bg-blue-100 text-blue-700', Wholesaler: 'bg-green-100 text-green-700', Agent: 'bg-purple-100 text-purple-700', Direct: 'bg-orange-100 text-orange-700' };

  return (
    <div className="px-4 md:px-10 py-6 w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Distribution Reports</h2>
        <p className="text-gray-500 text-sm mt-1">Outstanding balances & sales rep performance</p>
      </div>

      <div className="flex gap-2 mb-6 border-b">
        {[{ key: 'outstanding', label: 'Outstanding Balances' }, { key: 'performance', label: 'Rep Performance' }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-5 py-2 font-medium text-sm border-b-2 transition ${tab === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'outstanding' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-red-500">
              <p className="text-xs text-gray-500 uppercase font-semibold">Total Outstanding</p>
              <p className="text-2xl font-bold text-red-600 mt-1">Rs. {parseFloat(summary.TotalOutstanding || 0).toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-orange-500">
              <p className="text-xs text-gray-500 uppercase font-semibold">Overdue Amount</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">Rs. {parseFloat(summary.TotalOverdue || 0).toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500">
              <p className="text-xs text-gray-500 uppercase font-semibold">Customers with Balance</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{summary.TotalCustomers || 0}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4 mb-4 flex flex-wrap gap-3">
            <input type="text" placeholder="Search customer..." value={search} onChange={e => setSearch(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-300" />
            <select value={filterRep} onChange={e => setFilterRep(e.target.value)} className="border rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option value="">All Reps</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.firstname} {u.lastname}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-xl shadow overflow-hidden">
            {loading ? <div className="text-center py-16 text-gray-400">Loading...</div> :
            filtered.length === 0 ? <div className="text-center py-16 text-gray-400">No outstanding balances found.</div> :
            filtered.map(c => (
              <div key={c.CustomerID} className="border-b">
                <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50" onClick={() => setExpanded(expanded === c.CustomerID ? null : c.CustomerID)}>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">{c.Name}</span>
                        {c.CustomerType && <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColor[c.CustomerType] || 'bg-gray-100'}`}>{c.CustomerType}</span>}
                        {c.OverdueAmount > 0 && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">Overdue</span>}
                      </div>
                      <p className="text-sm text-gray-400">{c.CompanyName} · {c.Phone} {c.SalesRep ? `· Rep: ${c.SalesRep.firstname} ${c.SalesRep.lastname}` : ''} {c.Route ? `· Route: ${c.Route.RouteName}` : ''}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">Rs. {parseFloat(c.TotalOutstanding).toLocaleString()}</p>
                    {c.OverdueAmount > 0 && <p className="text-xs text-orange-600">Overdue: Rs. {parseFloat(c.OverdueAmount).toLocaleString()}</p>}
                    <p className="text-xs text-gray-400">{c.Orders.length} invoice{c.Orders.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                {expanded === c.CustomerID && (
                  <div className="bg-gray-50 px-5 pb-4">
                    <table className="w-full text-sm">
                      <thead><tr className="text-gray-500 text-xs uppercase">
                        <th className="text-left py-2">Order</th><th className="text-left py-2">Order Date</th>
                        <th className="text-left py-2">Total</th><th className="text-left py-2">Paid</th>
                        <th className="text-left py-2">Balance</th><th className="text-left py-2">Due Date</th>
                        <th className="text-left py-2">Status</th>
                      </tr></thead>
                      <tbody>
                        {c.Orders.map(o => (
                          <tr key={o.OrderID} className="border-t border-gray-200">
                            <td className="py-2 text-blue-600 font-medium">#{o.OrderID}</td>
                            <td className="py-2">{new Date(o.OrderDate).toLocaleDateString()}</td>
                            <td className="py-2">Rs. {parseFloat(o.TotalAmount).toLocaleString()}</td>
                            <td className="py-2 text-green-600">Rs. {parseFloat(o.PaidAmount).toLocaleString()}</td>
                            <td className="py-2 font-bold text-red-600">Rs. {parseFloat(o.Balance).toLocaleString()}</td>
                            <td className="py-2">{o.DueDate ? new Date(o.DueDate).toLocaleDateString() : '—'}</td>
                            <td className="py-2">{o.IsOverdue ? <span className="text-red-600 font-medium">Overdue ({o.DaysOverdue}d)</span> : <span className="text-green-600">On Time</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'performance' && (
        <>
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {loading ? <div className="text-center py-16 text-gray-400">Loading...</div> :
            repPerf.length === 0 ? <div className="text-center py-16 text-gray-400">No data available</div> :
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  {['Rank', 'Sales Rep', 'Orders', 'Total Sales', 'Collected', 'Outstanding', 'Collection %'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {repPerf.map((r, i) => {
                  const pct = r.TotalSales > 0 ? ((r.TotalCollected / r.TotalSales) * 100).toFixed(1) : 0;
                  return (
                    <tr key={r.RepID} className="border-b hover:bg-gray-50">
                      <td className="px-5 py-3 font-bold text-gray-400">#{i + 1}</td>
                      <td className="px-5 py-3"><p className="font-semibold text-gray-800">{r.Name}</p><p className="text-xs text-gray-400">{r.Email}</p></td>
                      <td className="px-5 py-3 font-medium">{r.OrderCount}</td>
                      <td className="px-5 py-3 font-bold text-gray-800">Rs. {parseFloat(r.TotalSales).toLocaleString()}</td>
                      <td className="px-5 py-3 font-bold text-green-600">Rs. {parseFloat(r.TotalCollected).toLocaleString()}</td>
                      <td className="px-5 py-3 font-bold text-red-500">Rs. {parseFloat(r.Outstanding).toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full ${pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }}></div></div>
                          <span className="text-xs font-medium">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>}
          </div>
        </>
      )}
    </div>
  );
}
