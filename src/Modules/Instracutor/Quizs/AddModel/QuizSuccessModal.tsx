
import { useEffect, useRef, useState } from "react"
import { HiCheckCircle, HiDocumentDuplicate, HiXMark } from "react-icons/hi2"

interface QuizSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  quizCode: string
}

export default function QuizSuccessModal({ isOpen, onClose, quizCode }: QuizSuccessModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [copySuccess, setCopySuccess] = useState(false)

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

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(quizCode)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000) 
    } catch (err) {
      console.error("Failed to copy text: ", err)

    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center relative"
        role="document"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
          aria-label="Close modal"
        >
          <HiXMark className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mb-4">
            <HiCheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 id="success-modal-title" className="text-xl font-semibold text-gray-900">
            Quiz was successfully created
          </h2>
        </div>

        <div className="flex items-center justify-center bg-orange-50 border border-gray-200 rounded-full py-2 px-4 mb-8">
          <span className="text-gray-700 font-medium mr-2">CODE:</span>
          <span className="text-gray-900 font-bold text-lg flex-1 text-left">{quizCode}</span>
    <button
  onClick={handleCopyCode}
  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-orange-100 rounded-full transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
>
  {copySuccess ? (
    <>
      <HiCheckCircle className="w-5 h-5 text-green-500" />
      <span className="text-green-600">Copied!</span>
    </>
  ) : (
    <>
      <HiDocumentDuplicate className="w-5 h-5" />
      <span>Copy</span>
    </>
  )}
</button>
        </div>

        <button
          onClick={onClose}
          className="px-6 py-3 bg-lime-500 text-white font-medium rounded-xl hover:bg-lime-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2 transition-all duration-200"
        >
          Close
        </button>
      </div>
    </div>
  )
}
