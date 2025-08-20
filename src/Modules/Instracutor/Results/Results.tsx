import { useEffect, useState, useMemo } from "react";
import { FaRegEye} from "react-icons/fa";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { axiosInstance } from "../../../Server/baseUrl";
import { t } from 'i18next';
import { useNavigate } from "react-router-dom";
import type { QuizResult } from "../../../Interfaces/Quizzes/Interfaces";



function ResultsTableSkeleton({ rows = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
          {Array.from({ length: 7 }).map((_, colIndex) => (
            <td key={colIndex} className="px-4 py-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}


export default function ResultsPage() {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
const navigate = useNavigate();


  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/quiz/result"); 
      console.log(res.data)
      setResults(res.data);
    } catch (err) {
      console.error("Failed to fetch results", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const filteredResults = useMemo(() => {
    return results.filter(({ quiz }) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, results]);

  return (
    <div className="p-3 mx-auto">
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">Closed Quizzes</h1>
          <div className="relative w-full sm:w-80">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search quiz by title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full overflow-hidden border border-gray-200 rounded-xl">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="text-center px-4 py-3">Title</th>
                  <th className="text-center px-4 py-3">Status</th>
                  <th className="text-center px-4 py-3">Code</th>
                  <th className="text-center px-4 py-3">Schedule</th>
                  <th className="text-center px-4 py-3">Duration</th>
                  <th className="text-center px-4 py-3">Difficulty</th>
                  <th className="text-center px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <ResultsTableSkeleton rows={6} />
                ) : filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No closed quizzes found.
                    </td>
                  </tr>
                ) : (
                  filteredResults.map(({ quiz , participants }) => (
                    <tr key={quiz._id} className="border-b border-gray-200">
                      <td className="px-4 py-3 text-center font-medium">{quiz.title}</td>
                      <td className="px-4 py-3 text-center">{quiz.status}</td>
                      <td className="px-4 py-3 text-center">{quiz.code}</td>
                      <td className="px-4 py-3 text-center">{new Date(quiz.schadule).toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">{quiz.duration} mins</td>
                      <td className="px-4 py-3 text-center capitalize">{quiz.difficulty}</td>
                      <button
                      onClick={() => navigate(`/quiz-result-view`,{ state: {participants , title:quiz.title}  })}
                        className="w-full rounded-2xl text-center px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                                          <FaRegEye className="mr-2 text-green-600 text-lg" /> {t("actions.view")}
                                        </button>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
