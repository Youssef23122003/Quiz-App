import { HiHome, HiUsers, HiDocumentText, HiBars3, HiQuestionMarkCircle } from "react-icons/hi2";
import { FaUserGraduate } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next"; 
import logo from "../../assets/Log-icon.png";
import darkLogo from "../../assets/Logo-white.png";

import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import { useEffect } from "react";
import i18n from "../../i18n";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

const navigationItems = [
  {
    icon: HiHome,
    labelKey: "sidebar.dashboard",
    href: "/dashboard",
    badge: null,
    iconBg: "bg-orange-100",
    iconColor: "text-black",
  },
  {
    icon: HiUsers,
    labelKey: "sidebar.groups",
    href: "/groups",
    badge: null,
    iconBg: "bg-orange-100",
    iconColor: "text-black",
    onlyFor: ["Admin", "Instructor"], 
  },
  {
    icon: FaUserGraduate,
    labelKey: "sidebar.students",
    href: "/students",
    badge: "2",
    iconBg: "bg-orange-100",
    iconColor: "text-black",
    onlyFor: ["Admin", "Instructor"],
  },
  {
    icon: MdQuiz,
    labelKey: "sidebar.quizzes",
    href: "/quizes",
    badge: null,
    iconBg: "bg-orange-100",
    iconColor: "text-black",
    onlyFor: ["Admin", "Instructor"], 
  },
  {
    icon: MdQuiz,
    labelKey: "sidebar.quizes-std",
    href: "/quizes-std",
    badge: null,
    iconBg: "bg-orange-100",
    iconColor: "text-black",
    onlyFor: ["User", "Student"], 
  },
  {
    icon: HiDocumentText,
    labelKey: "sidebar.results",
    href: "/quiz-result",
    badge: null,
    iconBg: "bg-orange-100",
    iconColor: "text-black",
  },
];

export default function Sidebar({ isOpen, onClose, onMenuToggle, isSidebarOpen }: SidebarProps) {
  const location = useLocation();
  const { t } = useTranslation(); 
  const user = useSelector((state: RootState) => state.auth.LogData);

  const isActiveItem = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  useEffect(() => {
    const dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
  }, [i18n.language]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0  bg-opacity-50 z-40 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${isSidebarOpen ? "w-64" : "w-16 lg:w-20"}
        `}
        aria-label="Main navigation"
      >
        <div className={`transition-all duration-300 ${isSidebarOpen ? "p-6" : "p-2 lg:p-4"}`}>
          <div className="flex items-center justify-center lg:justify-start">
            <div className={`flex items-center transition-all duration-300 ${isSidebarOpen ? "gap-4" : "gap-0"}`}>
              <button
                onClick={onMenuToggle}
                className="inline-flex cursor-pointer hamburger-button items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 flex-shrink-0"
                aria-label="Toggle navigation menu"
              >
                <HiBars3 className="w-5 hamburger-menu h-5 lg:w-6 lg:h-6" />
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isSidebarOpen ? "w-16 opacity-100 ml-4" : "w-0 opacity-0 ml-0"
                }`}
              >
                <img src={logo || "/placeholder.svg"} alt="logo" className="w-16 h-auto light-logo" />
                <img src={darkLogo || "/placeholder.svg"} alt="logo" className="w-16  dark-logo" />
              </div>
            </div>
          </div>
        </div>

        <nav className={`space-y-1 transition-all duration-300 ${isSidebarOpen ? "px-4" : "px-2"}`} role="navigation">
          {navigationItems
            .filter((item) => {
            
              if (item.onlyFor) {
                return item.onlyFor.includes(user?.role || "");
              }
              return true;
            })
            .map((item) => {
              const Icon = item.icon;
              const isActive = isActiveItem(item.href);

              return (
                <div key={item.labelKey} className="relative group">
                  <Link
                    to={item.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={`
                      flex items-center rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 w-full
                      ${isSidebarOpen ? "gap-4 px-4 py-4" : "gap-0 px-2 py-3 justify-center"}
                      ${isActive
                        ? "bg-gray-900 active-link  text-white focus-visible:ring-white focus-visible:ring-offset-gray-900"
                        : "text-gray-700 dark-links hover:bg-gray-100"}
                    `}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <div className={`relative flex-shrink-0 ${!isSidebarOpen ? "mx-auto" : ""}`}>
                      <div
                        className={`w-8 h-8 rounded-lg  flex items-center justify-center transition-all duration-200 ${
                          isActive ? "bg-white" : item.iconBg
                        }`}
                      >
                        <Icon className={`w-5 h-5  ${isActive ? "text-gray-900" : item.iconColor}`} aria-hidden="true" />
                      </div>
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 bg-black  text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] z-10">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {isSidebarOpen && (
                      <span
                        className={`font-medium whitespace-nowrap transition-all duration-300 ${
                          isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                        }`}
                      >
                        {t(item.labelKey)}
                      </span>
                    )}
                  </Link>

                  {!isSidebarOpen && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 hidden lg:block">
                      {t(item.labelKey)}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                    </div>
                  )}
                </div>
              );
            })}
        </nav>

        <div className={`absolute bottom-4 lg:bottom-8 w-full transition-all duration-300 ${isSidebarOpen ? "px-4" : "px-2"}`}>
          <div className="relative group">
            <Link
              to="/help"
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={`
                flex items-center rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 text-gray-700 hover:bg-gray-50 w-full
                ${isSidebarOpen ? "gap-4 px-4 py-4" : "gap-0 px-2 py-3 justify-center"}
              `}
            >
              <div
                className={`w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 ${!isSidebarOpen ? "mx-auto" : ""}`}
              >
                <HiQuestionMarkCircle className="w-5 h-5 text-black" aria-hidden="true" />
              </div>

              {isSidebarOpen && (
                <span className="font-medium help-link whitespace-nowrap transition-all duration-300">
                  {t("sidebar.help")}
                </span>
              )}
            </Link>

            {!isSidebarOpen && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 hidden lg:block">
                {t("sidebar.help")}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
