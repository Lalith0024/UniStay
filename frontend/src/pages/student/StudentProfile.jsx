import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Clock,
  Briefcase,
  IdCard,
  Hash,
  ChevronRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import config from '../../config';

const API_BASE_URL = config.API_URL;

const InfoField = ({ icon: Icon, label, value, field, editable = true, type = 'text', isEditing, editedData, onEdit }) => (
  <div className="relative">
    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-700 shadow-sm transition-all duration-300">
      <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400">
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-1">{label}</p>
        {isEditing && editable ? (
          <input
            type={type}
            value={editedData[field] || ''}
            onChange={(e) => onEdit(field, e.target.value)}
            className="w-full px-0 py-1 border-b-2 border-primary-500 bg-transparent text-slate-900 dark:text-white focus:outline-none transition-all font-semibold"
          />
        ) : (
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
            {value || 'Not provided'}
          </p>
        )}
      </div>
    </div>
  </div>
);

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
      // API call to update profile would go here
      localStorage.setItem('user', JSON.stringify(editedData));
      setUser(editedData);
      setIsEditing(false);
      // Notify other components
      window.dispatchEvent(new Event('storage'));
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Dynamic Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-primary-600 dark:bg-primary-900 p-8 md:p-10 shadow-xl shadow-primary-500/20"
      >
        {/* Background Patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Sparkles size={120} className="text-white" />
          </div>
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar with Status Ring */}
            <div className="relative">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center overflow-hidden shadow-2xl">
                {user?.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={60} className="text-white/80" />
                )}
              </div>
              <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-emerald-400 border-4 border-primary-500 dark:border-primary-900 flex items-center justify-center shadow-lg">
                <CheckCircle2 size={16} className="text-white" />
              </div>
            </div>

            {/* Profile Core Info */}
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                {user?.name || 'Student Name'}
              </h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
                  <Clock size={14} />
                  Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
                  <Shield size={14} />
                  {user?.status || 'Active'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Center */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-primary-600 font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-primary-600 font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : <><Save size={18} /> Save Details</>}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/20 backdrop-blur-md text-white font-bold text-sm hover:bg-white/30 transition-all"
                >
                  <X size={18} />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'personal', label: 'Personal Info', icon: User, desc: 'Identity & Contacts' },
            { id: 'academic', label: 'Academic Details', icon: GraduationCap, desc: 'College Records' },
            { id: 'hostel', label: 'Hostel Info', icon: Home, desc: 'Room & Allotment' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${activeTab === tab.id
                ? 'bg-white dark:bg-neutral-800 shadow-xl shadow-slate-200/50 dark:shadow-black/20 text-primary-600 dark:text-primary-400'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-neutral-800/50'
                }`}
            >
              <div className={`p-3 rounded-xl ${activeTab === tab.id ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-100 dark:bg-neutral-800'}`}>
                <tab.icon size={20} />
              </div>
              <div className="text-left overflow-hidden">
                <p className="font-bold text-sm">{tab.label}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{tab.desc}</p>
              </div>
              {activeTab === tab.id && <ChevronRight size={18} className="ml-auto" />}
            </button>
          ))}
        </div>

        {/* Dynamic Detail Panes */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {activeTab === 'personal' && (
                <>
                  <InfoField icon={User} label="Full Name" value={user?.name} field="name" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={Mail} label="Official Email" value={user?.email} field="email" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={Phone} label="Mobile Number" value={user?.phone} field="phone" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={Calendar} label="Date of Birth" value={user?.dob} field="dob" type="date" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={MapPin} label="Permanent Address" value={user?.address} field="address" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={User} label="Guardian Name" value={user?.guardianName} field="guardianName" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={Phone} label="Guardian Contact" value={user?.guardianPhone} field="guardianPhone" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={Mail} label="Guardian Email" value={user?.guardianEmail} field="guardianEmail" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                </>
              )}

              {activeTab === 'academic' && (
                <>
                  <InfoField icon={GraduationCap} label="Primary Department" value={user?.department} field="department" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={Calendar} label="Academic Year" value={user?.year} field="year" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={Hash} label="Institutional Roll No." value={user?.rollNumber} field="rollNumber" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={Briefcase} label="Current Degree" value={user?.course} field="course" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={IdCard} label="Current Semester" value={user?.semester} field="semester" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={Building} label="Admission Batch" value={user?.batch} field="batch" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                </>
              )}

              {activeTab === 'hostel' && (
                <>
                  <InfoField icon={Home} label="Room Assignment" value={user?.room} field="room" editable={false} isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={Building} label="Assigned block" value={user?.block} field="block" editable={false} isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={Calendar} label="Allotment Date" value={user?.checkInDate} field="checkInDate" type="date" editable={false} isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-700 shadow-sm flex flex-col justify-center">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-2">Account Status</p>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-sm font-bold text-slate-800 dark:text-white uppercase">{user?.status || 'Active'}</span>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
