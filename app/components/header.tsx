"use client";
import { useRouter } from "next/navigation";
import { FaUserDoctor } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { FaClipboardList } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { FaHospitalUser } from "react-icons/fa6";

type DoctorHeaderProps = {
  userType: string;
  userName: string;
  currentPage?: string;
};

export default function Header({
  userName,
  userType,
  currentPage,
}: DoctorHeaderProps) {
  const router = useRouter();
  return (
    <header className="w-full p-4 rounded-xl text-gray-700 flex justify-between items-center sticky top-0 bg-white border-b border-gray-300 z-50">
      <div className="flex gap-10 items-center">
        <div className="hidden sm:flex gap-2 items-center">
          {userType === "DOCTOR" && (
            <>
              <FaUserDoctor className="text-lg sm:text-2xl" />
              <h1 className="text-md sm:text-xl">Welcome Doctor {userName}</h1>
            </>
          )}
          {userType === "PATIENT" && (
            <>
              <FaHospitalUser className="text-lg sm:text-2xl" />
              <h1 className="text-md sm:text-xl">Welcome {userName}</h1>
            </>
          )}
        </div>
        {userType === "PATIENT" && (
          <div className="flex gap-2 sm:gap-10">
            <button
              className={`flex gap-2 items-center cursor-pointer text-xs sm:text-lg ${
                currentPage === "dashboard" ? "text-gray-700" : "text-gray-500"
              }`}
              onClick={() => router.push("/patient/dashboard")}
            >
              <MdDashboard
                className={`text-sm sm:text-lg ${
                  currentPage === "dashboard"
                    ? "text-gray-700"
                    : "text-gray-500"
                }`}
              />
              Dashboard
            </button>
            <button
              className={`flex gap-2 items-center cursor-pointer text-xs sm:text-lg ${
                currentPage === "appointments"
                  ? "text-gray-700"
                  : "text-gray-500"
              }`}
              onClick={() => router.push("/patient/appointment")}
            >
              <FaClipboardList
                className={`text-sm sm:text-lg ${
                  currentPage === "appointments"
                    ? "text-gray-700"
                    : "text-gray-500"
                }`}
              />
              Appointments
            </button>
          </div>
        )}
      </div>

      {userType === "DOCTOR" && (
        <h1 className="text-md sm:text-lg font-bold">
          Doctor&apos;s Dashboard
        </h1>
      )}
      <button
        className="flex gap-2 items-center bg-gray-700 px-4 py-2 rounded text-white hover:bg-gray-600 cursor-pointer text-xs sm:text-md"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userRole");
          router.push("/login");
        }}
      >
        Log Out
        <IoIosLogOut className="text-md sm:text-lg" />
      </button>
    </header>
  );
}
