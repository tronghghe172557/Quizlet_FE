import { utils } from "../utils/api";

export default function QuizForm({ 
  title, setTitle, 
  text, setText, 
  createdBy, setCreatedBy, 
  loading, error, 
  onSubmit 
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border rounded-xl shadow-sm p-6 space-y-5"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tiêu đề (Title)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ví dụ: Từ vựng Unit 1"
        />
        <p className="mt-1 text-xs text-gray-500">
          Nếu để trống, hệ thống sẽ lấy dòng đầu của Text làm title.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email người tạo
        </label>
        <input
          type="email"
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Text
        </label>
        <textarea
          value={text}
          onChange={(e) => {
            const val = e.target.value;
            setText(val);
            // Gợi ý title theo text nếu title đang rỗng
            if (!title.trim()) {
              const suggestion = utils.deriveTitleFromText(val);
              if (suggestion) setTitle(suggestion);
            }
          }}
          rows={16}
          className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={"Nhập block text theo mẫu..."}
        />
        <p className="mt-2 text-xs text-gray-500">
          Body POST sẽ là &#123; title, text, createdBy &#125;.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-2 rounded-md">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60"
        >
          {loading ? "Đang tạo..." : "Tạo quiz"}
        </button>
        <button
          type="button"
          onClick={() => {
            setTitle("");
            setText("");
          }}
          className="px-4 py-2 rounded-md border"
        >
          Xóa
        </button>
      </div>
    </form>
  );
}
