'use client';

import { useMemo, useState } from 'react';

const SAMPLE = {
  role: 'You are a senior product-minded front-end engineer.',
  goal: 'Design and implement an all-in-one developer tools dashboard for daily workflows.',
  context: 'The product should feel modern, fast, and browser-first. Tools must be discoverable, searchable, and organized into clear developer categories.',
  constraints: 'Keep the experience responsive, minimal, and component-driven. Avoid generic layouts and make the workspace feel intentional.',
  inputs: 'The user can upload images, paste code, format payloads, and combine multiple tools in one workspace.',
  output: 'Return production-ready UI changes, clear tool cards, and concise implementation notes.',
  examples: 'Include tool categories such as Frontend, Backend & API, Performance & SEO, Security, and AI Developer Tools.',
};

export default function PromptTemplateBuilder() {
  const [role, setRole] = useState(SAMPLE.role);
  const [goal, setGoal] = useState(SAMPLE.goal);
  const [context, setContext] = useState(SAMPLE.context);
  const [constraints, setConstraints] = useState(SAMPLE.constraints);
  const [inputs, setInputs] = useState(SAMPLE.inputs);
  const [output, setOutput] = useState(SAMPLE.output);
  const [examples, setExamples] = useState(SAMPLE.examples);
  const [copied, setCopied] = useState(false);

  const prompt = useMemo(() => {
    return [
      role && `Role:\n${role}`,
      goal && `Goal:\n${goal}`,
      context && `Context:\n${context}`,
      inputs && `Available Inputs:\n${inputs}`,
      constraints && `Constraints:\n${constraints}`,
      examples && `Must Include:\n${examples}`,
      output && `Desired Output:\n${output}`,
    ]
      .filter(Boolean)
      .join('\n\n');
  }, [constraints, context, examples, goal, inputs, output, role]);

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const resetSample = () => {
    setRole(SAMPLE.role);
    setGoal(SAMPLE.goal);
    setContext(SAMPLE.context);
    setConstraints(SAMPLE.constraints);
    setInputs(SAMPLE.inputs);
    setOutput(SAMPLE.output);
    setExamples(SAMPLE.examples);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <div className="space-y-4">
          {[
            ['Role', role, setRole, 'Who should the model behave like?'],
            ['Goal', goal, setGoal, 'What outcome should it produce?'],
            ['Context', context, setContext, 'What background should the model know?'],
            ['Constraints', constraints, setConstraints, 'What rules or boundaries matter?'],
            ['Available Inputs', inputs, setInputs, 'What data or tools will be available?'],
            ['Must Include', examples, setExamples, 'What sections, categories, or examples are required?'],
            ['Desired Output', output, setOutput, 'How should the final answer or implementation look?'],
          ].map(([label, value, setter, placeholder]) => (
            <div key={label as string}>
              <label className="text-sm font-semibold text-slate-900 dark:text-white">{label as string}</label>
              <textarea
                value={value as string}
                onChange={(event) => (setter as (value: string) => void)(event.target.value)}
                className="tool-textarea mt-3"
                style={{ minHeight: 110 }}
                placeholder={placeholder as string}
              />
            </div>
          ))}
        </div>

        <div className="space-y-4 rounded-[24px] border border-slate-200 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Generated master prompt</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Use this as a reusable AI developer prompt scaffold.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={resetSample} className="btn-secondary px-4 py-2 text-xs">
                Load sample
              </button>
              <button type="button" onClick={copyPrompt} className="btn-primary px-4 py-2 text-xs">
                {copied ? 'Copied' : 'Copy prompt'}
              </button>
            </div>
          </div>

          <textarea
            value={prompt}
            readOnly
            spellCheck={false}
            className="tool-textarea bg-slate-50 font-mono text-[13px] leading-6 dark:bg-slate-900/60"
            style={{ minHeight: 720 }}
          />
        </div>
      </div>
    </div>
  );
}
