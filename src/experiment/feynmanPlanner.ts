import { FeynmanDeck } from '../types/deck';
import { SAMPLE_DECKS } from '../data/sampleDecks';

export function planFeynmanSlides(lesson: any): any {
  // Try to find a matching sample deck, otherwise fall back to a generic one
  const sampleDeck = SAMPLE_DECKS.find(d => d.title.toLowerCase().includes(lesson.title.toLowerCase())) || SAMPLE_DECKS[0];

  return {
    lessonId: lesson.id,
    title: sampleDeck.title,
    slides: sampleDeck.cards.map((card, index) => ({
      type: 'FEYNMAN_CARD',
      title: card.title,
      // Pass the fully structured card data as metadata
      feynmanMetadata: card,
    })),
    // Attach the deck level info to the plan if needed by UI
    deckSummary: sampleDeck.summary,
    centralAnalogy: sampleDeck.feynmanCoreConcept.centralAnalogy,
  };
}
