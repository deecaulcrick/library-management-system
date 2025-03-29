"use client";
import { useState, useEffect } from "react";
import { X, BookOpen, Bookmark, CheckCircle, Calendar, User, Hash, BookmarkPlus, Loader2 } from "lucide-react";
import { useCreateLoan } from "@/hooks/loans/useLoans";
import { useGetProfile } from "@/hooks/auth/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function BookDetailsModal({ isOpen, onClose, book }) {
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  
  // Get user profile to get user ID
  const { data: userData } = useGetProfile();
  
  // Use the borrow book mutation
  const { mutate: createLoan, isPending: isCreatingLoan } = useCreateLoan();
  
  // Handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };
  
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

  const handleBorrowRequest = () => {
    if (!userData?.id) {
      toast.error("You need to be logged in to borrow books");
      return;
    }
    
    // Create loan data object
    const loanData = {
      userId: userData.id,
      bookId: book.id
    };
    
    // Call the borrow book mutation
    createLoan(loanData, {
      onSuccess: () => {
        toast.success("Book borrowed successfully!");
        // Close the modal
        onClose();
        // Navigate to the loans page after a short delay
        setTimeout(() => {
          router.push("/dashboard/loans");
        }, 1000);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to borrow book");
      }
    });
  };

  if (!book) return null;
  
  // Determine if book is available based on status or available copies
  const isAvailable = book.status === "available" || book.availableCopies > 0;

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
          className={`fixed top-0 right-0 h-full w-100 max-w-md bg-white shadow-lg overflow-auto z-50 transition-transform duration-300 transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={handleModalClick}
        >
          <div className="p-6">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <X size={24} />
            </button>

            <div className="mt-8 flex flex-col justify-center items-start">
              <div className="mb-5 flex items-center justify-center w-full">
                {!imageError ? (
                  <img 
                    src={book.image || "/assets/bookimg.png"} 
                    alt={book.title}
                    className="object-cover h-64 shadow-lg rounded"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="h-64 w-48 bg-gray-100 rounded shadow-lg flex flex-col items-center justify-center">
                    <BookOpen size={64} className="text-gray-400 mb-2" />
                    <span className="text-gray-500 text-sm px-4 text-center">Image not available</span>
                  </div>
                )}
              </div>
              
              {/* Book title and author */}
              <h1 className="text-2xl font-bold w-full h3 mt-2">{book.title}</h1>
              <h2 className="text-lg text-gray-700 w-full">By {book.author}</h2>
              
              {/* Book metadata */}
              <div className="mt-4 space-y-2 w-full">
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen size={16} className="mr-2" />
                  <span>Category: {book.category || "Uncategorized"}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Hash size={16} className="mr-2" />
                  <span>ISBN: {book.isbn || "Not available"}</span>
                </div>
                
                {book.publisher && (
                  <div className="flex items-center text-sm text-gray-600">
                    <User size={16} className="mr-2" />
                    <span>Publisher: {book.publisher}</span>
                  </div>
                )}
                
                {book.publishedDate && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    <span>Published: {book.publishedDate}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    isAvailable 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {isAvailable ? "Available" : "Unavailable"}
                  </span>
                  
                  {book.availableCopies > 0 && (
                    <span className="ml-2 text-sm text-gray-600">
                      {book.availableCopies} {book.availableCopies === 1 ? "copy" : "copies"} available
                    </span>
                  )}
                </div>
              </div>
              
              {/* Action buttons */}
              {isAvailable ? (
                <button
                  className="flex items-center bg-black text-white mt-5 px-4 py-2 rounded-md hover:bg-gray-800 w-full justify-center disabled:bg-gray-400"
                  onClick={handleBorrowRequest}
                  disabled={isCreatingLoan}
                >
                  {isCreatingLoan ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="h-5 w-5 mr-2" />
                      Borrow for 14 days
                    </>
                  )}
                </button>
              ) : (
                <div className="mt-5 w-full">
                  <p className="text-gray-500 text-sm">This book is currently unavailable</p>
                </div>
              )}

              {/* Description section */}
              {book.description && (
                <div className="mt-8 w-full">
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{book.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookDetailsModal;
