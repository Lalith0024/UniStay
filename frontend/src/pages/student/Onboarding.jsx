import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import {
  User,
  Camera,
  Shield,
  CheckCircle,
  ChevronRight,
  Loader,
  Building,
  GraduationCap,
  Sparkles,
  MapPin,
  RefreshCcw,
  Zap,
  Lock,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sun,
  Moon,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { config } from '../../config';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeContext';

const API_BASE_URL = config.API_URL;

// --- Sub-Components ---

const RecaptchaMock = ({ onVerify }) => {
  const { theme } = useTheme();
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    if (verified) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVerified(true);
      onVerify(true);
    }, 1200);
  };

  return (
    <div className={`backdrop-blur-md p-4 rounded-2xl border shadow-xl inline-flex items-center gap-4 select-none transition-all ${theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-slate-100 border-slate-300'
      }`}>
      <div
        onClick={handleVerify}
        className={`w-8 h-8 rounded-lg border-2 transition-all flex items-center justify-center cursor-pointer ${verified
          ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/30'
          : theme === 'dark' ? 'bg-white/5 border-white/20 hover:border-white/40' : 'bg-white border-slate-400 hover:border-slate-600'
          }`}
      >
        {loading && <div className={`w-4 h-4 rounded-full border-2 border-t-primary-500 animate-spin ${theme === 'dark' ? 'border-white/20' : 'border-slate-400'}`} />}
        {verified && <CheckCircle size={20} className="text-white" />}
      </div>
      <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white/90' : 'text-slate-800'}`}>Verify Identity</span>
      <div className="ml-4 flex flex-col items-center">
        <Sparkles size={20} className="text-blue-400 mb-0.5" />
        <span className={`text-[10px] uppercase tracking-tighter font-bold ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'}`}>Secure</span>
      </div>
    </div>
  );
};

const SuccessParticles = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full bg-primary-500/30"
        initial={{ x: "50%", y: "50%", scale: 0, opacity: 1 }}
        animate={{
          x: `${Math.random() * 100}%`,
          y: `${Math.random() * 100}%`,
          scale: Math.random() * 3,
          opacity: 0
        }}
        transition={{
          duration: 2 + Math.random() * 2,
          ease: "easeOut",
          repeat: Infinity,
          delay: Math.random() * 5
        }}
      />
    ))}
  </div>
);

export default function StudentOnboarding() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const webcamRef = useRef(null);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: '',
    year: '1st',
    bio: '',
    image: null
  });

  // UI State
  const [isVerified, setIsVerified] = useState(false);
  const [allocating, setAllocating] = useState(false);
  const [allocationResult, setAllocationResult] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    const initOnboarding = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (!storedUser._id && !storedUser.email) {
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/api/students?search=${storedUser.email}`);
        if (res.data && res.data.data && res.data.data.length > 0) {
          const student = res.data.data.find(s => s.email === storedUser.email);
          if (student) {
            const mergedUser = { ...storedUser, studentId: student._id, ...student };
            localStorage.setItem('user', JSON.stringify(mergedUser));
            setUser(mergedUser);
            setFormData(prev => ({
              ...prev,
              name: student.name || '',
              phone: student.phone || '',
              department: student.department || '',
              year: student.year || '1st',
              bio: student.bio || '',
              image: student.image || null
            }));

            if (student.room) {
              navigate('/student/dashboard');
              return;
            }
          } else {
            setUser(storedUser);
          }
        } else {
          setUser(storedUser);
        }
      } catch (err) {
        console.error("Init Error:", err);
        setUser(storedUser);
      }
      setLoading(false);
    };
    initOnboarding();
  }, [navigate]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setCameraActive(false);
    setFormData(prev => ({ ...prev, image: imageSrc }));
    toast.success("Identity profile captured!");
  }, [webcamRef]);

  const handleUpdateProfile = async () => {
    if (!formData.department) {
      toast.warn("Please select your department");
      return;
    }

    setSubmitting(true);
    try {
      const studentId = user.studentId || user._id;
      const res = await axios.patch(`${API_BASE_URL}/api/students/${studentId}`, {
        phone: formData.phone,
        department: formData.department,
        year: formData.year,
        bio: formData.bio,
        image: formData.image,
        status: 'Active'
      });

      if (res.data) {
        const updatedUser = { ...user, ...res.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        toast.success("Profile saved successfully.");
        setStep(4);
      }
    } catch (error) {
      console.error(error);
      toast.error("Process failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAllocateRoom = async () => {
    setAllocating(true);
    try {
      const studentId = user.studentId || user._id;
      await new Promise(r => setTimeout(r, 2000));
      const res = await axios.post(`${API_BASE_URL}/api/students/${studentId}/allocate-room`);
      if (res.data.success) {
        setAllocationResult(res.data.data.room);
        const updatedUser = { ...user, ...res.data.data.student };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        toast.success("Room matched successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Allocation failed.");
    } finally {
      setAllocating(false);
    }
  };

  const finishOnboarding = () => {
    toast.success("Welcome aboard, " + user.name);
    navigate('/student/dashboard');
  };

  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-black' : 'bg-slate-50'}`}>
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-t-2 border-primary-500 animate-spin" />
        <Zap size={20} className="text-primary-500 animate-pulse absolute inset-0 m-auto" />
      </div>
    </div>
  );

  const departments = [
    { id: 'Computer Science', icon: Zap, color: 'text-blue-400' },
    { id: 'Information Technology', icon: Lock, color: 'text-cyan-400' },
    { id: 'Electronics', icon: Sparkles, color: 'text-purple-400' },
    { id: 'Mechanical', icon: Building, color: 'text-orange-400' },
    { id: 'Civil', icon: MapPin, color: 'text-amber-600' },
    { id: 'Architecture', icon: Sparkles, color: 'text-indigo-400' },
    { id: 'Business', icon: GraduationCap, color: 'text-emerald-400' }
  ];

  return (
    <div className={`min-h-screen transition-all duration-500 ${theme === 'dark' ? 'bg-[#050505] text-white' : 'bg-slate-50 text-slate-900'} selection:bg-primary-500/30 font-sans relative overflow-hidden`}>
      {/* Theme Toggle Button */}
      <div className="fixed top-8 left-8 z-50">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-2xl border backdrop-blur-xl transition-all group shadow-2xl ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-lg'
            }`}
        >
          {theme === 'dark' ? <Sun size={20} className="text-primary-400" /> : <Moon size={20} className="text-primary-600" />}
        </button>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary-900/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10 min-h-screen flex flex-col items-center justify-center">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-md mb-6 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white/60' : 'bg-white border-slate-200 text-slate-500 shadow-sm'
            }`}>
            <Zap size={14} className="text-primary-400" />
            <span className="text-[10px] uppercase font-black tracking-[0.2em]">Step {step} of 5</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-4 bg-gradient-to-b from-slate-900 to-slate-500 dark:from-white dark:to-white/50 bg-clip-text text-transparent">
            Welcome to UniStay
          </h1>
          <p className={`${theme === 'dark' ? 'text-white/40' : 'text-slate-600'} max-w-md mx-auto leading-relaxed font-medium`}>
            Let's get your official resident profile set up to grant you access to the hostal facilities.
          </p>
        </motion.div>

        <div className="w-full max-w-2xl relative">
          <AnimatePresence mode="wait">
            {/* Step 1: Identity */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className={`glass-panel p-8 md:p-12 rounded-[2.5rem] border shadow-2xl relative overflow-hidden group ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'
                  }`}
              >
                <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-20">
                  <User size={120} className="text-primary-500" />
                </div>
                <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <User size={20} />
                  </div>
                  Personal Details
                </h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'} ml-1`}>Phone Number</label>
                    <input type="tel" placeholder="+91 9876543210" value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-6 py-4 rounded-2xl border transition-all outline-none ${theme === 'dark'
                        ? 'bg-white/5 border-white/10 text-white focus:border-primary-500'
                        : 'bg-white border-slate-200 text-slate-900 focus:border-primary-500 shadow-sm'
                        }`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'} ml-1`}>Short Bio</label>
                    <textarea rows={3} placeholder="Tell your roommates about yourself..." value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className={`w-full px-6 py-4 rounded-2xl border transition-all outline-none resize-none ${theme === 'dark'
                        ? 'bg-white/5 border-white/10 text-white focus:border-primary-500'
                        : 'bg-white border-slate-200 text-slate-900 focus:border-primary-500 shadow-sm'
                        }`}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['Tech enthusiast', 'Music lover', 'Skater', 'Bookworm'].map(tag => (
                        <button key={tag} onClick={() => setFormData(prev => ({ ...prev, bio: prev.bio ? `${prev.bio}, ${tag}` : tag }))}
                          className={`text-[10px] px-3 py-1 rounded-full border transition-all font-bold ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white/40 hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-primary-600'
                            }`}
                        >+ {tag}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-12 flex justify-end">
                  <button disabled={!formData.phone} onClick={() => setStep(2)}
                    className="flex items-center gap-4 px-10 py-5 bg-primary-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-30 shadow-xl shadow-primary-500/20"
                  >Next <ChevronRight size={18} /></button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Face Scan */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className={`glass-panel p-8 md:p-12 rounded-[2.5rem] border shadow-2xl ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}
              >
                <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Camera size={20} />
                  </div>
                  Identity Verification
                </h2>
                <div className="flex flex-col items-center">
                  <div className="relative w-64 h-64 rounded-[3.5rem] overflow-hidden border-2 border-dashed border-primary-500/40 p-2">
                    <div className="absolute inset-0 bg-primary-500/10 animate-scan pointer-events-none z-20" />
                    {capturedImage ? (
                      <img src={capturedImage} alt="Face" className="w-full h-full object-cover rounded-[3rem]" />
                    ) : cameraActive ? (
                      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-full object-cover rounded-[3rem]" />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center rounded-[3rem] ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'}`}>
                        <Camera size={48} className="text-primary-500/20" />
                      </div>
                    )}
                  </div>
                  <div className="mt-8 flex gap-4">
                    {!cameraActive && !capturedImage && (
                      <button onClick={() => setCameraActive(true)} className="px-8 py-4 bg-primary-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary-500/20">Activate Camera</button>
                    )}
                    {cameraActive && (
                      <button onClick={capture} className="w-16 h-16 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-xl ring-4 ring-primary-500/10"><Camera size={24} /></button>
                    )}
                    {capturedImage && (
                      <button onClick={() => { setCapturedImage(null); setCameraActive(true); }} className={`px-6 py-3 rounded-xl font-black text-xs uppercase border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-sm'
                        }`}><RefreshCcw size={16} className="inline mr-2" /> Retake</button>
                    )}
                  </div>
                </div>
                <div className="mt-12 flex justify-between">
                  <button onClick={() => setStep(1)} className="text-slate-500 font-black text-xs uppercase tracking-widest flex items-center gap-2"><ArrowLeft size={14} /> Back</button>
                  <button disabled={!capturedImage} onClick={() => setStep(3)} className="px-10 py-5 bg-primary-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary-500/20">Confirm <ChevronRight size={18} className="inline ml-2" /></button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Academic */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className={`glass-panel p-8 md:p-12 rounded-[2.5rem] border shadow-2xl ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}
              >
                <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <GraduationCap size={20} />
                  </div>
                  Academic Setup
                </h2>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'} ml-1`}>Department</label>
                    <div className="grid grid-cols-2 gap-4">
                      {departments.map(dept => {
                        const Icon = dept.icon;
                        const isSelected = formData.department === dept.id;
                        return (
                          <button key={dept.id} onClick={() => setFormData({ ...formData, department: dept.id })}
                            className={`flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all duration-300 group ${isSelected
                              ? 'bg-primary-500 border-primary-500 text-white shadow-xl shadow-primary-500/25'
                              : theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-white/20' : 'bg-white border-slate-200 hover:border-primary-500 text-slate-900 shadow-sm'
                              }`}
                          >
                            <div className={`p-3 rounded-2xl transition-all ${isSelected ? 'bg-white/20' : theme === 'dark' ? 'bg-white/5' : 'bg-slate-50'}`}>
                              <Icon size={24} className={isSelected ? 'text-white' : 'text-primary-500'} />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-white' : 'text-slate-500'}`}>{dept.id}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className={`text-xs font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white/40' : 'text-slate-500'} ml-1`}>Current Year</label>
                    <div className="flex gap-4">
                      {['1st', '2nd', '3rd', '4th'].map(yr => (
                        <button key={yr} onClick={() => setFormData({ ...formData, year: yr })}
                          className={`flex-1 py-4 rounded-2xl border font-black text-xs uppercase tracking-widest transition-all ${formData.year === yr
                            ? 'bg-primary-500 text-white border-primary-500 shadow-xl shadow-primary-500/25'
                            : theme === 'dark' ? 'bg-white/5 border-white/5 text-white/40' : 'bg-white border-slate-200 text-slate-500'
                            }`}
                        >{yr}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-12 flex justify-between items-center">
                  <button onClick={() => setStep(2)} className="text-slate-500 font-black text-xs uppercase tracking-widest flex items-center gap-2"><ArrowLeft size={14} /> Back</button>
                  <button disabled={!formData.department || submitting} onClick={handleUpdateProfile}
                    className="px-10 py-5 bg-primary-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary-500/20"
                  >{submitting ? <Loader size={18} className="animate-spin" /> : 'Finalize Profile'}</button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Room Allocation */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className={`glass-panel p-8 md:p-12 rounded-[2.5rem] border shadow-2xl relative overflow-hidden transition-all text-center ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'
                  }`}
              >
                {!allocationResult ? (
                  <div className="py-12">
                    <motion.div animate={{ rotate: [0, 5, -5, 0], y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }}
                      className="w-32 h-32 bg-primary-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-primary-500/30 mb-8 shadow-xl"
                    >
                      <Building size={64} className="text-primary-500" />
                    </motion.div>
                    <h2 className={`text-4xl font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Room Allocation</h2>
                    <p className={`max-w-sm mx-auto leading-relaxed mb-10 font-medium ${theme === 'dark' ? 'text-white/40' : 'text-slate-600'}`}>
                      Our automated system is processing your academic and personal profile to find the best available quarters.
                    </p>
                    <button onClick={handleAllocateRoom} disabled={allocating}
                      className="px-16 py-6 bg-primary-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary-500/30 hover:scale-105 active:scale-95 transition-all w-full"
                    >
                      {allocating ? <span className="flex items-center justify-center gap-3"><Loader size={18} className="animate-spin" /> Allocating...</span> : "Find My Room"}
                    </button>
                  </div>
                ) : (
                  <div className="py-12 relative z-10">
                    <SuccessParticles />
                    <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} className="w-40 h-40 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-emerald-500/40 border-8 border-white dark:border-neutral-900">
                      <CheckCircle size={80} className="text-white" />
                    </motion.div>
                    <h2 className={`text-5xl font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Congratulations!</h2>
                    <p className={`text-xl mb-12 font-bold ${theme === 'dark' ? 'text-white/40' : 'text-slate-600'}`}>You've been assigned to:</p>
                    <div className="p-12 rounded-[3.5rem] bg-gradient-to-br from-primary-600 to-indigo-700 text-white shadow-2xl shadow-primary-500/40 mb-12 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                        <Home size={160} />
                      </div>
                      <div className="relative z-10">
                        <div className="text-sm font-black uppercase tracking-[0.5em] mb-4 text-primary-200">Resident Suite</div>
                        <div className="text-7xl font-black mb-4 tracking-tighter">Room {allocationResult.number}</div>
                        <div className="text-2xl font-black opacity-80">Block {allocationResult.block}</div>
                      </div>
                    </div>
                    <button onClick={() => setStep(5)} className="px-12 py-6 bg-white dark:bg-neutral-800 text-primary-600 dark:text-primary-400 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-all border border-slate-100 dark:border-neutral-700 w-full">Final Confirmation <ChevronRight size={20} className="inline ml-2" /></button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 5: Final Protocol */}
            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className={`glass-panel p-8 md:p-12 rounded-[2.5rem] border shadow-2xl text-center ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}
              >
                <div className="w-20 h-20 bg-primary-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-xl shadow-primary-500/20">
                  <Shield size={40} />
                </div>
                <h2 className={`text-4xl font-black mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>One Last Step</h2>
                <p className={`max-w-md mx-auto leading-relaxed mb-12 font-medium ${theme === 'dark' ? 'text-white/40' : 'text-slate-600'}`}>
                  Verification complete. Solve the final security layer to activate your resident dashboard and start your journey.
                </p>
                <div className="flex justify-center mb-12">
                  <RecaptchaMock onVerify={setIsVerified} />
                </div>
                <button disabled={!isVerified} onClick={finishOnboarding}
                  className={`w-full py-6 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl ${isVerified ? 'bg-primary-500 text-white shadow-primary-500/40 hover:scale-105' : 'bg-slate-200 text-slate-400 grayscale opacity-50'
                    }`}
                >Enter Dashboard <ArrowRight size={20} className="inline ml-2" /></button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="mt-16 flex gap-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`h-2 rounded-full transition-all duration-500 ${step >= i ? 'w-12 bg-primary-500 shadow-lg shadow-primary-500/40' : 'w-4 bg-slate-200 dark:bg-white/5'}`} />
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .animate-scan {
          animation: scan 3s infinite;
          border-bottom: 2px solid #3b82f6;
        }
        .glass-panel {
          background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 1)'};
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
        }
      `}} />
    </div>
  );
}
