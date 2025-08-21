import { useEffect, useRef } from "react"
import { HiXMark } from "react-icons/hi2"
import { motion, AnimatePresence } from "framer-motion"
import type { QuestionData, QuestionViewModalProps } from "../../../../Interfaces/Questions/Interfaces"

const getCategoryLabel = (type: string) => {
  switch (type) {
    case "FE": return "Frontend (FE)";
    case "BE": return "Backend (BE)";
    case "DO": return "DevOps";
    default: return type;
  }
};

export default function QuestionViewModal({ isOpen, onClose, question }: QuestionViewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && question && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="question-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            role="document"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h1 id="question-modal-title" className="text-xl sm:text-2xl font-semibold text-gray-900">
                Question Details
              </h1>
              <button
                onClick={onClose}
                className="p-2 cursor-pointer text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                aria-label="Close modal"
              >
                <HiXMark className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Details Section */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Details</h2>

                {/* Title */}
                <div className="mb-4 flex items-stretch">
                  <span className="min-w-[100px] text-center text-sm font-medium text-gray-700 px-4 py-3 bg-[#FFEDDF] rounded-l-xl flex items-center justify-center">
                    Title:
                  </span>
                  <p className="flex-1 px-4 py-3 bg-orange-50 rounded-r-xl text-gray-800">
                    {question.title}
                  </p>
                </div>

                {/* Description */}
                <div className="mb-6 flex items-stretch">
                  <span className="min-w-[100px] text-center px-4 py-3 bg-[#FFEDDF] rounded-l-xl flex items-center justify-center text-sm font-medium text-gray-700">
                    Description
                  </span>
                  <div className="flex-1 px-4 py-3 bg-orange-50 rounded-r-xl text-gray-800">
                    <p>{question.description || "No description provided."}</p>
                  </div>
                </div>

                {/* Options A, B, C, D */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {["A", "B", "C", "D"].map((optionKey) => (
                    <div key={optionKey} className="flex items-stretch">
                      <span className={`min-w-[50px] text-center px-4 py-3 rounded-l-xl flex items-center justify-center text-sm font-medium ${question.answer === optionKey ? 'bg-green-500 text-white' : 'bg-[#FFEDDF] text-gray-700'}`}>
                        {optionKey}
                      </span>
                      <p className="flex-1 px-4 py-3 bg-orange-50 rounded-r-xl text-gray-800">
                        {question.options[optionKey as keyof QuestionData["options"]]}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Right Answer */}
                <div className="mb-6 flex items-stretch">
                  <span className="min-w-[150px] text-center px-4 py-3 bg-[#FFEDDF] rounded-l-xl flex items-center justify-center text-sm font-medium text-gray-700">
                    Right Answer
                  </span>
                  <p className="w-full h-full px-4 py-3 bg-orange-50 rounded-r-xl text-gray-800">
                    {question.answer}
                  </p>
                </div>

                {/* Difficulty Level */}
                <div className="mb-4 flex items-stretch">
                  <span className="min-w-[150px] text-center px-4 py-3 bg-[#FFEDDF] rounded-l-xl text-sm font-medium text-gray-700">
                    Difficulty
                  </span>
                  <p className="w-full h-full px-4 py-3 bg-orange-50 rounded-r-xl text-gray-800 capitalize">
                    {question.difficulty}
                  </p>
                </div>

                {/* Category Type */}
                <div className="mb-4 flex items-stretch">
                  <span className="min-w-[150px] text-center px-4 py-3 bg-[#FFEDDF] rounded-l-xl text-sm font-medium text-gray-700">
                    Category
                  </span>
                  <p className="w-full h-full px-4 py-3 bg-orange-50 rounded-r-xl text-gray-800">
                    {getCategoryLabel(question.type)}
                  </p>
                </div>
                <div className="mb-4 flex items-stretch">
                  <span className="min-w-[150px] text-center px-4 py-3 bg-[#FFEDDF] rounded-l-xl text-sm font-medium text-gray-700">
                    Points
                  </span>
                  <p className="w-full h-full px-4 py-3 bg-orange-50 rounded-r-xl text-gray-800">
                    {question.points}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
