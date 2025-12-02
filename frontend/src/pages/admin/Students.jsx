import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import { Search, Filter, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'react-toastify';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [editModal, setEditModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    password: '',
    room: '',
    block: '',
    status: 'Active',
    department: '',
    year: '',
    role: 'student',
    image: ''
  });
  const [viewModal, setViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        search,
        status: statusFilter
      };
      const res = await axios.get(`${config.API_URL}/api/students`, { params });
      setStudents(res.data.data);
      setTotalPages(res.data.meta.totalPages);
      setTotalStudents(res.data.meta.total);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchStudents();
    }, 300);
    return () => clearTimeout(debounce);
  }, [page, search, statusFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // Check if room exists (if room number is provided)
      if (newStudent.room && newStudent.block) {
        const roomCheck = await axios.get(`${config.API_URL}/api/rooms?search=${newStudent.room}&block=${newStudent.block}`);

        if (roomCheck.data.data.length === 0) {
          // Room doesn't exist - ask to create
          const createRoom = window.confirm(
            `Room ${newStudent.room} in Block ${newStudent.block} doesn't exist.\n\nWould you like to create it automatically?`
          );

          if (createRoom) {
            // Determine capacity based on room type (you can adjust this logic)
            const capacity = 2; // Default to double occupancy
            await axios.post(`${config.API_URL}/api/rooms`, {
              number: newStudent.room,
              block: newStudent.block,
              type: 'Double',
              capacity: capacity,
              occupied: 1, // This student will occupy it
              status: 'Available'
            });
            toast.success(`Room ${newStudent.room} created successfully!`);
          } else {
            toast.info('Student creation cancelled. Please create the room first or assign a different room.');
            return;
          }
        }
      }

      await axios.post(`${config.API_URL}/api/students`, newStudent);
      toast.success('Student created successfully');
      setCreateModal(false);
      setNewStudent({
        name: '',
        email: '',
        password: '',
        room: '',
        block: '',
        status: 'Active',
        department: '',
        year: '',
        role: 'student',
        image: ''
      });
      fetchStudents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create student');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await axios.delete(`${config.API_URL}/api/students/${id}`);
      toast.success('Student deleted successfully');
      fetchStudents();
    } catch (error) {
      toast.error('Failed to delete student');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${config.API_URL}/api/students/${editingStudent._id}`, editingStudent);
      toast.success('Student updated successfully');
      setEditModal(false);
      fetchStudents();
    } catch (error) {
      toast.error('Failed to update student');
    }
  };

  const handleView = (student) => {
    setSelectedStudent(student);
    setViewModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Students</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage all registered students ({totalStudents})</p>
        </div>
        <button
          onClick={() => setCreateModal(true)}
          className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg shadow-primary-500/20 font-medium"
        >
          <Plus size={20} />
          <span>Add Student</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-slate-200 dark:border-neutral-700 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" size={20} />
          <input
            type="text"
            placeholder="Search by name, room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all dark:text-white"
          />
        </div>

        <div className="relative flex bg-gradient-to-r from-slate-50 to-slate-100 dark:from-neutral-900 dark:to-neutral-800 p-1.5 rounded-2xl border border-slate-200/50 dark:border-neutral-700/50 shadow-inner backdrop-blur-sm">
          {['All', 'Active', 'Inactive'].map((status, index) => {
            const isActive = (status === 'All' && statusFilter === '') || statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status === 'All' ? '' : status)}
                className={`relative flex-1 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden group ${isActive
                  ? 'text-white shadow-lg scale-105'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:scale-102'
                  }`}
              >
                {/* Active Background with Gradient */}
                {isActive && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 animate-gradient-shift"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-primary-600 opacity-30 blur-lg group-hover:opacity-50 transition-opacity"></div>
                  </>
                )}

                {/* Hover Effect for Inactive */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-200/50 to-slate-300/50 dark:from-neutral-700/50 dark:to-neutral-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}

                {/* Status Icon/Indicator */}
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {status === 'Active' && (
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-300 shadow-lg shadow-green-400/50' : 'bg-green-500'} animate-pulse`}></span>
                  )}
                  {status === 'Inactive' && (
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-red-300 shadow-lg shadow-red-400/50' : 'bg-red-500'}`}></span>
                  )}
                  {status}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Students Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-2xl border border-slate-200 dark:border-neutral-700">
          <p className="text-slate-500 dark:text-slate-400">No students found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {students.map((student) => (
            <div
              key={student._id}
              onClick={() => handleView(student)}
              className="group bg-white dark:bg-neutral-800 rounded-2xl border border-slate-200 dark:border-neutral-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-neutral-900">
                <img
                  src={student.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`}
                  alt={student.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`;
                  }}
                />
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${student.status === 'Active'
                    ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50'
                    : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50'
                    } shadow-sm backdrop-blur-md`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${student.status === 'Active' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                    {student.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary-500 transition-colors">
                    {student.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    {student.department} • {student.year} Year
                  </p>
                </div>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                    <span className="w-20 text-xs uppercase tracking-wider text-slate-400 font-semibold">Room</span>
                    <span className="font-medium">{student.room || 'N/A'} <span className="text-slate-400">({student.block || '-'})</span></span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                    <span className="w-20 text-xs uppercase tracking-wider text-slate-400 font-semibold">Email</span>
                    <span className="truncate" title={student.email}>{student.email}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-neutral-700">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(student);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-neutral-700/50 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(student._id);
                    }}
                    className="flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}


      <div className="px-6 py-4 border-t border-slate-200 dark:border-neutral-700">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>



      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Student">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
            <input
              type="text"
              value={editingStudent?.name || ''}
              onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={editingStudent?.email || ''}
              onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
            <input
              type="text"
              value={editingStudent?.image || ''}
              onChange={(e) => setEditingStudent({ ...editingStudent, image: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
              placeholder="https://res.cloudinary.com/..."
            />
            <p className="text-xs text-slate-500 mt-1">Note: Must be a direct image link (e.g., ending in .jpg, .png). Pinterest page links won't work.</p>
            {editingStudent?.image && (
              <div className="mt-2 flex items-center gap-3 p-2 bg-slate-100 dark:bg-neutral-800 rounded-lg border border-slate-200 dark:border-neutral-700">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 shrink-0">
                  <img
                    src={editingStudent.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                      e.target.parentElement.innerHTML = '<span class="text-xs text-red-500">❌</span>';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">Preview</p>
                  <p className="text-[10px] text-slate-500 truncate">{editingStudent.image}</p>
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Room</label>
              <input
                type="text"
                value={editingStudent?.room || ''}
                onChange={(e) => setEditingStudent({ ...editingStudent, room: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Block</label>
              <input
                type="text"
                value={editingStudent?.block || ''}
                onChange={(e) => setEditingStudent({ ...editingStudent, block: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
            <select
              value={editingStudent?.status || ''}
              onChange={(e) => setEditingStudent({ ...editingStudent, status: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setEditModal(false)}
              className="flex-1 px-4 py-2 border border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-neutral-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 shadow-lg shadow-primary-500/20 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Create Student Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Add New Student">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name *</label>
            <input
              type="text"
              required
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
              placeholder="Enter student name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
            <input
              type="email"
              required
              value={newStudent.email}
              onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
              placeholder="student@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
            <input
              type="text"
              value={newStudent.image}
              onChange={(e) => setNewStudent({ ...newStudent, image: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
              placeholder="https://res.cloudinary.com/..."
            />
            <p className="text-xs text-slate-500 mt-1">Note: Must be a direct image link (e.g., ending in .jpg, .png). Pinterest page links won't work.</p>
            {newStudent.image && (
              <div className="mt-2 flex items-center gap-3 p-2 bg-slate-100 dark:bg-neutral-800 rounded-lg border border-slate-200 dark:border-neutral-700">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 shrink-0">
                  <img
                    src={newStudent.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                      e.target.parentElement.innerHTML = '<span class="text-xs text-red-500">❌</span>';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">Preview</p>
                  <p className="text-[10px] text-slate-500 truncate">{newStudent.image}</p>
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password *</label>
            <input
              type="password"
              required
              value={newStudent.password}
              onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
              placeholder="Enter password"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Room</label>
              <input
                type="text"
                value={newStudent.room}
                onChange={(e) => setNewStudent({ ...newStudent, room: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
                placeholder="101"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Block</label>
              <input
                type="text"
                value={newStudent.block}
                onChange={(e) => setNewStudent({ ...newStudent, block: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
                placeholder="A"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
              <input
                type="text"
                value={newStudent.department}
                onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
                placeholder="CSE"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Year</label>
              <input
                type="text"
                value={newStudent.year}
                onChange={(e) => setNewStudent({ ...newStudent, year: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
                placeholder="1st"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
            <select
              value={newStudent.status}
              onChange={(e) => setNewStudent({ ...newStudent, status: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setCreateModal(false)}
              className="flex-1 px-4 py-2 border border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-neutral-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 shadow-lg shadow-primary-500/20 transition-colors"
            >
              Create Student
            </button>
          </div>
        </form>
      </Modal>

      {/* View Student Modal */}
      {
        selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" style={{ display: viewModal ? 'flex' : 'none' }}>
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-neutral-700 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-neutral-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Student Details</h3>
                <button
                  onClick={() => setViewModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-700 text-slate-500 dark:text-slate-400 transition-colors"
                >
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center overflow-hidden border-2 border-white dark:border-neutral-700 shadow-md">
                    <img
                      src={selectedStudent.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.name)}&background=random`}
                      alt={selectedStudent.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.name)}&background=random`;
                      }}
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedStudent.name}</h2>
                    <p className="text-slate-500 dark:text-slate-400">{selectedStudent.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Room Info</h4>
                    <p className="text-slate-900 dark:text-white font-medium text-lg">Room {selectedStudent.room || "N/A"}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Block {selectedStudent.block || "-"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Status</h4>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${selectedStudent.status === 'Active'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                      {selectedStudent.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Department</h4>
                    <p className="text-slate-900 dark:text-white font-medium">{selectedStudent.department || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Year</h4>
                    <p className="text-slate-900 dark:text-white font-medium">{selectedStudent.year || "N/A"}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Role</h4>
                  <p className="text-slate-900 dark:text-white font-medium capitalize">{selectedStudent.role}</p>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-900/50 flex justify-end gap-3">
                <button
                  onClick={() => setViewModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-neutral-700 rounded-xl transition-colors font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleEdit(selectedStudent);
                    setViewModal(false);
                  }}
                  className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 shadow-lg shadow-primary-500/20 transition-colors font-medium flex items-center gap-2"
                >
                  <Edit size={18} /> Edit Student
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default Students;
