import { useLocation, Link } from "react-router-dom";
import { HiChevronRight } from "react-icons/hi2";

type QuizResult = {
  _id: string;
  quiz: { _id: string; title: string };
  participant: { _id: string; first_name: string; last_name: string; email: string };
  score: number;
  started_at: string;   
  finished_at: string;  
};

export default function QuizStudentView() {
  const { state } = useLocation() as {
    state?: { title?: string; result?: QuizResult };
  };

  const result = state?.result;
  const quizTitle = state?.title ?? result?.quiz?.title ?? "Quiz";

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-600" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/quizes" className="hover:underline">
              Quizzes
            </Link>
          </li>
          <li>
            <HiChevronRight className="w-4 h-4 text-gray-400" />
          </li>
          <li className="font-medium text-gray-900" aria-current="page">
            {quizTitle}
          </li>
        </ol>
      </nav>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="w-full text-sm text-left text-gray-700 min-w-full">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-6 py-3 w-12">#</th>
              <th className="px-6 py-3">Student name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3 text-center">Score</th>
              <th className="px-6 py-3 text-center">Started at</th>
              <th className="px-6 py-3 text-center">Submitted at</th>
            </tr>
          </thead>
          <tbody>
            {result ? (
              <tr className="bg-white">
                <td className="px-6 py-4">1</td>
                <td className="px-6 py-4 font-medium whitespace-nowrap">
                  {result.participant.first_name} {result.participant.last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{result.participant.email}</td>
                <td className="px-6 py-4 text-center">{result.score}</td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  {new Date(result.started_at).toLocaleString([], {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-6 py-4 text-center whitespace-nowrap">
                  {new Date(result.finished_at).toLocaleString([], {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">
                  No result data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
