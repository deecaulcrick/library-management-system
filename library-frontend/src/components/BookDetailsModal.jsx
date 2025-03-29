"use client";
import { useEffect } from "react";
import { X, PlusIcon, Bookmark } from "lucide-react";

function BookDetailsModal({ isOpen, onClose, book }) {
  // Add event listener for ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Stop propagation on modal click to prevent closing when clicking inside modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  if (!book) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className={`fixed top-0 right-0 h-full w-100 max-w-full bg-white shadow-lg overflow-auto z-50 transition-transform duration-500 transform ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={handleModalClick}
        >
          <div className="p-6">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <X />
            </button>

            <div className="mt-8 flex flex-col justify-center items-start">
              <div className="mb-5 flex items-center justify-center w-full">
                <img src={book.image} />
              </div>
              <h1 className="text-3xl font-bold w-full h3">{book.title}</h1>
              <h2 className="text-xl text-gray-700 w-full">By {book.author}</h2>
              {book.status === "Available" ? (
                <button
                  className="flex items-center bg-black text-white mt-4 px-4 py-2 rounded-md hover:bg-gray-800"
                  onClick={() => setIsModalOpen(true)}
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Borrow for 14 days
                </button>
              ) : (
                <div className="mt-4">
                  <p className="text-gray-500">Book is currently unavailable</p>
                  <button
                    className="flex items-center bg-red-600 text-white mt-2 px-4 py-2 rounded-md hover:bg-gray-800"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Bookmark className="h-5 w-5 mr-2" />
                    Reserve Book
                  </button>
                </div>
              )}

              <div className="mt-4">
                <p>{book.description}</p>
                {/* Add more book details as needed */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookDetailsModal;
