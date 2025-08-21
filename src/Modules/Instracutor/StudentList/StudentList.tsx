import { useEffect, useState } from 'react';
import { axiosInstance, Student_URLS, STUDENTS_URLS } from '../../../Server/baseUrl';
import { IoCheckmarkCircle } from 'react-icons/io5';
import './StudentList.css';
import { IoIosArrowForward } from 'react-icons/io';
import { FaRegEye } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import DeleteModal from '../../../Component/shared/Delete';
import type { Student } from '../../../Interfaces/Students/Interfaces';
import { StudentDetailsModal } from './StudentViewModel';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

function StudentSkeletonLoader({ count = 12 }: { count?: number }) {
  return (
    <div className="flex justify-center flex-wrap gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-4 gap-4 bg-white rounded-lg shadow-md w-full md:w-[48%] lg:w-[31%] animate-pulse"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-300" />
            <div>
              <div className="h-4 bg-gray-300 rounded w-32 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-20" />
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

export default function StudentList() {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  let [modalLoading, setmodalLoading] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const openDeleteModal = (studentid: string) => {
    setStudentId(studentid);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };
  const user = useSelector((state: RootState) => state.auth.LogData);

  let navigate = useNavigate();
  if (user?.role === 'Student') {
    navigate('/dashboard');
  }

  async function fetchStudents() {
    setLoading(true);
    try {
      const response = await axiosInstance.get(Student_URLS.getStudents);
      setStudents(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }

  async function deleteStudent() {
    if (!studentId) return;
    setmodalLoading(true);
    try {
      const response = await axiosInstance.delete(STUDENTS_URLS.DELETE_STUDENT(studentId));
      toast.success(response.data.message);
      fetchStudents();
      setOpenMenuId(null);
      closeDeleteModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete student');
    } finally {
      setmodalLoading(false);
    }
  }

  async function viewStudent(id: string) {
    setViewLoading(true);
    setShowModal(true);
    try {
      const response = await axiosInstance.get(STUDENTS_URLS.GET_STUDENT_BY_ID(id));
      setSelectedStudent(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to view student');
      setShowModal(false);
    } finally {
      setViewLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) =>
    `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // ---------------- Framer Motion Variants ----------------
  const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit:    { opacity: 0, y: -16, transition: { duration: 0.25 } },
};

const menuVariants: Variants = {
  hidden:  { opacity: 0, y: -8, scale: 0.98 },
  visible: { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.18 } },
  exit:    { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.15 } },
};

  

  return (
    <>
      <div className="listStudent px-4 py-6">
        <form className="max-w-md mx-5 mb-5">
          <input
            type="search"
            placeholder={t('studentList.searchPlaceholder')}
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </form>

        {loading ? (
          <StudentSkeletonLoader count={itemsPerPage} />
        ) : (
          <>
            <motion.div
              className="flex justify-center flex-wrap gap-4"
              variants={listVariants}
              initial="hidden"
              animate="visible"
              key={`page-${page}-${searchTerm}`}
            >
              <AnimatePresence>
                {paginatedStudents.map((user) => (
                  <motion.div
                    key={user._id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="relative flex items-center justify-between p-4 gap-4 bg-white rounded-lg shadow-md w-full md:w-[48%] lg:w-[31%]"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.first_name}`}
                        alt="avatar"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-black text-lg">
                          {user.first_name} {user.last_name}
                        </h4>
                        <span className="block text-sm text-gray-600">
                          {t('studentList.group')}: {user.group?.name || t('studentDetails.noGroup')}
                        </span>
                        <div className="flex items-center gap-1 text-green-600 text-sm mt-1">
                          <span>{t(`status.${user.status.toLowerCase()}`)}</span>
                          <IoCheckmarkCircle />
                        </div>
                      </div>
                    </div>

                    <div
                      onClick={() => toggleMenu(user._id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
                    >
                      <IoIosArrowForward className="text-black text-lg" />
                    </div>

                    <AnimatePresence>
                      {openMenuId === user._id && (
                        <motion.div
                          key="menu"
                          variants={menuVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute right-4 top-16 bg-white shadow-lg rounded-md z-20 text-sm w-48 border border-gray-100"
                        >
                          <button
                            onClick={() => viewStudent(user._id)}
                            className="w-full px-4 py-2 hover:bg-gray-100 text-left flex text-black items-center"
                          >
                            <FaRegEye className="mr-2 text-green-600 text-lg" /> {t('actions.view')}
                          </button>
                          <button
                            onClick={() => openDeleteModal(user?._id)}
                            className="w-full px-4 py-2 hover:bg-gray-100 text-black text-left flex items-center"
                          >
                            <MdDelete className="mr-2 text-red-600 text-lg" /> {t('actions.delete')}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <ul className="inline-flex -space-x-px text-sm">
                  <li
                    onClick={() => setPage((old) => Math.max(old - 1, 1))}
                    className={`cursor-pointer px-3 py-2 ml-0 leading-tight border rounded-l-lg 
          ${page === 1 ? 'text-gray-400 border-gray-300 bg-white cursor-not-allowed' : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-900'}`}
                  >
                    {t('pagination.previous')}
                  </li>

                  <li
                    onClick={() => setPage(1)}
                    className={`cursor-pointer px-3 py-2 leading-tight border 
          ${page === 1 ? 'text-white bg-blue-600 border-blue-600' : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-900'}`}
                  >
                    1
                  </li>

                  {page > 3 && totalPages > 5 && (
                    <li
                      className="cursor-pointer text-black px-3 py-2 border border-gray-300 bg-white"
                      onClick={() => setPage(Math.max(1, page - 2))}
                    >
                      ...
                    </li>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((i) => i !== 1 && i !== totalPages)
                    .filter((i) => i >= page - 1 && i <= page + 1)
                    .map((i) => (
                      <li
                        key={i}
                        onClick={() => setPage(i)}
                        className={`cursor-pointer px-3 py-2 leading-tight border 
              ${page === i ? 'text-white bg-blue-600 border-blue-600' : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-900'}`}
                      >
                        {i}
                      </li>
                    ))}

                  {page < totalPages - 2 && totalPages > 5 && (
                    <li
                      className="cursor-pointer pagination-points px-3 py-2 border border-gray-300 bg-white"
                      onClick={() => setPage(Math.min(totalPages, page + 2))}
                    >
                      ...
                    </li>
                  )}

                  {totalPages > 1 && (
                    <li
                      onClick={() => setPage(totalPages)}
                      className={`cursor-pointer px-3 py-2 leading-tight border  
            ${page === totalPages ? 'text-white bg-blue-600 border-blue-600' : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-900'}`}
                    >
                      {totalPages}
                    </li>
                  )}

                  <li
                    onClick={() => setPage((old) => Math.min(old + 1, totalPages))}
                    className={`cursor-pointer px-3 py-2 leading-tight border rounded-r-lg
          ${page === totalPages ? 'text-black border-gray-300 bg-white cursor-not-allowed' : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-900'}`}
                  >
                    {t('pagination.next')}
                  </li>
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      <StudentDetailsModal loading={viewLoading} isOpen={showModal} onClose={() => setShowModal(false)} student={selectedStudent} />

      <DeleteModal
        show={showDeleteModal}
        onClose={closeDeleteModal}
        onDeleteConfirm={deleteStudent}
        title="Delete Student"
        message="Are you sure you want to delete this Student?"
        loading={modalLoading}
      />
    </>
  );
}
