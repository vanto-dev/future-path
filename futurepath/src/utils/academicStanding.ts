export type Standing = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Graduate';

export interface StandingAnalysis {
  calculatedStanding: Standing;
  completedCredits: number;
  inProgressCredits: number;
  totalActiveCredits: number;
  requiredCredits: number;
  percentComplete: number;
  hasMismatch: boolean;
  currentStanding: Standing;
  recommendationMessage: string;
}

export function calculateAcademicStanding(
  completedCredits: number,
  inProgressCredits: number,
  currentStanding: Standing,
  requiredCredits: number = 120,
  isGraduateProgram: boolean = false
): StandingAnalysis {
  const total = completedCredits + inProgressCredits;
  
  let calculatedStanding: Standing = 'Freshman';
  if (isGraduateProgram || currentStanding === 'Graduate') {
    calculatedStanding = 'Graduate';
  } else if (total >= 90) {
    calculatedStanding = 'Senior';
  } else if (total >= 60) {
    calculatedStanding = 'Junior';
  } else if (total >= 30) {
    calculatedStanding = 'Sophomore';
  } else {
    calculatedStanding = 'Freshman';
  }

  const hasMismatch = currentStanding !== calculatedStanding && !isGraduateProgram;
  const percentComplete = Math.min(100, Math.round((completedCredits / requiredCredits) * 100));

  let recommendationMessage = '';
  if (hasMismatch) {
    recommendationMessage = `You have completed/enrolled in ${total} credits (${Math.round((total / requiredCredits) * 100)}% of degree requirements), which aligns with ${calculatedStanding} standing, but your profile currently states ${currentStanding}.`;
  }

  return {
    calculatedStanding,
    completedCredits,
    inProgressCredits,
    totalActiveCredits: total,
    requiredCredits,
    percentComplete,
    hasMismatch,
    currentStanding,
    recommendationMessage
  };
}
