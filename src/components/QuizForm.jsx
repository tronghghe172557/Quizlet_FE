import { useState } from "react";
import { utils } from "../utils/api";

// Template prompts
const PROMPT_TEMPLATES = {
  default: `Bạn là "Cô Trang", một giáo viên tiếng Anh với hơn 10 năm kinh nghiệm. Hãy tạo quiz theo đúng config sau:

\${JSON.stringify(quizConfig, null, 2)}

⚠️ QUY TẮC QUAN TRỌNG:
- Always output in STRICT JSON format (no extra text).
- Include ALL metadata fields exactly as provided.
- "questions" must be an array of quiz items.
- Each question must have exactly \${quizConfig["số lựa chọn trong 1 câu"]} choices, and only one is correct.

📌 OUTPUT FORMAT:
{
  "số câu": \${quizConfig["số câu"]},
  "dạng tạo câu hỏi": "\${quizConfig["dạng tạo câu hỏi"]}",
  "số lựa chọn trong 1 câu": \${quizConfig["số lựa chọn trong 1 câu"]},
  "note": "\${quizConfig.note}",
  "từ mới": \${JSON.stringify(quizConfig["từ mới"])},
  "cấp độ tiếng Anh": "\${quizConfig["cấp độ tiếng Anh"]}",
  "ngôn ngữ hiển thị câu hỏi": "\${quizConfig["ngôn ngữ hiển thị câu hỏi"]}",
  "questions": [
    {
      "prompt": "string - Nội dung câu hỏi theo cấp độ \${quizConfig["cấp độ tiếng Anh"]}",
      "choices": [
        {"text": "string", "isCorrect": boolean},
        {"text": "string", "isCorrect": boolean},
        {"text": "string", "isCorrect": boolean},
        {"text": "string", "isCorrect": boolean}
      ],
      "explanation": "string - Giải thích bằng \${quizConfig["ngôn ngữ hiển thị câu hỏi"]}"
    }
  ]
}

📝 LOẠI CÂU HỎI THEO "\${quizConfig["dạng tạo câu hỏi"]}":
\${getQuestionTypeInstructions(quizConfig["dạng tạo câu hỏi"], quizConfig["cấp độ tiếng Anh"])}

Từ vựng để tạo quiz: \${sourceText}`,

  advanced: `Bạn là "Cô Trang", một giáo viên tiếng Anh với hơn 10 năm kinh nghiệm, chuyên dạy cho người mất gốc. Phong cách của bạn rất gần gũi, thực tế, và thường dùng các mẹo hài hước để giúp học viên nhớ bài. Nhiệm vụ của bạn là tạo ra một bài kiểm tra trắc nghiệm dạng JSON từ một đoạn văn bản cho trước.

Quy tắc:
- Nguồn Dữ liệu: Toàn bộ thông tin về từ (định nghĩa, phát âm, từ loại) PHẢI được tra cứu và xác minh từ các nguồn từ điển uy tín, ưu tiên Oxford Learner's Dictionaries.
- Xác định từ vựng: List từ \${questions} ( mỗi dòng là 1 câu hỏi mới ) được cung cấp, hãy xác định tất cả các từ vựng mới hoặc quan trọng phù hợp với trình độ B1.
- tổng là \${questions.length} câu hỏi.
- Một từ - một câu hỏi: Với MỖI TỪ vựng tìm được, hãy tạo ra một câu hỏi trắc nghiệm tương ứng.
- Định dạng đầu ra: Kết quả phải là một file JSON TUYỆT ĐỐI CHÍNH XÁC theo cấu trúc đã cho. Không thêm bất kỳ văn bản nào khác ngoài JSON.

{
  "questions": [
    {
      "prompt": "Từ mới: [The English Word]\\nĐịnh nghĩa (EN): [English definition from a reliable dictionary]\\nTừ loại: [Part of speech, e.g., noun, verb, adj]\\nNghĩa tiếng Việt: [Accurate Vietnamese meaning]\\nMẹo ghi nhớ: [A fun, practical, or funny tip in 'Cô Trang' style]\\nPhát âm (IPA): /[pronunciation]/\\nTừ đồng nghĩa:[Synonyms if available]\\nTừ trái nghĩa: [Antonyms if available]",
      "question": "[The English Word] trong tiếng Việt có nghĩa là gì?",
      "choices": [
        {"text": "Nghĩa tiếng Việt sai 1", "isCorrect": false},
        {"text": "Nghĩa tiếng Việt sai 2", "isCorrect": false},
        {"text": "Nghĩa tiếng Việt đúng", "isCorrect": true},
        {"text": "Nghĩa tiếng Việt sai 3", "isCorrect": false}
      ],
      "explanation": "Hội thoại/Ví dụ thực tế: [A short, natural dialogue or a practical example sentence showing how the word is used in daily life. Make it fun and relatable.]"
    }
  ]
}

Yêu cầu chi tiết cho từng trường:

prompt: Đây là phần "thẻ học từ vựng" (flashcard).
- Mỗi thông tin phải nằm trên một dòng riêng biệt (sử dụng \\n).
- Mẹo ghi nhớ: Phải thật sáng tạo, dễ liên tưởng. Ví dụ: "Từ 'diligent' (siêng năng) nghe hơi giống 'đi đi dần'. Muốn thành công thì cứ 'đi đi dần' là tới, phải siêng năng lên!"

question: Câu hỏi phải ngắn gọn, hỏi trực tiếp nghĩa tiếng Việt của từ.

choices:
- Luôn có 4 lựa chọn.
- Chỉ có 1 đáp án đúng ("isCorrect": true).
- Các đáp án sai phải hợp lý, có thể là những từ gần nghĩa hoặc cùng chủ đề để tăng tính thử thách, tránh đưa ra những đáp án sai hoàn toàn vô lý.

explanation:
- Đây là phần quan trọng nhất để học theo ngữ cảnh.
- Hãy tạo một đoạn hội thoại ngắn hoặc câu ví dụ thực tế, hài hước mà người Việt Nam dễ dàng liên tưởng.
- Ví dụ cho từ "versatile" (đa năng):
  A: "Wow, cái nồi chiên không dầu này 'versatile' thật sự! Nướng bánh, hấp rau, quay gà, làm được hết!"
  B: "Đúng là 'đỉnh của chóp' luôn, xứng đáng đồng tiền bát gạo."

Văn bản nguồn (Source Text): \${sourceText}`
};

export default function QuizForm({ 
  title, setTitle, 
  text, setText, 
  model, setModel,
  questionCount, setQuestionCount,
  questionType, setQuestionType,
  choicesPerQuestion, setChoicesPerQuestion,
  englishLevel, setEnglishLevel,
  displayLanguage, setDisplayLanguage,
  promptExtension, setPromptExtension,
  loading, error, 
  onSubmit 
}) {
  const [selectedTemplate, setSelectedTemplate] = useState("");
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
          rows={12}
          className="w-full rounded-lg border px-4 py-3 font-mono text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ 
            backgroundColor: 'var(--bg-primary)', 
            borderColor: 'var(--border-color)', 
            color: 'var(--text-primary)' 
          }}
          placeholder={"Nhập block text theo mẫu..."}
        />
        <p className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
          Nội dung để tạo câu hỏi quiz.
        </p>
      </div>

      {/* Quiz Configuration Section */}
      <div className="border-t pt-6" style={{ borderColor: 'var(--border-color)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Cấu hình Quiz
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Model */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Model AI
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ 
                backgroundColor: 'var(--bg-primary)', 
                borderColor: 'var(--border-color)', 
                color: 'var(--text-primary)' 
              }}
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
            </select>
          </div>

          {/* Question Count */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Số câu hỏi (1-25)
            </label>
            <input
              type="number"
              min="1"
              max="25"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value) || 5)}
              className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ 
                backgroundColor: 'var(--bg-primary)', 
                borderColor: 'var(--border-color)', 
                color: 'var(--text-primary)' 
              }}
            />
            <p className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              Số câu hỏi sẽ được tự động tính dựa trên số dòng trong Text. Bạn có thể chỉnh sửa nếu cần.
            </p>
          </div>

          {/* Question Type */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Loại câu hỏi
            </label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ 
                backgroundColor: 'var(--bg-primary)', 
                borderColor: 'var(--border-color)', 
                color: 'var(--text-primary)' 
              }}
            >
              <option value="mixed">Hỗn hợp</option>
              <option value="vocabulary">Từ vựng</option>
              <option value="grammar">Ngữ pháp</option>
              <option value="reading">Đọc hiểu</option>
              <option value="conversation">Hội thoại</option>
            </select>
          </div>

          {/* Choices Per Question */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Số lựa chọn/câu
            </label>
            <input
              type="number"
              min="2"
              max="6"
              value={choicesPerQuestion}
              onChange={(e) => setChoicesPerQuestion(parseInt(e.target.value) || 4)}
              className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ 
                backgroundColor: 'var(--bg-primary)', 
                borderColor: 'var(--border-color)', 
                color: 'var(--text-primary)' 
              }}
            />
          </div>

          {/* English Level */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Trình độ tiếng Anh
            </label>
            <select
              value={englishLevel}
              onChange={(e) => setEnglishLevel(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ 
                backgroundColor: 'var(--bg-primary)', 
                borderColor: 'var(--border-color)', 
                color: 'var(--text-primary)' 
              }}
            >
              <option value="A1">A1 - Beginner</option>
              <option value="A2">A2 - Elementary</option>
              <option value="B1">B1 - Intermediate</option>
              <option value="B2">B2 - Upper Intermediate</option>
              <option value="C1">C1 - Advanced</option>
              <option value="C2">C2 - Proficient</option>
            </select>
          </div>

          {/* Display Language */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Ngôn ngữ hiển thị
            </label>
            <select
              value={displayLanguage}
              onChange={(e) => setDisplayLanguage(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ 
                backgroundColor: 'var(--bg-primary)', 
                borderColor: 'var(--border-color)', 
                color: 'var(--text-primary)' 
              }}
            >
              <option value="vietnamese">Tiếng Việt</option>
              <option value="english">English</option>
              <option value="mixed">Hỗn hợp</option>
            </select>
          </div>
        </div>

        {/* Prompt Extension */}
        <div className="mt-6">
          <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Prompt Template (Tùy chọn)
          </label>
          
          {/* Template Selector */}
          <div className="mb-3">
            <select
              value={selectedTemplate}
              onChange={(e) => {
                const templateKey = e.target.value;
                setSelectedTemplate(templateKey);
                
                if (templateKey === '') {
                  setPromptExtension('');
                } else if (templateKey === 'custom') {
                  // Giữ nguyên giá trị hiện tại
                  return;
                } else {
                  // Load template
                  const template = PROMPT_TEMPLATES[templateKey];
                  if (template) {
                    setPromptExtension(template);
                  }
                }
              }}
              className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ 
                backgroundColor: 'var(--bg-primary)', 
                borderColor: 'var(--border-color)', 
                color: 'var(--text-primary)' 
              }}
            >
              <option value="">Chọn template prompt...</option>
              <option value="default">Template mặc định (Cô Trang cơ bản)</option>
              <option value="advanced">Template nâng cao (Cô Trang cho người mất gốc)</option>
              <option value="custom">Tùy chỉnh riêng</option>
            </select>
          </div>

          {/* Template Content */}
          <textarea
            value={promptExtension}
            onChange={(e) => {
              setPromptExtension(e.target.value);
              // Nếu user chỉnh sửa thủ công, chuyển về custom mode
              if (selectedTemplate !== 'custom') {
                setSelectedTemplate('custom');
              }
            }}
            rows={8}
            maxLength={4000}
            className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ 
              backgroundColor: 'var(--bg-primary)', 
              borderColor: 'var(--border-color)', 
              color: 'var(--text-primary)' 
            }}
            placeholder="Chọn template ở trên hoặc nhập prompt tùy chỉnh..."
          />
          
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Chọn template có sẵn hoặc tùy chỉnh prompt riêng
            </p>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {promptExtension?.length || 0}/4000
            </span>
          </div>
        </div>
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
            setModel("gemini-2.0-flash");
            setQuestionCount(5);
            setQuestionType("mixed");
            setChoicesPerQuestion(4);
            setEnglishLevel("B1");
            setDisplayLanguage("english");
            setPromptExtension("");
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
