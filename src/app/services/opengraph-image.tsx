import { ImageResponse } from 'next/og';

export const alt = 'Mining Products & Services — MASZ-Africa Ghana';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '60px 72px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 'auto',
            }}
          >
            <div
              style={{
                color: '#016BF2',
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 4,
                textTransform: 'uppercase',
              }}
            >
              MASZ-AFRICA
            </div>
            <div style={{ color: '#555555', fontSize: 16 }}>maszgh.com</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                color: '#FFFFFF',
                fontSize: 72,
                fontWeight: 700,
                lineHeight: 1.05,
                marginBottom: 24,
              }}
            >
              Products & Services
            </div>
            <div
              style={{
                color: '#888888',
                fontSize: 26,
                lineHeight: 1.5,
                maxWidth: 800,
              }}
            >
              Grinding media, activated carbon, steel pipes, gearbox servicing,
              and more — trusted mining solutions across Ghana and West Africa.
            </div>
          </div>
        </div>

        <div style={{ height: 8, background: '#016BF2' }} />
      </div>
    ),
    { ...size },
  );
}
