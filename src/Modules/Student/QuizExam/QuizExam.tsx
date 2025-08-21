import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance, Students_Quizes } from "../../../Server/baseUrl";
import { toast } from "react-toastify";
import type { Question } from "../../../Interfaces/Questions/Interfaces";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizExam() {
  const location = useLocation();
  const navigate = useNavigate();

  const quizId = location.state;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [quizTitle, setQuizTitle] = useState<string>("");

  useEffect(() => {
    if (!quizId) {
      toast.error("Quiz ID is missing.");
      return;
    }

    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          Students_Quizes.Quizs_Without_Answers(quizId)
        );
        const data = response.data?.data;

        if (!Array.isArray(data?.questions)) {
          toast.error("Questions not found.");
          return;
        }

        setQuestions(data.questions);
        setTimeLeft(data.duration * 60);
        setQuizTitle(data.title);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Error fetching questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) {
      if (timeLeft === 0) handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelectAnswer = (questionId: string, answerKey: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerKey,
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const answers = questions.map((q) => ({
      question: q._id,
      answer: selectedAnswers[q._id] || null,
    }));

    try {
      setIsSubmitting(true);
      await axiosInstance.post(Students_Quizes.SubmitQuiz(quizId), { answers });
      toast.success("Answers sent successfully");
      navigate("/quiz-result");
    } catch (error: any) {
      toast.error("Failed to send answers.");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="p-4 mx-auto quiz-exam">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          📝 Quiz{quizTitle ? `: ${quizTitle}` : ""}
        </h1>
        <div className="text-red-600 font-semibold text-lg">
          ⏱ {timeLeft !== null ? formatTime(timeLeft) : "00:00"}
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <AnimatePresence>
          {questions.map((q, index) => (
            <motion.div
              key={q._id}
              className="mb-6 p-4 border rounded-lg shadow quesition-container bg-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <h2 className="text-md font-semibold mb-3">
                {index + 1}. {q.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(q.options)
                  .filter(([key]) => ["A", "B", "C", "D"].includes(key))
                  .map(([key, value]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSelectAnswer(q._id, key)}
                      className={`w-full cursor-pointer text-left border px-4 py-2 rounded-md transition ${
                        selectedAnswers[q._id] === key
                          ? "bg-green-100 border-green-400 text-green-800"
                          : " border-gray-300"
                      }`}
                    >
                      <span className="font-bold mr-2">{key}.</span> {value}
                    </button>
                  ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      <div className="text-center mt-6">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-2 cursor-pointer rounded-lg transition ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {isSubmitting ? "Sending..." : "Sending answers"}
        </button>
      </div>
    </div>
  );
}
