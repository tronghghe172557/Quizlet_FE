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
      className="border rounded-2xl shadow-xl p-8 space-y-6"
      style={{ 
        backgroundColor: 'var(--card-bg)', 
        borderColor: 'var(--border-color)' 
      }}
    >
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Tiêu đề (Title)
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-[#0A092D] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ví dụ: Từ vựng Unit 1"
        />
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Nếu để trống, hệ thống sẽ lấy dòng đầu của Text làm title.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Email người tạo
        </label>
        <input
          type="email"
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-[#0A092D] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-[#0A092D] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-mono text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={"Nhập block text theo mẫu..."}
        />
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Body POST sẽ là &#123; title, text, createdBy &#125;.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium transition-colors"
        >
          {loading ? "Đang tạo..." : "Tạo quiz"}
        </button>
        <button
          type="button"
          onClick={() => {
            setTitle("");
            setText("");
          }}
          className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0A092D] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2E3856] transition-colors"
        >
          Xóa
        </button>
      </div>
    </form>
  );
}
