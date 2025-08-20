import { useForm } from "react-hook-form"
import { MdEmail, MdCheckCircle } from "react-icons/md";
import FB from "../../../assets/FP-BG.png"
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/Logo-white.png';
import type { ForgotPasswordForm } from "../../../Interfaces/Auth/interfaces";
import { useState } from "react";
import { axiosInstance, USERS_URLS } from "../../../Server/baseUrl";
import { toast } from "react-toastify";

import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { validation } from "../../../Server/Validation";


export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>()

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(USERS_URLS.forgetPassword, data);
      toast.success(res.data.message);
      navigate('/reset-password');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex font-nunito">
      <div className="flex-1  flex flex-col justify-center px-8 lg:px-8">
        <div className="mb-16">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <img src={logo} alt="logo" />
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-full">
          <h1 className="text-[#C5D86D] text-3xl font-bold mb-12">Forgot password</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <label htmlFor="email" className="block text-white ml-2 text-sm font-medium mb-4">
                Email address
              </label>
              <div className="relative ">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MdEmail className="h-8 w-8 text-white" />
                </div>
                <input
                  {...register('email', validation.login.email)}
                  type="email"
                  id="email"
                  placeholder="Type your email"
                  className="w-full pl-14 pr-4  py-4 bg-transparent  border-[3px] rounded-lg text-white placeholder-gray-400  focus:outline-none transition-colors"
                />
              </div>
              {errors.email && <p className="mt-2 text-red-400 text-sm">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex cursor-pointer items-center justify-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send email"}
              {loading ? (
                <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin" />
              ) : (
                <MdCheckCircle className="w-6 h-6" />
              )}
            </button>
          </form>

          <div className="mt-12 w-full text-right">
            <p className="text-gray-400">
              Login?{" "}
              <Link to="/login" className="text-lime-400 underline hover:text-lime-300 transition-colors">
                click here
              </Link>
            </p>
          </div>
        </div>
      </div>


      <div className="hidden lg:flex flex-1  items-center justify-center p-8">
        <div className="max-w-lg">

          <img
            src={FB}
            alt="Student with educational elements illustration"
            width={500}
            height={400}
            className="w-full h-auto"
          />

        </div>
      </div>
    </div>
  )
}
