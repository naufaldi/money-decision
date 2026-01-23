import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: Array<{
    id: string;
    label: string;
    score: number;
    explanation: string;
  }>;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'experience',
    question: '1. What is your investment experience level?',
    options: [
      {
        id: 'beginner',
        label: 'Beginner - I\'m just starting to learn',
        score: 1,
        explanation: 'Start with low-risk options like Pasar Uang or Pendapatan Tetap'
      },
      {
        id: 'intermediate',
        label: 'Intermediate - I understand the basics',
        score: 2,
        explanation: 'You can explore balanced funds (Campuran) for better returns'
      },
      {
        id: 'advanced',
        label: 'Advanced - I actively manage investments',
        score: 3,
        explanation: 'You may be comfortable with equity funds and direct stocks'
      }
    ]
  },
  {
    id: 'time-horizon',
    question: '2. How long can you invest before needing the money?',
    options: [
      {
        id: 'short',
        label: 'Short-term (< 3 years)',
        score: 1,
        explanation: 'Stick with liquid, low-risk options like Pasar Uang'
      },
      {
        id: 'medium',
        label: 'Medium-term (3-10 years)',
        score: 2,
        explanation: 'Balanced funds work well for this time frame'
      },
      {
        id: 'long',
        label: 'Long-term (10+ years)',
        score: 3,
        explanation: 'You have time to ride out market volatility with equity funds'
      }
    ]
  },
  {
    id: 'fluctuations',
    question: '3. How comfortable are you with market fluctuations?',
    options: [
      {
        id: 'low-comfort',
        label: 'Low - I prefer stable, predictable returns',
        score: 1,
        explanation: 'Conservative investments like bonds and fixed income suit you'
      },
      {
        id: 'medium-comfort',
        label: 'Medium - Some ups and downs are okay',
        score: 2,
        explanation: 'Balanced portfolios offer growth with manageable volatility'
      },
      {
        id: 'high-comfort',
        label: 'High - I can handle significant volatility',
        score: 3,
        explanation: 'Equity-focused investments align with your risk tolerance'
      }
    ]
  }
];

type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

function getRiskProfile(score: number): { profile: RiskProfile; label: string; description: string; recommendedReturn: number } {
  if (score <= 3) {
    return {
      profile: 'conservative',
      label: 'Conservative Investor',
      description: 'You prefer safety and stability over high returns. Focus on capital preservation.',
      recommendedReturn: 5
    };
  } else if (score <= 6) {
    return {
      profile: 'moderate',
      label: 'Moderate Investor',
      description: 'You seek balanced growth with manageable risk. A mix of stability and growth potential.',
      recommendedReturn: 10
    };
  } else {
    return {
      profile: 'aggressive',
      label: 'Aggressive Investor',
      description: 'You\'re willing to accept higher volatility for maximum growth potential over time.',
      recommendedReturn: 15
    };
  }
}

export function RiskProfileMiniQuiz() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    setShowResults(false);
  };

  const calculateScore = () => {
    let totalScore = 0;
    quizQuestions.forEach(question => {
      const answerId = answers[question.id];
      if (answerId) {
        const option = question.options.find(opt => opt.id === answerId);
        if (option) {
          totalScore += option.score;
        }
      }
    });
    return totalScore;
  };

  const isComplete = Object.keys(answers).length === quizQuestions.length;
  const score = calculateScore();
  const profileResult = getRiskProfile(score);

  const handleSubmit = () => {
    if (isComplete) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Discover Your Investment Style</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Answer 3 quick questions to understand your risk tolerance
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {quizQuestions.map((question) => {
            const selectedOption = answers[question.id];

            return (
              <div key={question.id} className="space-y-3">
                <p className="text-sm font-medium">{question.question}</p>
                <div className="space-y-2">
                  {question.options.map(option => (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(question.id, option.id)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                        selectedOption === option.id
                          ? 'border-primary bg-primary/5'
                          : 'border-muted hover:border-primary/50 hover:bg-muted/50'
                      }`}
                      aria-label={`Option: ${option.label}`}
                      aria-pressed={selectedOption === option.id}
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">
                          {selectedOption === option.id ? (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{option.label}</p>
                          {selectedOption === option.id && (
                            <p className="text-xs text-muted-foreground mt-1">
                              💡 {option.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!isComplete}
              className="flex-1"
            >
              {showResults ? 'See Results' : 'Calculate My Profile'}
            </Button>
            {Object.keys(answers).length > 0 && (
              <Button
                onClick={handleReset}
                variant="outline"
              >
                Reset
              </Button>
            )}
          </div>

          {!isComplete && Object.keys(answers).length > 0 && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                Answer all {quizQuestions.length} questions to see your risk profile
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {showResults && isComplete && (
        <Card className="border-2 border-primary">
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Your Risk Profile: {profileResult.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm font-medium mb-2">Profile Description:</p>
              <p className="text-sm text-muted-foreground">{profileResult.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border-2 border-green-200 bg-green-50 p-3">
                <p className="text-xs text-green-700 font-medium">Your Score</p>
                <p className="text-3xl font-bold text-green-900">{score}/9</p>
              </div>
              <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-3">
                <p className="text-xs text-blue-700 font-medium">Suggested Return</p>
                <p className="text-3xl font-bold text-blue-900">{profileResult.recommendedReturn}%</p>
              </div>
            </div>

            <div className="rounded-lg border-2 border-indigo-200 bg-indigo-50 p-4">
              <p className="text-sm font-bold text-indigo-900 mb-2">
                Recommended Investment Mix:
              </p>
              {profileResult.profile === 'conservative' && (
                <ul className="space-y-1 text-sm text-indigo-800">
                  <li>• 70% Reksadana Pendapatan Tetap (bonds)</li>
                  <li>• 20% Reksadana Pasar Uang (money market)</li>
                  <li>• 10% Reksadana Saham (stocks)</li>
                </ul>
              )}
              {profileResult.profile === 'moderate' && (
                <ul className="space-y-1 text-sm text-indigo-800">
                  <li>• 40% Reksadana Saham (stocks)</li>
                  <li>• 30% Reksadana Campuran (balanced)</li>
                  <li>• 20% Reksadana Pendapatan Tetap (bonds)</li>
                  <li>• 10% Reksadana Pasar Uang (money market)</li>
                </ul>
              )}
              {profileResult.profile === 'aggressive' && (
                <ul className="space-y-1 text-indigo-800">
                  <li>• 60% Reksadana Saham (stocks)</li>
                  <li>• 20% Direct Stocks (individual picks)</li>
                  <li>• 10% Crypto (with caution)</li>
                  <li>• 10% Reksadana Campuran (diversification)</li>
                </ul>
              )}
            </div>

            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
              <p className="text-xs text-amber-900">
                <strong>Next Step:</strong> Use the "Calculators" tab to see how this return rate can grow your wealth over time!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
