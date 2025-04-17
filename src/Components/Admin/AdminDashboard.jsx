/*import { useState, useEffect } from 'react';
import axios from "../../axiosConfig";
import { Edit } from 'lucide-react';

const AdminDashboard = () => {
  const [showAddService, setShowAddService] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [employeeFilter, setEmployeeFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [formData, setFormData] = useState({
    serviceName: '',
    duration: '',
    employee: '',
    category: ''
  });

  // Sample data for dropdowns
  const employees = ['Dr. Jasmine Kohli', 'Dr Navjot Arora', 'Dr. Smith'];
  const categories = ['Consultation', 'Treatment', 'Procedure', 'Laser Hair Removal', 'Hydra Facial'];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('admin/appointment');
        setAppointments(response.data);
        setFilteredAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    let filtered = [...appointments];
    
    // Apply employee filter if active
    if (employeeFilter) {
      filtered = filtered.filter(app => {
        const employeeName = app.employee?.name || '';
        return employeeName.charAt(0).toUpperCase() === employeeFilter;
      });
    }
    
    // Apply date filter if active
    if (dateFilter) {
      filtered = filtered.filter(app => {
        const appointmentDate = new Date(app.startTime).toISOString().split('T')[0];
        return appointmentDate === dateFilter;
      });
    }
    
    setFilteredAppointments(filtered);
  }, [employeeFilter, dateFilter, appointments]);

  const handleDelete = async (appointmentId) => {
    try {
      await axios.delete(`admin/appointment/${appointmentId}`);
      setAppointments(appointments.filter(app => app.id !== appointmentId));
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New service added:', formData);
    setShowAddService(false);
    setFormData({
      serviceName: '',
      duration: '',
      employee: '',
      category: ''
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 font-sans">
      <header className="bg-indigo-800 text-white py-2 px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-6 mb-2 md:mb-0">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-full p-1">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="ml-1 font-sans font-semibold">Genesis Virtue</span>
          </div>
          <div className="flex space-x-1 overflow-x-auto whitespace-nowrap">
            <button className="font-sans flex items-center hover:bg-indigo-700 px-2 py-1 rounded transition-colors">
              <span className="material-symbols-outlined text-sm mr-1">view_list</span>
              All Appointment
            </button>
            <button 
              onClick={() => setShowAddService(true)}
              className="font-sans flex items-center hover:bg-indigo-700 px-2 py-1 rounded transition-colors"
            >
              <span className="material-symbols-outlined text-sm mr-1">add</span>
              Add Services
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <input 
              type="text" 
              placeholder="Search patient" 
              className="bg-indigo-700 rounded-md py-1 pl-8 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full" 
            />
            <span className="material-symbols-outlined absolute left-2 top-1 text-sm">search</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-full text-xs hover:bg-indigo-500 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-sm">notifications</span>
            </div>
            <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-full text-xs hover:bg-indigo-500 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-sm">apps</span>
            </div>
            <div className="flex items-center justify-center w-8 h-8 bg-yellow-400 rounded-full text-indigo-800 font-bold text-xs hover:bg-yellow-300 transition-colors cursor-pointer">
              N
            </div>
          </div>
        </div>
      </header>

      {showAddService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold">Add New Service</h3>
              <button 
                onClick={() => setShowAddService(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee
                </label>
                <select
                  name="employee"
                  value={formData.employee}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp, index) => (
                    <option key={index} value={emp}>{emp}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                  placeholder="Enter service name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                  placeholder="30"
                  min="1"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddService(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="w-full min-h-screen bg-gray-100 font-sans">
        <div className="bg-white py-2 px-4 border-b flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-0">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2 2 6.48 2 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4H5c-1.1 0-2 .9-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="flex items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm cursor-pointer transition-colors ${
                  employeeFilter === 'N' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                }`}
                onClick={() => setEmployeeFilter(employeeFilter === 'N' ? null : 'N')}
              >
                N
              </div>
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm cursor-pointer transition-colors ${
                  employeeFilter === 'A' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                }`}
                onClick={() => setEmployeeFilter(employeeFilter === 'A' ? null : 'A')}
              >
                A
              </div>
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm cursor-pointer transition-colors ${
                  employeeFilter === 'E' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                }`}
                onClick={() => setEmployeeFilter(employeeFilter === 'E' ? null : 'E')}
              >
                E
              </div>
            </div>
            <div className="relative">
              <input type="text" placeholder="Filter Name" className="border rounded-md py-1 px-2 text-sm w-32" />
            </div>
            <div className="flex border rounded-md overflow-hidden">
              <button className="px-2 py-1 hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-sm">view_list</span>
              </button>
              <button className="px-2 py-1 hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-sm">grid_view</span>
              </button>
              <button className="px-2 py-1 hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-sm">person</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              <div className="bg-blue-500 rounded px-2 py-1 text-white text-xs">
                Booked
              </div>
              <div className="bg-blue-100 rounded px-2 py-1 text-blue-700 text-xs hover:bg-blue-200 transition-colors cursor-pointer">
                Arrived
              </div>
              <div className="bg-blue-100 rounded px-2 py-1 text-blue-700 text-xs hover:bg-blue-200 transition-colors cursor-pointer">
                On-Going
              </div>
              <div className="bg-blue-100 rounded px-2 py-1 text-blue-700 text-xs hover:bg-blue-200 transition-colors cursor-pointer">
                Reviewed
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <input 
              type="date" 
              className="border rounded p-1 text-sm" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button 
              className={`border rounded px-3 py-1 text-sm hover:bg-gray-50 transition-colors ${
                dateFilter === selectedDate ? 'bg-blue-100 text-blue-700' : ''
              }`}
              onClick={() => {
                if (selectedDate) {
                  setDateFilter(selectedDate);
                }
              }}
            >
              Set
            </button>
            <button 
              className={`border rounded px-3 py-1 text-sm hover:bg-gray-100 transition-colors ${
                dateFilter === new Date().toISOString().split('T')[0] ? 'bg-blue-100 text-blue-700' : 'bg-gray-50'
              }`}
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                setSelectedDate(today);
                setDateFilter(today);
              }}
            >
              Today
            </button>
            {(dateFilter || employeeFilter) && (
              <button 
                className="border rounded px-3 py-1 text-sm hover:bg-gray-100 transition-colors ml-2"
                onClick={() => {
                  setDateFilter(null);
                  setEmployeeFilter(null);
                  setSelectedDate('');
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
  
        <div className="overflow-x-auto w-full">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 text-left font-sans text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="py-2 px-4 text-left font-sans text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="py-2 px-4 text-left font-sans text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
                <th className="py-2 px-4 text-left font-sans text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="py-2 px-4 text-left font-sans text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-2 px-4 text-left font-sans text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="py-2 px-4 text-left font-sans text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-2 px-4 text-left font-sans text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="py-2 px-4 text-left font-sans text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              </tr>
            </thead>

            <tbody className="">
              {filteredAppointments.map((appointment, index) => (
                <tr key={index} className="border-b hover:bg-blue-50 transition-colors cursor-pointer">
                  <td className="py-3 font-sans px-4 text-sm">{appointment.id}</td>
                  <td className="py-3 font-sans px-4 text-sm font-medium">{appointment.user?.name || '-'}</td>
                  <td className="py-3 px-4">
                    <button className="bg-blue-500 text-white rounded-sm p-0.5">
                      <Edit className="w-4 font-sans h-4" />
                    </button>
                  </td>
                  <td className="p-4 font-sans">{appointment.service?.price || '-'} SEK</td>  
                  
                  <td className="p-4 font-sans">{new Date(appointment.startTime).toLocaleDateString()}</td>
                  <td className="py-3 px-4 font-sans text-sm">
                    {new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 font-sans px-4 text-sm text-blue-600 font-medium">
                    {appointment.status?.toUpperCase() || 'BOOKED'}
                  </td>
                  <td className="py-3 font-sans px-4 text-sm">{appointment.employee?.name || '-'}</td>
                  <td className="py-3 font-sans px-4 text-sm">
                    {appointment.service?.serviceName || '-'}
                    {appointment.service?.category && ` - ${appointment.service.category}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;*/
import { useState, useEffect } from 'react';
import axios from "../../axiosConfig";
import { Edit } from 'lucide-react';

const AdminDashboard = () => {
  const [showAddService, setShowAddService] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [employeeFilter, setEmployeeFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [formData, setFormData] = useState({
    serviceName: '',
    duration: '',
    employee: '',
    category: ''
  });

  // Sample data for dropdowns
  const employees = ['Dr. Jasmine Kohli', 'Dr Navjot Arora', 'Dr. Smith'];
  const categories = ['Consultation', 'Treatment', 'Procedure', 'Laser Hair Removal', 'Hydra Facial'];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('admin/appointment');
        setAppointments(response.data);
        setFilteredAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    let filtered = [...appointments];
    
    // Apply employee initial filter if active
    if (employeeFilter) {
      filtered = filtered.filter(app => {
        const employeeName = app.employee?.name || '';
        return employeeName.charAt(0).toUpperCase() === employeeFilter;
      });
    }
    
    // Apply date filter if active
    if (dateFilter) {
      filtered = filtered.filter(app => {
        const appointmentDate = new Date(app.startTime).toISOString().split('T')[0];
        return appointmentDate === dateFilter;
      });
    }
    
    // Apply name filter if active
    if (nameFilter) {
      const searchTerm = nameFilter.toLowerCase();
      filtered = filtered.filter(app => {
        const patientName = app.user?.name?.toLowerCase() || '';
        const employeeName = app.employee?.name?.toLowerCase() || '';
        const serviceName = app.service?.serviceName?.toLowerCase() || '';
        
        return (
          patientName.includes(searchTerm) ||
          employeeName.includes(searchTerm) ||
          serviceName.includes(searchTerm)
        );
      });
    }
    
    setFilteredAppointments(filtered);
  }, [employeeFilter, dateFilter, nameFilter, appointments]);

  const handleDelete = async (appointmentId) => {
    try {
      await axios.delete(`admin/appointment/${appointmentId}`);
      setAppointments(appointments.filter(app => app.id !== appointmentId));
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNameFilterChange = (e) => {
    setNameFilter(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New service added:', formData);
    setShowAddService(false);
    setFormData({
      serviceName: '',
      duration: '',
      employee: '',
      category: ''
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-indigo-800 text-white py-2 px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-6 mb-2 md:mb-0">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-full p-1">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="ml-1 font-sans font-semibold">Genesis Virtue</span>
          </div>
          <div className="flex space-x-1 overflow-x-auto whitespace-nowrap">
            <button className="font-sans flex items-center hover:bg-indigo-700 px-2 py-1 rounded transition-colors">
              <span className="material-symbols-outlined text-sm mr-1">view_list</span>
              All Appointment
            </button>
            <button 
              onClick={() => setShowAddService(true)}
              className="font-sans flex items-center hover:bg-indigo-700 px-2 py-1 rounded transition-colors"
            >
              <span className="material-symbols-outlined text-sm mr-1">add</span>
              Add Services
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <input 
              type="text" 
              placeholder="Search patient" 
              className="bg-indigo-700 rounded-md py-1 pl-8 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full" 
            />
            <span className="material-symbols-outlined absolute left-2 top-1 text-sm">search</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-full text-xs hover:bg-indigo-500 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-sm">notifications</span>
            </div>
            <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-full text-xs hover:bg-indigo-500 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-sm">apps</span>
            </div>
            <div className="flex items-center justify-center w-8 h-8 bg-yellow-400 rounded-full text-indigo-800 font-bold text-xs hover:bg-yellow-300 transition-colors cursor-pointer">
              N
            </div>
          </div>
        </div>
      </header>

      {/* Add Service Modal */}
      {showAddService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold">Add New Service</h3>
              <button 
                onClick={() => setShowAddService(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee
                </label>
                <select
                  name="employee"
                  value={formData.employee}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp, index) => (
                    <option key={index} value={emp}>{emp}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                  placeholder="Enter service name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                  placeholder="30"
                  min="1"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddService(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="w-full min-h-screen bg-gray-100 font-sans">
        <div className="bg-white py-2 px-4 border-b flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-0">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2 2 6.48 2 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4H5c-1.1 0-2 .9-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="flex items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm cursor-pointer transition-colors ${
                  employeeFilter === 'N' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                }`}
                onClick={() => setEmployeeFilter(employeeFilter === 'N' ? null : 'N')}
              >
                N
              </div>
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm cursor-pointer transition-colors ${
                  employeeFilter === 'A' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                }`}
                onClick={() => setEmployeeFilter(employeeFilter === 'A' ? null : 'A')}
              >
                A
              </div>
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm cursor-pointer transition-colors ${
                  employeeFilter === 'E' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                }`}
                onClick={() => setEmployeeFilter(employeeFilter === 'E' ? null : 'E')}
              >
                E
              </div>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Filter Name/Service" 
                className="border rounded-md py-1 px-2 text-sm w-32" 
                value={nameFilter}
                onChange={handleNameFilterChange}
              />
            </div>
            <div className="flex border rounded-md overflow-hidden">
              <button className="px-2 py-1 hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-sm">view_list</span>
              </button>
              <button className="px-2 py-1 hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-sm">grid_view</span>
              </button>
              <button className="px-2 py-1 hover:bg-gray-100 transition-colors">
                <span className="material-symbols-outlined text-sm">person</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              <div className="bg-blue-500 rounded px-2 py-1 text-white text-xs">
                Booked
              </div>
              <div className="bg-blue-100 rounded px-2 py-1 text-blue-700 text-xs hover:bg-blue-200 transition-colors cursor-pointer">
                Arrived
              </div>
              <div className="bg-blue-100 rounded px-2 py-1 text-blue-700 text-xs hover:bg-blue-200 transition-colors cursor-pointer">
                On-Going
              </div>
              <div className="bg-blue-100 rounded px-2 py-1 text-blue-700 text-xs hover:bg-blue-200 transition-colors cursor-pointer">
                Reviewed
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <input 
              type="date" 
              className="border rounded p-1 text-sm" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button 
              className={`border rounded px-3 py-1 text-sm hover:bg-gray-50 transition-colors ${
                dateFilter === selectedDate ? 'bg-blue-100 text-blue-700' : ''
              }`}
              onClick={() => {
                if (selectedDate) {
                  setDateFilter(selectedDate);
                }
              }}
            >
              Set
            </button>
            <button 
              className={`border rounded px-3 py-1 text-sm hover:bg-gray-100 transition-colors ${
                dateFilter === new Date().toISOString().split('T')[0] ? 'bg-blue-100 text-blue-700' : 'bg-gray-50'
              }`}
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                setSelectedDate(today);
                setDateFilter(today);
              }}
            >
              Today
            </button>
            {(dateFilter || employeeFilter || nameFilter) && (
              <button 
                className="border rounded px-3 py-1 text-sm hover:bg-gray-100 transition-colors ml-2"
                onClick={() => {
                  setDateFilter(null);
                  setEmployeeFilter(null);
                  setNameFilter('');
                  setSelectedDate('');
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
  
        <div className="overflow-x-auto w-full">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 text-left font-sans text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="py-2 px-4 text-left font-sans text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="py-2 px-4 text-left font-sans text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
                <th className="py-2 px-4 text-left font-sans text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="py-2 px-4 text-left font-sans text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-2 px-4 text-left font-sans text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="py-2 px-4 text-left font-sans text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-2 px-4 text-left font-sans text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="py-2 px-4 text-left font-sans text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              </tr>
            </thead>

            <tbody className="">
              {filteredAppointments.map((appointment, index) => (
                <tr key={index} className="border-b hover:bg-blue-50 transition-colors cursor-pointer">
                  <td className="py-3 font-sans px-4 text-sm">{appointment.id}</td>
                  <td className="py-3 font-sans px-4 text-sm font-medium">{appointment.user?.name || '-'}</td>
                  <td className="py-3 px-4">
                    <button className="bg-blue-500 text-white rounded-sm p-0.5">
                      <Edit className="w-4 font-sans h-4" />
                    </button>
                  </td>
                  <td className="p-4 font-sans">{appointment.service?.price || '-'} SEK</td>
                  <td className="p-4 font-sans">{new Date(appointment.startTime).toLocaleDateString()}</td>
                  <td className="py-3 px-4 font-sans text-sm">
                    {new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 font-sans px-4 text-sm text-blue-600 font-medium">
                    {appointment.status?.toUpperCase() || 'BOOKED'}
                  </td>
                  <td className="py-3 font-sans px-4 text-sm">{appointment.employee?.name || '-'}</td>
                  <td className="py-3 font-sans px-4 text-sm">
                    {appointment.service?.serviceName || '-'}
                    {appointment.service?.category && ` - ${appointment.service.category}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;