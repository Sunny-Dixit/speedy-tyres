import React, { useEffect, useState } from 'react';
import axios from "../../axiosConfig";
import { Eye, Edit, Trash, X, Search } from 'lucide-react';

const AppointmentDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('https://api.speedy-tyres-v3.up7news.in/admin/appointment');
        setAppointments(response.data);
        setFilteredAppointments(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`https://api.speedy-tyres-v3.up7news.in/api/users/${userId}`);
      setSelectedUser(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleSearch = () => {
    if (!searchTerm && !searchDate) {
      setFilteredAppointments(appointments);
      return;
    }

    const filtered = appointments.filter((appointment) => {
      const matchesSearchTerm =
        appointment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.service.serviceName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate =
        !searchDate ||
        new Date(appointment.startTime).toISOString().split('T')[0] === searchDate;

      return matchesSearchTerm && matchesDate;
    });

    setFilteredAppointments(filtered);
  };

  const handleReset = () => {
    setSearchTerm('');
    setSearchDate('');
    setFilteredAppointments(appointments);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, searchDate, appointments]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this appointment?");
    if (!confirm) return;

    try {
      await axios.delete(`https://api.speedy-tyres-v3.up7news.in/admin/delete/${id}`);
      const updatedAppointments = appointments.filter((appt) => appt.id !== id);
      setAppointments(updatedAppointments);
      setFilteredAppointments(updatedAppointments);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert("Something went wrong while deleting!");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-100 via-pink-100 to-yellow-100 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
      <h1 className="text-3xl font-bold text-gray-700">Bokningsöversikt</h1>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Sök efter namn, mekaniker eller tjänst..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              återställa
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4 text-gray-600">
      Visar  {filteredAppointments.length} av  {appointments.length} bokningar
      </div>

      <div className="bg-white shadow-md rounded-2xl overflow-hidden">
        <div className="overflow-y-auto max-h-[60vh] scrollbar-hide">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-blue-200 to-teal-200 text-gray-700">
              <tr>
              <th className="font-bold p-4 text-left min-w-[150px]">Användarnamn</th>
              <th className="font-bold p-4 text-left min-w-[120px]">Datum</th>
              <th className="font-bold p-4 text-left min-w-[100px]">Tid</th>
              <th className="font-bold p-4 text-left min-w-[150px]">Mekaniker</th>
              <th className="font-bold p-4 text-left min-w-[180px]">Tjänst</th>
              <th className="font-bold p-4 text-left min-w-[100px]">Pris</th>
              <th className="font-bold p-4 text-left min-w-[120px]">Status</th>
              <th className="font-bold p-4 text-left min-w-[150px]">Åtgärd</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-4 text-center">Loading appointments...</td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-gray-500">
                  Inga bokningar hittades som matchar dina sökkriterier
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment, index) => (
                  <tr key={index} className="border-b hover:bg-blue-50 transition-colors">
                    <td className="p-4">{appointment.user.name}</td>
                    <td className="p-4">{new Date(appointment.startTime).toLocaleDateString()}</td>
                    <td className="p-4">
                      {new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4">{appointment.employee.name}</td>
                    <td className="p-4">{appointment.service.serviceName}</td>
                    <td className="p-4">{appointment.service.price} SEK</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-white text-sm bg-teal-500">
                        Success
                      </span>
                    </td>
                    <td className="p-4 flex space-x-2">
                      <Eye
                        className="cursor-pointer text-blue-500 hover:scale-110 transition-transform"
                        onClick={() => fetchUserDetails(appointment.user.userId)}
                      />
                      <Edit className="cursor-pointer text-green-500 hover:scale-110 transition-transform" />
                      <Trash
                        className="cursor-pointer text-red-500 hover:scale-110 transition-transform"
                        onClick={() => handleDelete(appointment.id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] sm:w-[450px] p-6 relative animate-scaleUp transition-transform duration-300">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-1 shadow-md transition-transform hover:scale-110"
            >
              <X size={20} />
            </button>

            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-center py-3 rounded-xl mb-4 shadow-lg">
              <h2 className="text-2xl font-bold">User Details</h2>
            </div>

            <div className="space-y-4 text-gray-700">
              <div className="p-4 bg-gray-100 rounded-xl shadow-sm space-y-2">
                <p><span className="font-semibold">Registration No:</span> {selectedUser.registrationNo}</p>
                <p><span className="font-semibold">Name:</span> {selectedUser.name}</p>
                <p><span className="font-semibold">Email:</span> {selectedUser.email}</p>
                <p><span className="font-semibold">Phone:</span> {selectedUser.phoneNo}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AppointmentDashboard;

/*
import React, { useEffect, useState } from 'react';
import axios from "../../axiosConfig";
import { Eye, Edit, Trash, X, Search } from 'lucide-react';

const AppointmentDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [highlightedAppointmentIds, setHighlightedAppointmentIds] = useState(() => {
    const stored = localStorage.getItem('highlightedAppointmentIds');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('admin/appointment');
        setAppointments(response.data);
        setFilteredAppointments(response.data);

        // Get already viewed appointment IDs
        const viewedIds = JSON.parse(localStorage.getItem('highlightedAppointmentIds')) || [];

        // Filter for new ones
        const newIds = response.data
          .filter(appointment => !viewedIds.includes(appointment.id))
          .map(appt => appt.id);

        setHighlightedAppointmentIds(prev => [...new Set([...prev, ...newIds])]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const fetchUserDetails = async (userId, appointmentId) => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      setSelectedUser(response.data);
      setShowModal(true);

      // Remove the appointmentId from highlights
      const updated = highlightedAppointmentIds.filter(id => id !== appointmentId);
      setHighlightedAppointmentIds(updated);
      localStorage.setItem('highlightedAppointmentIds', JSON.stringify(updated));
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleSearch = () => {
    if (!searchTerm && !searchDate) {
      setFilteredAppointments(appointments);
      return;
    }

    const filtered = appointments.filter((appointment) => {
      const matchesSearchTerm =
        appointment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.service.serviceName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate =
        !searchDate ||
        new Date(appointment.startTime).toISOString().split('T')[0] === searchDate;

      return matchesSearchTerm && matchesDate;
    });

    setFilteredAppointments(filtered);
  };

  const handleReset = () => {
    setSearchTerm('');
    setSearchDate('');
    setFilteredAppointments(appointments);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, searchDate, appointments]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this appointment?");
    if (!confirm) return;

    try {
      await axios.delete(`admin/delete/${id}`);
      const updatedAppointments = appointments.filter((appt) => appt.id !== id);
      setAppointments(updatedAppointments);
      setFilteredAppointments(updatedAppointments);

      // Also remove from highlights if exists
      const updated = highlightedAppointmentIds.filter(aid => aid !== id);
      setHighlightedAppointmentIds(updated);
      localStorage.setItem('highlightedAppointmentIds', JSON.stringify(updated));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      alert("Something went wrong while deleting!");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-100 via-pink-100 to-yellow-100 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-3xl font-bold text-gray-700">Appointments Dashboard</h1>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search by name, mechanic, or service..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4 text-gray-600">
        Showing {filteredAppointments.length} of {appointments.length} appointments
      </div>

      <div className="bg-white shadow-md rounded-2xl overflow-hidden">
        <div className="overflow-y-auto max-h-[60vh] scrollbar-hide">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-blue-200 to-teal-200 text-gray-700">
              <tr>
                <th className="font-bold p-4 text-left min-w-[150px]">User Name</th>
                <th className="font-bold p-4 text-left min-w-[120px]">Date</th>
                <th className="font-bold p-4 text-left min-w-[100px]">Time</th>
                <th className="font-bold p-4 text-left min-w-[150px]">Mechanic</th>
                <th className="font-bold p-4 text-left min-w-[180px]">Service</th>
                <th className="font-bold p-4 text-left min-w-[100px]">Price</th>
                <th className="font-bold p-4 text-left min-w-[120px]">Status</th>
                <th className="font-bold p-4 text-left min-w-[150px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-4 text-center">Loading appointments...</td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-gray-500">
                    No appointments found matching your search criteria
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment, index) => {
                  const isHighlighted = highlightedAppointmentIds.includes(appointment.id);

                  return (
                    <tr
                      key={index}
                      className={`border-b transition-colors ${isHighlighted ? 'bg-yellow-100 animate-pulse' : 'hover:bg-blue-50'}`}
                    >
                      <td className="p-4">{appointment.user.name}</td>
                      <td className="p-4">{new Date(appointment.startTime).toLocaleDateString()}</td>
                      <td className="p-4">
                        {new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-4">{appointment.employee.name}</td>
                      <td className="p-4">{appointment.service.serviceName}</td>
                      <td className="p-4">{appointment.service.price} SEK</td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-white text-sm bg-teal-500">
                          Success
                        </span>
                      </td>
                      <td className="p-4 flex space-x-2">
                        <Eye
                          className="cursor-pointer text-blue-500 hover:scale-110 transition-transform"
                          onClick={() => fetchUserDetails(appointment.user.userId, appointment.id)}
                        />
                        <Edit className="cursor-pointer text-green-500 hover:scale-110 transition-transform" />
                        <Trash
                          className="cursor-pointer text-red-500 hover:scale-110 transition-transform"
                          onClick={() => handleDelete(appointment.id)}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] sm:w-[450px] p-6 relative animate-scaleUp transition-transform duration-300">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-1 shadow-md transition-transform hover:scale-110"
            >
              <X size={20} />
            </button>

            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-center py-3 rounded-xl mb-4 shadow-lg">
              <h2 className="text-2xl font-bold">User Details</h2>
            </div>

            <div className="space-y-4 text-gray-700">
              <div className="p-4 bg-gray-100 rounded-xl shadow-sm space-y-2">
                <p><span className="font-semibold">Registration No:</span> {selectedUser.registrationNo}</p>
                <p><span className="font-semibold">Name:</span> {selectedUser.name}</p>
                <p><span className="font-semibold">Email:</span> {selectedUser.email}</p>
                <p><span className="font-semibold">Phone:</span> {selectedUser.phoneNo}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AppointmentDashboard;*/


