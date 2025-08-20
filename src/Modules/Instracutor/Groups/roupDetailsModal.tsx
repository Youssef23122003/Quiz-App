import React from 'react';
import { IoCloseSharp } from 'react-icons/io5';

import type { Group } from '../../../Interfaces/Groups/Interfaces';
import { t } from 'i18next';

interface Props {
  show: boolean;
  onClose: () => void;
  group: Group | null;
  loading?: boolean;
}

const GroupDetailsSkeleton = () => {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>

      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        ))}
      </div>
    </div>
  );
};

const GroupDetailsModal: React.FC<Props> = ({ show, onClose, group, loading }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow-2xl w-[90%] max-w-lg p-6 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold"
          aria-label="Close Modal"
        >
          <IoCloseSharp />
        </button>

        {loading ? (
          <GroupDetailsSkeleton />  
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center pb-2">
              {t("GroupsList.groupDetails")}
            </h2>
            <div className="space-y-3">
              <p>
                <span className="font-semibold">{t("GroupsList.groupName")}:</span> {group?.name}
              </p>
              <p>
                <span className="font-semibold">{t("GroupsList.instructor")}:</span> {group?.instructor}
              </p>
              <p>
                <span className="font-semibold">{t("GroupsList.status")}:</span> {group?.status}
              </p>
              <p>
                <span className="font-semibold">{t("GroupsList.studentsCount")}:</span> {group?.students?.length}
              </p>

              <div className="flex flex-col gap-1">
                <span className="font-semibold">{t("GroupsList.students")}:</span>
                {group?.students?.map((student) => (
                  <p key={student._id}>
                    {student.first_name} {student.last_name}
                  </p>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GroupDetailsModal;
