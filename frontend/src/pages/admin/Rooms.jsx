import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editModal, setEditModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [newRoom, setNewRoom] = useState({
    number: '',
    block: '',
    type: 'Double',
    capacity: 2,
    occupied: 0,
    status: 'Available'
  });
  const [viewModal, setViewModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, search };
      const res = await axios.get(`${config.API_URL}/api/rooms`, { params });
      setRooms(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchRooms();
    }, 300);
    return () => clearTimeout(debounce);
  }, [page, search]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${config.API_URL}/api/rooms`, newRoom);
      toast.success('Room created successfully');
      setCreateModal(false);
      setNewRoom({
        number: '',
        block: '',
        type: 'Double',
        capacity: 2,
        occupied: 0,
        status: 'Available'
      });
      fetchRooms();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create room');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await axios.delete(`${config.API_URL}/api/rooms/${id}`);
      toast.success('Room deleted successfully');
      fetchRooms();
    } catch (error) {
      toast.error('Failed to delete room');
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${config.API_URL}/api/rooms/${editingRoom._id}`, editingRoom);
      toast.success('Room updated successfully');
      setEditModal(false);
      fetchRooms();
    } catch (error) {
      toast.error('Failed to update room');
    }
  };

  const handleView = (room) => {
    setSelectedRoom(room);
    setViewModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Rooms</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage hostel rooms and occupancy</p>
        </div>
        <button
          onClick={() => setCreateModal(true)}
          className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 font-medium"
        >
          <Plus size={20} />
          <span>Add Room</span>
        </button>
      </div>

      <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-slate-200 dark:border-neutral-700 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by room number or block..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all dark:text-white"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-slate-200 dark:border-neutral-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-neutral-900 border-b border-slate-200 dark:border-neutral-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Room No</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Block</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-neutral-700">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">Loading rooms...</td></tr>
              ) : rooms.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-8 text-center text-slate-500">No rooms found</td></tr>
              ) : (
                rooms.map((room) => (
                  <tr
                    key={room._id}
                    onClick={() => handleView(room)}
                    className="hover:bg-slate-50 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900 dark:text-white">
                      {room.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      {room.block}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      {room.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-500"
                            style={{ width: `${(room.occupied / room.capacity) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{room.occupied}/{room.capacity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${room.status === 'Available' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        room.status === 'Full' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(room);
                          }}
                          className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(room._id);
                          }}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 dark:border-neutral-700">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Room">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Room Number</label>
              <input
                type="text"
                value={editingRoom?.number || ''}
                onChange={(e) => setEditingRoom({ ...editingRoom, number: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Block</label>
              <input
                type="text"
                value={editingRoom?.block || ''}
                onChange={(e) => setEditingRoom({ ...editingRoom, block: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
            <select
              value={editingRoom?.type || ''}
              onChange={(e) => setEditingRoom({ ...editingRoom, type: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
            >
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Capacity</label>
              <input
                type="number"
                value={editingRoom?.capacity || ''}
                onChange={(e) => setEditingRoom({ ...editingRoom, capacity: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Occupied</label>
              <input
                type="number"
                value={editingRoom?.occupied || ''}
                onChange={(e) => setEditingRoom({ ...editingRoom, occupied: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
            <select
              value={editingRoom?.status || ''}
              onChange={(e) => setEditingRoom({ ...editingRoom, status: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
            >
              <option value="Available">Available</option>
              <option value="Full">Full</option>
              <option value="Maintenance">Maintenance</option>
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

      {/* Create Room Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Add New Room">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Room Number *</label>
              <input
                type="text"
                required
                value={newRoom.number}
                onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
                placeholder="101"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Block *</label>
              <input
                type="text"
                required
                value={newRoom.block}
                onChange={(e) => setNewRoom({ ...newRoom, block: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
                placeholder="A"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type *</label>
            <select
              value={newRoom.type}
              onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
            >
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Capacity *</label>
              <input
                type="number"
                required
                min="1"
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Occupied</label>
              <input
                type="number"
                min="0"
                value={newRoom.occupied}
                onChange={(e) => setNewRoom({ ...newRoom, occupied: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
            <select
              value={newRoom.status}
              onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
            >
              <option value="Available">Available</option>
              <option value="Full">Full</option>
              <option value="Maintenance">Maintenance</option>
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
              Create Room
            </button>
          </div>
        </form>
      </Modal>

      {/* View Room Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" style={{ display: viewModal ? 'flex' : 'none' }}>
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-neutral-700 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-neutral-700">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Room Details</h3>
              <button
                onClick={() => setViewModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-700 text-slate-500 dark:text-slate-400 transition-colors"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl font-bold">
                  {selectedRoom.number}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Block {selectedRoom.block}</h2>
                  <p className="text-slate-500 dark:text-slate-400">{selectedRoom.type} Room</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Occupancy</h4>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-full h-2 bg-slate-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500"
                        style={{ width: `${(selectedRoom.occupied / selectedRoom.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-slate-900 dark:text-white font-medium">{selectedRoom.occupied} / {selectedRoom.capacity} Students</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Status</h4>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${selectedRoom.status === 'Available' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    selectedRoom.status === 'Full' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                    {selectedRoom.status}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-neutral-900 rounded-xl border border-slate-100 dark:border-neutral-700">
                <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Room Features</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                    <span>{selectedRoom.type} Bed(s)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                    <span>Study Table</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                    <span>Cupboard</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                    <span>Fan & Light</span>
                  </div>
                </div>
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
                  handleEdit(selectedRoom);
                  setViewModal(false);
                }}
                className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 shadow-lg shadow-primary-500/20 transition-colors font-medium flex items-center gap-2"
              >
                <Edit size={18} /> Edit Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
