import React from 'react';
import { FeynmanCardMetadata } from '../experiment/types';

interface FeynmanCardProps {
  metadata?: FeynmanCardMetadata;
}

export const FeynmanCard: React.FC<FeynmanCardProps> = ({ metadata }) => {
  if (!metadata || !metadata.cardType) {
    return (
      <div className="p-6 bg-white rounded-3xl border border-[#E6E8EC] shadow-sm">
        <p className="text-sm text-[#3D4652]">No Feynman pedagogical content available for this section.</p>
      </div>
    );
  }
  return (
    <div className="p-6 bg-white rounded-3xl border border-[#E6E8EC] shadow-sm">
      <h2 className="text-xl font-bold text-[#0E1116] mb-4">Feynman Technique: {metadata.cardType}</h2>
      <p className="text-sm text-[#3D4652] mb-4">{metadata.feynmanExplanation}</p>
      
      {metadata.analogy && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 mb-4">
          <h3 className="text-xs font-bold text-amber-900 uppercase">Analogy</h3>
          <p className="text-sm font-semibold text-amber-800">{metadata.analogy.metaphor}: {metadata.analogy.takeaway}</p>
        </div>
      )}

      {metadata.criticalRules && (
        <div className="space-y-2">
          {metadata.criticalRules.map((rule, i) => (
            <div key={i} className="p-3 bg-red-50 rounded-xl border border-red-200">
              <p className="text-sm font-bold text-red-900">{rule.rule}</p>
              <p className="text-xs text-red-700">Risk: {rule.consequenceOfFailure}</p>
            </div>
          ))}
        </div>
      )}

      {metadata.steps && (
        <div className="space-y-2">
          {metadata.steps.map((step, i) => (
            <div key={i} className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm font-bold text-blue-900">{step.stepNumber}. {step.title}</p>
              <p className="text-xs text-blue-700">{step.action} (Why: {step.whyItMatters})</p>
            </div>
          ))}
        </div>
      )}

      {metadata.pitfalls && (
        <div className="space-y-2">
          {metadata.pitfalls.map((p, i) => (
            <div key={i} className="p-3 bg-orange-50 rounded-xl border border-orange-200">
              <p className="text-sm font-bold text-orange-900">{p.symptomOrMistake}</p>
              <p className="text-xs text-orange-700">Root Cause: {p.rootCause} | Fix: {p.immediateFix}</p>
            </div>
          ))}
        </div>
      )}

      {metadata.quiz && (
        <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
          <p className="text-sm font-bold text-purple-900">{metadata.quiz.question}</p>
          {metadata.quiz.options.map((opt, i) => (
            <button key={i} className="block w-full p-2 mt-2 text-left bg-white border rounded">{opt}</button>
          ))}
        </div>
      )}
    </div>
  );
};
