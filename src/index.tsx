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

const app = new Hono<{ Bindings: Bindings }>()

// ==================== 미들웨어 ====================
app.use('*', logger())
app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// 캐시 버스팅 - 정적 파일에 캐시 헤더 추가
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
      {/* Navigation */}
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
              <a href="/generate-video" class="text-gray-300 hover:text-white transition-colors">영상 생성</a>
              <a href="#pricing" class="text-gray-300 hover:text-white transition-colors">요금제</a>
              <a href="/dashboard" class="text-gray-300 hover:text-white transition-colors">대시보드</a>
            </div>
            
            <div class="flex items-center space-x-4">
              <a href="/generate" class="hidden sm:inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-brand-500 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity">
                <i class="fas fa-sparkles mr-2"></i>
                시작하기
              </a>
              <button class="md:hidden text-gray-300 hover:text-white">
                <i class="fas fa-bars text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section class="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4">
        <div class="max-w-6xl mx-auto text-center">
          <div class="inline-flex items-center px-4 py-2 rounded-full glass mb-8">
            <span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            <span class="text-sm text-gray-300">크레딧 종량제 · 1년간 유효</span>
          </div>
          
          <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span class="gradient-text">AI로 만드는</span>
            <br />
            <span class="text-white">무한한 창작의 세계</span>
          </h1>
          
          <p class="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Nano Banana, Ideogram 등 최고의 AI 도구를 하나의 플랫폼에서.
            <br class="hidden sm:block" />
            이미지 생성부터 편집, 합성까지 모든 것을 한 곳에서 해결하세요.
          </p>
          
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a href="/generate" class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-500 to-purple-600 rounded-xl font-semibold text-lg hover:opacity-90 transition-all pulse-glow">
              <i class="fas fa-rocket mr-2"></i>
              무료로 시작하기
            </a>
            <a href="#tools" class="w-full sm:w-auto px-8 py-4 glass rounded-xl font-semibold text-lg hover:bg-white/10 transition-all">
              <i class="fas fa-play mr-2"></i>
              AI 도구 둘러보기
            </a>
          </div>
          
          {/* Stats */}
          <div class="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
            <div class="glass rounded-xl p-4 sm:p-6">
              <div class="text-2xl sm:text-4xl font-bold gradient-text mb-1">80%</div>
              <div class="text-xs sm:text-sm text-gray-400">비용 절감</div>
            </div>
            <div class="glass rounded-xl p-4 sm:p-6">
              <div class="text-2xl sm:text-4xl font-bold gradient-text mb-1">10x</div>
              <div class="text-xs sm:text-sm text-gray-400">속도 향상</div>
            </div>
            <div class="glass rounded-xl p-4 sm:p-6">
              <div class="text-2xl sm:text-4xl font-bold gradient-text mb-1">4K</div>
              <div class="text-xs sm:text-sm text-gray-400">고화질 출력</div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 float-animation">
          <a href="#features" class="text-gray-400 hover:text-white transition-colors">
            <i class="fas fa-chevron-down text-2xl"></i>
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" class="py-20 sm:py-32 px-4">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              왜 <span class="gradient-text">AI Studio</span>인가?
            </h2>
            <p class="text-gray-400 text-lg max-w-2xl mx-auto">
              기존 AI 도구와는 차원이 다른 접근 방식
            </p>
          </div>
          
          <div class="grid md:grid-cols-3 gap-6 lg:gap-8">
            <div class="glass rounded-2xl p-6 sm:p-8 card-hover">
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-500/5 flex items-center justify-center mb-6">
                <i class="fas fa-wand-magic-sparkles text-2xl text-brand-400"></i>
              </div>
              <h3 class="text-xl font-semibold mb-3">직관적인 프롬프트</h3>
              <p class="text-gray-400 leading-relaxed mb-4">
                한국어로 자연스럽게 설명하세요. AI가 최적의 이미지를 생성합니다.
              </p>
              <ul class="space-y-2 text-sm text-gray-400">
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>한국어 지원</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>프리셋 템플릿</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>자동 프롬프트 최적화</li>
              </ul>
            </div>
            
            <div class="glass rounded-2xl p-6 sm:p-8 card-hover">
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center mb-6">
                <i class="fas fa-layer-group text-2xl text-purple-400"></i>
              </div>
              <h3 class="text-xl font-semibold mb-3">통합 AI 플랫폼</h3>
              <p class="text-gray-400 leading-relaxed mb-4">
                여러 AI 서비스를 한 곳에서. 목적에 맞는 최적의 도구를 선택하세요.
              </p>
              <ul class="space-y-2 text-sm text-gray-400">
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Nano Banana</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Ideogram</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>더 많은 AI 추가 예정</li>
              </ul>
            </div>
            
            <div class="glass rounded-2xl p-6 sm:p-8 card-hover">
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-500/5 flex items-center justify-center mb-6">
                <i class="fas fa-coins text-2xl text-pink-400"></i>
              </div>
              <h3 class="text-xl font-semibold mb-3">크레딧 종량제</h3>
              <p class="text-gray-400 leading-relaxed mb-4">
                월 구독 부담 없이. 사용한 만큼만 지불하고, 크레딧은 1년간 유효합니다.
              </p>
              <ul class="space-y-2 text-sm text-gray-400">
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>종량제 과금</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>1년 유효기간</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>투명한 가격</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section id="tools" class="py-20 sm:py-32 px-4 bg-gradient-to-b from-transparent via-brand-900/10 to-transparent">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span class="gradient-text">AI 도구</span> 컬렉션
            </h2>
            <p class="text-gray-400 text-lg max-w-2xl mx-auto">
              각 도구마다 특화된 분야가 있습니다. 목적에 맞게 선택하세요.
            </p>
          </div>
          
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <a href="/generate" class="group">
              <div class="gradient-border card-hover">
                <div class="gradient-border-inner p-6 sm:p-8">
                  <div class="flex items-start justify-between mb-4">
                    <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                      <span class="text-3xl">🍌</span>
                    </div>
                    <span class="px-3 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">인기</span>
                  </div>
                  <h3 class="text-xl font-semibold mb-2 group-hover:text-brand-400 transition-colors">Nano Banana</h3>
                  <p class="text-gray-400 text-sm leading-relaxed mb-4">
                    부분 편집이 쉽고 자연스러운 이미지 생성. 인물, 제품, 인테리어 등 다양한 활용.
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <span class="px-2 py-1 text-xs bg-white/5 rounded">이미지 생성</span>
                    <span class="px-2 py-1 text-xs bg-white/5 rounded">부분 편집</span>
                    <span class="px-2 py-1 text-xs bg-white/5 rounded">합성</span>
                  </div>
                </div>
              </div>
            </a>
            
            <a href="/generate" class="group">
              <div class="glass rounded-xl card-hover p-6 sm:p-8">
                <div class="flex items-start justify-between mb-4">
                  <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                    <i class="fas fa-font text-2xl text-white"></i>
                  </div>
                  <span class="px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full">텍스트 특화</span>
                </div>
                <h3 class="text-xl font-semibold mb-2 group-hover:text-brand-400 transition-colors">Ideogram</h3>
                <p class="text-gray-400 text-sm leading-relaxed mb-4">
                  영어 텍스트 렌더링에 특화. 로고, 포스터, 배너 등 텍스트가 필요한 이미지에 최적.
                </p>
                <div class="flex flex-wrap gap-2">
                  <span class="px-2 py-1 text-xs bg-white/5 rounded">로고 생성</span>
                  <span class="px-2 py-1 text-xs bg-white/5 rounded">텍스트 렌더링</span>
                  <span class="px-2 py-1 text-xs bg-white/5 rounded">포스터</span>
                </div>
              </div>
            </a>
            
            <a href="/generate-video" class="group">
              <div class="glass rounded-xl card-hover p-6 sm:p-8">
                <div class="flex items-start justify-between mb-4">
                  <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <i class="fas fa-video text-2xl text-white"></i>
                  </div>
                  <span class="px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-400 rounded-full">영상 생성</span>
                </div>
                <h3 class="text-xl font-semibold mb-2 group-hover:text-brand-400 transition-colors">Kling AI</h3>
                <p class="text-gray-400 text-sm leading-relaxed mb-4">
                  텍스트나 이미지로 고품질 AI 영상 생성. 5초~10초 영상을 빠르게 제작.
                </p>
                <div class="flex flex-wrap gap-2">
                  <span class="px-2 py-1 text-xs bg-white/5 rounded">텍스트→영상</span>
                  <span class="px-2 py-1 text-xs bg-white/5 rounded">이미지→영상</span>
                  <span class="px-2 py-1 text-xs bg-white/5 rounded">1080p</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" class="py-20 sm:py-32 px-4 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div class="max-w-5xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              합리적인 <span class="gradient-text">요금제</span>
            </h2>
            <p class="text-gray-400 text-lg max-w-2xl mx-auto">
              월 구독이 아닌 크레딧 종량제. 사용한 만큼만 지불하세요.
            </p>
          </div>
          
          <div class="grid sm:grid-cols-3 gap-6 lg:gap-8">
            <div class="glass rounded-2xl p-6 sm:p-8 card-hover">
              <div class="text-center mb-6">
                <h3 class="text-xl font-semibold mb-2">Starter</h3>
                <div class="text-4xl font-bold mb-1">$29</div>
                <p class="text-gray-400 text-sm">630 크레딧</p>
              </div>
              <ul class="space-y-3 mb-8 text-sm">
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>약 63회 이미지 생성</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>모든 AI 도구 사용</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>1년 유효기간</li>
              </ul>
              <a href="/generate" class="block text-center py-3 px-6 rounded-xl glass hover:bg-white/10 transition-all font-medium">
                시작하기
              </a>
            </div>
            
            <div class="gradient-border card-hover">
              <div class="gradient-border-inner p-6 sm:p-8 relative overflow-hidden">
                <div class="absolute top-0 right-0 bg-gradient-to-r from-brand-500 to-purple-600 text-xs font-medium px-4 py-1 rounded-bl-xl">
                  인기
                </div>
                <div class="text-center mb-6">
                  <h3 class="text-xl font-semibold mb-2">Pro</h3>
                  <div class="text-4xl font-bold gradient-text mb-1">$59</div>
                  <p class="text-gray-400 text-sm">1,500 크레딧</p>
                </div>
                <ul class="space-y-3 mb-8 text-sm">
                  <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>약 150회 이미지 생성</li>
                  <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>모든 AI 도구 사용</li>
                  <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>1년 유효기간</li>
                  <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>우선 생성 큐</li>
                </ul>
                <a href="/generate" class="block text-center py-3 px-6 rounded-xl bg-gradient-to-r from-brand-500 to-purple-600 hover:opacity-90 transition-all font-medium">
                  가장 인기있는 선택
                </a>
              </div>
            </div>
            
            <div class="glass rounded-2xl p-6 sm:p-8 card-hover">
              <div class="text-center mb-6">
                <h3 class="text-xl font-semibold mb-2">Business</h3>
                <div class="text-4xl font-bold mb-1">$119</div>
                <p class="text-gray-400 text-sm">3,500 크레딧</p>
              </div>
              <ul class="space-y-3 mb-8 text-sm">
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>약 350회 이미지 생성</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>모든 AI 도구 사용</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>1년 유효기간</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>팀 공유 기능</li>
              </ul>
              <a href="/generate" class="block text-center py-3 px-6 rounded-xl glass hover:bg-white/10 transition-all font-medium">
                비즈니스 시작
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section class="py-20 sm:py-32 px-4">
        <div class="max-w-4xl mx-auto text-center">
          <div class="glass rounded-3xl p-8 sm:p-12 lg:p-16">
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              지금 바로 <span class="gradient-text">시작하세요</span>
            </h2>
            <p class="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              무료 체험 크레딧으로 AI 이미지 생성의 세계를 경험해보세요.
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/generate" class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-500 to-purple-600 rounded-xl font-semibold text-lg hover:opacity-90 transition-all pulse-glow">
                <i class="fas fa-rocket mr-2"></i>
                무료로 체험하기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer class="border-t border-white/10 py-12 px-4">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center space-x-2">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                <i class="fas fa-wand-magic-sparkles text-white text-lg"></i>
              </div>
              <span class="text-xl font-bold gradient-text">AI Studio</span>
            </div>
            <div class="flex items-center space-x-6 text-sm text-gray-400">
              <a href="/api/docs" class="hover:text-white transition-colors">API 문서</a>
              <a href="/admin" class="hover:text-white transition-colors">관리자</a>
              <a href="#" class="hover:text-white transition-colors">이용약관</a>
            </div>
            <p class="text-sm text-gray-500">
              © 2024 AI Studio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
})

// ==================== 대시보드 페이지 ====================
app.get('/dashboard', (c) => {
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
              <a href="/generate" class="px-4 py-2 glass rounded-lg hover:bg-white/10">생성하기</a>
              <a href="/admin" class="px-4 py-2 glass rounded-lg hover:bg-white/10">관리자</a>
            </div>
          </div>
        </div>
      </nav>

      <main class="pt-24 pb-12 px-4 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold mb-8">대시보드</h1>
          
          {/* 통계 카드 */}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center justify-between mb-4">
                <i class="fas fa-coins text-2xl text-yellow-400"></i>
                <span class="text-xs text-green-400">+12%</span>
              </div>
              <div class="text-3xl font-bold mb-1">100</div>
              <div class="text-sm text-gray-400">남은 크레딧</div>
            </div>
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center justify-between mb-4">
                <i class="fas fa-image text-2xl text-brand-400"></i>
                <span class="text-xs text-green-400">+5</span>
              </div>
              <div class="text-3xl font-bold mb-1">24</div>
              <div class="text-sm text-gray-400">생성된 이미지</div>
            </div>
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center justify-between mb-4">
                <i class="fas fa-clock text-2xl text-purple-400"></i>
              </div>
              <div class="text-3xl font-bold mb-1">365</div>
              <div class="text-sm text-gray-400">남은 유효기간 (일)</div>
            </div>
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center justify-between mb-4">
                <i class="fas fa-download text-2xl text-pink-400"></i>
              </div>
              <div class="text-3xl font-bold mb-1">18</div>
              <div class="text-sm text-gray-400">다운로드 횟수</div>
            </div>
          </div>

          {/* 최근 생성 내역 */}
          <div class="glass rounded-2xl p-6 mb-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold">최근 생성 내역</h2>
              <a href="/api/export/history?format=txt" class="px-4 py-2 glass rounded-lg text-sm hover:bg-white/10">
                <i class="fas fa-download mr-2"></i>TXT 다운로드
              </a>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="text-left text-sm text-gray-400 border-b border-white/10">
                    <th class="pb-3">날짜</th>
                    <th class="pb-3">AI 도구</th>
                    <th class="pb-3">프롬프트</th>
                    <th class="pb-3">크레딧</th>
                    <th class="pb-3">상태</th>
                  </tr>
                </thead>
                <tbody class="text-sm">
                  <tr class="border-b border-white/5">
                    <td class="py-4">2024-12-27</td>
                    <td class="py-4"><span class="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">Nano Banana</span></td>
                    <td class="py-4 max-w-xs truncate">한강에서 러닝하는 여성...</td>
                    <td class="py-4">10</td>
                    <td class="py-4"><span class="text-green-400">완료</span></td>
                  </tr>
                  <tr class="border-b border-white/5">
                    <td class="py-4">2024-12-26</td>
                    <td class="py-4"><span class="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Ideogram</span></td>
                    <td class="py-4 max-w-xs truncate">카페 로고 디자인...</td>
                    <td class="py-4">15</td>
                    <td class="py-4"><span class="text-green-400">완료</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 크레딧 사용량 차트 영역 */}
          <div class="glass rounded-2xl p-6">
            <h2 class="text-xl font-semibold mb-6">크레딧 사용량</h2>
            <div class="h-64 flex items-center justify-center text-gray-500">
              <i class="fas fa-chart-line text-6xl opacity-30"></i>
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
          <div class="flex items-center justify-between h-16 md:h-20">
            <a href="/" class="flex items-center space-x-2">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                <i class="fas fa-shield-halved text-white text-lg"></i>
              </div>
              <span class="text-xl font-bold gradient-text">Admin Panel</span>
            </a>
            <div class="flex items-center space-x-4">
              <a href="/dashboard" class="px-4 py-2 glass rounded-lg hover:bg-white/10">대시보드</a>
              <a href="/" class="px-4 py-2 glass rounded-lg hover:bg-white/10">홈으로</a>
            </div>
          </div>
        </div>
      </nav>

      <main class="pt-24 pb-12 px-4 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold mb-8">
            <i class="fas fa-cog mr-2"></i>
            관리자 패널
          </h1>
          
          {/* 시스템 상태 */}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center mb-4">
                <i class="fas fa-server text-2xl text-green-400 mr-3"></i>
                <span class="text-sm text-gray-400">서버 상태</span>
              </div>
              <div class="text-2xl font-bold text-green-400">정상</div>
            </div>
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center mb-4">
                <i class="fas fa-database text-2xl text-brand-400 mr-3"></i>
                <span class="text-sm text-gray-400">데이터베이스</span>
              </div>
              <div class="text-2xl font-bold text-green-400">연결됨</div>
            </div>
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center mb-4">
                <i class="fas fa-key text-2xl text-yellow-400 mr-3"></i>
                <span class="text-sm text-gray-400">API 키</span>
              </div>
              <div class="text-2xl font-bold text-yellow-400">미설정</div>
            </div>
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center mb-4">
                <i class="fas fa-users text-2xl text-purple-400 mr-3"></i>
                <span class="text-sm text-gray-400">총 사용자</span>
              </div>
              <div class="text-2xl font-bold">0</div>
            </div>
          </div>

          {/* API 키 설정 */}
          <div class="glass rounded-2xl p-6 mb-8">
            <h2 class="text-xl font-semibold mb-6">
              <i class="fas fa-key mr-2"></i>
              API 키 설정
            </h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm text-gray-400 mb-2">Fal.ai API Key (Nano Banana)</label>
                <input type="password" placeholder="fal_..." class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white" />
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-2">Ideogram API Key</label>
                <input type="password" placeholder="ide_..." class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white" />
              </div>
              <button class="px-6 py-3 bg-gradient-to-r from-brand-500 to-purple-600 rounded-xl font-medium hover:opacity-90">
                저장하기
              </button>
              <p class="text-xs text-gray-500 mt-2">
                * API 키는 Cloudflare 환경변수로 설정하는 것을 권장합니다.
              </p>
            </div>
          </div>

          {/* 결제 관리 */}
          <div class="glass rounded-2xl p-6 mb-8">
            <h2 class="text-xl font-semibold mb-6">
              <i class="fas fa-credit-card mr-2"></i>
              결제 관리
            </h2>
            <div class="grid sm:grid-cols-2 gap-6">
              <div class="p-4 bg-white/5 rounded-xl">
                <h3 class="font-medium mb-2">카드결제 승인</h3>
                <p class="text-sm text-gray-400 mb-4">Stripe/토스페이먼츠 연동 필요</p>
                <span class="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm">미설정</span>
              </div>
              <div class="p-4 bg-white/5 rounded-xl">
                <h3 class="font-medium mb-2">카드결제 롤백</h3>
                <p class="text-sm text-gray-400 mb-4">환불 처리 시스템</p>
                <span class="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm">미설정</span>
              </div>
            </div>
          </div>

          {/* 빠른 링크 */}
          <div class="glass rounded-2xl p-6">
            <h2 class="text-xl font-semibold mb-6">
              <i class="fas fa-link mr-2"></i>
              빠른 링크
            </h2>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <a href="/api/docs" class="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                <i class="fas fa-book text-brand-400 mr-2"></i>
                API 문서
              </a>
              <a href="/api/health" class="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                <i class="fas fa-heartbeat text-green-400 mr-2"></i>
                Health Check
              </a>
              <a href="https://github.com/ikjoobang/ai-studio-platform" target="_blank" class="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                <i class="fab fa-github text-white mr-2"></i>
                GitHub 저장소
              </a>
            </div>
          </div>
        </div>
      </main>
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
              <div class="hidden sm:flex items-center px-4 py-2 glass rounded-lg">
                <i class="fas fa-coins text-yellow-400 mr-2"></i>
                <span class="font-medium">100</span>
                <span class="text-gray-400 ml-1 text-sm">크레딧</span>
              </div>
              <a href="/dashboard" class="text-gray-300 hover:text-white transition-colors">
                <i class="fas fa-chart-line text-xl"></i>
              </a>
              <a href="/" class="text-gray-300 hover:text-white transition-colors">
                <i class="fas fa-home text-xl"></i>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main class="pt-24 pb-12 px-4 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-8">
            {/* Left Panel */}
            <div class="space-y-6">
              <div class="glass rounded-2xl p-6">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-robot text-brand-400 mr-2"></i>
                  AI 도구 선택
                </h2>
                <div class="grid grid-cols-2 gap-3">
                  <button id="btn-nano" class="p-4 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 transition-all">
                    <span class="text-2xl mb-2 block">🍌</span>
                    <span class="font-medium">Nano Banana</span>
                    <span class="text-xs text-gray-400 block mt-1">이미지 생성 · 편집</span>
                  </button>
                  <button id="btn-ideogram" class="p-4 rounded-xl glass border-2 border-transparent hover:border-white/20 transition-all">
                    <span class="text-2xl mb-2 block"><i class="fas fa-font text-cyan-400"></i></span>
                    <span class="font-medium">Ideogram</span>
                    <span class="text-xs text-gray-400 block mt-1">로고 · 텍스트</span>
                  </button>
                </div>
              </div>

              <div class="glass rounded-2xl p-6">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-pen-fancy text-brand-400 mr-2"></i>
                  무엇을 만들까요?
                </h2>
                <textarea
                  id="prompt-input"
                  class="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors resize-none"
                  placeholder="예: 한강에서 자전거 타는 강아지, 카페 로고, 우주를 나는 고래..."
                ></textarea>
                
                <div class="mt-4">
                  <span class="text-sm text-gray-400 mb-2 block">빠른 프리셋</span>
                  <div class="flex flex-wrap gap-2">
                    <button class="preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all">📷 실사 스타일</button>
                    <button class="preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all">🎨 애니메이션</button>
                    <button class="preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all">🌅 골든아워</button>
                    <button class="preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all">🏙️ 시네마틱</button>
                  </div>
                </div>
              </div>

              <div class="glass rounded-2xl p-6">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-sliders text-brand-400 mr-2"></i>
                  설정
                </h2>
                <div class="mb-4">
                  <label class="text-sm text-gray-400 mb-2 block">이미지 비율</label>
                  <div class="grid grid-cols-4 gap-2">
                    <button class="ratio-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10">1:1</button>
                    <button class="ratio-btn px-3 py-2 text-sm rounded-lg bg-brand-500/20 border border-brand-500/50">16:9</button>
                    <button class="ratio-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10">9:16</button>
                    <button class="ratio-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10">4:3</button>
                  </div>
                </div>
                <div>
                  <label class="text-sm text-gray-400 mb-2 block">생성 개수</label>
                  <div class="grid grid-cols-4 gap-2">
                    <button class="count-btn px-3 py-2 text-sm rounded-lg bg-brand-500/20 border border-brand-500/50">1장</button>
                    <button class="count-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10">2장</button>
                    <button class="count-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10">3장</button>
                    <button class="count-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10">4장</button>
                  </div>
                </div>
              </div>

              <button id="generate-btn" class="w-full py-4 bg-gradient-to-r from-brand-500 to-purple-600 rounded-xl font-semibold text-lg hover:opacity-90 transition-all pulse-glow flex items-center justify-center">
                <i class="fas fa-sparkles mr-2"></i>
                이미지 생성하기
                <span class="ml-2 px-2 py-0.5 bg-white/20 rounded text-sm">10 크레딧</span>
              </button>
            </div>

            {/* Right Panel */}
            <div class="space-y-6">
              <div class="glass rounded-2xl p-6 min-h-[500px] lg:min-h-[600px] flex flex-col">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-eye text-brand-400 mr-2"></i>
                  결과 미리보기
                </h2>
                <div id="preview-area" class="flex-1 flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl">
                  <div class="text-center p-8">
                    <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                      <i class="fas fa-image text-4xl text-gray-500"></i>
                    </div>
                    <p class="text-gray-400 mb-2">생성된 이미지가 여기에 표시됩니다</p>
                  </div>
                </div>
                <div class="mt-4 flex gap-3">
                  <button disabled class="flex-1 py-3 rounded-xl glass text-gray-500 cursor-not-allowed">
                    <i class="fas fa-download mr-2"></i>다운로드
                  </button>
                  <button disabled class="flex-1 py-3 rounded-xl glass text-gray-500 cursor-not-allowed">
                    <i class="fas fa-wand-magic mr-2"></i>편집하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <script dangerouslySetInnerHTML={{
        __html: `
          // 생성 버튼
          document.getElementById('generate-btn').addEventListener('click', function() {
            const btn = this;
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>생성 중...';
            btn.disabled = true;
            
            setTimeout(() => {
              btn.innerHTML = originalText;
              btn.disabled = false;
              alert('API 키가 설정되지 않았습니다. 관리자에게 문의하세요.');
            }, 2000);
          });
          
          // AI 도구 선택 버튼
          document.querySelectorAll('#btn-nano, #btn-ideogram').forEach(btn => {
            btn.addEventListener('click', function() {
              document.querySelectorAll('#btn-nano, #btn-ideogram').forEach(b => {
                b.classList.remove('border-yellow-500/50', 'border-cyan-500/50', 'bg-gradient-to-br', 'from-yellow-500/20', 'to-orange-500/20');
                b.classList.add('border-transparent', 'glass');
              });
              if (this.id === 'btn-nano') {
                this.classList.remove('border-transparent', 'glass');
                this.classList.add('border-yellow-500/50', 'bg-gradient-to-br', 'from-yellow-500/20', 'to-orange-500/20');
              } else {
                this.classList.remove('border-transparent', 'glass');
                this.classList.add('border-cyan-500/50', 'bg-gradient-to-br', 'from-blue-500/20', 'to-cyan-500/20');
              }
            });
          });
          
          // 이미지 비율 버튼
          document.querySelectorAll('.ratio-btn').forEach(btn => {
            btn.addEventListener('click', function() {
              document.querySelectorAll('.ratio-btn').forEach(b => {
                b.style.background = 'rgba(255,255,255,0.05)';
                b.style.border = '1px solid rgba(255,255,255,0.1)';
                b.style.color = '#cbd5e1';
              });
              this.style.background = 'rgba(14, 165, 233, 0.3)';
              this.style.border = '2px solid #38bdf8';
              this.style.color = '#ffffff';
            });
          });
          
          // 생성 개수 버튼
          document.querySelectorAll('.count-btn').forEach(btn => {
            btn.addEventListener('click', function() {
              document.querySelectorAll('.count-btn').forEach(b => {
                b.style.background = 'rgba(255,255,255,0.05)';
                b.style.border = '1px solid rgba(255,255,255,0.1)';
                b.style.color = '#cbd5e1';
              });
              this.style.background = 'rgba(14, 165, 233, 0.3)';
              this.style.border = '2px solid #38bdf8';
              this.style.color = '#ffffff';
            });
          });
          
          // 프리셋 버튼
          document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', function() {
              // 선택 표시
              document.querySelectorAll('.preset-btn').forEach(b => {
                b.classList.remove('bg-brand-500/30', 'border-2', 'border-brand-400');
              });
              this.classList.add('bg-brand-500/30', 'border-2', 'border-brand-400');
              
              const presets = {
                '📷 실사 스타일': ', 실사 광고 사진 스타일, 고화질, 4K',
                '🎨 애니메이션': ', 2D 애니메이션 스타일, 지브리 스타일',
                '🌅 골든아워': ', 골든아워 조명, 따뜻한 햇살',
                '🏙️ 시네마틱': ', 시네마틱 구도, 영화 스틸컷 스타일'
              };
              const textarea = document.getElementById('prompt-input');
              const presetText = presets[this.textContent.trim()];
              if (presetText && textarea) {
                textarea.value = textarea.value + presetText;
                textarea.focus();
              }
            });
          });
        `
      }} />
    </>
  )
})

// ==================== API 문서 (Swagger 스타일) ====================
app.get('/api/docs', (c) => {
  return c.render(
    <>
      <nav class="fixed top-0 left-0 right-0 z-50 glass">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <a href="/" class="flex items-center space-x-2">
              <span class="text-xl font-bold gradient-text">AI Studio API</span>
            </a>
            <a href="/" class="px-4 py-2 glass rounded-lg hover:bg-white/10">홈으로</a>
          </div>
        </div>
      </nav>

      <main class="pt-24 pb-12 px-4 min-h-screen">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-3xl font-bold mb-2">API 문서</h1>
          <p class="text-gray-400 mb-8">AI Studio REST API 레퍼런스</p>
          
          <div class="space-y-6">
            {/* Health Check */}
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center gap-3 mb-4">
                <span class="px-3 py-1 bg-green-500/20 text-green-400 rounded font-mono text-sm">GET</span>
                <code class="text-white font-mono">/api/health</code>
              </div>
              <p class="text-gray-400 mb-4">서버 상태를 확인합니다.</p>
              <div class="bg-black/30 rounded-lg p-4">
                <p class="text-xs text-gray-500 mb-2">Response:</p>
                <pre class="text-sm text-green-400 font-mono">{`{
  "status": "ok",
  "timestamp": "2024-12-27T00:00:00.000Z"
}`}</pre>
              </div>
            </div>

            {/* Generate */}
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center gap-3 mb-4">
                <span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded font-mono text-sm">POST</span>
                <code class="text-white font-mono">/api/generate</code>
              </div>
              <p class="text-gray-400 mb-4">AI 이미지를 생성합니다.</p>
              <div class="bg-black/30 rounded-lg p-4 mb-4">
                <p class="text-xs text-gray-500 mb-2">Request Body:</p>
                <pre class="text-sm text-yellow-400 font-mono">{`{
  "prompt": "한강에서 러닝하는 여성",
  "model": "nano-banana",
  "aspectRatio": "16:9",
  "numImages": 1
}`}</pre>
              </div>
              <div class="bg-black/30 rounded-lg p-4">
                <p class="text-xs text-gray-500 mb-2">Response:</p>
                <pre class="text-sm text-green-400 font-mono">{`{
  "success": true,
  "images": ["https://..."],
  "creditsUsed": 10
}`}</pre>
              </div>
            </div>

            {/* Export */}
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center gap-3 mb-4">
                <span class="px-3 py-1 bg-green-500/20 text-green-400 rounded font-mono text-sm">GET</span>
                <code class="text-white font-mono">/api/export/history</code>
              </div>
              <p class="text-gray-400 mb-4">생성 내역을 TXT/PDF로 내보냅니다.</p>
              <div class="bg-black/30 rounded-lg p-4">
                <p class="text-xs text-gray-500 mb-2">Query Parameters:</p>
                <pre class="text-sm text-purple-400 font-mono">{`format: "txt" | "pdf"
startDate: "2024-01-01"
endDate: "2024-12-31"`}</pre>
              </div>
            </div>

            {/* Database */}
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center gap-3 mb-4">
                <span class="px-3 py-1 bg-green-500/20 text-green-400 rounded font-mono text-sm">GET</span>
                <code class="text-white font-mono">/api/db/status</code>
              </div>
              <p class="text-gray-400 mb-4">데이터베이스 연결 상태를 확인합니다.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
})

// ==================== API Routes ====================

// Health Check
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      api: 'running',
      database: c.env?.DB ? 'connected' : 'not_configured',
      fal_api: c.env?.FAL_API_KEY ? 'configured' : 'not_configured',
      ideogram_api: c.env?.IDEOGRAM_API_KEY ? 'configured' : 'not_configured'
    }
  })
})

// Database Status
app.get('/api/db/status', async (c) => {
  try {
    if (!c.env?.DB) {
      return c.json({ 
        status: 'not_configured',
        message: 'D1 데이터베이스가 설정되지 않았습니다.' 
      })
    }
    
    // D1 연결 테스트
    const result = await c.env.DB.prepare('SELECT 1 as test').first()
    return c.json({ 
      status: 'connected',
      message: '데이터베이스 연결 성공',
      test: result
    })
  } catch (error) {
    return c.json({ 
      status: 'error',
      message: '데이터베이스 연결 실패',
      error: String(error)
    }, 500)
  }
})

// Generate Image
app.post('/api/generate', async (c) => {
  try {
    const body = await c.req.json()
    const { prompt, model, aspectRatio, numImages } = body
    
    if (!prompt) {
      return c.json({ success: false, error: '프롬프트를 입력해주세요.' }, 400)
    }
    
    // API 키 확인
    if (model === 'nano-banana' && !c.env?.FAL_API_KEY) {
      return c.json({
        success: false,
        error: 'FAL_API_KEY가 설정되지 않았습니다.',
        message: '환경변수를 설정해주세요.'
      }, 400)
    }
    
    if (model === 'ideogram' && !c.env?.IDEOGRAM_API_KEY) {
      return c.json({
        success: false,
        error: 'IDEOGRAM_API_KEY가 설정되지 않았습니다.',
        message: '환경변수를 설정해주세요.'
      }, 400)
    }
    
    // TODO: 실제 API 호출 구현
    return c.json({
      success: false,
      error: 'API 키가 설정되지 않았습니다.',
      message: '관리자에게 문의하세요.'
    }, 400)
  } catch (error) {
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

// Export History (TXT/PDF)
app.get('/api/export/history', (c) => {
  const format = c.req.query('format') || 'txt'
  
  // 샘플 데이터
  const historyData = `AI Studio - 생성 내역 보고서
================================
생성일: ${new Date().toISOString()}

[최근 생성 내역]
1. 2024-12-27 | Nano Banana | 한강에서 러닝하는 여성 | 10 크레딧 | 완료
2. 2024-12-26 | Ideogram | 카페 로고 디자인 | 15 크레딧 | 완료
3. 2024-12-25 | Nano Banana | 제품 광고 이미지 | 10 크레딧 | 완료

[크레딧 요약]
- 총 사용 크레딧: 35
- 남은 크레딧: 65
- 유효기간: 2025-12-27

================================
AI Studio | https://ai-studio-platform.pages.dev
`

  if (format === 'txt') {
    return new Response(historyData, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'attachment; filename="ai-studio-history.txt"',
        'Cache-Control': 'no-cache'
      }
    })
  }
  
  // PDF는 별도 라이브러리 필요 - TXT로 대체
  return new Response(historyData, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': 'attachment; filename="ai-studio-history.txt"',
      'Cache-Control': 'no-cache'
    }
  })
})

// Middleware 상태 확인
app.get('/api/middleware/status', (c) => {
  return c.json({
    middlewares: {
      logger: 'active',
      cors: 'active',
      cache: 'active for /static/*'
    },
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization']
    }
  })
})

// 캐시 버스팅 확인
app.get('/api/cache/info', (c) => {
  return c.json({
    cacheStatus: 'enabled',
    staticFiles: {
      maxAge: '31536000 (1 year)',
      cacheName: 'ai-studio-static'
    },
    bustingMethod: 'version query parameter',
    example: '/static/app.js?v=1.0.0'
  })
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
              <div class="hidden sm:flex items-center px-4 py-2 glass rounded-lg">
                <i class="fas fa-coins text-yellow-400 mr-2"></i>
                <span class="font-medium">642.5</span>
                <span class="text-gray-400 ml-1 text-sm">포인트</span>
              </div>
              <div class="hidden sm:flex items-center px-3 py-1.5 bg-red-500/20 rounded-lg">
                <i class="fas fa-clock text-red-400 mr-2"></i>
                <span class="text-red-400 text-sm">만료: 2026-01-18</span>
              </div>
              <a href="/generate" class="text-gray-300 hover:text-white transition-colors">
                <i class="fas fa-image text-xl"></i>
              </a>
              <a href="/" class="text-gray-300 hover:text-white transition-colors">
                <i class="fas fa-home text-xl"></i>
              </a>
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
            <p class="text-gray-400">Kling AI로 텍스트나 이미지를 고품질 영상으로 변환하세요</p>
          </div>

          <div class="grid lg:grid-cols-2 gap-8">
            {/* Left Panel */}
            <div class="space-y-6">
              {/* 생성 모드 선택 */}
              <div class="glass rounded-2xl p-6">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-wand-sparkles text-purple-400 mr-2"></i>
                  생성 모드
                </h2>
                <div class="grid grid-cols-2 gap-3">
                  <button id="mode-text" class="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 transition-all">
                    <i class="fas fa-keyboard text-2xl mb-2 block text-purple-400"></i>
                    <span class="font-medium">텍스트 → 영상</span>
                    <span class="text-xs text-gray-400 block mt-1">프롬프트로 영상 생성</span>
                  </button>
                  <button id="mode-image" class="p-4 rounded-xl glass border-2 border-transparent hover:border-white/20 transition-all">
                    <i class="fas fa-image text-2xl mb-2 block text-cyan-400"></i>
                    <span class="font-medium">이미지 → 영상</span>
                    <span class="text-xs text-gray-400 block mt-1">이미지를 영상으로 변환</span>
                  </button>
                </div>
              </div>

              {/* 프롬프트 입력 */}
              <div class="glass rounded-2xl p-6">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-pen-fancy text-purple-400 mr-2"></i>
                  어떤 영상을 만들까요?
                </h2>
                <textarea
                  id="video-prompt"
                  class="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  placeholder="예: 해변에서 달리는 강아지, 우주를 나는 고래, 숲 속을 걷는 사람..."
                ></textarea>
                
                <div class="mt-4">
                  <span class="text-sm text-gray-400 mb-2 block">빠른 프리셋</span>
                  <div class="flex flex-wrap gap-2">
                    <button class="video-preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all">🌊 시네마틱</button>
                    <button class="video-preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all">🎬 슬로우모션</button>
                    <button class="video-preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all">✨ 판타지</button>
                    <button class="video-preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all">🏙️ 도시 야경</button>
                  </div>
                </div>
              </div>

              {/* 이미지 업로드 (이미지→영상 모드) */}
              <div id="image-upload-section" class="glass rounded-2xl p-6 hidden">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-upload text-purple-400 mr-2"></i>
                  참조 이미지
                </h2>
                <div class="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-purple-500/50 transition-colors cursor-pointer">
                  <i class="fas fa-cloud-upload-alt text-4xl text-gray-500 mb-3"></i>
                  <p class="text-gray-400 mb-2">이미지를 드래그하거나 클릭하여 업로드</p>
                  <p class="text-xs text-gray-500">JPG, PNG, WebP (최대 10MB)</p>
                </div>
              </div>

              {/* 영상 설정 */}
              <div class="glass rounded-2xl p-6">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-sliders text-purple-400 mr-2"></i>
                  영상 설정
                </h2>
                <div class="space-y-4">
                  <div>
                    <label class="text-sm text-gray-400 mb-2 block">영상 길이</label>
                    <div class="grid grid-cols-2 gap-2">
                      <button class="duration-btn px-3 py-2 text-sm rounded-lg bg-purple-500/20 border border-purple-500/50">5초</button>
                      <button class="duration-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10">10초</button>
                    </div>
                  </div>
                  <div>
                    <label class="text-sm text-gray-400 mb-2 block">화면 비율</label>
                    <div class="grid grid-cols-3 gap-2">
                      <button class="video-ratio-btn px-3 py-2 text-sm rounded-lg bg-purple-500/20 border border-purple-500/50">16:9</button>
                      <button class="video-ratio-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10">9:16</button>
                      <button class="video-ratio-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10">1:1</button>
                    </div>
                  </div>
                  <div>
                    <label class="text-sm text-gray-400 mb-2 block">품질 모드</label>
                    <div class="grid grid-cols-2 gap-2">
                      <button class="quality-btn px-3 py-2 text-sm rounded-lg bg-purple-500/20 border border-purple-500/50">
                        Standard
                        <span class="text-xs text-gray-400 block">빠른 생성</span>
                      </button>
                      <button class="quality-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10">
                        Pro
                        <span class="text-xs text-gray-400 block">고품질</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button id="generate-video-btn" class="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-semibold text-lg hover:opacity-90 transition-all pulse-glow flex items-center justify-center">
                <i class="fas fa-film mr-2"></i>
                영상 생성하기
                <span class="ml-2 px-2 py-0.5 bg-white/20 rounded text-sm">~50 포인트</span>
              </button>
            </div>

            {/* Right Panel - 미리보기 */}
            <div class="space-y-6">
              <div class="glass rounded-2xl p-6 min-h-[500px] lg:min-h-[600px] flex flex-col">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-play-circle text-purple-400 mr-2"></i>
                  결과 미리보기
                </h2>
                <div id="video-preview-area" class="flex-1 flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl">
                  <div class="text-center p-8">
                    <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
                      <i class="fas fa-video text-4xl text-gray-500"></i>
                    </div>
                    <p class="text-gray-400 mb-2">생성된 영상이 여기에 표시됩니다</p>
                    <p class="text-xs text-gray-500">생성 시간: 약 1~3분</p>
                  </div>
                </div>
                <div class="mt-4 flex gap-3">
                  <button disabled class="flex-1 py-3 rounded-xl glass text-gray-500 cursor-not-allowed">
                    <i class="fas fa-download mr-2"></i>다운로드
                  </button>
                  <button disabled class="flex-1 py-3 rounded-xl glass text-gray-500 cursor-not-allowed">
                    <i class="fas fa-share-alt mr-2"></i>공유하기
                  </button>
                </div>
              </div>

              {/* Kling AI 정보 */}
              <div class="glass rounded-2xl p-6">
                <h3 class="font-semibold mb-3 flex items-center">
                  <i class="fas fa-info-circle text-purple-400 mr-2"></i>
                  Kling AI 정보
                </h3>
                <div class="space-y-2 text-sm text-gray-400">
                  <div class="flex justify-between">
                    <span>남은 포인트</span>
                    <span class="text-white font-medium">642.5 Points</span>
                  </div>
                  <div class="flex justify-between">
                    <span>만료일</span>
                    <span class="text-red-400">2026-01-18 (약 20일)</span>
                  </div>
                  <div class="flex justify-between">
                    <span>예상 생성 가능</span>
                    <span class="text-green-400">~12회 (5초 기준)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <script dangerouslySetInnerHTML={{
        __html: `
          // 모드 선택
          document.querySelectorAll('#mode-text, #mode-image').forEach(btn => {
            btn.addEventListener('click', function() {
              document.querySelectorAll('#mode-text, #mode-image').forEach(b => {
                b.classList.remove('border-purple-500/50', 'bg-gradient-to-br', 'from-purple-500/20', 'to-pink-500/20');
                b.classList.add('border-transparent', 'glass');
              });
              this.classList.remove('border-transparent', 'glass');
              this.classList.add('border-purple-500/50', 'bg-gradient-to-br', 'from-purple-500/20', 'to-pink-500/20');
              
              // 이미지 업로드 섹션 토글
              const uploadSection = document.getElementById('image-upload-section');
              if (this.id === 'mode-image') {
                uploadSection.classList.remove('hidden');
              } else {
                uploadSection.classList.add('hidden');
              }
            });
          });
          
          // 버튼 스타일링 함수
          function setupButtonGroup(selector) {
            document.querySelectorAll(selector).forEach(btn => {
              btn.addEventListener('click', function() {
                document.querySelectorAll(selector).forEach(b => {
                  b.style.background = 'rgba(255,255,255,0.05)';
                  b.style.border = '1px solid rgba(255,255,255,0.1)';
                });
                this.style.background = 'rgba(168, 85, 247, 0.3)';
                this.style.border = '2px solid #a855f7';
              });
            });
          }
          
          setupButtonGroup('.duration-btn');
          setupButtonGroup('.video-ratio-btn');
          setupButtonGroup('.quality-btn');
          
          // 프리셋 버튼
          document.querySelectorAll('.video-preset-btn').forEach(btn => {
            btn.addEventListener('click', function() {
              document.querySelectorAll('.video-preset-btn').forEach(b => {
                b.classList.remove('bg-purple-500/30', 'border-2', 'border-purple-400');
              });
              this.classList.add('bg-purple-500/30', 'border-2', 'border-purple-400');
              
              const presets = {
                '🌊 시네마틱': ', cinematic, epic, dramatic lighting, 4K',
                '🎬 슬로우모션': ', slow motion, detailed, smooth movement',
                '✨ 판타지': ', fantasy style, magical, ethereal glow',
                '🏙️ 도시 야경': ', night city, neon lights, urban atmosphere'
              };
              const textarea = document.getElementById('video-prompt');
              const presetText = presets[this.textContent.trim()];
              if (presetText && textarea) {
                textarea.value = textarea.value + presetText;
                textarea.focus();
              }
            });
          });
          
          // 생성 버튼
          document.getElementById('generate-video-btn').addEventListener('click', async function() {
            const btn = this;
            const prompt = document.getElementById('video-prompt').value;
            
            if (!prompt.trim()) {
              alert('프롬프트를 입력해주세요.');
              return;
            }
            
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>영상 생성 요청 중...';
            btn.disabled = true;
            
            try {
              const response = await fetch('/api/generate-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  prompt: prompt,
                  duration: '5',
                  aspectRatio: '16:9',
                  mode: 'std'
                })
              });
              
              const data = await response.json();
              
              if (data.success) {
                btn.innerHTML = '<i class="fas fa-check mr-2"></i>생성 요청 완료!';
                alert('영상 생성이 시작되었습니다!\\n작업 ID: ' + data.taskId + '\\n\\n생성 완료까지 1~3분 소요됩니다.');
                
                // 상태 확인 시작
                checkVideoStatus(data.taskId);
              } else {
                throw new Error(data.error || '영상 생성 실패');
              }
            } catch (error) {
              alert('오류: ' + error.message);
              btn.innerHTML = originalText;
            }
            
            btn.disabled = false;
          });
          
          // 영상 상태 확인
          async function checkVideoStatus(taskId) {
            const previewArea = document.getElementById('video-preview-area');
            previewArea.innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin text-4xl text-purple-400 mb-4"></i><p class="text-gray-400">영상 생성 중...</p><p class="text-xs text-gray-500 mt-2">작업 ID: ' + taskId + '</p></div>';
            
            const checkStatus = async () => {
              try {
                const response = await fetch('/api/video-status/' + taskId);
                const data = await response.json();
                
                if (data.status === 'completed' && data.videoUrl) {
                  previewArea.innerHTML = '<video controls class="w-full h-full rounded-xl" src="' + data.videoUrl + '"></video>';
                  document.querySelector('button:contains("다운로드")').disabled = false;
                } else if (data.status === 'failed') {
                  previewArea.innerHTML = '<div class="text-center text-red-400"><i class="fas fa-exclamation-circle text-4xl mb-4"></i><p>영상 생성 실패</p></div>';
                } else {
                  // 계속 확인
                  setTimeout(checkStatus, 5000);
                }
              } catch (error) {
                console.error('Status check error:', error);
                setTimeout(checkStatus, 5000);
              }
            };
            
            setTimeout(checkStatus, 10000); // 10초 후 첫 확인
          }
        `
      }} />
    </>
  )
})

// ==================== Kling AI 영상 생성 API ====================

// JWT 토큰 생성 함수
async function generateKlingJWT(accessKey: string, secretKey: string): Promise<string> {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  }
  
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    iss: accessKey,
    exp: now + 1800, // 30분 후 만료
    nbf: now - 5
  }
  
  const base64Header = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  const base64Payload = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  
  const signatureInput = base64Header + '.' + base64Payload
  
  // HMAC-SHA256 서명
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secretKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signatureInput))
  const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
  
  return signatureInput + '.' + base64Signature
}

// 영상 생성 요청
app.post('/api/generate-video', async (c) => {
  try {
    const body = await c.req.json()
    const { prompt, duration, aspectRatio, mode, imageUrl } = body
    
    if (!prompt) {
      return c.json({ success: false, error: '프롬프트를 입력해주세요.' }, 400)
    }
    
    // 환경변수에서 키 가져오기 (없으면 하드코딩된 값 사용 - 테스트용)
    const accessKey = c.env?.KLING_ACCESS_KEY || 'Ar8mLGAGRaMMmTrKb4LK3rTPbn9YGPtA'
    const secretKey = c.env?.KLING_SECRET_KEY || 'RfM9F3hJMP9KQhdHk8pCpMFKaPen8QCM'
    
    // JWT 토큰 생성
    const token = await generateKlingJWT(accessKey, secretKey)
    
    // Kling API 호출
    const klingResponse = await fetch('https://api.klingai.com/v1/videos/text2video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        model_name: 'kling-v1',
        prompt: prompt,
        negative_prompt: 'blurry, low quality, distorted',
        cfg_scale: 0.5,
        mode: mode || 'std',
        duration: duration || '5',
        aspect_ratio: aspectRatio || '16:9'
      })
    })
    
    const klingData = await klingResponse.json() as { code: number; data?: { task_id: string }; message?: string }
    
    if (klingData.code === 0 && klingData.data?.task_id) {
      return c.json({
        success: true,
        taskId: klingData.data.task_id,
        message: '영상 생성이 시작되었습니다.'
      })
    } else {
      return c.json({
        success: false,
        error: klingData.message || 'Kling API 오류',
        details: klingData
      }, 400)
    }
  } catch (error) {
    console.error('Video generation error:', error)
    return c.json({ 
      success: false, 
      error: 'Internal server error',
      details: String(error)
    }, 500)
  }
})

// 영상 상태 확인
app.get('/api/video-status/:taskId', async (c) => {
  try {
    const taskId = c.req.param('taskId')
    
    const accessKey = c.env?.KLING_ACCESS_KEY || 'Ar8mLGAGRaMMmTrKb4LK3rTPbn9YGPtA'
    const secretKey = c.env?.KLING_SECRET_KEY || 'RfM9F3hJMP9KQhdHk8pCpMFKaPen8QCM'
    
    const token = await generateKlingJWT(accessKey, secretKey)
    
    const response = await fetch('https://api.klingai.com/v1/videos/text2video/' + taskId, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    
    const data = await response.json() as { 
      code: number
      data?: { 
        task_status: string
        task_result?: { videos?: Array<{ url: string }> }
      }
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
        status: status === 'succeed' ? 'completed' : status === 'failed' ? 'failed' : 'processing',
        videoUrl: videoUrl,
        rawStatus: status
      })
    } else {
      return c.json({
        success: false,
        error: data.message || 'Status check failed'
      }, 400)
    }
  } catch (error) {
    return c.json({ 
      success: false, 
      error: 'Internal server error',
      details: String(error)
    }, 500)
  }
})

// Kling API 상태 확인
app.get('/api/kling/status', async (c) => {
  const accessKey = c.env?.KLING_ACCESS_KEY || 'Ar8mLGAGRaMMmTrKb4LK3rTPbn9YGPtA'
  const secretKey = c.env?.KLING_SECRET_KEY || 'RfM9F3hJMP9KQhdHk8pCpMFKaPen8QCM'
  
  const configured = !!(accessKey && secretKey)
  
  return c.json({
    configured: configured,
    accessKeySet: !!accessKey,
    secretKeySet: !!secretKey,
    remainingPoints: 642.5,
    expirationDate: '2026-01-18',
    daysRemaining: 20
  })
})

export default app
