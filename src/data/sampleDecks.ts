import { FeynmanDeck } from '../types/deck';

export const SAMPLE_DECKS: FeynmanDeck[] = [
  {
    id: 'deck-cold-chain',
    title: 'Cold Chain Biologics & Temperature Excursion SOP',
    summary: 'A direct operational guide for maintaining sensitive biologic medications between 2°C and 8°C, and what exact actions to take the second a temperature breach occurs.',
    targetAudience: 'Pharmacy Techs, Clinical Nurses, and Warehouse Staff',
    estimatedMinutes: 7,
    originalDocType: 'Standard Operating Procedure SOP-CLIN-408',
    heroImage: {
      diagramType: 'cold_chain',
      caption: 'Calibrated digital probe monitoring: 2.0°C to 8.0°C target boundary',
    },
    feynmanCoreConcept: {
      intuitiveExplanation: 'Think of biologic vaccines like ice cream sandwiches on a hot summer picnic: they have a delicate physical protein shape. If they warm up even once, the proteins unravel like melted ice cream. Refreezing them does not fix the shape; it just preserves ruined medicine.',
      centralAnalogy: {
        title: 'The Melting Ice Cream Analogy',
        analogyText: 'Proteins in vaccines are tightly folded origami cranes. Room temperature shakes the paper until it collapses into a crumpled ball. Even if you place it back into ice, paper origami does not refold itself.',
        howItMapsToSOP: 'Every minute above 8°C irreversibly destroys potency. That is why the SOP mandates immediate quarantine—never assume re-chilling restores biologic safety.'
      }
    },
    cards: [
      {
        id: 'cc-card-1',
        title: 'The Core Mental Model: Protein Origami',
        subtitle: 'Why temperature is a life-or-death physical requirement',
        cardType: 'concept_analogy',
        feynmanExplanation: 'Biologic medications are living protein structures held together by fragile chemical bonds. They only work when their 3D shape fits into patient receptors like a specific key into a padlock.',
        badgeText: 'The 12-Year-Old Test',
        image: {
          diagramType: 'protein_origami',
          caption: 'Figure 1: Intact receptor key vs denatured non-functional protein chain',
        },
        analogy: {
          metaphor: 'A delicate chocolate key that will melt and distort if left in a warm pocket.',
          takeaway: 'Never trust medicine that experienced an unlogged excursion, even if it looks visually identical.'
        }
      },
      {
        id: 'cc-card-2',
        title: 'Non-Negotiable Red Lines & Golden Rules',
        subtitle: 'The 3 mistakes that compromise patient safety or destroy inventory',
        cardType: 'critical_rules',
        feynmanExplanation: 'These rules are absolute. Compromising on any of them renders entire batches invalid for clinical administration.',
        badgeText: 'Safety Red Lines',
        criticalRules: [
          {
            type: 'never_do',
            rule: 'NEVER discard suspect inventory before QA review.',
            consequenceOfFailure: 'Throws away potentially salvageable product and destroys insurance/audit traceability.',
            verificationCheck: 'Place in designated red QUARANTINE tote with excursion log form attached.'
          },
          {
            type: 'must_do',
            rule: 'MUST log excursions within 15 minutes of discovery.',
            consequenceOfFailure: 'Delays stability database checks and manufacturer expiration recalculations.',
            verificationCheck: 'Submit Excursion Ticket # and record logger min/max readings.'
          },
          {
            type: 'never_do',
            rule: 'NEVER store vaccines in refrigerator door bins or near back cooling coil.',
            consequenceOfFailure: 'Door bins experience +4°C swings per opening; coils induce sub-zero freezing.',
            verificationCheck: 'Ensure containers are placed in central wire baskets at least 3 inches from walls.'
          }
        ]
      },
      {
        id: 'cc-card-3',
        title: 'The 4-Step Excursion Emergency Protocol',
        subtitle: 'What to do the moment an alarm sounds',
        cardType: 'process_steps',
        feynmanExplanation: 'When a temperature sensor beeps, treat it like an ambulance dispatch: keep the door shut, seal the evidence, isolate the medicine, and inform QA.',
        badgeText: 'Execution Sequence',
        image: {
          diagramType: 'flowchart',
          caption: 'Protocol Sequence: Door Seal -> Cooler Prep -> Quarantine Sign -> QA Log',
        },
        steps: [
          {
            stepNumber: 1,
            title: 'Keep Door Closed & Record Digital Display',
            action: 'Do not swing the refrigerator door open to inspect. Note Current Temp, Max Temp, and Duration of breach from external logger display.',
            whyItMatters: 'Opening the door dumps whatever remaining cold air is left, accelerating thermal runaway.',
            criticalWatchout: 'Resist the urge to visually count vials until backup cold packs are prepped.'
          },
          {
            stepNumber: 2,
            title: 'Prepare Insulated Transfer Container',
            action: 'Pre-condition a certified cooler with conditioned frozen water packs separated by cardboard buffer layers.',
            whyItMatters: 'Direct contact with frozen ice blocks will freeze and crack liquid vials.',
            criticalWatchout: 'Always measure cooler internal temp (2°C–8°C) before placing vials inside.'
          },
          {
            stepNumber: 3,
            title: 'Affix Neon "QUARANTINE - DO NOT DISPENSE" Sign',
            action: 'Physically quarantine the affected batches with bright signage and zip-tie seal.',
            whyItMatters: 'Prevents another nurse or tech from accidentally administering compromised vials on the next shift.',
            criticalWatchout: 'Do not put vials back into general circulation under any circumstances.'
          },
          {
            stepNumber: 4,
            title: 'Notify Quality Assurance & File Excursion Log',
            action: 'Email temperature log CSV to QA and open Incident Ticket within 60 minutes.',
            whyItMatters: 'QA contacts the manufacturer stability database to determine if the cumulative degree-hours are safe.',
            criticalWatchout: 'Include lot numbers, expiration dates, and exact start/stop timestamps.'
          }
        ]
      },
      {
        id: 'cc-card-4',
        title: 'Field Troubleshooting & Common Traps',
        subtitle: 'Everyday friction points that fool experienced staff',
        cardType: 'pitfalls_troubleshooting',
        feynmanExplanation: 'Most cold-chain failures are caused not by compressor breakdowns, but by mundane human habits.',
        badgeText: 'Field Traps',
        pitfalls: [
          {
            symptomOrMistake: 'Logger shows 1.2°C (Sub-cooling / near freeze)',
            rootCause: 'Baskets pushed directly against the cold-plate evaporator on the back wall.',
            immediateFix: 'Pull basket forward 3 inches to restore convective air circulation.'
          },
          {
            symptomOrMistake: 'Temperature spikes every weekday at 14:00',
            rootCause: 'Delivery truck receiving door left propped open, blowing warm hallway air into pharmacy annex.',
            immediateFix: 'Enforce 2-person handoff protocol and automatic door closer inspect.'
          },
          {
            symptomOrMistake: 'Logger probe reading fluctuates wildly',
            rootCause: 'Probe fell out of glycol buffer bottle and is measuring ambient air instead of liquid core temperature.',
            immediateFix: 'Reseat thermocouple sensor securely in glycol solution vial.'
          }
        ]
      },
      {
        id: 'cc-card-5',
        title: 'Shift Dilemma: The 2:00 AM Power Flicker',
        subtitle: 'Test your operational judgment in a high-pressure scenario',
        cardType: 'scenario_quiz',
        feynmanExplanation: 'Knowledge is useless if you panic during night shift. Apply the Feynman principles to this realistic scenario.',
        badgeText: 'Active Recall',
        image: {
          diagramType: 'cold_chain',
          caption: 'Scenario Context: Sensor displays 9.4°C at 02:15 AM following power flicker',
        },
        quiz: {
          scenario: 'It is 02:15 AM on Saturday. A brief thunderstorm knocks out facility power for 12 minutes. The auxiliary generator kicks in. You check Refrigerator #3: the display reads 9.4°C (1.4°C above the 8°C limit). The compressor is humming loudly and the temperature is slowly trending down.',
          question: 'What is your immediate and legally compliant action?',
          options: [
            'Wait 30 minutes to see if the compressor brings it back below 8°C; if it recovers, no log is required.',
            'Immediately throw the entire contents into the biohazard disposal bin to prevent accidental injection.',
            'Leave the door closed, record the max excursion temp & duration, move contents to pre-chilled backup cooler with a QUARANTINE label, and log the incident.',
            'Transfer the vials into the -20°C freezer for 10 minutes to rapidly shock-cool them back into safe range.'
          ],
          correctAnswerIndex: 2,
          feynmanFeedback: 'Spot on! Never guess or shock-freeze biologics. Keeping the door closed preserves remaining cold air. Physical quarantine with bright labeling prevents human error on Sunday morning, while preserving the audit trail so QA can check stability data.',
          distractorExplanations: [
            'Waiting and not logging is a severe compliance violation: cumulative heat damage is invisible.',
            'Discarding immediately wastes tens of thousands of dollars before QA determines if the product has 72-hour thermal tolerance.',
            'Never freeze liquid vaccines (-20°C). Freezing water expands, shattering adjuvant crystals and completely inactivating the vaccine.'
          ]
        }
      },
      {
        id: 'cc-card-6',
        title: 'Pocket Reference & Critical Numbers',
        subtitle: 'Tape this next to every cold-storage unit',
        cardType: 'quick_reference',
        feynmanExplanation: 'Key numbers to memorize and emergency contact triggers.',
        badgeText: 'Cheat Sheet',
        referenceItems: [
          {
            label: 'Safe Storage Range',
            value: '2.0°C to 8.0°C (36°F to 46°F)',
            detail: 'Target setpoint is strictly 5.0°C (dead center of range).'
          },
          {
            label: 'Excursion Alert Threshold',
            value: '< 2.0°C or > 8.0°C for ≥ 5 min',
            detail: 'Requires immediate visual and electronic logging.'
          },
          {
            label: 'Reporting Window',
            value: 'Within 60 Minutes',
            detail: 'Email QA-ColdChain@hospital.org with data logger export.'
          },
          {
            label: 'Primary Backup Location',
            value: 'Pharmacy Vault Cold Room B-12',
            detail: 'Access badge code required; backup key in lockbox 4.'
          }
        ]
      }
    ]
  }
];
