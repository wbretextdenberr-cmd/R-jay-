import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * يمنع الشاشة البيضاء: عند أي خطأ غير متوقع يعرض رسالة وزرّي إعادة المحاولة وتصفير البيانات المحلية.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('App crashed:', error, info.componentStack);
  }

  private reload = () => {
    window.location.reload();
  };

  private resetData = () => {
    try {
      localStorage.clear();
    } catch (_) {}
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div
        dir="rtl"
        style={{
          minHeight: '100vh',
          background: '#0f172a',
          color: '#f1f5f9',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'Cairo, system-ui, sans-serif',
          gap: '12px'
        }}
      >
        <div style={{ fontSize: 40 }}>⚠️</div>
        <h1 style={{ fontSize: 18, fontWeight: 800 }}>حدث خطأ غير متوقع / Une erreur est survenue</h1>
        <p style={{ fontSize: 12, color: '#94a3b8', maxWidth: 320, lineHeight: 1.7 }}>
          يمكنك إعادة المحاولة. إن تكرر الخطأ فصفّر البيانات المحلية، لكن ذلك يمسح الحسابات والرحلات والمسارات المحفوظة على هذا الجهاز نهائياً.
        </p>
        <code
          style={{
            fontSize: 10,
            color: '#fca5a5',
            background: '#1e293b',
            padding: '6px 10px',
            borderRadius: 8,
            maxWidth: 320,
            direction: 'ltr',
            wordBreak: 'break-word'
          }}
        >
          {this.state.error.message}
        </code>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button
            onClick={this.reload}
            style={{ padding: '10px 18px', borderRadius: 12, background: '#10b981', color: '#022c22', fontWeight: 800, fontSize: 13 }}
          >
            إعادة المحاولة
          </button>
          <button
            onClick={this.resetData}
            style={{ padding: '10px 18px', borderRadius: 12, background: '#1e293b', color: '#f1f5f9', fontWeight: 700, fontSize: 13, border: '1px solid #334155' }}
          >
            تصفير البيانات
          </button>
        </div>
      </div>
    );
  }
}
