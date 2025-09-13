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
          className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ 
            backgroundColor: 'var(--bg-primary)', 
            borderColor: 'var(--border-color)', 
            color: 'var(--text-primary)' 
          }}
          placeholder="Ví dụ: Từ vựng Unit 1"
        />
        <p className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
          Nếu để trống, hệ thống sẽ lấy dòng đầu của Text làm title.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Email người tạo
        </label>
        <input
          type="email"
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
          className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ 
            backgroundColor: 'var(--bg-primary)', 
            borderColor: 'var(--border-color)', 
            color: 'var(--text-primary)' 
          }}
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
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
          className="w-full rounded-lg border px-4 py-3 font-mono text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ 
            backgroundColor: 'var(--bg-primary)', 
            borderColor: 'var(--border-color)', 
            color: 'var(--text-primary)' 
          }}
          placeholder={"Nhập block text theo mẫu..."}
        />
        <p className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
          Body POST sẽ là &#123; title, text, createdBy &#125;.
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
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
          className="px-6 py-3 rounded-lg border transition-colors"
          style={{ 
            borderColor: 'var(--border-color)', 
            backgroundColor: 'var(--card-bg)', 
            color: 'var(--text-secondary)' 
          }}
        >
          Xóa
        </button>
      </div>
    </form>
  );
}
