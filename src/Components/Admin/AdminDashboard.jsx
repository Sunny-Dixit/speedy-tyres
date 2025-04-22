/*

import { useState, useEffect } from 'react';
import axios from "../../axiosConfig";
import { Edit, Eye, X, Trash } from 'lucide-react';
import logo from '../Images/logo-removebg-preview.png';
import '../../App.css';

const AdminDashboard = () => {
  const [showAddService, setShowAddService] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [employeeFilter, setEmployeeFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [nameFilter, setNameFilter] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [formData, setFormData] = useState({
    serviceName: '',
    duration: '',
    employee: '',
    category: ''
  });
  const [calendarData, setCalendarData] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  const getSummaryData = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(app => {
      const appointmentDate = new Date(app.startTime).toISOString().split('T')[0];
      return appointmentDate === today;
    });
  
    const totalAppointments = todayAppointments.length;
    const totalPrice = todayAppointments.reduce((sum, app) => {
      return sum + (parseFloat(app.service?.price) || 0);
    }, 0);
  
    const employeeMap = {};
  
    todayAppointments.forEach(app => {
      const employee = app.employee?.name || 'Unknown';
      const price = parseFloat(app.service?.price) || 0;
  
      if (!employeeMap[employee]) {
        employeeMap[employee] = { employee, count: 0, price: 0 };
      }
  
      employeeMap[employee].count += 1;
      employeeMap[employee].price += price;
    });
  
    const appointmentsByEmployee = Object.values(employeeMap);
  
    return {
      totalAppointments,
      totalPrice,
      appointmentsByEmployee,
    };
  };

  const handleCalendarClick = () => {
    const calendarEvents = appointments.map(appointment => ({
      title: appointment.service?.serviceName || 'Unknown Event',
      start: new Date(appointment.startTime),
      end: new Date(new Date(appointment.startTime).getTime() + (appointment.service?.duration || 60) * 60000),
      color: appointment.status?.toUpperCase() === 'BOOKED' ? '#3b82f6' : 
             appointment.status?.toUpperCase() === 'COMPLETED' ? '#10b981' : '#f59e0b'
    }));
    setCalendarData(calendarEvents);
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Generate days for the current month
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth.getMonth(), currentMonth.getFullYear());
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const events = calendarData.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.toDateString() === date.toDateString();
      });
      days.push({ date, events });
    }
    return days;
  };

  // Handler to return to all appointments view
  const handleBackToAppointments = () => {
    setCalendarData(null);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans flex flex-col">
      <header className="bg-gradient-to-r from-indigo-800 to-indigo-600 text-white py-3 px-6 flex flex-col md:flex-row items-center justify-between shadow-md">
        <div className="flex items-center space-x-2 md:space-x-6 mb-2 md:mb-0">
          <div className="flex items-center">
            <div className="p-1 shadow-sm">
              <img 
                src={logo} 
                alt="Genesis Virtue Logo" 
                className="h-10 w-auto"
              />
            </div>
            <span className="ml-2 text-lg font-poppins font-bold tracking-wide"></span>
          </div>
          <div className="flex space-x-1 overflow-x-auto whitespace-nowrap">
            <button 
              onClick={() => setShowAddService(true)}
              className="text-sm font-inter flex items-center hover:bg-indigo-700 px-3 py-1 rounded transition-colors"
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
              className="bg-indigo-700 font-inter rounded-lg py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full placeholder-indigo-200" 
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
            <div className="flex items-center font-inter justify-center w-9 h-9 bg-yellow-400 rounded-full text-indigo-800 font-bold text-xs hover:bg-yellow-300 transition-colors cursor-pointer shadow-sm">
              N
            </div>
          </div>
        </div>
      </header>

      {showAddService && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
      <div className="flex justify-between items-center text-black p-5 rounded-t-xl">
        <h3 className="text-md font-inter font-semibold tracking-wide">Lägg till ny tjänst</h3>
        <button 
          onClick={() => setShowAddService(false)}
          className="text-white hover:text-indigo-200 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="block font-inter text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full border text-sm font-inter border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="">Välj kategori</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-inter text-sm font-medium text-gray-700 mb-2">
            Pris (SEK)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price || ''}
            onChange={handleInputChange}
            className="w-full text-sm font-inter font-semibold border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Ange pris"
            min="0"
            required
          />
        </div>
        <div>
          <label className="block font-inter text-sm font-medium text-gray-700 mb-2">
            Tjänstnamn
          </label>
          <input
            type="text"
            name="serviceName"
            value={formData.serviceName}
            onChange={handleInputChange}
            className="w-full text-sm font-inter font-semibold border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Ange tjänstnamn"
            required
          />
        </div>

        <div>
          <label className="block font-inter text-sm font-medium text-gray-700 mb-2">
            Varaktighet (minuter)
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            className="w-full text-sm font-semibold font-inter border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="30"
            min="1"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => setShowAddService(false)}
            className="px-5 py-2 text-md font-inter rounded-lg shadow-sm hover:bg-gray-500 transition-colors font-medium"
          >
            Avbryt
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-md font-inter text-black rounded-lg hover:bg-gray-500 transition-colors font-medium shadow-sm"
          >
            Spara tjänst
          </button>
        </div>
      </form>
    </div>
  </div>
)}      <div className="flex-1 flex flex-col">
        <div className="bg-white py-3 px-6 border-b shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex flex-wrap items-center gap-3 mb-3 md:mb-0">
              <button onClick={handleCalendarClick} className="p-2 rounded-full hover:bg-gray-100 transition-colors shadow-sm bg-white">
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 4H5c-1.1 0-2 .9-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className="flex items-center space-x-1">
                <div 
                  className="w-7 h-7 rounded-full font-inter flex items-center justify-center text-black text-sm cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 bg-gray-200 hover:bg-gray-300 shadow-md border-2 border-gray-300"
                  onClick={handleBackToAppointments}
                >
                  *
                </div>
                <div 
                  className={`w-7 h-7 rounded-full font-inter flex items-center justify-center text-black text-sm cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 bg-gray-200 hover:bg-gray-300 shadow-md border-2 border-gray-300 ${
                    employeeFilter === 'N' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  onClick={() => setEmployeeFilter(employeeFilter === 'N' ? null : 'N')}
                >
                  N
                </div>
                <div 
                  className={`w-7 h-7 rounded-full flex font-inter items-center justify-center text-black text-sm cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 bg-gray-200 hover:bg-gray-300 shadow-md border-2 border-gray-300 ${
                    employeeFilter === 'A' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  onClick={() => setEmployeeFilter(employeeFilter === 'A' ? null : 'A')}
                >
                  A
                </div>
                <div 
                  className={`w-7 h-7 rounded-full flex font-inter items-center justify-center text-black text-sm cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 bg-gray-200 hover:bg-gray-300 shadow-md border-2 border-gray-300 ${
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
                  className="border font-inter border-gray-300 rounded-lg py-1.5 px-3 text-sm w-40 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
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
                <div className="bg-blue-600 font-inter rounded-lg px-3 py-1.5 text-white text-xs font-medium shadow-sm">
                  Bokad
                </div>
                <div className="bg-blue-100 font-inter rounded-lg px-3 py-1.5 text-blue-700 text-xs font-medium hover:bg-blue-200 transition-colors cursor-pointer shadow-sm">
                  Anlänt
                </div>
                <div className="bg-blue-100 font-inter rounded-lg px-3 py-1.5 text-blue-700 text-xs font-medium hover:bg-blue-200 transition-colors cursor-pointer shadow-sm">
                  Pågående
                </div>
                <div className="bg-blue-100 font-inter rounded-lg px-3 py-1.5 text-blue-700 text-xs font-medium hover:bg-blue-200 transition-colors cursor-pointer shadow-sm">
                  Granskad
                </div>
              </div>
              <div 
                className={`w-7 h-7 rounded-full flex font-inter items-center justify-center text-black text-lg cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 bg-gray-200 hover:bg-gray-300 shadow-md border-2 border-gray-300`}
                onClick={() => setShowSummary(true)}
              >
                i
              </div>
            </div>
            
            <div className="flex items-center space-x-3 mt-3 md:mt-0">
              <input 
                type="date" 
                className="border border-gray-300 rounded-lg p-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" 
                value={selectedDate}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setSelectedDate(e.target.value);
                  setCurrentMonth(date);
                  setDateFilter(e.target.value);
                }}
              />
              <button 
                className={`border font-inter border-gray-300 rounded-lg px-4 py-1.5 text-sm hover:bg-gray-50 transition-colors font-medium shadow-sm ${
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
                className={`border font-inter border-gray-300 rounded-lg px-4 py-1.5 text-sm hover:bg-gray-100 transition-colors font-medium shadow-sm ${
                  dateFilter === new Date().toISOString().split('T')[0] ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white'
                }`}
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  setSelectedDate(today);
                  setCurrentMonth(new Date());
                  setDateFilter(today);
                }}
              >
                Idag
              </button>
              {(dateFilter || employeeFilter || nameFilter) && (
                <button 
                  className="border font-inter border-gray-300 rounded-lg px-4 py-1.5 text-sm hover:bg-gray-100 transition-colors font-medium ml-2 bg-white shadow-sm"
                  onClick={() => {
                    setDateFilter(null);
                    setEmployeeFilter(null);
                    setNameFilter('');
                    setSelectedDate(new Date().toISOString().split('T')[0]);
                    setCurrentMonth(new Date());
                  }}
                >
                  Rensa filter
                </button>
              )}
            </div>
          </div>
        </div>
  
        <div className="flex-1 overflow-y-auto max-h-screen min-h-[400px] hide-scrollbar">
        {calendarData && (
  <div className="p-2 sm:p-4 bg-white shadow-xl border border-gray-200 rounded-lg">
    <div className="flex justify-between items-center mb-2 sm:mb-4">
      <button
        onClick={prevMonth}
        className="px-2 sm:px-3 py-1 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-lg sm:text-xl"
      >
        ‹
      </button>
      <h2 className="text-xl sm:text-2xl md:text-4xl font-inter font-bold text-gray-800 tracking-wide">
        {currentMonth.toLocaleString("default", { month: "long" })}{" "}
        {currentMonth.getFullYear()}
      </h2>
      <button
        onClick={nextMonth}
        className="px-2 sm:px-3 py-1 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-lg sm:text-xl"
      >
        ›
      </button>
    </div>

    <div className="grid grid-cols-7 font-inter text-center text-gray-500 font-semibold text-xs sm:text-sm mb-1 sm:mb-2 uppercase tracking-wide">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day} className="py-1 sm:py-1.5">{day}</div>
      ))}
    </div>

    <div className="overflow-y-auto max-h-[70vh] sm:max-h-none">
      <div className="grid grid-cols-7 gap-0.5 sm:gap-px bg-gray-200 rounded-lg overflow-hidden">
        {Array.from({ length: 42 }, (_, i) => {
          const firstDay = getFirstDayOfMonth(
            currentMonth.getMonth(),
            currentMonth.getFullYear()
          );
          const daysInMonth = getDaysInMonth(
            currentMonth.getMonth(),
            currentMonth.getFullYear()
          );
          const dayIndex = i - firstDay + 1;
          let date = null;

          if (dayIndex > 0 && dayIndex <= daysInMonth) {
            date = new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              dayIndex
            );
          }

          const events = date
            ? calendarData.filter(
                (event) =>
                  new Date(event.start).toDateString() === date.toDateString()
              )
            : [];

          const isToday =
            date && new Date().toDateString() === date.toDateString();

          // Light rainbow color array
          const lightRainbowColors = [
            "#FFB6C1", // Light Pink (light red)
            "#FFDAB9", // Peach Puff (light orange)
            "#FFFFE0", // Light Yellow
            "#90EE90", // Light Green
            "#ADD8E6", // Light Blue
            "#B0C4DE", // Light Slate Blue (light indigo)
            "#E6E6FA"  // Lavender (light violet)
          ];

          return (
            <div
              key={i}
              className={`bg-white min-h-[40px] sm:min-h-[50px] md:min-h-[80px] lg:min-h-[120px] px-1 sm:px-2 py-1 flex flex-col border border-gray-100 relative ${
                !date ? "opacity-40 pointer-events-none" : ""
              }`}
            >
              {date && (
                <div className="flex justify-between text-xs sm:text-xs md:text-sm font-semibold text-gray-800 mb-0.5 sm:mb-1">
                  <span>{date.getDate()}</span>
                  {isToday && (
                    <span className="text-[6px] sm:text-[8px] md:text-[10px] bg-indigo-500 text-white px-0.5 sm:px-1 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                </div>
              )}

              <div className="flex font-inter flex-col gap-0.5 sm:gap-1 mt-auto">
                {events.map((event, idx) => {
                  const colorIndex = idx % lightRainbowColors.length;
                  return (
                    <div key={idx} className="p-0.5 sm:p-1 rounded-md" style={{ maxWidth: "120px" }}>
                      <div className="flex items-center bg-gray-50 p-0.5 sm:p-1 rounded-md">
                        <span
                          className="w-2 sm:w-3 h-2 sm:h-3 rounded-full mr-1 sm:mr-2"
                          style={{ backgroundColor: lightRainbowColors[colorIndex] }}
                          title={`${event.title} at ${new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                        ></span>
                        <div className="flex flex-col text-[6px] sm:text-[8px] md:text-[10px] lg:text-[11px] text-gray-700 font-medium">
                          <span className="font-bold">
                            {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="truncate">{event.title}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
)}          {!calendarData && (
            <div className="min-w-full">
              <table className="min-w-full bg-white border-collapse">
                <thead className="bg-gray-100 sticky top-0 z-10 shadow-md border">
                  <tr>
                    <th className="py-2 px-4 font-inter text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Boknings-ID</th>
                    <th className="py-2 px-4 font-inter text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Kundens namn</th>
                    <th className="py-2 px-4 font-inter text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Tjänst</th>
                    <th className="py-2 px-4 font-inter text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Redigera</th>
                    <th className="py-2 px-4 font-inter text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Pris för service</th>
                    <th className="py-2 px-4 font-inter text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Bokningsdatum</th>
                    <th className="py-2 px-4 font-inter text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Tid</th>
                    <th className="py-2 px-4 font-inter text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Bokningsstatus</th>
                    <th className="py-2 px-4 font-inter text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Mekaniker namn</th>
                    <th className="py-2 px-4 font-inter text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Visa detaljer</th>
                    <th className="py-2 px-4 font-inter text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Radera bokning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-blue-50 transition-colors">
                      <td className="py-4 px-4 font-inter text-sm font-medium text-gray-900 whitespace-nowrap">{appointment.id}</td>
                      <td className="py-4 px-4 font-inter text-sm font-medium text-gray-900 whitespace-nowrap">{appointment.user?.name || '-'}</td>
                      <td className="py-4 px-4 font-inter text-sm font-medium text-gray-900 whitespace-nowrap">
                        {appointment.service?.serviceName || '-'}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button className="bg-blue-500 text-white rounded-md p-1.5 hover:bg-blue-600 transition-colors shadow-sm">
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="py-4 px-4 font-inter text-sm font-medium text-gray-900 whitespace-nowrap">
                        {appointment.service?.price || '-'} SEK
                      </td>
                      <td className="py-4 px-4 font-inter text-sm text-gray-700 whitespace-nowrap">
                        {new Date(appointment.startTime)
                          .toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                          })
                          .replace(/\//g, '-')}
                      </td>
                      <td className="py-4 px-4 font-inter text-sm text-gray-700 whitespace-nowrap">
                        {new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-4 px-4 font-inter whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          appointment.status?.toUpperCase() === 'BOOKED' ? 'bg-blue-100 text-blue-800' :
                          appointment.status?.toUpperCase() === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status?.toUpperCase() || 'BOOKED'}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-inter text-sm font-medium text-gray-700 whitespace-nowrap">
                        {appointment.employee?.name || '-'}
                      </td>
                      <td className="py-4 px-4 font-inter whitespace-nowrap">
                        <button 
                          onClick={() => fetchUserDetails(appointment.user?.userId)}
                          className="text-indigo-600 hover:text-indigo-800 transition-colors p-1.5 rounded-full hover:bg-indigo-50"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
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
          )}
        </div>
        <div className="bg-white py-3 px-6 border-t text-center text-gray-500 text-sm">
          Powered By Genesis Virtue
        </div>
      </div>

      {showModal && selectedUser && (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50 animate-fadeIn">
    <div className="bg-white rounded-xl shadow-lg max-w-md overflow-hidden border border-gray-100 animate-scaleIn">
      <div className="flex justify-between items-center px-6 py-4 border-gray-100">
        <h3 className="text-md font-inter font-semibold text-gray-900">Användardetaljer</h3>
        <button 
          onClick={() => setShowModal(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>

      <div className="px-6 py-5 space-y-5">
        <div className="flex items-start">
          <span className="w-32 font-inter text-sm text-gray-500">Registreringsnr:</span>
          <span className="text-gray-900 font-inter text-sm">{selectedUser.registrationNo}</span>
        </div>
        <div className="flex items-start">
          <span className="w-32 text-sm font-inter text-gray-500">Fullständigt namn:</span>
          <span className="text-gray-900 font-inter text-sm">{selectedUser.name}</span>
        </div>
        <div className="flex items-start">
          <span className="w-32 text-sm font-inter text-gray-500">E-postadress:</span>
          <a 
            href={`mailto:${selectedUser.email}`}
            className="text-blue-500 font-inter hover:text-blue-600 hover:underline break-all text-sm"
          >
            {selectedUser.email}
          </a>
        </div>
        <div className="flex items-start">
          <span className="w-32 font-inter text-sm text-gray-500">Telefonnummer:</span>
          <span className="text-gray-900 font-inter text-sm">{selectedUser.phoneNo}</span>
        </div>
      </div>

      <div className="px-6 py-4 border-gray-100 flex justify-end space-x-3">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 font-inter text-sm rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition shadow-sm"
        >
          Stäng
        </button>
      </div>
    </div>
  </div>
)}

{showSummary && (
  <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden border border-gray-200">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-md font-inter font-semibold text-gray-900 leading-tight">Daglig sammanfattning</h3>
            <p className="text-xs font-inter text-gray-500 mt-1 tracking-wide">
              {new Date().toLocaleDateString('sv-SE')}
            </p>
          </div>
          <button 
            onClick={() => setShowSummary(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1"
            aria-label="Stäng"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border border-gray-100 rounded-lg">
              <p className="text-sm font-inter text-gray-500 mb-1">Bokningar</p>
              <p className="text-md font-semibold text-gray-900">
                {getSummaryData().totalAppointments}
              </p>
            </div>
            <div className="p-3 border border-gray-100 rounded-lg">
              <p className="text-sm font-inter text-gray-500 mb-1">Intäkter</p>
              <p className="text-md font-inter font-semibold text-gray-900">
                {getSummaryData().totalPrice.toLocaleString('sv-SE')} SEK
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h4 className="text-sm font-inter font-medium text-gray-700 mb-4">Bokningar per anställd</h4>
          <div className="space-y-3">
            {getSummaryData().appointmentsByEmployee.length > 0 ? (
              getSummaryData().appointmentsByEmployee.map((app) => (
                <div 
                  key={app.employee} 
                  className="flex justify-between font-inter items-center text-sm"
                >
                  <span className="font-medium font-inter text-gray-800">{app.employee}</span>
                  <span className="text-gray-600">
                    {app.count} bokning{app.count !== 1 ? 'ar' : ''}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm font-inter text-gray-500 text-center">Inga bokningar idag</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 font-inter border-t border-gray-200 flex justify-end">
        <button
          onClick={() => setShowSummary(false)}
          className="px-4 py-2 text-sm font-md font-inter text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
        >
          Stäng sammanfattning
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminDashboard;*/

import { useState, useEffect } from 'react';
import axios from "../../axiosConfig";
import { Edit, Eye, X, Trash } from 'lucide-react';
import logo from '../Images/logo-removebg-preview.png';
import '../../App.css';

const AdminDashboard = () => {
  const [showAddService, setShowAddService] = useState(false);
  const [showAssignEmployee, setShowAssignEmployee] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [employeeFilter, setEmployeeFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [nameFilter, setNameFilter] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [formData, setFormData] = useState({
    serviceName: '',
    price: '',
    duration: '',
    categoryId: '',
  });
  const [categories, setCategories] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]); // Track selected employee IDs
  const [calendarData, setCalendarData] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/category/all');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch appointments
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

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:8080/employee/');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
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

  const handleEmployeeChange = (e) => {
    const employeeId = parseInt(e.target.value);
    setSelectedEmployeeIds(prev => 
      e.target.checked ? [...prev, employeeId] : prev.filter(id => id !== employeeId)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        serviceName: formData.serviceName,
        price: formData.price,
        duration: parseInt(formData.duration),
        category: { id: parseInt(formData.categoryId) },
      };
      const response = await axios.post('service/create', payload);
      setSelectedServiceId(response.data.id); // Assuming the API returns the created service with an ID
      setShowAddService(false);
      setShowAssignEmployee(true);
    } catch (error) {
      console.error('Error creating service:', error);
      alert("Something went wrong while creating the service!");
    }
    setFormData({
      serviceName: '',
      price: '',
      duration: '',
      categoryId: '',
    });
  };

  const handleAssignEmployee = async (e) => {
    e.preventDefault();
    try {
      for (const employeeId of selectedEmployeeIds) {
        const payload = {
          serviceIds: [selectedServiceId],
        };
        await axios.put(`employee/${employeeId}/add-services`, payload);
        console.log("these are the payload",payload);

      }
      setShowAssignEmployee(false);
      setSelectedEmployeeIds([]);
      setSelectedServiceId(null);
      alert("Services assigned to employees successfully!");
    } catch (error) {
      console.error('Error assigning service to employees:', error);
      alert("Something went wrong while assigning the service!");
    }
  };

  const getSummaryData = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(app => {
      const appointmentDate = new Date(app.startTime).toISOString().split('T')[0];
      return appointmentDate === today;
    });
    const totalAppointments = todayAppointments.length;
    const totalPrice = todayAppointments.reduce((sum, app) => sum + (parseFloat(app.service?.price) || 0), 0);
    const employeeMap = {};
    todayAppointments.forEach(app => {
      const employee = app.employee?.name || 'Unknown';
      const price = parseFloat(app.service?.price) || 0;
      if (!employeeMap[employee]) {
        employeeMap[employee] = { employee, count: 0, price: 0 };
      }
      employeeMap[employee].count += 1;
      employeeMap[employee].price += price;
    });
    const appointmentsByEmployee = Object.values(employeeMap);
    return {
      totalAppointments,
      totalPrice,
      appointmentsByEmployee,
    };
  };

  const handleCalendarClick = () => {
    const calendarEvents = appointments.map(appointment => ({
      title: appointment.service?.serviceName || 'Unknown Event',
      start: new Date(appointment.startTime),
      end: new Date(new Date(appointment.startTime).getTime() + (appointment.service?.duration || 60) * 60000),
      color: appointment.status?.toUpperCase() === 'BOOKED' ? '#3b82f6' : 
             appointment.status?.toUpperCase() === 'COMPLETED' ? '#10b981' : '#f59e0b'
    }));
    setCalendarData(calendarEvents);
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth.getMonth(), currentMonth.getFullYear());
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const events = calendarData.filter(event => {
        const eventDate = new Date(event.start);
        return eventDate.toDateString() === date.toDateString();
      });
      days.push({ date, events });
    }
    return days;
  };

  const handleBackToAppointments = () => {
    setCalendarData(null);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans flex flex-col">
      <header className="bg-gradient-to-r from-indigo-800 to-indigo-600 text-white py-3 px-6 flex flex-col md:flex-row items-center justify-between shadow-md">
        <div className="flex items-center space-x-2 md:space-x-6 mb-2 md:mb-0">
          <div className="flex items-center">
            <div className="p-1 shadow-sm">
              <img 
                src={logo} 
                alt="Genesis Virtue Logo" 
                className="h-10 w-auto"
              />
            </div>
            <span className="ml-2 text-lg font-poppins font-bold tracking-wide"></span>
          </div>
          <div className="flex space-x-1 overflow-x-auto whitespace-nowrap">
            <button 
              onClick={() => setShowAddService(true)}
              className="text-sm font-inter flex items-center hover:bg-indigo-700 px-3 py-1 rounded transition-colors"
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
              className="bg-indigo-700 font-inter rounded-lg py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full placeholder-indigo-200" 
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
            <div className="flex items-center font-inter justify-center w-9 h-9 bg-yellow-400 rounded-full text-indigo-800 font-bold text-xs hover:bg-yellow-300 transition-colors cursor-pointer shadow-sm">
              N
            </div>
          </div>
        </div>
      </header>

      {showAddService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center text-black p-5 rounded-t-xl">
              <h3 className="text-md font-inter font-semibold tracking-wide">Lägg till ny tjänst</h3>
              <button 
                onClick={() => setShowAddService(false)}
                className="text-white hover:text-indigo-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block font-inter text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full border text-sm font-inter border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Välj kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-inter text-sm font-medium text-gray-700 mb-2">
                  Pris (SEK)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleInputChange}
                  className="w-full text-sm font-inter font-semibold border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ange pris"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block font-inter text-sm font-medium text-gray-700 mb-2">
                  Tjänstnamn
                </label>
                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleInputChange}
                  className="w-full text-sm font-inter font-semibold border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ange tjänstnamn"
                  required
                />
              </div>
              <div>
                <label className="block font-inter text-sm font-medium text-gray-700 mb-2">
                  Varaktighet (minuter)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full text-sm font-semibold font-inter border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="30"
                  min="1"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddService(false)}
                  className="px-5 py-2 text-md font-inter rounded-lg shadow-sm hover:bg-gray-500 transition-colors font-medium"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-md font-inter text-black rounded-lg hover:bg-gray-500 transition-colors font-medium shadow-sm"
                >
                  Spara tjänst
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAssignEmployee && selectedServiceId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center text-black p-5 rounded-t-xl">
              <h3 className="text-md font-inter font-semibold tracking-wide">Tilldela tjänst till anställda</h3>
              <button 
                onClick={() => {
                  setShowAssignEmployee(false);
                  setSelectedEmployeeIds([]);
                }}
                className="text-white hover:text-indigo-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAssignEmployee} className="p-6 space-y-5">
              <div>
                <label className="block font-inter text-sm font-medium text-gray-700 mb-2">
                  Välj anställda
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {employees.map((emp) => (
                    <div key={emp.id} className="flex items-center">
                      <input
                        type="checkbox"
                        name="employee"
                        value={emp.id}
                        checked={selectedEmployeeIds.includes(emp.id)}
                        onChange={handleEmployeeChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm font-inter text-gray-700">{emp.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignEmployee(false);
                    setSelectedEmployeeIds([]);
                  }}
                  className="px-5 py-2 text-md font-inter rounded-lg shadow-sm hover:bg-gray-500 transition-colors font-medium"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-md font-inter text-black rounded-lg hover:bg-gray-500 transition-colors font-medium shadow-sm"
                  disabled={selectedEmployeeIds.length === 0}
                >
                  Tilldela
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <div className="bg-white py-3 px-6 border-b shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex flex-wrap items-center gap-3 mb-3 md:mb-0">
              <button onClick={handleCalendarClick} className="p-2 rounded-full hover:bg-gray-100 transition-colors shadow-sm bg-white">
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 4H5c-1.1 0-2 .9-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className="flex items-center space-x-1">
                <div 
                  className="w-7 h-7 rounded-full font-inter flex items-center justify-center text-black text-sm cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 bg-gray-200 hover:bg-gray-300 shadow-md border-2 border-gray-300"
                  onClick={handleBackToAppointments}
                >
                  *
                </div>
                <div 
                  className={`w-7 h-7 rounded-full font-inter flex items-center justify-center text-black text-sm cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 bg-gray-200 hover:bg-gray-300 shadow-md border-2 border-gray-300 ${
                    employeeFilter === 'N' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  onClick={() => setEmployeeFilter(employeeFilter === 'N' ? null : 'N')}
                >
                  N
                </div>
                <div 
                  className={`w-7 h-7 rounded-full flex font-inter items-center justify-center text-black text-sm cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 bg-gray-200 hover:bg-gray-300 shadow-md border-2 border-gray-300 ${
                    employeeFilter === 'A' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  onClick={() => setEmployeeFilter(employeeFilter === 'A' ? null : 'A')}
                >
                  A
                </div>
                <div 
                  className={`w-7 h-7 rounded-full flex font-inter items-center justify-center text-black text-sm cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 bg-gray-200 hover:bg-gray-300 shadow-md border-2 border-gray-300 ${
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
                  className="border font-inter border-gray-300 rounded-lg py-1.5 px-3 text-sm w-40 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
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
                <div className="bg-blue-600 font-inter rounded-lg px-3 py-1.5 text-white text-xs font-medium shadow-sm">
                  Bokad
                </div>
                <div className="bg-blue-100 font-inter rounded-lg px-3 py-1.5 text-blue-700 text-xs font-medium hover:bg-blue-200 transition-colors cursor-pointer shadow-sm">
                  Anlänt
                </div>
                <div className="bg-blue-100 font-inter rounded-lg px-3 py-1.5 text-blue-700 text-xs font-medium hover:bg-blue-200 transition-colors cursor-pointer shadow-sm">
                  Pågående
                </div>
                <div className="bg-blue-100 font-inter rounded-lg px-3 py-1.5 text-blue-700 text-xs font-medium hover:bg-blue-200 transition-colors cursor-pointer shadow-sm">
                  Granskad
                </div>
              </div>
              <div 
                className={`w-7 h-7 rounded-full flex font-inter items-center justify-center text-black text-lg cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 bg-gray-200 hover:bg-gray-300 shadow-md border-2 border-gray-300`}
                onClick={() => setShowSummary(true)}
              >
                i
              </div>
            </div>
            
            <div className="flex items-center space-x-3 mt-3 md:mt-0">
              <input 
                type="date" 
                className="border border-gray-300 rounded-lg p-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm" 
                value={selectedDate}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setSelectedDate(e.target.value);
                  setCurrentMonth(date);
                  setDateFilter(e.target.value);
                }}
              />
              <button 
                className={`border font-inter border-gray-300 rounded-lg px-4 py-1.5 text-sm hover:bg-gray-50 transition-colors font-medium shadow-sm ${
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
                className={`border font-inter border-gray-300 rounded-lg px-4 py-1.5 text-sm hover:bg-gray-100 transition-colors font-medium shadow-sm ${
                  dateFilter === new Date().toISOString().split('T')[0] ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white'
                }`}
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  setSelectedDate(today);
                  setCurrentMonth(new Date());
                  setDateFilter(today);
                }}
              >
                Idag
              </button>
              {(dateFilter || employeeFilter || nameFilter) && (
                <button 
                  className="border font-inter border-gray-300 rounded-lg px-4 py-1.5 text-sm hover:bg-gray-100 transition-colors font-medium ml-2 bg-white shadow-sm"
                  onClick={() => {
                    setDateFilter(null);
                    setEmployeeFilter(null);
                    setNameFilter('');
                    setSelectedDate(new Date().toISOString().split('T')[0]);
                    setCurrentMonth(new Date());
                  }}
                >
                  Rensa filter
                </button>
              )}
            </div>
          </div>
        </div>
  
        <div className="flex-1 overflow-y-auto max-h-screen min-h-[400px] hide-scrollbar">
        {calendarData && (
  <div className="p-2 sm:p-4 bg-white shadow-xl border border-gray-200 rounded-lg">
    {/* Header */}
    <div className="flex justify-between items-center mb-2 sm:mb-4">
      <button
        onClick={prevMonth}
        className="px-2 sm:px-3 py-1 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-lg sm:text-xl"
      >
        ‹
      </button>
      <h2 className="text-xl sm:text-2xl md:text-4xl font-inter font-bold text-gray-800 tracking-wide">
        {currentMonth.toLocaleString("default", { month: "long" })}{" "}
        {currentMonth.getFullYear()}
      </h2>
      <button
        onClick={nextMonth}
        className="px-2 sm:px-3 py-1 sm:py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-lg sm:text-xl"
      >
        ›
      </button>
    </div>

    {/* Day Headers */}
    <div className="grid grid-cols-7 font-inter text-center text-gray-500 font-semibold text-xs sm:text-sm mb-1 sm:mb-2 uppercase tracking-wide">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day} className="py-1 sm:py-1.5">{day}</div>
      ))}
    </div>

    {/* Dates Grid with scrolling on mobile */}
    <div className="overflow-y-auto max-h-[70vh] sm:max-h-none">
      <div className="grid grid-cols-7 gap-0.5 sm:gap-px bg-gray-200 rounded-lg overflow-hidden">
        {Array.from({ length: 42 }, (_, i) => {
          const firstDay = getFirstDayOfMonth(
            currentMonth.getMonth(),
            currentMonth.getFullYear()
          );
          const daysInMonth = getDaysInMonth(
            currentMonth.getMonth(),
            currentMonth.getFullYear()
          );
          const dayIndex = i - firstDay + 1;
          let date = null;

          if (dayIndex > 0 && dayIndex <= daysInMonth) {
            date = new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              dayIndex
            );
          }

          const events = date
            ? calendarData.filter(
                (event) =>
                  new Date(event.start).toDateString() === date.toDateString()
              )
            : [];

          const isToday =
            date && new Date().toDateString() === date.toDateString();

          // Light rainbow color array
          const lightRainbowColors = [
            "#FFB6C1", // Light Pink (light red)
            "#FFDAB9", // Peach Puff (light orange)
            "#FFFFE0", // Light Yellow
            "#90EE90", // Light Green
            "#ADD8E6", // Light Blue
            "#B0C4DE", // Light Slate Blue (light indigo)
            "#E6E6FA"  // Lavender (light violet)
          ];

          return (
            <div
              key={i}
              className={`bg-white min-h-[40px] sm:min-h-[50px] md:min-h-[80px] lg:min-h-[120px] px-1 sm:px-2 py-1 flex flex-col border border-gray-100 relative ${
                !date ? "opacity-40 pointer-events-none" : ""
              }`}
            >
              {date && (
                <div className="flex justify-between text-xs sm:text-xs md:text-sm font-semibold text-gray-800 mb-0.5 sm:mb-1">
                  <span>{date.getDate()}</span>
                  {isToday && (
                    <span className="text-[6px] sm:text-[8px] md:text-[10px] bg-indigo-500 text-white px-0.5 sm:px-1 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                </div>
              )}

              {/* Event boxes with light rainbow dots */}
              <div className="flex font-inter flex-col gap-0.5 sm:gap-1 mt-auto">
                {events.map((event, idx) => {
                  const colorIndex = idx % lightRainbowColors.length;
                  return (
                    <div key={idx} className="p-0.5 sm:p-1 rounded-md" style={{ maxWidth: "120px" }}>
                      <div className="flex items-center bg-gray-50 p-0.5 sm:p-1 rounded-md">
                        <span
                          className="w-2 sm:w-3 h-2 sm:h-3 rounded-full mr-1 sm:mr-2"
                          style={{ backgroundColor: lightRainbowColors[colorIndex] }}
                          title={`${event.title} at ${new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                        ></span>
                        <div className="flex flex-col text-[6px] sm:text-[8px] md:text-[10px] lg:text-[11px] text-gray-700 font-medium">
                          <span className="font-bold">
                            {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="truncate">{event.title}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
)}          {!calendarData && (
            <div className="min-w-full">
              <table className="min-w-full bg-white border-collapse">
                <thead className="bg-gray-100 sticky top-0 z-10 shadow-md border">
                  <tr>
                    <th className="py-2 px-4 font-inter text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Boknings-ID</th>
                    <th className="py-2 px-4 font-inter text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Kundens namn</th>
                    <th className="py-2 px-4 font-inter text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Tjänst</th>
                    <th className="py-2 px-4 font-inter text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Redigera</th>
                    <th className="py-2 px-4 font-inter text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Pris för service</th>
                    <th className="py-2 px-4 font-inter text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Bokningsdatum</th>
                    <th className="py-2 px-4 font-inter text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Tid</th>
                    <th className="py-2 px-4 font-inter text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Bokningsstatus</th>
                    <th className="py-2 px-4 font-inter text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Mekaniker namn</th>
                    <th className="py-2 px-4 font-inter text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Visa detaljer</th>
                    <th className="py-2 px-4 font-inter text-left text-xs font-sans font-semibold text-gray-600 uppercase tracking-wider">Radera bokning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-blue-50 transition-colors">
                      <td className="py-4 px-4 font-inter text-sm font-medium text-gray-900 whitespace-nowrap">{appointment.id}</td>
                      <td className="py-4 px-4 font-inter text-sm font-medium text-gray-900 whitespace-nowrap">{appointment.user?.name || '-'}</td>
                      <td className="py-4 px-4 font-inter text-sm font-medium text-gray-900 whitespace-nowrap">
                        {appointment.service?.serviceName || '-'}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button className="bg-blue-500 text-white rounded-md p-1.5 hover:bg-blue-600 transition-colors shadow-sm">
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="py-4 px-4 font-inter text-sm font-medium text-gray-900 whitespace-nowrap">
                        {appointment.service?.price || '-'} SEK
                      </td>
                      <td className="py-4 px-4 font-inter text-sm text-gray-700 whitespace-nowrap">
                        {new Date(appointment.startTime)
                          .toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                          })
                          .replace(/\//g, '-')}
                      </td>
                      <td className="py-4 px-4 font-inter text-sm text-gray-700 whitespace-nowrap">
                        {new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-4 px-4 font-inter whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          appointment.status?.toUpperCase() === 'BOOKED' ? 'bg-blue-100 text-blue-800' :
                          appointment.status?.toUpperCase() === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status?.toUpperCase() || 'BOOKED'}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-inter text-sm font-medium text-gray-700 whitespace-nowrap">
                        {appointment.employee?.name || '-'}
                      </td>
                      <td className="py-4 px-4 font-inter whitespace-nowrap">
                        <button 
                          onClick={() => fetchUserDetails(appointment.user?.userId)}
                          className="text-indigo-600 hover:text-indigo-800 transition-colors p-1.5 rounded-full hover:bg-indigo-50"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
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
          )}
        </div>
        <div className="bg-white py-3 px-6 border-t text-center text-gray-500 text-sm">
          Powered By Genesis Virtue
        </div>
      </div>

      {showModal && selectedUser && (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50 animate-fadeIn">
    <div className="bg-white rounded-xl shadow-lg max-w-md overflow-hidden border border-gray-100 animate-scaleIn">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-gray-100">
        <h3 className="text-md font-inter font-semibold text-gray-900">Användardetaljer</h3>
        <button 
          onClick={() => setShowModal(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-5">
        <div className="flex items-start">
          <span className="w-32 font-inter text-sm text-gray-500">Registreringsnr:</span>
          <span className="text-gray-900 font-inter text-sm">{selectedUser.registrationNo}</span>
        </div>
        <div className="flex items-start">
          <span className="w-32 text-sm font-inter text-gray-500">Fullständigt namn:</span>
          <span className="text-gray-900 font-inter text-sm">{selectedUser.name}</span>
        </div>
        <div className="flex items-start">
          <span className="w-32 text-sm font-inter text-gray-500">E-postadress:</span>
          <a 
            href={`mailto:${selectedUser.email}`}
            className="text-blue-500 font-inter hover:text-blue-600 hover:underline break-all text-sm"
          >
            {selectedUser.email}
          </a>
        </div>
        <div className="flex items-start">
          <span className="w-32 font-inter text-sm text-gray-500">Telefonnummer:</span>
          <span className="text-gray-900 font-inter text-sm">{selectedUser.phoneNo}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-gray-100 flex justify-end space-x-3">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 font-inter text-sm rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition shadow-sm"
        >
          Stäng
        </button>
      </div>
    </div>
  </div>
)}

{showSummary && (
  <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden border border-gray-200">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-md font-inter font-semibold text-gray-900 leading-tight">Daglig sammanfattning</h3>
            <p className="text-xs font-inter text-gray-500 mt-1 tracking-wide">
              {new Date().toLocaleDateString('sv-SE')}
            </p>
          </div>
          <button 
            onClick={() => setShowSummary(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1"
            aria-label="Stäng"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border border-gray-100 rounded-lg">
              <p className="text-sm font-inter text-gray-500 mb-1">Bokningar</p>
              <p className="text-md font-semibold text-gray-900">
                {getSummaryData().totalAppointments}
              </p>
            </div>
            <div className="p-3 border border-gray-100 rounded-lg">
              <p className="text-sm font-inter text-gray-500 mb-1">Intäkter</p>
              <p className="text-md font-inter font-semibold text-gray-900">
                {getSummaryData().totalPrice.toLocaleString('sv-SE')} SEK
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h4 className="text-sm font-inter font-medium text-gray-700 mb-4">Bokningar per anställd</h4>
          <div className="space-y-3">
            {getSummaryData().appointmentsByEmployee.length > 0 ? (
              getSummaryData().appointmentsByEmployee.map((app) => (
                <div 
                  key={app.employee} 
                  className="flex justify-between font-inter items-center text-sm"
                >
                  <span className="font-medium font-inter text-gray-800">{app.employee}</span>
                  <span className="text-gray-600">
                    {app.count} bokning{app.count !== 1 ? 'ar' : ''}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm font-inter text-gray-500 text-center">Inga bokningar idag</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 font-inter border-t border-gray-200 flex justify-end">
        <button
          onClick={() => setShowSummary(false)}
          className="px-4 py-2 text-sm font-md font-inter text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
        >
          Stäng sammanfattning
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminDashboard;

