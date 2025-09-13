import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

export default function LoginForm() {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),
      password: Yup.string()
        .min(6, "Mật khẩu ít nhất 6 ký tự")
        .required("Vui lòng nhập mật khẩu"),
    }),
    validateOnChange: false,   // không validate khi gõ
    validateOnBlur: true,      // chỉ validate khi blur
    onSubmit: (values) => {
      alert("Đăng nhập thành công !!! Data của bạn là: " + JSON.stringify(values, null, 2));
    }
  })
  
  const [showPassword, setShowPassword] = useState(false)
  
  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-[#2E3856] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
      {/* Back to Home */}
      <div className="mb-4">
        <Link
          to="/"
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm flex items-center gap-1 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
        Đăng nhập
      </h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">
        Điền thông tin bên dưới để đăng nhập
      </p>
      
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium">
            Email
          </label>
          <input type="email"
            name="email"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 bg-white dark:bg-[#0A092D] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={(e) => {
              formik.handleBlur(e); // báo cho Formik là field này đã "touched"
            }}
            onFocus={() => {
              // Khi focus lại thì xóa lỗi đi (tùy nhu cầu)
              formik.setFieldError("email", "");
            }}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
              {formik.errors.email}
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium">
            Mật khẩu
          </label>
          <div className=" relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 bg-white dark:bg-[#0A092D] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={(e) => {
                formik.handleBlur(e); // báo cho Formik là field này đã "touched"
              }}
              onFocus={() => {
                // Khi focus lại thì xóa lỗi đi (tùy nhu cầu)
                formik.setFieldError("password", "");
              }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              {showPassword ? (<EyeSlash size={20} />) : (<Eye size={20} />)}
            </button>
          </div>

          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
              {formik.errors.password}
            </p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          Đăng nhập
        </button>
      </form>

      <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-6">
        Nếu bạn chưa có tài khoản?{" "}
        <Link to="/signup" className="text-blue-500 dark:text-blue-400 hover:underline">
          Đăng ký
        </Link>
      </p>
    </div>
  );
}
