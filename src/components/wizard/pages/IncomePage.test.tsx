import { render, screen, fireEvent, act } from '@testing-library/react';
import { IncomePage } from './IncomePage';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async importOriginal => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

vi.stubGlobal('localStorage', localStorageMock);

describe('IncomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('renders step 1 with income input and province select', () => {
    render(
      <MemoryRouter>
        <IncomePage />
      </MemoryRouter>
    );

    expect(screen.getByText('Enter Your Income')).toBeInTheDocument();
    expect(screen.getByLabelText(/monthly income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/province/i)).toBeInTheDocument();
  });

  it('disables Continue button when validation fails', () => {
    render(
      <MemoryRouter>
        <IncomePage />
      </MemoryRouter>
    );

    const continueButton = screen.getByRole('button', { name: /continue/i });
    expect(continueButton).toBeDisabled();
  });

  it('shows Back button even on step 1', () => {
    render(
      <MemoryRouter>
        <IncomePage />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('navigates back when Back button is clicked', () => {
    render(
      <MemoryRouter>
        <IncomePage />
      </MemoryRouter>
    );

    const backButton = screen.getByRole('button', { name: /back/i });
    act(() => {
      fireEvent.click(backButton);
    });

    expect(navigateMock).toHaveBeenCalledWith('/wizard/income', { replace: true });
  });

  it('does not show SalaryInsights when income or province is missing', () => {
    render(
      <MemoryRouter>
        <IncomePage />
      </MemoryRouter>
    );

    expect(screen.queryByText(/your income is top/i)).not.toBeInTheDocument();
  });

  it('enables Continue button when province is selected but income is 0', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ province: 'Jakarta', income: 0 }));

    render(
      <MemoryRouter>
        <IncomePage />
      </MemoryRouter>
    );

    const continueButton = screen.getByRole('button', { name: /continue/i });
    expect(continueButton).toBeDisabled();
  });

  it('enables Continue button when valid data is in localStorage', () => {
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify({ income: 10000000, province: 'Jakarta' })
    );

    render(
      <MemoryRouter>
        <IncomePage />
      </MemoryRouter>
    );

    const continueButton = screen.getByRole('button', { name: /continue/i });
    expect(continueButton).toBeEnabled();
  });
});
