import React, { useState } from 'react';
import { api } from '../utils/api';

const QuestionEditor = ({ question, questionIndex, quizId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    prompt: question?.prompt || '',
    explanation: question?.explanation || '',
    choices: question?.choices || [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChoiceChange = (index, field, value) => {
    const newChoices = [...formData.choices];
    newChoices[index] = {
      ...newChoices[index],
      [field]: field === 'isCorrect' ? value : value
    };
    setFormData({ ...formData, choices: newChoices });
  };

  const handleCorrectAnswerChange = (index) => {
    const newChoices = formData.choices.map((choice, i) => ({
      ...choice,
      isCorrect: i === index
    }));
    setFormData({ ...formData, choices: newChoices });
  };

  const addChoice = () => {
    if (formData.choices.length < 6) {
      setFormData({
        ...formData,
        choices: [...formData.choices, { text: '', isCorrect: false }]
      });
    }
  };

  const removeChoice = (index) => {
    if (formData.choices.length > 2) {
      const newChoices = formData.choices.filter((_, i) => i !== index);
      setFormData({ ...formData, choices: newChoices });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!formData.prompt.trim()) {
        throw new Error('Câu hỏi không được để trống');
      }

      const validChoices = formData.choices.filter(choice => choice.text.trim());
      if (validChoices.length < 2) {
        throw new Error('Cần ít nhất 2 lựa chọn');
      }

      const hasCorrectAnswer = validChoices.some(choice => choice.isCorrect);
      if (!hasCorrectAnswer) {
        throw new Error('Cần có ít nhất 1 đáp án đúng');
      }

      const questionData = {
        prompt: formData.prompt.trim(),
        explanation: formData.explanation.trim(),
        choices: validChoices
      };

      await api.updateQuestion(quizId, questionIndex, questionData);
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Sửa câu hỏi {questionIndex + 1}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Câu hỏi *
              </label>
              <textarea
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                rows={3}
                placeholder="Nhập câu hỏi..."
                required
              />
            </div>

            {/* Choices */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Các lựa chọn *
              </label>
              <div className="space-y-3">
                {formData.choices.map((choice, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={choice.isCorrect}
                      onChange={() => handleCorrectAnswerChange(index)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <input
                      type="text"
                      value={choice.text}
                      onChange={(e) => handleChoiceChange(index, 'text', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder={`Lựa chọn ${index + 1}`}
                    />
                    {formData.choices.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeChoice(index)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {formData.choices.length < 6 && (
                <button
                  type="button"
                  onClick={addChoice}
                  className="mt-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                >
                  + Thêm lựa chọn
                </button>
              )}
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Giải thích
              </label>
              <textarea
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                rows={2}
                placeholder="Giải thích cho đáp án đúng..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
              >
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuestionEditor;
