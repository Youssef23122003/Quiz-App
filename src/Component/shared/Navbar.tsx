import { useState } from "react"
import { HiBars3, HiChevronDown } from "react-icons/hi2"

import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import DarkModeToggle from "../DarkModeToggle";
import { MdLogout } from "react-icons/md";
import { FaLock } from "react-icons/fa";

interface HeaderProps {
  onMenuToggle: () => void
}

export default function Navbar({ onMenuToggle }: HeaderProps) {


  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const location = useLocation();
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.LogData);


  const navigate = useNavigate();
  function logOut() {
    localStorage.removeItem("token");
    navigate("/login");
  }


const routeTitles = (pathname: string): string => {
 if (pathname.includes("/quizes")) return t("sidebar.quizzes");
  if (pathname.includes("/students")) return t("sidebar.students");
  if (pathname.includes("/groups")) return t("sidebar.groups");
  if (pathname.includes("/questions")) return t("sidebar.questions");
  if (pathname.includes("/dashboard")) return t("sidebar.dashboard");
  if (pathname.includes("/quiz-result")) return t("sidebar.results");
  if (pathname.includes("/quiz-result-view")) return t("sidebar.quizzes");
  if (pathname.includes("/quiz-exam")) return 'Quiz Exam';
  return "Page";
};


  const pageTitle = routeTitles(location.pathname) || "";
console.log(location.pathname)
  return (
    <header className="bg-white border-b border-gray-200 px-4 dark:bg-black  sm:px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="inline-flex items-center justify-center p-2 bg-transparent text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 lg:hidden"
            aria-label={t("toggleMenu")}
          >
            <HiBars3 className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-lg sm:text-xl font-semibold">{pageTitle}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">


          <button
            className="px-4 dark:bg-black py-1 bg-gray-300 text-black rounded"
            onClick={() => i18n.changeLanguage(i18n.language === "en" ? "ar" : "en")}
          >
            {i18n.language === "en" ? "عربي" : "English"}
          </button>

            <DarkModeToggle />

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
              aria-expanded={isProfileOpen}
              aria-haspopup="true"
            >
              <div className=" hidden sm:block text-start">
                <div className="font-medium text-sm">{user?.first_name}</div>
                <div className="text-xs text-green-600">{t(`${user?.role}`)}</div>
              </div>
              <HiChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Dropdown menu */}
           {isProfileOpen && (
  <div className="absolute droplist-std right-0 top-full mt-2 z-50 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden transition-all duration-200">
    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
      <li>
        <button
          onClick={logOut}
          className="w-full flex gap-2 items-center text-left px-4 py-2 text-red-600 hover:bg-red-50   transition"
        >
          <MdLogout className="text-lg" /> Logout
        </button>
      </li>
      <li>
        <button
          onClick={() => { navigate('/change-password') }}
          className="w-full flex items-center gap-2 text-left px-4 py-2 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-gray-700 transition"
        >
          <FaLock className="text-lg" /> Change Password
        </button>
      </li>
    </ul>
  </div>
)}

          </div>

        </div>
      </div>
    </header>
  )
}
