import axios from "axios";
const baseURL = "https://upskilling-egypt.com:3005";
export const ImageURL = "https://upskilling-egypt.com:3005"
export const axiosInstance = axios.create({
    baseURL,
});
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const USERS_URLS = {
    login: `${baseURL}/api/auth/login`,
    register: `${baseURL}/api/auth/register`,
    forgetPassword: `${baseURL}/api/auth/forgot-password`,
    resetPassword: `${baseURL}/api/auth/reset-password`,
    ChangePassword: `${baseURL}/api/auth/change-password`,
}



export const Student_URLS = {
  getStudents: `${baseURL}/api/student`,
}
export const GROUPS_URLS = {
  GET_ALL_GROUPS:`/api/group`,
  ADD_GROUP:`/api/group`,
  GET_GROUP_BY_ID:(id:string)=>`/api/group/${id}`,
  DELETE_GROUP:(id:string)=>`/api/group/${id}`,
  UPDATE_GROUP:(id:string)=>`/api/group/${id}`
}
export const STUDENTS_URLS = {
  GET_ALL_STUDENTS:`/api/student/without-group`,
  GET_STUDENT_BY_ID:(id:string)=>`/api/student/${id}`,
  DELETE_STUDENT:(id:string)=>`/api/student/${id}`,
  DELETE_GROUP_STUDENT:(id:string)=>`/api/student/${id}`,  
}

export const Quizzes_URLS = {
  SetUP_Quizz: `/api/quiz`,
  Get_QuizzID: (id: string) => `/api/quiz/${id}`,
  Update_Quizz: (id: string) => `/api/quiz/${id}`,
  delete_QuizzID: (id: string) => `/api/quiz/${id}`,
  completed_Quizz: `/api/quiz/completed`,
}

export const Questions_URLS = {
  SetUP_Questions:`/api/question`,
  Delete_Question:(id:string)=>`/api/question/${id}`,
  Update_Question:(id:string)=>`/api/question/${id}`
}
export const TOP_STUDENTS = {
  GET_TOP_STUDENTS:`/api/student/top-five`,

}

export const Students_Quizes = {
  First_Five_Incomming_Quizz: `/api/quiz/incomming`,
  Last_Five_Completed_Quizz: `/api/quiz/completed`,
  Join_Quizz: `/api/quiz/join`,
  Quizs_Without_Answers: (id: string) => `/api/quiz/without-answers/${id}`,
  SubmitQuiz:(id: string) =>  `/api/quiz/submit/${id}`,
}

