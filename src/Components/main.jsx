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
                             Fullservice bilvård i Göteborg. Vi erbjuder premium däck- och fordonsunderhållstjänster.                            </p>
                        </div>
                    </section>

                    <section className="space-y-6 pb-6 p-6 border-b border-orange-600">
                        <div className="bg-black p-6 rounded-lg shadow-md">
                            <h2 className="text-3xl font-semibold text-orange-500 tracking-wide">
                            Varför välja oss?
                            </h2>
                            <ul className="space-y-4 text-white mt-4 text-sm md:text-base list-disc pl-5">
                                <li>✅ Snabbt & Pålitligt – Samma dag-service för akuta reparationer</li>
                                <li>✅ Experttekniker – Certifierade proffs med OEM-klassade verktyg</li>
                                <li>✅ Rättvisa priser – Konkurrenskraftiga priser för alla fordonstyper</li>
                                <li>✅ Garanti ingår – Pålitliga utförandegarantier</li>
                                <li>✅ Kund-först – 4,9★ betyg från Göteborgsförare</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-6 pb-6 p-6 border-b border-orange-600">
                        <div className="bg-black p-6 rounded-lg shadow-md">
                            <h2 className="text-3xl font-semibold text-orange-500 tracking-wide">
                            Våra tjänster
                            </h2>
                            <ul className="space-y-4 text-white mt-4 text-sm md:text-base list-disc pl-5">
                                <li>🔧 Däck & Fälgar – Försäljning, reparationer och restaurering</li>
                                <li>🛠  Bilservice & Underhåll – Oljebyten, bromskontroller, motordiagnostik</li>
                                <li>🚗 Professionellt karosseri – Borttagning av bucklor/repor, fullständig omlackering</li>
                                <li>🔄 Begagnade däck – Budgetvänliga alternativ med garanti</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-6 pb-6 p-6">
                        <div className="bg-black p-6 rounded-lg shadow-md">
                            <h2 className="text-3xl font-semibold text-orange-500 tracking-wide">
                                 Kontakta oss
                            </h2>
                            <p className="text-white text-sm md:text-base">
                                Tveka inte att kontakta oss för frågor eller för att boka en tid.
                            </p>
                            <div className="mt-6 space-y-4 text-white text-sm md:text-base">
                                <div>
                                    <p className="font-semibold">📍 Besök oss:</p>
                                    <p>Manufakturgatan 13, 417 07 Göteborg</p>
                                </div>
                                <div>
                                    <p className="font-semibold">📞 Ring nu:</p>
                                    <p><a href="tel:0313951200">0313951200</a></p>
                                    <p><a href="tel:0700000137">0700000137</a></p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

             {/*   <div className="w-full md:w-2/5 bg-transparent flex flex-col justify-start overflow-y-auto md:h-screen p-4 fixed right-0 top-14 md:top-0">
                <div className="h-full">
                            <Users/>
                    </div>
                </div>*/}
                <div className="w-full md:w-2/5 bg-transparent flex flex-col justify-start md:h-screen p-4 fixed right-0 top-14 md:top-0 overflow-hidden">
    <div className="h-full">
        <Users/>
    </div>
</div>

            </div>
        </div>
    );
};

export default SpeedyTyresPage;
