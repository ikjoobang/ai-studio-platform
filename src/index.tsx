import { Hono } from 'hono'
import { renderer } from './renderer'
import { serveStatic } from 'hono/cloudflare-pages'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { cache } from 'hono/cache'

// Types
type Bindings = {
  DB?: D1Database
  FAL_API_KEY?: string
  IDEOGRAM_API_KEY?: string
  KLING_ACCESS_KEY?: string
  KLING_SECRET_KEY?: string
}

// API 키 (하드코딩 - 프로덕션에서는 환경변수 사용 권장)
const API_KEYS = {
  FAL_API_KEY: 'b5a2b6f2-f0be-4837-b5e9-237fe8a44e8e:4c13ad7bcdbfbda051b140f84ce40524',
  IDEOGRAM_API_KEY: 'z9FQ5zQQfM1Tar8dhNANWJMPN2N_wcnfpGMaCKDQMiu0d2n6n-lL5rkPVKws_QtACrLRw5xR3ZpiuVUf9xHS_Q',
  KLING_ACCESS_KEY: 'Ar8mLGAGRaMMmTrKb4LK3rTPbn9YGPtA',
  KLING_SECRET_KEY: 'RfM9F3hJMP9KQhdHk8pCpMFKaPen8QCM'
}

// 영어 프리셋 정의
const IMAGE_PRESETS: Record<string, string> = {
  'realistic': ', photorealistic, high quality, 4K, detailed, professional photography',
  'anime': ', anime style, 2D animation, vibrant colors, Studio Ghibli inspired',
  'golden_hour': ', golden hour lighting, warm sunlight, soft shadows, beautiful',
  'cinematic': ', cinematic composition, film still, dramatic lighting, movie quality',
  'fantasy': ', fantasy art style, magical, ethereal glow, dreamlike atmosphere',
  'minimal': ', minimalist design, clean, simple, modern aesthetic'
}

const VIDEO_PRESETS: Record<string, string> = {
  'cinematic': ', cinematic, dramatic lighting, film grain, 4K, professional camera movement, tracking shot',
  'slow_motion': ', slow motion, smooth movement, high fps, detailed motion, fluid dynamics',
  'fantasy': ', fantasy style, magical particles, ethereal glow, dreamlike atmosphere',
  'night_city': ', night city, neon lights, urban atmosphere, moody lighting, reflections',
  'emotional': ', emotional realism, subtle micro-expressions, intimate close-up, soft key light',
  'golden_hour': ', golden hour lighting, warm amber tones, soft shadows, beautiful natural light',
  'drone': ', drone ascending shot, aerial view, sweeping camera, epic scale',
  'action': ', dynamic motion, large range movement, gravity-accurate physics, fast-paced',
  'anime': ', anime style, stylized animation, vibrant colors, expressive character design'
}

const app = new Hono<{ Bindings: Bindings }>()

// ==================== 미들웨어 ====================
app.use('*', logger())
app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.use('/static/*', cache({
  cacheName: 'ai-studio-static',
  cacheControl: 'public, max-age=31536000',
}))

app.use(renderer)
app.use('/static/*', serveStatic())

// ==================== 메인 페이지 ====================
app.get('/', (c) => {
  return c.render(
    <>
      <nav class="fixed top-0 left-0 right-0 z-50 glass">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16 md:h-20">
            <a href="/" class="flex items-center space-x-2">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                <i class="fas fa-wand-magic-sparkles text-white text-lg"></i>
              </div>
              <span class="text-xl font-bold gradient-text">AI Studio</span>
            </a>
            
            <div class="hidden md:flex items-center space-x-8">
              <a href="#features" class="text-gray-300 hover:text-white transition-colors">기능</a>
              <a href="#tools" class="text-gray-300 hover:text-white transition-colors">AI 도구</a>
              <a href="/generate-video" class="text-gray-300 hover:text-white transition-colors">영상</a>
              <a href="#pricing" class="text-gray-300 hover:text-white transition-colors">요금제</a>
              <a href="/dashboard" class="text-gray-300 hover:text-white transition-colors">대시보드</a>
            </div>
            
            <div class="flex items-center space-x-4">
              <a href="/generate" class="hidden sm:inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-brand-500 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity">
                <i class="fas fa-sparkles mr-2"></i>
                시작하기
              </a>
            </div>
          </div>
        </div>
      </nav>

      <section class="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4">
        <div class="max-w-6xl mx-auto text-center">
          <div class="inline-flex items-center px-4 py-2 rounded-full glass mb-8">
            <span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            <span class="text-sm text-gray-300">크레딧 기반 · 1년간 유효</span>
          </div>
          
          <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span class="gradient-text">AI로 창작하세요</span>
            <br />
            <span class="text-white">무한한 창의력</span>
          </h1>
          
          <p class="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Nano Banana, Ideogram, Kling AI - 최고의 AI 도구를 하나의 플랫폼에서.
            <br class="hidden sm:block" />
            간단한 프롬프트로 이미지, 영상 등을 생성하세요.
          </p>
          
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a href="/generate" class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-500 to-purple-600 rounded-xl font-semibold text-lg hover:opacity-90 transition-all pulse-glow">
              <i class="fas fa-image mr-2"></i>
              이미지 생성
            </a>
            <a href="/generate-video" class="w-full sm:w-auto px-8 py-4 glass rounded-xl font-semibold text-lg hover:bg-white/10 transition-all">
              <i class="fas fa-video mr-2"></i>
              영상 생성
            </a>
          </div>
          
          <div class="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
            <div class="glass rounded-xl p-4 sm:p-6">
              <div class="text-2xl sm:text-4xl font-bold gradient-text mb-1">80%</div>
              <div class="text-xs sm:text-sm text-gray-400">비용 절감</div>
            </div>
            <div class="glass rounded-xl p-4 sm:p-6">
              <div class="text-2xl sm:text-4xl font-bold gradient-text mb-1">10x</div>
              <div class="text-xs sm:text-sm text-gray-400">더 빠른</div>
            </div>
            <div class="glass rounded-xl p-4 sm:p-6">
              <div class="text-2xl sm:text-4xl font-bold gradient-text mb-1">4K</div>
              <div class="text-xs sm:text-sm text-gray-400">품질</div>
            </div>
          </div>
        </div>
      </section>

      <section id="tools" class="py-20 sm:py-32 px-4 bg-gradient-to-b from-transparent via-brand-900/10 to-transparent">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span class="gradient-text">AI 도구</span> 모음
            </h2>
            <p class="text-gray-400 text-lg max-w-2xl mx-auto">
              창작 목적에 맞는 도구를 선택하세요
            </p>
          </div>
          
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <a href="/generate" class="group">
              <div class="gradient-border card-hover">
                <div class="gradient-border-inner p-6 sm:p-8">
                  <div class="flex items-start justify-between mb-4">
                    <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                      <span class="text-3xl">🍌</span>
                    </div>
                    <span class="px-3 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">이미지</span>
                  </div>
                  <h3 class="text-xl font-semibold mb-2 group-hover:text-brand-400 transition-colors">Nano Banana</h3>
                  <p class="text-gray-400 text-sm leading-relaxed mb-4">
                    Fal.ai 기반 고품질 이미지 생성
                  </p>
                </div>
              </div>
            </a>
            
            <a href="/generate" class="group">
              <div class="glass rounded-xl card-hover p-6 sm:p-8">
                <div class="flex items-start justify-between mb-4">
                  <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                    <i class="fas fa-font text-2xl text-white"></i>
                  </div>
                  <span class="px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full">로고</span>
                </div>
                <h3 class="text-xl font-semibold mb-2 group-hover:text-brand-400 transition-colors">Ideogram</h3>
                <p class="text-gray-400 text-sm leading-relaxed mb-4">
                  로고 및 텍스트 렌더링에 최적
                </p>
              </div>
            </a>

            <a href="/generate-video" class="group">
              <div class="glass rounded-xl card-hover p-6 sm:p-8">
                <div class="flex items-start justify-between mb-4">
                  <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <i class="fas fa-video text-2xl text-white"></i>
                  </div>
                  <span class="px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-400 rounded-full">영상</span>
                </div>
                <h3 class="text-xl font-semibold mb-2 group-hover:text-brand-400 transition-colors">Kling 2.5 Turbo</h3>
                <p class="text-gray-400 text-sm leading-relaxed mb-4">
                  빠른 시네마틱 영상 생성
                </p>
              </div>
            </a>

            <a href="/generate-video" class="group">
              <div class="glass rounded-xl card-hover p-6 sm:p-8">
                <div class="flex items-start justify-between mb-4">
                  <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                    <i class="fas fa-film text-2xl text-white"></i>
                  </div>
                  <span class="px-3 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded-full">프리미엄</span>
                </div>
                <h3 class="text-xl font-semibold mb-2 group-hover:text-brand-400 transition-colors">Kling 2.1 Master</h3>
                <p class="text-gray-400 text-sm leading-relaxed mb-4">
                  최고 품질 영상 생성
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section id="pricing" class="py-20 sm:py-32 px-4">
        <div class="max-w-5xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              간단한 <span class="gradient-text">요금제</span>
            </h2>
          </div>
          
          <div class="grid sm:grid-cols-3 gap-6 lg:gap-8">
            <div class="glass rounded-2xl p-6 sm:p-8 card-hover">
              <div class="text-center mb-6">
                <h3 class="text-xl font-semibold mb-2">스타터</h3>
                <div class="text-4xl font-bold mb-1">₩29,000</div>
                <p class="text-gray-400 text-sm">630 크레딧</p>
              </div>
              <ul class="space-y-3 mb-8 text-sm">
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>약 63장 이미지</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>모든 AI 도구</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>1년간 유효</li>
              </ul>
            </div>
            
            <div class="gradient-border card-hover">
              <div class="gradient-border-inner p-6 sm:p-8 relative">
                <div class="absolute top-0 right-0 bg-gradient-to-r from-brand-500 to-purple-600 text-xs px-4 py-1 rounded-bl-xl">인기</div>
                <div class="text-center mb-6">
                  <h3 class="text-xl font-semibold mb-2">Pro</h3>
                  <div class="text-4xl font-bold gradient-text mb-1">₩59,000</div>
                  <p class="text-gray-400 text-sm">1,500 크레딧</p>
                </div>
                <ul class="space-y-3 mb-8 text-sm">
                  <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>약 150장 이미지</li>
                  <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>우선 대기열</li>
                  <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>1년간 유효</li>
                </ul>
              </div>
            </div>
            
            <div class="glass rounded-2xl p-6 sm:p-8 card-hover">
              <div class="text-center mb-6">
                <h3 class="text-xl font-semibold mb-2">비즈니스</h3>
                <div class="text-4xl font-bold mb-1">₩119,000</div>
                <p class="text-gray-400 text-sm">3,500 크레딧</p>
              </div>
              <ul class="space-y-3 mb-8 text-sm">
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>약 350장 이미지</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>팀 공유</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>1년간 유효</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer class="border-t border-white/10 py-12 px-4">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center space-x-2">
              <span class="text-xl font-bold gradient-text">AI Studio</span>
            </div>
            <div class="flex items-center space-x-6 text-sm text-gray-400">
              <a href="/api/docs" class="hover:text-white">API 문서</a>
              <a href="/admin" class="hover:text-white">관리자</a>
              <a href="/dashboard" class="hover:text-white">대시보드</a>
            </div>
            <p class="text-sm text-gray-500">© 2024 AI Studio</p>
          </div>
        </div>
      </footer>
    </>
  )
})

// ==================== 이미지 생성 페이지 ====================
app.get('/generate', (c) => {
  return c.render(
    <>
      <nav class="fixed top-0 left-0 right-0 z-50 glass">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16 md:h-20">
            <a href="/" class="flex items-center space-x-2">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                <i class="fas fa-wand-magic-sparkles text-white text-lg"></i>
              </div>
              <span class="text-xl font-bold gradient-text">AI Studio</span>
            </a>
            <div class="flex items-center space-x-4">
              <a href="/generate-video" class="px-4 py-2 glass rounded-lg hover:bg-white/10">Video</a>
              <a href="/" class="text-gray-300 hover:text-white"><i class="fas fa-home text-xl"></i></a>
            </div>
          </div>
        </div>
      </nav>

      <main class="pt-24 pb-12 px-4 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <div class="mb-8">
            <h1 class="text-3xl font-bold mb-2">
              <i class="fas fa-image text-brand-400 mr-3"></i>
              AI 이미지 생성
            </h1>
            <p class="text-gray-400">Nano Banana와 Ideogram으로 멋진 이미지를 만드세요</p>
          </div>

          <div class="grid lg:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div class="glass rounded-2xl p-6">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-robot text-brand-400 mr-2"></i>
                  AI 모델 선택
                </h2>
                <div class="grid grid-cols-2 gap-3">
                  <button id="btn-nano" class="p-4 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 transition-all">
                    <span class="text-2xl mb-2 block">🍌</span>
                    <span class="font-medium">Nano Banana</span>
                    <span class="text-xs text-gray-400 block mt-1">Fal.ai</span>
                  </button>
                  <button id="btn-ideogram" class="p-4 rounded-xl glass border-2 border-transparent hover:border-white/20 transition-all">
                    <span class="text-2xl mb-2 block"><i class="fas fa-font text-cyan-400"></i></span>
                    <span class="font-medium">Ideogram</span>
                    <span class="text-xs text-gray-400 block mt-1">로고 & 텍스트</span>
                  </button>
                </div>
              </div>

              <div class="glass rounded-2xl p-6">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-pen-fancy text-brand-400 mr-2"></i>
                  이미지를 설명하세요
                </h2>
                <textarea
                  id="prompt-input"
                  class="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors resize-none"
                  placeholder="예: 해변을 달리는 귀여운 강아지, 현대적인 카페 로고, 우주를 나는 고래..."
                ></textarea>
                
                <div class="mt-4">
                  <span class="text-sm text-gray-400 mb-2 block">빠른 프리셋</span>
                  <div class="flex flex-wrap gap-2">
                    <button class="preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all" data-preset="realistic">📷 실사</button>
                    <button class="preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all" data-preset="anime">🎨 애니메</button>
                    <button class="preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all" data-preset="golden_hour">🌅 골든아워</button>
                    <button class="preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all" data-preset="cinematic">🏙️ 시네마틱</button>
                    <button class="preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all" data-preset="fantasy">✨ 판타지</button>
                    <button class="preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all" data-preset="minimal">🎯 미니멀</button>
                  </div>
                </div>
              </div>

              <div class="glass rounded-2xl p-6">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-sliders text-brand-400 mr-2"></i>
                  설정
                </h2>
                <div class="mb-4">
                  <label class="text-sm text-gray-400 mb-2 block">화면 비율</label>
                  <div class="grid grid-cols-4 gap-2">
                    <button class="ratio-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10" data-ratio="1:1">1:1</button>
                    <button class="ratio-btn px-3 py-2 text-sm rounded-lg bg-brand-500/20 border border-brand-500/50" data-ratio="16:9">16:9</button>
                    <button class="ratio-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10" data-ratio="9:16">9:16</button>
                    <button class="ratio-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10" data-ratio="4:3">4:3</button>
                  </div>
                </div>
              </div>

              <button id="generate-btn" class="w-full py-4 bg-gradient-to-r from-brand-500 to-purple-600 rounded-xl font-semibold text-lg hover:opacity-90 transition-all pulse-glow flex items-center justify-center">
                <i class="fas fa-sparkles mr-2"></i>
                이미지 생성
              </button>
            </div>

            <div class="space-y-6">
              <div class="glass rounded-2xl p-6 min-h-[500px] lg:min-h-[600px] flex flex-col">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-eye text-brand-400 mr-2"></i>
                  미리보기
                </h2>
                <div id="preview-area" class="flex-1 flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl">
                  <div class="text-center p-8">
                    <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                      <i class="fas fa-image text-4xl text-gray-500"></i>
                    </div>
                    <p class="text-gray-400 mb-2">생성된 이미지가 여기에 표시됩니다</p>
                  </div>
                </div>
                <div id="download-buttons" class="mt-4 flex gap-3 hidden">
                  <a id="download-link" href="#" download class="flex-1 py-3 rounded-xl glass hover:bg-white/10 text-center">
                    <i class="fas fa-download mr-2"></i>다운로드
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <script dangerouslySetInnerHTML={{
        __html: `
          let selectedModel = 'nano-banana';
          let selectedRatio = '16:9';
          let selectedPreset = '';
          
          const presets = {
            'realistic': ', photorealistic, high quality, 4K, detailed, professional photography',
            'anime': ', anime style, 2D animation, vibrant colors, Studio Ghibli inspired',
            'golden_hour': ', golden hour lighting, warm sunlight, soft shadows, beautiful',
            'cinematic': ', cinematic composition, film still, dramatic lighting, movie quality',
            'fantasy': ', fantasy art style, magical, ethereal glow, dreamlike atmosphere',
            'minimal': ', minimalist design, clean, simple, modern aesthetic'
          };
          
          // Model selection
          document.querySelectorAll('#btn-nano, #btn-ideogram').forEach(btn => {
            btn.addEventListener('click', function() {
              document.querySelectorAll('#btn-nano, #btn-ideogram').forEach(b => {
                b.classList.remove('border-yellow-500/50', 'border-cyan-500/50', 'bg-gradient-to-br', 'from-yellow-500/20', 'to-orange-500/20', 'from-blue-500/20', 'to-cyan-500/20');
                b.classList.add('border-transparent', 'glass');
              });
              if (this.id === 'btn-nano') {
                selectedModel = 'nano-banana';
                this.classList.remove('border-transparent', 'glass');
                this.classList.add('border-yellow-500/50', 'bg-gradient-to-br', 'from-yellow-500/20', 'to-orange-500/20');
              } else {
                selectedModel = 'ideogram';
                this.classList.remove('border-transparent', 'glass');
                this.classList.add('border-cyan-500/50', 'bg-gradient-to-br', 'from-blue-500/20', 'to-cyan-500/20');
              }
            });
          });
          
          // Ratio selection
          document.querySelectorAll('.ratio-btn').forEach(btn => {
            btn.addEventListener('click', function() {
              document.querySelectorAll('.ratio-btn').forEach(b => {
                b.className = 'ratio-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10';
              });
              this.className = 'ratio-btn px-3 py-2 text-sm rounded-lg bg-brand-500/20 border border-brand-500/50';
              selectedRatio = this.dataset.ratio;
            });
          });
          
          // Preset selection
          document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', function() {
              document.querySelectorAll('.preset-btn').forEach(b => {
                b.classList.remove('bg-brand-500/30', 'border-2', 'border-brand-400');
              });
              this.classList.add('bg-brand-500/30', 'border-2', 'border-brand-400');
              selectedPreset = this.dataset.preset;
              
              const textarea = document.getElementById('prompt-input');
              const presetText = presets[selectedPreset];
              if (presetText && !textarea.value.includes(presetText)) {
                textarea.value = textarea.value.replace(/, photorealistic.*|, anime style.*|, golden hour.*|, cinematic.*|, fantasy.*|, minimalist.*/g, '');
                textarea.value = textarea.value + presetText;
              }
            });
          });
          
          // Generate button
          document.getElementById('generate-btn').addEventListener('click', async function() {
            const btn = this;
            const prompt = document.getElementById('prompt-input').value;
            
            if (!prompt.trim()) {
              alert('프롬프트를 입력해주세요 in English');
              return;
            }
            
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>생성 중...';
            btn.disabled = true;
            
            try {
              const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  prompt: prompt,
                  model: selectedModel,
                  aspectRatio: selectedRatio
                })
              });
              
              const data = await response.json();
              
              if (data.success && data.imageUrl) {
                const previewArea = document.getElementById('preview-area');
                previewArea.innerHTML = '<img src="' + data.imageUrl + '" class="max-w-full max-h-full rounded-xl object-contain" />';
                
                document.getElementById('download-buttons').classList.remove('hidden');
                document.getElementById('download-link').href = data.imageUrl;
                
                btn.innerHTML = '<i class="fas fa-check mr-2"></i>생성 완료!';
              } else {
                throw new Error(data.error || '생성 실패');
              }
            } catch (error) {
              alert('Error: ' + error.message);
              btn.innerHTML = originalText;
            }
            
            setTimeout(() => {
              btn.innerHTML = originalText;
              btn.disabled = false;
            }, 2000);
          });
        `
      }} />
    </>
  )
})

// ==================== 영상 생성 페이지 ====================
app.get('/generate-video', (c) => {
  return c.render(
    <>
      <nav class="fixed top-0 left-0 right-0 z-50 glass">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16 md:h-20">
            <a href="/" class="flex items-center space-x-2">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                <i class="fas fa-wand-magic-sparkles text-white text-lg"></i>
              </div>
              <span class="text-xl font-bold gradient-text">AI Studio</span>
            </a>
            <div class="flex items-center space-x-4">
              <a href="/generate" class="px-4 py-2 glass rounded-lg hover:bg-white/10">이미지</a>
              <a href="/" class="text-gray-300 hover:text-white"><i class="fas fa-home text-xl"></i></a>
            </div>
          </div>
        </div>
      </nav>

      <main class="pt-24 pb-12 px-4 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <div class="mb-8">
            <h1 class="text-3xl font-bold mb-2">
              <i class="fas fa-video text-purple-400 mr-3"></i>
              AI 영상 생성
            </h1>
            <p class="text-gray-400">Kling AI로 시네마틱 영상을 만드세요 (V2.1 Master & V2.5 Turbo)</p>
          </div>

          <div class="grid lg:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div class="glass rounded-2xl p-6">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-film text-purple-400 mr-2"></i>
                  Select Model
                </h2>
                <div class="grid grid-cols-2 gap-3">
                  <button id="model-turbo" class="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 transition-all">
                    <i class="fas fa-bolt text-2xl mb-2 block text-purple-400"></i>
                    <span class="font-medium">V2.5 Turbo</span>
                    <span class="text-xs text-gray-400 block mt-1">Fast · 25 points/5s</span>
                  </button>
                  <button id="model-master" class="p-4 rounded-xl glass border-2 border-transparent hover:border-white/20 transition-all">
                    <i class="fas fa-crown text-2xl mb-2 block text-yellow-400"></i>
                    <span class="font-medium">V2.1 Master</span>
                    <span class="text-xs text-gray-400 block mt-1">Premium · 35 points/5s</span>
                  </button>
                </div>
              </div>

              <div class="glass rounded-2xl p-6">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-pen-fancy text-purple-400 mr-2"></i>
                  영상을 설명하세요 (English)
                </h2>
                <textarea
                  id="video-prompt"
                  class="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  placeholder="Example: A dog running on the beach at sunset, a spaceship flying through asteroid belt..."
                ></textarea>
                
                <div class="mt-4">
                  <span class="text-sm text-gray-400 mb-2 block">빠른 프리셋</span>
                  <div class="flex flex-wrap gap-2">
                    <button class="video-preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all" data-preset="cinematic">🎬 시네마틱</button>
                    <button class="video-preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all" data-preset="slow_motion">🌊 슬로우 모션</button>
                    <button class="video-preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all" data-preset="fantasy">✨ 판타지</button>
                    <button class="video-preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all" data-preset="night_city">🏙️ 야경</button>
                    <button class="video-preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all" data-preset="drone">🚁 드론 촬영</button>
                    <button class="video-preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all" data-preset="action">💥 액션</button>
                  </div>
                </div>
              </div>

              <div class="glass rounded-2xl p-6">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-sliders text-purple-400 mr-2"></i>
                  설정
                </h2>
                <div class="space-y-4">
                  <div>
                    <label class="text-sm text-gray-400 mb-2 block">영상 길이</label>
                    <div class="grid grid-cols-2 gap-2">
                      <button class="duration-btn px-3 py-2 text-sm rounded-lg bg-purple-500/20 border border-purple-500/50" data-duration="5">5초</button>
                      <button class="duration-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10" data-duration="10">10초</button>
                    </div>
                  </div>
                  <div>
                    <label class="text-sm text-gray-400 mb-2 block">화면 비율</label>
                    <div class="grid grid-cols-3 gap-2">
                      <button class="video-ratio-btn px-3 py-2 text-sm rounded-lg bg-purple-500/20 border border-purple-500/50" data-ratio="16:9">16:9</button>
                      <button class="video-ratio-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10" data-ratio="9:16">9:16</button>
                      <button class="video-ratio-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10" data-ratio="1:1">1:1</button>
                    </div>
                  </div>
                </div>
              </div>

              <button id="generate-video-btn" class="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-semibold text-lg hover:opacity-90 transition-all pulse-glow flex items-center justify-center">
                <i class="fas fa-film mr-2"></i>
                영상 생성
                <span id="points-display" class="ml-2 px-2 py-0.5 bg-white/20 rounded text-sm">~25 points</span>
              </button>
            </div>

            <div class="space-y-6">
              <div class="glass rounded-2xl p-6 min-h-[500px] lg:min-h-[600px] flex flex-col">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-play-circle text-purple-400 mr-2"></i>
                  미리보기
                </h2>
                <div id="video-preview-area" class="flex-1 flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl">
                  <div class="text-center p-8">
                    <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
                      <i class="fas fa-video text-4xl text-gray-500"></i>
                    </div>
                    <p class="text-gray-400 mb-2">Generated video will appear here</p>
                    <p class="text-xs text-gray-500">Generation time: ~1-3 minutes</p>
                  </div>
                </div>
                <div id="video-download-buttons" class="mt-4 flex gap-3 hidden">
                  <a id="video-download-link" href="#" download class="flex-1 py-3 rounded-xl glass hover:bg-white/10 text-center">
                    <i class="fas fa-download mr-2"></i>다운로드
                  </a>
                </div>
              </div>

              <div class="glass rounded-2xl p-6">
                <h3 class="font-semibold mb-3 flex items-center">
                  <i class="fas fa-info-circle text-purple-400 mr-2"></i>
                  모델 정보
                </h3>
                <div class="space-y-2 text-sm text-gray-400">
                  <div class="flex justify-between">
                    <span>V2.5 Turbo</span>
                    <span class="text-green-400">빠르고 효율적</span>
                  </div>
                  <div class="flex justify-between">
                    <span>V2.1 Master</span>
                    <span class="text-purple-400">최고 품질</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <script dangerouslySetInnerHTML={{
        __html: `
          let selectedVideoModel = 'kling-v2-5-turbo';
          let selected영상 길이 = '5';
          let selectedVideoRatio = '16:9';
          let selectedVideoPreset = '';
          
          const videoPresets = {
            'cinematic': ', cinematic, dramatic lighting, film grain, 4K, professional camera movement, tracking shot',
            'slow_motion': ', slow motion, smooth movement, high fps, detailed motion, fluid dynamics',
            'fantasy': ', fantasy style, magical particles, ethereal glow, dreamlike atmosphere',
            'night_city': ', night city, neon lights, urban atmosphere, moody lighting, reflections',
            'drone': ', drone ascending shot, aerial view, sweeping camera, epic scale',
            'action': ', dynamic motion, large range movement, gravity-accurate physics, fast-paced'
          };
          
          // Model selection
          document.querySelectorAll('#model-turbo, #model-master').forEach(btn => {
            btn.addEventListener('click', function() {
              document.querySelectorAll('#model-turbo, #model-master').forEach(b => {
                b.classList.remove('border-purple-500/50', 'border-yellow-500/50', 'bg-gradient-to-br', 'from-purple-500/20', 'to-pink-500/20', 'from-yellow-500/20', 'to-orange-500/20');
                b.classList.add('border-transparent', 'glass');
              });
              if (this.id === 'model-turbo') {
                selectedVideoModel = 'kling-v2-5-turbo';
                this.classList.remove('border-transparent', 'glass');
                this.classList.add('border-purple-500/50', 'bg-gradient-to-br', 'from-purple-500/20', 'to-pink-500/20');
                document.getElementById('points-display').textContent = selected영상 길이 === '5' ? '~25 points' : '~50 points';
              } else {
                selectedVideoModel = 'kling-v2-1-master';
                this.classList.remove('border-transparent', 'glass');
                this.classList.add('border-yellow-500/50', 'bg-gradient-to-br', 'from-yellow-500/20', 'to-orange-500/20');
                document.getElementById('points-display').textContent = selected영상 길이 === '5' ? '~35 points' : '~70 points';
              }
            });
          });
          
          // 영상 길이 selection
          document.querySelectorAll('.duration-btn').forEach(btn => {
            btn.addEventListener('click', function() {
              document.querySelectorAll('.duration-btn').forEach(b => {
                b.className = 'duration-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10';
              });
              this.className = 'duration-btn px-3 py-2 text-sm rounded-lg bg-purple-500/20 border border-purple-500/50';
              selected영상 길이 = this.dataset.duration;
              
              // Update points display
              if (selectedVideoModel === 'kling-v2-5-turbo') {
                document.getElementById('points-display').textContent = selected영상 길이 === '5' ? '~25 points' : '~50 points';
              } else {
                document.getElementById('points-display').textContent = selected영상 길이 === '5' ? '~35 points' : '~70 points';
              }
            });
          });
          
          // Ratio selection
          document.querySelectorAll('.video-ratio-btn').forEach(btn => {
            btn.addEventListener('click', function() {
              document.querySelectorAll('.video-ratio-btn').forEach(b => {
                b.className = 'video-ratio-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10';
              });
              this.className = 'video-ratio-btn px-3 py-2 text-sm rounded-lg bg-purple-500/20 border border-purple-500/50';
              selectedVideoRatio = this.dataset.ratio;
            });
          });
          
          // Preset selection
          document.querySelectorAll('.video-preset-btn').forEach(btn => {
            btn.addEventListener('click', function() {
              document.querySelectorAll('.video-preset-btn').forEach(b => {
                b.classList.remove('bg-purple-500/30', 'border-2', 'border-purple-400');
              });
              this.classList.add('bg-purple-500/30', 'border-2', 'border-purple-400');
              selectedVideoPreset = this.dataset.preset;
              
              const textarea = document.getElementById('video-prompt');
              const presetText = videoPresets[selectedVideoPreset];
              if (presetText && !textarea.value.includes(presetText)) {
                textarea.value = textarea.value.replace(/, cinematic,.*|, slow motion,.*|, fantasy style,.*|, night city,.*|, drone.*|, dynamic motion,.*/g, '');
                textarea.value = textarea.value + presetText;
              }
            });
          });
          
          // Generate button
          document.getElementById('generate-video-btn').addEventListener('click', async function() {
            const btn = this;
            const prompt = document.getElementById('video-prompt').value;
            
            if (!prompt.trim()) {
              alert('프롬프트를 입력해주세요 in English');
              return;
            }
            
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...';
            btn.disabled = true;
            
            try {
              const response = await fetch('/api/generate-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  prompt: prompt,
                  model: selectedVideoModel,
                  duration: selected영상 길이,
                  aspectRatio: selectedVideoRatio
                })
              });
              
              const data = await response.json();
              
              if (data.success) {
                btn.innerHTML = '<i class="fas fa-check mr-2"></i>Submitted!';
                
                const previewArea = document.getElementById('video-preview-area');
                previewArea.innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin text-4xl text-purple-400 mb-4"></i><p class="text-gray-400">생성 중...deo...</p><p class="text-xs text-gray-500 mt-2">Task ID: ' + data.taskId + '</p><p class="text-xs text-gray-500">This may take 1-3 minutes</p></div>';
                
                // Start polling for status
                pollVideoStatus(data.taskId);
              } else {
                throw new Error(data.error || '생성 실패');
              }
            } catch (error) {
              alert('Error: ' + error.message);
            }
            
            setTimeout(() => {
              btn.innerHTML = originalText;
              btn.disabled = false;
            }, 3000);
          });
          
          async function pollVideoStatus(taskId) {
            const checkStatus = async () => {
              try {
                const response = await fetch('/api/video-status/' + taskId);
                const data = await response.json();
                
                const previewArea = document.getElementById('video-preview-area');
                
                if (data.status === '완료' && data.videoUrl) {
                  previewArea.innerHTML = '<video controls class="w-full h-full rounded-xl" src="' + data.videoUrl + '"></video>';
                  document.getElementById('video-download-buttons').classList.remove('hidden');
                  document.getElementById('video-download-link').href = data.videoUrl;
                } else if (data.status === '실패') {
                  previewArea.innerHTML = '<div class="text-center text-red-400"><i class="fas fa-exclamation-circle text-4xl mb-4"></i><p>생성 실패</p><p class="text-xs mt-2">' + (data.error || 'Unknown error') + '</p></div>';
                } else {
                  previewArea.innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin text-4xl text-purple-400 mb-4"></i><p class="text-gray-400">생성 중...deo...</p><p class="text-xs text-gray-500 mt-2">Status: ' + data.rawStatus + '</p></div>';
                  setTimeout(checkStatus, 5000);
                }
              } catch (error) {
                console.error('Status check error:', error);
                setTimeout(checkStatus, 5000);
              }
            };
            
            setTimeout(checkStatus, 10000);
          }
        `
      }} />
    </>
  )
})

// ==================== 대시보드 페이지 ====================
app.get('/dashboard', (c) => {
  return c.render(
    <>
      <nav class="fixed top-0 left-0 right-0 z-50 glass">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <a href="/" class="flex items-center space-x-2">
              <span class="text-xl font-bold gradient-text">AI Studio</span>
            </a>
            <div class="flex items-center space-x-4">
              <a href="/generate" class="px-4 py-2 glass rounded-lg hover:bg-white/10">Image</a>
              <a href="/generate-video" class="px-4 py-2 glass rounded-lg hover:bg-white/10">Video</a>
              <a href="/admin" class="px-4 py-2 glass rounded-lg hover:bg-white/10">관리자</a>
            </div>
          </div>
        </div>
      </nav>

      <main class="pt-24 pb-12 px-4 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold mb-8">대시보드</h1>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center justify-between mb-4">
                <i class="fas fa-image text-2xl text-brand-400"></i>
              </div>
              <div class="text-3xl font-bold mb-1">2</div>
              <div class="text-sm text-gray-400">이미지 모델</div>
            </div>
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center justify-between mb-4">
                <i class="fas fa-video text-2xl text-purple-400"></i>
              </div>
              <div class="text-3xl font-bold mb-1">2</div>
              <div class="text-sm text-gray-400">영상 모델</div>
            </div>
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center justify-between mb-4">
                <i class="fas fa-bolt text-2xl text-yellow-400"></i>
              </div>
              <div class="text-3xl font-bold mb-1">빠름</div>
              <div class="text-sm text-gray-400">생성 속도</div>
            </div>
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center justify-between mb-4">
                <i class="fas fa-check-circle text-2xl text-green-400"></i>
              </div>
              <div class="text-3xl font-bold mb-1">4</div>
              <div class="text-sm text-gray-400">AI 모델 연동</div>
            </div>
          </div>

          <div class="glass rounded-2xl p-6 mb-8">
            <h2 class="text-xl font-semibold mb-6">API Status</h2>
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                <div class="flex items-center mb-2">
                  <span class="text-2xl mr-3">🍌</span>
                  <span class="font-medium">Nano Banana</span>
                </div>
                <span class="text-green-400 text-sm">✓ Connected</span>
              </div>
              <div class="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                <div class="flex items-center mb-2">
                  <i class="fas fa-font text-2xl text-cyan-400 mr-3"></i>
                  <span class="font-medium">Ideogram</span>
                </div>
                <span class="text-green-400 text-sm">✓ Connected</span>
              </div>
              <div class="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                <div class="flex items-center mb-2">
                  <i class="fas fa-bolt text-2xl text-purple-400 mr-3"></i>
                  <span class="font-medium">Kling V2.5 Turbo</span>
                </div>
                <span class="text-green-400 text-sm">✓ Connected</span>
              </div>
              <div class="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                <div class="flex items-center mb-2">
                  <i class="fas fa-crown text-2xl text-yellow-400 mr-3"></i>
                  <span class="font-medium">Kling V2.1 Master</span>
                </div>
                <span class="text-green-400 text-sm">✓ Connected</span>
              </div>
            </div>
          </div>

          <div class="glass rounded-2xl p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold">빠른 링크</h2>
            </div>
            <div class="grid sm:grid-cols-3 gap-4">
              <a href="/generate" class="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-center">
                <i class="fas fa-image text-brand-400 text-2xl mb-2"></i>
                <p class="font-medium">이미지 생성</p>
              </a>
              <a href="/generate-video" class="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-center">
                <i class="fas fa-video text-purple-400 text-2xl mb-2"></i>
                <p class="font-medium">영상 생성</p>
              </a>
              <a href="/api/docs" class="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-center">
                <i class="fas fa-book text-green-400 text-2xl mb-2"></i>
                <p class="font-medium">API 문서</p>
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  )
})

// ==================== 어드민 페이지 ====================
app.get('/admin', (c) => {
  return c.render(
    <>
      <nav class="fixed top-0 left-0 right-0 z-50 glass">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <a href="/" class="flex items-center space-x-2">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                <i class="fas fa-shield-halved text-white text-lg"></i>
              </div>
              <span class="text-xl font-bold gradient-text">관리자 Panel</span>
            </a>
            <div class="flex items-center space-x-4">
              <a href="/dashboard" class="px-4 py-2 glass rounded-lg hover:bg-white/10">대시보드</a>
              <a href="/" class="px-4 py-2 glass rounded-lg hover:bg-white/10">Home</a>
            </div>
          </div>
        </div>
      </nav>

      <main class="pt-24 pb-12 px-4 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold mb-8">관리자 Panel</h1>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center mb-4">
                <i class="fas fa-server text-2xl text-green-400 mr-3"></i>
                <span class="text-sm text-gray-400">Server</span>
              </div>
              <div class="text-2xl font-bold text-green-400">Online</div>
            </div>
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center mb-4">
                <i class="fas fa-key text-2xl text-green-400 mr-3"></i>
                <span class="text-sm text-gray-400">API 키</span>
              </div>
              <div class="text-2xl font-bold text-green-400">4 활성</div>
            </div>
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center mb-4">
                <i class="fas fa-image text-2xl text-brand-400 mr-3"></i>
                <span class="text-sm text-gray-400">Image APIs</span>
              </div>
              <div class="text-2xl font-bold text-green-400">2 Ready</div>
            </div>
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center mb-4">
                <i class="fas fa-video text-2xl text-purple-400 mr-3"></i>
                <span class="text-sm text-gray-400">Video APIs</span>
              </div>
              <div class="text-2xl font-bold text-green-400">2 Ready</div>
            </div>
          </div>

          <div class="glass rounded-2xl p-6 mb-8">
            <h2 class="text-xl font-semibold mb-6">API Configuration</h2>
            <div class="space-y-4">
              <div class="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-medium">Fal.ai (Nano Banana)</span>
                    <p class="text-xs text-gray-400 mt-1">b5a2b6f2-f0be-****-****-************</p>
                  </div>
                  <span class="text-green-400">✓ 활성</span>
                </div>
              </div>
              <div class="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-medium">Ideogram</span>
                    <p class="text-xs text-gray-400 mt-1">z9FQ5zQQ****************************</p>
                  </div>
                  <span class="text-green-400">✓ 활성</span>
                </div>
              </div>
              <div class="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-medium">Kling AI (Access Key)</span>
                    <p class="text-xs text-gray-400 mt-1">Ar8mLGAG****************************</p>
                  </div>
                  <span class="text-green-400">✓ 활성</span>
                </div>
              </div>
              <div class="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-medium">Kling AI (Secret Key)</span>
                    <p class="text-xs text-gray-400 mt-1">RfM9F3hJ****************************</p>
                  </div>
                  <span class="text-green-400">✓ 활성</span>
                </div>
              </div>
            </div>
          </div>

          <div class="glass rounded-2xl p-6">
            <h2 class="text-xl font-semibold mb-6">빠른 링크</h2>
            <div class="grid sm:grid-cols-3 gap-4">
              <a href="/api/docs" class="p-4 bg-white/5 rounded-xl hover:bg-white/10">
                <i class="fas fa-book text-brand-400 mr-2"></i>API 문서
              </a>
              <a href="/api/health" class="p-4 bg-white/5 rounded-xl hover:bg-white/10">
                <i class="fas fa-heartbeat text-green-400 mr-2"></i>상태 확인
              </a>
              <a href="https://github.com/ikjoobang/ai-studio-platform" target="_blank" class="p-4 bg-white/5 rounded-xl hover:bg-white/10">
                <i class="fab fa-github text-white mr-2"></i>GitHub
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  )
})

// ==================== API 문서 ====================
app.get('/api/docs', (c) => {
  return c.render(
    <>
      <nav class="fixed top-0 left-0 right-0 z-50 glass">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <span class="text-xl font-bold gradient-text">AI Studio API</span>
            <a href="/" class="px-4 py-2 glass rounded-lg hover:bg-white/10">Home</a>
          </div>
        </div>
      </nav>

      <main class="pt-24 pb-12 px-4 min-h-screen">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-3xl font-bold mb-2">API Documentation</h1>
          <p class="text-gray-400 mb-8">AI Studio REST API Reference</p>
          
          <div class="space-y-6">
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center gap-3 mb-4">
                <span class="px-3 py-1 bg-green-500/20 text-green-400 rounded font-mono text-sm">GET</span>
                <code class="text-white font-mono">/api/health</code>
              </div>
              <p class="text-gray-400 mb-4">Check server and API status</p>
            </div>

            <div class="glass rounded-2xl p-6">
              <div class="flex items-center gap-3 mb-4">
                <span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded font-mono text-sm">POST</span>
                <code class="text-white font-mono">/api/generate-image</code>
              </div>
              <p class="text-gray-400 mb-4">Generate image with Nano Banana or Ideogram</p>
              <pre class="bg-black/30 rounded-lg p-4 text-sm text-yellow-400 font-mono overflow-x-auto">{`{
  "prompt": "A cute dog on the beach",
  "model": "nano-banana" | "ideogram",
  "aspectRatio": "16:9" | "1:1" | "9:16"
}`}</pre>
            </div>

            <div class="glass rounded-2xl p-6">
              <div class="flex items-center gap-3 mb-4">
                <span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded font-mono text-sm">POST</span>
                <code class="text-white font-mono">/api/generate-video</code>
              </div>
              <p class="text-gray-400 mb-4">Generate video with Kling AI</p>
              <pre class="bg-black/30 rounded-lg p-4 text-sm text-yellow-400 font-mono overflow-x-auto">{`{
  "prompt": "A dog running on the beach",
  "model": "kling-v2-5-turbo" | "kling-v2-1-master",
  "duration": "5" | "10",
  "aspectRatio": "16:9" | "9:16" | "1:1"
}`}</pre>
            </div>

            <div class="glass rounded-2xl p-6">
              <div class="flex items-center gap-3 mb-4">
                <span class="px-3 py-1 bg-green-500/20 text-green-400 rounded font-mono text-sm">GET</span>
                <code class="text-white font-mono">/api/video-status/:taskId</code>
              </div>
              <p class="text-gray-400 mb-4">Check video generation status</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
})

// ==================== API Routes ====================

// 상태 확인
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    services: {
      api: 'running',
      fal_api: 'configured',
      ideogram_api: 'configured',
      kling_api: 'configured'
    },
    models: {
      image: ['nano-banana (Fal.ai)', 'ideogram'],
      video: ['kling-v2-5-turbo', 'kling-v2-1-master']
    }
  })
})

// Middleware Status
app.get('/api/middleware/status', (c) => {
  return c.json({
    middlewares: {
      logger: 'active',
      cors: 'active',
      cache: 'active for /static/*'
    }
  })
})

// Cache Info
app.get('/api/cache/info', (c) => {
  return c.json({
    cacheStatus: 'enabled',
    staticFiles: { maxAge: '31536000 (1 year)' }
  })
})

// 내보내기 기록
app.get('/api/export/history', (c) => {
  const historyData = `AI Studio - 생성 리포트
================================
생성일: ${new Date().toISOString()}
버전: 2.0.0

[API 상태]
- Fal.ai (Nano Banana): 활성
- Ideogram: 활성  
- Kling V2.5 Turbo: 활성
- Kling V2.1 Master: 활성

[사용 가능한 모델]
이미지 생성:
- Nano Banana (Fal.ai) - 고품질 이미지 생성
- Ideogram - 로고 및 텍스트 렌더링

영상 생성:
- Kling V2.5 Turbo - 빠른 생성
- Kling V2.1 Master - 최고 품질

================================
AI Studio | https://ai-studio-platform.pages.dev
`

  return new Response(historyData, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="ai-studio-report.txt"'
    }
  })
})

// ==================== 이미지 생성 API ====================
app.post('/api/generate-image', async (c) => {
  try {
    const body = await c.req.json()
    const { prompt, model, aspectRatio } = body
    
    if (!prompt) {
      return c.json({ success: false, error: '프롬프트를 입력해주세요' }, 400)
    }

    const falApiKey = c.env?.FAL_API_KEY || API_KEYS.FAL_API_KEY
    const ideogramApiKey = c.env?.IDEOGRAM_API_KEY || API_KEYS.IDEOGRAM_API_KEY

    if (model === 'nano-banana' || model === 'fal') {
      // Fal.ai API 호출
      const response = await fetch('https://queue.fal.run/fal-ai/flux/dev', {
        method: 'POST',
        headers: {
          'Authorization': `Key ${falApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt,
          image_size: aspectRatio === '16:9' ? 'landscape_16_9' : aspectRatio === '9:16' ? 'portrait_16_9' : 'square',
          num_images: 1,
          enable_safety_checker: false
        })
      })

      const data = await response.json() as { images?: Array<{ url: string }>, request_id?: string, error?: string }
      
      if (data.images && data.images[0]) {
        return c.json({
          success: true,
          imageUrl: data.images[0].url,
          model: 'nano-banana'
        })
      } else if (data.request_id) {
        // Queue 방식 - 결과 폴링
        let attempts = 0
        const maxAttempts = 30
        
        while (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          const statusResponse = await fetch(`https://queue.fal.run/fal-ai/flux/dev/requests/${data.request_id}/status`, {
            headers: { 'Authorization': `Key ${falApiKey}` }
          })
          
          const statusData = await statusResponse.json() as { status: string, response?: { images?: Array<{ url: string }> } }
          
          if (statusData.status === 'COMPLETED' && statusData.response?.images?.[0]) {
            return c.json({
              success: true,
              imageUrl: statusData.response.images[0].url,
              model: 'nano-banana'
            })
          }
          
          attempts++
        }
        
        return c.json({ success: false, error: 'Generation timeout' }, 500)
      } else {
        return c.json({ success: false, error: data.error || 'Fal.ai API error' }, 400)
      }
    } else if (model === 'ideogram') {
      // Ideogram API 호출
      const response = await fetch('https://api.ideogram.ai/generate', {
        method: 'POST',
        headers: {
          'Api-Key': ideogramApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image_request: {
            prompt: prompt,
            aspect_ratio: aspectRatio === '16:9' ? 'ASPECT_16_9' : aspectRatio === '9:16' ? 'ASPECT_9_16' : 'ASPECT_1_1',
            model: 'V_2'
          }
        })
      })

      const data = await response.json() as { data?: Array<{ url: string }>, error?: string }
      
      if (data.data && data.data[0]) {
        return c.json({
          success: true,
          imageUrl: data.data[0].url,
          model: 'ideogram'
        })
      } else {
        return c.json({ success: false, error: data.error || 'Ideogram API error' }, 400)
      }
    }

    return c.json({ success: false, error: 'Invalid model' }, 400)
  } catch (error) {
    console.error('Image generation error:', error)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

// ==================== 영상 생성 API ====================

// JWT 토큰 생성
async function generateKlingJWT(accessKey: string, secretKey: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const payload = { iss: accessKey, exp: now + 1800, nbf: now - 5 }
  
  const base64Header = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const base64Payload = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const signatureInput = base64Header + '.' + base64Payload
  
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(secretKey), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signatureInput))
  const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  
  return signatureInput + '.' + base64Signature
}

// 영상 생성
app.post('/api/generate-video', async (c) => {
  try {
    const body = await c.req.json()
    const { prompt, model, duration, aspectRatio } = body
    
    if (!prompt) {
      return c.json({ success: false, error: '프롬프트를 입력해주세요' }, 400)
    }

    const accessKey = c.env?.KLING_ACCESS_KEY || API_KEYS.KLING_ACCESS_KEY
    const secretKey = c.env?.KLING_SECRET_KEY || API_KEYS.KLING_SECRET_KEY
    
    const token = await generateKlingJWT(accessKey, secretKey)
    
    // 모델명 변환
    let modelName = 'kling-v1'
    if (model === 'kling-v2-5-turbo') {
      modelName = 'kling-v2-5-turbo'
    } else if (model === 'kling-v2-1-master') {
      modelName = 'kling-v2-1-master'
    }
    
    const response = await fetch('https://api.klingai.com/v1/videos/text2video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        model_name: modelName,
        prompt: prompt,
        negative_prompt: 'blurry, low quality, distorted, watermark',
        cfg_scale: 0.5,
        mode: 'std',
        duration: duration || '5',
        aspect_ratio: aspectRatio || '16:9'
      })
    })
    
    const data = await response.json() as { code: number, data?: { task_id: string }, message?: string }
    
    if (data.code === 0 && data.data?.task_id) {
      return c.json({
        success: true,
        taskId: data.data.task_id,
        model: modelName,
        message: '영상 생성이 시작되었습니다'
      })
    } else {
      return c.json({ success: false, error: data.message || 'Kling API error', details: data }, 400)
    }
  } catch (error) {
    console.error('Video generation error:', error)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

// 영상 상태 확인
app.get('/api/video-status/:taskId', async (c) => {
  try {
    const taskId = c.req.param('taskId')
    
    const accessKey = c.env?.KLING_ACCESS_KEY || API_KEYS.KLING_ACCESS_KEY
    const secretKey = c.env?.KLING_SECRET_KEY || API_KEYS.KLING_SECRET_KEY
    
    const token = await generateKlingJWT(accessKey, secretKey)
    
    const response = await fetch('https://api.klingai.com/v1/videos/text2video/' + taskId, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + token }
    })
    
    const data = await response.json() as { 
      code: number
      data?: { task_status: string, task_result?: { videos?: Array<{ url: string }> } }
      message?: string 
    }
    
    if (data.code === 0 && data.data) {
      const status = data.data.task_status
      let videoUrl = null
      
      if (status === 'succeed' && data.data.task_result?.videos?.[0]) {
        videoUrl = data.data.task_result.videos[0].url
      }
      
      return c.json({
        success: true,
        status: status === 'succeed' ? '완료' : status === '실패' ? '실패' : '처리 중',
        videoUrl: videoUrl,
        rawStatus: status
      })
    } else {
      return c.json({ success: false, error: data.message || 'Status check 실패' }, 400)
    }
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500)
  }
})

// Kling 상태
app.get('/api/kling/status', (c) => {
  return c.json({
    configured: true,
    models: ['kling-v2-5-turbo', 'kling-v2-1-master'],
    status: 'active'
  })
})

// 프리셋 API
app.get('/api/presets', (c) => {
  return c.json({
    image: IMAGE_PRESETS,
    video: VIDEO_PRESETS
  })
})

// 비디오 모델 API
app.get('/api/video-models', (c) => {
  return c.json({
    models: [
      {
        id: 'kling-v2-5-turbo',
        name: 'Kling 2.5 Turbo',
        description: '빠른 시네마틱 영상 생성',
        cost: '25 points / 5s',
        features: ['Fast generation', '30% cheaper', 'High quality']
      },
      {
        id: 'kling-v2-1-master',
        name: 'Kling 2.1 Master',
        description: '최고 품질 영상 생성',
        cost: '35 points / 5s',
        features: ['Best quality', '시네마틱 motion', '1080p output']
      }
    ]
  })
})

// 이미지 모델 API
app.get('/api/image-models', (c) => {
  return c.json({
    models: [
      {
        id: 'nano-banana',
        name: 'Nano Banana (Fal.ai)',
        description: 'High quality image generation',
        features: ['Fast', 'High quality', 'Flexible']
      },
      {
        id: 'ideogram',
        name: 'Ideogram',
        description: 'Perfect for logos and text',
        features: ['Text rendering', 'Logo design', 'V2 model']
      }
    ]
  })
})

export default app
