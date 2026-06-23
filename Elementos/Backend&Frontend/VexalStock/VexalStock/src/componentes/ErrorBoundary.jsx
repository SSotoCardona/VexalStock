import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorCount: 0 };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error, errorCount: (prev) => (prev || 0) + 1 };
  }

  componentDidCatch(error, info) {
    // Solo loguear errores críticos (no los de desmontaje/portales)
    if (!error.message?.includes('removeChild') && !error.message?.includes('parent')) {
      console.error('Uncaught error in component tree:', error, info);
    }
  }

  componentDidUpdate() {
    // Recuperarse automáticamente de errores de desmontaje después de 2 segundos
    if (this.state.hasError && this.state.error?.message?.includes('removeChild')) {
      this.recoveryTimeout = setTimeout(() => {
        this.setState({ hasError: false, error: null });
      }, 2000);
    }
  }

  componentWillUnmount() {
    if (this.recoveryTimeout) {
      clearTimeout(this.recoveryTimeout);
    }
  }

  render() {
    if (this.state.hasError) {
      // Si es un error de desmontaje, mostrar spinner de recuperación silencioso
      if (this.state.error?.message?.includes('removeChild')) {
        return (
          <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
          </div>
        );
      }

      // Para otros errores, mostrar mensaje
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Ha ocurrido un error</h2>
          <p className="text-sm text-muted-foreground mb-4">Recarga la página o vuelve al catálogo.</p>
          <div className="flex justify-center gap-2">
            <button className="btn" onClick={() => window.location.reload()}>Recargar</button>
            <a className="btn btn-outline" href="/">Volver al catálogo</a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
