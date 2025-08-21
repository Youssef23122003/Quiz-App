import { useState, useMemo, useEffect } from "react";
import {
  HiEye,
  HiPencilSquare,
  HiTrash,
  HiPlus,
  HiMagnifyingGlass,
  HiEllipsisVertical,
} from "react-icons/hi2";
import { Menu } from "@headlessui/react";
import { toast } from "react-toastify";
import { axiosInstance, Questions_URLS } from "../../../Server/baseUrl";
import DeleteModal from "../../../Component/shared/Delete";
import { useSelector } from "react-redux";
import type { RootState } from "../../../Redux/store";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import type {
  Question,
  QuestionData,
  QuestionFormData,
  UpdatedQuestion,
} from "../../../Interfaces/Questions/Interfaces";
import QuestionSetupModal from "./AddModel/QuestionSetupModal";
import QuestionViewModal from "./ViewModal/QuestionDetailsModal";
import QuestionAnswerUpdateModal from "./QuestionAnswerUpdateModal/QuestionAnswerUpdateModal";
import Nodata from "../../../Component/shared/Nodata";
import { motion, AnimatePresence } from "framer-motion";

function SkeletonTable({ rows = 5 }) {
  return (
    <div className="overflow-hidden rounded-xl min-w-full">
      <table className="w-full min-w-[700px]">
        <tbody>
          {Array.from({ length: rows }).map((_, index) => (
            <tr
              key={index}
              className={`last:border-b-0 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              {[1, 2, 3, 4].map((_, i) => (
                <td key={i} className="py-3 px-3 sm:px-6">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-full"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function QuestionBankPage() {
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [questionsData, setQuestionsData] = useState<Question[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionData | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null
  );
  const [selectedQuestionUpdatedId, setSelectedQuestionUpdatedId] = useState<
    string | null
  >(null);
  const [selectedAnswer, setSelectedAnswer] = useState<
    "A" | "B" | "C" | "D" | ""
  >("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.auth.LogData);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "Student") navigate("/dashboard");
  }, [user, navigate]);

  const handleViewQuestion = (question: Question) => {
    setSelectedQuestion({
      title: question.title,
      description: question.description,
      options: question.options,
      answer: question.answer as "A" | "B" | "C" | "D",
      difficulty: question.difficulty as "easy" | "medium" | "hard",
      type: "FE",
      points: question.points,
    });
    setIsModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
  };

  const showModalUpdate = (question: Question) => {
    setSelectedQuestionUpdatedId(question._id);
    setSelectedAnswer(question.answer as "A" | "B" | "C" | "D");
  };

  const openDeleteModal = (question: Question) => {
    setSelectedQuestionId(question._id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => setShowDeleteModal(false);

  const handleUpdateAnswer = async (data: UpdatedQuestion) => {
    if (!selectedQuestionUpdatedId)
      return toast.error("Question ID is missing");

    try {
      setModalLoading(true);
      const res = await axiosInstance.put(
        Questions_URLS.Update_Question(selectedQuestionUpdatedId),
        data
      );
      toast.success(res.data.message);
      setSelectedQuestionUpdatedId(null);
      setSelectedAnswer("");
      fetchQuestions();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error updating answer");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!selectedQuestionId) return toast.error("Question ID is missing");

    try {
      setModalLoading(true);
      const res = await axiosInstance.delete(
        Questions_URLS.Delete_Question(selectedQuestionId)
      );
      toast.success(res.data.message);
      closeDeleteModal();
      fetchQuestions();
    } catch (err: any) {
      toast.error(err.response?.data?.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleAddQuestion = async (payload: QuestionFormData) => {
    try {
      await axiosInstance.post(Questions_URLS.SetUP_Questions, payload);
      toast.success("Question added successfully");
      fetchQuestions();
    } catch (err) {
      toast.error("Failed to add question");
      console.error(err);
    }
  };

  const filteredQuestions = useMemo(() => {
    if (!searchTerm) return questionsData;
    const lower = searchTerm.toLowerCase();
    return questionsData.filter(
      (q) =>
        q.title.toLowerCase().includes(lower) ||
        q.description.toLowerCase().includes(lower) ||
        q.difficulty.toLowerCase().includes(lower)
    );
  }, [questionsData, searchTerm]);

  async function fetchQuestions() {
    setLoading(true);
    try {
      const res = await axiosInstance.get(Questions_URLS.SetUP_Questions);
      setQuestionsData(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <>
      <motion.div
        className="mx-auto Questions-list"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              {t("questions.title")}
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsQuestionModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-all"
            >
              <HiPlus className="w-5 h-5" />
              <span>{t("questions.addQuestion")}</span>
            </motion.button>
          </div>

          <div className="relative mb-6">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder={t("questions.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>

          <div className="overflow-x-auto">
            <div className="overflow-hidden rounded-xl border border-gray-200 min-w-full">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900">
                    <th className="py-3 sm:py-4 px-3 sm:px-6 font-semibold text-white text-sm sm:text-base">
                      {t("questions.titleCol")}
                    </th>
                    <th className="text-center py-3 sm:py-4 px-3 sm:px-6 font-semibold text-white text-sm sm:text-base">
                      {t("questions.descriptionCol")}
                    </th>
                    <th className="text-center py-3 sm:py-4 px-3 sm:px-6 font-semibold text-white text-sm sm:text-base">
                      {t("questions.difficultyCol")}
                    </th>
                    <th className="text-center py-3 sm:py-4 px-3 sm:px-6 font-semibold text-white text-sm sm:text-base">
                      {t("questions.actionsCol")}
                    </th>
                  </tr>
                </thead>
                <AnimatePresence>
                  <tbody>
                    {!loading && filteredQuestions.length > 0 ? (
                      filteredQuestions.map((question, idx) => (
                        <motion.tr
                          key={question._id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.3 }}
                          className={`border-b border-gray-200 last:border-b-0 ${
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className="py-3 text-center sm:py-4 px-3 sm:px-6 font-medium text-gray-900 text-sm sm:text-base">
                            {question.title}
                          </td>
                          <td className="py-3 text-center sm:py-4 px-3 sm:px-6 text-gray-700 text-sm sm:text-base">
                            {question.description}
                          </td>
                          <td className="py-3 sm:py-4 flex justify-center px-3 sm:px-6 text-gray-700 text-sm sm:text-base">
                            <span
                              className={`inline-flex items-center justify-center ${
                                {
                                  easy: "bg-green-100 text-green-700 border border-green-300",
                                  medium:
                                    "bg-yellow-100 text-yellow-700 border border-yellow-300",
                                  hard: "bg-red-100 text-red-700 border border-red-300",
                                }[question.difficulty] ||
                                "bg-gray-100 text-gray-600 border border-gray-300"
                              } rounded-full px-4 py-1 text-xs font-semibold shadow-sm`}
                            >
                              {question.difficulty}
                            </span>
                          </td>
                          <td className="py-3 sm:py-4 px-3 sm:px-5">
                           
                            <div className="hidden lg:flex items-center gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleViewQuestion(question)}
                                className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100"
                              >
                                <HiEye className="w-5 h-5" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => showModalUpdate(question)}
                                className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100"
                              >
                                <HiPencilSquare className="w-5 h-5" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openDeleteModal(question)}
                                className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100"
                              >
                                <HiTrash className="w-5 h-5" />
                              </motion.button>
                            </div>

                           
                            <div className="lg:hidden">
                              <Menu as="div" className="relative inline-block text-left">
                                <div>
                                  <Menu.Button className="p-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100">
                                    <HiEllipsisVertical className="w-5 h-5" />
                                  </Menu.Button>
                                </div>

                                <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-lg shadow-lg focus:outline-none z-20">
                                  <div className="px-1 py-1">
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          onClick={() => handleViewQuestion(question)}
                                          className={`${
                                            active
                                              ? "bg-orange-100 text-orange-600"
                                              : "text-gray-700"
                                          } flex w-full items-center rounded-md px-3 py-2 text-sm gap-2`}
                                        >
                                          <HiEye className="w-4 h-4" /> View
                                        </button>
                                      )}
                                    </Menu.Item>
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          onClick={() => showModalUpdate(question)}
                                          className={`${
                                            active
                                              ? "bg-orange-100 text-orange-600"
                                              : "text-gray-700"
                                          } flex w-full items-center rounded-md px-3 py-2 text-sm gap-2`}
                                        >
                                          <HiPencilSquare className="w-4 h-4" /> Edit
                                        </button>
                                      )}
                                    </Menu.Item>
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          onClick={() => openDeleteModal(question)}
                                          className={`${
                                            active
                                              ? "bg-orange-100 text-orange-600"
                                              : "text-gray-700"
                                          } flex w-full items-center rounded-md px-3 py-2 text-sm gap-2`}
                                        >
                                          <HiTrash className="w-4 h-4" /> Delete
                                        </button>
                                      )}
                                    </Menu.Item>
                                  </div>
                                </Menu.Items>
                              </Menu>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={12} className="text-center text-gray-500">
                          {loading ? (
                            <SkeletonTable rows={questionsData.length || 5} />
                          ) : (
                            <Nodata />
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </AnimatePresence>
              </table>
            </div>
          </div>
        </div>
      </motion.div>

      <QuestionAnswerUpdateModal
        isOpen={!!selectedQuestionUpdatedId}
        onClose={() => setSelectedQuestionUpdatedId(null)}
        onSubmit={handleUpdateAnswer}
        defaultAnswer={selectedAnswer}
        loading={modalLoading}
      />

      <QuestionSetupModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        onSubmit={handleAddQuestion}
      />

      <DeleteModal
        message="Are you sure you want to delete this Question?"
        show={showDeleteModal}
        onClose={closeDeleteModal}
        onDeleteConfirm={handleDeleteQuestion}
        title="Delete Question"
        loading={modalLoading}
      />

      <QuestionViewModal
        isOpen={isModalOpen}
        onClose={handleCloseViewModal}
        question={selectedQuestion}
      />
    </>
  );
}
