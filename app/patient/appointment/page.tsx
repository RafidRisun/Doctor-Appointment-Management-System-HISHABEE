"use client";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PatientDashboard() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [modal, setModal] = useState(false);
  const [page, setPage] = useState(1);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentId, setAppointmentId] = useState("");
  const [flag, setFlag] = useState(1);
  const [notification, setNotification] = useState("");
  const [errorNotification, setErrorNotification] = useState("");
  const [loading, setLoading] = useState(true);

  // Appointment type definition for API data
  type Appointment = {
    id: string;
    doctor: { name: string };
    createdAt: string;
    updatedAt: string;
    status: string;
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

  // Fetch appointments for the patient with filters
  const fetchDoctors = () => {
    axiosInstance
      .get(`/appointments/patient?status=${status}&page=${page}`)
      .then((res) => {
        console.log(res.data.message);
        setAppointments(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 403) {
          router.push("/login");
        }
      });
  };

  // Fetch appointments when filters or status change
  useEffect(() => {
    fetchDoctors();
  }, [status, page, flag]);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Cancel an appointment
  const handleCancel = () => {
    axiosInstance
      .patch("/appointments/update-status", {
        status: "CANCELLED",
        appointment_id: appointmentId,
      })
      .then((res) => {
        console.log(res.data.message);
        setModal(false);
        setAppointmentId("");
        setFlag(flag + 1); // Refetch appointments
        setNotification("Appointment cancelled successfully");
      })
      .catch((error) => {
        if (error.response.status === 403) {
          router.push("/login");
        } else {
          setErrorNotification("Failed to cancel appointment");
        }
      });
  };

  // Auto-hide notification after 5s
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Auto-hide error notification after 5s
  useEffect(() => {
    if (errorNotification) {
      const timer = setTimeout(() => setErrorNotification(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorNotification]);

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-4xl font-bold text-gray-700">Loading...</p>
      </div>
    );
  }

  // Main appointments UI
  return (
    <div className="flex flex-col h-screen max-h-screen min-h-screen justify-start items-center p-3 gap-3 box-border">
      {/* Header with dashboard and logout */}
      <header className="w-full p-4 rounded-xl text-gray-700 flex justify-between items-center">
        <div className="flex gap-5 sm:gap-20 items-end">
          <h1 className="text-lg sm:text-2xl font-bold cursor-default">
            My Appointments
          </h1>
          <button
            className="text-md sm:text-lg font-bold hover:text-blue-500 cursor-pointer"
            onClick={() => router.push("/patient/dashboard")}
          >
            Dashboard
          </button>
        </div>
        <button
          className="bg-gray-700 px-4 py-2 rounded text-white hover:bg-gray-600 cursor-pointer text-sm sm:text-md"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
            router.push("/login");
          }}
        >
          Log Out
        </button>
      </header>
      <div className="w-full h-full flex flex-row gap-3">
        {/* Filter and appointments list */}
        <div className="flex-1 flex flex-col bg-gray-100 rounded-2xl border border-gray-300 p-5 gap-5">
          <div className="flex flex-row justify-between gap-1 sm:gap-3">
            <button
              className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
              onClick={() => setStatus("")}
            >
              All
            </button>
            <button
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 cursor-pointer"
              onClick={() => setStatus("PENDING")}
            >
              Pending
            </button>
            <button
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 cursor-pointer"
              onClick={() => setStatus("CANCELLED")}
            >
              Cancelled
            </button>
            <button
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 cursor-pointer"
              onClick={() => setStatus("COMPLETED")}
            >
              Completed
            </button>
          </div>
          <div className="flex flex-col w-full h-full">
            <h1 className="text-2xl font-bold cursor-default">
              {status} Appointments
            </h1>
            <div className="flex-1 overflow-y-auto">
              {appointments.map((item: Appointment) => (
                <div
                  key={item.id}
                  className="flex flex-row justify-between items-center border-b border-gray-300 p-3"
                >
                  <p className="text-lg font-bold">{item.doctor.name}</p>
                  <p className="text-md">
                    {item.status === "PENDING"
                      ? item.createdAt
                      : item.updatedAt}
                  </p>
                  {/* Only allow cancel if appointment is pending */}
                  <button
                    onClick={() => {
                      setAppointmentId(item.id);
                      setModal(true);
                    }}
                    disabled={item.status !== "PENDING"}
                    className={`px-4 py-2 rounded  ${
                      item.status === "PENDING"
                        ? "bg-red-500 text-white hover:bg-red-400 cursor-pointer"
                        : "bg-gray-300 text-gray-700 cursor-not-allowed opacity-60"
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Pagination */}
          <div className="flex flex-row gap-5 justify-between">
            <button
              className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={() => setPage((page) => Math.max(page - 1, 1))}
            >
              Previous
            </button>
            <button
              className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={() => setPage((page) => page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {/* Cancel confirmation modal */}
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-7 shadow-xl w-full max-w-md border border-gray-300 flex flex-col gap-5">
            <h2 className="text-xl font-bold">Cancel Appointment</h2>

            <div className="flex flex-row justify-between gap-2">
              <button
                className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                onClick={() => {
                  handleCancel();
                  setModal(false);
                }}
              >
                Yes
              </button>
              <button
                className="w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
                onClick={() => {
                  setModal(false);
                }}
              >
                No
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

// const mockAppointments = [
//   {
//     id: "p1",
//     doctor: { name: "Dr. John Doe" },
//     status: "PENDING",
//     createdAt: "2025-09-05",
//     updatedAt: "2025-09-05",
//   },
//   {
//     id: "p2",
//     doctor: { name: "Dr. Jane Smith" },
//     status: "COMPLETED",
//     createdAt: "2025-09-04",
//     updatedAt: "2025-09-06",
//   },
//   {
//     id: "p3",
//     doctor: { name: "Dr. Alice Johnson" },
//     status: "CANCELLED",
//     createdAt: "2025-09-03",
//     updatedAt: "2025-09-04",
//   },
//   {
//     id: "p4",
//     doctor: { name: "Dr. Bob Brown" },
//     status: "PENDING",
//     createdAt: "2025-09-07",
//     updatedAt: "2025-09-07",
//   },
// ];
