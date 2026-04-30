import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CopyIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Field({ label, icon, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-indigo-500 flex items-center gap-1">
        <span>{icon}</span> {label}
      </label>
      {children}
    </div>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full bg-indigo-50 border border-indigo-100 rounded-xl px-3.5 py-2.5 text-sm text-indigo-900
        placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
        hover:border-indigo-200 transition-all duration-150 ${className}`}
      {...props}
    />
  );
}

function StepHeader({ step, title, icon }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">
          Step {step}
        </p>
        <p className="text-sm font-bold text-indigo-900">{title}</p>
      </div>
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 border border-indigo-100 overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-indigo-400 via-indigo-600 to-violet-600" />
      <div className="p-7">{children}</div>
    </div>
  );
}

function GradientButton({ disabled, onClick, children }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="group w-full flex items-center justify-center gap-2
        bg-gradient-to-r from-indigo-600 to-violet-600
        hover:from-indigo-500 hover:to-violet-500
        disabled:from-indigo-200 disabled:to-indigo-200 disabled:cursor-not-allowed
        text-white font-bold text-sm tracking-wide
        py-3.5 rounded-2xl shadow-lg shadow-indigo-200 transition-all duration-200"
    >
      {children}
    </button>
  );
}

function validateQuizJSON(raw) {
  try {
    const parsed = JSON.parse(raw);
    const results =
      parsed?.results ??
      parsed?.quiz?.results ??
      (Array.isArray(parsed) ? parsed : null);
    if (!Array.isArray(results) || results.length === 0) return null;
    for (const q of results) {
      if (
        typeof q.question !== "string" ||
        !Array.isArray(q.options) ||
        q.options.length < 2 ||
        typeof q.answer !== "string"
      )
        return null;
    }
    return results;
  } catch {
    return null;
  }
}

function CreateQuiz() {
  const step2Ref = useRef(null);

  const skipToStep2 = () => {
    setPrompt("skipped"); // triggers Step 2 card to render
    setTimeout(
      () => step2Ref.current?.scrollIntoView({ behavior: "smooth" }),
      50,
    );
  };

  const navigate = useNavigate();

  // Step 1
  const [form, setForm] = useState({
    topic: "",
    difficulty: "Medium",
    length: "",
  });

  // Step 2
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [analysisState, setAnalysis] = useState("idle");
  const [questions, setQuestions] = useState(null);
  const debounceRef = useRef(null);

  // Step 3
  const [config, setConfig] = useState({
    timeLimit: "",
    marksCorrect: "1",
    marksDeduction: "0",
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setConf = (key) => (e) =>
    setConfig((c) => ({ ...c, [key]: e.target.value }));

  const step1Complete = form.topic && form.difficulty && form.length;
  const step2Complete = analysisState === "valid";
  const step3Complete = config.timeLimit && config.marksCorrect !== "";

  // Generate prompt when Step 1 is submitted
  const generate = () => {
    if (!step1Complete) return;
    const text = `Create a quiz with the following specifications:

- Number of questions: ${form.length}
- Topic: ${form.topic}
- Difficulty level: ${form.difficulty}

Return the quiz strictly as a JSON array with no extra text, no markdown:

[
  {
    "question": "",
    "options": ["", "", "", ""],
    "answer": "",
    "explanation": ""
  }
]`;
    setPrompt(text);
    setCopied(false);
    setAiInput("");
    setAnalysis("idle");
    setQuestions(null);
  };

  const copy = () => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Debounced analysis of pasted AI response
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!aiInput.trim()) {
      setAnalysis("idle");
      setQuestions(null);
      return;
    }
    setAnalysis("loading");
    debounceRef.current = setTimeout(() => {
      const result = validateQuizJSON(aiInput);
      if (result) {
        setQuestions(result);
        setAnalysis("valid");
      } else {
        setQuestions(null);
        setAnalysis("invalid");
      }
    }, 800);
    return () => clearTimeout(debounceRef.current);
  }, [aiInput]);

  const startQuiz = () => {
    navigate("/quiz", {
      state: {
        questions,
        timeLimit: Number(config.timeLimit),
        marksCorrect: Number(config.marksCorrect) || 1,
        marksDeduction: Number(config.marksDeduction) || 0,
        topic: form.topic,
        source: "create_quiz",
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 py-10 px-4">
      <div className="w-full max-w-xl mx-auto space-y-5">
        {/* Header */}
        <div className="mb-2 text-center">
          <span className="inline-block bg-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            AI-Powered
          </span>
          <h1 className="text-3xl font-extrabold text-indigo-900 leading-tight">
            Build Your Quiz
          </h1>
          <p className="text-indigo-400 text-sm mt-1">
            Three steps to your personalised exam experience.
          </p>

          <button
            onClick={skipToStep2}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-500
      border border-indigo-200 bg-white hover:bg-indigo-50 px-4 py-2 rounded-full
      transition-all duration-150 shadow-sm"
          >
            <span>📋</span> I already have my quiz response
          </button>
        </div>

        {/* ── STEP 1: Quiz Parameters ── */}
        <Card>
          <StepHeader
            step="1"
            title="Quiz Parameters"
            icon={
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />

          <div className="space-y-4">
            <Field label="Topic" icon="📚">
              <Input
                type="text"
                placeholder="e.g. Python basics, World War II, SQL joins…"
                value={form.topic}
                onChange={set("topic")}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Difficulty" icon="🎯">
                <select
                  value={form.difficulty}
                  onChange={set("difficulty")}
                  className="w-full bg-indigo-50 border border-indigo-100 rounded-xl px-3.5 py-2.5 text-sm text-indigo-900
                    focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                    hover:border-indigo-200 transition-all duration-150 cursor-pointer"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                  <option>SSC</option>
                  <option>IAS</option>
                  <option>UPSC</option>
                </select>
              </Field>

              <Field label="No. of Questions" icon="🔢">
                <Input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="e.g. 10"
                  value={form.length}
                  onChange={set("length")}
                />
              </Field>
            </div>
          </div>

          <div className="mt-6 border-t border-indigo-50 pt-5">
            <GradientButton disabled={!step1Complete} onClick={generate}>
              <span>Generate AI Prompt</span>
              <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                →
              </span>
            </GradientButton>
            {!step1Complete && (
              <p className="text-center text-indigo-300 text-xs mt-2">
                Fill all fields to continue.
              </p>
            )}
          </div>
        </Card>

        {/* ── STEP 2: Prompt + Paste Response ── */}
        {prompt && (
          <div ref={step2Ref}>
            <Card>
              <StepHeader
                step="2"
                title="Get Your Questions"
                icon={
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              />

              {/* Generated prompt */}
              {prompt !== "skipped" && (
                <div className="mb-5">
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
                        AI Prompt
                      </p>
                      <button
                        onClick={copy}
                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all duration-200 ${
                          copied
                            ? "bg-green-50 border-green-200 text-green-600"
                            : "bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100"
                        }`}
                      >
                        {copied ? (
                          <>
                            <CheckIcon /> Copied!
                          </>
                        ) : (
                          <>
                            <CopyIcon /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-3.5 text-xs text-indigo-800 leading-relaxed whitespace-pre-wrap font-mono max-h-40 overflow-y-auto">
                      {prompt}
                    </pre>
                    <div className="mt-2.5 flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-2.5">
                      <span className="text-base leading-none mt-0.5">💡</span>
                      <p className="text-xs text-amber-700 leading-relaxed">
                        Copy and paste into any AI —{" "}
                        <span className="font-bold text-amber-800">
                          Claude recommended
                        </span>
                        . Then paste the response in the field below.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Divider */}
              {prompt !== "skipped" && (
                <div className="border-t border-indigo-50 my-5" />
              )}
              <div className="border-t border-indigo-50 my-5" />

              {/* Paste response */}
              <div>
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">
                  Paste AI Response
                </p>
                <textarea
                  rows={5}
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder={
                    'Paste the JSON response here…\n\n[{"question": "…", "options": ["A","B","C","D"], "answer": "A", "explanation": "…"}]'
                  }
                  className="w-full bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-3 text-xs text-indigo-900
                  placeholder-indigo-300 font-mono leading-relaxed focus:outline-none focus:ring-2
                  focus:ring-indigo-400 focus:border-transparent resize-none transition-all"
                />

                {/* Status badge */}
                <div className="mt-2.5 h-7 flex items-center">
                  {analysisState === "idle" && (
                    <span className="text-xs text-indigo-300">
                      Waiting for input…
                    </span>
                  )}
                  {analysisState === "loading" && (
                    <span className="flex items-center gap-2 text-xs text-indigo-400">
                      <svg
                        className="w-3.5 h-3.5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Analysing format…
                    </span>
                  )}
                  {analysisState === "valid" && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {questions?.length} question
                      {questions?.length !== 1 ? "s" : ""} detected — proceed to
                      Step 3!
                    </span>
                  )}
                  {analysisState === "invalid" && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-red-500 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      Invalid format — check the JSON structure.
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ── STEP 3: Exam Config + Start ── */}
        {step2Complete && (
          <Card>
            <StepHeader
              step="3"
              title="Exam Settings"
              icon={
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            <div className="space-y-4">
              <Field label="Time Limit (minutes)" icon="⏱">
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 30"
                  value={config.timeLimit}
                  onChange={setConf("timeLimit")}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Marks — Correct" icon="✅">
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    value={config.marksCorrect}
                    onChange={setConf("marksCorrect")}
                  />
                </Field>
                <Field label="Deduction — Wrong" icon="❌">
                  <Input
                    type="number"
                    min="0"
                    step="0.25"
                    value={config.marksDeduction}
                    onChange={setConf("marksDeduction")}
                  />
                </Field>
              </div>

              {/* Summary pill */}
              {step3Complete && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { label: `${questions?.length} Questions` },
                    { label: `${config.timeLimit} min` },
                    { label: `+${config.marksCorrect} correct` },
                    { label: `-${config.marksDeduction} wrong` },
                  ].map((s) => (
                    <span
                      key={s.label}
                      className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-600 font-semibold px-3 py-1 rounded-full"
                    >
                      {s.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-indigo-50 pt-5">
              <GradientButton disabled={!step3Complete} onClick={startQuiz}>
                🚀 <span>Start Quiz — {questions?.length} Questions</span>
              </GradientButton>
              {!config.timeLimit && (
                <p className="text-center text-indigo-300 text-xs mt-2">
                  Set a time limit to start.
                </p>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default CreateQuiz;
