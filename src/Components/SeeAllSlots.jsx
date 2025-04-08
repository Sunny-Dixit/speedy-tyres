/*import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from '../axiosConfig';
import { format, parse } from "date-fns";
import logo from '../speedy-logo.png';
import '../App.css';

const SlotCalendarPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { employeeId, serviceId, selectedDate } = location.state || {};
    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [selectedDateLocal, setSelectedDateLocal] = useState(selectedDate ? new Date(selectedDate) : new Date());
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [dates, setDates] = useState([]);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const dateContainerRef = useRef(null);

    useEffect(() => {
        if (employeeId && serviceId && selectedDateLocal) {
            fetchSlots(employeeId, serviceId, selectedDateLocal);
        }
        generateDateRange();
    }, [employeeId, serviceId, selectedDateLocal]);

    const fetchSlots = (employeeId, serviceId, date) => {
        setLoadingSlots(true);
        const formattedDate = format(date, "dd-MM-yyyy");

        axios
            .post("api/slots", {
                employeeId,
                serviceId,
                localDate: formattedDate,
            })
            .then((response) => {
                setSlots(response.data || []);
                setLoadingSlots(false);
            })
            .catch((error) => {
                console.error("Error fetching slots:", error);
                setLoadingSlots(false);
            });
    };

    const generateDateRange = () => {
        const today = new Date();
        let tempDates = [];
        for (let i = 0; i < 90; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);
            tempDates.push(date);
        }
        setDates(tempDates);
    };

    const categorizeSlots = (slot) => {
        const parsedTime = parse(slot.startTime, "hh:mm a", new Date());
        const hour = parsedTime.getHours();

        if (hour < 12) return "Morgon";
        if (hour >= 12 && hour < 17) return "Eftermiddag";
        return "Kväll";
    };

    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error("User ID not found. Please register first.");
    }

    const handleBookAppointment = () => {
        if (selectedSlot && employeeId && serviceId && selectedDateLocal) {
            const appointmentData = {
                userId,
                employeeId: employeeId,
                serviceId: serviceId,
                date: format(selectedDateLocal, "yyyy-MM-dd"),
                time: format(parse(selectedSlot.startTime, "hh:mm a", new Date()), "HH:mm"),
            };

            axios
                .post("api/book", appointmentData)
                .then((response) => {
                    console.log("Booking Successful:", response.data);
                    setBookingSuccess(true);
                    localStorage.removeItem('userId');

                    setTimeout(() => {
                        navigate("/"); // redirect to homepage
                    }, 3000); // after 3 seconds
                })
                .catch((error) => {
                    console.error("Error booking appointment:", error);
                });
        } else {
            alert("Vänligen välj en tid innan du bokar.");
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-black px-4 py-6 overflow-hidden relative">
            {bookingSuccess && (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center animate-fadeIn">
        <div className="relative w-32 h-32">
            <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping-slow" />
            <div className="absolute inset-0 rounded-full border-4 border-green-500" />
            <div className="flex items-center justify-center w-full h-full">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-green-500 animate-scaleIn"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </div>
        </div>
        <h1 className="text-white text-2xl font-bold mt-6 animate-fadeIn">Bokningen lyckades! Var i tid.</h1>
        <p className="text-gray-400 mt-1 animate-fadeIn">Du omdirigeras till startsidan...</p>
    </div>
)}
            <div className="w-full max-w-4xl max-h-[90vh] bg-gray-800 p-6 rounded-[10px] shadow-lg space-y-6 flex flex-col overflow-hidden">
                <div className="flex-shrink-0">
                    <img src={logo} alt="Speedy Tyres Logo" className="w-17 h-12 ml-2" />
                    <p className="ml-10 text-orange-500">Välj ett datum och en tid för din bokning</p>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide space-y-6">
                    <div className="flex items-center justify-between bg-gray-700 p-2 rounded-lg">
                        <div
                            ref={dateContainerRef}
                            className="flex space-x-2 overflow-x-auto flex-nowrap w-full px-6 scrollbar-hide"
                        >
                            {dates.map((date, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedDateLocal(date)}
                                    className={`px-4 font-sans py-2 rounded-lg flex flex-col items-center flex-shrink-0 ${
                                        selectedDateLocal.toDateString() === date.toDateString()
                                            ? "bg-orange-600 text-white"
                                            : "bg-gray-600 text-gray-200"
                                    }`}
                                >
                                    <span className="text-xs font-semibold">{format(date, "MMM")}</span>
                                    <span className="text-lg font-bold">{format(date, "d")}</span>
                                    <span className="text-xs">{format(date, "EEE")}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {loadingSlots ? (
                        <p className="text-white text-center">Loading slots...</p>
                    ) : slots.length > 0 ? (
                        <div className="font-sans space-y-4">
                            {["Morgon", "Eftermiddag", "Kväll"].map((period) => {
                                const filteredSlots = slots.filter((slot) => categorizeSlots(slot) === period);
                                if (filteredSlots.length === 0) return null;

                                return (
                                    <div key={period}>
                                        <h2 className="text-white font-semibold">{period.toUpperCase()}</h2>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {filteredSlots.map((slot, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedSlot(slot)}
                                                    className={`px-4 py-2 ${
                                                        selectedSlot?.startTime === slot.startTime
                                                            ? "bg-orange-600 text-white"
                                                            : "bg-gray-600 text-gray-200"
                                                    } rounded-lg hover:bg-orange-500 hover:text-white`}
                                                >
                                                    {slot.startTime}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-white text-center">Inga tider tillgängliga för det valda datumet.</p>
                    )}
                </div>

                <div className="flex-shrink-0">
                    <button
                        className={`w-full py-3 rounded-lg font-bold ${
                            selectedSlot ? "bg-orange-600 text-white hover:bg-orange-700" : "bg-gray-500 text-gray-400 cursor-not-allowed"
                        }`}
                        onClick={handleBookAppointment}
                        disabled={!selectedSlot} 
                    >
                        Boka Tid
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SlotCalendarPage;*/
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from '../axiosConfig';
import { format, parse } from "date-fns";
import logo from '../speedy-logo.png';
import '../App.css';
import successSound from '../Audio/success-sound.mp3';

const SlotCalendarPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { employeeId, serviceId, selectedDate } = location.state || {};
    const [slots, setSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [selectedDateLocal, setSelectedDateLocal] = useState(selectedDate ? new Date(selectedDate) : new Date());
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [dates, setDates] = useState([]);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const dateContainerRef = useRef(null);
    const audioRef = useRef(new Audio(successSound)); // Audio reference

    useEffect(() => {
        if (employeeId && serviceId && selectedDateLocal) {
            fetchSlots(employeeId, serviceId, selectedDateLocal);
        }
        generateDateRange();
    }, [employeeId, serviceId, selectedDateLocal]);

    const fetchSlots = (employeeId, serviceId, date) => {
        setLoadingSlots(true);
        const formattedDate = format(date, "dd-MM-yyyy");

        axios
            .post("api/slots", {
                employeeId,
                serviceId,
                localDate: formattedDate,
            })
            .then((response) => {
                setSlots(response.data || []);
                setLoadingSlots(false);
            })
            .catch((error) => {
                console.error("Error fetching slots:", error);
                setLoadingSlots(false);
            });
    };

    const generateDateRange = () => {
        const today = new Date();
        let tempDates = [];
        for (let i = 0; i < 90; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);
            tempDates.push(date);
        }
        setDates(tempDates);
    };

    const categorizeSlots = (slot) => {
        const parsedTime = parse(slot.startTime, "hh:mm a", new Date());
        const hour = parsedTime.getHours();

        if (hour < 12) return "Morgon";
        if (hour >= 12 && hour < 17) return "Eftermiddag";
        return "Kväll";
    };

    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error("User ID not found. Please register first.");
    }

    const handleBookAppointment = () => {
        if (selectedSlot && employeeId && serviceId && selectedDateLocal) {
            const appointmentData = {
                userId,
                employeeId: employeeId,
                serviceId: serviceId,
                date: format(selectedDateLocal, "yyyy-MM-dd"),
                time: format(parse(selectedSlot.startTime, "hh:mm a", new Date()), "HH:mm"),
            };

            axios
                .post("api/book", appointmentData)
                .then((response) => {
                    console.log("Booking Successful:", response.data);
                    setBookingSuccess(true);
                    localStorage.removeItem('userId');

                    // Play success sound
                    audioRef.current.play().catch(e => console.log("Audio play error:", e));

                    setTimeout(() => {
                        navigate("/"); // redirect to homepage
                    }, 3000); // after 3 seconds
                })
                .catch((error) => {
                    console.error("Error booking appointment:", error);
                });
        } else {
            alert("Vänligen välj en tid innan du bokar.");
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-black px-4 py-6 overflow-hidden relative">
            {bookingSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center animate-fadeIn">
                    <div className="relative w-32 h-32">
                        <div className="absolute inset-0 rounded-full border-4 border-green-500 animate-ping-slow" />
                        <div className="absolute inset-0 rounded-full border-4 border-green-500" />
                        <div className="flex items-center justify-center w-full h-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-16 w-16 text-green-500 animate-scaleIn"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-white text-2xl font-bold mt-6 animate-fadeIn">Bokningen lyckades! Var i tid.</h1>
                    <p className="text-gray-400 mt-1 animate-fadeIn">Du omdirigeras till startsidan...</p>
                </div>
            )}

            <div className="w-full max-w-4xl max-h-[90vh] bg-gray-800 p-6 rounded-[10px] shadow-lg space-y-6 flex flex-col overflow-hidden">
                <div className="flex-shrink-0">
                    <img src={logo} alt="Speedy Tyres Logo" className="w-17 h-12 ml-2" />
                    <p className="ml-10 text-orange-500">Välj ett datum och en tid för din bokning</p>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide space-y-6">
                    <div className="flex items-center justify-between bg-gray-700 p-2 rounded-lg">
                        <div
                            ref={dateContainerRef}
                            className="flex space-x-2 overflow-x-auto flex-nowrap w-full px-6 scrollbar-hide"
                        >
                            {dates.map((date, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedDateLocal(date)}
                                    className={`px-4 font-sans py-2 rounded-lg flex flex-col items-center flex-shrink-0 ${
                                        selectedDateLocal.toDateString() === date.toDateString()
                                            ? "bg-orange-600 text-white"
                                            : "bg-gray-600 text-gray-200"
                                    }`}
                                >
                                    <span className="text-xs font-semibold">{format(date, "MMM")}</span>
                                    <span className="text-lg font-bold">{format(date, "d")}</span>
                                    <span className="text-xs">{format(date, "EEE")}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {loadingSlots ? (
                        <p className="text-white text-center">Loading slots...</p>
                    ) : slots.length > 0 ? (
                        <div className="font-sans space-y-4">
                            {["Morgon", "Eftermiddag", "Kväll"].map((period) => {
                                const filteredSlots = slots.filter((slot) => categorizeSlots(slot) === period);
                                if (filteredSlots.length === 0) return null;

                                return (
                                    <div key={period}>
                                        <h2 className="text-white font-semibold">{period.toUpperCase()}</h2>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {filteredSlots.map((slot, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedSlot(slot)}
                                                    className={`px-4 py-2 ${
                                                        selectedSlot?.startTime === slot.startTime
                                                            ? "bg-orange-600 text-white"
                                                            : "bg-gray-600 text-gray-200"
                                                    } rounded-lg hover:bg-orange-500 hover:text-white`}
                                                >
                                                    {slot.startTime}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-white text-center">Inga tider tillgängliga för det valda datumet.</p>
                    )}
                </div>

                <div className="flex-shrink-0">
                    <button
                        className={`w-full py-3 rounded-lg font-bold ${
                            selectedSlot ? "bg-orange-600 text-white hover:bg-orange-700" : "bg-gray-500 text-gray-400 cursor-not-allowed"
                        }`}
                        onClick={handleBookAppointment}
                        disabled={!selectedSlot} 
                    >
                        Boka Tid
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SlotCalendarPage;

