/*import React, { useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const Users = () => {
    const [firstName, setFirstName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleInputChange = (e) => {
        let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        
        if (value.length > 3 && value[3] !== ' ') {
            value = value.slice(0, 3) + ' ' + value.slice(3);
        }
        
        setRegistrationNumber(value);
    };

    const handleBooking = async () => {
        if (!firstName || !phoneNumber || !email || !registrationNumber) {
            setError('Please fill in all the fields.');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }


        try {
            setLoading(true);
            setError(null);

            const userDTO = {
                name: firstName,
                phoneNo: phoneNumber,
                email,
                registrationNo: registrationNumber,
            };
                                    

            const response = await axios.post('api/users/register', userDTO); 
            console.log('User registered successfully:', response.data);

            const userId = response.data.userId; 
            localStorage.setItem('userId', userId); 
    

            alert('User registered successfully! Redirecting to the booking page...');
            navigate('/service');
        } catch (error) {
            console.error('Error registering user:', error);
            setError(error.response?.data?.message || 'Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black px-4 py-8">
            <div className="w-full max-w-lg bg-[#1a1a1a] p-8 shadow-xl rounded-lg space-y-6 border border-orange-500">
                <h1 className="text-3xl font-bold text-orange-500 mb-4 text-center">Boka tid</h1>

                {error && <div className="text-red-500 text-center mb-4">{error}</div>}

                <div className="space-y-6">
                    <div className="flex flex-col">
                        <input 
                            id="registrationNumber"
                            type="text" 
                            placeholder="ABC 123" 
                            value={registrationNumber} 
                            onChange={handleInputChange}
                            className="p-3 w-[150px] text-2xl text-center text-white bg-[#1a1a1a] border-2 border-orange-500"
                            style={{
                                textTransform: 'uppercase', 
                                borderLeft: '15px solid #ff6600',
                                borderRadius:"5px"
                            }}
                        />
                    </div>

                    <div className="flex flex-col">
                        <input 
                            id="firstName"
                            type="text" 
                            placeholder="Ange ditt namn" 
                            value={firstName} 
                            onChange={e => setFirstName(e.target.value)}
                            className="p-2 w-full bg-[#1a1a1a] text-white border border-orange-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <input 
                            id="phoneNumber"
                            type="text" 
                            placeholder="Ange ditt telefonnummer" 
                            value={phoneNumber} 
                            onChange={e => setPhoneNumber(e.target.value)}
                            className="p-2 w-full bg-[#1a1a1a] text-white border border-orange-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <input 
                            id="email"
                            type="email" 
                            placeholder="Ange din e-postadress" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)}
                            className="p-2 w-full bg-[#1a1a1a] text-white border border-orange-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                </div>

                <button 
                    className="mt-6 bg-orange-500 text-white py-3 px-6 rounded-lg w-full hover:bg-orange-600 transition-transform transform active:scale-95 disabled:opacity-50"
                    onClick={handleBooking}
                    disabled={loading}
                >
                    {loading ? 'Registrerar...' : 'Registrera'}
                </button>
            </div>
        </div>
    );
};

export default Users;*/
import React, { useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const Users = () => {
    const [firstName, setFirstName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const navigate = useNavigate();

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleInputChange = (e) => {
        let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');

        if (value.length > 3 && value[3] !== ' ') {
            value = value.slice(0, 3) + ' ' + value.slice(3);
        }

        setRegistrationNumber(value);
    };

    const handleBooking = async () => {
        if (!firstName || !phoneNumber || !email || !registrationNumber) {
            setError('Please fill in all the fields.');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const userDTO = {
                name: firstName,
                phoneNo: phoneNumber,
                email,
                registrationNo: registrationNumber,
            };

            const response = await axios.post('api/users/register', userDTO);
            const userId = response.data.userId;
            localStorage.setItem('userId', userId);

            setShowSuccessModal(true);

            setTimeout(() => {
                setShowSuccessModal(false);
                navigate('/service');
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.message || 'Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black px-4 py-8 relative">
            <div className="w-full max-w-lg relative bg-[#1a1a1a] p-8 shadow-xl rounded-lg space-y-6 border border-orange-500 z-10">
                <h1 className="text-3xl font-bold text-orange-500 mb-4 text-center">Boka tid</h1>

                {error && <div className="text-red-500 text-center mb-4">{error}</div>}

                <div className="space-y-6">
                    <div className="flex flex-col">
                        <input
                            id="registrationNumber"
                            type="text"
                            placeholder="ABC 123"
                            value={registrationNumber}
                            onChange={handleInputChange}
                            className="p-3 w-[150px] text-2xl text-center text-white bg-[#1a1a1a] border-2 border-orange-500"
                            style={{
                                textTransform: 'uppercase',
                                borderLeft: '15px solid #ff6600',
                                borderRadius: '5px',
                            }}
                        />
                    </div>

                    <div className="flex flex-col">
                        <input
                            id="firstName"
                            type="text"
                            placeholder="Ange ditt namn"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="p-2 w-full bg-[#1a1a1a] text-white border border-orange-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <input
                            id="phoneNumber"
                            type="text"
                            placeholder="Ange ditt telefonnummer"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="p-2 w-full bg-[#1a1a1a] text-white border border-orange-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <input
                            id="email"
                            type="email"
                            placeholder="Ange din e-postadress"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-2 w-full bg-[#1a1a1a] text-white border border-orange-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                </div>

                <button
                    className="mt-6 bg-orange-500 text-white py-3 px-6 rounded-lg w-full hover:bg-orange-600 transition-transform transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    onClick={handleBooking}
                    disabled={loading}
                >
                    {loading ? 'Registrerar...' : 'Registrera'}
                </button>
            </div>

            {/* Fullscreen loader */}
            {loading && (
                <div className="absolute inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-orange-400 font-medium text-lg">Registrerar...</p>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-[#1a1a1a] border border-orange-500 rounded-lg p-6 max-w-sm w-full text-center text-white shadow-xl">
                        <h2 className="text-2xl font-bold text-orange-400 mb-4">Registrering lyckades!</h2>
                        <p className="mb-4">Du kommer att omdirigeras till bokningssidan...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
