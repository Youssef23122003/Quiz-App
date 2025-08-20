import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./Component/shared/AuthLayout";
import Login from "./Modules/Authentication/Login/Login";
import Register from "./Modules/Authentication/Register/Register";
import ChangePassword from "./Modules/Authentication/ChangePassword/ChangePassword";
import ForgetPassword from "./Modules/Authentication/ForgetPassword/ForgetPassword";
import NotFound from "./Component/shared/NotFound";
import Dashboard from "./Component/Dashboard/Dashboard";
import MasterLayout from "./Component/shared/MasterLayout";
import { ToastContainer } from "react-toastify";
import ResetPassword from "./Modules/Authentication/ResetPassword/ResetPassword";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import GroupsList from "./Modules/Instracutor/Groups/GroupsList";
import StudentList from "./Modules/Instracutor/StudentList/StudentList";
import QuizsList from "./Modules/Instracutor/Quizs/QuizsList";
import ProtectedRouting from "./Component/shared/ProtectedRouting";
import Questions from "./Modules/Instracutor/Questions/Questions";
import QuizDetails from "./Modules/Instracutor/Quizs/AllQuizzs/QuizDetails";
import Quizs from "./Modules/Student/Quizs/Quizs";
import QuizExam from "./Modules/Student/QuizExam/QuizExam";
import ResultsPage from "./Modules/Instracutor/Results/Results";
import QuizView from "./Modules/Instracutor/Results/Quiz-Result/QuizView";
import SODResulrs from "./Component/shared/SODResulrs";
import QuizStudentView from "./Modules/Student/Results/Quiz-Result/QuizStudentView";

function App() {
  let routes = createBrowserRouter([
    {
      path: "",
      element: <AuthLayout />,
      children: [
        { index: true, element: <Login /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "change-password", element: <ChangePassword /> },
        { path: "forget-password", element: <ForgetPassword /> },
        { path: "reset-password", element: <ResetPassword /> },
      ],
      errorElement: <NotFound />,
    },
    {
      path: "",
      element: (
        <ProtectedRouting>
          <MasterLayout />
        </ProtectedRouting>
      ),
      children: [
        { index: true, element: <Dashboard /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "students", element: <StudentList /> },
        { path: "groups", element: <GroupsList /> },
        { path: "quizes", element: <QuizsList /> },
        { path: "quiz-exam", element: <QuizExam /> },
        { path: "quizes-std", element: <Quizs /> },
        { path: "quizes/:id", element: <QuizDetails /> },   
        { path: "questions", element: <Questions /> },
        { path: "quiz-result", element: <SODResulrs><ResultsPage /></SODResulrs> },
{ path: "quiz-result-view", element: <QuizView /> },
{ path: "quiz-result-studentview", element: <QuizStudentView /> },
      ],
    },
  ]);

  return (
    <>
      <Provider store={store}>
        <RouterProvider router={routes}></RouterProvider>
        <ToastContainer position="top-right" autoClose={2000} />
      </Provider>
      
    </>
  );
}

export default App;
