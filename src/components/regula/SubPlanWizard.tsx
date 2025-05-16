import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const topics = [
  { id: "java_basics", name: "Java Fundamentals" },
  { id: "oop", name: "Object-Oriented Programming" },
  { id: "collections", name: "Collections Framework" },
  { id: "exceptions", name: "Exception Handling" },
  { id: "io", name: "Input/Output (I/O)" },
];

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const defaultStrategies = [
  {
    id: "pomodoro",
    name: "Pomodoro Technique",
    description: "Work for 25 minutes, then take a 5-minute break",
  },
  {
    id: "spaced_repetition",
    name: "Spaced Repetition",
    description: "Review material at increasing intervals",
  },
  {
    id: "active_recall",
    name: "Active Recall",
    description: "Test yourself on the material",
  },
  {
    id: "mind_mapping",
    name: "Mind Mapping",
    description: "Visualize concepts and connections",
  },
  {
    id: "feynman",
    name: "Feynman Technique",
    description: "Explain concepts in simple terms",
  },
  {
    id: "cornell",
    name: "Cornell Note-Taking",
    description: "Structured note-taking method",
  },
  {
    id: "group_study",
    name: "Group Study",
    description: "Study with peers for discussion",
  },
  {
    id: "practice_tests",
    name: "Practice Tests",
    description: "Take mock exams to practice",
  },
];

interface SubPlanWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
}

export function SubPlanWizard({
  open,
  onClose,
  onComplete,
}: SubPlanWizardProps) {
  const [step, setStep] = useState(1);
  // Step 1
  const [topic, setTopic] = useState("");
  const [mastery, setMastery] = useState(70);
  // Step 2
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  // Step 3
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [customStrategies, setCustomStrategies] = useState<
    { name: string; description?: string }[]
  >([]);
  const [strategyName, setStrategyName] = useState("");
  const [strategyDesc, setStrategyDesc] = useState("");

  function handleNext() {
    if (step < 4) setStep(step + 1);
    else handleFinish();
  }
  function handleBack() {
    if (step > 1) setStep(step - 1);
  }
  function handleCancel() {
    setStep(1);
    setTopic("");
    setMastery(70);
    setSelectedDays([]);
    setSelectedStrategies([]);
    setCustomStrategies([]);
    setStrategyName("");
    setStrategyDesc("");
    setHoursPerDay(2);
    onClose();
  }
  function handleFinish() {
    console.log(
      "[CLIENT] SubPlanWizard.handleFinish - Completando wizard com dados:",
      {
        topic,
        mastery,
        selectedDays,
        hoursPerDay,
        selectedStrategies,
        customStrategies: customStrategies.length > 0 ? customStrategies : null,
      }
    );

    // Verificar se os dados são válidos antes de enviar
    if (!topic) {
      console.error(
        "[CLIENT] SubPlanWizard.handleFinish - Erro: Tópico não selecionado"
      );
      return;
    }

    // Preparar os dados completos para enviar ao componente pai
    const completeData = {
      topic,
      mastery,
      selectedDays,
      hoursPerDay,
      selectedStrategies,
      customStrategies: customStrategies.length > 0 ? customStrategies : null,
    };

    // Verificar se a função onComplete está definida
    if (typeof onComplete !== "function") {
      console.error(
        "[CLIENT] SubPlanWizard.handleFinish - ERRO: onComplete não é uma função",
        onComplete
      );
      alert("Erro: não foi possível enviar os dados. Contate o suporte.");
      return;
    }

    console.log(
      "[CLIENT] SubPlanWizard.handleFinish - Chamando onComplete com dados completos"
    );
    console.log(
      "[CLIENT] SubPlanWizard.handleFinish - onComplete é:",
      onComplete.toString().substring(0, 100) + "..."
    );

    try {
      // Chamar função onComplete diretamente com console.log embutido
      console.log(
        "[CLIENT] SubPlanWizard.handleFinish - Antes de chamar onComplete"
      );
      onComplete(completeData);
      console.log(
        "[CLIENT] SubPlanWizard.handleFinish - Depois de chamar onComplete"
      );
      console.log(
        "[CLIENT] SubPlanWizard.handleFinish - onComplete executado com sucesso"
      );
    } catch (error) {
      console.error(
        "[CLIENT] SubPlanWizard.handleFinish - Erro ao chamar onComplete:",
        error
      );
    }

    handleCancel();
  }
  function handleAddStrategy() {
    if (strategyName.trim()) {
      setCustomStrategies([
        ...customStrategies,
        { name: strategyName, description: strategyDesc },
      ]);
      setStrategyName("");
      setStrategyDesc("");
    }
  }
  function handleRemoveCustomStrategy(idx: number) {
    setCustomStrategies(customStrategies.filter((_, i) => i !== idx));
  }

  // Barra de progresso animada
  const progress = ((step - 1) / 3) * 100;

  // Cartão de contexto do plano principal
  const planContext = (
    <div className="mb-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-900 shadow-sm">
      <div className="font-semibold">Creating Sub-Plan for: My Study Plan</div>
      <div className="mt-1 text-xs text-blue-700">
        Course: Java Programming • Target: Grade A (90-100%)
      </div>
    </div>
  );

  return (
    <Dialog open={open} onClose={handleCancel} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/30 transition-opacity duration-300"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl rounded-2xl bg-white p-0 shadow-2xl transition-all duration-300">
          {/* Barra de progresso */}
          <div className="h-2 w-full rounded-t-2xl bg-zinc-100">
            <div
              className="h-2 rounded-t-2xl bg-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="p-10">
            <Dialog.Title className="mb-2 text-2xl font-bold text-zinc-900">
              Sub-Plan Wizard
            </Dialog.Title>
            <p className="mb-4 text-gray-500">Step {step} of 4</p>
            {planContext}
            {/* Step 1: Topic Selection */}
            <div className={step === 1 ? "animate-fade-in block" : "hidden"}>
              <div className="mb-2 flex items-center gap-2 text-lg font-semibold">
                <span className="inline-block rounded-full bg-blue-100 p-2">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="16"
                      rx="2"
                      stroke="#2563eb"
                      strokeWidth="2"
                    />
                    <path d="M7 4v16" stroke="#2563eb" strokeWidth="2" />
                  </svg>
                </span>
                Topic Selection
              </div>
              <div className="mb-2 text-gray-500">
                Choose a topic and set your mastery level
              </div>
              <label className="mb-1 mt-4 block text-sm font-medium">
                Select a topic for this sub-plan:
              </label>
              <select
                className="mb-4 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                <option value="">Choose a topic</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
              <label className="mb-1 block text-sm font-medium">
                Set your mastery goal:
              </label>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400">
                  Basic understanding
                </span>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[mastery]}
                  onValueChange={([val]) => setMastery(val ?? 0)}
                  className="flex-1"
                />
                <span className="text-xs text-gray-400">Complete mastery</span>
                <span className="ml-2 text-sm font-semibold text-blue-700">
                  {mastery}%
                </span>
              </div>
            </div>
            {/* Step 2: Schedule Customization */}
            <div className={step === 2 ? "animate-fade-in block" : "hidden"}>
              <div className="mb-2 flex items-center gap-2 text-lg font-semibold">
                <span className="inline-block rounded-full bg-blue-100 p-2">
                  <svg width="24" height="24" fill="none">
                    <rect
                      x="4"
                      y="6"
                      width="16"
                      height="12"
                      rx="2"
                      stroke="#2563eb"
                      strokeWidth="2"
                    />
                    <path d="M8 2v4M16 2v4" stroke="#2563eb" strokeWidth="2" />
                  </svg>
                </span>
                Schedule Customization
              </div>
              <div className="mb-2 text-gray-500">Select your study days</div>
              <div className="mb-4 flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    type="button"
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      selectedDays.includes(day)
                        ? "border-blue-600 bg-blue-600 text-white shadow"
                        : "border-zinc-300 bg-gray-100 text-gray-700 hover:bg-blue-50"
                    }`}
                    onClick={() =>
                      setSelectedDays((prev) =>
                        prev.includes(day)
                          ? prev.filter((d) => d !== day)
                          : [...prev, day]
                      )
                    }
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
              <div className="mb-2 flex items-center gap-4">
                <span className="flex-shrink-0 text-sm font-medium text-gray-700">
                  Hours per day:
                </span>
                <Slider
                  min={1}
                  max={8}
                  step={1}
                  value={[hoursPerDay]}
                  onValueChange={([val]) => setHoursPerDay(val ?? 1)}
                  className="flex-1"
                />
                <span className="ml-2 w-12 text-right text-base font-semibold text-blue-700">
                  {hoursPerDay} {hoursPerDay === 1 ? "hour" : "hours"}
                </span>
              </div>
              <div className="mb-2 text-sm text-gray-500">
                Total per week:{" "}
                <span className="font-semibold text-blue-700">
                  {selectedDays.length * hoursPerDay}{" "}
                  {selectedDays.length * hoursPerDay === 1 ? "hour" : "hours"}
                </span>
              </div>
            </div>
            {/* Step 3: Strategy Selection */}
            <div className={step === 3 ? "animate-fade-in block" : "hidden"}>
              <div className="mb-2 flex items-center gap-2 text-lg font-semibold">
                <span className="inline-block rounded-full bg-blue-100 p-2">
                  <svg width="24" height="24" fill="none">
                    <path
                      d="M12 2v20M2 12h20"
                      stroke="#2563eb"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
                Strategy Selection
              </div>
              <div className="mb-2 text-gray-500">
                Choose your preferred learning strategies
              </div>
              <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                <div className="mb-2 font-medium">Add your own strategy:</div>
                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                  <input
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="Strategy Name"
                    value={strategyName}
                    onChange={(e) => setStrategyName(e.target.value)}
                  />
                  <input
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 md:ml-2"
                    placeholder="Description (optional)"
                    value={strategyDesc}
                    onChange={(e) => setStrategyDesc(e.target.value)}
                  />
                  <Button
                    type="button"
                    className="mt-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 md:mt-0"
                    onClick={handleAddStrategy}
                    disabled={!strategyName.trim()}
                  >
                    Add Strategy
                  </Button>
                </div>
                {/* Lista de estratégias customizadas */}
                {/* (Removido: a lista de estratégias customizadas aqui, pois agora elas aparecem apenas no fim da lista de seleção) */}
              </div>
              <div className="mb-2 font-medium">
                Select your preferred learning strategies:
              </div>
              <div className="flex max-h-48 flex-col gap-2 overflow-y-auto">
                {/* Estratégias padrão */}
                {defaultStrategies.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`flex flex-col items-start rounded-lg border px-4 py-2 text-left text-sm font-medium transition-all duration-200 ${
                      selectedStrategies.includes(s.id)
                        ? "border-blue-600 bg-blue-600 text-white shadow"
                        : "border-zinc-300 bg-gray-100 text-gray-700 hover:bg-blue-50"
                    }`}
                    onClick={() =>
                      setSelectedStrategies((prev) =>
                        prev.includes(s.id)
                          ? prev.filter((d) => d !== s.id)
                          : [...prev, s.id]
                      )
                    }
                  >
                    <span className="font-semibold">{s.name}</span>
                    <span className="text-xs text-gray-400">
                      {s.description}
                    </span>
                  </button>
                ))}
                {/* Estratégias customizadas */}
                {customStrategies.map((s, idx) => {
                  // Cria um id único para cada custom strategy
                  const customId = `custom_${idx}`;
                  const isSelected = selectedStrategies.includes(customId);
                  return (
                    <div key={customId} className="relative">
                      <button
                        type="button"
                        className={`flex w-full flex-col items-start rounded-lg border px-4 py-2 text-left text-sm font-medium transition-all duration-200 ${
                          isSelected
                            ? "border-blue-600 bg-blue-600 text-white shadow"
                            : "border-zinc-300 bg-gray-100 text-gray-700 hover:bg-blue-50"
                        }`}
                        onClick={() =>
                          setSelectedStrategies((prev) =>
                            isSelected
                              ? prev.filter((d) => d !== customId)
                              : [...prev, customId]
                          )
                        }
                      >
                        <span className="font-semibold">{s.name}</span>
                        {s.description && (
                          <span className="text-xs text-gray-400">
                            {s.description}
                          </span>
                        )}
                      </button>
                      <button
                        className="absolute right-2 top-2 z-10 text-xs text-red-500 hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveCustomStrategy(idx);
                          // Remove da seleção se estiver selecionada
                          setSelectedStrategies((prev) =>
                            prev.filter((d) => d !== customId)
                          );
                        }}
                        tabIndex={-1}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Step 4: Plan Review */}
            <div className={step === 4 ? "animate-fade-in block" : "hidden"}>
              <div className="mb-2 flex items-center gap-2 text-lg font-semibold">
                <span className="inline-block rounded-full bg-blue-100 p-2">
                  <svg width="24" height="24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#2563eb" strokeWidth="2" />
                  </svg>
                </span>
                Plan Review
              </div>
              <div className="mb-2 text-gray-500">
                Review and finalize your personalized study plan
              </div>
              <div className="mb-2 space-y-1 text-sm text-gray-700">
                <div>
                  <strong>Topic:</strong> {topic}
                </div>
                <div>
                  <strong>Mastery goal:</strong> {mastery}%
                </div>
                <div>
                  <strong>Study days:</strong>{" "}
                  {selectedDays.join(", ") || "None"}
                </div>
                <div>
                  <strong>Strategies:</strong>{" "}
                  {[
                    ...defaultStrategies
                      .filter((s) => selectedStrategies.includes(s.id))
                      .map((s) => s.name),
                    ...customStrategies
                      .map((s, idx) =>
                        selectedStrategies.includes(`custom_${idx}`)
                          ? s.name
                          : null
                      )
                      .filter(Boolean),
                  ].join(", ") || "None"}
                </div>
              </div>
            </div>
            {/* Navegação */}
            <div className="flex justify-between gap-2 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="transition-all duration-200"
              >
                Cancel
              </Button>
              <div className="flex gap-2">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="transition-all duration-200"
                  >
                    Back
                  </Button>
                )}
                {step < 4 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={
                      (step === 1 && !topic) ||
                      (step === 2 && selectedDays.length === 0) ||
                      (step === 3 &&
                        selectedStrategies.length === 0 &&
                        customStrategies.length === 0)
                    }
                    className="transition-all duration-200"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleFinish}
                    className="transition-all duration-200"
                  >
                    Finish
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default SubPlanWizard;
