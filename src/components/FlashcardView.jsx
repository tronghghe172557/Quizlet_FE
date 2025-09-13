export default function FlashcardView({ questions, current, setCurrent, showAnswer, setShowAnswer }) {
  if (questions.length === 0) return <div className="text-gray-500">Không có câu hỏi.</div>;
  const q = questions[current];
  return (
    <div className="">
      <div className="bg-white border shadow-sm rounded-xl p-8 min-h-[220px] flex flex-col items-center justify-center text-center">
        <div className="text-sm uppercase tracking-wide text-gray-500 mb-2">Thuật ngữ</div>
        <div className="text-xl font-medium text-gray-900 whitespace-pre-line">{q.prompt}</div>
        {showAnswer && (
          <div className="mt-4 text-green-700 bg-green-50 px-3 py-2 rounded-md">
            Đáp án đúng: {q.choices?.find((c) => c.isCorrect)?.text || "(chưa có)"}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          className="px-4 py-2 rounded-md border bg-white hover:bg-gray-50"
          onClick={() => setCurrent((c) => (c - 1 + questions.length) % questions.length)}
        >Trước</button>
        <button
          className="px-4 py-2 rounded-md border bg-white hover:bg-gray-50"
          onClick={() => setShowAnswer((v) => !v)}
        >{showAnswer ? "Ẩn đáp án" : "Hiện đáp án"}</button>
        <button
          className="px-4 py-2 rounded-md border bg-white hover:bg-gray-50"
          onClick={() => setCurrent((c) => (c + 1) % questions.length)}
        >Tiếp</button>
      </div>
    </div>
  );
}
