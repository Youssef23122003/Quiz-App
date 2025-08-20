import { HiComputerDesktop, HiArrowRight } from "react-icons/hi2"
import { MdQuiz } from "react-icons/md"
import img1 from "../../../assets/img1.png"
import { useEffect, useState } from "react"
import QuizSetupModal from "./AddModel/QuizSetupModal"
import { useNavigate } from "react-router-dom"
import AllQuizzesPage from "./AllQuizzs/AllQuizzes"
import { axiosInstance, Quizzes_URLS } from "../../../Server/baseUrl"
import type { Quiz } from "../../../Interfaces/Quizzes/Interfaces"
import QuizSuccessModal from "./AddModel/QuizSuccessModal"
import { useSelector } from "react-redux"
import type { RootState } from "../../../Redux/store"
import { t } from "i18next"
import Nodata from "../../../Component/shared/Nodata"

function UpcomingSkeleton() {
  return (
    <div className="space-y-3 sm:space-y-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 sm:gap-4 lg:gap-6 p-4 sm:p-6 bg-white rounded-2xl border border-orange-100 animate-pulse"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-32 lg:h-32 rounded-2xl bg-gray-200 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="w-20 h-8 bg-gray-200 rounded-lg"></div>
        </div>
      ))}
    </div>
  )
}

function CompletedSkeleton() {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-900">
          <th className="text-left py-3 px-3 sm:px-6 text-white text-sm">Title</th>
          <th className="text-left py-3 px-3 sm:px-6 text-white text-sm">Group</th>
          <th className="text-left py-3 px-3 sm:px-6 text-white text-sm">Persons</th>
          <th className="text-left py-3 px-3 sm:px-6 text-white text-sm">Date</th>
        </tr>
      </thead>
      <tbody>
        {[1, 2, 3].map((i) => (
          <tr key={i} className="animate-pulse">
            <td className="py-3 px-3 sm:px-6">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </td>
            <td className="py-3 px-3 sm:px-6">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </td>
            <td className="py-3 px-3 sm:px-6">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </td>
            <td className="py-3 px-3 sm:px-6">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}


export default function QuizsList() {
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false)
  const [CompletedQuizes, setQuizzes] = useState<Quiz[]>([])
  const [upcomingQuizzes, setUpcomingQuizzes] = useState<Quiz[]>([])
  const [CompleteQuizzes, setCompleteQuizzes] = useState<Quiz[]>([])

  const navigate = useNavigate();
  const [loadingUpcoming, setLoadingUpcoming] = useState(true)
  const [loadingComplete, setLoadingComplete] = useState(true)
  const [isQuizSuccessModalOpen, setIsQuizSuccessModalOpen] = useState(false)
  const [generatedQuizCode, setGeneratedQuizCode] = useState("")

 const user = useSelector((state: RootState) => state.auth.LogData);

  
  if (user?.role === "Student") {
    navigate('/dashboard')
  }

  async function fetchCompleteQuizzes() {
    setLoadingComplete(true)
    try {
      const res = await axiosInstance.get(Quizzes_URLS.completed_Quizz);
      const all = res.data || []
      setQuizzes(all)
      setCompleteQuizzes(all)
    } catch (err) {
     
      console.error(err)
    }
    finally {
      setLoadingComplete(false)
    }
  }


 
    async function fetchAllQuizzes() {
      try {
        const res = await axiosInstance.get(Quizzes_URLS.SetUP_Quizz);
        const all = res.data || []

        setQuizzes(all)

        const now = new Date()

        const upcoming = all
          .filter((quiz: Quiz) => new Date(quiz.schadule) > now)
          .sort((a: Quiz, b: Quiz) => new Date(a.schadule).getTime() - new Date(b.schadule).getTime())
          .slice(0, 2)

        setUpcomingQuizzes(upcoming)
      } catch (err) {
        
        console.error(err)
      }
      finally {
        setLoadingUpcoming(false)
      }
    }

    useEffect(()=>{
    fetchAllQuizzes()
    fetchCompleteQuizzes()
    },[])
    


  const handleViewDetails = (id: string) => {
    navigate(`/quizes/${id}`)
  }

  const handleQuizSuccessClose = () => {
    setIsQuizSuccessModalOpen(false)
  }


  return (
    <div className="p-4 sm:p-6 max-w-full Quizes">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            <button onClick={() => setIsQuizModalOpen(true)} className="flex cursor-pointer flex-col items-center justify-center p-6 lg:p-8 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 group min-h-[200px]">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 lg:mb-6 group-hover:bg-gray-100 transition-colors duration-200">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <MdQuiz className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
                </div>
              </div>
              <span className="text-base lg:text-lg font-semibold text-gray-900 text-center">{t("QuizsList.setupQuiz")}</span>
            </button>

            <button onClick={() => navigate("/questions")} className="flex cursor-pointer flex-col items-center justify-center p-6 lg:p-8 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 group min-h-[200px]">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 lg:mb-6 group-hover:bg-gray-100 transition-colors duration-200">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <HiComputerDesktop className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
                </div>
              </div>
              <span className="text-base lg:text-lg font-semibold text-gray-900 text-center">{t("QuizsList.questionBank")}</span>
            </button>
          </div>
          <AllQuizzesPage />
        </div>

       
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">{t("QuizsList.upcomingQuizzes")}</h2>

            {loadingUpcoming ? (
               <UpcomingSkeleton />
            ) : upcomingQuizzes.length > 0 ? (
              <div className="space-y-3 bg-white sm:space-y-4">
                {upcomingQuizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="flex items-center gap-3 sm:gap-4 lg:gap-6 p-4 sm:p-6 bg-white rounded-2xl border border-orange-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="w-16 h-16 bg-orange-50 sm:w-20 sm:h-20 lg:w-32 lg:h-32 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <img
                        src={img1}
                        alt={`${quiz.title} illustration`}
                        className="w-full h-full sm:w-12 sm:h-12 lg:w-full lg:h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base lg:text-xl mb-1 sm:mb-2 line-clamp-2">
                        {quiz.title}
                      </h3>
                      <p className="text-gray-600 mb-2 sm:mb-3 text-xs sm:text-sm lg:text-base">
                        {new Date(quiz.schadule).toLocaleString()}
                      </p>
                      <p className="text-gray-700 text-xs sm:text-sm lg:text-base">
                        <span className="font-medium">{t("QuizsList.enrolled")}:</span> {quiz.participants}
                      </p>
                    </div>

                    <button
                      onClick={() => handleViewDetails(quiz._id)}
                      className="flex cursor-pointer items-center gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 flex-shrink-0"
                    >
                      <span className="font-medium text-xs sm:text-sm lg:text-base">{t("QuizsList.open")}</span>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#C5D86D] rounded-full flex items-center justify-center">
                        <HiArrowRight className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            ):(<Nodata/>) }
          </div>

          {/* Completed Quizzes */}
          <div className="bg-white w-full rounded-2xl  border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{t("QuizsList.completedQuizzes")}</h2>
              <button onClick={()=> navigate('/quiz-result')} className="flex cursor-pointer items-center gap-2 text-orange-500 hover:text-orange-600 font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded-lg px-2 sm:px-3 py-2">
                <span className="text-sm sm:text-base text-gray-900">{t("QuizsList.results")}</span>
                <HiArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-[#C5D86D]" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <div className="overflow-hidden rounded-xl border border-gray-200 min-w-full">
                <table className="w-full text-sm">
    
                  <tbody>
                    {loadingComplete ? (
                        <CompletedSkeleton />
                    ) : CompletedQuizes.length > 0 ? (
                      <div className="overflow-x-auto">
                        <div className="overflow-hidden rounded-xl border border-gray-200 min-w-full">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-900">
                                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-white text-sm sm:text-base">  {t("QuizsList.title")}</th>
                                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-white text-sm sm:text-base">{t("QuizsList.groupName")}</th>
                                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-white text-sm sm:text-base">{t("QuizsList.persons")}</th>
                                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-white text-sm sm:text-base">{t("QuizsList.date")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {CompleteQuizzes.map((quiz, index) => (
                                <tr
                                  key={quiz._id}
                                  className={`border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }`}
                                >
                                  <td className="py-3 sm:py-4 px-3 sm:px-6 font-medium text-gray-900 text-sm sm:text-base">
                                    {quiz.title}
                                  </td>
                                  <td className="py-3 sm:py-4 px-3 sm:px-6 text-gray-700 text-sm sm:text-base">{quiz.type}</td>
                                  <td className="py-3 sm:py-4 px-3 sm:px-6 text-gray-700 text-sm sm:text-base">
                                    {quiz.participants} persons
                                  </td>
                                  <td className="py-3 sm:py-4 px-3 sm:px-6 text-gray-700 text-sm sm:text-base">{quiz.schadule}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ): (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-500">
                          <Nodata/>
                        </td>
                      </tr>
                    ) }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      <QuizSetupModal fetchAllQuizzes={fetchAllQuizzes} setGeneratedQuizCode={setGeneratedQuizCode} setIsQuizSuccessModalOpen={setIsQuizSuccessModalOpen} isOpen={isQuizModalOpen} onClose={() => setIsQuizModalOpen(false)} />
      
      <QuizSuccessModal isOpen={isQuizSuccessModalOpen} onClose={handleQuizSuccessClose} quizCode={generatedQuizCode} />
    </div>
  )
}
