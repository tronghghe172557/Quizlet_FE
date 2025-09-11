import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

const SignUp = () => {
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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
                    Tạo tài khoản
                </h1>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
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
                            onBlur={formik.handleBlur}
                            onFocus={() => formik.setFieldError("email", "")}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                        )}
                    </div>

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
                            onBlur={formik.handleBlur}
                            onFocus={() => formik.setFieldError("password", "")}
                        />
                        {formik.touched.password && formik.errors.password && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
                        )}
                    </div>

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
                            onBlur={formik.handleBlur}
                            onFocus={() => formik.setFieldError("confirmpassword", "")}
                        />
                        {formik.touched.confirmpassword &&
                            formik.errors.confirmpassword && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formik.errors.confirmpassword}
                                </p>
                            )}
                    </div>

                    {/* Terms with modal */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="terms"
                            className="mr-2"
                            checked={formik.values.terms}
                            onChange={formik.handleChange}
                        />
                        <label className="text-sm text-gray-700">
                            Tôi đồng ý với{" "}
                            <button
                                type="button"
                                onClick={() => setIsTermsOpen(true)}
                                className="text-blue-500 hover:underline"
                            >
                                điều khoản
                            </button>
                        </label>
                    </div>
                    {formik.touched.terms && formik.errors.terms && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.terms}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Đăng ký
                    </button>
                </form>

                <p className="text-center text-gray-600 text-sm mt-6">
                    Đã có tài khoản?{" "}
                    <Link to="/signin" className="text-blue-500 hover:underline">
                        Đăng nhập
                    </Link>
                </p>
            </div>

            {/* Modal điều khoản */}
            {isTermsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6 relative">
                        <h2 className="text-xl font-bold mb-4">Điều khoản sử dụng</h2>
                        <p className="text-gray-700 mb-4">
                            Đây là nội dung điều khoản.......................................
                        </p>
                        <button
                            onClick={() => setIsTermsOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
                        >
                            ✕
                        </button>
                        <button
                            onClick={() => setIsTermsOpen(false)}
                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignUp;
