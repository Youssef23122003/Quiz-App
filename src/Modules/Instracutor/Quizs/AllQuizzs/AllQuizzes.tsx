import { useState, useMemo, useEffect } from "react"
import { HiMagnifyingGlass, HiClock, HiQuestionMarkCircle, HiScale, HiUsers, HiArrowRight } from "react-icons/hi2"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { axiosInstance, Quizzes_URLS } from "../../../../Server/baseUrl"

import { useSelector } from "react-redux"
import type { RootState } from "../../../../Redux/store"
import type { Quiz, QuizSectionProps } from "../../../../Interfaces/Quizzes/Interfaces"
import { useTranslation } from "react-i18next"
import Nodata from "../../../../Component/shared/Nodata"

import { motion, AnimatePresence } from "framer-motion"

function SkeletonQuizCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-orange-50 rounded-xl border border-orange-100 p-4 flex flex-col shadow"
    >
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6 mb-3"></div>

      <div className="flex flex-col gap-2 text-sm mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-3 bg-gray-200 rounded w-2/3"></div>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between pt-2">
        <div className="h-5 bg-gray-200 rounded-full w-20"></div>
        <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
      </div>
    </motion.div>
  )
}

export default function QuizSection({ showTitle = true, embedded = true }: QuizSectionProps) {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()
  const [QuizzsData, setQuizzsData] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(false)

  const filteredQuizzes = useMemo(() => {
    if (loading || !QuizzsData.length) return []
    if (!searchTerm) return QuizzsData

    const lower = searchTerm.toLowerCase()
    return QuizzsData.filter(
      (q) =>
        [q.title, q.description, q.code, q.status, q.group, q.type, q.difficulty].some((val) =>
          val.toLowerCase().includes(lower),
        ) || new Date(q.schadule).toLocaleDateString().toLowerCase().includes(lower),
    )
  }, [searchTerm, QuizzsData, loading])

  const handleViewDetails = (code: string) => {
    navigate(`/quizes/${code}`)
  }

  async function fetchQuestion() {
    setLoading(true)
    try {
      const response = await axiosInstance.get(Quizzes_URLS.SetUP_Quizz)
      setQuizzsData(response.data)
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("quizSection.fetchError"))
    } finally {
      setLoading(false)
    }
  }

  const user = useSelector((state: RootState) => state.auth.LogData)
  if (user?.role === "Student") {
    navigate("/dashboard")
  }

  useEffect(() => {
    fetchQuestion()
  }, [])

  return (
    <section className={embedded ? "rounded-xl bg-white shadow-sm border border-gray-200 p-4 sm:p-6" : "p-4 sm:p-6 max-w-7xl mx-auto"}>
      {showTitle && <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">{t("quizSection.availableQuizzes")}</h2>}

      {/* Search Bar */}
      <div className="relative mb-6 max-w-md">
        <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder={t("quizSection.searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          aria-label={t("quizSection.searchPlaceholder")}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <SkeletonQuizCard key={idx} />
          ))}
        </div>
      ) : filteredQuizzes.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6"
        >
          <AnimatePresence>
            {filteredQuizzes.map((quiz, i) => (
              <motion.div
                key={quiz._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ scale: 1.03, boxShadow: "0px 6px 16px rgba(0,0,0,0.15)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-orange-50 rounded-xl border border-orange-100 p-4 flex flex-col shadow group"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{quiz.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{quiz.description}</p>

                <div className="flex flex-col gap-1 text-sm text-gray-700 mb-4">
                  <p className="flex items-center gap-2">
                    <HiClock className="w-4 h-4 text-gray-500" />
                    <span>
                      {t("quizSection.scheduled")}:{" "}
                      <span className="font-medium">
                        {new Date(quiz.schadule).toLocaleDateString()} {t("quizSection.at")}{" "}
                        {new Date(quiz.schadule).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <HiClock className="w-4 h-4 text-gray-500" />
                    <span>
                      {t("quizSection.duration")}: <span className="font-medium">{quiz.duration} {t("quizSection.minutes")}</span>
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <HiQuestionMarkCircle className="w-4 h-4 text-gray-500" />
                    <span>
                      {t("quizSection.questions")}: <span className="font-medium">{quiz.questions_number}</span>
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <HiScale className="w-4 h-4 text-gray-500" />
                    <span>
                      {t("quizSection.difficulty")}: <span className="font-medium capitalize">{quiz.difficulty}</span>
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <HiUsers className="w-4 h-4 text-gray-500" />
                    <span>
                      {t("quizSection.participants")}: <span className="font-medium">{quiz.participants}</span>
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">{t("quizSection.type")}:</span>{" "}
                    <span className="font-medium">{quiz.type}</span>
                  </p>
                </div>

                <div className="mt-auto gap-2 flex items-center justify-between pt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      quiz.status === "open"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {t("quizSection.status")}: {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewDetails(quiz._id)}
                    className="flex cursor-pointer items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
                    aria-label={`${t("quizSection.viewDetails")} ${quiz.title}`}
                  >
                    <span className="text-sm">{t("quizSection.viewDetails")}</span>
                    <HiArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <Nodata />
      )}
    </section>
  )
}
