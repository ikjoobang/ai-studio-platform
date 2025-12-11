import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>AI Studio - AI 이미지 생성 플랫폼</title>
        <meta name="description" content="AI 기반 이미지 생성 및 편집 플랫폼. Nano Banana, Ideogram 등 다양한 AI 도구를 하나의 플랫폼에서." />
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  fontFamily: {
                    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                  },
                  colors: {
                    brand: {
                      50: '#f0f9ff',
                      100: '#e0f2fe',
                      200: '#bae6fd',
                      300: '#7dd3fc',
                      400: '#38bdf8',
                      500: '#0ea5e9',
                      600: '#0284c7',
                      700: '#0369a1',
                      800: '#075985',
                      900: '#0c4a6e',
                    }
                  }
                }
              }
            }
          `
        }} />
        <style dangerouslySetInnerHTML={{
          __html: `
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            html {
              scroll-behavior: smooth;
            }
            body {
              font-family: 'Inter', system-ui, -apple-system, sans-serif;
              background-color: #0a0a0a;
              color: #ffffff;
              overflow-x: hidden;
            }
            .gradient-text {
              background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 50%, #ec4899 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            .gradient-border {
              position: relative;
              background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 50%, #ec4899 100%);
              padding: 1px;
              border-radius: 12px;
            }
            .gradient-border-inner {
              background: #0a0a0a;
              border-radius: 11px;
              height: 100%;
            }
            .card-hover {
              transition: all 0.3s ease;
            }
            .card-hover:hover {
              transform: translateY(-4px);
              box-shadow: 0 20px 40px rgba(14, 165, 233, 0.15);
            }
            .glass {
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .glow {
              box-shadow: 0 0 40px rgba(14, 165, 233, 0.3);
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            .float-animation {
              animation: float 3s ease-in-out infinite;
            }
            @keyframes pulse-glow {
              0%, 100% { box-shadow: 0 0 20px rgba(14, 165, 233, 0.4); }
              50% { box-shadow: 0 0 40px rgba(14, 165, 233, 0.6); }
            }
            .pulse-glow {
              animation: pulse-glow 2s ease-in-out infinite;
            }
            .hero-gradient {
              background: radial-gradient(ellipse at 50% 0%, rgba(14, 165, 233, 0.15) 0%, transparent 50%),
                          radial-gradient(ellipse at 80% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 40%),
                          radial-gradient(ellipse at 20% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 40%);
            }
          `
        }} />
      </head>
      <body class="hero-gradient min-h-screen">
        {children}
      </body>
    </html>
  )
})
