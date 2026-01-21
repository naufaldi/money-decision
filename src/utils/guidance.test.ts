import { describe, it, expect } from 'vitest';
import {
  buildGuidanceContext,
  getGuidanceForStep,
  getEmergencyNodes,
  INCOME_GUIDANCE_NODES,
  EXPENSES_GUIDANCE_NODES,
  RULES_GUIDANCE_NODES,
  RESULTS_GUIDANCE_NODES,
  SANDWICH_GUIDANCE_NODES,
} from '@/data/guidance';
import { GuidanceContext } from '@/types/guidance';

describe('Guidance System', () => {
  describe('buildGuidanceContext', () => {
    it('should build context with basic income data', () => {
      const context = buildGuidanceContext({
        income: 5000000,
        incomeType: 'fixed',
        expenses: 3000000,
        expensesByCategory: { housing: 1500000, food: 800000 },
        selectedRule: '60-30-10',
        province: 'DKI JAKARTA',
        hasDebt: false,
        debtAmount: null,
        debtInterest: null,
        debtType: null,
        debtPaymentMonthly: null,
        riskProfile: 'moderate',
        hasElderlyParents: false,
        hasOtherFamily: false,
        familySupportAmount: null,
        hasPinjolDebt: false,
        pinjolDebtAmount: null,
        pinjolDebtInterest: null,
        pinjolCount: 0,
      });

      expect(context.income).toBe(5000000);
      expect(context.expenses).toBe(3000000);
      expect(context.province).toBe('DKI JAKARTA');
      expect(context.riskProfile).toBe('moderate');
      expect(context.isSandwichGeneration).toBe(false);
    });

    it('should detect sandwich generation when supporting parents', () => {
      const context = buildGuidanceContext({
        income: 8000000,
        incomeType: 'fixed',
        expenses: 5000000,
        expensesByCategory: {},
        selectedRule: '50-30-20',
        province: 'JAWA BARAT',
        hasDebt: false,
        debtAmount: null,
        debtInterest: null,
        debtType: null,
        debtPaymentMonthly: null,
        riskProfile: 'moderate',
        hasElderlyParents: true,
        hasOtherFamily: false,
        familySupportAmount: 1000000,
        hasPinjolDebt: false,
        pinjolDebtAmount: null,
        pinjolDebtInterest: null,
        pinjolCount: 0,
      });

      expect(context.isSandwichGeneration).toBe(true);
      expect(context.hasElderlyParents).toBe(true);
      expect(context.familySupportAmount).toBe(1000000);
      expect(context.discretionaryIncome).toBe(7000000);
    });

    it('should detect pinjol debt and set emergency context', () => {
      const context = buildGuidanceContext({
        income: 6000000,
        incomeType: 'mixed',
        expenses: 4500000,
        expensesByCategory: {},
        selectedRule: '60-30-10',
        province: 'SUMATERA UTARA',
        hasDebt: true,
        debtAmount: 5000000,
        debtInterest: 5,
        debtType: 'pinjol',
        debtPaymentMonthly: 500000,
        riskProfile: 'conservative',
        hasElderlyParents: false,
        hasOtherFamily: false,
        familySupportAmount: null,
        hasPinjolDebt: true,
        pinjolDebtAmount: 5000000,
        pinjolDebtInterest: 5,
        pinjolCount: 2,
      });

      expect(context.hasPinjolDebt).toBe(true);
      expect(context.pinjolDebtAmount).toBe(5000000);
      expect(context.pinjolDebtInterest).toBe(5);
      expect(context.pinjolCount).toBe(2);
      expect(context.isSandwichGeneration).toBe(false);
    });

    it('should calculate savings rate correctly', () => {
      const context = buildGuidanceContext({
        income: 10000000,
        incomeType: 'fixed',
        expenses: 7000000,
        expensesByCategory: {},
        selectedRule: '50-30-20',
        province: 'BALI',
        hasDebt: false,
        debtAmount: null,
        debtInterest: null,
        debtType: null,
        debtPaymentMonthly: null,
        riskProfile: 'moderate',
        hasElderlyParents: false,
        hasOtherFamily: false,
        familySupportAmount: null,
        hasPinjolDebt: false,
        pinjolDebtAmount: null,
        pinjolDebtInterest: null,
        pinjolCount: 0,
      });

      expect(context.savingsRate).toBeCloseTo(0.3, 5);
    });

    it('should calculate debt to income ratio', () => {
      const context = buildGuidanceContext({
        income: 8000000,
        incomeType: 'fixed',
        expenses: 5000000,
        expensesByCategory: {},
        selectedRule: '60-30-10',
        province: 'SULAWESI SELATAN',
        hasDebt: true,
        debtAmount: 20000000,
        debtInterest: 12,
        debtType: 'personal',
        debtPaymentMonthly: 800000,
        riskProfile: 'moderate',
        hasElderlyParents: false,
        hasOtherFamily: false,
        familySupportAmount: null,
        hasPinjolDebt: false,
        pinjolDebtAmount: null,
        pinjolDebtInterest: null,
        pinjolCount: 0,
      });

      expect(context.debtToIncomeRatio).toBe(0.1);
    });
  });

  describe('Guidance Nodes', () => {
    it('should have income guidance nodes', () => {
      expect(INCOME_GUIDANCE_NODES.length).toBeGreaterThan(0);
    });

    it('should have expenses guidance nodes', () => {
      expect(EXPENSES_GUIDANCE_NODES.length).toBeGreaterThan(0);
    });

    it('should have rules guidance nodes', () => {
      expect(RULES_GUIDANCE_NODES.length).toBeGreaterThan(0);
    });

    it('should have results guidance nodes', () => {
      expect(RESULTS_GUIDANCE_NODES.length).toBeGreaterThan(0);
    });

    it('should have sandwich generation guidance nodes', () => {
      expect(SANDWICH_GUIDANCE_NODES.length).toBeGreaterThan(0);
    });
  });

  describe('getGuidanceForStep', () => {
    it('should return relevant guidance for step 1', () => {
      const context: GuidanceContext = {
        income: 5000000,
        incomeType: 'fixed',
        expenses: null,
        expensesByCategory: {},
        selectedRule: '60-30-10',
        province: 'DKI JAKARTA',
        hasDebt: false,
        debtAmount: null,
        debtInterest: null,
        debtType: null,
        debtPaymentMonthly: null,
        savingsRate: null,
        emergencyFundMonths: null,
        riskProfile: 'moderate',
        investmentExperience: 'beginner',
        isSandwichGeneration: false,
        hasElderlyParents: false,
        hasOtherFamily: false,
        familySupportAmount: null,
        dependentsCount: 0,
        hasPinjolDebt: false,
        pinjolDebtAmount: null,
        pinjolDebtInterest: null,
        pinjolCount: 0,
        discretionaryIncome: null,
        savingsGap: null,
        debtToIncomeRatio: null,
      };

      const step1Guidance = getGuidanceForStep(1, context);
      expect(step1Guidance.length).toBeGreaterThan(0);
    });
  });

  describe('getEmergencyNodes', () => {
    it('should detect pinjol debt as emergency', () => {
      const context: GuidanceContext = {
        income: 5000000,
        incomeType: 'fixed',
        expenses: 3000000,
        expensesByCategory: {},
        selectedRule: '60-30-10',
        province: 'DKI JAKARTA',
        hasDebt: true,
        debtAmount: 5000000,
        debtInterest: 5,
        debtType: 'pinjol',
        debtPaymentMonthly: 500000,
        savingsRate: 0.4,
        emergencyFundMonths: 2,
        riskProfile: 'moderate',
        investmentExperience: 'beginner',
        isSandwichGeneration: false,
        hasElderlyParents: false,
        hasOtherFamily: false,
        familySupportAmount: null,
        dependentsCount: 0,
        hasPinjolDebt: true,
        pinjolDebtAmount: 5000000,
        pinjolDebtInterest: 5,
        pinjolCount: 1,
        discretionaryIncome: null,
        savingsGap: null,
        debtToIncomeRatio: null,
      };

      const emergencyNodes = getEmergencyNodes(context);
      const hasPinjolEmergency = emergencyNodes.some(
        (node) => node.category === 'pinjol'
      );
      expect(hasPinjolEmergency).toBe(true);
    });
  });
});

describe('Sandwich Generation Scenarios', () => {
  it('should identify double sandwich burden (both parents and siblings)', () => {
    const context = buildGuidanceContext({
      income: 10000000,
      incomeType: 'fixed',
      expenses: 7000000,
      expensesByCategory: {},
      selectedRule: '60-30-10',
      province: 'JAWA TIMUR',
      hasDebt: false,
      debtAmount: null,
      debtInterest: null,
      debtType: null,
      debtPaymentMonthly: null,
      riskProfile: 'moderate',
      hasElderlyParents: true,
      hasOtherFamily: true,
      familySupportAmount: 2000000,
      hasPinjolDebt: false,
      pinjolDebtAmount: null,
      pinjolDebtInterest: null,
      pinjolCount: 0,
    });

    expect(context.isSandwichGeneration).toBe(true);
    expect(context.hasElderlyParents).toBe(true);
    expect(context.hasOtherFamily).toBe(true);
    expect(context.dependentsCount).toBe(2);
  });

  it('should calculate correct discretionary income after family support', () => {
    const context = buildGuidanceContext({
      income: 8000000,
      incomeType: 'fixed',
      expenses: 5000000,
      expensesByCategory: {},
      selectedRule: '70-20-10',
      province: 'KALIMANTAN TIMUR',
      hasDebt: false,
      debtAmount: null,
      debtInterest: null,
      debtType: null,
      debtPaymentMonthly: null,
      riskProfile: 'conservative',
      hasElderlyParents: true,
      hasOtherFamily: false,
      familySupportAmount: 1500000,
      hasPinjolDebt: false,
      pinjolDebtAmount: null,
      pinjolDebtInterest: null,
      pinjolCount: 0,
    });

    expect(context.discretionaryIncome).toBe(6500000);
    expect(context.familySupportAmount).toBe(1500000);
  });
});

describe('Guidance Node Priority', () => {
  it('should have emergency nodes with priority 1', () => {
    const emergencyNodes = SANDWICH_GUIDANCE_NODES.filter(
      (node) => node.icon === 'emergency'
    );

    emergencyNodes.forEach((node) => {
      expect(node.priority).toBe(1);
    });
  });

  it('should have check nodes with lower priority', () => {
    const checkNodes = SANDWICH_GUIDANCE_NODES.filter(
      (node) => node.icon === 'check'
    );

    checkNodes.forEach((node) => {
      expect(node.priority).toBeGreaterThanOrEqual(4);
    });
  });
});
