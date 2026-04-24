import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MythCard } from '../MythCard';
import { useAppStore } from '@/store/useAppStore';

// Mock do store
vi.mock('@/store/useAppStore', () => ({
  useAppStore: vi.fn(),
}));

const mockMyth = {
  id: '1',
  title: 'O Popular',
  description: 'Se eu for simpático, todos serão meus amigos.',
  truth: 'Perdemos nosso verdadeiro eu.',
  endGame: 'O jogo acaba quando percebem o vazio.',
  icon: <span data-testid="myth-icon">🌟</span>,
};

describe('MythCard', () => {
  it('renders correctly initially', () => {
    // @ts-expect-error: mocking useAppStore for vitest tests
    useAppStore.mockReturnValue(vi.fn());

    render(<MythCard myth={mockMyth} />);

    expect(screen.getByText('O Popular')).toBeInTheDocument();
    expect(screen.getByText(/Se eu for simpático/)).toBeInTheDocument();
    expect(screen.queryByText('A Verdade Oculta')).not.toBeInTheDocument();
  });

  it('expands and reveals myth on click', () => {
    const mockRevealMyth = vi.fn();
    // @ts-expect-error: mocking useAppStore for vitest tests
    useAppStore.mockReturnValue(mockRevealMyth);

    render(<MythCard myth={mockMyth} />);

    const card = screen.getByText('O Popular').closest('div');
    if (!card) throw new Error('Card not found');

    fireEvent.click(card);

    expect(screen.getByText('A Verdade Oculta')).toBeInTheDocument();
    expect(screen.getByText('Perdemos nosso verdadeiro eu.')).toBeInTheDocument();
    expect(mockRevealMyth).toHaveBeenCalledWith('1');
  });
});
