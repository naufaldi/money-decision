import * as React from "react"
import { cn } from "@/lib/utils"

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (_open: boolean) => void;
  defaultOpen?: boolean;
}

interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  in?: boolean;
}

const Collapsible = ({
  open,
  onOpenChange,
  defaultOpen = false,
  className,
  children,
  ...props
}: CollapsibleProps) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpen = open ?? internalOpen;

  const handleToggle = () => {
    if (open === undefined) {
      setInternalOpen(!internalOpen);
    }
    onOpenChange?.(!isOpen);
  };

  return (
    <div className={cn("relative", className)} {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        if (child.type === CollapsibleTrigger) {
          return React.cloneElement(child as React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>, {
            onClick: handleToggle,
          });
        }
        if (child.type === CollapsibleContent) {
          return React.cloneElement(child as React.ReactElement<CollapsibleContentProps>, {
            in: isOpen,
          });
        }
        return child;
      })}
    </div>
  );
};

const CollapsibleTrigger = ({
  className,
  children,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      type="button"
      className={cn("w-full text-left", className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const CollapsibleContent = ({
  className,
  in: isOpen,
  children,
  ...props
}: CollapsibleContentProps & { children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
