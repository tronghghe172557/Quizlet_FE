export default function TestView({ questions, shuffledChoicesByQ, selected, onSelect, score, total }) {
  return (
    <div className="bg-white border rounded-xl shadow-sm">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <div className="text-sm text-gray-600">Điểm: <span className="font-semibold text-gray-900">{score}/{total}</span></div>
      </div>
      <div className="divide-y">
        {questions.map((q, idx) => (
          <div key={idx} className="p-6">
            <div className="mb-3 text-gray-900 font-medium">{idx + 1}. {q.prompt}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {shuffledChoicesByQ[idx]?.map((c, cIdx) => {
                const isSelected = selected[idx] === cIdx;
                const isCorrect = c.isCorrect === true;
                const base = "px-4 py-3 rounded-lg border transition";
                const state = isSelected
                  ? (isCorrect ? "border-green-600 bg-green-50" : "border-red-600 bg-red-50")
                  : "border-gray-200 bg-white hover:bg-gray-50";
                return (
                  <button
                    key={cIdx}
                    className={`${base} ${state} text-left`}
                    onClick={() => onSelect(idx, cIdx)}
                  >{c.text}</button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
