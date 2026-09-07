import { useState, useEffect, useCallback } from 'react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { getEnquiries, getStats, updateEnquiryStatus, deleteEnquiry } from '../utils/api'
import type { Enquiry, EnquiryStats } from '../types'
import './admin.css'

const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || ''

const STATUS_OPTIONS = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED']
const USER_TYPE_FILTERS = ['ALL', 'STUDENT', 'CUSTOMER', 'OTHER']
const STATUS_FILTERS = ['ALL', 'NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED']

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function exportCSV(enquiries: Enquiry[]) {
  const headers = ['Name', 'Email', 'Phone', 'Type', 'Interest', 'Status', 'Date']
  const rows = enquiries.map(e => [
    e.name, e.email, e.phone, e.userType, e.interest, e.status, formatDate(e.createdAt)
  ])
  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'enquiries.csv'; a.click()
  URL.revokeObjectURL(url)
}

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [tokenInput, setTokenInput] = useState('')
  const [loginError, setLoginError] = useState('')

  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [stats, setStats] = useState<EnquiryStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [userTypeFilter, setUserTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Enquiry | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params: Record<string, string> = {}
      if (search) params.search = search
      if (userTypeFilter !== 'ALL') params.userType = userTypeFilter
      if (statusFilter !== 'ALL') params.status = statusFilter

      const [eRes, sRes] = await Promise.all([getEnquiries(params), getStats()])
      setEnquiries(eRes.data)
      setStats(sRes.data)
    } catch {
      setError('Failed to load data. Check that the backend is running.')
    } finally {
      setLoading(false)
    }
  }, [search, userTypeFilter, statusFilter])

  useEffect(() => {
    if (authed) fetchData()
  }, [authed, fetchData])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (tokenInput === ADMIN_TOKEN) {
      setAuthed(true)
      setLoginError('')
    } else {
      setLoginError('Invalid admin token. Check your VITE_ADMIN_TOKEN.')
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateEnquiryStatus(id, status)
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: status as Enquiry['status'] } : e))
      if (selectedEnquiry?.id === id) setSelectedEnquiry(prev => prev ? { ...prev, status: status as Enquiry['status'] } : null)
    } catch {
      alert('Failed to update status.')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteEnquiry(deleteTarget.id)
      setEnquiries(prev => prev.filter(e => e.id !== deleteTarget.id))
      setStats(prev => prev ? { ...prev, total: prev.total - 1 } : null)
      setDeleteTarget(null)
    } catch {
      alert('Failed to delete enquiry.')
    }
  }

  const shouldReduceMotion = useReducedMotion()

  const staggerContainer: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.04,
      },
    },
  }

  const staggerItem: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
    },
  }

  // ── LOGIN GATE ──
  if (!authed) {
    return (
      <div className="admin-login">
        <motion.div 
          className="admin-login-card"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔐</div>
          <h1>Admin Access</h1>
          <p>Enter your admin token to access the dashboard.</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin token"
              value={tokenInput}
              onChange={e => setTokenInput(e.target.value)}
              id="admin-token-input"
            />
            {loginError && <p className="admin-login-error">{loginError}</p>}
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Unlock Dashboard
            </button>
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--lines)' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem', padding: '0.5rem' }}
                onClick={() => {
                  setTokenInput(ADMIN_TOKEN || 'dronetv_admin_secret_2026')
                  setAuthed(true)
                  setLoginError('')
                }}
              >
                Quick Demo Access (Auto-fill Token)
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    )
  }

  // ── DASHBOARD ──
  return (
    <div className="admin-page">
      <motion.div 
        className="container"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="admin-header" variants={staggerItem}>
          <div>
            <h1>Enquiry Dashboard</h1>
            <p>Manage and track all incoming leads</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button className="export-btn" onClick={() => exportCSV(enquiries)}>
              ⬇ Export CSV
            </button>
            <button className="btn-secondary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }} onClick={() => setAuthed(false)}>
              Logout
            </button>
          </div>
        </motion.div>

        {/* KPI Cards */}
        {stats && (
          <motion.div className="kpi-grid" variants={staggerItem}>
            <div className="kpi-card">
              <div className="kpi-label">Total Leads</div>
              <div className="kpi-value">{stats.total}</div>
            </div>
            <div className="kpi-card accent">
              <div className="kpi-label">New</div>
              <div className="kpi-value">{stats.new}</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Contacted</div>
              <div className="kpi-value">{stats.contacted}</div>
            </div>
            <div className="kpi-card sage">
              <div className="kpi-label">In Progress</div>
              <div className="kpi-value">{stats.inProgress}</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">Closed</div>
              <div className="kpi-value">{stats.closed}</div>
            </div>
          </motion.div>
        )}

        {/* Toolbar */}
        <motion.div className="admin-toolbar" variants={staggerItem}>
          <input
            className="search-input"
            type="search"
            placeholder="Search by name, email, or interest..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="admin-search"
          />
          <div className="filter-group">
            {USER_TYPE_FILTERS.map(f => (
              <button key={f} className={`filter-btn ${userTypeFilter === f ? 'active' : ''}`} onClick={() => setUserTypeFilter(f)}>
                {f === 'ALL' ? 'All Types' : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <div className="filter-group">
            {STATUS_FILTERS.map(f => (
              <button key={f} className={`filter-btn ${statusFilter === f ? 'active' : ''}`} onClick={() => setStatusFilter(f)}>
                {f === 'ALL' ? 'All Status' : f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Error */}
        {error && <p style={{ color: '#f87171', marginBottom: '1rem' }}>{error}</p>}

        {/* Table */}
        <motion.div className="admin-table-wrap" variants={staggerItem}>
          {loading ? (
            <div className="admin-loading">Loading enquiries...</div>
          ) : enquiries.length === 0 ? (
            <div className="admin-empty">No enquiries found matching your filters.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name / Email</th>
                  <th>Phone</th>
                  <th>Type</th>
                  <th>Interest</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map(e => (
                  <tr key={e.id}>
                    <td className="td-name">
                      <strong>{e.name}</strong>
                      <span>{e.email}</span>
                    </td>
                    <td>{e.phone}</td>
                    <td><span className="usertype-badge">{e.userType}</span></td>
                    <td style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.interest}</td>
                    <td>
                      <select
                        className="status-select"
                        value={e.status}
                        onChange={ev => handleStatusChange(e.id, ev.target.value)}
                        id={`status-${e.id}`}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatDate(e.createdAt)}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button className="action-btn action-btn-view" onClick={() => setSelectedEnquiry(e)}>View</button>
                      <button className="action-btn action-btn-delete" onClick={() => setDeleteTarget(e)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      </motion.div>

      {/* Detail Modal */}
      {selectedEnquiry && (
        <div className="modal-overlay" onClick={() => setSelectedEnquiry(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Enquiry Details</h3>
              <button className="modal-close" onClick={() => setSelectedEnquiry(null)}>×</button>
            </div>
            {(['name', 'email', 'phone', 'userType', 'interest', 'message', 'status', 'createdAt'] as const).map(field => (
              <div key={field} className="modal-field">
                <div className="modal-field-label">{field.replace(/([A-Z])/g, ' $1').toUpperCase()}</div>
                <div className="modal-field-value">
                  {field === 'createdAt' ? formatDate(selectedEnquiry[field]) : String(selectedEnquiry[field])}
                </div>
              </div>
            ))}
            <div className="modal-actions">
              <select
                className="status-select"
                value={selectedEnquiry.status}
                onChange={e => handleStatusChange(selectedEnquiry.id, e.target.value)}
              >
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
              <button className="btn-secondary" style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem' }} onClick={() => setSelectedEnquiry(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal confirm-dialog" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon">🗑️</div>
            <h3>Delete Enquiry?</h3>
            <p>
              This will permanently delete the enquiry from <strong>{deleteTarget.name}</strong>.
              This action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button className="btn-secondary" style={{ padding: '0.65rem 1.5rem' }} onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn-danger" onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
