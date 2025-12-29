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

// API Keys (하드코딩 - 프로덕션에서는 환경변수 사용 권장)
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
              <a href="#features" class="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#tools" class="text-gray-300 hover:text-white transition-colors">AI Tools</a>
              <a href="/generate-video" class="text-gray-300 hover:text-white transition-colors">Video</a>
              <a href="#pricing" class="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="/dashboard" class="text-gray-300 hover:text-white transition-colors">Dashboard</a>
            </div>
            
            <div class="flex items-center space-x-4">
              <a href="/generate" class="hidden sm:inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-brand-500 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity">
                <i class="fas fa-sparkles mr-2"></i>
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      <section class="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4">
        <div class="max-w-6xl mx-auto text-center">
          <div class="inline-flex items-center px-4 py-2 rounded-full glass mb-8">
            <span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            <span class="text-sm text-gray-300">Credit-based · Valid for 1 year</span>
          </div>
          
          <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            <span class="gradient-text">Create with AI</span>
            <br />
            <span class="text-white">Unlimited Creativity</span>
          </h1>
          
          <p class="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Nano Banana, Ideogram, Kling AI - all the best AI tools in one platform.
            <br class="hidden sm:block" />
            Generate images, videos, and more with simple English prompts.
          </p>
          
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a href="/generate" class="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-500 to-purple-600 rounded-xl font-semibold text-lg hover:opacity-90 transition-all pulse-glow">
              <i class="fas fa-image mr-2"></i>
              Generate Image
            </a>
            <a href="/generate-video" class="w-full sm:w-auto px-8 py-4 glass rounded-xl font-semibold text-lg hover:bg-white/10 transition-all">
              <i class="fas fa-video mr-2"></i>
              Generate Video
            </a>
          </div>
          
          <div class="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
            <div class="glass rounded-xl p-4 sm:p-6">
              <div class="text-2xl sm:text-4xl font-bold gradient-text mb-1">80%</div>
              <div class="text-xs sm:text-sm text-gray-400">Cost Savings</div>
            </div>
            <div class="glass rounded-xl p-4 sm:p-6">
              <div class="text-2xl sm:text-4xl font-bold gradient-text mb-1">10x</div>
              <div class="text-xs sm:text-sm text-gray-400">Faster</div>
            </div>
            <div class="glass rounded-xl p-4 sm:p-6">
              <div class="text-2xl sm:text-4xl font-bold gradient-text mb-1">4K</div>
              <div class="text-xs sm:text-sm text-gray-400">Quality</div>
            </div>
          </div>
        </div>
      </section>

      <section id="tools" class="py-20 sm:py-32 px-4 bg-gradient-to-b from-transparent via-brand-900/10 to-transparent">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span class="gradient-text">AI Tools</span> Collection
            </h2>
            <p class="text-gray-400 text-lg max-w-2xl mx-auto">
              Choose the right tool for your creative needs
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
                    <span class="px-3 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">Image</span>
                  </div>
                  <h3 class="text-xl font-semibold mb-2 group-hover:text-brand-400 transition-colors">Nano Banana</h3>
                  <p class="text-gray-400 text-sm leading-relaxed mb-4">
                    High-quality image generation with Fal.ai
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
                  <span class="px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full">Logo</span>
                </div>
                <h3 class="text-xl font-semibold mb-2 group-hover:text-brand-400 transition-colors">Ideogram</h3>
                <p class="text-gray-400 text-sm leading-relaxed mb-4">
                  Perfect for logos and text rendering
                </p>
              </div>
            </a>

            <a href="/generate-video" class="group">
              <div class="glass rounded-xl card-hover p-6 sm:p-8">
                <div class="flex items-start justify-between mb-4">
                  <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <i class="fas fa-video text-2xl text-white"></i>
                  </div>
                  <span class="px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-400 rounded-full">Video</span>
                </div>
                <h3 class="text-xl font-semibold mb-2 group-hover:text-brand-400 transition-colors">Kling 2.5 Turbo</h3>
                <p class="text-gray-400 text-sm leading-relaxed mb-4">
                  Fast cinematic video generation
                </p>
              </div>
            </a>

            <a href="/generate-video" class="group">
              <div class="glass rounded-xl card-hover p-6 sm:p-8">
                <div class="flex items-start justify-between mb-4">
                  <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                    <i class="fas fa-film text-2xl text-white"></i>
                  </div>
                  <span class="px-3 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded-full">Premium</span>
                </div>
                <h3 class="text-xl font-semibold mb-2 group-hover:text-brand-400 transition-colors">Kling 2.1 Master</h3>
                <p class="text-gray-400 text-sm leading-relaxed mb-4">
                  Premium quality video generation
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
              Simple <span class="gradient-text">Pricing</span>
            </h2>
          </div>
          
          <div class="grid sm:grid-cols-3 gap-6 lg:gap-8">
            <div class="glass rounded-2xl p-6 sm:p-8 card-hover">
              <div class="text-center mb-6">
                <h3 class="text-xl font-semibold mb-2">Starter</h3>
                <div class="text-4xl font-bold mb-1">$29</div>
                <p class="text-gray-400 text-sm">630 credits</p>
              </div>
              <ul class="space-y-3 mb-8 text-sm">
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>~63 images</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>All AI tools</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>1 year validity</li>
              </ul>
            </div>
            
            <div class="gradient-border card-hover">
              <div class="gradient-border-inner p-6 sm:p-8 relative">
                <div class="absolute top-0 right-0 bg-gradient-to-r from-brand-500 to-purple-600 text-xs px-4 py-1 rounded-bl-xl">Popular</div>
                <div class="text-center mb-6">
                  <h3 class="text-xl font-semibold mb-2">Pro</h3>
                  <div class="text-4xl font-bold gradient-text mb-1">$59</div>
                  <p class="text-gray-400 text-sm">1,500 credits</p>
                </div>
                <ul class="space-y-3 mb-8 text-sm">
                  <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>~150 images</li>
                  <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>Priority queue</li>
                  <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>1 year validity</li>
                </ul>
              </div>
            </div>
            
            <div class="glass rounded-2xl p-6 sm:p-8 card-hover">
              <div class="text-center mb-6">
                <h3 class="text-xl font-semibold mb-2">Business</h3>
                <div class="text-4xl font-bold mb-1">$119</div>
                <p class="text-gray-400 text-sm">3,500 credits</p>
              </div>
              <ul class="space-y-3 mb-8 text-sm">
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>~350 images</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>Team sharing</li>
                <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i>1 year validity</li>
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
              <a href="/api/docs" class="hover:text-white">API Docs</a>
              <a href="/admin" class="hover:text-white">Admin</a>
              <a href="/dashboard" class="hover:text-white">Dashboard</a>
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
              AI Image Generation
            </h1>
            <p class="text-gray-400">Create stunning images with Nano Banana & Ideogram</p>
          </div>

          <div class="grid lg:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div class="glass rounded-2xl p-6">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-robot text-brand-400 mr-2"></i>
                  Select AI Model
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
                    <span class="text-xs text-gray-400 block mt-1">Logo & Text</span>
                  </button>
                </div>
              </div>

              <div class="glass rounded-2xl p-6">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-pen-fancy text-brand-400 mr-2"></i>
                  Describe your image (English)
                </h2>
                <textarea
                  id="prompt-input"
                  class="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors resize-none"
                  placeholder="Example: A cute dog running on the beach, a modern cafe logo, a whale flying in space..."
                ></textarea>
                
                <div class="mt-4">
                  <span class="text-sm text-gray-400 mb-2 block">Quick Presets</span>
                  <div class="flex flex-wrap gap-2">
                    <button class="preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all" data-preset="realistic">📷 Realistic</button>
                    <button class="preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all" data-preset="anime">🎨 Anime</button>
                    <button class="preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all" data-preset="golden_hour">🌅 Golden Hour</button>
                    <button class="preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all" data-preset="cinematic">🏙️ Cinematic</button>
                    <button class="preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all" data-preset="fantasy">✨ Fantasy</button>
                    <button class="preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all" data-preset="minimal">🎯 Minimal</button>
                  </div>
                </div>
              </div>

              <div class="glass rounded-2xl p-6">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-sliders text-brand-400 mr-2"></i>
                  Settings
                </h2>
                <div class="mb-4">
                  <label class="text-sm text-gray-400 mb-2 block">Aspect Ratio</label>
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
                Generate Image
              </button>
            </div>

            <div class="space-y-6">
              <div class="glass rounded-2xl p-6 min-h-[500px] lg:min-h-[600px] flex flex-col">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-eye text-brand-400 mr-2"></i>
                  Preview
                </h2>
                <div id="preview-area" class="flex-1 flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl">
                  <div class="text-center p-8">
                    <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                      <i class="fas fa-image text-4xl text-gray-500"></i>
                    </div>
                    <p class="text-gray-400 mb-2">Generated image will appear here</p>
                  </div>
                </div>
                <div id="download-buttons" class="mt-4 flex gap-3 hidden">
                  <a id="download-link" href="#" download class="flex-1 py-3 rounded-xl glass hover:bg-white/10 text-center">
                    <i class="fas fa-download mr-2"></i>Download
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
              alert('Please enter a prompt in English');
              return;
            }
            
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Generating...';
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
                
                btn.innerHTML = '<i class="fas fa-check mr-2"></i>Generated!';
              } else {
                throw new Error(data.error || 'Generation failed');
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
              <div class="hidden sm:flex items-center px-3 py-1.5 bg-yellow-500/20 rounded-lg">
                <i class="fas fa-coins text-yellow-400 mr-2"></i>
                <span class="text-yellow-400 text-sm">642.5 Points</span>
              </div>
              <div class="hidden sm:flex items-center px-3 py-1.5 bg-red-500/20 rounded-lg">
                <i class="fas fa-clock text-red-400 mr-2"></i>
                <span class="text-red-400 text-sm">Expires: 2026-01-18</span>
              </div>
              <a href="/generate" class="px-4 py-2 glass rounded-lg hover:bg-white/10">Image</a>
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
              AI Video Generation
            </h1>
            <p class="text-gray-400">Create cinematic videos with Kling AI (V2.1 Master & V2.5 Turbo)</p>
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
                  Describe your video (English)
                </h2>
                <textarea
                  id="video-prompt"
                  class="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  placeholder="Example: A dog running on the beach at sunset, a spaceship flying through asteroid belt..."
                ></textarea>
                
                <div class="mt-4">
                  <span class="text-sm text-gray-400 mb-2 block">Quick Presets</span>
                  <div class="flex flex-wrap gap-2">
                    <button class="video-preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all" data-preset="cinematic">🎬 Cinematic</button>
                    <button class="video-preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all" data-preset="slow_motion">🌊 Slow Motion</button>
                    <button class="video-preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all" data-preset="fantasy">✨ Fantasy</button>
                    <button class="video-preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all" data-preset="night_city">🏙️ Night City</button>
                    <button class="video-preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all" data-preset="drone">🚁 Drone Shot</button>
                    <button class="video-preset-btn px-3 py-1.5 text-xs rounded-lg glass hover:bg-white/10 transition-all" data-preset="action">💥 Action</button>
                  </div>
                </div>
              </div>

              <div class="glass rounded-2xl p-6">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-sliders text-purple-400 mr-2"></i>
                  Settings
                </h2>
                <div class="space-y-4">
                  <div>
                    <label class="text-sm text-gray-400 mb-2 block">Duration</label>
                    <div class="grid grid-cols-2 gap-2">
                      <button class="duration-btn px-3 py-2 text-sm rounded-lg bg-purple-500/20 border border-purple-500/50" data-duration="5">5 seconds</button>
                      <button class="duration-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10" data-duration="10">10 seconds</button>
                    </div>
                  </div>
                  <div>
                    <label class="text-sm text-gray-400 mb-2 block">Aspect Ratio</label>
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
                Generate Video
                <span id="points-display" class="ml-2 px-2 py-0.5 bg-white/20 rounded text-sm">~25 points</span>
              </button>
            </div>

            <div class="space-y-6">
              <div class="glass rounded-2xl p-6 min-h-[500px] lg:min-h-[600px] flex flex-col">
                <h2 class="text-lg font-semibold mb-4 flex items-center">
                  <i class="fas fa-play-circle text-purple-400 mr-2"></i>
                  Preview
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
                    <i class="fas fa-download mr-2"></i>Download
                  </a>
                </div>
              </div>

              <div class="glass rounded-2xl p-6">
                <h3 class="font-semibold mb-3 flex items-center">
                  <i class="fas fa-info-circle text-purple-400 mr-2"></i>
                  Kling AI Status
                </h3>
                <div class="space-y-2 text-sm text-gray-400">
                  <div class="flex justify-between">
                    <span>Remaining Points</span>
                    <span class="text-white font-medium">642.5 Points</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Expiration</span>
                    <span class="text-red-400">2026-01-18 (~20 days)</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Est. Videos (5s Turbo)</span>
                    <span class="text-green-400">~25 videos</span>
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
          let selectedDuration = '5';
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
                document.getElementById('points-display').textContent = selectedDuration === '5' ? '~25 points' : '~50 points';
              } else {
                selectedVideoModel = 'kling-v2-1-master';
                this.classList.remove('border-transparent', 'glass');
                this.classList.add('border-yellow-500/50', 'bg-gradient-to-br', 'from-yellow-500/20', 'to-orange-500/20');
                document.getElementById('points-display').textContent = selectedDuration === '5' ? '~35 points' : '~70 points';
              }
            });
          });
          
          // Duration selection
          document.querySelectorAll('.duration-btn').forEach(btn => {
            btn.addEventListener('click', function() {
              document.querySelectorAll('.duration-btn').forEach(b => {
                b.className = 'duration-btn px-3 py-2 text-sm rounded-lg glass hover:bg-white/10';
              });
              this.className = 'duration-btn px-3 py-2 text-sm rounded-lg bg-purple-500/20 border border-purple-500/50';
              selectedDuration = this.dataset.duration;
              
              // Update points display
              if (selectedVideoModel === 'kling-v2-5-turbo') {
                document.getElementById('points-display').textContent = selectedDuration === '5' ? '~25 points' : '~50 points';
              } else {
                document.getElementById('points-display').textContent = selectedDuration === '5' ? '~35 points' : '~70 points';
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
              alert('Please enter a prompt in English');
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
                  duration: selectedDuration,
                  aspectRatio: selectedVideoRatio
                })
              });
              
              const data = await response.json();
              
              if (data.success) {
                btn.innerHTML = '<i class="fas fa-check mr-2"></i>Submitted!';
                
                const previewArea = document.getElementById('video-preview-area');
                previewArea.innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin text-4xl text-purple-400 mb-4"></i><p class="text-gray-400">Generating video...</p><p class="text-xs text-gray-500 mt-2">Task ID: ' + data.taskId + '</p><p class="text-xs text-gray-500">This may take 1-3 minutes</p></div>';
                
                // Start polling for status
                pollVideoStatus(data.taskId);
              } else {
                throw new Error(data.error || 'Generation failed');
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
                
                if (data.status === 'completed' && data.videoUrl) {
                  previewArea.innerHTML = '<video controls class="w-full h-full rounded-xl" src="' + data.videoUrl + '"></video>';
                  document.getElementById('video-download-buttons').classList.remove('hidden');
                  document.getElementById('video-download-link').href = data.videoUrl;
                } else if (data.status === 'failed') {
                  previewArea.innerHTML = '<div class="text-center text-red-400"><i class="fas fa-exclamation-circle text-4xl mb-4"></i><p>Generation failed</p><p class="text-xs mt-2">' + (data.error || 'Unknown error') + '</p></div>';
                } else {
                  previewArea.innerHTML = '<div class="text-center"><i class="fas fa-spinner fa-spin text-4xl text-purple-400 mb-4"></i><p class="text-gray-400">Generating video...</p><p class="text-xs text-gray-500 mt-2">Status: ' + data.rawStatus + '</p></div>';
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
              <a href="/admin" class="px-4 py-2 glass rounded-lg hover:bg-white/10">Admin</a>
            </div>
          </div>
        </div>
      </nav>

      <main class="pt-24 pb-12 px-4 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold mb-8">Dashboard</h1>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center justify-between mb-4">
                <i class="fas fa-image text-2xl text-brand-400"></i>
              </div>
              <div class="text-3xl font-bold mb-1">∞</div>
              <div class="text-sm text-gray-400">Images (API Ready)</div>
            </div>
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center justify-between mb-4">
                <i class="fas fa-video text-2xl text-purple-400"></i>
              </div>
              <div class="text-3xl font-bold mb-1">642.5</div>
              <div class="text-sm text-gray-400">Kling Points</div>
            </div>
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center justify-between mb-4">
                <i class="fas fa-clock text-2xl text-red-400"></i>
              </div>
              <div class="text-3xl font-bold mb-1">20</div>
              <div class="text-sm text-gray-400">Days Remaining</div>
            </div>
            <div class="glass rounded-2xl p-6">
              <div class="flex items-center justify-between mb-4">
                <i class="fas fa-check-circle text-2xl text-green-400"></i>
              </div>
              <div class="text-3xl font-bold mb-1">4</div>
              <div class="text-sm text-gray-400">AI Models Ready</div>
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
              <h2 class="text-xl font-semibold">Quick Links</h2>
            </div>
            <div class="grid sm:grid-cols-3 gap-4">
              <a href="/generate" class="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-center">
                <i class="fas fa-image text-brand-400 text-2xl mb-2"></i>
                <p class="font-medium">Generate Image</p>
              </a>
              <a href="/generate-video" class="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-center">
                <i class="fas fa-video text-purple-400 text-2xl mb-2"></i>
                <p class="font-medium">Generate Video</p>
              </a>
              <a href="/api/docs" class="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-center">
                <i class="fas fa-book text-green-400 text-2xl mb-2"></i>
                <p class="font-medium">API Docs</p>
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
              <span class="text-xl font-bold gradient-text">Admin Panel</span>
            </a>
            <div class="flex items-center space-x-4">
              <a href="/dashboard" class="px-4 py-2 glass rounded-lg hover:bg-white/10">Dashboard</a>
              <a href="/" class="px-4 py-2 glass rounded-lg hover:bg-white/10">Home</a>
            </div>
          </div>
        </div>
      </nav>

      <main class="pt-24 pb-12 px-4 min-h-screen">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold mb-8">Admin Panel</h1>
          
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
                <span class="text-sm text-gray-400">API Keys</span>
              </div>
              <div class="text-2xl font-bold text-green-400">4 Active</div>
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
                  <span class="text-green-400">✓ Active</span>
                </div>
              </div>
              <div class="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-medium">Ideogram</span>
                    <p class="text-xs text-gray-400 mt-1">z9FQ5zQQ****************************</p>
                  </div>
                  <span class="text-green-400">✓ Active</span>
                </div>
              </div>
              <div class="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-medium">Kling AI (Access Key)</span>
                    <p class="text-xs text-gray-400 mt-1">Ar8mLGAG****************************</p>
                  </div>
                  <span class="text-green-400">✓ Active</span>
                </div>
              </div>
              <div class="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="font-medium">Kling AI (Secret Key)</span>
                    <p class="text-xs text-gray-400 mt-1">RfM9F3hJ****************************</p>
                  </div>
                  <span class="text-green-400">✓ Active</span>
                </div>
              </div>
            </div>
          </div>

          <div class="glass rounded-2xl p-6">
            <h2 class="text-xl font-semibold mb-6">Quick Links</h2>
            <div class="grid sm:grid-cols-3 gap-4">
              <a href="/api/docs" class="p-4 bg-white/5 rounded-xl hover:bg-white/10">
                <i class="fas fa-book text-brand-400 mr-2"></i>API Docs
              </a>
              <a href="/api/health" class="p-4 bg-white/5 rounded-xl hover:bg-white/10">
                <i class="fas fa-heartbeat text-green-400 mr-2"></i>Health Check
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

// Health Check
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

// Export History
app.get('/api/export/history', (c) => {
  const historyData = `AI Studio - Generation Report
================================
Generated: ${new Date().toISOString()}
Version: 2.0.0

[API Status]
- Fal.ai (Nano Banana): Active
- Ideogram: Active  
- Kling V2.5 Turbo: Active
- Kling V2.1 Master: Active

[Kling AI Status]
- Remaining Points: 642.5
- Expiration: 2026-01-18
- Days Remaining: ~20 days

[Available Models]
Image Generation:
- Nano Banana (Fal.ai) - High quality image generation
- Ideogram - Logo and text rendering

Video Generation:
- Kling V2.5 Turbo - Fast, 25 points/5s
- Kling V2.1 Master - Premium, 35 points/5s

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
      return c.json({ success: false, error: 'Please enter a prompt' }, 400)
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
      return c.json({ success: false, error: 'Please enter a prompt' }, 400)
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
        message: 'Video generation started'
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
        status: status === 'succeed' ? 'completed' : status === 'failed' ? 'failed' : 'processing',
        videoUrl: videoUrl,
        rawStatus: status
      })
    } else {
      return c.json({ success: false, error: data.message || 'Status check failed' }, 400)
    }
  } catch (error) {
    return c.json({ success: false, error: String(error) }, 500)
  }
})

// Kling 상태
app.get('/api/kling/status', (c) => {
  return c.json({
    configured: true,
    remainingPoints: 642.5,
    expirationDate: '2026-01-18',
    daysRemaining: 20,
    models: ['kling-v2-5-turbo', 'kling-v2-1-master']
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
        description: 'Fast cinematic video generation',
        cost: '25 points / 5s',
        features: ['Fast generation', '30% cheaper', 'High quality']
      },
      {
        id: 'kling-v2-1-master',
        name: 'Kling 2.1 Master',
        description: 'Premium quality video generation',
        cost: '35 points / 5s',
        features: ['Best quality', 'Cinematic motion', '1080p output']
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
