import React, { useEffect } from 'react';
import Users from './Users';
import '../App.css';
import logo from '../speedy-logo.png'; // Make sure the path is correct

const SpeedyTyresPage = () => {

    // Hide scrollbar globally for the body
    useEffect(() => {
        document.body.style.overflow = 'hidden'; // Hide body scrollbar
        return () => {
            document.body.style.overflow = 'auto'; // Reset on unmount
        };
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-black">
            <header className="bg-black w-full fixed top-0 left-0 z-50 shadow-md">
                <div className="max-w-screen-xl mx-auto p-4">
                    <img src={logo} alt="Speedy Tyres Logo" className="w-17 h-12 ml-2" />
                </div>
            </header>

            <div className="flex flex-col md:flex-row min-h-screen pt-14 pb-4">
            <div className="w-full md:w-3/5 bg-black p-8 shadow-2xl overflow-y-auto hide-scrollbar custom-scrollbar h-screen ml-4 mb-4 hidden md:block">
            <section className="space-y-6 pb-6 p-6 border-b border-orange-600">
                        <div className="bg-black p-6 rounded-lg shadow-md">
                            <p className="text-lg text-white leading-relaxed font-light">
                                Full-Service Auto Care in Gothenburg. We offer premium tyre and vehicle maintenance services.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6 pb-6 p-6 border-b border-orange-600">
                        <div className="bg-black p-6 rounded-lg shadow-md">
                            <h2 className="text-3xl font-semibold text-orange-500 tracking-wide">
                                Why Choose Us?
                            </h2>
                            <ul className="space-y-4 text-white mt-4 text-sm md:text-base list-disc pl-5">
                                <li>✅ Fast & Reliable – Same-day service for urgent repairs</li>
                                <li>✅ Expert Technicians – Certified professionals with OEM-grade tools</li>
                                <li>✅ Fair Pricing – Competitive rates for all vehicle types</li>
                                <li>✅ Warranty Included – Trusted workmanship guarantees</li>
                                <li>✅ Customer-First – 4.9★ ratings from Gothenburg drivers</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-6 pb-6 p-6 border-b border-orange-600">
                        <div className="bg-black p-6 rounded-lg shadow-md">
                            <h2 className="text-3xl font-semibold text-orange-500 tracking-wide">
                                Our Services
                            </h2>
                            <ul className="space-y-4 text-white mt-4 text-sm md:text-base list-disc pl-5">
                                <li>🔧 Tyres & Rims – Sales, repairs, and restoration</li>
                                <li>🛠 Car Servicing & Maintenance – Oil changes, brake checks, engine diagnostics</li>
                                <li>🚗 Professional Bodywork – Dent/scratch removal, full repainting</li>
                                <li>🔄 Used Tyres – Budget-friendly options with warranty</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-6 pb-6 p-6">
                        <div className="bg-black p-6 rounded-lg shadow-md">
                            <h2 className="text-3xl font-semibold text-orange-500 tracking-wide">
                                Contact Us
                            </h2>
                            <p className="text-white text-sm md:text-base">
                                Feel free to get in touch with us for any inquiries or to book an appointment.
                            </p>
                            <div className="mt-6 space-y-4 text-white text-sm md:text-base">
                                <div>
                                    <p className="font-semibold">📍 Visit Us:</p>
                                    <p>Manufakturgatan 13, 417 07 Göteborg</p>
                                </div>
                                <div>
                                    <p className="font-semibold">📞 Call Now:</p>
                                    <p>[Insert Phone Number]</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="w-full md:w-2/5 bg-transparent flex flex-col justify-start overflow-y-auto md:h-screen p-4 fixed right-0 top-14 md:top-0">
                <div className="h-full">
                            <Users/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpeedyTyresPage;
