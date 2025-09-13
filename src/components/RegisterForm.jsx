import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

export default function RegisterForm() {
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmpassword: "",
      terms: false,
    },
    validationSchema: Yup.object().shape({
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
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
      {/* Back to Home */}
      <div className="mb-4">
        <Link
          to="/"
          className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Đăng ký
      </h1>
      <p className="text-center text-gray-500 mb-6 text-sm">
        Điền thông tin bên dưới để tạo tài khoản
      </p>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-gray-700 text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="w-full px-3 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          <label className="block text-gray-700 text-sm font-medium">
            Mật khẩu
          </label>
          <input
            type="password"
            name="password"
            className="w-full px-3 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          <label className="block text-gray-700 text-sm font-medium">
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            name="confirmpassword"
            className="w-full px-3 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            <span className="text-sm text-gray-600">
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
          className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Đăng ký
        </button>
      </form>

      {/* Login Link */}
      <p className="text-center text-gray-600 text-sm mt-6">
        Đã có tài khoản?{" "}
        <Link to="/signin" className="text-blue-500 hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
