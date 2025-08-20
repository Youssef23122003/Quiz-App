import { useLocation, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { HiChevronRight, HiMagnifyingGlass } from "react-icons/hi2";
import type { QuizResult } from "../../../../Interfaces/Quizzes/Interfaces";



export default function QuizView() {
  const { state } = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const quizResults: QuizResult[] = state.participants || [];

  console.log(quizResults)

  const quizTitle = state.title || "Quiz";

  const filteredResults = useMemo(() => {
    if (!searchTerm) return quizResults;

    return quizResults.filter((result) => {
      const name = `${result.participant.first_name} ${result.participant.last_name}`.toLowerCase();
      return name.includes(searchTerm.toLowerCase());
    });
  }, [searchTerm, quizResults]);

  return (
    <div className="p-4 sm:p-6  mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm quiz-nav text-gray-600" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/quizes" className="hover:underline ">
              Quizzes
            </Link>
          </li>
          <li>
            <HiChevronRight className="w-4 h-4 text-gray-400" />
          </li>
          <li className="font-medium quiz-tiele text-gray-900" aria-current="page">
            {quizTitle}
          </li>
        </ol>
      </nav>

      {/* Search */}
      <div className="relative mb-4">
        <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by student name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full text-sm text-left text-gray-700 min-w-full">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Student name</th>
              <th className="px-6 py-3 text-center">Score</th>
              <th className="px-6 py-3 text-center">Submitted at</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.length > 0 ? (
              filteredResults.map((item, i) => (
                <tr
                  key={item._id}
                  className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4">{i + 1}</td>
                  <td className="px-6 py-4 font-medium whitespace-nowrap">
                    {item.participant.first_name} {item.participant.last_name}
                  </td>
                  <td className="px-6 py-4 text-center">{item.score}</td>
                  <td className="px-6 py-4 text-center">
                    {item.finished_at}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No participants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
