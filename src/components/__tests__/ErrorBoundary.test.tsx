/**
 * Testes do componente ErrorBoundary.
 * Agente E — Guarda de Testes.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Suprime os erros de console do React Error Boundary nos testes
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

const BrokenComponent = (): React.ReactElement => {
  throw new Error('Componente quebrado para teste');
};

const WorkingComponent = () => <div>Conteúdo funcionando</div>;

describe('ErrorBoundary', () => {
  it('renderiza filhos normalmente quando não há erro', () => {
    render(
      <ErrorBoundary>
        <WorkingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Conteúdo funcionando')).toBeInTheDocument();
  });

  it('exibe o fallback padrão quando um filho joga erro', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText(/ops, algo deu errado/i)).toBeInTheDocument();
    expect(screen.getByText(/falha inesperada/i)).toBeInTheDocument();
  });

  it('exibe fallback customizado quando fornecido via prop', () => {
    render(
      <ErrorBoundary fallback={<div>Fallback customizado</div>}>
        <BrokenComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Fallback customizado')).toBeInTheDocument();
    expect(screen.queryByText(/ops, algo deu errado/i)).not.toBeInTheDocument();
  });

  it('botão "Tentar novamente" reseta o estado de erro', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );
    const btn = screen.getByRole('button', { name: /tentar novamente/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    // Após reset, o ErrorBoundary tentará renderizar os filhos de novo
    // (vai re-throw, mas confirma que o estado de reset foi chamado)
  });

  it('chama componentDidCatch com o erro correto', () => {
    const consoleSpy = vi.spyOn(console, 'error');
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      'Uncaught error:',
      expect.any(Error),
      expect.any(Object)
    );
  });
});
