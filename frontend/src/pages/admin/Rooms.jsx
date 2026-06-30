import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import config from '../../config';
import Pagination from '../../components/ui/Pagination';
import Modal from '../../components/ui/Modal';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import ViewToggle from '../../components/ui/ViewToggle';
import SlideOver from '../../components/ui/SlideOver';
import DataTable from '../../components/ui/DataTable';
import { Search, Plus, Edit, Trash2, BedDouble, Users, Filter, LayoutGrid, List, CheckSquare } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Views
  const [viewMode, setViewMode] = useState('grid');
  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  // Modals
  const [editModal, setEditModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [newRoom, setNewRoom] = useState({
    number: '', block: '', type: 'Double', capacity: 2, occupied: 0, status: 'Available'
  });

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [blockFilter, setBlockFilter] = useState('All');

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkAction, setBulkAction] = useState('');

  const fetchRooms = async () => {
    setLoading(true);
    try {
      // In a real app we might fetch all for grouping, but we'll adapt to existing API limits
      // If we need grouping by block, we might need to fetch a larger limit or handle it carefully.
      const params = { page, limit: 50, search }; 
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
      setNewRoom({ number: '', block: '', type: 'Double', capacity: 2, occupied: 0, status: 'Available' });
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
      setSlideOverOpen(false);
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
      if(selectedRoom?._id === editingRoom._id) setSelectedRoom(editingRoom);
    } catch (error) {
      toast.error('Failed to update room');
    }
  };

  const handleView = (room) => {
    setSelectedRoom(room);
    setSlideOverOpen(true);
  };

  const handleBulkUpdate = async () => {
    if (!bulkAction || selectedIds.size === 0) return;
    try {
      const updates = Array.from(selectedIds).map(id => 
        axios.patch(`${config.API_URL}/api/rooms/${id}`, { status: bulkAction })
      );
      await Promise.all(updates);
      toast.success(`Successfully updated ${selectedIds.size} rooms to ${bulkAction}`);
      setSelectedIds(new Set());
      setBulkAction('');
      fetchRooms();
    } catch (error) {
      toast.error('Failed to perform bulk update');
    }
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      if (statusFilter !== 'All' && room.status !== statusFilter) return false;
      if (typeFilter !== 'All' && room.type !== typeFilter) return false;
      if (blockFilter !== 'All' && room.block !== blockFilter) return false;
      return true;
    });
  }, [rooms, statusFilter, typeFilter, blockFilter]);

  const roomsByBlock = useMemo(() => {
    const grouped = {};
    filteredRooms.forEach(r => {
      if (!grouped[r.block]) grouped[r.block] = [];
      grouped[r.block].push(r);
    });
    return grouped;
  }, [filteredRooms]);

  const uniqueBlocks = useMemo(() => ['All', ...new Set(rooms.map(r => r.block))], [rooms]);

  const tableColumns = [
    {
      header: <input type="checkbox" onChange={e => {
        if(e.target.checked) setSelectedIds(new Set(filteredRooms.map(r => r._id)));
        else setSelectedIds(new Set());
      }} checked={selectedIds.size === filteredRooms.length && filteredRooms.length > 0} />,
      accessor: 'id',
      render: (row) => (
        <input 
          type="checkbox" 
          checked={selectedIds.has(row._id)} 
          onChange={(e) => {
            const newSet = new Set(selectedIds);
            if(e.target.checked) newSet.add(row._id);
            else newSet.delete(row._id);
            setSelectedIds(newSet);
          }}
          onClick={(e) => e.stopPropagation()} 
        />
      ),
      cellClassName: 'w-10'
    },
    { header: 'Room No', accessor: 'number', cellClassName: 'font-bold' },
    { header: 'Block', accessor: 'block' },
    { header: 'Type', accessor: 'type' },
    { header: 'Occupancy', render: (row) => `${row.occupied} / ${row.capacity}` },
    { header: 'Status', render: (row) => (
      <Badge variant={row.status === 'Available' ? 'success' : row.status === 'Full' ? 'danger' : 'warning'}>
        {row.status}
      </Badge>
    )},
    { header: 'Actions', render: (row) => (
      <div className="flex gap-2">
        <button onClick={(e) => { e.stopPropagation(); handleEdit(row); }} className="text-slate-400 hover:text-primary-500"><Edit size={16} /></button>
        <button onClick={(e) => { e.stopPropagation(); handleDelete(row._id); }} className="text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
      </div>
    ), cellClassName: 'text-right' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Rooms Management" 
        description="Manage hostel rooms, monitor occupancy, and perform bulk operations."
        actions={
          <div className="flex gap-3">
            <ViewToggle view={viewMode} onViewChange={setViewMode} />
            <button
              onClick={() => setCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 font-medium"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add Room</span>
            </button>
          </div>
        }
      />

      {/* Filters & Bulk Actions */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search room or block..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            <select value={blockFilter} onChange={(e) => setBlockFilter(e.target.value)} className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-zinc-300 font-medium">
              {uniqueBlocks.map(b => <option key={b} value={b}>{b === 'All' ? 'All Blocks' : `Block ${b}`}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-zinc-300 font-medium">
              <option value="All">All Status</option>
              <option value="Available">Available</option>
              <option value="Full">Full</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-zinc-300 font-medium">
              <option value="All">All Types</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
            </select>
          </div>
        </div>

        {selectedIds.size > 0 && viewMode === 'table' && (
          <div className="flex items-center gap-3 bg-primary-50 dark:bg-primary-900/20 p-2 rounded-xl border border-primary-100 dark:border-primary-800">
            <span className="text-sm font-bold text-primary-600 px-2">{selectedIds.size} Selected</span>
            <select 
              value={bulkAction} 
              onChange={(e) => setBulkAction(e.target.value)}
              className="bg-white dark:bg-zinc-900 border-none rounded-lg text-sm px-3 py-1.5 focus:ring-0"
            >
              <option value="">Bulk Action...</option>
              <option value="Available">Mark Available</option>
              <option value="Maintenance">Mark Maintenance</option>
            </select>
            <button onClick={handleBulkUpdate} className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-bold">Apply</button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-2">
        <span className="text-sm font-bold text-slate-500">Showing {filteredRooms.length} rooms</span>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>
      ) : filteredRooms.length === 0 ? (
        <EmptyState icon={BedDouble} title="No Rooms Found" description="Try adjusting your filters or search query." />
      ) : viewMode === 'table' ? (
        <DataTable 
          columns={tableColumns} 
          data={filteredRooms} 
          onRowClick={handleView}
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(roomsByBlock).map(([block, blockRooms]) => (
            <div key={block} className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Block {block}</h3>
                <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-800"></div>
                <Badge variant="primary" className="rounded-full px-3">{blockRooms.length} Rooms</Badge>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                <AnimatePresence>
                  {blockRooms.map((room) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={room._id}
                      onClick={() => handleView(room)}
                      className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all cursor-pointer group flex flex-col items-center text-center relative overflow-hidden"
                    >
                      <div className="absolute top-2 right-2">
                        <div className={`w-2 h-2 rounded-full ${room.status === 'Available' ? 'bg-emerald-500' : room.status === 'Maintenance' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                      </div>
                      
                      <div className="text-2xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">
                        {room.number}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium mb-3">{room.type} Room</div>
                      
                      <div className="w-full">
                        <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 mb-1">
                          <span>Occupancy</span>
                          <span>{room.occupied}/{room.capacity}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${room.occupied === room.capacity ? 'bg-rose-500' : 'bg-primary-500'}`}
                            style={{ width: `${(room.occupied / room.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && viewMode === 'table' && (
        <div className="flex justify-center mt-8">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {/* SlideOver for Room Details */}
      <SlideOver isOpen={slideOverOpen} onClose={() => setSlideOverOpen(false)} title={`Room ${selectedRoom?.number}`}>
        {selectedRoom && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-zinc-900 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800">
              <div className="h-16 w-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-2xl font-black">
                {selectedRoom.block}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Block {selectedRoom.block}</h2>
                  <Badge variant={selectedRoom.status === 'Available' ? 'success' : selectedRoom.status === 'Full' ? 'danger' : 'warning'}>
                    {selectedRoom.status}
                  </Badge>
                </div>
                <p className="text-slate-500 dark:text-zinc-400 font-medium">{selectedRoom.type} Room</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Occupancy</h4>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-primary-500" />
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{selectedRoom.occupied} / {selectedRoom.capacity}</span>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Status</h4>
                <div className="font-bold text-slate-900 dark:text-white">{selectedRoom.status}</div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-between">
                Current Occupants
                <button className="text-sm text-primary-600 hover:underline">Reassign...</button>
              </h4>
              {selectedRoom.occupied > 0 ? (
                <div className="space-y-2">
                  {[...Array(selectedRoom.occupied)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-slate-100 dark:border-zinc-800">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold">ST</div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-slate-900 dark:text-white">Student Name</div>
                        <div className="text-xs text-slate-500">ID: STU{Math.floor(Math.random() * 10000)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic text-sm">Room is currently empty.</p>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-zinc-800/80 flex gap-3">
              <button onClick={() => { handleEdit(selectedRoom); setSlideOverOpen(false); }} className="flex-1 py-3 bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold rounded-xl transition-colors">
                Edit Room
              </button>
              <button onClick={() => handleDelete(selectedRoom._id)} className="flex-1 py-3 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 font-bold rounded-xl transition-colors">
                Delete
              </button>
            </div>
          </div>
        )}
      </SlideOver>

      {/* Create/Edit Modals remain standard floating modals for data entry focus */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Room">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Room Number</label>
              <input type="text" value={editingRoom?.number || ''} onChange={(e) => setEditingRoom({ ...editingRoom, number: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Block</label>
              <input type="text" value={editingRoom?.block || ''} onChange={(e) => setEditingRoom({ ...editingRoom, block: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Type</label>
            <select value={editingRoom?.type || ''} onChange={(e) => setEditingRoom({ ...editingRoom, type: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white">
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Capacity</label>
              <input type="number" value={editingRoom?.capacity || ''} onChange={(e) => setEditingRoom({ ...editingRoom, capacity: parseInt(e.target.value) })} className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Occupied</label>
              <input type="number" value={editingRoom?.occupied || ''} onChange={(e) => setEditingRoom({ ...editingRoom, occupied: parseInt(e.target.value) })} className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Status</label>
            <select value={editingRoom?.status || ''} onChange={(e) => setEditingRoom({ ...editingRoom, status: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white">
              <option value="Available">Available</option>
              <option value="Full">Full</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setEditModal(false)} className="flex-1 px-4 py-2 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 shadow-lg shadow-primary-500/20 transition-colors">Save Changes</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Add New Room">
        <form onSubmit={handleCreate} className="space-y-4">
          {/* Similar form as edit, omitting for brevity in rewrite, reusing structure */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Room Number *</label>
              <input type="text" required value={newRoom.number} onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white" placeholder="101" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Block *</label>
              <input type="text" required value={newRoom.block} onChange={(e) => setNewRoom({ ...newRoom, block: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white" placeholder="A" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Type *</label>
            <select value={newRoom.type} onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white">
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Capacity *</label>
              <input type="number" required min="1" value={newRoom.capacity} onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })} className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Occupied</label>
              <input type="number" min="0" value={newRoom.occupied} onChange={(e) => setNewRoom({ ...newRoom, occupied: parseInt(e.target.value) })} className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Status</label>
            <select value={newRoom.status} onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value })} className="w-full px-4 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:text-white">
              <option value="Available">Available</option>
              <option value="Full">Full</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setCreateModal(false)} className="flex-1 px-4 py-2 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 shadow-lg shadow-primary-500/20 transition-colors">Create Room</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Rooms;
