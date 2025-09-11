import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-500 via-pink-400 to-orange-300 p-6">
            <div className="w-full max-w-md shadow-2xl rounded-2xl backdrop-blur-md bg-white/70 p-8 flex flex-col items-center gap-6">
                <h1 className="text-3xl font-bold text-gray-800">🌟 Demo</h1>
                <p className="text-center text-gray-600">
                    Chào mừng bạn đến với form đăng nhập bằng formik + yub.
                </p>

                <div className="flex items-center justify-center gap-4 w-full text-xs">
                    <Link
                        to="/signin"
                        className="w-full p-4 rounded-2xl border border-amber-50 bg-blue-500 text-white text-center shadow"
                    >
                        Đăng nhập
                    </Link>
                    <Link
                        to="/signup"
                        className="w-full p-4 rounded-2xl border border-amber-50 bg-green-500 text-white text-center shadow"
                    >
                        Đăng ký
                    </Link>
                </div>
            </div>
        </div>
    );
}
