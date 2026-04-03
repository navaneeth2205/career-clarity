import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import TestResultPage from "./TestResultPage";
import {
  getQuickTest,
  submitQuickTest,
  getSkillTest,
  submitSkillTest,
} from "../services/testService";

/**
 * TestPage Component
 * Main test orchestration component
 * Handles both Quick Test and Skill Test flows
 * Includes security features: fullscreen, copy/paste prevention, tab switch detection
 */
const TestPage = () => {
  const navigate = useNavigate();

  // State Management
  const [testState, setTestState] = useState("loading"); // loading, quickTest, skillTest, result
  const [quickTestAttempted, setQuickTestAttempted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [currentTestType, setCurrentTestType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [skillTestStarted, setSkillTestStarted] = useState(false);

  const pageRef = useRef();
  const timerIntervalRef = useRef(null);
  const tabVisibilityRef = useRef(true);

  // Initialize test on component mount
  useEffect(() => {
    checkTestStatus();
    setupSecurityFeatures();

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      exitFullscreen();
    };
  }, []);

  // Check which test to display
  const checkTestStatus = async () => {
    try {
      setLoading(true);
      const quickTestData = await getQuickTest();

      if (quickTestData.attempted) {
        setQuickTestAttempted(true);
        initializeSkillTest();
      } else {
        setQuickTestAttempted(false);
        initializeQuickTest(quickTestData);
      }
    } catch (err) {
      console.error("Error checking test status:", err);
      setError("Failed to load test. Please try again.");
      setTestState("error");
    } finally {
      setLoading(false);
    }
  };

  // Initialize Quick Test
  const initializeQuickTest = (data) => {
    setQuestions(data.questions || []);
    setCurrentTestType("quick");
    setTestState("quickTest");
    setCurrentQuestion(0);
    setAnswers({});
    startTimer(30 * 60); // 30 minutes
  };

  // Initialize Skill Test
  const initializeSkillTest = async () => {
    try {
      const skillTestData = await getSkillTest();
      setQuestions(skillTestData.questions || []);
      setCurrentTestType("skill");
      setTestState("skillTest");
      setCurrentQuestion(0);
      setAnswers({});
      startTimer(45 * 60); // 45 minutes
    } catch (err) {
      console.error("Error loading skill test:", err);
      setError("Failed to load skill test. Please try again.");
      setTestState("error");
    }
  };

  // Start test timer
  const startTimer = (seconds) => {
    setTimeRemaining(seconds);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Setup Security Features
  const setupSecurityFeatures = () => {
    // Disable right-click
    const handleContextMenu = (e) => {
      if (skillTestStarted) {
        e.preventDefault();
        alert("Right-click is disabled during the test.");
      }
    };

    // Disable copy/paste
    const handleCopyPaste = (e) => {
      if (skillTestStarted) {
        e.preventDefault();
        alert("Copy and paste are disabled during the test.");
      }
    };

    // Detect tab switching
    const handleVisibilityChange = () => {
      if (document.hidden && skillTestStarted) {
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  };

  // Enter Fullscreen - Skill Test
  const enterFullscreen = async () => {
    try {
      if (pageRef.current.requestFullscreen) {
        await pageRef.current.requestFullscreen();
        setIsFullscreen(true);
        setSkillTestStarted(true);
      }
    } catch (err) {
      console.error("Error entering fullscreen:", err);
      alert("Could not enter fullscreen mode. Please try again.");
    }
  };

  // Exit Fullscreen
  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Error exiting fullscreen:", err);
    }
  };

  // Start Skill Test with Fullscreen
  const handleStartSkillTest = async () => {
    await enterFullscreen();
  };

  // Handle answer selection
  const handleSelectAnswer = (option) => {
    const questionId = questions[currentQuestion].id;
    setAnswers({
      ...answers,
      [questionId]: option,
    });
  };

  // Navigate to next question
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Submit test
  const handleSubmitTest = async () => {
    if (!confirm(
      "Are you sure you want to submit the test? You cannot change your answers after submission."
    )) {
      return;
    }

    try {
      setLoading(true);

      let submitResponse;

      if (currentTestType === "quick") {
        submitResponse = await submitQuickTest(answers);
      } else {
        const skillFromQuestions = questions[0]?.skill || "unknown";
        submitResponse = await submitSkillTest(answers, skillFromQuestions);
      }

      setResult(submitResponse);
      setTestState("result");

      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (isFullscreen) await exitFullscreen();
    } catch (err) {
      console.error("Error submitting test:", err);
      setError("Failed to submit test. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-submit when time runs out
  const handleAutoSubmit = () => {
    alert("Time's up! Your test will be submitted now.");
    handleSubmitTest();
  };

  // Show skill test warning modal
  const SkillTestWarningModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-2xl cc-fade-in">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Before You Start</h2>
          <p className="text-slate-600">Important test guidelines</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-start space-x-3">
            <span className="text-xl">🚫</span>
            <p className="text-slate-700">Do not switch tabs or minimize the window</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-xl">🚫</span>
            <p className="text-slate-700">Do not copy or paste content</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-xl">🚫</span>
            <p className="text-slate-700">Do not right-click during the test</p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-xl">⏱️</span>
            <p className="text-slate-700">You have 45 minutes to complete 15 questions</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleStartSkillTest}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 rounded-lg transition-all"
          >
            ✨ Start Test
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold py-3 rounded-lg transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Show tab switch warning
  const TabSwitchWarning = () => (
    <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg cc-fade-in">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">⚠️</span>
        <div>
          <div className="font-bold">Tab Switch Detected!</div>
          <div className="text-sm">Stay focused on the test</div>
        </div>
      </div>
    </div>
  );

  // Loading State
  if (loading && testState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
          <p className="text-slate-600 font-medium">Loading test...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (testState === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Result State
  if (testState === "result") {
    return <TestResultPage result={result} testType={currentTestType} />;
  }

  // Quick Test State
  if (testState === "quickTest" && questions.length > 0) {
    const question = questions[currentQuestion];
    const selectedAnswer = answers[question.id];

    return (
      <div
        ref={pageRef}
        className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4"
      >
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 cc-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">📝 Quick Test</h1>
                <p className="text-slate-600 mt-1">Test your general knowledge</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-indigo-600">{formatTime(timeRemaining || 0)}</div>
                <div className="text-sm text-slate-600">Time remaining</div>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <QuestionCard
              question={question}
              questionNumber={currentQuestion + 1}
              totalQuestions={questions.length}
              selectedAnswer={selectedAnswer}
              onSelectAnswer={handleSelectAnswer}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4 cc-fade-in">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex-1 bg-white border-2 border-slate-200 text-slate-900 font-bold py-3 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              ← Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmitTest}
                disabled={loading || Object.keys(answers).length !== questions.length}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {loading ? "Submitting..." : "Submit Test ✓"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg"
              >
                Next →
              </button>
            )}
          </div>

          {/* Answer Summary */}
          <div className="mt-8 bg-white rounded-lg shadow p-4 cc-fade-in">
            <div className="text-sm text-slate-600 mb-3">
              Answered: {Object.keys(answers).length} / {questions.length}
            </div>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-8 h-8 rounded text-sm font-bold transition-all ${
                    idx === currentQuestion
                      ? "bg-indigo-600 text-white"
                      : answers[q.id]
                      ? "bg-green-500 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Skill Test - Warning Before Start
  if (testState === "skillTest" && !skillTestStarted && questions.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
        <SkillTestWarningModal />
      </div>
    );
  }

  // Skill Test - During Test
  if (testState === "skillTest" && skillTestStarted && questions.length > 0) {
    const question = questions[currentQuestion];
    const selectedAnswer = answers[question.id];

    return (
      <div
        ref={pageRef}
        className={`min-h-screen ${
          isFullscreen
            ? "bg-gradient-to-br from-blue-900 to-indigo-900"
            : "bg-gradient-to-br from-slate-50 to-slate-100"
        } py-8 px-4`}
      >
        {showWarning && <TabSwitchWarning />}

        <div className="max-w-3xl mx-auto">
          {/* Header with Timer */}
          <div className={`mb-8 cc-fade-in ${isFullscreen ? "text-white" : ""}`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">🎯 Skill Test</h1>
                <p className={`mt-1 ${isFullscreen ? "text-blue-100" : "text-slate-600"}`}>
                  15 questions • ~45 minutes
                </p>
              </div>
              <div className={`text-right ${isFullscreen ? "text-white" : ""}`}>
                <div
                  className={`text-4xl font-bold ${
                    timeRemaining < 300 ? "text-red-500" : "text-indigo-600"
                  }`}
                >
                  {formatTime(timeRemaining || 0)}
                </div>
                <div className={`text-sm ${isFullscreen ? "text-blue-100" : "text-slate-600"}`}>
                  {timeRemaining < 300 && "⚠️ Time Running Out"}
                </div>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div
            className={`${
              isFullscreen ? "bg-slate-900 border-2 border-blue-400" : "bg-white shadow-lg"
            } rounded-2xl p-8 mb-8`}
          >
            <QuestionCard
              question={question}
              questionNumber={currentQuestion + 1}
              totalQuestions={questions.length}
              selectedAnswer={selectedAnswer}
              onSelectAnswer={handleSelectAnswer}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-4 cc-fade-in">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`flex-1 font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                isFullscreen
                  ? "bg-slate-700 hover:bg-slate-600 text-white"
                  : "bg-white border-2 border-slate-200 text-slate-900 hover:bg-slate-50"
              }`}
            >
              ← Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmitTest}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {loading ? "Submitting..." : "Submit Test ✓"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className={`flex-1 font-bold py-3 rounded-lg transition-all ${
                  isFullscreen
                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                    : "bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-lg"
                }`}
              >
                Next →
              </button>
            )}
          </div>

          {/* Answer Summary */}
          <div
            className={`mt-8 rounded-lg ${
              isFullscreen
                ? "bg-slate-800 border border-blue-400"
                : "bg-white shadow"
            } p-4 cc-fade-in`}
          >
            <div
              className={`text-sm mb-3 ${
                isFullscreen ? "text-blue-200" : "text-slate-600"
              }`}
            >
              Answered: {Object.keys(answers).length} / {questions.length}
            </div>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(idx)}
                  disabled={isFullscreen}
                  className={`w-8 h-8 rounded text-sm font-bold transition-all ${
                    idx === currentQuestion
                      ? "bg-indigo-600 text-white"
                      : answers[q.id]
                      ? "bg-green-500 text-white"
                      : isFullscreen
                      ? "bg-slate-700 text-slate-300"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Fullscreen Exit Notice */}
          {isFullscreen && (
            <div className="mt-8 text-center text-blue-200 text-sm">
              Press ESC to exit fullscreen (not recommended during test)
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default TestPage;
