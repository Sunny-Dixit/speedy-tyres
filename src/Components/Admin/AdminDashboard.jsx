import { useState, useEffect } from 'react';
import axios from "../../axiosConfig";
import { Edit, Eye, X, Trash } from 'lucide-react';
import logo from '../Images/speedy-tyres-logo.png';




const AdminDashboard = () => {
  const [showAddService, setShowAddService] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [employeeFilter, setEmployeeFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [nameFilter, setNameFilter] = useState('');
  const [formData, setFormData] = useState({
    serviceName: '',
    duration: '',
    employee: '',
    category: ''
  });

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

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      setSelectedUser(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    let filtered = [...appointments];
    
    if (employeeFilter) {
      filtered = filtered.filter(app => {
        const employeeName = app.employee?.name || '';
        return employeeName.charAt(0).toUpperCase() === employeeFilter;
      });
    }
    
    if (dateFilter) {
      filtered = filtered.filter(app => {
        const appointmentDate = new Date(app.startTime).toISOString().split('T')[0];
        return appointmentDate === dateFilter;
      });
    }
    
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

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this appointment?");
    if (!confirm) return;

    try {
      await axios.delete(`admin/delete/${id}`);
      const updatedAppointments = appointments.filter((appt) => appt.id !== id);
      setAppointments(updatedAppointments);
      setFilteredAppointments(updatedAppointments);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert("Something went wrong while deleting!");
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
    <div className="w-full min-h-screen bg-gray-50 font-sans flex flex-col">
      <header className="bg-gradient-to-r from-indigo-800 to-indigo-600 text-white py-3 px-6 flex flex-col md:flex-row items-center justify-between shadow-md">
        <div className="flex items-center space-x-2 md:space-x-6 mb-2 md:mb-0">
          <div className="flex items-center">
            <div className=" p-1 shadow-sm">
<img 
  src={logo} 
  alt="Genesis Virtue Logo" 
  className="h-10 w-auto"
/>
            </div>
            <span className="ml-2 text-lg font-poppins  font-bold tracking-wide"></span>
          </div>
          <div className="flex space-x-1 overflow-x-auto whitespace-nowrap">
            {/*<button 
              onClick={() => setShowAddService(true)}
              className="text-sm font-poppins flex items-center hover:bg-indigo-700 px-3 py-1 rounded transition-colors"
            >
              <span className="material-symbols-outlined text-sm mr-1">add</span>
              Lägg till tjänster
              </button>*/}
          </div>
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <input 
              type="text" 
              placeholder="Sök tidbokning" 
              className="bg-indigo-700 font-poppins rounded-lg py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full placeholder-indigo-200" 
              value={nameFilter}
              onChange={handleNameFilterChange}
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-sm">search</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-9 h-9 bg-indigo-600 rounded-full text-xs hover:bg-indigo-500 transition-colors cursor-pointer shadow-sm">
              <span className="material-symbols-outlined text-sm">notifications</span>
            </div>
            <div className="flex items-center justify-center w-9 h-9 bg-indigo-600 rounded-full text-xs hover:bg-indigo-500 transition-colors cursor-pointer shadow-sm">
              <span className="material-symbols-outlined text-sm">apps</span>
            </div>
            <div className="flex items-center justify-center w-9 h-9 bg-yellow-400 rounded-full text-indigo-800 font-bold text-xs hover:bg-yellow-300 transition-colors cursor-pointer shadow-sm">
              N
            </div>
          </div>
        </div>
      </header>

      {showAddService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center bg-indigo-700 text-white p-5 rounded-t-xl">
              <h3 className="text-lg font-semibold tracking-wide">Lägg till ny tjänst</h3>
              <button 
                onClick={() => setShowAddService(false)}
                className="text-white hover:text-indigo-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Välj kategori</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Anställd                </label>
                <select
                  name="employee"
                  value={formData.employee}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Välj anställd</option>
                  {employees.map((emp, index) => (
                    <option key={index} value={emp}>{emp}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Tjänstnamn
             </label>
                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ange tjänstnamn"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Varaktighet (minuter)
               </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="30"
                  min="1"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddService(false)}
                  className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                Avbryt
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
                >
Spara tjänst

</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white py-3 px-6 border-b shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex flex-wrap items-center gap-3 mb-3 md:mb-0">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors shadow-sm bg-white">
                <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2 2 6.48 2 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors shadow-sm bg-white">
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 4H5c-1.1 0-2 .9-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className="flex items-center space-x-1">
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm cursor-pointer transition-colors shadow-sm ${
                    employeeFilter === 'N' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  onClick={() => setEmployeeFilter(employeeFilter === 'N' ? null : 'N')}
                >
                  N
                </div>
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm cursor-pointer transition-colors shadow-sm ${
                    employeeFilter === 'A' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  onClick={() => setEmployeeFilter(employeeFilter === 'A' ? null : 'A')}
                >
                  A
                </div>
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm cursor-pointer transition-colors shadow-sm ${
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
                  placeholder="Filtrera namn/tjänst" 
                  className="border border-gray-300 rounded-lg py-1.5 px-3 text-sm w-40 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  value={nameFilter}
                  onChange={handleNameFilterChange}
                />
              </div>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <button className="px-3 py-1.5 hover:bg-gray-100 transition-colors bg-gray-50">
                  <span className="material-symbols-outlined text-sm">view_list</span>
                </button>
                <button className="px-3 py-1.5 hover:bg-gray-100 transition-colors">
                  <span className="material-symbols-outlined text-sm">grid_view</span>
                </button>
                <button className="px-3 py-1.5 hover:bg-gray-100 transition-colors">
                  <span className="material-symbols-outlined text-sm">person</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="bg-blue-600 rounded-lg px-3 py-1.5 text-white text-xs font-medium shadow-sm">
                Bokad                </div>
                <div className="bg-blue-100 rounded-lg px-3 py-1.5 text-blue-700 text-xs font-medium hover:bg-blue-200 transition-colors cursor-pointer shadow-sm">
                Anlänt                </div>
                <div className="bg-blue-100 rounded-lg px-3 py-1.5 text-blue-700 text-xs font-medium hover:bg-blue-200 transition-colors cursor-pointer shadow-sm">
                Pågående                </div>
                <div className="bg-blue-100 rounded-lg px-3 py-1.5 text-blue-700 text-xs font-medium hover:bg-blue-200 transition-colors cursor-pointer shadow-sm">
                Granskad                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-3 md:mt-0">
              <input 
                type="date" 
                className="border border-gray-300 rounded-lg p-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <button 
                className={`border border-gray-300 rounded-lg px-4 py-1.5 text-sm hover:bg-gray-50 transition-colors font-medium shadow-sm ${
                  dateFilter === selectedDate ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white'
                }`}
                onClick={() => {
                  if (selectedDate) {
                    setDateFilter(selectedDate);
                  }
                }}
              >
                Sätt datum
              </button>
              <button 
                className={`border border-gray-300 rounded-lg px-4 py-1.5 text-sm hover:bg-gray-100 transition-colors font-medium shadow-sm ${
                  dateFilter === new Date().toISOString().split('T')[0] ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white'
                }`}
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  setSelectedDate(today);
                  setDateFilter(today);
                }}
              >
              Idag
              </button>
              {(dateFilter || employeeFilter || nameFilter) && (
                <button 
                  className="border border-gray-300 rounded-lg px-4 py-1.5 text-sm hover:bg-gray-100 transition-colors font-medium ml-2 bg-white shadow-sm"
                  onClick={() => {
                    setDateFilter(null);
                    setEmployeeFilter(null);
                    setNameFilter('');
                    setSelectedDate('');
                  }}
                >
                Rensa filter

              </button>
              )}
            </div>
          </div>
        </div>
  
        <div className="flex-1 overflow-auto">
          <div className="min-w-full">
            <table className="min-w-full bg-white border-collapse">
              <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="py-4 px-6 font-poppins text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Boknings-ID</th>
                  <th className="py-4 px-6 font-poppins text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Kundens namn</th>
                  <th className="py-4 px-6 font-poppins text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Tjänst</th>
                  <th className="py-4 px-6 font-poppins text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Redigera</th>
                  <th className="py-4 px-6 font-poppins text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Pris för service</th>
                  <th className="py-4 px-6 font-poppins text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Bokningsdatum</th>
                  <th className="py-4 px-6 font-poppins text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Tid</th>
                  <th className="py-4 px-6 font-poppins text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Bokningsstatus</th>
                  <th className="py-4 px-6 font-poppins text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Mekaniker namn</th>
                  <th className="py-4 px-6 font-poppins text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Visa detaljer</th>
                  <th className="py-4 px-6 font-poppins text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Radera bokning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
  {filteredAppointments.map((appointment) => (
    <tr key={appointment.id} className="hover:bg-blue-50 transition-colors">
      <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">{appointment.id}</td>

      <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">{appointment.user?.name || '-'}</td>

      <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">
        {appointment.service?.serviceName || '-'}
      </td>

      <td className="py-4 px-6 whitespace-nowrap">
        <button className="bg-blue-500 text-white rounded-md p-1.5 hover:bg-blue-600 transition-colors shadow-sm">
          <Edit className="w-4 h-4" />
        </button>
      </td>

      <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">
        {appointment.service?.price || '-'} SEK
      </td>

      <td className="py-4 px-6 text-sm text-gray-700 whitespace-nowrap">
        {new Date(appointment.startTime).toLocaleDateString()}
      </td>

      <td className="py-4 px-6 text-sm text-gray-700 whitespace-nowrap">
        {new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </td>

      <td className="py-4 px-6 whitespace-nowrap">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          appointment.status?.toUpperCase() === 'BOOKED' ? 'bg-blue-100 text-blue-800' :
          appointment.status?.toUpperCase() === 'COMPLETED' ? 'bg-green-100 text-green-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {appointment.status?.toUpperCase() || 'BOOKED'}
        </span>
      </td>

      <td className="py-4 px-6 text-sm font-medium text-gray-700 whitespace-nowrap">
        {appointment.employee?.name || '-'}
      </td>

      <td className="py-4 px-6 whitespace-nowrap">
        <button 
          onClick={() => fetchUserDetails(appointment.user?.userId)}
          className="text-indigo-600 hover:text-indigo-800 transition-colors p-1.5 rounded-full hover:bg-indigo-50"
        >
          <Eye className="w-5 h-5" />
        </button>
      </td>

      <td className="py-4 px-6 whitespace-nowrap">
        <button 
          onClick={() => handleDelete(appointment.id)}
          className="text-red-500 hover:text-red-700 transition-colors p-1.5 rounded-full hover:bg-red-50"
        >
          <Trash className="w-5 h-5" />
        </button>
      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
        </div>
      </div>

      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center bg-gradient-to-r from-indigo-700 to-indigo-600 text-white p-6">
              <h3 className="text-xl font-semibold tracking-wide">User Details</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-white hover:text-indigo-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="font-medium text-gray-600 w-36">Registration No:</span>
                  <span className="text-gray-900 font-medium">{selectedUser.registrationNo}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-gray-600 w-36">Full Name:</span>
                  <span className="text-gray-900 font-medium">{selectedUser.name}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-gray-600 w-36">Email Address:</span>
                  <a 
                    href={`mailto:${selectedUser.email}`}
                    className="text-gray-900 font-medium break-all hover:text-indigo-600 transition-colors"
                  >
                    {selectedUser.email}
                  </a>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-gray-600 w-36">Phone Number:</span>
                  <span className="text-gray-900 font-medium">{selectedUser.phoneNo}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;


/*import { useState, useEffect } from 'react';
import axios from "../../axiosConfig";
import { Edit, Eye, X, Trash } from 'lucide-react';
import logo from '../Images/speedy-tyres-logo.png';

const AdminDashboard = () => {
  const [showAddService, setShowAddService] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [employeeFilter, setEmployeeFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [nameFilter, setNameFilter] = useState('');
  const [formData, setFormData] = useState({
    serviceName: '',
    duration: '',
    employee: '',
    category: ''
  });

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

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      setSelectedUser(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const openGoogleCalendar = (appointment) => {
    const startTime = new Date(appointment.startTime);
    const endTime = new Date(startTime.getTime() + (appointment.service?.duration || 30) * 60000);
    
    // Format dates for Google Calendar (YYYYMMDDTHHmmssZ)
    const formatDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };
    
    const start = formatDate(startTime);
    const end = formatDate(endTime);
    
    const title = encodeURIComponent(appointment.service?.serviceName || 'Appointment');
    const details = encodeURIComponent(
      `Customer: ${appointment.user?.name || '-'}\n` +
      `Service: ${appointment.service?.serviceName || '-'}\n` +
      `Employee: ${appointment.employee?.name || '-'}`
    );
    
    const location = encodeURIComponent('Your Business Location');
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${start}/${end}&text=${title}&details=${details}&location=${location}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  useEffect(() => {
    let filtered = [...appointments];
    
    if (employeeFilter) {
      filtered = filtered.filter(app => {
        const employeeName = app.employee?.name || '';
        return employeeName.charAt(0).toUpperCase() === employeeFilter;
      });
    }
    
    if (dateFilter) {
      filtered = filtered.filter(app => {
        const appointmentDate = new Date(app.startTime).toISOString().split('T')[0];
        return appointmentDate === dateFilter;
      });
    }
    
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

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this appointment?");
    if (!confirm) return;

    try {
      await axios.delete(`admin/delete/${id}`);
      const updatedAppointments = appointments.filter((appt) => appt.id !== id);
      setAppointments(updatedAppointments);
      setFilteredAppointments(updatedAppointments);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert("Something went wrong while deleting!");
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
    <div className="w-full min-h-screen bg-gray-50 font-sans flex flex-col">
      <header className="bg-gradient-to-r from-indigo-800 to-indigo-600 text-white py-3 px-6 flex flex-col md:flex-row items-center justify-between shadow-md">
        <div className="flex items-center space-x-2 md:space-x-6 mb-2 md:mb-0">
          <div className="flex items-center">
            <div className=" p-1 shadow-sm">
              <img 
                src={logo} 
                alt="Genesis Virtue Logo" 
                className="h-10 w-auto"
              />
            </div>
            <span className="ml-2 text-lg font-poppins  font-bold tracking-wide"></span>
          </div>
          <div className="flex space-x-1 overflow-x-auto whitespace-nowrap">
            <button 
              onClick={() => setShowAddService(true)}
              className="text-sm font-poppins flex items-center hover:bg-indigo-700 px-3 py-1 rounded transition-colors"
            >
              <span className="material-symbols-outlined text-sm mr-1">add</span>
              Lägg till tjänster
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <input 
              type="text" 
              placeholder="Sök tidbokning" 
              className="bg-indigo-700 font-poppins rounded-lg py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full placeholder-indigo-200" 
              value={nameFilter}
              onChange={handleNameFilterChange}
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-sm">search</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-9 h-9 bg-indigo-600 rounded-full text-xs hover:bg-indigo-500 transition-colors cursor-pointer shadow-sm">
              <span className="material-symbols-outlined text-sm">notifications</span>
            </div>
            <div className="flex items-center justify-center w-9 h-9 bg-indigo-600 rounded-full text-xs hover:bg-indigo-500 transition-colors cursor-pointer shadow-sm">
              <span className="material-symbols-outlined text-sm">apps</span>
            </div>
            <div className="flex items-center justify-center w-9 h-9 bg-yellow-400 rounded-full text-indigo-800 font-bold text-xs hover:bg-yellow-300 transition-colors cursor-pointer shadow-sm">
              N
            </div>
          </div>
        </div>
      </header>

      {showAddService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center bg-indigo-700 text-white p-5 rounded-t-xl">
              <h3 className="text-lg font-semibold tracking-wide">Lägg till ny tjänst</h3>
              <button 
                onClick={() => setShowAddService(false)}
                className="text-white hover:text-indigo-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Välj kategori</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Anställd                </label>
                <select
                  name="employee"
                  value={formData.employee}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Välj anställd</option>
                  {employees.map((emp, index) => (
                    <option key={index} value={emp}>{emp}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Tjänstnamn
             </label>
                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ange tjänstnamn"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Varaktighet (minuter)
               </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="30"
                  min="1"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddService(false)}
                  className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                Avbryt
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
                >
Spara tjänst
</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white py-3 px-6 border-b shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex flex-wrap items-center gap-3 mb-3 md:mb-0">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors shadow-sm bg-white">
                <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2 2 6.48 2 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors shadow-sm bg-white">
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 4H5c-1.1 0-2 .9-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
<button 
  className="p-2 rounded-full hover:bg-gray-100 transition-colors shadow-sm bg-white"
  onClick={() => {
    // Create a mock appointment object with the current date/time
    const mockAppointment = {
      startTime: new Date(),
      service: {
        duration: 30,
        serviceName: 'Appointment'
      },
      user: {
        name: 'Customer'
      },
      employee: {
        name: 'Employee'
      }
    };
    openGoogleCalendar(mockAppointment);
  }}
>
  <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 4H5c-1.1 0-2 .9-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
</button>              <div className="flex items-center space-x-1">
                <div 
                  className={`w-7 h-7 rounded-full font-sans flex items-center justify-center text-black text-sm cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 bg-gray-200 hover:bg-gray-300 shadow-md border-2 border-gray-300 ${
                    employeeFilter === 'N' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  onClick={() => setEmployeeFilter(employeeFilter === 'N' ? null : 'N')}
                >
                  N
                </div>
                <div 
                  className={`w-7 h-7 rounded-full flex font-sans items-center justify-center text-black text-sm cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 bg-gray-200 hover:bg-gray-300 shadow-md border-2 border-gray-300 ${
                    employeeFilter === 'A' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  onClick={() => setEmployeeFilter(employeeFilter === 'A' ? null : 'A')}
                >
                  A
                </div>
                <div 
                  className={`w-7 h-7 rounded-full flex font-sans items-center justify-center text-black text-sm cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 bg-gray-200 hover:bg-gray-300 shadow-md border-2 border-gray-300 ${
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
                  placeholder="Filtrera namn/tjänst" 
                  className="border border-gray-300 rounded-lg py-1.5 px-3 text-sm w-40 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                  value={nameFilter}
                  onChange={handleNameFilterChange}
                />
              </div>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <button className="px-3 py-1.5 hover:bg-gray-100 transition-colors bg-gray-50">
                  <span className="material-symbols-outlined text-sm">view_list</span>
                </button>
                <button className="px-3 py-1.5 hover:bg-gray-100 transition-colors">
                  <span className="material-symbols-outlined text-sm">grid_view</span>
                </button>
                <button className="px-3 py-1.5 hover:bg-gray-100 transition-colors">
                  <span className="material-symbols-outlined text-sm">person</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="bg-blue-600 rounded-lg px-3 py-1.5 text-white text-xs font-medium shadow-sm">
                Bokad                </div>
                <div className="bg-blue-100 rounded-lg px-3 py-1.5 text-blue-700 text-xs font-medium hover:bg-blue-200 transition-colors cursor-pointer shadow-sm">
                Anlänt                </div>
                <div className="bg-blue-100 rounded-lg px-3 py-1.5 text-blue-700 text-xs font-medium hover:bg-blue-200 transition-colors cursor-pointer shadow-sm">
                Pågående                </div>
                <div className="bg-blue-100 rounded-lg px-3 py-1.5 text-blue-700 text-xs font-medium hover:bg-blue-200 transition-colors cursor-pointer shadow-sm">
                Granskad                </div>
              </div>
              <div 
  className={`w-7 h-7 rounded-full flex items-center justify-center text-black text-lg cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 bg-gray-200 hover:bg-gray-300 shadow-md border-2 border-gray-300`}
>
  i
</div>

            </div>
            
            <div className="flex items-center space-x-3 mt-3 md:mt-0">
              <input 
                type="date" 
                className="border border-gray-300 rounded-lg p-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <button 
                className={`border border-gray-300 rounded-lg px-4 py-1.5 text-sm hover:bg-gray-50 transition-colors font-medium shadow-sm ${
                  dateFilter === selectedDate ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white'
                }`}
                onClick={() => {
                  if (selectedDate) {
                    setDateFilter(selectedDate);
                  }
                }}
              >
                Sätt datum
              </button>
              <button 
                className={`border border-gray-300 rounded-lg px-4 py-1.5 text-sm hover:bg-gray-100 transition-colors font-medium shadow-sm ${
                  dateFilter === new Date().toISOString().split('T')[0] ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white'
                }`}
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  setSelectedDate(today);
                  setDateFilter(today);
                }}
              >
              Idag
              </button>
              {(dateFilter || employeeFilter || nameFilter) && (
                <button 
                  className="border border-gray-300 rounded-lg px-4 py-1.5 text-sm hover:bg-gray-100 transition-colors font-medium ml-2 bg-white shadow-sm"
                  onClick={() => {
                    setDateFilter(null);
                    setEmployeeFilter(null);
                    setNameFilter('');
                    setSelectedDate('');
                  }}
                >
                Rensa filter
              </button>
              )}
            </div>
          </div>
        </div>
  
        <div className="flex-1 overflow-auto">
          <div className="min-w-full">
            <table className="min-w-full bg-white border-collapse">
              <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="py-4 px-6 font-poppins text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Boknings-ID</th>
                  <th className="py-4 px-6 font-poppins text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Kundens namn</th>
                  <th className="py-4 px-6 font-poppins text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Tjänst</th>
                  <th className="py-4 px-6 font-poppins text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Redigera</th>
                  <th className="py-4 px-6 font-poppins text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Pris för service</th>
                  <th className="py-4 px-6 font-poppins text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Bokningsdatum</th>
                  <th className="py-4 px-6 font-poppins text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Tid</th>
                  <th className="py-4 px-6 font-poppins text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Bokningsstatus</th>
                  <th className="py-4 px-6 font-poppins text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Mekaniker namn</th>
                  <th className="py-4 px-6 font-poppins text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Visa detaljer</th>
                  <th className="py-4 px-6 font-poppins text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Radera bokning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-blue-50 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">{appointment.id}</td>

                    <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">{appointment.user?.name || '-'}</td>

                    <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {appointment.service?.serviceName || '-'}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <button className="bg-blue-500 text-white rounded-md p-1.5 hover:bg-blue-600 transition-colors shadow-sm">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>

                    <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {appointment.service?.price || '-'} SEK
                    </td>

                    <td className="py-4 px-6 text-sm text-gray-700 whitespace-nowrap">
                      {new Date(appointment.startTime).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6 text-sm text-gray-700 whitespace-nowrap">
                      {new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        appointment.status?.toUpperCase() === 'BOOKED' ? 'bg-blue-100 text-blue-800' :
                        appointment.status?.toUpperCase() === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status?.toUpperCase() || 'BOOKED'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-sm font-medium text-gray-700 whitespace-nowrap">
                      {appointment.employee?.name || '-'}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <button 
                        onClick={() => fetchUserDetails(appointment.user?.userId)}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors p-1.5 rounded-full hover:bg-indigo-50"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <button 
                        onClick={() => handleDelete(appointment.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1.5 rounded-full hover:bg-red-50"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center bg-gradient-to-r from-indigo-700 to-indigo-600 text-white p-6">
              <h3 className="text-xl font-semibold tracking-wide">User Details</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-white hover:text-indigo-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="font-medium text-gray-600 w-36">Registration No:</span>
                  <span className="text-gray-900 font-medium">{selectedUser.registrationNo}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-gray-600 w-36">Full Name:</span>
                  <span className="text-gray-900 font-medium">{selectedUser.name}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-gray-600 w-36">Email Address:</span>
                  <a 
                    href={`mailto:${selectedUser.email}`}
                    className="text-gray-900 font-medium break-all hover:text-indigo-600 transition-colors"
                  >
                    {selectedUser.email}
                  </a>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-gray-600 w-36">Phone Number:</span>
                  <span className="text-gray-900 font-medium">{selectedUser.phoneNo}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;*/