// GroupFormModal.tsx
import React, { useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { FaTimes, FaCheck, FaSpinner } from 'react-icons/fa';
import type { AddGroup, StudentOption } from '../../../Interfaces/Groups/Interfaces';
import { t } from 'i18next';

interface Props {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: AddGroup) => void;
  loading?: boolean;
  isUpdateMode?: boolean;
  defaultValues?: AddGroup;            // { name: string; students: string[] }
  studentOptions: StudentOption[];     // { value: string; label: string }
}

const GroupFormModal: React.FC<Props> = ({
  show,
  onClose,
  onSubmit,
  loading = false,
  isUpdateMode = false,
  defaultValues = { name: '', students: [] },
  studentOptions
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddGroup>({
    defaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  // مهم: نعمل reset كل مرة القيم الافتراضية تتغير أو المودال يفتح
  useEffect(() => {
    if (show) reset(defaultValues);
  }, [defaultValues, show, reset]);

  // إغلاق بالـ ESC
  const escHandler = useCallback(
    (e: KeyboardEvent) => {
      if (!loading && show && e.key === 'Escape') onClose();
    },
    [loading, show, onClose]
  );

  useEffect(() => {
    if (show) {
      window.addEventListener('keydown', escHandler);
      return () => window.removeEventListener('keydown', escHandler);
    }
  }, [show, escHandler]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onMouseDown={(e) => {
        // إغلاق عند الضغط على الخلفية فقط (مش داخل الصندوق)
        if (!loading && (e.target as HTMLElement).id === 'group-form-backdrop') onClose();
      }}
      id="group-form-backdrop"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-2xl shadow-2xl w-[95%] max-w-[820px] p-6 relative animate-fade-in"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
            <h3 className="text-lg font-semibold">
              {isUpdateMode ? (t('GroupsList.updateGroup') || 'Update Group') : (t('GroupsList.addGroup') || 'Add Group')}
            </h3>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading || isSubmitting}
                className="text-gray-700 dark:text-gray-300 hover:text-green-600 disabled:opacity-50 transition-colors"
                aria-label="Submit"
              >
                {loading || isSubmitting ? <FaSpinner className="animate-spin" /> : <FaCheck className="text-xl" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading || isSubmitting}
                className="text-gray-700 dark:text-gray-300 hover:text-red-600 disabled:opacity-50 transition-colors"
                aria-label="Close"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-4">
            {/* Group Name */}
            <div className="relative flex border border-gray-200 dark:border-gray-700 rounded-lg">
              <label
                htmlFor="groupName"
                className="flex items-center justify-center flex-shrink-0 bg-[#f8ebd9] dark:bg-amber-200/80 text-lg font-bold text-black px-4 py-3 rounded-l-lg min-w-[110px]"
              >
                {t('GroupsList.groupName') || 'Group Name'}
              </label>
              <input
                id="groupName"
                autoFocus
                {...register('name', { required: (t('GroupsList.nameRequired') || 'Name is required') as string })}
                type="text"
                className="flex-grow px-4 py-3 rounded-r-lg focus:outline-none bg-transparent text-gray-900 dark:text-white"
              />
            </div>
            {errors.name && <p className="text-red-600 text-sm mt-1">{String(errors.name.message)}</p>}

            {/* Students (multi select) */}
            <div className="relative flex border border-gray-200 dark:border-gray-700 rounded-lg">
              <span className="flex items-center justify-center flex-shrink-0 bg-[#f8ebd9] dark:bg-amber-200/80 text-lg font-bold text-black px-4 py-3 rounded-l-lg min-w-[110px]">
                {t('GroupsList.students') || 'Students'}
              </span>
              <div className="flex-grow">
                <Controller
                  name="students"
                  control={control}
                  rules={{ required: (t('GroupsList.studentsRequired') || 'Students are required') as string }}
                  defaultValue={defaultValues.students || []} // يمنع التحذير (uncontrolled/controlled)
                  render={({ field }) => (
                    <Select
                      {...field}
                      inputId="studentsList"
                      options={studentOptions}
                      isMulti
                      placeholder={t('GroupsList.selectStudents') || 'Select students...'}
                      // مهم: القيمة لازم تبقى من نفس شكل options
                      value={studentOptions.filter((opt) => Array.isArray(field.value) && field.value.includes(opt.value))}
                      onChange={(selected) => {
                        const sel = (selected ?? []) as readonly StudentOption[];
                        field.onChange(sel.map((o) => o.value));
                      }}
                      // ستايلات معقولة بدون inline style خارج Tailwind
                      styles={{
                        control: (base) => ({
                          ...base,
                          backgroundColor: 'transparent',
                          border: '0',
                          boxShadow: 'none',
                          minHeight: 48,
                          borderRadius: 0,
                        }),
                        valueContainer: (base) => ({ ...base, paddingLeft: 16 }),
                        placeholder: (base) => ({ ...base, opacity: 0.7 }),
                        multiValue: (base) => ({ ...base, backgroundColor: '#e5e7eb' }),
                        multiValueLabel: (base) => ({ ...base, color: '#111827' }),
                      }}
                      classNamePrefix="group-select"
                      menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                      menuPosition="fixed"
                    />
                  )}
                />
              </div>
            </div>
            {errors.students && <p className="text-red-600 text-sm mt-1">{String(errors.students.message)}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupFormModal;
