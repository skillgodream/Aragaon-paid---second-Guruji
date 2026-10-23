import React, { useState } from 'react';
import { SlidePlan } from './types';
import { ConceptAnalogyCard } from '../components/deck/ConceptAnalogyCard';
import { CriticalRulesCard } from '../components/deck/CriticalRulesCard';
import { ProcessStepsCard } from '../components/deck/ProcessStepsCard';
import { QuickReferenceCard } from '../components/deck/QuickReferenceCard';
import { ScenarioQuizCard } from '../components/deck/ScenarioQuizCard';
import { TroubleshootingCard } from '../components/deck/TroubleshootingCard';
import { DeckCard } from '../types/deck';

const CardFactory: React.FC<{ card: DeckCard; deckTitle: string }> = ({ card, deckTitle }) => {
  const props = {
    card,
    deckTitle,
    onUpdateCard: () => {},
    onDeleteCard: () => {},
    onOpenTutor: () => {},
  };

  switch (card.cardType) {
    case 'concept_analogy': return <ConceptAnalogyCard {...props} />;
    case 'critical_rules': return <CriticalRulesCard {...props} />;
    case 'process_steps': return <ProcessStepsCard {...props} />;
    case 'quick_reference': return <QuickReferenceCard {...props} />;
    case 'scenario_quiz': return <ScenarioQuizCard {...props} />;
    case 'pitfalls_troubleshooting': return <TroubleshootingCard {...props} />;
    default: return <div>Unknown card type</div>;
  }
};

export const ExperiencePlayer: React.FC<{
  plan: any;
  onComplete?: () => void;
  onClose?: () => void;
}> = ({ plan, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!plan.slides || plan.slides.length === 0) return <div>No content</div>;

  const slide = plan.slides[currentIndex];
  // Access metadata from feynmanMetadata
  const cardData = slide.feynmanMetadata as DeckCard;

  return (
    <div className="fixed inset-0 z-40 p-8 bg-[#FBF9F5] overflow-y-auto">
      <button onClick={onClose} className="mb-4 text-sm font-bold underline cursor-pointer">
        Exit
      </button>
      <div className="w-full">
        <CardFactory card={cardData} deckTitle={plan.title} />
        
        <div className="mt-6 flex gap-4">
          <button 
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => prev - 1)}
            className="px-4 py-2 bg-gray-200 rounded cursor-pointer"
          >
            Previous
          </button>
          <button 
            disabled={currentIndex === plan.slides.length - 1}
            onClick={() => setCurrentIndex(prev => prev + 1)}
            className="px-4 py-2 bg-black text-white rounded cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
