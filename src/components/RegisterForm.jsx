import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RegisterForm() {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [error, setError] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmpassword: "",
      terms: false,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string()
        .min(2, "Tên ít nhất 2 ký tự")
        .required("Vui lòng nhập tên"),
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),
      password: Yup.string()
        .min(6, "Mật khẩu ít nhất 6 ký tự")
        .required("Vui lòng nhập mật khẩu"),
      confirmpassword: Yup.string()
        .min(6, "Mật khẩu xác nhận ít nhất 6 ký tự")
        .required("Vui lòng xác nhận mật khẩu")
        .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp"),
      terms: Yup.boolean().oneOf([true], "Bạn phải đồng ý với các điều khoản"),
    }),
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setError("");
      const result = await register(values.name, values.email, values.password);
      
      if (result.success) {
        navigate("/");
      } else {
        setError(result.error);
      }
    },
  });

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

      {/* Title */}
      <h1 className="text-2xl font-bold text-center mb-6" style={{ color: 'var(--text-primary)' }}>
        Đăng ký
      </h1>
      <p className="text-center mb-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Điền thông tin bên dưới để tạo tài khoản
      </p>

      {error && (
        <div className="mb-4 p-3 border rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <p className="text-red-600 text-sm text-center">
            {error}
          </p>
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Tên
          </label>
          <input
            type="text"
            name="name"
            className="w-full px-3 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            style={{ 
              backgroundColor: 'var(--bg-primary)', 
              borderColor: 'var(--border-color)', 
              color: 'var(--text-primary)' 
            }}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={(e) => {
              formik.handleBlur(e);
            }}
            onFocus={() => {
              formik.setFieldError("name", "");
            }}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Email
          </label>
          <input
            type="email"
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
              formik.handleBlur(e);
            }}
            onFocus={() => {
              formik.setFieldError("email", "");
            }}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Mật khẩu
          </label>
          <input
            type="password"
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
              formik.handleBlur(e);
            }}
            onFocus={() => {
              formik.setFieldError("password", "");
            }}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            name="confirmpassword"
            className="w-full px-3 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            style={{ 
              backgroundColor: 'var(--bg-primary)', 
              borderColor: 'var(--border-color)', 
              color: 'var(--text-primary)' 
            }}
            value={formik.values.confirmpassword}
            onChange={formik.handleChange}
            onBlur={(e) => {
              formik.handleBlur(e);
            }}
            onFocus={() => {
              formik.setFieldError("confirmpassword", "");
            }}
          />
          {formik.touched.confirmpassword && formik.errors.confirmpassword && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.confirmpassword}
            </p>
          )}
        </div>

        {/* Terms */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="terms"
              className="mr-2"
              checked={formik.values.terms}
              onChange={formik.handleChange}
            />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Tôi đồng ý với{" "}
              <button
                type="button"
                onClick={() => setIsTermsOpen(!isTermsOpen)}
                className="text-blue-500 hover:underline"
              >
                điều khoản sử dụng
              </button>
            </span>
          </label>
          {formik.touched.terms && formik.errors.terms && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.terms}
            </p>
          )}
        </div>

        {/* Terms Modal */}
        {isTermsOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4">Điều khoản sử dụng</h3>
              <div className="text-sm text-gray-600 mb-4">
                <p>1. Bạn đồng ý sử dụng ứng dụng một cách hợp pháp.</p>
                <p>2. Không được chia sẻ thông tin cá nhân của người khác.</p>
                <p>3. Chúng tôi có quyền cập nhật điều khoản này.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsTermsOpen(false)}
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition"
        >
          {isLoading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>

      {/* Login Link */}
      <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
        Đã có tài khoản?{" "}
        <Link to="/signin" className="text-blue-500 hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
