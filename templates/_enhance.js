/* ═══════════════════════════════════════════════════════════════
   MULLER DEV STUDIOS — Universal template enhancements
   Additive layer · won't conflict with existing template code.
   Adds: tickers · magnetic CTAs · scroll reveals · marker highlights
   ═══════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  /* --- Inject CSS --- */
  const css = document.createElement('style');
  css.textContent = `
  [data-mds-reveal]{opacity:0;transform:translateY(28px);transition:opacity .9s cubic-bezier(.22,1,.36,1),transform .9s cubic-bezier(.22,1,.36,1)}
  [data-mds-reveal].in{opacity:1;transform:none}
  [data-mds-counter]{font-variant-numeric:tabular-nums}
  .mds-mark{position:relative;display:inline-block;padding:0 .15em;color:inherit;z-index:1}
  .mds-mark::before{content:'';position:absolute;inset:.18em -.05em .12em -.05em;background:var(--accent,#d4ff00);z-index:-1;transform:skew(-6deg) rotate(-1deg);border-radius:2px;opacity:.85}
  .mds-tilt{transition:transform .12s linear;transform-style:preserve-3d;will-change:transform}
  .mds-magnetic{transition:transform .25s cubic-bezier(.22,1,.36,1);will-change:transform}
  .mds-shine{position:absolute;inset:0;background:radial-gradient(circle 220px at var(--mx,50%) var(--my,50%),rgba(255,255,255,.06),transparent 60%);pointer-events:none;opacity:0;transition:opacity .25s;mix-blend-mode:overlay;z-index:5;border-radius:inherit}
  `;
  document.head.appendChild(css);

  /* --- Magnetic effect on prominent CTAs --- */
  const magnets = document.querySelectorAll(
    '.cta, .nav-cta, .button, .btn-primary, .primary, button[type=submit], .btn'
  );
  magnets.forEach(b=>{
    b.classList.add('mds-magnetic');
    b.addEventListener('mousemove',e=>{
      const r=b.getBoundingClientRect();
      const dx=(e.clientX-(r.left+r.width/2))*.2;
      const dy=(e.clientY-(r.top+r.height/2))*.2;
      b.style.transform=`translate(${dx}px,${dy}px)`;
    });
    b.addEventListener('mouseleave',()=>b.style.transform='');
  });

  /* --- Auto reveal on scroll for major sections --- */
  document.querySelectorAll('section > *, .grid > *, .card, [class*="card"]').forEach((el,i)=>{
    if(el.children.length>40)return; // skip very dense parents
    if(el.dataset.mdsReveal!==undefined)return;
    el.setAttribute('data-mds-reveal','');
    if(i%3) el.style.transitionDelay=((i%5)*.06)+'s';
  });
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
  },{threshold:.08});
  document.querySelectorAll('[data-mds-reveal]').forEach(el=>io.observe(el));

  /* --- Counter ticker on [data-counter] or auto-detected stats --- */
  const counterEls = document.querySelectorAll('[data-mds-counter]');
  const cio = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting||e.target.dataset.done)return;
      e.target.dataset.done='1';
      const target=parseFloat(e.target.dataset.mdsCounter||e.target.textContent);
      if(isNaN(target))return;
      const dur=1400;
      const t0=performance.now();
      const isFloat=String(target).includes('.');
      const suffix=e.target.dataset.suffix||'';
      function step(t){
        const k=Math.min(1,(t-t0)/dur);
        const ease=1-Math.pow(1-k,3);
        const v=target*ease;
        e.target.textContent=(isFloat?v.toFixed(1):Math.floor(v))+suffix;
        if(k<1)requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  },{threshold:.4});
  counterEls.forEach(el=>cio.observe(el));

  /* --- Add tilt + shine to image-heavy cards --- */
  const tiltable = document.querySelectorAll(
    '.property-card, .listing, .work-card, .case-study, .gallery-item, .product-card, [class*="property"], [class*="listing"]'
  );
  tiltable.forEach(card=>{
    if(getComputedStyle(card).position==='static') card.style.position='relative';
    card.classList.add('mds-tilt');
    const shine=document.createElement('div');
    shine.className='mds-shine';
    card.appendChild(shine);
    let raf;
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>{
        card.style.transform=`perspective(900px) rotateY(${x*5}deg) rotateX(${-y*5}deg) translateZ(0)`;
        card.style.setProperty('--mx',((e.clientX-r.left)/r.width*100)+'%');
        card.style.setProperty('--my',((e.clientY-r.top)/r.height*100)+'%');
        shine.style.opacity='1';
      });
    });
    card.addEventListener('mouseleave',()=>{
      card.style.transform='';
      shine.style.opacity='0';
    });
  });

  /* --- Smooth anchor scroll --- */
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const id=a.getAttribute('href');
      if(id.length>1){
        const t=document.querySelector(id);
        if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}
      }
    });
  });

  /* --- Tiny "made with care" footer signature (only if no signature yet) --- */
  if(!document.querySelector('.mds-sig') && document.body){
    const sig=document.createElement('div');
    sig.className='mds-sig';
    sig.innerHTML='<a href="https://tristanmuller007.github.io/" target="_blank" rel="noopener" style="position:fixed;bottom:14px;left:14px;background:rgba(0,0,0,.6);backdrop-filter:blur(10px);color:rgba(255,255,255,.7);font-family:system-ui,sans-serif;font-size:10px;letter-spacing:1px;text-transform:uppercase;padding:6px 10px;border-radius:30px;border:1px solid rgba(255,255,255,.1);z-index:9990;text-decoration:none">Demo · Muller Dev Studios →</a>';
    document.body.appendChild(sig);
  }

})();
