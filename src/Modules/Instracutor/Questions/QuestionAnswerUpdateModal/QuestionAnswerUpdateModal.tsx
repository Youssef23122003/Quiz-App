import { FaCheck, FaSpinner, FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { t } from "i18next";
import React from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  defaultAnswer?: string;
  loading?: boolean;
};

export default function QuestionAnswerUpdateModal({
  isOpen,
  onClose,
  onSubmit,
  defaultAnswer = "",
  loading = false,
}: Props) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({ defaultValues: { answer: defaultAnswer } });

  React.useEffect(() => {
    setValue("answer", defaultAnswer);
  }, [defaultAnswer, setValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-[500px] rounded-lg shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">{t("questions.updateTitle")}</h3>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FaCheck className="text-xl" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="relative flex border border-gray-200 rounded-lg focus-within:border-gray-200">
              <label
                htmlFor="answer"
                className="flex items-center justify-center flex-shrink-0 bg-[#f8ebd9] text-lg font-bold text-black px-4 py-3 rounded-l-lg"
                style={{ minWidth: "110px" }}
              >
                {t("questions.answerLabel")}
              </label>
              <input
                id="answer"
                {...register("answer", { required: "Answer is required" })}
                type="text"
                className="flex-grow px-4 py-3 rounded-r-lg focus:outline-none text-gray-800"
              />
            </div>
            {errors.answer && <p className="text-red-600 text-sm mt-1">{errors.answer.message}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
