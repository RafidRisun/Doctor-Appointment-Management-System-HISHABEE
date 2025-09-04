"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import Header from "@/app/components/header";
import { FaFilter } from "react-icons/fa";
import Pagination from "@/app/components/pagination";

export default function PatientDashboard() {
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const [date, setDate] = useState("");
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [specialization, setSpecialization] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [notification, setNotification] = useState("");
  const [errorNotification, setErrorNotification] = useState("");
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState("");

  // Doctor type definition for API data
  type Doctor = {
    id: string;
    name: string;
    specialization: string;
    photo_url: string;
  };

  // Redirect if not authenticated or wrong role
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
    const userRole = localStorage.getItem("userRole");
    if (userRole === "DOCTOR") {
      router.push("/doctor/dashboard");
    }
  };

  // Fetch all available specializations
  const getSpecializations = () => {
    axiosInstance.get("/specializations").then((res) => {
      setSpecializations(res.data.data || []);
      console.log(res.data.message);
    });
  };

  // Fetch doctors with filters (pagination, search, specialization)
  const getDoctors = () => {
    axiosInstance
      .get(
        `/doctors?page=${page}&limit=${limit}&search=${name}&specialization=${specialization}`
      )
      .then((res) => {
        setDoctors(res.data.data || []);
        console.log(res.data.message);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 403) {
          router.push("/login");
        }
      });
  };

  // Book an appointment with selected doctor and date
  const handleConfirmAppointment = () => {
    axiosInstance
      .post("/appointments", {
        doctorId,
        date,
      })
      .then((res) => {
        if (res && res.status === 201) {
          setNotification("Appointment confirmed successfully.");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          setErrorNotification(
            "Doctor is not available for the selected date."
          );
        }
      });
  };

  // Fetch doctors when filters or pagination change
  useEffect(() => {
    getDoctors();
  }, [page, limit, name, specialization]);

  // Check authentication and fetch specializations on mount
  useEffect(() => {
    getSpecializations();
    checkAuth();
    setPatientName(localStorage.userName);
  }, []);

  // Auto-hide error notification after 5s
  useEffect(() => {
    if (errorNotification) {
      const timer = setTimeout(() => setErrorNotification(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorNotification]);

  // Auto-hide notification after 5s
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-4xl font-bold text-gray-700">Loading...</p>
      </div>
    );
  }

  // Main dashboard UI
  return (
    <div className="flex flex-col h-screen max-h-screen min-h-screen justify-start items-center p-3 gap-3 box-border">
      {/* Header with appointments and logout */}
      <Header
        userName={patientName}
        userType="PATIENT"
        currentPage="dashboard"
      />
      <div className="w-full h-full flex flex-col sm:flex-row gap-3">
        {/* Filter sidebar */}
        <div className="flex-1 flex flex-col bg-gray-100 rounded-2xl border border-gray-300 p-5 gap-5 sticky top-20">
          <div className="flex flex-row gap-2 items-center">
            <h1 className="text-lg font-bold text-gray-700 cursor-default">
              Filter
            </h1>
            <FaFilter className="text-sm sm:text-md" />
          </div>

          <input
            className="border border-gray-500 bg-white rounded p-2 w-full"
            placeholder="Search for Doctors"
            onChange={(e) => {
              setName(e.target.value);
              setPage(1);
            }}
          />
          <div>
            <p className="text-gray-700 cursor-default">
              Choose a Specialization:
            </p>
            <select
              className="border border-gray-500 bg-white rounded p-2 w-full"
              name="specialization"
              value={specialization}
              onChange={(e) => {
                setSpecialization(e.target.value);
                setPage(1);
              }}
            >
              <option className="cursor-pointer" value="">
                All
              </option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
          <button
            className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
            onClick={() => {
              setName("");
              setSpecialization("");
            }}
          >
            Clear Filter
          </button>
        </div>
        {/* Doctors list */}
        <div className="flex-3 border border-gray-300 rounded-2xl p-5 flex flex-col gap-3">
          <h1 className="text-lg font-bold text-gray-700">
            Available Doctors & Specialists
          </h1>
          <div className="flex-1 flex flex-wrap gap-5 overflow-y-auto">
            {/* Doctors Card */}
            {doctors.map((doctor: Doctor) => (
              <div
                key={doctor.id}
                className="flex flex-col w-60 h-80 bg-gray-100 rounded-xl border border-gray-300 p-2 shadow-md gap-2 overflow-hidden"
              >
                <img
                  src={doctor.photo_url || "/doctor_default.jpg"}
                  className="w-full h-7/12 min-h-7/12 max-h-7/12 object-cover rounded-lg flex-shrink-0"
                  alt={doctor.name}
                />
                <div className="p-2 flex flex-col items-start gap-1 flex-1 min-h-0">
                  <h1 className="text-lg font-bold text-gray-700 w-full truncate break-words">
                    {doctor.name}
                  </h1>
                  <p className="text-gray-600 w-full truncate break-words">
                    {doctor.specialization}
                  </p>
                </div>
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 cursor-pointer flex-shrink-0"
                  onClick={() => {
                    setModal(true);
                    setDoctorId(doctor.id);
                  }}
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
          {/* Pagination */}
          <Pagination setPage={setPage} currentPage={page} />
        </div>
      </div>
      {/* Book appointment modal */}
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-7 shadow-xl w-full max-w-md border border-gray-300 flex flex-col gap-5">
            <h2 className="text-xl font-bold">Book Appointment?</h2>
            <div className="flex flex-col gap-2">
              <p>Please select a date for your appointment:</p>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border border-gray-400 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-row justify-between gap-2">
              <button
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                onClick={() => {
                  handleConfirmAppointment();
                  setModal(false);
                }}
              >
                Confirm Appointment
              </button>
              <button
                className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
                onClick={() => {
                  setModal(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Notifications */}
      {notification && (
        <div className="fixed top-4 bg-blue-500 text-white px-4 py-2 rounded shadow z-50 animate-pulse">
          {notification}
        </div>
      )}
      {errorNotification && (
        <div className="fixed top-4 bg-red-500 text-white px-4 py-2 rounded shadow z-50 animate-pulse">
          {errorNotification}
        </div>
      )}
    </div>
  );
}
