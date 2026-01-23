import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Shield, AlertTriangle, Info } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { investmentProducts, getReksadanaProducts, getSBNRitelProducts } from '@/data/investmentProducts';
import { cn } from '@/lib/utils';

const riskColorMap = {
  'very-low': 'bg-green-100 text-green-700 border-green-300',
  'low': 'bg-green-100 text-green-700 border-green-300',
  'medium': 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'high': 'bg-orange-100 text-orange-700 border-orange-300',
  'very-high': 'bg-red-100 text-red-700 border-red-300',
};

export function IndonesianProductsSection() {
  const reksadanaProducts = getReksadanaProducts();
  const sbnProducts = getSBNRitelProducts();
  const otherProducts = investmentProducts.filter(
    p => p.category !== 'reksadana' && p.category !== 'sbn-ritel'
  );

  return (
    <div className="space-y-6">
      {/* Reksadana Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Reksadana (Mutual Funds)</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Professionally managed portfolios with automatic diversification. Perfect for beginners!
        </p>

        <div className="grid gap-4">
          {reksadanaProducts.map(product => (
            <Card key={product.id} className="border-2 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{product.description}</p>
                  </div>
                  <div className={cn('px-2 py-1 rounded text-xs font-medium border', riskColorMap[product.risk])}>
                    {product.risk.replace('-', ' ')} risk
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-xs text-muted-foreground">Expected Return</p>
                    <p className="text-sm font-bold">{product.returnRange}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-xs text-muted-foreground">Min. Investment</p>
                    <p className="text-sm font-bold">{formatCurrency(product.minInvestment)}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                  <p className="text-xs font-medium text-blue-900">Example:</p>
                  <p className="text-sm text-blue-800 mt-1">{product.example}</p>
                </div>

                {product.realProduct && (
                  <div className="rounded-lg bg-green-50 border border-green-200 p-2">
                    <p className="text-xs text-green-800">
                      <Info className="h-3 w-3 inline mr-1" />
                      Real product: {product.realProduct}
                    </p>
                  </div>
                )}

                {product.warning && (
                  <div className="rounded-lg bg-orange-50 border border-orange-200 p-2 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-orange-800">{product.warning}</p>
                  </div>
                )}

                <div className="pt-2 border-t">
                  <p className="text-xs font-medium text-muted-foreground">Best for:</p>
                  <p className="text-sm mt-1">{product.bestFor}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* SBN Ritel Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold">SBN Ritel (Government Bonds)</h3>
        </div>
        <div className="rounded-lg bg-green-50 border border-green-200 p-3">
          <p className="text-sm font-bold text-green-900">100% Government Guaranteed</p>
          <p className="text-xs text-green-700 mt-1">
            Backed by the Republic of Indonesia. Ultra-safe option for conservative investors.
          </p>
        </div>

        <div className="grid gap-4">
          {sbnProducts.map(product => (
            <Card key={product.id} className="border-2 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{product.description}</p>
                  </div>
                  <div className={cn('px-2 py-1 rounded text-xs font-medium border', riskColorMap[product.risk])}>
                    {product.risk.replace('-', ' ')} risk
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-xs text-muted-foreground">Expected Return</p>
                    <p className="text-sm font-bold">{product.returnRange}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-xs text-muted-foreground">Min. Investment</p>
                    <p className="text-sm font-bold">{formatCurrency(product.minInvestment)}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                  <p className="text-xs font-medium text-blue-900">Example:</p>
                  <p className="text-sm text-blue-800 mt-1">{product.example}</p>
                </div>

                {product.guarantee && (
                  <div className="rounded-lg bg-green-100 border border-green-300 p-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <p className="text-xs font-medium text-green-800">{product.guarantee}</p>
                  </div>
                )}

                <div className="pt-2 border-t">
                  <p className="text-xs font-medium text-muted-foreground">Best for:</p>
                  <p className="text-sm mt-1">{product.bestFor}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Other Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Other Investment Options</h3>

        <div className="grid gap-4">
          {otherProducts.map(product => (
            <Card key={product.id} className="border-2 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{product.description}</p>
                  </div>
                  <div className={cn('px-2 py-1 rounded text-xs font-medium border', riskColorMap[product.risk])}>
                    {product.risk.replace('-', ' ')} risk
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-xs text-muted-foreground">Expected Return</p>
                    <p className="text-sm font-bold">{product.returnRange}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-xs text-muted-foreground">Min. Investment</p>
                    <p className="text-sm font-bold">{formatCurrency(product.minInvestment)}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                  <p className="text-xs font-medium text-blue-900">Example:</p>
                  <p className="text-sm text-blue-800 mt-1">{product.example}</p>
                </div>

                {product.warning && (
                  <div className="rounded-lg bg-orange-50 border border-orange-200 p-3 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-orange-800">{product.warning}</p>
                  </div>
                )}

                {product.guarantee && (
                  <div className="rounded-lg bg-green-100 border border-green-300 p-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <p className="text-xs font-medium text-green-800">{product.guarantee}</p>
                  </div>
                )}

                <div className="pt-2 border-t">
                  <p className="text-xs font-medium text-muted-foreground">Best for:</p>
                  <p className="text-sm mt-1">{product.bestFor}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Product Comparison Example */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-base">Product Comparison Example</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-purple-900 mb-3">
            Scenario: Invest {formatCurrency(1000000)}/month for 10 years
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 rounded bg-white border">
              <span className="text-sm">Pasar Uang (5%)</span>
              <div className="text-right">
                <p className="text-sm font-bold">{formatCurrency(155000000)}</p>
                <p className="text-xs text-green-600">Gain: {formatCurrency(35000000)}</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-white border">
              <span className="text-sm">Pendapatan Tetap (7%)</span>
              <div className="text-right">
                <p className="text-sm font-bold">{formatCurrency(174000000)}</p>
                <p className="text-xs text-green-600">Gain: {formatCurrency(54000000)}</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-white border">
              <span className="text-sm">Campuran (10%)</span>
              <div className="text-right">
                <p className="text-sm font-bold">{formatCurrency(206000000)}</p>
                <p className="text-xs text-green-600">Gain: {formatCurrency(86000000)}</p>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 rounded bg-white border">
              <span className="text-sm">Saham (12%)</span>
              <div className="text-right">
                <p className="text-sm font-bold">{formatCurrency(230000000)}</p>
                <p className="text-xs text-green-600">Gain: {formatCurrency(110000000)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
