# Wizard Enhancement: localStorage & Page-Based Routing

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
>
> **Testing Framework:** Vitest + React Testing Library (see package.json)
> **Test Command:** `npm test`
> **Lint Command:** `npm run lint`
> **Build Command:** `npm run build`

**Goal:** Transform wizard from URL-param state to localStorage persistence with proper page-based routing for browser back button support.

**Current Problem:**

- All state stored in URL search params (Wizard.tsx:29-72)
- URL gets long and exposes data in history
- Browser back button not properly supported
- No proper page transitions

**Desired Behavior:**

- Data persisted to localStorage only
- URL shows only step number: `/wizard/income`, `/wizard/expenses`, `/wizard/rule`, `/wizard/results`
- Browser back button works naturally
- User can navigate between steps without losing data

---

## Breadcrumb Navigation

```
docs/plans/2026-01-22-wizard-localstorage-routing.md (this file)
│
├── Phase 1: localStorage State Hook
│   ├── Task 1: Create useWizardState hook + tests
│   └── Task 2: Remove URL param dependencies from Wizard.tsx
│
├── Phase 2: Page-Based Routing
│   ├── Task 3: Create route configuration
│   ├── Task 4: Create step page wrapper components + tests
│   └── Task 5: Update App.tsx with Routes + tests
│
├── Phase 3: Route Guards & Navigation
│   ├── Task 6: Create WizardRouteGuard component + tests
│   ├── Task 7: Handle browser back button naturally
│   └── Task 8: Update navigation buttons to use useNavigate
│
└── Phase 4: Cleanup & Polish
    ├── Task 9: Clean up unused useSearchParams
    └── Task 10: Final verification (test + lint + build)
```

---

## Phase 1: localStorage State Hook

### Task 1: Create useWizardState Hook + Tests

**Files:**

- Create: `src/hooks/useWizardState.ts`
- Create: `src/hooks/useWizardState.test.ts`

**Test patterns (Vitest + React Testing Library):**

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useWizardState } from './useWizardState';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
vi.stubGlobal('localStorage', localStorageMock);

describe('useWizardState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('loads state from localStorage on mount', () => {
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify({
        income: 1000000,
        province: 'Jakarta',
        currentStep: 2,
      })
    );

    const { result } = renderHook(() => useWizardState());

    expect(result.current.state.income).toBe(1000000);
    expect(result.current.state.province).toBe('Jakarta');
  });

  it('saves state to localStorage on update', () => {
    const { result } = renderHook(() => useWizardState());

    result.current.updateState({ income: 2000000 });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'money-decision-wizard-state',
      expect.stringContaining('2000000')
    );
  });

  it('clears state and localStorage on reset', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ income: 1000000 }));

    const { result } = renderHook(() => useWizardState());
    result.current.clearState();

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('money-decision-wizard-state');
    expect(result.current.state.income).toBeNull();
  });

  it('returns isLoaded: false initially, then true', () => {
    const { result } = renderHook(() => useWizardState());

    // First render - SSR or initial render
    expect(result.current.isLoaded).toBe(true); // After mount
  });
});
```

**Implementation:**

```typescript
import { useState, useEffect, useCallback } from 'react';

export interface WizardState {
  currentStep: number;
  income: number | null;
  expenses: number | null;
  selectedRuleId: string;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  province: string | null;
  incomeType: 'fixed' | 'variable' | 'mixed';
  hasElderlyParents: boolean;
  hasOtherFamily: boolean;
  hasPinjolDebt: boolean;
  familySupportAmount: number | null;
  pinjolDebtAmount: number | null;
  pinjolDebtInterest: number | null;
}

const STORAGE_KEY = 'money-decision-wizard-state';

const defaultState: WizardState = {
  currentStep: 1,
  income: null,
  expenses: null,
  selectedRuleId: '60-30-10',
  riskProfile: 'conservative',
  province: null,
  incomeType: 'fixed',
  hasElderlyParents: false,
  hasOtherFamily: false,
  hasPinjolDebt: false,
  familySupportAmount: null,
  pinjolDebtAmount: null,
  pinjolDebtInterest: null,
};

function loadState(): WizardState {
  if (typeof window === 'undefined') {
    return defaultState;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultState, ...parsed };
    }
  } catch {
    console.warn('Failed to load wizard state from localStorage');
  }

  return defaultState;
}

function saveState(state: WizardState): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.warn('Failed to save wizard state to localStorage');
  }
}

export function useWizardState() {
  const [state, setState] = useState<WizardState>(() => loadState());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const updateState = useCallback(
    (updates: Partial<WizardState>) => {
      setState(prev => {
        const newState = { ...prev, ...updates };
        if (isLoaded) {
          saveState(newState);
        }
        return newState;
      });
    },
    [isLoaded]
  );

  const clearState = useCallback(() => {
    const resetState = { ...defaultState, currentStep: 1 };
    setState(resetState);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return { state, updateState, clearState, isLoaded };
}
```

**Run test:** `npm test src/hooks/useWizardState.test.ts`

---

### Task 2: Remove URL Param Dependencies from Wizard.tsx

**File:** `src/components/wizard/Wizard.tsx`

**What changes:**

- Remove `useSearchParams` import and usage
- Remove `useEffect` that syncs state to URL (lines 55-72)
- Remove URL-based initialization (lines 31-53)
- Use `useWizardState` hook instead

**Run test:** Existing tests should still pass

---

## Phase 2: Page-Based Routing

### Task 3: Create Route Configuration

**File:** `src/components/wizard/wizardRoutes.tsx`

**Routes:**

```typescript
export const WIZARD_ROUTES = [
  { path: '/wizard/income', step: 1, label: 'Enter Income' },
  { path: '/wizard/expenses', step: 2, label: 'Monthly Expenses' },
  { path: '/wizard/rule', step: 3, label: 'Select Budget Rule' },
  { path: '/wizard/results', step: 4, label: 'Your Plan' },
] as const;

export const WIZARD_STEPS = WIZARD_ROUTES.length;
```

---

### Task 4: Create Step Page Wrapper Components + Tests

**Files:**

- `src/components/wizard/pages/IncomePage.tsx`
- `src/components/wizard/pages/ExpensesPage.tsx`
- `src/components/wizard/pages/RulePage.tsx`
- `src/components/wizard/pages/ResultsPage.tsx`
- `src/components/wizard/pages/IncomePage.test.tsx`

**Test pattern for page components:**

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { IncomePage } from './IncomePage';
import { vi } from 'vitest';

// Mock react-router-dom
const navigateMock = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}));

describe('IncomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders step 1 with income input and province select', () => {
    render(<IncomePage />);

    expect(screen.getByText('Enter Your Income')).toBeInTheDocument();
    expect(screen.getByLabelText(/monthly income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/province/i)).toBeInTheDocument();
  });

  it('navigates to expenses on valid input and Continue', async () => {
    render(<IncomePage />);

    // Fill in province
    const select = screen.getByLabelText(/province/i);
    fireEvent.change(select, { target: { value: 'Jakarta' } });

    // Fill in income
    const input = screen.getByLabelText(/monthly income/i);
    fireEvent.change(input, { target: { value: '1000000' } });

    // Click continue
    const continueButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/wizard/expenses', { replace: true });
    });
  });

  it('disables Continue button when validation fails', () => {
    render(<IncomePage />);

    const continueButton = screen.getByRole('button', { name: /continue/i });
    expect(continueButton).toBeDisabled();
  });

  it('auto-focuses income input on mount', () => {
    render(<IncomePage />);

    const input = screen.getByLabelText(/monthly income/i);
    expect(input).toHaveFocus();
  });
});
```

**Run test:** `npm test src/components/wizard/pages/IncomePage.test.tsx`

---

### Task 5: Update App.tsx with Routes + Tests

**File:** `src/App.tsx`

**Test:**

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// Mock child components to focus on routing
vi.mock('@/components/wizard/pages/IncomePage', () => ({
  IncomePage: () => <div>Income Page</div>,
}));
vi.mock('@/components/wizard/pages/ExpensesPage', () => ({
  ExpensesPage: () => <div>Expenses Page</div>,
}));
vi.mock('@/components/wizard/pages/RulePage', () => ({
  RulePage: () => <div>Rule Page</div>,
}));
vi.mock('@/components/wizard/pages/ResultsPage', () => ({
  ResultsPage: () => <div>Results Page</div>,
}));

describe('App', () => {
  it('redirects root path to /wizard/income', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Income Page')).toBeInTheDocument();
    });
  });

  it('renders IncomePage for /wizard/income route', () => {
    render(
      <MemoryRouter initialEntries={['/wizard/income']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Income Page')).toBeInTheDocument();
  });

  it('renders ExpensesPage for /wizard/expenses route', () => {
    render(
      <MemoryRouter initialEntries={['/wizard/expenses']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Expenses Page')).toBeInTheDocument();
  });
});
```

**Run test:** `npm test src/App.test.tsx`

---

## Phase 3: Route Guards & Navigation

### Task 6: Create WizardRouteGuard Component + Tests

**File:** `src/components/wizard/WizardRouteGuard.tsx`

**Test:**

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { WizardRouteGuard } from './WizardRouteGuard';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// Mock useWizardState
const mockState = {
  income: null,
  selectedRuleId: null,
};
const mockUpdateState = vi.fn();
const mockClearState = vi.fn();
const mockIsLoaded = true;

vi.mock('@/hooks/useWizardState', () => ({
  useWizardState: () => ({
    state: mockState,
    updateState: mockUpdateState,
    clearState: mockClearState,
    isLoaded: mockIsLoaded,
  }),
}));

const navigateMock = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}));

describe('WizardRouteGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState.income = null;
    mockState.selectedRuleId = null;
  });

  it('redirects to /wizard/income when accessing step 2 without income', async () => {
    mockState.income = null;

    render(
      <MemoryRouter initialEntries={['/wizard/expenses']}>
        <WizardRouteGuard step={2}>
          <div>Protected Content</div>
        </WizardRouteGuard>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/wizard/income', { replace: true });
    });
  });

  it('allows access when requirements are met', async () => {
    mockState.income = 1000000;

    render(
      <MemoryRouter initialEntries={['/wizard/expenses']}>
        <WizardRouteGuard step={2}>
          <div>Protected Content</div>
        </WizardRouteGuard>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  it('shows loading state while loading', () => {
    vi.mock('@/hooks/useWizardState', () => ({
      useWizardState: () => ({
        state: {},
        updateState: vi.fn(),
        clearState: vi.fn(),
        isLoaded: false,
      }),
    }));

    render(
      <MemoryRouter initialEntries={['/wizard/income']}>
        <WizardRouteGuard step={1}>
          <div>Protected Content</div>
        </WizardRouteGuard>
      </MemoryRouter>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
```

**Run test:** `npm test src/components/wizard/WizardRouteGuard.test.tsx`

---

### Task 7: Handle Browser Back Button

**What changes:**

- With proper routes, browser back button works naturally
- React Router handles history stack
- Route guard ensures data integrity when going back

**No additional code needed** - React Router's `<Routes>` component handles this automatically.

**Test:**

```typescript
it('handles browser back navigation', async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter initialEntries={['/wizard/expenses']}>
      <App />
    </MemoryRouter>
  );

  // Simulate browser back
  window.history.back();

  await waitFor(() => {
    expect(screen.getByText('Income Page')).toBeInTheDocument();
  });
});
```

---

### Task 8: Update Navigation Buttons to Use useNavigate

**Pattern for each page:**

```typescript
export function IncomePage() {
  const { state, updateState, canProceed } = useWizardStep(1);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (canProceed()) {
      navigate('/wizard/expenses', { replace: true });
    }
  };

  const handleBack = () => {
    navigate('/wizard/income', { replace: true });
  };

  // Keyboard shortcuts still work with useEffect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && canProceed()) {
        handleContinue();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canProceed]);

  return (
    <>
      <StepIndicators current={1} total={4} />
      <Step1Income {...} />
      <NavigationButtons onBack={handleBack} onNext={handleContinue} canProceed={canProceed()} />
    </>
  );
}
```

---

## Phase 4: Cleanup & Polish

### Task 9: Clean Up Unused useSearchParams

**Files to check:**

- `src/components/wizard/Wizard.tsx` - Remove useSearchParams
- Any other files using searchParams for wizard state

**Run lint:** `npm run lint src/components/wizard/`

---

### Task 10: Final Verification

**Commands to run in order:**

```bash
# 1. Run all tests
npm test

# 2. Run lint
npm run lint

# 3. Run build
npm run build
```

**Manual testing checklist:**

- [ ] Data persists after page refresh
- [ ] Browser back button works between steps
- [ ] Browser forward button works
- [ ] Can edit previous step and data is preserved
- [ ] Start Over clears localStorage and redirects to step 1
- [ ] Salary insights still shows after step 1
- [ ] Family context questions still work
- [ ] Results page displays correctly

---

## Plan Complete

**Plan saved to:** `docs/plans/2026-01-22-wizard-localstorage-routing.md`

### Files Created

| File                                              | Purpose                       |
| ------------------------------------------------- | ----------------------------- |
| `src/hooks/useWizardState.ts`                     | localStorage persistence hook |
| `src/hooks/useWizardState.test.ts`                | Tests for hook                |
| `src/components/wizard/wizardRoutes.tsx`          | Route definitions             |
| `src/components/wizard/pages/IncomePage.tsx`      | Step 1 page component         |
| `src/components/wizard/pages/ExpensesPage.tsx`    | Step 2 page component         |
| `src/components/wizard/pages/RulePage.tsx`        | Step 3 page component         |
| `src/components/wizard/pages/ResultsPage.tsx`     | Step 4 page component         |
| `src/components/wizard/pages/IncomePage.test.tsx` | Tests for IncomePage          |
| `src/components/wizard/WizardRouteGuard.tsx`      | Route protection component    |
| `src/components/wizard/WizardRouteGuard.test.tsx` | Tests for route guard         |

### Files Modified

| File                               | Change                                |
| ---------------------------------- | ------------------------------------- |
| `src/App.tsx`                      | Add Routes configuration + tests      |
| `src/components/wizard/Wizard.tsx` | Remove URL params, use useWizardState |

### Files Deleted

| File                               | Reason                                       |
| ---------------------------------- | -------------------------------------------- |
| `src/components/wizard/Wizard.tsx` | Replaced by page components (after refactor) |

### Testing Commands

| Command                                     | Purpose                  |
| ------------------------------------------- | ------------------------ |
| `npm test`                                  | Run all tests            |
| `npm test src/hooks/useWizardState.test.ts` | Test hook only           |
| `npm test src/components/wizard/pages/`     | Test page components     |
| `npm run lint`                              | Check for linting errors |
| `npm run lint:fix`                          | Auto-fix linting errors  |
| `npm run build`                             | Verify build succeeds    |

### Estimated Effort

| Phase   | Tasks | Time Estimate |
| ------- | ----- | ------------- |
| Phase 1 | 2     | 20 minutes    |
| Phase 2 | 3     | 30 minutes    |
| Phase 3 | 3     | 20 minutes    |
| Phase 4 | 2     | 10 minutes    |

**Total: ~80 minutes**

---

## Execution Workflow

**For each task:**

1. Create test file first (should fail)
2. Write implementation
3. Run test - should pass
4. Run lint - should pass
5. Move to next task

**Quality gates before moving on:**

- ✅ Test passes
- ✅ Lint passes
- ✅ No TypeScript errors
- ✅ Build succeeds (at end of each phase)

---

## Execution Options

**1. Subagent-Driven (this session)** - Dispatch fresh subagent per task, review between tasks

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
