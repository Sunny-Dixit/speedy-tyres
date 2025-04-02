import { useState, useEffect } from "react";
import axios from "axios";

export default function RimSelection() {
  const [rimSize, setRimSize] = useState(17);
  const [damagedRims, setDamagedRims] = useState(1);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [contactInfo, setContactInfo] = useState({ firstName: "", surname: "", email: "", phone: "" });
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedRimType, setSelectedRimType] = useState(null);
  const [packages, setPackages] = useState([]);
  const [rimTypes, setRimTypes] = useState([]);
  const [packagePrices, setPackagePrices] = useState({});
  const [rimTypePrices, setRimTypePrices] = useState({});

  useEffect(() => {
    fetchStaticData();
  }, []);

  useEffect(() => {
    fetchUpdatedPrices(rimSize);
  }, [rimSize]);

  const fetchStaticData = async () => {
    try {
      const [packageResponse, rimTypeResponse] = await Promise.all([
        axios.get(`http://localhost:9090/api/renovation/packages/static`),
        axios.get(`http://localhost:9090/api/renovation/rim-types/static`),
      ]);
      setPackages(packageResponse.data);
      setRimTypes(rimTypeResponse.data);
    } catch (error) {
      console.error("Error fetching static data:", error);
    }
  };

  const fetchUpdatedPrices = async (size) => {
    try {
      const [packagePriceResponse, rimTypePriceResponse] = await Promise.all([
        axios.get(`http://localhost:9090/api/renovation/packages/prices?rimSize=${size}`),
        axios.get(`http://localhost:9090/api/renovation/rim-types/prices?rimSize=${size}`),
      ]);
      setPackagePrices(packagePriceResponse.data);
      setRimTypePrices(rimTypePriceResponse.data);
    } catch (error) {
      console.error("Error fetching updated prices:", error);
    }
  };

  const calculateTotalPrice = () => {
    const packagePrice = selectedPackage ? packagePrices[selectedPackage.name] || selectedPackage.pricePerRim : 0;
    const rimTypePrice = selectedRimType ? rimTypePrices[selectedRimType.name] || selectedRimType.pricePerRim : 0;
    return (packagePrice + rimTypePrice) * damagedRims;
  };
  const handleSendInquiry = async () => {
    const totalPrice = selectedPackage.pricePerRim * damagedRims; // Ensure totalPrice is defined
  
    const inquiryData = {
      rimSize,
      damagedRims,
      registrationNumber,
      firstName: contactInfo.firstName,
      surname: contactInfo.surname,
      email: contactInfo.email,
      phone: contactInfo.phone,
      selectedPackage: selectedPackage.name, // Send only the name
      selectedRimType: selectedRimType.name, // Send only the name
      totalPrice,
    };
  
    console.log("Sending Inquiry Data:", inquiryData);
  
    try {
      await axios.post("http://localhost:9090/api/renovation/inquiry", inquiryData, {
        headers: { "Content-Type": "application/json" }, 
      });
      alert("Inquiry sent successfully!");
    } catch (error) {
      console.error("Error sending inquiry:", error.response?.data || error.message);
      alert("Failed to send inquiry. Please try again.");
    }
  };
      


  
  

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Choose type of renovation</h2>
      <div className="grid grid-cols-2 gap-4">
        {packages.map((pkg) => (
          <div key={pkg.name} className={`p-4 border rounded-md cursor-pointer ${selectedPackage?.name === pkg.name ? "bg-red-500 text-white" : ""}`} onClick={() => setSelectedPackage(pkg)}>
            <h3 className="font-bold">{pkg.name}</h3>
            <p>{pkg.description}</p>
            <p className="text-red-500 font-bold">From {packagePrices[pkg.name] || pkg.pricePerRim} SEK per rim</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-6">Diameter of the rims</h2>
      <div className="flex space-x-2 mt-2">
        {[15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map((size) => (
          <button key={size} onClick={() => setRimSize(size)} className={`px-4 py-2 border rounded-md ${rimSize === size ? "bg-red-500 text-white" : "bg-gray-100"}`}>{size}"</button>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-6">Type of rim</h2>
      <div className="grid grid-cols-2 gap-4">
        {rimTypes.map((rim) => (
          <div key={rim.name} className={`p-4 border rounded-md cursor-pointer ${selectedRimType?.name === rim.name ? "bg-red-500 text-white" : ""}`} onClick={() => setSelectedRimType(rim)}>
            <h3 className="font-bold">{rim.name}</h3>
            <p>{rim.description}</p>
            <p className="text-red-500 font-bold">From {rimTypePrices[rim.name] || rim.pricePerRim} SEK per rim</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-6">No Of Damaged Rim</h2>

<div className="grid grid-cols-4 gap-4">
  {[1, 2, 3, 4].map((num) => (
    <div
      key={num}
      className={`p-4 border rounded-md text-center cursor-pointer ${
        damagedRims === num ? "bg-gray-300 font-bold" : "bg-gray-100"
      }`}
      onClick={() => setDamagedRims(num)}
    >
      {num}
    </div>
  ))}
</div>
<input
  type="text"
  className="border p-2 w-full mt-4"
  placeholder="Registration Number (e.g. ABC 123)"
  value={registrationNumber}
  onChange={(e) => setRegistrationNumber(e.target.value)}
/>
      <h2 className="text-xl font-semibold mt-6">Contact Information</h2>
      <input type="text" className="border p-2 w-full" placeholder="First Name" value={contactInfo.firstName} onChange={(e) => setContactInfo({ ...contactInfo, firstName: e.target.value })} />
      <input type="text" className="border p-2 w-full mt-2" placeholder="Surname" value={contactInfo.surname} onChange={(e) => setContactInfo({ ...contactInfo, surname: e.target.value })} />
      <input type="email" className="border p-2 w-full mt-2" placeholder="E-mail" value={contactInfo.email} onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })} />
      <input type="tel" className="border p-2 w-full mt-2" placeholder="Phone" value={contactInfo.phone} onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })} />

      <h2 className="text-xl font-semibold mt-6">Total Price: {calculateTotalPrice()} SEK</h2>
      <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md" onClick={handleSendInquiry}>Send Inquiry</button>
    </div>
  );
}
