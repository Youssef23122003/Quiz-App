import { useEffect, useState, Fragment } from "react";
import {
  axiosInstance,
  TOP_STUDENTS,
  STUDENTS_URLS,
  Quizzes_URLS,
  Students_Quizes,
} from "../../Server/baseUrl";
import { FaArrowRight, FaLongArrowAltRight, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import {
  HiOutlineUser,
  HiOutlineShieldCheck,
  HiOutlineUsers,
} from "react-icons/hi";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import { t } from "i18next";

interface Student {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  avg_score: number;
  role?: string;
  group?: {
    name: string;
  };
}

interface Quiz {
  _id: string;
  code: string;
  title: string;
  description: string;
  status: "open" | "closed";
  schadule: string;
  enrolled: number;
}


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


function StudentDetailsModal({
  isOpen,
  onClose,
  student,
  loading
}: {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  loading: boolean;
}) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 bg-opacity-30">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title className="text-lg font-bold">Student Details</Dialog.Title>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
                  aria-label="Close modal"
                >
                  ×
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <FaSpinner className="animate-spin text-3xl text-gray-600" />
                </div>
              ) : student ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="flex items-center text-gray-700 font-semibold mb-2">
                      <HiOutlineUser className="mr-2" /> Personal Information
                    </h3>
                    <p><strong>Full Name:</strong> {student.first_name} {student.last_name}</p>
                    <p><strong>Email:</strong> {student.email}</p>
                    <p><strong>Student ID:</strong> {student._id}</p>
                    <p className="flex items-center gap-1">
                      <HiOutlineShieldCheck className="text-sm" /> {student.role || "student"}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="flex items-center text-gray-700 font-semibold mb-2">
                      <HiOutlineUsers className="mr-2" /> Group Information
                    </h3>
                    <p><strong>Group Name:</strong> {student.group?.name || "No Group"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500">No student data</p>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}


const images = Array.from({ length: 5 }, (_, i) => `https://randomuser.me/api/portraits/men/${i + 1}.jpg`);

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
        const { data } = await axiosInstance.get(Students_Quizes.First_Five_Incomming_Quizz);
       
        setQuizzes(data);
      } catch (error: any) {
        console.log(error);
      } 
      finally{
        setIsQuizzesLoading(false)
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
      setViewStudentLoading(true)
      const { data } = await axiosInstance.get(STUDENTS_URLS.GET_STUDENT_BY_ID(id));
      setSelectedStudent(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to view student");
    }
    finally{
      setViewStudentLoading(false)
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

  const renderQuizCard = (quiz: Quiz) => (
    <div key={quiz._id} className="bg-white border border-gray-200 rounded-lg shadow p-4 flex justify-between items-start mb-3">
      <div>
        <h3 className="text-md font-semibold text-gray-800 mb-2">{quiz.title}</h3>
        <p className="text-sm text-gray-600 mb-1">
          📅 <span className="font-medium">Scheduled:</span>{" "}
          {!isNaN(new Date(quiz.schadule).getTime())
            ? format(new Date(quiz.schadule), "EEEE, MMMM d, yyyy 'at' hh:mm a")
            : "Invalid date"}
        </p>
        <p className="text-sm text-gray-600">
          🔒 <span className="font-medium">Code:</span> {quiz.code}
        </p>
      </div>
      <span
        className={`text-xs font-semibold px-3 py-1 rounded-full mb-3 ${quiz.status === "open"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
          }`}
      >
        ● {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
      </span>
    </div>
  );

  const renderStudentCard = (student: Student, index: number) => (
    <div key={student._id} className="flex items-center gap-4 p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
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
          Class rank: {student.group?.name || "N/A"} | Average score: {+student.avg_score % 1 === 0 ? student.avg_score : student.avg_score.toFixed(2)}%
        </p>
      </div>
      <button onClick={() => viewStudent(student._id)}>
        <FaArrowRight className="w-5 h-5 text-gray-400 hover:text-black" />
      </button>
    </div>
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
          <h2 className="text-lg upcomming-quizees font-semibold mb-4">{t("Dashboard.upcomingQuizzes")}</h2>
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
            {t("Dashboard.viewQuizDirectory")} <FaLongArrowAltRight className="ml-1" />
          </Link>
        </div>

        <div className="w-full lg:w-1/2 rounded-xl border border-gray-200 bg-white shadow p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg text-black font-semibold">{t("Dashboard.topStudents")}</h2>
            <Link
              to="/students"
              className="text-sm font-bold hover:underline flex items-center"
            >
              {t("Dashboard.allStudents")} <FaLongArrowAltRight className="ml-1 text-green-400 text-lg" />
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
      <StudentDetailsModal loading={viewStudentLoading} isOpen={showModal} onClose={() => setShowModal(false)} student={selectedStudent} />
    </div>
  );
}
