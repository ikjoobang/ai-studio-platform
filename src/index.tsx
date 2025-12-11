import { Hono } from 'hono'
import { renderer } from './renderer'
import { serveStatic } from 'hono/cloudflare-pages'

const app = new Hono()

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
            {/* Feature 1 */}
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
            
            {/* Feature 2 */}
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
            
            {/* Feature 3 */}
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
            {/* Nano Banana */}
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
            
            {/* Ideogram */}
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
            
            {/* Coming Soon */}
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

      {/* Use Cases Section */}
      <section class="py-20 sm:py-32 px-4">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              이런 것들을 <span class="gradient-text">만들 수 있어요</span>
            </h2>
            <p class="text-gray-400 text-lg max-w-2xl mx-auto">
              실생활에서 바로 활용할 수 있는 다양한 기능
            </p>
          </div>
          
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: 'fa-couch', title: '인테리어 미리보기', desc: '가구 배치 시뮬레이션' },
              { icon: 'fa-id-card', title: '증명사진', desc: '셀카로 증명사진 생성' },
              { icon: 'fa-scissors', title: '헤어스타일', desc: '염색/펌 미리보기' },
              { icon: 'fa-shirt', title: '의상 미리보기', desc: '옷 착용 시뮬레이션' },
              { icon: 'fa-mug-hot', title: '제품 합성', desc: '굿즈 디자인 미리보기' },
              { icon: 'fa-store', title: '로고 디자인', desc: '브랜드 로고 생성' },
              { icon: 'fa-image', title: '광고 이미지', desc: '마케팅 비주얼 제작' },
              { icon: 'fa-palette', title: '아트워크', desc: '창작 이미지 생성' },
            ].map((item) => (
              <div class="glass rounded-xl p-4 sm:p-6 card-hover text-center">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <i class={`fas ${item.icon} text-xl text-brand-400`}></i>
                </div>
                <h3 class="font-semibold mb-1">{item.title}</h3>
                <p class="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
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
            {/* Starter */}
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
            
            {/* Pro */}
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
            
            {/* Business */}
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
              복잡한 설정 없이 바로 시작할 수 있습니다.
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/generate" class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-500 to-purple-600 rounded-xl font-semibold text-lg hover:opacity-90 transition-all pulse-glow">
                <i class="fas fa-rocket mr-2"></i>
                무료로 체험하기
              </a>
            </div>
            <p class="text-gray-500 text-sm mt-6">
              <i class="fas fa-shield-halved mr-1"></i>
              신용카드 등록 없이 무료로 시작
            </p>
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
              <a href="#" class="hover:text-white transition-colors">이용약관</a>
              <a href="#" class="hover:text-white transition-colors">개인정보처리방침</a>
              <a href="#" class="hover:text-white transition-colors">문의하기</a>
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

// ==================== 이미지 생성 페이지 ====================
app.get('/generate', (c) => {
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
            
            <div class="flex items-center space-x-4">
              <div class="hidden sm:flex items-center px-4 py-2 glass rounded-lg">
                <i class="fas fa-coins text-yellow-400 mr-2"></i>
                <span class="font-medium">100</span>
                <span class="text-gray-400 ml-1 text-sm">크레딧</span>
              </div>
              <a href="/" class="text-gray-300 hover:text-white transition-colors">
                <i class="fas fa-home text-xl"></i>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main class="pt-24 pb-12 px-4 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <div class="grid lg:grid-cols-2 gap-8">
            {/* Left Panel - Controls */}
            <div class="space-y-6">
              {/* AI Tool Selector */}
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

              {/* Prompt Input */}
              <div class="glass rounded-2xl p-6">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-pen-fancy text-brand-400 mr-2"></i>
                  프롬프트
                </h2>
                <textarea
                  id="prompt-input"
                  class="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors resize-none"
                  placeholder="생성하고 싶은 이미지를 설명해주세요...&#10;&#10;예: 한강에서 러닝하는 한국 여성, 운동복, 밝은 아침 햇살, 실사 광고 스타일"
                ></textarea>
                
                {/* Quick Presets */}
                <div class="mt-4">
                  <span class="text-sm text-gray-400 mb-2 block">빠른 프리셋</span>
                  <div class="flex flex-wrap gap-2">
                    <button class="preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all">
                      📷 실사 스타일
                    </button>
                    <button class="preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all">
                      🎨 애니메이션
                    </button>
                    <button class="preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all">
                      🌅 골든아워
                    </button>
                    <button class="preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all">
                      🏙️ 시네마틱
                    </button>
                  </div>
                </div>
              </div>

              {/* Reference Image */}
              <div class="glass rounded-2xl p-6">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-image text-brand-400 mr-2"></i>
                  참조 이미지 <span class="text-xs text-gray-400 font-normal ml-2">(선택사항)</span>
                </h2>
                <div id="upload-area" class="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-brand-500/50 transition-colors cursor-pointer">
                  <i class="fas fa-cloud-arrow-up text-4xl text-gray-500 mb-4"></i>
                  <p class="text-gray-400 mb-2">이미지를 드래그하거나 클릭하여 업로드</p>
                  <p class="text-xs text-gray-500">PNG, JPG, WEBP (최대 10MB)</p>
                </div>
              </div>

              {/* Settings */}
              <div class="glass rounded-2xl p-6">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-sliders text-brand-400 mr-2"></i>
                  설정
                </h2>
                
                {/* Aspect Ratio */}
                <div class="mb-4">
                  <label class="text-sm text-gray-400 mb-2 block">이미지 비율</label>
                  <div class="grid grid-cols-4 gap-2">
                    <button class="ratio-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10 transition-all">1:1</button>
                    <button class="ratio-btn px-3 py-2 text-sm rounded-lg bg-brand-500/20 border border-brand-500/50">16:9</button>
                    <button class="ratio-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10 transition-all">9:16</button>
                    <button class="ratio-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10 transition-all">4:3</button>
                  </div>
                </div>
                
                {/* Number of Images */}
                <div>
                  <label class="text-sm text-gray-400 mb-2 block">생성 개수</label>
                  <div class="grid grid-cols-4 gap-2">
                    <button class="count-btn px-3 py-2 text-sm rounded-lg bg-brand-500/20 border border-brand-500/50">1장</button>
                    <button class="count-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10 transition-all">2장</button>
                    <button class="count-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10 transition-all">3장</button>
                    <button class="count-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10 transition-all">4장</button>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button id="generate-btn" class="w-full py-4 bg-gradient-to-r from-brand-500 to-purple-600 rounded-xl font-semibold text-lg hover:opacity-90 transition-all pulse-glow flex items-center justify-center">
                <i class="fas fa-sparkles mr-2"></i>
                이미지 생성하기
                <span class="ml-2 px-2 py-0.5 bg-white/20 rounded text-sm">10 크레딧</span>
              </button>
            </div>

            {/* Right Panel - Preview */}
            <div class="space-y-6">
              <div class="glass rounded-2xl p-6 min-h-[500px] lg:min-h-[700px] flex flex-col">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-eye text-brand-400 mr-2"></i>
                  결과 미리보기
                </h2>
                
                {/* Preview Area */}
                <div id="preview-area" class="flex-1 flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl">
                  <div class="text-center p-8">
                    <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                      <i class="fas fa-image text-4xl text-gray-500"></i>
                    </div>
                    <p class="text-gray-400 mb-2">생성된 이미지가 여기에 표시됩니다</p>
                    <p class="text-xs text-gray-500">프롬프트를 입력하고 생성 버튼을 클릭하세요</p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div class="mt-4 flex gap-3">
                  <button disabled class="flex-1 py-3 rounded-xl glass text-gray-500 cursor-not-allowed">
                    <i class="fas fa-download mr-2"></i>
                    다운로드
                  </button>
                  <button disabled class="flex-1 py-3 rounded-xl glass text-gray-500 cursor-not-allowed">
                    <i class="fas fa-wand-magic mr-2"></i>
                    편집하기
                  </button>
                </div>
              </div>
              
              {/* Generation History */}
              <div class="glass rounded-2xl p-6">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-clock-rotate-left text-brand-400 mr-2"></i>
                  최근 생성
                </h2>
                <div class="grid grid-cols-4 gap-2">
                  {[1,2,3,4].map(() => (
                    <div class="aspect-square rounded-lg bg-white/5 flex items-center justify-center">
                      <i class="fas fa-image text-gray-600"></i>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Simple JS for UI interactions */}
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
          
          // Tool selector
          document.querySelectorAll('#btn-nano, #btn-ideogram').forEach(btn => {
            btn.addEventListener('click', function() {
              document.querySelectorAll('#btn-nano, #btn-ideogram').forEach(b => {
                b.classList.remove('border-yellow-500/50', 'border-cyan-500/50');
                b.classList.add('border-transparent');
              });
              if (this.id === 'btn-nano') {
                this.classList.add('border-yellow-500/50');
              } else {
                this.classList.add('border-cyan-500/50');
              }
            });
          });
        `
      }} />
    </>
  )
})

// ==================== API Routes ====================
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.post('/api/generate', async (c) => {
  try {
    const body = await c.req.json()
    const { prompt, model, aspectRatio, numImages } = body
    
    // API 키 체크 (환경변수에서)
    // const falApiKey = c.env?.FAL_API_KEY
    // const ideogramApiKey = c.env?.IDEOGRAM_API_KEY
    
    return c.json({
      success: false,
      error: 'API keys not configured. Please set FAL_API_KEY and IDEOGRAM_API_KEY environment variables.',
      message: 'API 키가 설정되지 않았습니다. 환경변수를 설정해주세요.'
    }, 400)
  } catch (error) {
    return c.json({ success: false, error: 'Internal server error' }, 500)
  }
})

export default app
