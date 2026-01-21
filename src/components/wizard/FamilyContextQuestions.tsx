import { useState, useCallback } from 'react';
import { Users, AlertTriangle, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FamilyContextQuestion,
  FamilyContextAnswers,
} from '@/types/guidance';

interface FamilyContextQuestionsProps {
  onComplete: (answers: FamilyContextAnswers) => void;
  defaultAnswers?: Partial<FamilyContextAnswers>;
}

const FAMILY_CONTEXT_QUESTIONS: FamilyContextQuestion[] = [
  {
    id: 'elderly-parents',
    question: 'Do you financially support elderly parents?',
    description:
      'This includes regular monthly support, healthcare costs, or daily living expenses for parents.',
    options: [
      { value: true, label: 'Yes' },
      { value: false, label: 'No' },
    ],
    guidanceNodeId: 'sandwich-parents',
  },
  {
    id: 'other-family',
    question: 'Do you support other family members?',
    description:
      'This includes younger siblings, cousins, or other relatives who need financial support (education, living costs, etc.).',
    options: [
      { value: true, label: 'Yes' },
      { value: false, label: 'No' },
    ],
    guidanceNodeId: 'sandwich-siblings',
  },
  {
    id: 'pinjol-debt',
    question: 'Do you have any pinjol (online loan) or high-interest debt?',
    description:
      'Pinjol refers to digital lending platforms. Many young Indonesians have accumulated high-interest debt through these services.',
    options: [
      { value: true, label: 'Yes, I have pinjol debt' },
      { value: false, label: 'No pinjol debt' },
    ],
    guidanceNodeId: 'pinjol-crisis',
  },
];

export function FamilyContextQuestions({
  onComplete,
  defaultAnswers,
}: FamilyContextQuestionsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<FamilyContextAnswers>>(
    defaultAnswers || {}
  );
  const [showPinjolDetails, setShowPinjolDetails] = useState(false);

  const currentQuestion = FAMILY_CONTEXT_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / FAMILY_CONTEXT_QUESTIONS.length) * 100;

  const handleAnswer = useCallback(
    (value: boolean | string | number) => {
      const isYes = value === true;
      
      // Map question IDs to state property names
      const propertyMap: Record<string, keyof FamilyContextAnswers> = {
        'elderly-parents': 'hasElderlyParents',
        'other-family': 'hasOtherFamily',
        'pinjol-debt': 'hasPinjolDebt',
      };
      
      const propertyName = propertyMap[currentQuestion.id];
      
      const updatedAnswers = {
        ...answers,
        [propertyName]: currentQuestion.id === 'pinjol-debt' ? value : isYes,
      };

      if (currentQuestion.id === 'pinjol-debt' && isYes) {
        setShowPinjolDetails(true);
      }

      setAnswers(updatedAnswers);
    },
    [answers, currentQuestion]
  );

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < FAMILY_CONTEXT_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowPinjolDetails(false);
    } else {
      onComplete(answers as FamilyContextAnswers);
    }
  }, [currentQuestionIndex, answers, onComplete]);

  const handleBack = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setShowPinjolDetails(false);
    }
  }, [currentQuestionIndex]);

  const canProceed = () => {
    const answer = getAnswerValue(currentQuestion.id);
    if (answer === undefined || answer === null) return false;
    if (currentQuestion.id === 'pinjol-debt' && answer === true && showPinjolDetails) {
      return answers.pinjolDebtAmount !== undefined && answers.pinjolDebtAmount !== null;
    }
    return true;
  };

  const getAnswerValue = (questionId: string): boolean | undefined => {
    switch (questionId) {
      case 'elderly-parents':
        return answers.hasElderlyParents;
      case 'other-family':
        return answers.hasOtherFamily;
      case 'pinjol-debt':
        return answers.hasPinjolDebt;
      default:
        return undefined;
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Rp 0';
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(amount);
  };

  const formatInputValue = (amount: number | null) => {
    if (!amount) return '';
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  const parseInputValue = (value: string): number | null => {
    const numeric = value.replace(/[^0-9]/g, '');
    return numeric ? parseInt(numeric, 10) : null;
  };

  return (
    <Card className="wizard-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-center">
          <Users className="h-5 w-5" aria-hidden="true" />
          Family Financial Context
        </CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          Help us understand your financial situation better. These questions are optional but will provide personalized guidance.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestionIndex + 1} of {FAMILY_CONTEXT_QUESTIONS.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="font-medium" id={`question-${currentQuestion.id}`}>
                {currentQuestion.question}
              </p>
              {currentQuestion.description && (
                <p className="text-sm text-muted-foreground">{currentQuestion.description}</p>
              )}
            </div>

            <div
              className="grid grid-cols-2 gap-3"
              role="radiogroup"
              aria-labelledby={`question-${currentQuestion.id}`}
            >
              {currentQuestion.options.map((option) => {
                const isSelected = getAnswerValue(currentQuestion.id) === option.value;

                return (
                  <button
                    key={String(option.value)}
                    onClick={() => handleAnswer(option.value)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:bg-muted'
                    }`}
                    role="radio"
                    aria-checked={isSelected}
                  >
                    <span className="text-sm">{option.label}</span>
                  </button>
                );
              })}
            </div>

            {(currentQuestion.id === 'elderly-parents' || currentQuestion.id === 'other-family') &&
              getAnswerValue(currentQuestion.id) === true && (
                <div className="space-y-2 p-3 rounded-lg bg-muted/50">
                  <label
                    htmlFor="family-support-amount"
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <DollarSign className="h-4 w-4" aria-hidden="true" />
                    Monthly family support amount
                  </label>
                  <Input
                    id="family-support-amount"
                    type="text"
                    placeholder="e.g., 1,000,000"
                    value={formatInputValue(answers.familySupportAmount)}
                    onChange={(e) => {
                      setAnswers((prev) => ({
                        ...prev,
                        familySupportAmount: parseInputValue(e.target.value),
                      }));
                    }}
                    aria-describedby="family-support-hint"
                  />
                  <p id="family-support-hint" className="text-xs text-muted-foreground">
                    Approximate monthly amount you provide to family members
                  </p>
                </div>
              )}

            {currentQuestion.id === 'pinjol-debt' && getAnswerValue('pinjol-debt') === true && (
              <div className="space-y-3 p-3 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm font-medium">Pinjol Details</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label
                      htmlFor="pinjol-amount"
                      className="text-xs font-medium"
                    >
                      Total Pinjol Debt
                    </label>
                    <Input
                      id="pinjol-amount"
                      type="text"
                      placeholder="Rp 5,000,000"
                      value={formatInputValue(answers.pinjolDebtAmount)}
                      onChange={(e) => {
                        setAnswers((prev) => ({
                          ...prev,
                          pinjolDebtAmount: parseInputValue(e.target.value),
                        }));
                      }}
                      className="border-red-200 focus:border-red-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="pinjol-interest"
                      className="text-xs font-medium"
                    >
                      Est. Monthly Interest %
                    </label>
                    <Input
                      id="pinjol-interest"
                      type="text"
                      placeholder="e.g., 5%"
                      value={
                        answers.pinjolDebtInterest
                          ? `${answers.pinjolDebtInterest}%`
                          : ''
                      }
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        setAnswers((prev) => ({
                          ...prev,
                          pinjolDebtInterest: value ? parseFloat(value) : null,
                        }));
                      }}
                      className="border-red-200 focus:border-red-400"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-2">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentQuestionIndex === 0}
              aria-label="Go to previous question"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              aria-label={
                currentQuestionIndex < FAMILY_CONTEXT_QUESTIONS.length - 1
                  ? 'Go to next question'
                  : 'Complete questions and continue'
              }
            >
              {currentQuestionIndex < FAMILY_CONTEXT_QUESTIONS.length - 1
                ? 'Next'
                : 'Continue'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
