import { useState, useMemo } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, Lightbulb } from 'lucide-react';
import { DecisionTree } from './DecisionTree';
import {
  GuidanceNode,
  GuidanceContext,
  GuidanceIconType,
} from '@/types/guidance';

interface GuidanceCollapsibleProps {
  title?: string;
  icon?: GuidanceIconType;
  defaultOpen?: boolean;
  autoOpenOnMatch?: boolean;
  context: GuidanceContext;
  nodes: GuidanceNode[];
  children?: React.ReactNode;
  className?: string;
}

export function GuidanceCollapsible({
  title = 'Best Practice Guidance',
  icon = 'info',
  defaultOpen = false,
  autoOpenOnMatch = true,
  context,
  nodes,
  children,
  className = '',
}: GuidanceCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const matchingNodes = useMemo(() => {
    return nodes.filter((node) => {
      try {
        return node.condition(context);
      } catch {
        return false;
      }
    });
  }, [nodes, context]);

  const hasMatches = matchingNodes.length > 0;
  const shouldAutoOpen = autoOpenOnMatch && hasMatches && !isOpen;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const iconColors: Record<string, string> = {
    check: 'text-green-500',
    warning: 'text-amber-500',
    info: 'text-blue-500',
    action: 'text-indigo-500',
    emergency: 'text-red-500',
  };

  return (
    <Collapsible
      open={isOpen || shouldAutoOpen}
      onOpenChange={handleOpenChange}
      className={`rounded-lg border border-muted bg-muted/20 ${className}`}
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/30 transition-colors rounded-t-lg">
        <div className="flex items-center gap-2">
          <Lightbulb
            className={`h-4 w-4 ${iconColors[icon] || iconColors.info}`}
            aria-hidden="true"
          />
          <span className="text-sm font-medium">{title}</span>
          {hasMatches && (
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-medium text-primary">
              {matchingNodes.length}
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen || shouldAutoOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4">
        <DecisionTree
          nodes={nodes}
          context={context}
          title=""
          emptyMessage="No specific guidance for your current situation."
        />
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
