import logo from '../../../assets/Logo-white.png';
import imgAuth from '../../../assets/FP-BG.png';
import img1 from '../../../assets/login.svg';
import img2 from '../../../assets/regist.svg';
import img3 from '../../../assets/input icon.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { axiosInstance, USERS_URLS } from '../../../Server/baseUrl';
import { useState } from 'react';
import { validation } from '../../../Server/Validation';
import { toast } from 'react-toastify';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { MdCheckCircle, MdRemoveRedEye } from 'react-icons/md';
import { IoEyeOffSharp } from 'react-icons/io5';
import type { Logged_in_Users } from "../../../Interfaces/Auth/interfaces";
import { setToken } from '../../../Redux/authSlice';
import { useDispatch } from 'react-redux';



export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Logged_in_Users>();

const dispatch = useDispatch();

const onSubmit = async (data: Logged_in_Users): Promise<void> => {
  setLoading(true);
  try {
    const res = await axiosInstance.post(USERS_URLS.login, data);    
    toast.success(res.data.message);

    const token = res.data.data.accessToken;
    const user = res.data.data.profile;

    dispatch(setToken({ token, user }));

    navigate('/dashboard');
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Invalid email or password");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="login min-h-screen overflow-hidden bg-[#0f172a]">
      <div className="flex flex-wrap">
        <div className="md:w-6/12 p-10 w-full">
          <div className="loginContant">
            <img src={logo} alt="logo" />
            <h3
              style={{ color: '#C5D86D' }}
              className="font-bold text-1xl mt-10"
            >
              Continue your learning journey with QuizWiz!
            </h3>

            <div className="flex flex-nowrap gap-6 pt-10 overflow-x-auto">
              <button className="cursor-pointer flex flex-col items-center bg-[#2d2d2d] text-white min-w-[140px] px-6 py-4 rounded-lg border-2 border-lime-300 hover:bg-[#3a3a3a] transition">
                <img alt='login' src={img2} className="text-lime-300 text-5xl mb-2" />
                <span className="text-sm">Sign in</span>
              </button>
              <Link to="/register">
                <button className="flex flex-col items-center bg-[#2d2d2d] text-white min-w-[140px] px-6 py-4 rounded-lg hover:bg-[#3a3a3a] transition cursor-pointer">
                  <img alt='register' src={img1} className="text-white text-5xl mb-2" />
                  <span className="text-sm">Sign Up</span>
                </button>
              </Link>

            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="pt-10" action="">
            <label htmlFor="email" className="text-white block mb-2">
              Email
            </label>
            <div className="relative ">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <svg
                  className="w-5 h-5 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 16"
                >
                  <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                  <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                </svg>
              </div>
              <input
                type="text"
                id="email"
                aria-label="Email Address"
                className="bg-[#0f172a] border py-4 border-white text-white text-sm rounded-md focus:ring-lime-400 focus:border-lime-400 block w-full ps-10 p-2.5 placeholder-white"
                placeholder="Type your email"
                {...register('email', validation.login.email)}
              />
            </div>
            <div className="min-h-[20px]">
              {errors.email?.message && (
                <p className="text-red-500 text-xs">
                  {String(errors.email.message)}
                </p>
              )}
            </div>

            <label htmlFor="password" className="text-white block mb-2 ">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                <img alt='eye' src={img3} className="text-white w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                aria-label="Password"
                className="bg-[#0f172a] border py-4 border-white text-white text-sm rounded-md focus:ring-lime-400 focus:border-lime-400 block w-full ps-10 p-2.5 placeholder-white"
                placeholder="Type your password"
                {...register('password', validation.login.password)}
              />
              <div
                className="absolute inset-y-0 end-0 flex items-center pe-3 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <MdRemoveRedEye className='text-white font-bold text-2xl' />
                ) : (
                  <IoEyeOffSharp className='text-white font-bold text-2xl' />

                )}
              </div>
            </div>

            <div className="min-h-[20px]">
              {errors.password?.message && (
                <p className="text-red-500 text-xs mt-1">
                  {String(errors.password.message)}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-5">
              <div className="text-sm">
                <button
                             type="submit"
                            
                             className="flex cursor-pointer items-center justify-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                             {loading ? "Sending..." : "Sign In"}
                             {loading ? (
                               <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin" />
                             ) : (
                               <MdCheckCircle className="w-6 h-6" />
                             )}
                           </button>
              </div>
              <div className="text-sm">
                <p className="font-medium text-white">
                  Forgot your password?
                  <Link
                    className="text-lime-400 hover:text-lime-500"
                    to="/forget-password"
                  >
                    {' '}click here
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>

        <div className="hidden md:flex md:w-6/12 w-full justify-center ">
          <div
            style={{ height: '85%' }}
            className="imgAute   w-9/12 flex justify-center rounded-lg mt-12"
          >
            <img
              src={imgAuth}
              alt="imgAuth"
              className="object-contain max-h-full"
              width={500}
              height={400}
            />
          </div>
        </div>
      </div>
    </div>

  );
}
