import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Camera,
  Building, GraduationCap, Home, Shield, Clock, Briefcase, IdCard, Hash,
  ChevronRight, Sparkles, CheckCircle2
} from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import { toast } from 'react-toastify';

const InfoField = ({ icon: Icon, label, value, field, editable = true, type = 'text', isEditing, editedData, onEdit }) => (
  <div className="relative group">
    <div className={`flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 shadow-sm ${isEditing && editable ? 'bg-white dark:bg-zinc-900 border-primary-200 dark:border-primary-900/50 shadow-md ring-2 ring-primary-500/10' : 'bg-slate-50 dark:bg-zinc-900/50 border-slate-100 dark:border-zinc-800'}`}>
      <div className={`p-3 rounded-xl ${isEditing && editable ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400' : 'bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 group-hover:text-primary-500'}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-zinc-500 mb-1">{label}</p>
        {isEditing && editable ? (
          <input
            type={type}
            value={editedData[field] || ''}
            onChange={(e) => onEdit(field, e.target.value)}
            className="w-full px-0 py-1 border-b-2 border-primary-500 bg-transparent text-slate-900 dark:text-white focus:outline-none transition-all font-bold text-sm"
          />
        ) : (
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
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
  const fileInputRef = useRef(null);

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
      // Simulate API Call
      await new Promise(r => setTimeout(r, 1000));
      localStorage.setItem('user', JSON.stringify(editedData));
      setUser(editedData);
      setIsEditing(false);
      window.dispatchEvent(new Event('storage'));
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData(user);
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleEdit('image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader title="My Profile" description="Manage your personal information, academic details, and hostel assignment." />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-zinc-950 p-8 md:p-10 shadow-xl"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Sparkles size={120} className="text-primary-500" />
          </div>
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <div className={`w-32 h-32 rounded-full border-4 border-white/10 flex items-center justify-center overflow-hidden shadow-2xl transition-all ${isEditing ? 'group-hover:border-primary-500' : ''}`}>
                {editedData?.image ? (
                  <img src={editedData.image} alt={editedData.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={60} className="text-white/50" />
                )}
                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white mb-1" />
                    <span className="text-xs text-white font-bold">Change</span>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" />
              <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-emerald-500 border-4 border-slate-900 dark:border-neutral-900 flex items-center justify-center shadow-lg">
                <CheckCircle2 size={16} className="text-white" />
              </div>
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
                {editedData?.name || 'Student Name'}
              </h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider">
                  <IdCard size={14} className="text-primary-400" />
                  {editedData?.rollNumber || 'No Roll No'}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider">
                  <Home size={14} className="text-primary-400" />
                  Room {editedData?.room || 'N/A'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm shadow-lg hover:scale-105 transition-all">
                <Edit2 size={18} /> Edit Profile
              </button>
            ) : (
              <>
                <button onClick={handleCancel} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-all">
                  <X size={18} /> Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-500 text-white font-bold text-sm shadow-lg shadow-primary-500/25 hover:scale-105 transition-all disabled:opacity-50">
                  {saving ? 'Saving...' : <><Save size={18} /> Save</>}
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'personal', label: 'Personal Info', icon: User, desc: 'Identity & Contacts' },
            { id: 'academic', label: 'Academic Details', icon: GraduationCap, desc: 'College Records' },
            { id: 'hostel', label: 'Hostel Info', icon: Home, desc: 'Room & Allotment' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${activeTab === tab.id ? 'bg-primary-50 dark:bg-primary-900/10 shadow-sm border border-primary-100 dark:border-primary-900/20' : 'bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 hover:border-slate-200'}`}
            >
              <div className={`p-3 rounded-xl transition-colors ${activeTab === tab.id ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' : 'bg-slate-50 dark:bg-zinc-800/50 text-slate-500 group-hover:text-primary-500'}`}>
                <tab.icon size={20} />
              </div>
              <div className="text-left overflow-hidden">
                <p className={`font-bold text-sm transition-colors ${activeTab === tab.id ? 'text-primary-700 dark:text-primary-400' : 'text-slate-700 dark:text-zinc-300 group-hover:text-primary-600'}`}>{tab.label}</p>
                <p className="text-[10px] uppercase font-bold text-slate-400">{tab.desc}</p>
              </div>
              {activeTab === tab.id && <ChevronRight size={18} className="ml-auto text-primary-500" />}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {activeTab === 'personal' && (
                <>
                  <InfoField icon={User} label="Full Name" value={user?.name} field="name" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={Mail} label="Official Email" value={user?.email} field="email" type="email" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={Phone} label="Mobile Number" value={user?.phone} field="phone" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={Calendar} label="Date of Birth" value={user?.dob} field="dob" type="date" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <div className="md:col-span-2">
                    <InfoField icon={MapPin} label="Permanent Address" value={user?.address} field="address" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  </div>
                  <InfoField icon={User} label="Guardian Name" value={user?.guardianName} field="guardianName" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={Phone} label="Guardian Contact" value={user?.guardianPhone} field="guardianPhone" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={Mail} label="Guardian Email" value={user?.guardianEmail} field="guardianEmail" type="email" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                </>
              )}

              {activeTab === 'academic' && (
                <>
                  <InfoField icon={GraduationCap} label="Primary Department" value={user?.department} field="department" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={Briefcase} label="Current Degree" value={user?.course} field="course" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={Calendar} label="Academic Year" value={user?.year} field="year" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={IdCard} label="Current Semester" value={user?.semester} field="semester" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={Hash} label="Institutional Roll No." value={user?.rollNumber} field="rollNumber" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={Building} label="Admission Batch" value={user?.batch} field="batch" isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                </>
              )}

              {activeTab === 'hostel' && (
                <>
                  <InfoField icon={Home} label="Room Assignment" value={user?.room} field="room" editable={false} isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={Building} label="Assigned block" value={user?.block} field="block" editable={false} isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <InfoField icon={Calendar} label="Allotment Date" value={user?.checkInDate} field="checkInDate" type="date" editable={false} isEditing={isEditing} editedData={editedData} onEdit={handleEdit} />
                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm flex flex-col justify-center">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-zinc-500 mb-2">Account Status</p>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">{user?.status || 'Active'}</span>
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
