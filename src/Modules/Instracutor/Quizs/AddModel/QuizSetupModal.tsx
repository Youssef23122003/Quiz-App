import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { HiXMark, HiCheck } from "react-icons/hi2";
import { AnimatePresence, motion } from "framer-motion";
import type {
  QuizFormData,
  QuizSetupModalProps,
} from "../../../../Interfaces/Quizzes/Interfaces";
import {
  axiosInstance,
  GROUPS_URLS,
  Quizzes_URLS,
} from "../../../../Server/baseUrl";
import { toast } from "react-toastify";
import {
  categoryOptions,
  difficultyOptions,
  durationOptions,
  questionOptions,
  scoreOptions,
} from "./Options/DropdownOptions";
import { quizValidation } from "../../../../Server/Validation";

export default function QuizSetupModal({
  isOpen,
  onClose,
  setGeneratedQuizCode,
  fetchAllQuizzes,
  setIsQuizSuccessModalOpen,
  defaultValues,
}: QuizSetupModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<QuizFormData>({
    mode: "onChange",
    defaultValues: defaultValues || {
      title: "",
      duration: 10,
      numberOfQuestions: 15,
      scorePerQuestion: 1,
      description: "",
      scheduleDate: "",
      scheduleTime: "",
      difficultyLevel: "easy",
      categoryType: "FE",
      groupName: "JSB",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (defaultValues) {
        reset(defaultValues);
      } else {
        reset({
          title: "",
          duration: 10,
          numberOfQuestions: 15,
          scorePerQuestion: 1,
          description: "",
          scheduleDate: "",
          scheduleTime: "",
          difficultyLevel: "easy",
          categoryType: "FE",
          groupName: "JSB",
        });
      }
    }
  }, [isOpen, defaultValues, reset]);

  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const onSubmit = async (formData: QuizFormData) => {
    const formattedData = {
      title: formData.title,
      description: formData.description || "",
      group: formData.groupName,
      questions_number: String(formData.numberOfQuestions),
      difficulty: formData.difficultyLevel,
      type: formData.categoryType,
      schadule: new Date(
        `${formData.scheduleDate}T${formData.scheduleTime}`
      ).toISOString(),
      duration: String(formData.duration),
      score_per_question: String(formData.scorePerQuestion),
    };

    console.log("Submitting transformed data:", formattedData);

    try {
      const response = await axiosInstance.post(
        Quizzes_URLS.SetUP_Quizz,
        formattedData
      );
      toast.success(response.data.message);
      fetchAllQuizzes();
      console.log(response.data.data);
      if (setGeneratedQuizCode && setIsQuizSuccessModalOpen) {
        setGeneratedQuizCode(response.data.data.code);
        setIsQuizSuccessModalOpen(true);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create quiz");
    }
  };

  const handleFormSubmit = async (data: QuizFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const [groupOptions, setGroupOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [loadingGroups, setLoadingGroups] = useState(false);

  const getGroups = async () => {
    setLoadingGroups(true);
    try {
      const res = await axiosInstance.get(GROUPS_URLS.GET_ALL_GROUPS);

      const groupData = res?.data;

      const formattedOptions = groupData?.map((group: any) => ({
        label: group.name,
        value: group._id,
      }));

      setGroupOptions(formattedOptions);
      console.log("Formatted Groups:", formattedOptions);
    } catch (error: any) {
      console.error("Error fetching groups:", error);
      toast.error("Failed to fetch groups.");
    } finally {
      setLoadingGroups(false);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            role="document"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h1
                id="modal-title"
                className="text-xl sm:text-2xl font-semibold text-gray-900"
              >
                Set up a new quiz
              </h1>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  form="quiz-form"
                  disabled={isSubmitting}
                  className="p-2 text-green-600 cursor-pointer hover:bg-green-50 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Save quiz"
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
                    <form
          id="quiz-form"
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-6"
        >
  
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Details</h2>

            <div className="mb-4 flex items-stretch">
              <label
                htmlFor="title"
                className="min-w-[100px] text-sm text-center font-medium text-gray-700 px-4 py-3 bg-[#FFEDDF] rounded-l-xl flex items-center justify-center"
              >
                Title:
              </label>
              <div className="flex-1">
                <input
                   {...register("title", quizValidation.title)}
                  type="text"
                  id="title"
                  className="w-full h-full px-4 py-3 bg-orange-50 border  border-none rounded-r-xl focus:outline-none "
                  placeholder="Enter quiz title"
                  aria-invalid={errors.title ? "true" : "false"}
                  aria-describedby={errors.title ? "title-error" : undefined}
                />
                {errors.title && (
                  <p
                    id="title-error"
                    className="text-sm text-red-600"
                    role="alert"
                  >
                    {errors.title.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="flex items-stretch mb-4">
                <label
                  htmlFor="duration"
                  className="min-w-[180px] text-center px-4 py-3 bg-[#FFEDDF] rounded-l-xl flex items-center justify-center text-sm font-medium text-gray-700"
                >
                  Duration (in minutes)
                </label>
                <Controller
                  name="duration"
                  control={control}
                  rules={quizValidation.duration}
                  render={({ field }) => (
                    <select
                      {...field}
                      id="duration"
                      className="w-full h-full px-4 py-3 bg-orange-50 border border-orange-200 rounded-r-xl border-none focus:outline-none transition-all duration-200"
                      aria-invalid={errors.duration ? "true" : "false"}
                    >
                      {durationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>

              <div className="flex items-stretch mb-4">
                <label
                  htmlFor="numberOfQuestions"
                  className="min-w-[180px] text-center px-4 py-3 bg-[#FFEDDF] rounded-l-xl flex items-center justify-center text-sm font-medium text-gray-700"
                >
                  No. of questions
                </label>
                <Controller
                  name="numberOfQuestions"
                  control={control}
              rules={quizValidation.numberOfQuestions}
                  render={({ field }) => (
                    <select
                      {...field}
                      id="numberOfQuestions"
                      className="w-full h-full px-4 py-3 border-none bg-orange-50 border border-orange-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      aria-invalid={errors.numberOfQuestions ? "true" : "false"}
                    >
                      {questionOptions.map((option, i) => (
                        <option key={i} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>

              <div className="flex items-stretch mb-4">
                <label
                  htmlFor="scorePerQuestion"
                  className="min-w-[180px] text-center px-4 py-3  bg-[#FFEDDF] rounded-l-xl flex items-center justify-center text-sm font-medium text-gray-700"
                >
                  Score per question
                </label>
                <Controller
                  name="scorePerQuestion"
                  control={control}
                  rules={quizValidation.numberOfQuestions}
                  render={({ field }) => (
                    <select
                      {...field}
                      id="scorePerQuestion"
                      className="w-full h-full px-4 py-3 bg-orange-50 border-none border-orange-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      aria-invalid={errors.scorePerQuestion ? "true" : "false"}
                    >
                      {scoreOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
            </div>

        
            <div className="mb-6 flex items-stretch">
              <label
                htmlFor="description"
                className="min-w-[100px] text-center px-4 py-3 bg-[#FFEDDF] rounded-l-xl flex items-center justify-center text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <div className="flex-1">
                <textarea
                 {...register("description", quizValidation.description)}
                  id="description"
                  rows={4}
                  className="w-full h-full px-4 py-3 bg-orange-50 border border-orange-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Enter quiz description (optional)"
                  aria-invalid={errors.description ? "true" : "false"}
                  aria-describedby={
                    errors.description ? "description-error" : undefined
                  }
                />
                {errors.description && (
                  <p
                    id="description-error"
                    className="mt-1 text-sm text-red-600"
                    role="alert"
                  >
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center mb-4 w-fit rounded-xl border border-gray-300 overflow-hidden text-sm font-medium text-gray-800 shadow-sm">
  
              <div className="bg-[#FFEDDF] px-4 py-2 h-10 flex items-center justify-center">
                Schedule
              </div>

     
              <div className="flex items-center gap-2 px-4 py-2 border-l border-gray-300">
                <input
                  type="date"
           {...register("scheduleDate", quizValidation.scheduleDate)}
                  className="bg-transparent focus:outline-none w-[110px] text-black"
                />
              </div>

              {/* Time */}
              <div className="flex items-center gap-2 px-4 py-2 border-l border-gray-300">
                <input
                  type="time"
             {...register("scheduleTime", quizValidation.scheduleTime)}
                  className="bg-transparent focus:outline-none w-[60px] text-black"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
  
              <div className="flex items-stretch rounded-xl overflow-hidden border border-orange-200 bg-orange-50">
                <div className="min-w-[100px] px-4 py-2 flex items-center justify-center bg-[#FFEDDF] text-sm font-medium text-gray-700">
                  Difficulty
                </div>
                <Controller
                  name="difficultyLevel"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      id="difficultyLevel"
                      className="w-full px-4 py-2 border-none  bg-transparent focus:outline-none"
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

              <div className="flex items-stretch rounded-xl overflow-hidden border border-orange-200 bg-orange-50">
                <div className="min-w-[100px] px-4 py-2 flex items-center justify-center bg-[#FFEDDF] text-sm font-medium text-gray-700">
                  Category
                </div>
                <Controller
                  name="categoryType"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      id="categoryType"
                      className="w-full px-4 py-2 border-none  bg-transparent focus:outline-none"
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

              <div className="flex items-stretch rounded-xl overflow-hidden border border-orange-200 bg-orange-50">
                <div className="min-w-[100px] px-4 py-2 flex items-center justify-center bg-[#FFEDDF] text-sm font-medium text-gray-700">
                  Group
                </div>
                <Controller
                  name="groupName"
                  control={control}
            rules={quizValidation.groupName}
                  render={({ field }) => (
                    <select
                      {...field}
                      id="groupName"
                      disabled={loadingGroups}
                      className="w-full px-4 py-2 border-none bg-transparent focus:outline-none"
                    >
                      {loadingGroups ? (
                        <option value="">Loading groups...</option>
                      ) : (
                        <>
                          <option value="">Select a group</option>
                          {groupOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex cursor-pointer justify-end pt-4 border-t border-gray-200 sm:hidden">
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="px-6 py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? "Creating..." : "Create Quiz"}
            </button>
          </div>
        </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}





































































// import { useState, useEffect, useRef } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { HiXMark, HiCheck } from "react-icons/hi2";
// import type {
//   QuizFormData,
//   QuizSetupModalProps,
// } from "../../../../Interfaces/Quizzes/Interfaces";
// import {
//   axiosInstance,
//   GROUPS_URLS,
//   Quizzes_URLS,
// } from "../../../../Server/baseUrl";
// import { toast } from "react-toastify";
// import {
//   categoryOptions,
//   difficultyOptions,
//   durationOptions,
//   questionOptions,
//   scoreOptions,
// } from "./Options/DropdownOptions";
// import { quizValidation } from "../../../../Server/Validation";

// export default function QuizSetupModal({
//   isOpen,
//   onClose,
//   setGeneratedQuizCode,
//   fetchAllQuizzes,
//   setIsQuizSuccessModalOpen,
//   defaultValues,
// }: QuizSetupModalProps) {
//   const modalRef = useRef<HTMLDivElement>(null);
//   const firstInputRef = useRef<HTMLInputElement>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     control,
//     reset,
//     formState: { errors, isValid },
//   } = useForm<QuizFormData>({
//     mode: "onChange",
//     defaultValues: defaultValues || {
//       title: "",
//       duration: 10,
//       numberOfQuestions: 15,
//       scorePerQuestion: 1,
//       description: "",
//       scheduleDate: "",
//       scheduleTime: "",
//       difficultyLevel: "easy",
//       categoryType: "FE",
//       groupName: "JSB",
//     },
//   });

//   useEffect(() => {
//     if (isOpen) {
//       if (defaultValues) {
//         reset(defaultValues);
//       } else {
//         reset({
//           title: "",
//           duration: 10,
//           numberOfQuestions: 15,
//           scorePerQuestion: 1,
//           description: "",
//           scheduleDate: "",
//           scheduleTime: "",
//           difficultyLevel: "easy",
//           categoryType: "FE",
//           groupName: "JSB",
//         });
//       }
//     }
//   }, [isOpen, defaultValues, reset]);

//   useEffect(() => {
//     if (isOpen && firstInputRef.current) {
//       firstInputRef.current.focus();
//     }
//   }, [isOpen]);


//   useEffect(() => {
//     const handleEscape = (event: KeyboardEvent) => {
//       if (event.key === "Escape" && isOpen) {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("keydown", handleEscape);
//       document.body.style.overflow = "hidden";
//     }

//     return () => {
//       document.removeEventListener("keydown", handleEscape);
//       document.body.style.overflow = "unset";
//     };
//   }, [isOpen, onClose]);

 
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         modalRef.current &&
//         !modalRef.current.contains(event.target as Node)
//       ) {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isOpen, onClose]);

//   const onSubmit = async (formData: QuizFormData) => {
//     const formattedData = {
//       title: formData.title,
//       description: formData.description || "",
//       group: formData.groupName,
//       questions_number: String(formData.numberOfQuestions),
//       difficulty: formData.difficultyLevel,
//       type: formData.categoryType,
//       schadule: new Date(
//         `${formData.scheduleDate}T${formData.scheduleTime}`
//       ).toISOString(),
//       duration: String(formData.duration),
//       score_per_question: String(formData.scorePerQuestion),
//     };

//     console.log("Submitting transformed data:", formattedData);

//     try {
//       const response = await axiosInstance.post(
//         Quizzes_URLS.SetUP_Quizz,
//         formattedData
//       );
//       toast.success(response.data.message);
//       fetchAllQuizzes()
//       console.log(response.data.data);
//       if (setGeneratedQuizCode && setIsQuizSuccessModalOpen) {
//         setGeneratedQuizCode(response.data.data.code);
//         setIsQuizSuccessModalOpen(true);
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || "Failed to create quiz");
//     }
//   };

//   const handleFormSubmit = async (data: QuizFormData) => {
//     setIsSubmitting(true);
//     try {
//       await onSubmit(data);
//       reset();
//       onClose();
//     } catch (error) {
//       console.error("Error submitting quiz:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleClose = () => {
//     reset();
//     onClose();
//   };

//   const [groupOptions, setGroupOptions] = useState<
//     { label: string; value: string }[]
//   >([]);
//   const [loadingGroups, setLoadingGroups] = useState(false);

//   const getGroups = async () => {
//     setLoadingGroups(true);
//     try {
//       const res = await axiosInstance.get(GROUPS_URLS.GET_ALL_GROUPS);

//       const groupData = res?.data;

//       const formattedOptions = groupData?.map((group: any) => ({
//         label: group.name,
//         value: group._id,
//       }));

//       setGroupOptions(formattedOptions);
//       console.log("Formatted Groups:", formattedOptions);
//     } catch (error: any) {
//       console.error("Error fetching groups:", error);
//       toast.error("Failed to fetch groups.");
//     } finally {
//       setLoadingGroups(false);
//     }
//   };

//   useEffect(() => {
//     getGroups();
//   }, []);

//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="modal-title"
//     >
//       <div
//         ref={modalRef}
//         className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
//         role="document"
//       >
   
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h1
//             id="modal-title"
//             className="text-xl sm:text-2xl font-semibold text-gray-900"
//           >
//             Set up a new quiz
//           </h1>
//           <div className="flex items-center gap-2">
//             <button
//               type="submit"
//               form="quiz-form"
//               disabled={isSubmitting}
//               className="p-2 text-green-600 cursor-pointer hover:bg-green-50 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               aria-label="Save quiz"
//             >
//               <HiCheck className="w-6 h-6" />
//             </button>
//             <button
//               onClick={handleClose}
//               className="p-2 cursor-pointer text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
//               aria-label="Close modal"
//             >
//               <HiXMark className="w-6 h-6" />
//             </button>
//           </div>
//         </div>

        // <form
        //   id="quiz-form"
        //   onSubmit={handleSubmit(handleFormSubmit)}
        //   className="p-6 space-y-6"
        // >
  
        //   <div>
        //     <h2 className="text-lg font-medium text-gray-900 mb-4">Details</h2>

        //     <div className="mb-4 flex items-stretch">
        //       <label
        //         htmlFor="title"
        //         className="min-w-[100px] text-sm text-center font-medium text-gray-700 px-4 py-3 bg-[#FFEDDF] rounded-l-xl flex items-center justify-center"
        //       >
        //         Title:
        //       </label>
        //       <div className="flex-1">
        //         <input
        //            {...register("title", quizValidation.title)}
        //           type="text"
        //           id="title"
        //           className="w-full h-full px-4 py-3 bg-orange-50 border  border-none rounded-r-xl focus:outline-none "
        //           placeholder="Enter quiz title"
        //           aria-invalid={errors.title ? "true" : "false"}
        //           aria-describedby={errors.title ? "title-error" : undefined}
        //         />
        //         {errors.title && (
        //           <p
        //             id="title-error"
        //             className="text-sm text-red-600"
        //             role="alert"
        //           >
        //             {errors.title.message}
        //           </p>
        //         )}
        //       </div>
        //     </div>

        //     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        //       <div className="flex items-stretch mb-4">
        //         <label
        //           htmlFor="duration"
        //           className="min-w-[180px] text-center px-4 py-3 bg-[#FFEDDF] rounded-l-xl flex items-center justify-center text-sm font-medium text-gray-700"
        //         >
        //           Duration (in minutes)
        //         </label>
        //         <Controller
        //           name="duration"
        //           control={control}
        //           rules={quizValidation.duration}
        //           render={({ field }) => (
        //             <select
        //               {...field}
        //               id="duration"
        //               className="w-full h-full px-4 py-3 bg-orange-50 border border-orange-200 rounded-r-xl border-none focus:outline-none transition-all duration-200"
        //               aria-invalid={errors.duration ? "true" : "false"}
        //             >
        //               {durationOptions.map((option) => (
        //                 <option key={option.value} value={option.value}>
        //                   {option.label}
        //                 </option>
        //               ))}
        //             </select>
        //           )}
        //         />
        //       </div>

        //       <div className="flex items-stretch mb-4">
        //         <label
        //           htmlFor="numberOfQuestions"
        //           className="min-w-[180px] text-center px-4 py-3 bg-[#FFEDDF] rounded-l-xl flex items-center justify-center text-sm font-medium text-gray-700"
        //         >
        //           No. of questions
        //         </label>
        //         <Controller
        //           name="numberOfQuestions"
        //           control={control}
        //       rules={quizValidation.numberOfQuestions}
        //           render={({ field }) => (
        //             <select
        //               {...field}
        //               id="numberOfQuestions"
        //               className="w-full h-full px-4 py-3 border-none bg-orange-50 border border-orange-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
        //               aria-invalid={errors.numberOfQuestions ? "true" : "false"}
        //             >
        //               {questionOptions.map((option, i) => (
        //                 <option key={i} value={option.value}>
        //                   {option.label}
        //                 </option>
        //               ))}
        //             </select>
        //           )}
        //         />
        //       </div>

        //       <div className="flex items-stretch mb-4">
        //         <label
        //           htmlFor="scorePerQuestion"
        //           className="min-w-[180px] text-center px-4 py-3  bg-[#FFEDDF] rounded-l-xl flex items-center justify-center text-sm font-medium text-gray-700"
        //         >
        //           Score per question
        //         </label>
        //         <Controller
        //           name="scorePerQuestion"
        //           control={control}
        //           rules={quizValidation.numberOfQuestions}
        //           render={({ field }) => (
        //             <select
        //               {...field}
        //               id="scorePerQuestion"
        //               className="w-full h-full px-4 py-3 bg-orange-50 border-none border-orange-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
        //               aria-invalid={errors.scorePerQuestion ? "true" : "false"}
        //             >
        //               {scoreOptions.map((option) => (
        //                 <option key={option.value} value={option.value}>
        //                   {option.label}
        //                 </option>
        //               ))}
        //             </select>
        //           )}
        //         />
        //       </div>
        //     </div>

        
        //     <div className="mb-6 flex items-stretch">
        //       <label
        //         htmlFor="description"
        //         className="min-w-[100px] text-center px-4 py-3 bg-[#FFEDDF] rounded-l-xl flex items-center justify-center text-sm font-medium text-gray-700"
        //       >
        //         Description
        //       </label>
        //       <div className="flex-1">
        //         <textarea
        //          {...register("description", quizValidation.description)}
        //           id="description"
        //           rows={4}
        //           className="w-full h-full px-4 py-3 bg-orange-50 border border-orange-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
        //           placeholder="Enter quiz description (optional)"
        //           aria-invalid={errors.description ? "true" : "false"}
        //           aria-describedby={
        //             errors.description ? "description-error" : undefined
        //           }
        //         />
        //         {errors.description && (
        //           <p
        //             id="description-error"
        //             className="mt-1 text-sm text-red-600"
        //             role="alert"
        //           >
        //             {errors.description.message}
        //           </p>
        //         )}
        //       </div>
        //     </div>

        //     <div className="flex items-center mb-4 w-fit rounded-xl border border-gray-300 overflow-hidden text-sm font-medium text-gray-800 shadow-sm">
  
        //       <div className="bg-[#FFEDDF] px-4 py-2 h-10 flex items-center justify-center">
        //         Schedule
        //       </div>

     
        //       <div className="flex items-center gap-2 px-4 py-2 border-l border-gray-300">
        //         <input
        //           type="date"
        //    {...register("scheduleDate", quizValidation.scheduleDate)}
        //           className="bg-transparent focus:outline-none w-[110px] text-black"
        //         />
        //       </div>

        //       {/* Time */}
        //       <div className="flex items-center gap-2 px-4 py-2 border-l border-gray-300">
        //         <input
        //           type="time"
        //      {...register("scheduleTime", quizValidation.scheduleTime)}
        //           className="bg-transparent focus:outline-none w-[60px] text-black"
        //         />
        //       </div>
        //     </div>

        //     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
  
        //       <div className="flex items-stretch rounded-xl overflow-hidden border border-orange-200 bg-orange-50">
        //         <div className="min-w-[100px] px-4 py-2 flex items-center justify-center bg-[#FFEDDF] text-sm font-medium text-gray-700">
        //           Difficulty
        //         </div>
        //         <Controller
        //           name="difficultyLevel"
        //           control={control}
        //           render={({ field }) => (
        //             <select
        //               {...field}
        //               id="difficultyLevel"
        //               className="w-full px-4 py-2 border-none  bg-transparent focus:outline-none"
        //             >
        //               {difficultyOptions.map((option) => (
        //                 <option key={option.value} value={option.value}>
        //                   {option.label}
        //                 </option>
        //               ))}
        //             </select>
        //           )}
        //         />
        //       </div>

        //       <div className="flex items-stretch rounded-xl overflow-hidden border border-orange-200 bg-orange-50">
        //         <div className="min-w-[100px] px-4 py-2 flex items-center justify-center bg-[#FFEDDF] text-sm font-medium text-gray-700">
        //           Category
        //         </div>
        //         <Controller
        //           name="categoryType"
        //           control={control}
        //           render={({ field }) => (
        //             <select
        //               {...field}
        //               id="categoryType"
        //               className="w-full px-4 py-2 border-none  bg-transparent focus:outline-none"
        //             >
        //               {categoryOptions.map((option) => (
        //                 <option key={option.value} value={option.value}>
        //                   {option.label}
        //                 </option>
        //               ))}
        //             </select>
        //           )}
        //         />
        //       </div>

        //       <div className="flex items-stretch rounded-xl overflow-hidden border border-orange-200 bg-orange-50">
        //         <div className="min-w-[100px] px-4 py-2 flex items-center justify-center bg-[#FFEDDF] text-sm font-medium text-gray-700">
        //           Group
        //         </div>
        //         <Controller
        //           name="groupName"
        //           control={control}
        //     rules={quizValidation.groupName}
        //           render={({ field }) => (
        //             <select
        //               {...field}
        //               id="groupName"
        //               disabled={loadingGroups}
        //               className="w-full px-4 py-2 border-none bg-transparent focus:outline-none"
        //             >
        //               {loadingGroups ? (
        //                 <option value="">Loading groups...</option>
        //               ) : (
        //                 <>
        //                   <option value="">Select a group</option>
        //                   {groupOptions.map((option) => (
        //                     <option key={option.value} value={option.value}>
        //                       {option.label}
        //                     </option>
        //                   ))}
        //                 </>
        //               )}
        //             </select>
        //           )}
        //         />
        //       </div>
        //     </div>
        //   </div>

        //   <div className="flex cursor-pointer justify-end pt-4 border-t border-gray-200 sm:hidden">
        //     <button
        //       type="submit"
        //       disabled={!isValid || isSubmitting}
        //       className="px-6 py-3 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        //     >
        //       {isSubmitting ? "Creating..." : "Create Quiz"}
        //     </button>
        //   </div>
        // </form>
//       </div>
//     </div>
//   );
// }
