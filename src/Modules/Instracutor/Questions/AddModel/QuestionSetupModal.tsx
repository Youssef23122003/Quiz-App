import { useState, useEffect, useRef } from "react"
import { useForm, Controller } from "react-hook-form"
import { HiXMark, HiCheck } from "react-icons/hi2" // Changed to HiXMark
import { answerOptions, categoryOptions, difficultyOptions} from "./options/options"
import { questionValidation } from "../../../../Server/Validation"
import type { QuestionFormData, QuestionSetupModalProps } from "../../../../Interfaces/Questions/Interfaces"


export default function QuestionSetupModal({ isOpen, onClose, onSubmit }: QuestionSetupModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }, // Ensure isValid is destructured
  } = useForm<QuestionFormData>({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      options: { A: "", B: "", C: "", D: "" },
      answer: "A",
      difficulty: "medium",
      type: "FE",
    },
  })

  // Focus management
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      firstInputRef.current.focus()
    }
  }, [isOpen])

  // Escape key handler
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

  // Click outside handler
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

  const handleFormSubmit = async (data: QuestionFormData) => {
    setIsSubmitting(true)
    console.log("Submitting data:", data) // Log the data to see the structure
    try {
      await onSubmit(data) // Send the transformed data
      reset()
      onClose()
    } catch (error) {
      console.error("Error submitting question:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="question-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        role="document"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 id="question-modal-title" className="text-xl sm:text-2xl font-semibold text-gray-900">
            Set up a new question
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              form="question-form"
              disabled={ isSubmitting} // Use isValid here
              className="p-2 text-green-600 cursor-pointer hover:bg-green-50 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Save question"
            >
              <HiCheck className="w-6 h-6" />
            </button>
            <button
              onClick={handleClose}
              className="p-2 cursor-pointer text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
              aria-label="Close modal"
            >
              <HiXMark className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form id="question-form" onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {/* Details Section */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Details</h2>

            {/* Title */}
            <div className="mb-4 flex items-stretch">
              <label
                htmlFor="question-title"
                className="min-w-[100px] text-sm text-center font-medium text-gray-700 px-4 py-3 bg-[#FFEDDF] rounded-l-xl flex items-center justify-center"
              >
                Title:
              </label>
              <div className="flex-1">
                <input
           {...register("title", questionValidation.title)}
                  type="text"
                  id="question-title"
                  className="w-full h-full px-4 py-3 bg-orange-50 border border-none rounded-r-xl focus:outline-none"
                  placeholder="Enter question title"
                  aria-invalid={errors.title ? "true" : "false"}
                  aria-describedby={errors.title ? "question-title-error" : undefined}
                />
                {errors.title && (
                  <p id="question-title-error" className="mt-0 py text-sm text-red-600" role="alert">
                    {errors.title.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-5 flex items-stretch">
              <label
                htmlFor="question-description"
                className="min-w-[100px] text-center px-4 py-3 bg-[#FFEDDF] rounded-l-xl flex items-center justify-center text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <div className="flex-1">
                <textarea
               {...register("description", questionValidation.description)}
                  id="question-description"
                  rows={4}
                  className="w-full h-full px-4 py-3 bg-orange-50 border border-orange-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Enter question description (optional)"
                  aria-invalid={errors.description ? "true" : "false"}
                  aria-describedby={errors.description ? "question-description-error" : undefined}
                />
                {errors.description && (
                  <p id="question-description-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            {/* Options A, B, C, D */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {["A", "B", "C", "D"].map((optionKey) => (
                <div key={optionKey} className="flex items-stretch">
                  <label
                    htmlFor={`option-${optionKey}`}
                    className="min-w-[50px] text-center px-4 py-3 bg-[#FFEDDF] rounded-l-xl flex items-center justify-center text-sm font-medium text-gray-700"
                  >
                    {optionKey}
                  </label>
                  <div className="flex-1">
                    <input
                  {...register(`options.${optionKey}` as `options.${keyof QuestionFormData["options"]}`, questionValidation.options[optionKey as "A" | "B" | "C" | "D"])}

                      type="text"
                      id={`option-${optionKey}`}
                      className="w-full h-full px-4 py-3 bg-orange-50 border border-none rounded-r-xl focus:outline-none"
                      placeholder={`Enter option ${optionKey}`}
                      aria-invalid={errors.options?.[optionKey as keyof QuestionFormData["options"]] ? "true" : "false"}
                      aria-describedby={
                        errors.options?.[optionKey as keyof QuestionFormData["options"]]
                          ? `option-${optionKey}-error`
                          : undefined
                      }
                    />
                    {errors.options?.[optionKey as keyof QuestionFormData["options"]] && (
                      <p id={`option-${optionKey}-error`} className="mt-1 text-sm text-red-600" role="alert">
                        {errors.options?.[optionKey as keyof QuestionFormData["options"]]?.message as string}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Answer */}
            <div className="mb-6 flex items-stretch">
              <label
                htmlFor="answer"
                className="min-w-[150px] text-center px-4 py-3 bg-[#FFEDDF] rounded-l-xl flex items-center justify-center text-sm font-medium text-gray-700"
              >
                Right Answer
              </label>
              <Controller
                name="answer"
                control={control}
                 rules={questionValidation.answer}
                render={({ field }) => (
                  <select
                    {...field}
                    id="answer"
                    className="w-full h-full px-4 py-3 bg-orange-50 border-none rounded-r-xl focus:outline-none"
                    aria-invalid={errors.answer ? "true" : "false"}
                  >
                    {answerOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            {/* Difficulty Level */}
            <div className="mb-4 flex items-stretch">
              <label className="min-w-[150px] text-center px-4 py-3 bg-[#FFEDDF] rounded-l-xl text-sm font-medium text-gray-700">
                Difficulty
              </label>
              <Controller
                name="difficulty"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full h-full px-4 py-3 bg-orange-50 border-none rounded-r-xl focus:outline-none"
                  >
                    {difficultyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            {/* Category Type */}
            <div className="mb-4 flex items-stretch">
              <label className="min-w-[150px] text-center px-4 py-3 bg-[#FFEDDF] rounded-l-xl text-sm font-medium text-gray-700">
                Category
              </label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full h-full px-4 py-3 bg-orange-50 border-none rounded-r-xl focus:outline-none"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
