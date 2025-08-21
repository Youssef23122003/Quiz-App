import { useEffect, useState} from "react";
import {
  axiosInstance,
  TOP_STUDENTS,
  STUDENTS_URLS,
  Quizzes_URLS,
  Students_Quizes,
} from "../../Server/baseUrl";
import { FaArrowRight, FaLongArrowAltRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { format } from "date-fns";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import { t } from "i18next";
import { motion} from "framer-motion";
import { StudentDetailsModal } from "../../Modules/Instracutor/StudentList/StudentViewModel";
import type { Student } from "../../Interfaces/Students/Interfaces";
import type { Quiz } from "../../Interfaces/Quizzes/Interfaces";



function SkeletonQuizCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow p-4 flex justify-between items-start mb-3 animate-pulse">
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="h-5 w-16 bg-gray-300 rounded-full"></div>
    </div>
  );
}

function SkeletonStudentCard() {
  return (
    <div className="flex items-center gap-4 p-2 border border-gray-200 rounded-lg animate-pulse">
      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
    </div>
  );
}



const images = Array.from(
  { length: 5 },
  (_, i) => `https://randomuser.me/api/portraits/men/${i + 1}.jpg`
);

export default function Dashboard() {
  const [isQuizzesLoading, setIsQuizzesLoading] = useState(false);
  const [isTopStudentsLoading, setIsTopStudentsLoading] = useState(false);
  const [viewStudentLoading, setViewStudentLoading] = useState(false);
  const [topStudents, setTopStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const user = useSelector((state: RootState) => state.auth.LogData);

  const fetchTopStudents = async () => {
    setIsTopStudentsLoading(true);
    try {
      const { data } = await axiosInstance.get(TOP_STUDENTS.GET_TOP_STUDENTS);
      setTopStudents(data);
    } catch {
      toast.error("Error fetching top students");
    } finally {
      setIsTopStudentsLoading(false);
    }
  };

  const getFirstFiveIncommingQuizz = async () => {
    setIsQuizzesLoading(true);
    try {
      const { data } = await axiosInstance.get(
        Students_Quizes.First_Five_Incomming_Quizz
      );
      setQuizzes(data);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsQuizzesLoading(false);
    }
  };

  const fetchQuizzes = async () => {
    setIsQuizzesLoading(true);
    try {
      const { data } = await axiosInstance.get(Quizzes_URLS.SetUP_Quizz);
      setQuizzes(data);
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsQuizzesLoading(false);
    }
  };

const viewStudent = async (id: string) => {
  try {
    setShowModal(true);
    setViewStudentLoading(true);
    const { data } = await axiosInstance.get(STUDENTS_URLS.GET_STUDENT_BY_ID(id));

    // 👇 تأكد من أن كل الحقول موجودة
    const studentData: Student = {
      _id: data._id,
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      email: data.email || '',
      status: data.status || 'active',
      avg_score: data.avg_score || 0,
      role: data.role || 'student',
      group: data.group || { name: t('studentDetails.noGroup') },
    };

    setSelectedStudent(studentData);
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Failed to view student");
  } finally {
    setViewStudentLoading(false);
  }
};

  useEffect(() => {
    const init = async () => {
      try {
        if (user?.role === "Instructor") {
          await Promise.all([fetchQuizzes(), fetchTopStudents()]);
        } else {
          await getFirstFiveIncommingQuizz();
        }
      } catch (e) {
        console.log(e);
      }
    };
    init();
  }, [user?.role]);

  const renderLoadingBox = (text = "Loading upcoming quizzes...") => (
    <div className="bg-white border  rounded-lg shadow p-4 text-center text-gray-500">
      {text}
    </div>
  );

  const renderQuizCard = (quiz: Quiz, index: number) => (
    <motion.div
      key={quiz._id}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white border border-gray-200 rounded-lg shadow p-4 flex justify-between items-start mb-3"
    >
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2">
          {quiz.title}
        </h3>
        <p className="text-sm text-gray-600 mb-1">
          📅 <span className="font-medium">Scheduled:</span>{" "}
          {!isNaN(new Date(quiz.schadule).getTime())
            ? format(
                new Date(quiz.schadule),
                "EEEE, MMMM d, yyyy 'at' hh:mm a"
              )
            : "Invalid date"}
        </p>
        <p className="text-sm text-gray-600">
          🔒 <span className="font-medium">Code:</span> {quiz.code}
        </p>
      </div>
      <span
        className={`text-xs font-semibold px-3 py-1 rounded-full mb-3 ${
          quiz.status === "open"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        ● {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
      </span>
    </motion.div>
  );

  const renderStudentCard = (student: Student, index: number) => (
    <motion.div
      key={student._id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex items-center gap-4 p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
    >
      <img
        src={images[index % images.length]}
        alt={`${student.first_name} ${student.last_name}`}
        className="w-12 h-12 rounded-full object-cover"
        loading="lazy"
      />
      <div className="flex-1">
        <h3 className="font-medium text-black text-sm capitalize">
          {student.first_name} {student.last_name}
        </h3>
        <p className="text-xs text-gray-500">
          Class rank: {student.group?.name || "N/A"} | Average score:{" "}
          {+student.avg_score % 1 === 0
            ? student.avg_score
            : student.avg_score.toFixed(2)}
          %
        </p>
      </div>
      <button onClick={() => viewStudent(student._id)}>
        <FaArrowRight className="w-5 h-5 text-gray-400 hover:text-black" />
      </button>
    </motion.div>
  );

  if (user?.role === "Student") {
    return (
      <div className="w-full px-4 py-6">
        <div className="mt-10 w-full">
          <h2 className="text-lg font-semibold mb-4">Upcoming 5 quizzes</h2>
          {isQuizzesLoading
            ? Array.from({ length: quizzes.length || 5 }).map((_, i) => (
                <SkeletonQuizCard key={i} />
              ))
            : quizzes.length > 0
            ? quizzes.slice(0, 5).map(renderQuizCard)
            : renderLoadingBox("No upcoming quizzes available")}

          <Link
            to="/quizes"
            className="text-green-600 mt-3 text-sm font-semibold flex items-center hover:underline"
          >
            View Quiz directory <FaLongArrowAltRight className="ml-1" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full Quiz-Dashborad px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="mt-10 w-full lg:w-1/2">
          <h2 className="text-lg upcomming-quizees font-semibold mb-4">
            {t("Dashboard.upcomingQuizzes")}
          </h2>
          {isQuizzesLoading
            ? Array.from({ length: quizzes.length || 5 }).map((_, i) => (
                <SkeletonQuizCard key={i} />
              ))
            : quizzes.length > 0
            ? quizzes.slice(0, 5).map(renderQuizCard)
            : renderLoadingBox(t("Dashboard.noUpcomingQuizzes"))}
          <Link
            to="/quizes"
            className="text-green-600 mt-3 text-sm font-semibold flex items-center hover:underline"
          >
            {t("Dashboard.viewQuizDirectory")}{" "}
            <FaLongArrowAltRight className="ml-1" />
          </Link>
        </div>

        <div className="w-full lg:w-1/2 rounded-xl border border-gray-200 bg-white shadow p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-black font-semibold">
              {t("Dashboard.topStudents")}
            </h2>
            <Link
              to="/students"
              className="text-sm font-bold hover:underline flex items-center"
            >
              {t("Dashboard.allStudents")}{" "}
              <FaLongArrowAltRight className="ml-1 text-green-400 text-lg" />
            </Link>
          </div>
          <div className="space-y-3">
            {isTopStudentsLoading
              ? Array.from({ length: topStudents.length || 5 }).map((_, i) => (
                  <SkeletonStudentCard key={i} />
                ))
              : topStudents.slice(0, 5).map(renderStudentCard)}
          </div>
        </div>
      </div>
      <StudentDetailsModal
        loading={viewStudentLoading}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        student={selectedStudent}
      />
    </div>
  );
}
