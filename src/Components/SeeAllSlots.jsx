/*import React, { useState, useEffect, useRef } from "react";
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
    const [isBooking, setIsBooking] = useState(false);


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
    console.log("user Id",Number(userId), // <-- Convert here
)


const handleBookAppointment = () => {
    if (selectedSlot && employeeId && serviceId && selectedDateLocal && !isBooking) {
        setIsBooking(true); // Disable button immediately
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error("User ID not found. Please register first.");
            alert("User ID not found. Please register first.");
            setIsBooking(false);
            return;
        }

        const userIdNumber = Number(userId);
        if (isNaN(userIdNumber) || userIdNumber <= 0) {
            console.error("Invalid userId: Must be a positive number", userId);
            alert("Invalid User ID. Please register again.");
            setIsBooking(false);
            return;
        }

        const appointmentData = {
            userId: userIdNumber,
            employeeId: employeeId,
            serviceId: serviceId,
            date: format(selectedDateLocal, "yyyy-MM-dd"),
            time: format(parse(selectedSlot.startTime, "hh:mm a", new Date()), "HH:mm"),
        };

        console.log("Booking attempt:", appointmentData);

        axios
            .post("api/book", appointmentData)
            .then((response) => {
                console.log("Booking Successful:", response.data);
                setBookingSuccess(true);
                localStorage.removeItem('userId');
                audioRef.current.play().catch(e => console.log("Audio play error:", e));
                setTimeout(() => {
                    window.location.href = "https://speedy-tyres.se/";
                }, 3000);
            })
            .catch((error) => {
                console.error("Error booking appointment:", {
                    data: error.response?.data,
                    status: error.response?.status,
                    message: error.message
                });
                alert(`Failed to book: ${error.response?.data?.error || error.message}`);
            })
            .finally(() => {
                setIsBooking(false); // Re-enable button
            });
    } else if (!selectedSlot) {
        alert("Vänligen välj en tid innan du bokar.");
    }
};

   const handleBookAppointment = () => {
        if (selectedSlot && employeeId && serviceId && selectedDateLocal) {
            const appointmentData = {
                userId: Number(userId), // <-- Convert here
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
                        window.location.href = "https://speedy-tyres.se/";
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


                    <button
    className={`w-full py-3 rounded-lg font-bold ${
        selectedSlot && !isBooking
            ? "bg-orange-600 text-white hover:bg-orange-700"
            : "bg-gray-500 text-gray-400 cursor-not-allowed"
    }`}
    onClick={handleBookAppointment}
    disabled={!selectedSlot || isBooking}
>
    {isBooking ? "Bokar..." : "Boka Tid"}
</button>
                </div>
            </div>
        </div>
    );
};

export default SlotCalendarPage;*/



import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
    const [isBooking, setIsBooking] = useState(false);
    const dateContainerRef = useRef(null);
    const audioRef = useRef(new Audio(successSound));

    // Pre-load audio when component mounts
    useEffect(() => {
        audioRef.current.load().catch(e => console.log("Audio pre-load error:", e));
    }, []);

    const fetchSlots = useCallback((employeeId, serviceId, date) => {
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
    }, []);

    const generateDateRange = useCallback(() => {
        const today = new Date();
        const tempDates = Array.from({ length: 90 }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            return date;
        });
        setDates(tempDates);
    }, []);

    useEffect(() => {
        if (employeeId && serviceId && selectedDateLocal) {
            fetchSlots(employeeId, serviceId, selectedDateLocal);
        }
        generateDateRange();
    }, [employeeId, serviceId, selectedDateLocal, fetchSlots, generateDateRange]);

    const categorizeSlots = useCallback((slot) => {
        const parsedTime = parse(slot.startTime, "hh:mm a", new Date());
        const hour = parsedTime.getHours();

        if (hour < 12) return "Morgon";
        if (hour >= 12 && hour < 17) return "Eftermiddag";
        return "Kväll";
    }, []);

    const categorizedSlots = useMemo(() => {
        return slots.reduce((acc, slot) => {
            const category = categorizeSlots(slot);
            if (!acc[category]) acc[category] = [];
            acc[category].push(slot);
            return acc;
        }, {});
    }, [slots, categorizeSlots]);

    const handleBookAppointment = useCallback(async () => {
        if (!selectedSlot || !employeeId || !serviceId || !selectedDateLocal || isBooking) {
            if (!selectedSlot) {
                alert("Vänligen välj en tid innan du bokar.");
            }
            return;
        }

        setIsBooking(true);
        
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error("User ID not found. Please register first.");
            }

            const userIdNumber = Number(userId);
            if (isNaN(userIdNumber) || userIdNumber <= 0) {
                throw new Error("Invalid User ID. Please register again.");
            }

            const formattedDate = format(selectedDateLocal, "yyyy-MM-dd");
            const formattedTime = format(parse(selectedSlot.startTime, "hh:mm a", new Date()), "HH:mm");

            const appointmentData = {
                userId: userIdNumber,
                employeeId,
                serviceId,
                date: formattedDate,
                time: formattedTime,
            };

            console.log("Booking attempt:", appointmentData);

            const response = await axios.post("api/book", appointmentData);
            console.log("Booking Successful:", response.data);
            
            setBookingSuccess(true);
            localStorage.removeItem('userId');
            
            try {
                await audioRef.current.play();
            } catch (e) {
                console.log("Audio play error:", e);
            }

            setTimeout(() => {
                window.location.href = "https://speedy-tyres.se/";
            }, 3000);
        } catch (error) {
            console.error("Error booking appointment:", {
                data: error.response?.data,
                status: error.response?.status,
                message: error.message
            });
            alert(`Failed to book: ${error.response?.data?.error || error.message}`);
        } finally {
            setIsBooking(false);
        }
    }, [selectedSlot, employeeId, serviceId, selectedDateLocal, isBooking]);

    return (
        <div className="flex flex-col items-center min-h-screen bg-black px-4 py-6 overflow-hidden relative">
            {/* Success overlay */}
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

            {/* Booking loader */}
            {isBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-white text-lg">Bokar din tid...</p>
                    </div>
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
                        <div className="flex justify-center py-8">
                            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : slots.length > 0 ? (
                        <div className="font-sans space-y-4">
                            {Object.entries(categorizedSlots).map(([period, periodSlots]) => (
                                <div key={period}>
                                    <h2 className="text-white font-semibold">{period.toUpperCase()}</h2>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {periodSlots.map((slot, index) => (
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
                            ))}
                        </div>
                    ) : (
                        <p className="text-white text-center">Inga tider tillgängliga för det valda datumet.</p>
                    )}
                </div>

                <div className="flex-shrink-0">
                    <button
                        className={`w-full py-3 rounded-lg font-bold ${
                            selectedSlot && !isBooking
                                ? "bg-orange-600 text-white hover:bg-orange-700"
                                : "bg-gray-500 text-gray-400 cursor-not-allowed"
                        }`}
                        onClick={handleBookAppointment}
                        disabled={!selectedSlot || isBooking}
                    >
                        {isBooking ? "Bokar..." : "Boka Tid"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SlotCalendarPage;

