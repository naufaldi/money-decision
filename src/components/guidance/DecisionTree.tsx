import { useMemo } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight,
  AlertOctagon,
  Lightbulb,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  GuidanceNode,
  GuidanceContext,
  GuidanceIconType,
  GuidancePriority,
} from '@/types/guidance';

interface DecisionTreeProps {
  nodes: GuidanceNode[];
  context: GuidanceContext;
  title?: string;
  emptyMessage?: string;
  maxDisplay?: number;
  showCategories?: boolean;
}

const iconMap: Record<GuidanceIconType, typeof CheckCircle2> = {
  check: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
  action: ArrowRight,
  emergency: AlertOctagon,
};

const iconColorMap: Record<GuidanceIconType, string> = {
  check: 'text-green-500',
  warning: 'text-amber-500',
  info: 'text-blue-500',
  action: 'text-indigo-500',
  emergency: 'text-red-500',
};

const bgColorMap: Record<GuidanceIconType, string> = {
  check: 'bg-green-50 border-green-200',
  warning: 'bg-amber-50 border-amber-200',
  info: 'bg-blue-50 border-blue-200',
  action: 'bg-indigo-50 border-indigo-200',
  emergency: 'bg-red-50 border-red-200',
};

const priorityOrder: Record<GuidancePriority, number> = {
  1: 5,
  2: 4,
  3: 3,
  4: 2,
  5: 1,
};

function sortNodesByPriority(nodes: GuidanceNode[]): GuidanceNode[] {
  return [...nodes].sort((a, b) => {
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return a.id.localeCompare(b.id);
  });
}

function filterMatchingNodes(
  nodes: GuidanceNode[],
  context: GuidanceContext
): GuidanceNode[] {
  return nodes.filter((node) => {
    try {
      return node.condition(context);
    } catch {
      return false;
    }
  });
}

function getCategoryLabel(category?: string): string {
  const labels: Record<string, string> = {
    income: 'Income',
    expenses: 'Expenses',
    savings: 'Savings',
    investments: 'Investments',
    debt: 'Debt',
    sandwich: 'Sandwich Generation',
    pinjol: 'Pinjol Debt',
    'emergency-fund': 'Emergency Fund',
    'budget-rules': 'Budget Rules',
  };
  return category ? labels[category] || category : '';
}

function renderContent(
  content: React.ReactNode | ((context: GuidanceContext) => ReactNode),
  context: GuidanceContext
): React.ReactNode {
  const resolvedContent =
    typeof content === 'function' ? content(context) : content;

  if (typeof resolvedContent === 'string') {
    return resolvedContent.split('\n').map((line, index) => {
      if (line.trim().startsWith('- ')) {
        return (
          <li key={index} className="ml-4 list-disc">
            {line.substring(2)}
          </li>
        );
      }
      if (line.trim().startsWith('**') && line.includes(':**')) {
        const [bold, rest] = line.split(':**');
        return (
          <p key={index} className="mt-2 font-semibold">
            {bold.replace(/\*\*/g, '')}:{rest && <span className="font-normal"> {rest}</span>}
          </p>
        );
      }
      if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
        return (
          <p key={index} className="mt-2 font-semibold">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      }
      if (line.trim().match(/^\d+\./)) {
        return (
          <p key={index} className="mt-1 ml-4">
            {line}
          </p>
        );
      }
      return <p key={index}>{line}</p>;
    });
  }
  return resolvedContent;
}

export function DecisionTree({
  nodes,
  context,
  title = 'Best Practice Guidance',
  emptyMessage = 'No specific guidance available for your current inputs.',
  maxDisplay,
  showCategories = false,
}: DecisionTreeProps) {
  const matchingNodes = useMemo(
    () => filterMatchingNodes(nodes, context),
    [nodes, context]
  );

  const sortedNodes = useMemo(
    () => sortNodesByPriority(matchingNodes),
    [matchingNodes]
  );

  const displayNodes = useMemo(
    () => (maxDisplay ? sortedNodes.slice(0, maxDisplay) : sortedNodes),
    [sortedNodes, maxDisplay]
  );

  if (nodes.length === 0) {
    return null;
  }

  return (
    <div className="decision-tree space-y-4" role="region" aria-label={title}>
      {title && (
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" aria-hidden="true" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}

      {displayNodes.length === 0 ? (
        <p className="text-muted-foreground text-sm">{emptyMessage}</p>
      ) : (
        <div className="space-y-3">
          {displayNodes.map((node) => {
            const Icon = iconMap[node.icon];
            const iconColor = iconColorMap[node.icon];
            const bgClass = bgColorMap[node.icon];

            return (
              <Card
                key={node.id}
                className={`${bgClass} border transition-all duration-200 hover:shadow-md`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Icon
                      className={`h-5 w-5 mt-0.5 flex-shrink-0 ${iconColor}`}
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-sm">{node.title}</h4>
                        {node.category && showCategories && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/60 text-gray-700">
                            {getCategoryLabel(node.category)}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-sm text-gray-700 space-y-1">
                        {renderContent(node.content, context)}
                      </div>
                      {node.actions && node.actions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {node.actions.map((action, index) => (
                            <Button
                              key={index}
                              variant={action.variant === 'primary' ? 'default' : 'outline'}
                              size="sm"
                              onClick={action.onClick}
                              className="gap-1.5"
                              aria-label={`Action: ${action.label}`}
                            >
                              {action.label}
                              {action.icon === 'arrow-right' && (
                                <ArrowRight className="h-3 w-3" aria-hidden="true" />
                              )}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {sortedNodes.length > (maxDisplay || Infinity) && maxDisplay && (
        <p className="text-xs text-muted-foreground text-center">
          +{sortedNodes.length - maxDisplay} more recommendations available
        </p>
      )}
    </div>
  );
}
