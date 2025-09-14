import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

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
    onSubmit: async (values) => {
      setError("");
      const result = await login(values.email, values.password);
      
      if (result.success) {
        navigate("/");
      } else {
        setError(result.error);
      }
    }
  })
  
  return (
    <div className="w-full max-w-md p-8 rounded-2xl shadow-xl border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
      {/* Back to Home */}
      <div className="mb-4">
        <Link
          to="/"
          className="text-sm flex items-center gap-1 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          ← Back to Home
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-center mb-6" style={{ color: 'var(--text-primary)' }}>
        Đăng nhập
      </h1>
      <p className="text-center mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Điền thông tin bên dưới để đăng nhập
      </p>
      
      {error && (
        <div className="mb-4 p-3 border rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <p className="text-red-600 text-sm text-center">
            {error}
          </p>
        </div>
      )}
      
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Email
          </label>
          <input type="email"
            name="email"
            className="w-full px-3 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            style={{ 
              backgroundColor: 'var(--bg-primary)', 
              borderColor: 'var(--border-color)', 
              color: 'var(--text-primary)' 
            }}
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
          <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Mật khẩu
          </label>
          <div className=" relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="w-full px-3 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              style={{ 
                backgroundColor: 'var(--bg-primary)', 
                borderColor: 'var(--border-color)', 
                color: 'var(--text-primary)' 
              }}
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
              type="button"
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
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
        Nếu bạn chưa có tài khoản?{" "}
        <Link to="/signup" className="text-blue-500 hover:underline">
          Đăng ký
        </Link>
      </p>
    </div>
  );
}
