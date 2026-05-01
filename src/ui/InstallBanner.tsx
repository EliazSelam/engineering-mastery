import React, { useState, useEffect } from 'react';
import { X, Share } from 'lucide-react';

// Detect iOS Safari (not standalone = not installed yet)
function isIosSafari(): boolean {
  const ua = navigator.userAgent;
  const isIos = /iphone|ipad|ipod/i.test(ua);
  const isStandalone = ('standalone' in navigator) && (navigator as any).standalone === true;
  return isIos && !isStandalone;
}

export const InstallBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show only once — dismiss is permanent
    const dismissed = localStorage.getItem('install_banner_dismissed');
    if (!dismissed && isIosSafari()) {
      // Small delay so it doesn't pop immediately on load
      const t = setTimeout(() => setVisible(true), 2500);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    try { localStorage.setItem('install_banner_dismissed', '1'); } catch {}
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 inset-x-3 z-[500] mx-auto max-w-sm"
      style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.18))' }}
    >
      {/* Arrow pointing down toward share button */}
      <div
        style={{
          background: '#1C1C1E',
          borderRadius: '16px',
          padding: '14px 16px',
          color: 'white',
          fontFamily: '-apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Close */}
        <button
          onClick={dismiss}
          style={{ position: 'absolute', top: 10, left: 12, opacity: 0.5, background: 'none', border: 'none', cursor: 'pointer', color: 'white', padding: 0 }}
        >
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src="/logo-icon.png"
            alt="logo"
            style={{ width: 44, height: 44, borderRadius: 10, flexShrink: 0 }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>
              התקן כאפליקציה
            </div>
            <div style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.4 }}>
              לחץ על{' '}
              <Share size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
              {' '}ואז <strong>"הוסף למסך הבית"</strong>
            </div>
          </div>
        </div>

        {/* Bottom arrow toward Safari share button */}
        <div
          style={{
            position: 'absolute',
            bottom: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '10px solid #1C1C1E',
          }}
        />
      </div>
    </div>
  );
};

export default InstallBanner;
