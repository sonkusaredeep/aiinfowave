import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { Search, Filter, Download, ExternalLink } from 'lucide-react';
import styles from './InternshipAdminPage.module.css';
import { API_BASE_URL } from '../../config';

const API_URL = `${API_BASE_URL}/api/internships`;


export default function InternshipAdminPage() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, shortlisted: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, [roleFilter, statusFilter, search]);

  const fetchApplications = async () => {
    try {
      const { data } = await axios.get(API_URL, {
        params: { role: roleFilter, status: statusFilter, search }
      });
      setApplications(data);
    } catch (error) {
      toast.error('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/stats`);
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/${id}/status`, { status: newStatus });
      toast.success('Status updated!');
      fetchApplications();
      fetchStats();
    } catch (error) {
      toast.error('Failed to update status.');
    }
  };

  return (
    <div className={styles.adminPage}>
      <Toaster position="top-right" />
      
      <header className={styles.header}>
        <div className={styles.inner}>
          <h1>Internship Applications</h1>
          <p>Manage and track candidates</p>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.inner}>
          
          {/* STATS CARDS */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Total Applications</h3>
              <p>{stats.total}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Pending</h3>
              <p className={styles.textWarning}>{stats.pending}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Shortlisted</h3>
              <p className={styles.textSuccess}>{stats.shortlisted}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Rejected</h3>
              <p className={styles.textDanger}>{stats.rejected}</p>
            </div>
          </div>

          {/* CONTROLS */}
          <div className={styles.controls}>
            <div className={styles.searchBox}>
              <Search size={18} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search name or email..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className={styles.filters}>
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="">All Roles</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="MERN Stack Developer">MERN Stack Developer</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="AI/ML Intern">AI/ML Intern</option>
                <option value="Data Analyst">Data Analyst</option>
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className={styles.tableContainer}>
            {loading ? (
              <div className={styles.loading}>Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className={styles.empty}>No applications found.</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Role</th>
                    <th>College/Year</th>
                    <th>Resume</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <div className={styles.candidateInfo}>
                          <strong>{app.fullName}</strong>
                          <span>{app.email}</span>
                          <span>{app.phone}</span>
                        </div>
                      </td>
                      <td>{app.internshipRole}</td>
                      <td>
                        <div className={styles.collegeInfo}>
                          <span>{app.college}</span>
                          <span className={styles.muted}>{app.currentYear}</span>
                        </div>
                      </td>
                      <td>
                        <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className={styles.resumeLink}>
                          View <ExternalLink size={14} />
                        </a>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles['badge' + app.applicationStatus.replace(' ', '')]}`}>
                          {app.applicationStatus}
                        </span>
                      </td>
                      <td>
                        <select 
                          className={styles.statusSelect}
                          value={app.applicationStatus}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview Scheduled">Interview</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
