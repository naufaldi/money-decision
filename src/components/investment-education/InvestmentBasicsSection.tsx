import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Shield, BarChart3, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export function InvestmentBasicsSection() {
  return (
    <div className="space-y-6">
      {/* What is Investing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            What is Investing?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            <strong>Investing</strong> means putting your money into assets that grow over time, such as stocks, bonds, or mutual funds (reksadana).
          </p>
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
            <p className="text-sm font-medium text-amber-900">Why Invest?</p>
            <ul className="mt-2 space-y-1 text-sm text-amber-800">
              <li>💰 Beat inflation and grow your wealth</li>
              <li>🎯 Build financial freedom for the future</li>
              <li>⏰ Let time and compound interest work for you</li>
            </ul>
          </div>
          <div className="rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm font-medium text-red-900">Inflation Reality</p>
            <p className="mt-1 text-sm text-red-800">
              At 3% inflation, {formatCurrency(1000000)} today = {formatCurrency(744000)} in 10 years.
              <br />
              <span className="font-semibold">Your money loses value if it just sits in cash!</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Concepts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Key Investment Concepts</h3>
        
        {/* Compound Interest */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Compound Interest: "The Eighth Wonder of the World"
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-green-900">
              Your money earns interest, and that interest also earns interest. Growth accelerates over time!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-lg bg-white p-3 border border-green-300">
                <p className="text-xs text-green-700 font-medium">One-time Investment</p>
                <p className="text-sm mt-1">
                  {formatCurrency(1000000)} at 7% for 10 years
                </p>
                <p className="text-lg font-bold text-green-600 mt-1">
                  = {formatCurrency(1967151)}
                </p>
              </div>
              <div className="rounded-lg bg-white p-3 border border-green-300">
                <p className="text-xs text-green-700 font-medium">With Monthly Savings</p>
                <p className="text-sm mt-1">
                  {formatCurrency(500000)}/month for 10 years at 7%
                </p>
                <p className="text-lg font-bold text-green-600 mt-1">
                  = {formatCurrency(87347000)}
                </p>
                <p className="text-xs text-green-700 mt-1">
                  (Invested {formatCurrency(61000000)}, earned {formatCurrency(26347000)})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dollar Cost Averaging */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Dollar Cost Averaging (DCA)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-blue-900">
              Invest a fixed amount regularly, regardless of market price. Reduces timing risk and builds discipline.
            </p>
            <div className="rounded-lg bg-white p-3 border border-blue-300">
              <p className="text-sm font-medium text-blue-900">Example:</p>
              <p className="text-sm mt-1">
                Invest {formatCurrency(500000)}/month for 5 years at 10% avg return
              </p>
              <div className="mt-2 flex justify-between items-center">
                <div>
                  <p className="text-xs text-blue-700">Total Invested</p>
                  <p className="font-bold text-blue-900">{formatCurrency(30000000)}</p>
                </div>
                <div className="text-center px-3">→</div>
                <div>
                  <p className="text-xs text-blue-700">Final Value</p>
                  <p className="font-bold text-green-600">{formatCurrency(38729000)}</p>
                </div>
              </div>
              <p className="text-xs text-blue-700 mt-2">
                Gain: {formatCurrency(8729000)} (29% profit)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Diversification */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              Diversification: Don't Put All Eggs in One Basket
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-purple-900">
              Spread your money across different investments to reduce risk.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded bg-red-100 border border-red-300">
                <span className="text-2xl">❌</span>
                <span className="text-sm text-red-900">100% in one stock = High risk</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-yellow-100 border border-yellow-300">
                <span className="text-2xl">⚠️</span>
                <span className="text-sm text-yellow-900">70% bonds + 30% stocks = Moderate risk</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-green-100 border border-green-300">
                <span className="text-2xl">✅</span>
                <span className="text-sm text-green-900">Reksadana = Automatic diversification</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk vs Return */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk vs Return Trade-off</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              Higher potential returns usually mean higher risk. Choose based on your goals and comfort level.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-lg bg-green-100 border border-green-300 p-3">
                <p className="text-sm font-bold text-green-900">Conservative (5%)</p>
                <p className="text-xs text-green-700 mt-1">{formatCurrency(1000000)} →</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(1630000)}</p>
                <p className="text-xs text-green-700">in 10 years</p>
              </div>
              <div className="rounded-lg bg-blue-100 border border-blue-300 p-3">
                <p className="text-sm font-bold text-blue-900">Moderate (10%)</p>
                <p className="text-xs text-blue-700 mt-1">{formatCurrency(1000000)} →</p>
                <p className="text-lg font-bold text-blue-600">{formatCurrency(2590000)}</p>
                <p className="text-xs text-blue-700">in 10 years</p>
              </div>
              <div className="rounded-lg bg-orange-100 border border-orange-300 p-3">
                <p className="text-sm font-bold text-orange-900">Aggressive (15%)</p>
                <p className="text-xs text-orange-700 mt-1">{formatCurrency(1000000)} →</p>
                <p className="text-lg font-bold text-orange-600">{formatCurrency(4050000)}</p>
                <p className="text-xs text-orange-700">in 10 years</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment by Income Level */}
      <Card className="border-indigo-200 bg-indigo-50">
        <CardHeader>
          <CardTitle className="text-base">Investment Examples by Income Level</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-3">
            <div className="rounded-lg bg-white border border-indigo-300 p-3">
              <p className="text-sm font-bold text-indigo-900">Entry-level ({formatCurrency(3000000)}/month)</p>
              <p className="text-xs text-indigo-700 mt-1">Save 10% = {formatCurrency(300000)}/month</p>
              <p className="text-sm mt-2">
                In 10 years at 7%: <span className="font-bold text-green-600">{formatCurrency(52448000)}</span>
              </p>
              <p className="text-xs text-indigo-600 mt-1">
                (Invested {formatCurrency(36000000)}, earned {formatCurrency(16448000)})
              </p>
            </div>
            <div className="rounded-lg bg-white border border-indigo-300 p-3">
              <p className="text-sm font-bold text-indigo-900">Mid-level ({formatCurrency(8000000)}/month)</p>
              <p className="text-xs text-indigo-700 mt-1">Save 15% = {formatCurrency(1200000)}/month</p>
              <p className="text-sm mt-2">
                In 10 years at 7%: <span className="font-bold text-green-600">{formatCurrency(209792000)}</span>
              </p>
              <p className="text-xs text-indigo-600 mt-1">
                (Invested {formatCurrency(144000000)}, earned {formatCurrency(65792000)})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started Checklist */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            Getting Started Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <div>
                <p className="text-sm font-medium">1. Build emergency fund first</p>
                <p className="text-xs text-muted-foreground">3-6 months of expenses in savings account</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <div>
                <p className="text-sm font-medium">2. Pay off high-interest debt</p>
                <p className="text-xs text-muted-foreground">Especially debt with {'>'}10% interest rate</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <div>
                <p className="text-sm font-medium">3. Start small</p>
                <p className="text-xs text-muted-foreground">
                  Even {formatCurrency(100000)}/month matters (= {formatCurrency(1700000)} in 1 year at 7%)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <div>
                <p className="text-sm font-medium">4. Choose low-fee investments</p>
                <p className="text-xs text-muted-foreground">Look for reksadana with {'<'}1% management fee</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
