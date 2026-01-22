import { renderHook, act } from '@testing-library/react';
import { useWizardState, useWizardStep } from './useWizardState';
import { describe, it, expect, beforeEach, vi } from 'vitest';

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
    expect(result.current.state.currentStep).toBe(2);
  });

  it('returns default state when no localStorage data', () => {
    const { result } = renderHook(() => useWizardState());

    expect(result.current.state.income).toBeNull();
    expect(result.current.state.selectedRuleId).toBe('60-30-10');
    expect(result.current.state.riskProfile).toBe('conservative');
  });

  it('saves state to localStorage on update', () => {
    const { result } = renderHook(() => useWizardState());

    act(() => {
      result.current.updateState({ income: 2000000 });
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'money-decision-wizard-state',
      expect.stringContaining('2000000')
    );
  });

  it('clears state and localStorage on reset', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ income: 1000000 }));

    const { result } = renderHook(() => useWizardState());

    act(() => {
      result.current.clearState();
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('money-decision-wizard-state');
    expect(result.current.state.income).toBeNull();
    expect(result.current.state.currentStep).toBe(1);
  });

  it('handles localStorage parse error gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');

    const { result } = renderHook(() => useWizardState());

    expect(result.current.state.income).toBeNull();
  });

  it('handles localStorage setItem error gracefully', () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Quota exceeded');
    });

    const { result } = renderHook(() => useWizardState());

    expect(() =>
      act(() => {
        result.current.updateState({ income: 5000000 });
      })
    ).not.toThrow();
  });

  it('updates multiple fields at once', () => {
    const { result } = renderHook(() => useWizardState());

    act(() => {
      result.current.updateState({
        income: 5000000,
        province: 'Bali',
        expenses: 2000000,
      });
    });

    expect(result.current.state.income).toBe(5000000);
    expect(result.current.state.province).toBe('Bali');
    expect(result.current.state.expenses).toBe(2000000);
  });
});

describe('useWizardStep', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('canProceed returns false for step 1 without income', () => {
    const { result } = renderHook(() => useWizardStep(1));

    expect(result.current.canProceed()).toBe(false);
  });

  it('canProceed returns false for step 1 with income but no province', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ income: 1000000 }));

    const { result } = renderHook(() => useWizardStep(1));

    expect(result.current.canProceed()).toBe(false);
  });

  it('canProceed returns true for step 1 with valid income and province', () => {
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify({ income: 1000000, province: 'Jakarta' })
    );

    const { result } = renderHook(() => useWizardStep(1));

    expect(result.current.canProceed()).toBe(true);
  });

  it('canProceed returns true for step 2 always (optional)', () => {
    const { result } = renderHook(() => useWizardStep(2));

    expect(result.current.canProceed()).toBe(true);
  });

  it('canProceed returns true for step 3 by default (60-30-10 rule)', () => {
    const { result } = renderHook(() => useWizardStep(3));

    expect(result.current.canProceed()).toBe(true);
  });

  it('canProceed returns true for step 3 with rule selected', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ selectedRuleId: '60-30-10' }));

    const { result } = renderHook(() => useWizardStep(3));

    expect(result.current.canProceed()).toBe(true);
  });

  it('isStepValid returns same as canProceed', () => {
    const { result } = renderHook(() => useWizardStep(1));

    expect(result.current.isStepValid()).toBe(result.current.canProceed());
  });

  it('updateState updates wizard state', () => {
    const { result } = renderHook(() => useWizardStep(1));

    act(() => {
      result.current.updateState({ income: 5000000 });
    });

    expect(result.current.state.income).toBe(5000000);
  });

  it('clearState resets wizard state', () => {
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify({ income: 1000000, province: 'Jakarta' })
    );

    const { result } = renderHook(() => useWizardStep(1));

    act(() => {
      result.current.clearState();
    });

    expect(result.current.state.income).toBeNull();
  });

  it('canProceed returns true for step 4 always (results)', () => {
    const { result } = renderHook(() => useWizardStep(4));

    expect(result.current.canProceed()).toBe(true);
  });

  it('preserves other state fields when updating one field', () => {
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify({
        income: 1000000,
        province: 'Jakarta',
        selectedRuleId: '50-30-20',
      })
    );

    const { result } = renderHook(() => useWizardStep(1));

    act(() => {
      result.current.updateState({ income: 2000000 });
    });

    expect(result.current.state.income).toBe(2000000);
    expect(result.current.state.province).toBe('Jakarta');
    expect(result.current.state.selectedRuleId).toBe('50-30-20');
  });
});
