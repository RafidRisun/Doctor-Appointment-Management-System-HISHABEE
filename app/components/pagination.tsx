"use client";
import { MdOutlineNavigateNext } from "react-icons/md";

type PaginationProps = {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
};

export default function Pagination({ setPage, currentPage }: PaginationProps) {
  return (
    <div className="flex flex-row gap-5 justify-between">
      <button
        className="flex justify-start w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
        onClick={() => {
          setPage((currentPage) => Math.max(currentPage - 1, 1));
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <div className="flex flex-row gap-2 items-center">
          <MdOutlineNavigateNext className="transform rotate-180 text-2xl" />
          <span>Previous</span>
        </div>
      </button>
      <button
        className="flex justify-end w-full bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
        onClick={() => {
          setPage((currentPage) => currentPage + 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <div className="flex flex-row gap-2 items-center">
          <span>Next</span>
          <MdOutlineNavigateNext className="text-2xl" />
        </div>
      </button>
    </div>
  );
}
