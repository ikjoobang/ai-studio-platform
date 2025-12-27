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
              background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
              color: #ffffff;
              overflow-x: hidden;
              min-height: 100vh;
            }
            .gradient-text {
              background: linear-gradient(135deg, #38bdf8 0%, #a78bfa 50%, #f472b6 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            /* 텍스트 가시성 - 다크 테마용 밝은 색상 */
            .text-gray-300 { color: #e2e8f0 !important; }
            .text-gray-400 { color: #cbd5e1 !important; }
            .text-gray-500 { color: #94a3b8 !important; }
            h1, h2, h3, h4, h5, h6 { color: #ffffff !important; }
            p { color: #e2e8f0 !important; }
            li { color: #e2e8f0 !important; }
            a { color: #e2e8f0; }
            span { color: #e2e8f0; }
            .gradient-border {
              position: relative;
              background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 50%, #ec4899 100%);
              padding: 2px;
              border-radius: 16px;
            }
            .gradient-border-inner {
              background: linear-gradient(135deg, #1e293b 0%, #312e81 100%);
              border-radius: 14px;
              height: 100%;
            }
            .card-hover {
              transition: all 0.3s ease;
            }
            .card-hover:hover {
              transform: translateY(-4px);
              box-shadow: 0 20px 40px rgba(14, 165, 233, 0.2);
            }
            .glass {
              background: rgba(30, 41, 59, 0.8);
              backdrop-filter: blur(12px);
              border: 1px solid rgba(148, 163, 184, 0.2);
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
              background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
            }
            nav a, nav span, nav button {
              color: #e2e8f0 !important;
            }
            .nav-link:hover {
              color: #ffffff !important;
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
