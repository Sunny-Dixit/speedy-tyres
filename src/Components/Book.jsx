/*import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import logo from '../speedy-logo.png';
import axios from '../axiosConfig';
import '../App.css';

const Book = () => {
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [slots, setSlots] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSeeAllSlots = () => {
        navigate('/book', { 
            state: { 
                employeeId: selectedEmployee?.id,
                serviceId: selectedService?.id,
                selectedDate: selectedDate
            }
        });
    };

    useEffect(() => {
        axios.get('category/all')
            .then(response => {
                console.log('Categories Response:', response);  // Log the full response
                setCategories(response.data || []);
            })
            .catch(error => console.error('Error fetching categories:', error));
    }, []);
    
        const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setSelectedService(null);
        setSelectedEmployee(null);
        setEmployees([]);
        setError(null);
        
        axios.get(`service/category/${category.id}`)
            .then(response => {
                const servicesWithEmployees = response.data || [];
                setServices(servicesWithEmployees);
            })
            .catch(error => console.error('Error fetching services:', error));
    };

    const handleServiceSelect = (service) => {
        setSelectedService(service);
        setEmployees(service.employees || []);
        setSelectedEmployee(null);
    };
    
    const handleEmployeeSelect = (employee) => {
        setSelectedEmployee(employee);
        if (employee && selectedService && selectedDate) {
            fetchSlots(employee.id, selectedService.id, selectedDate);
        } else if (employee && selectedService) {
            const currentDate = new Date();
            setSelectedDate(currentDate);
            fetchSlots(employee.id, selectedService.id, currentDate);
        }
    };

    const fetchSlots = (employeeId, serviceId, date) => {
        if (!employeeId || !serviceId || !date) return;

        setLoadingSlots(true);
        const formattedDate = format(date, 'dd-MM-yyyy');

        const requestData = {
            employeeId: employeeId,
            serviceId: serviceId,
            localDate: formattedDate
        };

        axios.post('api/slots', requestData, {
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            setSlots(response.data || []);
            setLoadingSlots(false);
        })
        .catch(error => {
            console.error('Error fetching slots:', error);
            setLoadingSlots(false);
        });
    };

    return (
        <div className="flex justify-center min-h-screen bg-black text-white px-4 py-10">
            <div className="w-full max-w-4xl bg-gray-800 p-6 shadow-lg space-y-6 rounded-lg relative">
                <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                    <div className="h-full w-full custom-scroll-container"></div>
                </div>
                
                <div className="relative z-10 max-h-[80vh] overflow-y-auto scrollbar-hide">
                    <img src={logo} alt="Speedy Tyres Logo" className="w-17 h-12 " />
                    <h1 className='font-bold ml-10 text-orange-500 mb-2 block'>Boka Tid</h1>
                    
                    <div className="flex mt-5 items-center space-x-4 border-b pb-4 overflow-x-auto scrollbar-hide">
                        {categories.map(category => (
                            <button 
                                key={category.id} 
                                onClick={() => handleCategoryClick(category)}
                                className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap ${
                                    selectedCategory?.id === category.id 
                                        ? 'bg-orange-600 text-white' 
                                        : 'bg-gray-700 text-gray-300'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    <div className="bg-gray-700 mt-5 p-4 rounded-xl border border-gray-600">
                        <label className="font-bold text-sm text-gray-300 mb-2 block">Välj Tjänst</label>
                        <select 
                            className="p-3 bg-gray-800 text-sm border border-gray-600 rounded w-full"
                            onChange={(e) => handleServiceSelect(services.find(serv => serv.id === parseInt(e.target.value)))}
                            disabled={!selectedCategory}
                            value={selectedService?.id || ''}
                        >
                            <option value="">Välj Tjänst</option>
                            {services.map(service => (
                                <option key={service.id} value={service.id}>
                                    {service.serviceName}
                                </option>
                            ))}
                        </select>
                        {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
                    </div>

                    {selectedService && employees.length > 0 && (
                        <div className="bg-gray-700 mt-5 p-4 rounded-xl border border-gray-600">
                            <label className="font-bold text-sm text-gray-300 mb-2 block">Välj Mekaniker</label>
                            <select 
                                className="p-3 bg-gray-800 text-sm border border-gray-600 rounded w-full"
                                onChange={(e) => handleEmployeeSelect(employees.find(emp => emp.id === parseInt(e.target.value)))}
                                disabled={employees.length === 0}
                                value={selectedEmployee?.id || ''}
                            >
                                <option value="">Välj Mekaniker</option>
                                {employees.map(employee => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {selectedService && (
                        <div className="bg-gray-800 mt-5 p-4 rounded-xl shadow">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-300">{selectedService.serviceName}</p>
                                    <p className="text-sm text-gray-500">
                                        {selectedDate 
                                            ? `Tillgängliga tider ${format(selectedDate, "dd MMM ")}` 
                                            : "Tillgängliga tider idag"}
                                    </p>
                                </div>
                                <p className="font-bold text-orange-600">
                                    från SEK {selectedService.price || 0}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-700 p-4 mt-5 rounded-xl border border-gray-600">
                        <p className="font-bold text-gray-300 mb-2">Välj Tid</p>
                        
                        <div className="bg-gray-800 p-4 rounded-xl shadow mb-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gray-600 p-2 rounded-full">
                                        <span role="img" aria-label="consultation">👨‍⚕️</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-300">Tjänst</p>
                                        <p className="text-sm text-gray-500">
                                            {selectedDate 
                                                ? format(selectedDate, "dd MMM ") 
                                                : "Idag"}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-bold text-orange-600">
                                    från SEK {selectedService?.price || 0}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
    {loadingSlots ? (
        <p className="text-gray-400">Laddar tider...</p>
    ) : selectedEmployee ? (
        slots.length > 0 ? (
            slots.slice(0, 3).map((slot, index) => (
                <button
                    key={index}
                    className={`px-4 py-2 rounded ${
                        selectedSlot?.id === slot.id
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-600 text-gray-300'
                    }`}
                    onClick={() => {
                        setSelectedSlot(slot);
                        navigate('/book', { 
                            state: { 
                                employeeId: selectedEmployee?.id,
                                serviceId: selectedService?.id,
                                selectedDate: selectedDate,
                                preselectedSlot: slot // Optional: pass the selected slot
                            }
                        });
                    }}
                >
                    {slot.startTime} - {slot.endTime}
                </button>
            ))
        ) : (
            <p className="text-gray-400">Inga tillgängliga tider</p>
        )
    ) : (
        <>
           <button className="px-4 py-2 bg-gray-600 text-gray-300 rounded">11:15</button>
            <button className="px-4 py-2 bg-gray-600 text-gray-300 rounded">11:30</button>
            <button className="px-4 py-2 bg-gray-600 text-gray-300 rounded">11:45</button>
        </>
    )}
</div>
                            <button 
                                className="mt-4 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded w-full transition-colors"
                                onClick={handleSeeAllSlots}
                                disabled={!selectedEmployee || slots.length === 0}
                            >
                                Se alla tider &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Book;*/

//---------------------------------------------------------------------------
/*
import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import logo from '../speedy-logo.png';
import axios from '../axiosConfig';
import '../App.css';

const Book = () => {
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [slots, setSlots] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSeeAllSlots = () => {
        navigate('/book', { 
            state: { 
                employeeId: selectedEmployee?.id,
                serviceId: selectedService?.id,
                selectedDate: selectedDate
            }
        });
    };

    useEffect(() => {
        axios.get('category/all')
            .then(response => {
                setCategories(response.data || []);
            })
            .catch(error => console.error('Error fetching categories:', error));
    }, []);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setSelectedService(null);
        setSelectedEmployee(null);
        setEmployees([]);
        setError(null);
        
        axios.get(`service/category/${category.id}`)
            .then(response => {
                setServices(response.data || []);
            })
            .catch(error => console.error('Error fetching services:', error));
    };

    const handleServiceSelect = (service) => {
        setSelectedService(service);
        setEmployees(service.employees || []);
        setSelectedEmployee(null);
    };

    const handleEmployeeSelect = (employee) => {
        setSelectedEmployee(employee);
        if (employee && selectedService) {
            const currentDate = new Date();
            setSelectedDate(currentDate);
            fetchSlotsAuto(employee.id, selectedService.id, currentDate);
        }
    };

    // Automatic fetch with fallback dates
    const fetchSlotsAuto = async (employeeId, serviceId, date) => {
        setLoadingSlots(true);
        let found = false;
        let current = date;

        for (let i = 0; i < 7; i++) {
            const formattedDate = format(current, 'dd-MM-yyyy');
            const requestData = {
                employeeId,
                serviceId,
                localDate: formattedDate
            };

            try {
                const response = await axios.post('api/slots', requestData, {
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.data && response.data.length > 0) {
                    setSlots(response.data);
                    setSelectedDate(current);
                    found = true;
                    break;
                }
            } catch (err) {
                console.error('Error fetching slots:', err);
            }

            current = addDays(current, 1);
        }

        if (!found) {
            setSlots([]);
        }

        setLoadingSlots(false);
    };

    return (
        <div className="flex justify-center min-h-screen bg-black text-white px-4 py-10">
            <div className="w-full max-w-4xl bg-gray-800 p-6 shadow-lg space-y-6 rounded-lg relative">
                <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                    <div className="h-full w-full custom-scroll-container"></div>
                </div>

                <div className="relative z-10 max-h-[80vh] overflow-y-auto scrollbar-hide">
                    <img src={logo} alt="Speedy Tyres Logo" className="w-17 h-12" />

                    <div className="flex mt-5 items-center space-x-4 border-b pb-4 overflow-x-auto scrollbar-hide">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category)}
                                className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap ${
                                    selectedCategory?.id === category.id
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-gray-700 text-gray-300'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    <div className="bg-gray-700 mt-5 p-4 rounded-xl border border-gray-600">
                        <label className="font-bold text-sm text-gray-300 mb-2 block">Välj Tjänst</label>
                        <select
                            className="p-3 bg-gray-800 text-sm border border-gray-600 rounded w-full"
                            onChange={(e) =>
                                handleServiceSelect(
                                    services.find((serv) => serv.id === parseInt(e.target.value))
                                )
                            }
                            disabled={!selectedCategory}
                            value={selectedService?.id || ''}
                        >
                            <option value="">Välj Tjänst</option>
                            {services.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.serviceName}
                                </option>
                            ))}
                        </select>
                        {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
                    </div>

                    {selectedService && employees.length > 0 && (
                        <div className="bg-gray-700 mt-5 p-4 rounded-xl border border-gray-600">
                            <label className="font-bold text-sm text-gray-300 mb-2 block">Välj Mekaniker</label>
                            <select
                                className="p-3 bg-gray-800 text-sm border border-gray-600 rounded w-full"
                                onChange={(e) =>
                                    handleEmployeeSelect(
                                        employees.find((emp) => emp.id === parseInt(e.target.value))
                                    )
                                }
                                disabled={employees.length === 0}
                                value={selectedEmployee?.id || ''}
                            >
                                <option value="">Välj Mekaniker</option>
                                {employees.map((employee) => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {selectedService && (
                        <div className="bg-gray-800 mt-5 p-4 rounded-xl shadow">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-300">
                                        {selectedService.serviceName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {selectedDate
                                            ? `Tillgängliga tider ${format(selectedDate, 'dd MMM')}`
                                            : 'Tillgängliga tider idag'}
                                    </p>
                                </div>
                                <p className="font-bold text-orange-600">
                                    från SEK {selectedService.price || 0}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-700 p-4 mt-5 rounded-xl border border-gray-600">
                        <p className="font-bold text-gray-300 mb-2">Välj Tid</p>

                        <div className="bg-gray-800 p-4 rounded-xl shadow mb-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gray-600 p-2 rounded-full">
                                        <span role="img" aria-label="consultation">👨‍⚕️</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-300">Tjänst</p>
                                        <p className="text-sm text-gray-500">
                                            {selectedDate
                                                ? format(selectedDate, 'dd MMM')
                                                : 'Idag'}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-bold text-orange-600">
                                    från SEK {selectedService?.price || 0}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                                {loadingSlots ? (
                                    <p className="text-gray-400">Laddar tider...</p>
                                ) : selectedEmployee ? (
                                    slots.length > 0 ? (
                                        slots.slice(0, 3).map((slot, index) => (
                                            <button
                                                key={index}
                                                className={`px-4 py-2 rounded ${
                                                    selectedSlot?.id === slot.id
                                                        ? 'bg-orange-600 text-white'
                                                        : 'bg-gray-600 text-gray-300'
                                                }`}
                                                onClick={() => {
                                                    setSelectedSlot(slot);
                                                    navigate('/book', {
                                                        state: {
                                                            employeeId: selectedEmployee?.id,
                                                            serviceId: selectedService?.id,
                                                            selectedDate: selectedDate,
                                                            preselectedSlot: slot
                                                        }
                                                    });
                                                }}
                                            >
                                                {slot.startTime} - {slot.endTime}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-gray-400">Inga tillgängliga tider</p>
                                    )
                                ) : (
                                    <>
                                        <button className="px-4 py-2 bg-gray-600 text-gray-300 rounded">11:15</button>
                                        <button className="px-4 py-2 bg-gray-600 text-gray-300 rounded">11:30</button>
                                        <button className="px-4 py-2 bg-gray-600 text-gray-300 rounded">11:45</button>
                                    </>
                                )}
                            </div>

                            <button
                                className="mt-4 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded w-full transition-colors"
                                onClick={handleSeeAllSlots}
                                disabled={!selectedEmployee || slots.length === 0}
                            >
                                Se alla tider &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Book;*/

//-----------------------------------------------------------------


import React, { useState, useEffect } from 'react';
import { format, addDays, isAfter, parse } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import logo from '../speedy-logo.png';
import axios from '../axiosConfig';
import '../App.css';

const Book = () => {
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [slots, setSlots] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSeeAllSlots = () => {
        navigate('/book', { 
            state: { 
                employeeId: selectedEmployee?.id,
                serviceId: selectedService?.id,
                selectedDate: selectedDate
            }
        });
    };

    useEffect(() => {
        axios.get('category/all')
            .then(response => {
                setCategories(response.data || []);
            })
            .catch(error => console.error('Error fetching categories:', error));
    }, []);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setSelectedService(null);
        setSelectedEmployee(null);
        setEmployees([]);
        setError(null);
        
        axios.get(`service/category/${category.id}`)
            .then(response => {
                setServices(response.data || []);
            })
            .catch(error => console.error('Error fetching services:', error));
    };

    const handleServiceSelect = (service) => {
        setSelectedService(service);
        setEmployees(service.employees || []);
        setSelectedEmployee(null);
    };

    const handleEmployeeSelect = (employee) => {
        setSelectedEmployee(employee);
        if (employee && selectedService) {
            const currentDate = new Date();
            setSelectedDate(currentDate);
            fetchSlotsAuto(employee.id, selectedService.id, currentDate);
        }
    };

    const fetchSlotsAuto = async (employeeId, serviceId, startDate) => {
        setLoadingSlots(true);
        let found = false;
        let current = startDate;

        for (let i = 0; i < 7; i++) {
            const formattedDate = format(current, 'dd-MM-yyyy');
            const requestData = {
                employeeId,
                serviceId,
                localDate: formattedDate
            };

            try {
                const response = await axios.post('api/slots', requestData, {
                    headers: { 'Content-Type': 'application/json' }
                });

                const now = new Date();

                const validSlots = (response.data || []).filter(slot => {
                    const slotTime = parse(slot.startTime, 'HH:mm', current);
                    return isAfter(slotTime, now);
                });

                if (validSlots.length > 0) {
                    setSlots(validSlots);
                    setSelectedDate(current);
                    found = true;
                    break;
                }
            } catch (err) {
                console.error('Error fetching slots:', err);
            }

            current = addDays(current, 1);
        }

        if (!found) {
            setSlots([]);
        }

        setLoadingSlots(false);
    };

    const dummySlots = ['11:15', '11:30', '11:45'];

    return (
        <div className="flex justify-center min-h-screen bg-black text-white px-4 py-10">
            <div className="w-full max-w-4xl bg-gray-800 p-6 shadow-lg space-y-6 rounded-lg relative">
                <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                    <div className="h-full w-full custom-scroll-container"></div>
                </div>

                <div className="relative z-10 max-h-[80vh] overflow-y-auto scrollbar-hide">
                    <img src={logo} alt="Speedy Tyres Logo" className="w-17 h-12" />

                    {/* Category Tabs */}
                    <div className="flex mt-5 items-center space-x-4 border-b pb-4 overflow-x-auto scrollbar-hide">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category)}
                                className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap ${
                                    selectedCategory?.id === category.id
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-gray-700 text-gray-300'
                                }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    {/* Service Select */}
                    <div className="bg-gray-700 mt-5 p-4 rounded-xl border border-gray-600">
                        <label className="font-bold text-sm text-gray-300 mb-2 block">Välj Tjänst</label>
                        <select
                            className="p-3 bg-gray-800 text-sm border border-gray-600 rounded w-full"
                            onChange={(e) =>
                                handleServiceSelect(
                                    services.find((serv) => serv.id === parseInt(e.target.value))
                                )
                            }
                            disabled={!selectedCategory}
                            value={selectedService?.id || ''}
                        >
                            <option value="">Välj Tjänst</option>
                            {services.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.serviceName}
                                </option>
                            ))}
                        </select>
                        {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
                    </div>

                    {/* Employee Select */}
                    {selectedService && employees.length > 0 && (
                        <div className="bg-gray-700 mt-5 p-4 rounded-xl border border-gray-600">
                            <label className="font-bold text-sm text-gray-300 mb-2 block">Välj Mekaniker</label>
                            <select
                                className="p-3 bg-gray-800 text-sm border border-gray-600 rounded w-full"
                                onChange={(e) =>
                                    handleEmployeeSelect(
                                        employees.find((emp) => emp.id === parseInt(e.target.value))
                                    )
                                }
                                disabled={employees.length === 0}
                                value={selectedEmployee?.id || ''}
                            >
                                <option value="">Välj Mekaniker</option>
                                {employees.map((employee) => (
                                    <option key={employee.id} value={employee.id}>
                                        {employee.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Service Info Card */}
                    {selectedService && (
                        <div className="bg-gray-800 mt-5 p-4 rounded-xl shadow">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-300">
                                        {selectedService.serviceName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {selectedDate
                                            ? `Tillgängliga tider ${format(selectedDate, 'dd MMM')}`
                                            : 'Tillgängliga tider idag'}
                                    </p>
                                </div>
                                <p className="font-bold text-orange-600">
                                    från SEK {selectedService.price || 0}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Slot Display */}
                    <div className="bg-gray-700 p-4 mt-5 rounded-xl border border-gray-600">
                        <p className="font-bold text-gray-300 mb-2">Välj Tid</p>

                        <div className="bg-gray-800 p-4 rounded-xl shadow mb-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gray-600 p-2 rounded-full">
                                        <span role="img" aria-label="consultation">👨‍⚕️</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-300">Tjänst</p>
                                        <p className="text-sm text-gray-500">
                                            {selectedDate
                                                ? format(selectedDate, 'dd MMM')
                                                : 'Idag'}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-bold text-orange-600">
                                    från SEK {selectedService?.price || 0}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                                {loadingSlots ? (
                                    <p className="text-gray-400">Laddar tider...</p>
                                ) : selectedEmployee ? (
                                    slots.length > 0 ? (
                                        slots.slice(0, 3).map((slot, index) => (
                                            <button
                                                key={index}
                                                className={`px-4 py-2 rounded ${
                                                    selectedSlot?.id === slot.id
                                                        ? 'bg-orange-600 text-white'
                                                        : 'bg-gray-600 text-gray-300'
                                                }`}
                                                onClick={() => {
                                                    setSelectedSlot(slot);
                                                    navigate('/book', {
                                                        state: {
                                                            employeeId: selectedEmployee?.id,
                                                            serviceId: selectedService?.id,
                                                            selectedDate: selectedDate,
                                                            preselectedSlot: slot
                                                        }
                                                    });
                                                }}
                                            >
                                                {slot.startTime} - {slot.endTime}
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-gray-400">Inga tillgängliga tider</p>
                                    )
                                ) : (
                                    dummySlots.map((time, idx) => (
                                        <button
                                            key={idx}
                                            className="px-4 py-2 bg-gray-600 text-gray-300 rounded"
                                        >
                                            {time}
                                        </button>
                                    ))
                                )}
                            </div>

                            <button
                                className="mt-4 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded w-full transition-colors"
                                onClick={handleSeeAllSlots}
                                disabled={!selectedEmployee || slots.length === 0}
                            >
                                Se alla tider &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Book;






