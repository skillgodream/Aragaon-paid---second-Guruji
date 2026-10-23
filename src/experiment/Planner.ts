import { Lesson } from '../types';
import { TeachMePlan } from './types';
import { planFeynmanSlides } from './feynmanPlanner';

export function planSlides(lesson: Lesson): TeachMePlan {
  return planFeynmanSlides(lesson);
}

