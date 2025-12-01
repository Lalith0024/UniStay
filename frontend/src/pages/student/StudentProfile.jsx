import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
  Camera,
  Building,
  GraduationCap,
  Home,
  Shield,
  Clock
} from 'lucide-react';
import API_BASE_URL from '../../config';

export default function StudentProfile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      // In a real scenario, fetch from API using user ID
      // For now, using localStorage data
      setUser(userData);
      setEditedData(userData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleEdit = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // API call to update profile
      // await fetch(`${API_BASE_URL}/api/students/${user._id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editedData)
      // });

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(editedData));
      setUser(editedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData(user);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const InfoField = ({ icon: Icon, label, value, field, editable = true, type = 'text' }) => (
    <div className="group relative">
      <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-neutral-800/50 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all">
        <div className="p-2 rounded-lg bg-white dark:bg-neutral-700 shadow-sm">
          <Icon size={20} className="text-primary-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</p>
          {isEditing && editable ? (
            <input
              type={type}
              value={editedData[field] || ''}
              onChange={(e) => handleEdit(field, e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          ) : (
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {value || 'Not provided'}
            </p>
          )}
        </div>
        {isEditing && editable && (
          <Edit2 size={14} className="text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-teal-500 p-8 md:p-12"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-teal-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Profile Picture */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 shadow-2xl flex items-center justify-center overflow-hidden">
              {user?.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-6xl md:text-7xl font-bold text-white">
                  {user?.name?.charAt(0) || 'S'}
                </span>
              )}
            </div>
            {isEditing && (
              <button className="absolute bottom-2 right-2 p-3 rounded-full bg-white text-primary-600 shadow-lg hover:shadow-xl transition-all">
                <Camera size={18} />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {user?.name || 'Student Name'}
              </h1>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
                <Shield size={16} />
                {user?.status || 'Active'}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span className="text-sm">{user?.email || 'email@example.com'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Home size={16} />
                <span className="text-sm">Room {user?.room || 'N/A'} • Block {user?.block || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span className="text-sm">Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-600 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <Edit2 size={18} />
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-600 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{saving ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white font-semibold hover:bg-white/30 transition-all"
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-neutral-800 rounded-2xl">
        {['personal', 'academic', 'hostel'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === tab
                ? 'bg-white dark:bg-neutral-700 text-primary-600 dark:text-primary-400 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Info
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-neutral-800 rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200 dark:border-neutral-700"
      >
        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField icon={User} label="Full Name" value={user?.name} field="name" />
            <InfoField icon={Mail} label="Email Address" value={user?.email} field="email" />
            <InfoField icon={Phone} label="Phone Number" value={user?.phone} field="phone" />
            <InfoField icon={Calendar} label="Date of Birth" value={user?.dob} field="dob" type="date" />
            <InfoField icon={MapPin} label="Address" value={user?.address} field="address" />
            <InfoField icon={User} label="Guardian Name" value={user?.guardianName} field="guardianName" />
            <InfoField icon={Phone} label="Guardian Phone" value={user?.guardianPhone} field="guardianPhone" />
            <InfoField icon={Mail} label="Guardian Email" value={user?.guardianEmail} field="guardianEmail" />
          </div>
        )}

        {activeTab === 'academic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField icon={GraduationCap} label="Department" value={user?.department} field="department" />
            <InfoField icon={Calendar} label="Year" value={user?.year} field="year" />
            <InfoField icon={Building} label="Roll Number" value={user?.rollNumber} field="rollNumber" />
            <InfoField icon={GraduationCap} label="Course" value={user?.course} field="course" />
            <InfoField icon={Calendar} label="Semester" value={user?.semester} field="semester" />
            <InfoField icon={Building} label="Batch" value={user?.batch} field="batch" />
          </div>
        )}

        {activeTab === 'hostel' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField icon={Home} label="Room Number" value={user?.room} field="room" editable={false} />
            <InfoField icon={Building} label="Block" value={user?.block} field="block" editable={false} />
            <InfoField icon={Calendar} label="Check-in Date" value={user?.checkInDate} field="checkInDate" type="date" editable={false} />
            <InfoField icon={Shield} label="Status" value={user?.status} field="status" editable={false} />
          </div>
        )}
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
              <Calendar size={24} />
            </div>
            <span className="text-3xl font-bold">0</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Active Complaints</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
              <Calendar size={24} />
            </div>
            <span className="text-3xl font-bold">0</span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Leave Requests</h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
              <Clock size={24} />
            </div>
            <span className="text-3xl font-bold">
              {user?.createdAt ? Math.floor((Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)) : 0}
            </span>
          </div>
          <h3 className="text-sm font-medium opacity-90">Days in Hostel</h3>
        </motion.div>
      </div>
    </div>
  );
}
