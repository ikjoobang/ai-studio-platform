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
            
            <div class="glass rounded-xl p-6 sm:p-8 opacity-60">
              <div class="flex items-start justify-between mb-4">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                  <i class="fas fa-clock text-2xl text-gray-400"></i>
                </div>
                <span class="px-3 py-1 text-xs font-medium bg-gray-500/20 text-gray-400 rounded-full">준비중</span>
              </div>
              <h3 class="text-xl font-semibold mb-2 text-gray-400">더 많은 AI</h3>
              <p class="text-gray-500 text-sm leading-relaxed mb-4">
                Midjourney, Stable Diffusion 등 더 많은 AI 도구가 곧 추가됩니다.
              </p>
              <div class="flex flex-wrap gap-2">
                <span class="px-2 py-1 text-xs bg-white/5 rounded text-gray-500">Coming Soon</span>
              </div>
            </div>
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
                  프롬프트
                </h2>
                <textarea
                  id="prompt-input"
                  class="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors resize-none"
                  placeholder="생성하고 싶은 이미지를 설명해주세요..."
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

export default app
