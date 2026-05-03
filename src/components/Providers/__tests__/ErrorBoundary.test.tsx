/**
 * Testes do Providers/ErrorBoundary — com integração Sentry.
 * Agente A — Blindagem de Erros / Agente E — Guarda de Testes.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ErrorBoundary } from '@/components/Providers/ErrorBoundary';
import * as SentryMock from '@sentry/nextjs';

// Vitest hoist: mock deve ser declarado antes das variáveis que usa
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
}));

// Suprime os erros de console do React Error Boundary nos testes
beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});


// ── Componentes auxiliares ────────────────────────────────────────────────────

const BrokenComponent = (): React.ReactElement => {
  throw new Error('Erro de teste no componente filho');
};

const WorkingComponent = () => <div>Conteúdo funcionando corretamente</div>;

// ── Testes ───────────────────────────────────────────────────────────────────

describe('Providers/ErrorBoundary', () => {
  it('renderiza filhos normalmente quando não há erro', () => {
    render(
      <ErrorBoundary>
        <WorkingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Conteúdo funcionando corretamente')).toBeInTheDocument();
  });

  it('exibe a tela de fallback padrão quando filho joga erro', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText(/Ops! Algo deu errado/i)).toBeInTheDocument();
  });

  it('exibe fallback customizado via prop quando fornecido', () => {
    render(
      <ErrorBoundary fallback={<div>Meu fallback customizado</div>}>
        <BrokenComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Meu fallback customizado')).toBeInTheDocument();
    expect(screen.queryByText(/Ops! Algo deu errado/i)).not.toBeInTheDocument();
  });

  it('chama Sentry.captureException quando filho joga erro', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );
    expect(SentryMock.captureException).toHaveBeenCalledTimes(1);
    expect(SentryMock.captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ extra: expect.objectContaining({ componentStack: expect.any(String) }) })
    );
  });

  it('NÃO chama Sentry quando não há erro', () => {
    render(
      <ErrorBoundary>
        <WorkingComponent />
      </ErrorBoundary>
    );
    expect(SentryMock.captureException).not.toHaveBeenCalled();
  });

  it('botão "Tentar Novamente" está presente na tela de erro', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );
    const btn = screen.getByRole('button', { name: /tentar novamente/i });
    expect(btn).toBeInTheDocument();
  });

  it('botão "Voltar ao Início" está presente na tela de erro', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );
    const btn = screen.getByRole('button', { name: /voltar ao início/i });
    expect(btn).toBeInTheDocument();
  });

  it('consolida o erro com console.error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );
    // React chama console.error internamente + nosso componentDidCatch
    expect(consoleSpy).toHaveBeenCalled();
  });
});
