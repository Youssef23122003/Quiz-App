import { FaCheck, FaSpinner, FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { t } from "i18next";

interface JoinQuiz {
  code: string;
}

interface JoinQuizModalProps {
  show: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: JoinQuiz) => void;
}

export default function JoinQuizModal({
  show,
  loading,
  onClose,
  onSubmit,
}: JoinQuizModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<JoinQuiz>();

  const handleClose = () => {
    setValue("code", "");
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[800px] rounded-lg shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              {t("quizPage.modal.title")}
            </h3>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="text-gray-600 hover:text-green-600 transition-colors"
              >
                {loading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaCheck className="text-xl" />
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <div className="relative flex border border-gray-200 rounded-lg focus-within:border-gray-200">
              <label
                htmlFor="code"
                className="flex items-center justify-center flex-shrink-0 bg-[#f8ebd9] text-lg font-bold text-black px-4 py-3 rounded-l-lg"
                style={{ minWidth: "110px" }}
              >
                {t("quizPage.code")}
              </label>
              <input
                id="code"
                {...register("code", { required: "Code is required" })}
                type="text"
                className="flex-grow px-4 py-3 rounded-r-lg focus:outline-none text-gray-800"
              />
            </div>
            {errors.code && (
              <p className="text-red-600 text-sm mt-1">
                {t("quizPage.modal.codeRequired")}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
