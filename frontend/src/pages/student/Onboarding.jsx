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
    countryCode: '+91',
    phone: '',
    department: '',
    year: '1st',
    bio: '',
    image: null
  });

  // Phone Validation Rules
  const phoneValidations = {
    '+1': { length: 10, placeholder: '2015550123' },  // US/Canada
    '+44': { length: 10, placeholder: '7123456789' }, // UK
    '+61': { length: 9, placeholder: '412345678' },   // Australia
    '+81': { length: 10, placeholder: '9012345678' }, // Japan
    '+91': { length: 10, placeholder: '9876543210' }, // India
  };

  const getRequiredLength = () => phoneValidations[formData.countryCode]?.length || 10;
  const isPhoneValid = formData.phone.length === getRequiredLength();

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
            let p_num = student.phone || '';
            let c_code = prev.countryCode;

            if (p_num) {
              if (p_num.includes(' ')) {
                const parts = p_num.split(' ');
                c_code = parts[0];
                p_num = parts[1];
              }
              const cleaned = p_num.replace(/\D/g, '');
              const reqLen = phoneValidations[c_code]?.length || 10;
              p_num = cleaned.length > reqLen ? cleaned.slice(-reqLen) : cleaned;
            }

            setFormData(prev => ({
              ...prev,
              name: student.name || '',
              countryCode: c_code,
              phone: p_num,
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
        phone: `${formData.countryCode} ${formData.phone}`,
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
    <div className={`min-h-screen transition-colors duration-700 ${theme === 'dark' ? 'bg-[#030305] text-slate-100' : 'bg-[#fafafa] text-slate-900'} font-sans relative flex`}>
      {/* Theme Toggle Button */}
      <div className="fixed top-8 left-8 z-50">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm ${theme === 'dark' ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white' : 'bg-white/80 border-slate-200 text-slate-500 hover:text-slate-900'
            }`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Left Column (Full Bleed Image) - Hidden on Mobile */}
      <div className={`hidden lg:flex w-1/2 relative bg-cover bg-center border-r ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'}`} style={{ backgroundImage: "url('/onboarding/student_lounge.jpg')" }}>
        {/* Subtle overlay for better contrast if needed later */}
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/40' : 'bg-black/10'}`}></div>
      </div>

      {/* Right Column (Interactive Form) */}
      <div className="w-full lg:w-1/2 min-h-screen py-10 px-6 sm:px-12 md:px-20 lg:px-24 xl:px-32 flex flex-col justify-center relative bg-transparent overflow-y-auto z-10">

        {/* Removed mobile ambient background effect per user request */}

        {/* Header Section */}
        <div className="mb-10 w-full mt-10">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border mb-5 shadow-sm ${theme === 'dark' ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white text-slate-500 border-slate-200'}`}>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`h-1.5 rounded-sm transition-all duration-500 ${step >= i ? 'w-4 bg-primary-500' : 'w-1.5 bg-slate-300 dark:bg-white/10'}`} />
              ))}
            </div>
            <span className="text-[10px] ml-2 font-bold uppercase tracking-widest">Step {step}/5</span>
          </div>
          <h1 className="font-sans font-black text-4xl sm:text-5xl tracking-tighter mb-3">
            Setup <span className="text-primary-600 dark:text-primary-400">Profile</span>
          </h1>
          <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} text-sm sm:text-base font-medium leading-relaxed`}>
            {step === 1 && "Let's start with your contact and personal information."}
            {step === 2 && "Position your face in the frame."}
            {step === 3 && "Tell us about your academic pursuits."}
            {step === 4 && "Initiating the room allocation sequence."}
            {step === 5 && "Clear the final bot check to enter your dashboard."}
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full relative">
          <AnimatePresence mode="wait">
            {/* Step 1: Identity */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="space-y-6">
                  <div>
                    <label className={`block text-xs font-bold mb-2 uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Phone Number</label>
                    <div className="flex gap-2">
                      <select
                        value={formData.countryCode}
                        onChange={(e) => {
                          const newCode = e.target.value;
                          setFormData({ ...formData, countryCode: newCode, phone: '' }); // Reset phone when country changes
                        }}
                        className={`px-4 py-4 rounded-xl border-2 transition-all duration-200 outline-none focus:border-primary-500 focus:bg-transparent min-w-[100px] font-medium ${theme === 'dark'
                          ? 'bg-[#0f0f13] border-white/5 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                      >
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+61">🇦🇺 +61</option>
                        <option value="+81">🇯🇵 +81</option>
                        <option value="+91">🇮🇳 +91</option>
                      </select>
                      <input type="tel" placeholder={phoneValidations[formData.countryCode]?.placeholder || "9876543210"} value={formData.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, ''); // Ensure only numeric characters
                          // Optional: prevent typing more than required length
                          const reqLen = getRequiredLength();
                          if (val.length <= reqLen) {
                            setFormData({ ...formData, phone: val });
                          }
                        }}
                        className={`w-full px-5 py-4 rounded-xl border-2 transition-all duration-200 outline-none focus:bg-transparent ${formData.phone.length > 0 && !isPhoneValid && theme === 'dark' ? 'border-red-500/50 focus:border-red-500' :
                          formData.phone.length > 0 && !isPhoneValid ? 'border-red-400 focus:border-red-500' :
                            theme === 'dark' ? 'bg-[#0f0f13] border-white/5 text-white placeholder-slate-600 focus:border-primary-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary-500'
                          }`}
                      />
                    </div>
                    {formData.phone.length > 0 && !isPhoneValid && (
                      <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1">
                        * Required length: {getRequiredLength()} digits (current: {formData.phone.length})
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={`block text-xs font-bold mb-2 uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Short Bio</label>
                    <textarea rows={4} placeholder="Tell your roommates about yourself..." value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className={`w-full px-5 py-4 rounded-xl border-2 transition-all duration-200 outline-none resize-none focus:border-primary-500 focus:bg-transparent ${theme === 'dark'
                        ? 'bg-[#0f0f13] border-white/5 text-white placeholder-slate-600'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                    />
                    <div className="flex flex-wrap gap-2 mt-3">
                      {['Tech enthusiast', 'Music lover', 'Skater', 'Bookworm'].map(tag => (
                        <button key={tag} onClick={() => setFormData(prev => ({ ...prev, bio: prev.bio ? `${prev.bio}, ${tag}` : tag }))}
                          className={`text-xs px-3.5 py-1.5 rounded-lg border transition-all font-medium ${theme === 'dark' ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20' : 'bg-white border-slate-200 text-slate-600 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50/50'
                            }`}
                        >+ {tag}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-10 flex justify-end">
                  <button disabled={!isPhoneValid} onClick={() => setStep(2)}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 text-white rounded-xl font-bold text-sm hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  >Continue <ChevronRight size={18} /></button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Face Scan */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="flex flex-col items-center">
                  <div className={`relative w-full max-w-sm aspect-square rounded-[3rem] overflow-hidden border-2 border-dashed p-1.5 transition-colors ${theme === 'dark' ? 'border-primary-500/30 bg-[#0f0f13]' : 'border-primary-400/50 bg-slate-50'}`}>
                    <div className="absolute inset-0 bg-primary-500/5 animate-scan pointer-events-none z-20 rounded-[3rem]" />
                    {capturedImage ? (
                      <img src={capturedImage} alt="Face" className="w-full h-full object-cover rounded-[2.5rem]" />
                    ) : cameraActive ? (
                      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-full object-cover rounded-[2.5rem]" />
                    ) : (
                      <div className={`w-full h-full flex flex-col items-center justify-center rounded-[2.5rem] ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                        <Camera size={40} className={`mb-3 ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`} />
                        <span className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>Camera Offline</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-8 flex gap-4 w-full max-w-sm justify-center">
                    {!cameraActive && !capturedImage && (
                      <button onClick={() => setCameraActive(true)} className={`w-full py-4 rounded-xl font-bold text-sm shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all ${theme === 'dark' ? 'bg-white border text-black' : 'bg-white border-2 border-slate-200 text-slate-800'}`}>Activate Camera</button>
                    )}
                    {cameraActive && (
                      <button onClick={capture} className="w-20 h-20 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-xl ring-8 ring-primary-500/20 active:scale-90 transition-all"><Camera size={32} /></button>
                    )}
                    {capturedImage && (
                      <button onClick={() => { setCapturedImage(null); setCameraActive(true); }} className={`px-6 py-3 rounded-xl font-bold text-xs uppercase border-2 transition-all flex items-center gap-2 ${theme === 'dark' ? 'bg-transparent border-white/20 text-slate-300 hover:text-white hover:border-white/50' : 'bg-white border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50'
                        }`}><RefreshCcw size={16} /> Retake</button>
                    )}
                  </div>
                </div>
                <div className="mt-12 flex justify-between items-center w-full">
                  <button onClick={() => setStep(1)} className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${theme === 'dark' ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}><ArrowLeft size={16} /> Back</button>
                  <button disabled={!capturedImage} onClick={() => setStep(3)} className="flex items-center gap-2 px-8 py-4 bg-primary-500 text-white rounded-xl font-bold text-sm hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed">Next <ChevronRight size={18} /></button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Academic */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="space-y-8">
                  <div>
                    <label className={`block text-xs font-bold mb-3 uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Department</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {departments.map(dept => {
                        const Icon = dept.icon;
                        const isSelected = formData.department === dept.id;
                        return (
                          <button key={dept.id} onClick={() => setFormData({ ...formData, department: dept.id })}
                            className={`flex items-center justify-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${isSelected
                              ? 'bg-primary-500/10 border-primary-500'
                              : theme === 'dark' ? 'bg-[#0f0f13] border-white/5 hover:border-white/20' : 'bg-slate-50 border-slate-200 hover:border-primary-300'
                              }`}
                          >
                            <div className={`p-2 rounded-lg transition-all ${isSelected ? 'bg-primary-500' : theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                              <Icon size={20} className={isSelected ? 'text-white' : dept.color} />
                            </div>
                            <span className={`text-sm font-bold ${isSelected ? (theme === 'dark' ? 'text-primary-400' : 'text-primary-600') : theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{dept.id}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className={`block text-xs font-bold mb-3 uppercase tracking-widest ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Current Year</label>
                    <div className="grid grid-cols-4 gap-3">
                      {['1st', '2nd', '3rd', '4th'].map(yr => (
                        <button key={yr} onClick={() => setFormData({ ...formData, year: yr })}
                          className={`py-3.5 rounded-xl border-2 font-bold text-sm transition-all duration-200 ${formData.year === yr
                            ? 'bg-primary-500/10 border-primary-500 text-primary-600 dark:text-primary-400'
                            : theme === 'dark' ? 'bg-[#0f0f13] border-white/5 text-slate-400 hover:border-white/20' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-primary-300'
                            }`}
                        >{yr}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-12 flex justify-between items-center w-full">
                  <button onClick={() => setStep(2)} className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${theme === 'dark' ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}><ArrowLeft size={16} /> Back</button>
                  <button disabled={!formData.department || submitting} onClick={handleUpdateProfile}
                    className="flex items-center gap-2 px-8 py-4 bg-primary-500 text-white rounded-xl font-bold text-sm hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >{submitting ? <Loader size={18} className="animate-spin" /> : 'Finalize Profile'}</button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Room Allocation */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                className="w-full flex justify-center py-6"
              >
                {!allocationResult ? (
                  <div className="w-full max-w-sm">
                    <div className={`p-8 rounded-[2rem] border-2 text-center shadow-lg ${theme === 'dark' ? 'bg-[#0f0f13] border-white/5' : 'bg-white border-slate-200'}`}>
                      <div className="flex items-center justify-center p-3 rounded-lg bg-primary-500 text-white mb-6 w-16 h-16 mx-auto">
                        <Building size={32} />
                      </div>
                      <h3 className="font-sans text-2xl font-black mb-3 tracking-tight">Find Suite</h3>
                      <p className={`text-sm mb-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        We are ready to allocate your room based on the details you provided.
                      </p>
                      <button onClick={handleAllocateRoom} disabled={allocating}
                        className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-primary-600/30"
                      >
                        {allocating ? <><Loader size={20} className="animate-spin" /> Allocating...</> : "Initialize Allocation"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-sm text-center">
                    <SuccessParticles />
                    <motion.div initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30 border-4 border-white dark:border-[#0f0f13]"
                    >
                      <CheckCircle size={48} className="text-white" />
                    </motion.div>

                    <div className={`p-8 rounded-[2rem] border text-center shadow-xl mb-8 relative overflow-hidden group ${theme === 'dark' ? 'bg-[#0f0f13] border-white/10' : 'bg-white border-slate-200'}`}>
                      <div className="absolute -top-10 -right-10 opacity-[0.03] dark:opacity-10 group-hover:scale-110 transition-all duration-700">
                        <Home size={200} className={theme === 'dark' ? 'text-white' : 'text-slate-900'} />
                      </div>
                      <div className="relative z-10">
                        <div className={`text-xs font-bold uppercase tracking-[0.2em] mb-2 ${theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`}>Success</div>
                        <div className="font-sans text-5xl font-black tracking-tighter mb-2 text-slate-900 dark:text-white">Rm {allocationResult.number}</div>
                        <div className={`text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Block {allocationResult.block}</div>
                      </div>
                    </div>

                    <button onClick={() => setStep(5)} className={`w-full py-4 rounded-xl font-bold text-sm border-2 transition-all flex items-center justify-center gap-2 ${theme === 'dark' ? 'border-primary-500/50 bg-primary-500/10 text-primary-400 hover:bg-primary-500/20' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-900'}`}>
                      Continue to Auth <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 5: Final Protocol */}
            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
                className="w-full flex justify-center py-6"
              >
                <div className="w-full max-w-sm">
                  <div className={`p-8 sm:p-10 rounded-[2rem] border-2 text-center shadow-lg ${theme === 'dark' ? 'bg-[#0f0f13] border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                      <Shield size={40} />
                    </div>
                    <h3 className="font-sans text-2xl font-black mb-3 tracking-tight">Bot Check</h3>
                    <p className={`text-sm mb-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      Just to make sure you are human, please solve the captcha below.
                    </p>
                    <div className="flex justify-center mb-8">
                      <RecaptchaMock onVerify={setIsVerified} />
                    </div>
                    <button disabled={!isVerified} onClick={finishOnboarding}
                      className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-xl ${isVerified ? 'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-primary-500/30 hover:scale-[1.02]' : 'bg-slate-200 dark:bg-white/5 text-slate-400 dark:text-slate-600 opacity-60 cursor-not-allowed'
                        }`}
                    >Go to Dashboard <ArrowRight size={20} /></button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
