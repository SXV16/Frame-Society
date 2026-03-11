<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Raphael Frame Society</title>
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          'deep-purple': '#2E003E',
          'royal-purple': '#5E239D',
          'gold': '#D4AF37',
          'brand-black': '#000',
          'brand-white': '#FFF',
          'bg': '#0a000f',
          'bg-card': '#1a0028',
          'bg-hover': '#220033',
          'brand-border': '#3d1a55',
          'text-sec': '#a07cc0',
          'text-dim': '#6a4a80',
        },
        fontFamily: {
          bebas: ['"Bebas Neue"', 'sans-serif'],
          dm: ['"DM Sans"', 'sans-serif'],
        },
        keyframes: {
          ticker: {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(-50%)' },
          },
          fadeUp: {
            '0%': { opacity: '0', transform: 'translateY(30px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
        },
        animation: {
          ticker: 'ticker 20s linear infinite',
          'fade-1': 'fadeUp 0.6s ease 0.1s both',
          'fade-2': 'fadeUp 0.7s ease 0.2s both',
          'fade-3': 'fadeUp 0.7s ease 0.35s both',
          'fade-4': 'fadeUp 0.7s ease 0.5s both',
        },
      }
    }
  }
</script>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet">
<style>
  body { font-family: 'DM Sans', sans-serif; font-weight: 300; }

  /* Hero background */
  .hero-bg {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 70% 40%, rgba(212,175,55,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 60% 80% at 10% 60%, rgba(94,35,157,0.25) 0%, transparent 55%),
      radial-gradient(ellipse 50% 50% at 85% 80%, rgba(46,0,62,0.4) 0%, transparent 50%),
      linear-gradient(180deg, #0a000f 0%, #110018 50%, #0e0015 100%);
  }
  /* Decorative vertical lines */
  .hero-lines::before {
    content: ''; position: absolute; right: 120px; top: 20%; bottom: 20%;
    width: 1px;
    background: linear-gradient(180deg, transparent, #3d1a55 30%, #3d1a55 70%, transparent);
  }
  .hero-lines::after {
    content: ''; position: absolute; right: 240px; top: 30%; bottom: 30%;
    width: 1px;
    background: linear-gradient(180deg, transparent, rgba(212,175,55,0.2) 30%, rgba(212,175,55,0.2) 70%, transparent);
  }
  /* Eyebrow decorative line */
  .eyebrow::before { content: ''; display: block; width: 24px; height: 1px; background: #D4AF37; }
  .hero-eyebrow::before { content: ''; display: block; width: 40px; height: 1px; background: #D4AF37; }

  /* Frame card interactions */
  .frame-card:hover .frame-zoom { transform: scale(1.04); }
  .frame-zoom { transition: transform 0.5s ease; }
  .cart-reveal { opacity: 0; transform: translateY(8px); transition: opacity 0.2s, transform 0.2s; }
  .frame-card:hover .cart-reveal { opacity: 1; transform: translateY(0); }

  /* Cat card arrow */
  .cat-card:hover .cat-arrow { transform: translateX(6px); }
  .cat-arrow { transition: transform 0.2s; }

  /* Frame visuals */
  .frame-aurora { width: 120px; height: 150px; position: relative; }
  .frame-aurora::before { content: ''; position: absolute; inset: 8px; background: linear-gradient(135deg, #a8edea, #fed6e3, #a8c0ff); opacity: 0.8; }
  .frame-aurora::after  { content: ''; position: absolute; inset: 0; border: 8px solid #b8942a; box-shadow: inset 0 0 20px rgba(0,0,0,0.4); }

  .frame-eclipse { width: 120px; height: 150px; position: relative; }
  .frame-eclipse::before { content: ''; position: absolute; inset: 8px; background: radial-gradient(ellipse at 30% 30%, #1a1a2e, #16213e, #0f3460); opacity: 0.9; }
  .frame-eclipse::after  { content: ''; position: absolute; inset: 0; border: 8px solid #5E239D; box-shadow: inset 0 0 20px rgba(0,0,0,0.6); }

  .frame-noir { width: 120px; height: 150px; position: relative; }
  .frame-noir::before { content: ''; position: absolute; inset: 8px; background: linear-gradient(180deg, #2E003E, #1a0028); }
  .frame-noir::after  { content: ''; position: absolute; inset: 0; border: 8px solid #2E003E; box-shadow: inset 0 0 30px rgba(0,0,0,0.8), 0 0 0 2px #5E239D; }
</style>
</head>
<body class="bg-bg text-white overflow-x-hidden">

<!-- ─── NAV ─── -->
<nav class="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-12 py-5 border-b border-brand-border backdrop-blur-md"
     style="background: rgba(10,0,15,0.9);">
  <a href="#" class="flex items-center gap-2.5 font-bebas text-[22px] tracking-[3px] text-white no-underline">
    <span class="material-icons-round text-gold" style="font-size:20px;">movie_filter</span>
    RAPHAEL FRAME
  </a>
  <div class="flex gap-8">
    <a href="#" class="text-text-sec text-[13px] tracking-widest uppercase no-underline hover:text-white transition-colors duration-200">Collections</a>
    <a href="#" class="text-text-sec text-[13px] tracking-widest uppercase no-underline hover:text-white transition-colors duration-200">Artists</a>
    <a href="#" class="text-text-sec text-[13px] tracking-widest uppercase no-underline hover:text-white transition-colors duration-200">Frames</a>
    <a href="#" class="text-text-sec text-[13px] tracking-widest uppercase no-underline hover:text-white transition-colors duration-200">About</a>
  </div>
  <a href="#" class="bg-white text-black px-6 py-2.5 text-[12px] tracking-[2px] uppercase font-medium no-underline hover:bg-gold hover:text-black transition-colors duration-200">
    Shop Now
  </a>
</nav>

<!-- ─── HERO ─── -->
<section class="relative min-h-screen flex flex-col justify-end px-12 pb-20 overflow-hidden">
  <div class="hero-bg"></div>
  <div class="hero-lines absolute top-0 right-0 w-1/2 h-full pointer-events-none"></div>

  <p class="relative z-10 text-[11px] tracking-[4px] uppercase text-gold mb-6 flex items-center gap-4 animate-fade-1 hero-eyebrow">
    The Premiere Society for Collectors
  </p>
  <h1 class="relative z-10 font-bebas leading-[0.92] tracking-[2px] mb-10 animate-fade-2"
      style="font-size: clamp(64px, 9vw, 130px);">
    ANIME<br>
    MADE <span class="text-gold">US.</span><br>
    RAPHAEL<br>
    <span class="text-gold">FRAMES</span> US.
  </h1>
  <p class="relative z-10 max-w-[480px] text-[15px] leading-relaxed text-text-sec mb-12 animate-fade-3">
    Curated frames, exclusive merchandise, and a community built on obsession. For collectors, viewers, and gamers.
  </p>
  <div class="relative z-10 flex items-center gap-8 animate-fade-4">
    <a href="#" class="bg-white text-black px-10 py-4 text-[12px] tracking-[2px] uppercase font-medium no-underline flex items-center gap-2.5 hover:bg-gold hover:text-black transition-colors duration-200">
      Enter Website
      <span class="material-icons-round" style="font-size:18px;">arrow_forward</span>
    </a>
    <a href="#" class="text-text-sec text-[13px] tracking-[1px] uppercase no-underline flex items-center gap-2 hover:text-white transition-colors duration-200">
      View Collections
      <span class="material-icons-round" style="font-size:16px;">chevron_right</span>
    </a>
  </div>
</section>

<!-- ─── TICKER ─── -->
<div class="bg-bg-card border-t border-b border-brand-border overflow-hidden py-3.5">
  <div class="flex gap-20 whitespace-nowrap animate-ticker">
    <span class="text-[11px] tracking-[3px] uppercase text-text-dim flex items-center gap-4"><span class="material-icons-round text-gold" style="font-size:14px;">movie_filter</span> Anime Collection</span>
    <span class="text-[11px] tracking-[3px] uppercase text-text-dim flex items-center gap-4"><span class="material-icons-round text-gold" style="font-size:14px;">movie_filter</span> Cinema Collection</span>
    <span class="text-[11px] tracking-[3px] uppercase text-text-dim flex items-center gap-4"><span class="material-icons-round text-gold" style="font-size:14px;">movie_filter</span> Gaming Collection</span>
    <span class="text-[11px] tracking-[3px] uppercase text-text-dim flex items-center gap-4"><span class="material-icons-round text-gold" style="font-size:14px;">movie_filter</span> 24 Premium Frames</span>
    <span class="text-[11px] tracking-[3px] uppercase text-text-dim flex items-center gap-4"><span class="material-icons-round text-gold" style="font-size:14px;">movie_filter</span> Free Shipping Over $150</span>
    <span class="text-[11px] tracking-[3px] uppercase text-text-dim flex items-center gap-4"><span class="material-icons-round text-gold" style="font-size:14px;">movie_filter</span> Limited Drops Weekly</span>
    <!-- duplicate for seamless loop -->
    <span class="text-[11px] tracking-[3px] uppercase text-text-dim flex items-center gap-4"><span class="material-icons-round text-gold" style="font-size:14px;">movie_filter</span> Anime Collection</span>
    <span class="text-[11px] tracking-[3px] uppercase text-text-dim flex items-center gap-4"><span class="material-icons-round text-gold" style="font-size:14px;">movie_filter</span> Cinema Collection</span>
    <span class="text-[11px] tracking-[3px] uppercase text-text-dim flex items-center gap-4"><span class="material-icons-round text-gold" style="font-size:14px;">movie_filter</span> Gaming Collection</span>
    <span class="text-[11px] tracking-[3px] uppercase text-text-dim flex items-center gap-4"><span class="material-icons-round text-gold" style="font-size:14px;">movie_filter</span> 24 Premium Frames</span>
    <span class="text-[11px] tracking-[3px] uppercase text-text-dim flex items-center gap-4"><span class="material-icons-round text-gold" style="font-size:14px;">movie_filter</span> Free Shipping Over $150</span>
    <span class="text-[11px] tracking-[3px] uppercase text-text-dim flex items-center gap-4"><span class="material-icons-round text-gold" style="font-size:14px;">movie_filter</span> Limited Drops Weekly</span>
  </div>
</div>

<!-- ─── COLLECTIONS ─── -->
<section class="px-12 py-24">
  <div class="flex justify-between items-end mb-14">
    <div>
      <p class="text-[11px] tracking-[4px] uppercase text-gold mb-3 flex items-center gap-3 eyebrow">Curated Collections</p>
      <h2 class="font-bebas tracking-[2px]" style="font-size: clamp(36px, 4vw, 56px);">EXPLORE OUR UNIVERSE</h2>
    </div>
    <a href="#" class="text-text-sec text-[12px] tracking-[2px] uppercase no-underline flex items-center gap-2 pb-1 border-b border-brand-border hover:text-white hover:border-white transition-colors duration-200">
      View All <span class="material-icons-round" style="font-size:16px;">chevron_right</span>
    </a>
  </div>

  <div class="grid grid-cols-3 gap-px">

    <!-- Anime -->
    <a href="#" class="cat-card relative bg-bg-card p-14 overflow-hidden border border-brand-border no-underline text-white block hover:bg-hover transition-colors duration-300">
      <span class="font-bebas absolute top-5 right-7 leading-none text-white/[0.04]" style="font-size:80px;">01</span>
      <div class="w-12 h-12 border flex items-center justify-center mb-8" style="background:rgba(212,175,55,0.08);border-color:rgba(212,175,55,0.2);">
        <span class="material-icons-round text-gold" style="font-size:22px;">auto_awesome</span>
      </div>
      <p class="text-[11px] tracking-[3px] uppercase text-text-dim mb-3">Category 01</p>
      <h3 class="font-bebas text-4xl tracking-[2px] mb-4">ANIME COLLECTION</h3>
      <p class="text-sm leading-relaxed text-text-sec mb-8">Premium frames featuring iconic anime scenes and characters. Hand-selected for the true enthusiast.</p>
      <div class="cat-arrow flex items-center gap-2 text-[12px] tracking-[2px] uppercase text-gold">
        Explore <span class="material-icons-round" style="font-size:16px;">arrow_forward</span>
      </div>
    </a>

    <!-- Cinema -->
    <a href="#" class="cat-card relative bg-bg-card p-14 overflow-hidden border border-brand-border no-underline text-white block hover:bg-hover transition-colors duration-300">
      <span class="font-bebas absolute top-5 right-7 leading-none text-white/[0.04]" style="font-size:80px;">02</span>
      <div class="w-12 h-12 border flex items-center justify-center mb-8" style="background:rgba(212,175,55,0.08);border-color:rgba(212,175,55,0.2);">
        <span class="material-icons-round text-gold" style="font-size:22px;">theaters</span>
      </div>
      <p class="text-[11px] tracking-[3px] uppercase text-text-dim mb-3">Category 02</p>
      <h3 class="font-bebas text-4xl tracking-[2px] mb-4">CINEMA COLLECTION</h3>
      <p class="text-sm leading-relaxed text-text-sec mb-8">Classic and modern movie frames for the discerning cinephile. Cinema shaped us — let it shape your walls.</p>
      <div class="cat-arrow flex items-center gap-2 text-[12px] tracking-[2px] uppercase text-gold">
        Explore <span class="material-icons-round" style="font-size:16px;">arrow_forward</span>
      </div>
    </a>

    <!-- Gaming -->
    <a href="#" class="cat-card relative bg-bg-card p-14 overflow-hidden border border-brand-border no-underline text-white block hover:bg-hover transition-colors duration-300">
      <span class="font-bebas absolute top-5 right-7 leading-none text-white/[0.04]" style="font-size:80px;">03</span>
      <div class="w-12 h-12 border flex items-center justify-center mb-8" style="background:rgba(212,175,55,0.08);border-color:rgba(212,175,55,0.2);">
        <span class="material-icons-round text-gold" style="font-size:22px;">sports_esports</span>
      </div>
      <p class="text-[11px] tracking-[3px] uppercase text-text-dim mb-3">Category 03</p>
      <h3 class="font-bebas text-4xl tracking-[2px] mb-4">GAMING COLLECTION</h3>
      <p class="text-sm leading-relaxed text-text-sec mb-8">Epic gaming moments framed for the ultimate gamer experience. Level up your space.</p>
      <div class="cat-arrow flex items-center gap-2 text-[12px] tracking-[2px] uppercase text-gold">
        Explore <span class="material-icons-round" style="font-size:16px;">arrow_forward</span>
      </div>
    </a>

  </div>
</section>

<!-- ─── FEATURED FRAMES ─── -->
<section class="px-12 pb-24">
  <div class="flex justify-between items-end mb-14">
    <div>
      <p class="text-[11px] tracking-[4px] uppercase text-gold mb-3 flex items-center gap-3 eyebrow">Featured Products</p>
      <h2 class="font-bebas tracking-[2px]" style="font-size: clamp(36px, 4vw, 56px);">BESTSELLING FRAMES</h2>
    </div>
    <a href="#" class="text-text-sec text-[12px] tracking-[2px] uppercase no-underline flex items-center gap-2 pb-1 border-b border-brand-border hover:text-white hover:border-white transition-colors duration-200">
      Shop All 24 <span class="material-icons-round" style="font-size:16px;">chevron_right</span>
    </a>
  </div>

  <div class="grid grid-cols-3 gap-px">

    <!-- Aurora -->
    <div class="frame-card relative bg-bg-card border border-brand-border overflow-hidden hover:bg-hover transition-colors duration-300">
      <div class="relative flex items-center justify-center overflow-hidden" style="aspect-ratio:4/3;background:linear-gradient(135deg,#1a0028,#250035);">
        <div class="frame-zoom flex items-center justify-center w-full h-full">
          <div class="frame-aurora"></div>
        </div>
        <span class="absolute top-4 left-4 text-[10px] tracking-[2px] uppercase font-medium px-2.5 py-1"
              style="background:#3a2a1a;color:#D4AF37;">Bestseller</span>
        <button class="absolute top-4 right-4 w-9 h-9 flex items-center justify-center border border-brand-border cursor-pointer"
                style="background:rgba(10,0,15,0.8);">
          <span class="material-icons-round text-text-sec" style="font-size:18px;">favorite_border</span>
        </button>
        <button class="cart-reveal absolute bottom-0 inset-x-0 bg-white text-black py-3.5 text-[11px] tracking-[2px] uppercase font-medium cursor-pointer flex items-center justify-center gap-2 border-none hover:bg-gold hover:text-black">
          <span class="material-icons-round" style="font-size:16px;">shopping_cart</span> Add to Cart
        </button>
      </div>
      <div class="p-6">
        <h3 class="text-base font-normal mb-1.5">Aurora Frame</h3>
        <p class="text-[13px] text-text-sec mb-4 leading-relaxed">Hand-finished frame inspired by northern lights. Durable and elegant.</p>
        <div class="flex justify-between items-center">
          <span class="text-lg font-medium">$49.99</span>
          <div class="flex gap-0.5">
            <span class="material-icons-round text-gold" style="font-size:14px;">star</span>
            <span class="material-icons-round text-gold" style="font-size:14px;">star</span>
            <span class="material-icons-round text-gold" style="font-size:14px;">star</span>
            <span class="material-icons-round text-gold" style="font-size:14px;">star</span>
            <span class="material-icons-round text-gold" style="font-size:14px;">star</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Eclipse -->
    <div class="frame-card relative bg-bg-card border border-brand-border overflow-hidden hover:bg-hover transition-colors duration-300">
      <div class="relative flex items-center justify-center overflow-hidden" style="aspect-ratio:4/3;background:linear-gradient(135deg,#1a0028,#250035);">
        <div class="frame-zoom flex items-center justify-center w-full h-full">
          <div class="frame-eclipse"></div>
        </div>
        <span class="absolute top-4 left-4 text-[10px] tracking-[2px] uppercase font-medium px-2.5 py-1"
              style="background:#0e2e0e;color:#7dcc7d;">New</span>
        <button class="absolute top-4 right-4 w-9 h-9 flex items-center justify-center border border-brand-border cursor-pointer"
                style="background:rgba(10,0,15,0.8);">
          <span class="material-icons-round text-text-sec" style="font-size:18px;">favorite_border</span>
        </button>
        <button class="cart-reveal absolute bottom-0 inset-x-0 bg-white text-black py-3.5 text-[11px] tracking-[2px] uppercase font-medium cursor-pointer flex items-center justify-center gap-2 border-none hover:bg-gold hover:text-black">
          <span class="material-icons-round" style="font-size:16px;">shopping_cart</span> Add to Cart
        </button>
      </div>
      <div class="p-6">
        <h3 class="text-base font-normal mb-1.5">Eclipse Frame</h3>
        <p class="text-[13px] text-text-sec mb-4 leading-relaxed">Sleek matte finish with contemporary bevel — perfect for modern prints.</p>
        <div class="flex justify-between items-center">
          <span class="text-lg font-medium">$59.99</span>
          <div class="flex gap-0.5">
            <span class="material-icons-round text-gold" style="font-size:14px;">star</span>
            <span class="material-icons-round text-gold" style="font-size:14px;">star</span>
            <span class="material-icons-round text-gold" style="font-size:14px;">star</span>
            <span class="material-icons-round text-gold" style="font-size:14px;">star</span>
            <span class="material-icons-round text-gold" style="font-size:14px;">star</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Noir -->
    <div class="frame-card relative bg-bg-card border border-brand-border overflow-hidden hover:bg-hover transition-colors duration-300">
      <div class="relative flex items-center justify-center overflow-hidden" style="aspect-ratio:4/3;background:linear-gradient(135deg,#1a0028,#250035);">
        <div class="frame-zoom flex items-center justify-center w-full h-full">
          <div class="frame-noir"></div>
        </div>
        <span class="absolute top-4 left-4 text-[10px] tracking-[2px] uppercase font-medium px-2.5 py-1"
              style="background:#2E003E;color:#c47dcc;">Limited</span>
        <button class="absolute top-4 right-4 w-9 h-9 flex items-center justify-center border border-brand-border cursor-pointer"
                style="background:rgba(10,0,15,0.8);">
          <span class="material-icons-round text-text-sec" style="font-size:18px;">favorite_border</span>
        </button>
        <button class="cart-reveal absolute bottom-0 inset-x-0 bg-white text-black py-3.5 text-[11px] tracking-[2px] uppercase font-medium cursor-pointer flex items-center justify-center gap-2 border-none hover:bg-gold hover:text-black">
          <span class="material-icons-round" style="font-size:16px;">shopping_cart</span> Add to Cart
        </button>
      </div>
      <div class="p-6">
        <h3 class="text-base font-normal mb-1.5">Noir Frame</h3>
        <p class="text-[13px] text-text-sec mb-4 leading-relaxed">Deep black satin finish for dramatic contrast and gallery appeal.</p>
        <div class="flex justify-between items-center">
          <span class="text-lg font-medium">$79.99</span>
          <div class="flex gap-0.5">
            <span class="material-icons-round text-gold" style="font-size:14px;">star</span>
            <span class="material-icons-round text-gold" style="font-size:14px;">star</span>
            <span class="material-icons-round text-gold" style="font-size:14px;">star</span>
            <span class="material-icons-round text-gold" style="font-size:14px;">star</span>
            <span class="material-icons-round text-gold" style="font-size:14px;">star</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</section>

<!-- ─── NEWSLETTER ─── -->
<div class="bg-bg-card border-t border-b border-brand-border px-12 py-20 grid grid-cols-2 gap-20 items-center">
  <div>
    <p class="text-[11px] tracking-[4px] uppercase text-gold mb-3 flex items-center gap-3 eyebrow">Join The Society</p>
    <h2 class="font-bebas tracking-[2px] mb-4" style="font-size:clamp(36px,3.5vw,48px);">EXCLUSIVE DROPS. EARLY ACCESS.</h2>
    <p class="text-sm text-text-sec leading-relaxed">Subscribe to receive exclusive drops, behind-the-scenes content, and early access to limited frames.</p>
  </div>
  <div>
    <div class="flex">
      <input type="email" placeholder="Enter your email address"
             class="flex-1 bg-bg border border-r-0 border-brand-border text-white px-5 py-4 text-sm outline-none placeholder-text-dim focus:border-gold transition-colors"
             style="font-family:'DM Sans',sans-serif;" />
      <button class="bg-white text-black px-8 py-4 text-[12px] tracking-[2px] uppercase font-medium border-none cursor-pointer hover:bg-gold hover:text-black transition-colors duration-200"
              style="font-family:'DM Sans',sans-serif;">
        Subscribe
      </button>
    </div>
    <p class="text-[12px] text-text-dim mt-4">By subscribing you agree to our Terms &amp; Conditions and Privacy Policy.</p>
  </div>
</div>

<!-- ─── FOOTER ─── -->
<footer class="bg-bg border-t border-brand-border px-12 pt-16 pb-8">
  <div class="grid gap-16 mb-12" style="grid-template-columns:2fr 1fr 1fr 1fr;">

    <div>
      <a href="#" class="flex items-center gap-2.5 font-bebas text-[22px] tracking-[3px] text-white no-underline mb-5">
        <span class="material-icons-round text-gold" style="font-size:20px;">movie_filter</span>
        RAPHAEL FRAME
      </a>
      <p class="text-[13px] text-text-sec leading-relaxed max-w-[280px]">The ultimate destination for pop-culture enthusiasts. We frame the moments that define generations.</p>
      <div class="flex gap-3 mt-6">
        <a href="#" class="w-9 h-9 border border-brand-border flex items-center justify-center text-text-sec text-[12px] no-underline hover:border-white hover:text-white transition-colors duration-200">f</a>
        <a href="#" class="w-9 h-9 border border-brand-border flex items-center justify-center text-text-sec text-[12px] no-underline hover:border-white hover:text-white transition-colors duration-200">𝕏</a>
        <a href="#" class="w-9 h-9 border border-brand-border flex items-center justify-center text-text-sec text-[12px] no-underline hover:border-white hover:text-white transition-colors duration-200">ig</a>
        <a href="#" class="w-9 h-9 border border-brand-border flex items-center justify-center text-text-sec text-[12px] no-underline hover:border-white hover:text-white transition-colors duration-200">yt</a>
      </div>
    </div>

    <div>
      <h4 class="text-[11px] tracking-[3px] uppercase text-white mb-5">Discover</h4>
      <ul class="list-none space-y-3">
        <li><a href="#" class="text-text-sec text-[13px] no-underline hover:text-white transition-colors duration-200">Collections</a></li>
        <li><a href="#" class="text-text-sec text-[13px] no-underline hover:text-white transition-colors duration-200">Artists</a></li>
        <li><a href="#" class="text-text-sec text-[13px] no-underline hover:text-white transition-colors duration-200">Frames</a></li>
        <li><a href="#" class="text-text-sec text-[13px] no-underline hover:text-white transition-colors duration-200">About</a></li>
      </ul>
    </div>

    <div>
      <h4 class="text-[11px] tracking-[3px] uppercase text-white mb-5">Support</h4>
      <ul class="list-none space-y-3">
        <li><a href="#" class="text-text-sec text-[13px] no-underline hover:text-white transition-colors duration-200">Help Center</a></li>
        <li><a href="#" class="text-text-sec text-[13px] no-underline hover:text-white transition-colors duration-200">Contact Us</a></li>
        <li><a href="#" class="text-text-sec text-[13px] no-underline hover:text-white transition-colors duration-200">Shipping Info</a></li>
        <li><a href="#" class="text-text-sec text-[13px] no-underline hover:text-white transition-colors duration-200">Returns</a></li>
      </ul>
    </div>

    <div>
      <h4 class="text-[11px] tracking-[3px] uppercase text-white mb-5">Legal</h4>
      <ul class="list-none space-y-3">
        <li><a href="#" class="text-text-sec text-[13px] no-underline hover:text-white transition-colors duration-200">Privacy Policy</a></li>
        <li><a href="#" class="text-text-sec text-[13px] no-underline hover:text-white transition-colors duration-200">Terms of Service</a></li>
        <li><a href="#" class="text-text-sec text-[13px] no-underline hover:text-white transition-colors duration-200">Cookie Policy</a></li>
        <li><a href="#" class="text-text-sec text-[13px] no-underline hover:text-white transition-colors duration-200">Accessibility</a></li>
      </ul>
    </div>

  </div>

  <div class="border-t border-brand-border pt-7 flex justify-between items-center">
    <p class="text-[12px] text-text-dim">© 2026 Raphael Frame Society. All rights reserved.</p>
    <div class="flex gap-2">
      <div class="bg-bg-card border border-brand-border px-2.5 py-1 text-[10px] tracking-[1px] uppercase text-text-dim">VISA</div>
      <div class="bg-bg-card border border-brand-border px-2.5 py-1 text-[10px] tracking-[1px] uppercase text-text-dim">MC</div>
      <div class="bg-bg-card border border-brand-border px-2.5 py-1 text-[10px] tracking-[1px] uppercase text-text-dim">AMEX</div>
      <div class="bg-bg-card border border-brand-border px-2.5 py-1 text-[10px] tracking-[1px] uppercase text-text-dim">PP</div>
    </div>
  </div>
</footer>

</body>
</html>