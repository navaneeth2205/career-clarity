import React from "react";

/**
 * QuestionCard Component
 * Displays a single question with 4 multiple choice options
 * Handles user selection and displays selected state
 */
const QuestionCard = ({ 
  question, 
  questionNumber, 
  totalQuestions, 
  selectedAnswer, 
  onSelectAnswer, 
  disabled = false 
}) => {
  const options = ["A", "B", "C", "D"];

  return (
    <div className="cc-fade-in">
      <div className="mb-8">
        {/* Question Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-slate-900">
              Question {questionNumber} of {totalQuestions}
            </h3>
            <div className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {Math.round((questionNumber / totalQuestions) * 100)}%
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-300"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Text */}
        <p className="text-lg text-slate-800 font-medium mb-6 leading-relaxed">
          {question.question}
        </p>

        {/* Options */}
        <div className="space-y-3">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => !disabled && onSelectAnswer(option)}
              disabled={disabled}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                selectedAnswer === option
                  ? "border-indigo-500 bg-indigo-50 shadow-md"
                  : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm"
              } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === option
                      ? "border-indigo-500 bg-indigo-500"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {selectedAnswer === option && (
                    <span className="text-white text-sm font-bold">✓</span>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{option}</div>
                  <div className="text-slate-700">{question.options[option]}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
