(function(){if(window.__pi)return;window.__pi=true

var t=document.querySelector('.theme-tg'),r=document.documentElement
if(t){
  var u=function(){var e=t.querySelector('i');if(!e||!window.feather)return;e.setAttribute('data-feather',r.getAttribute('data-theme')==='light'?'sun':'moon');feather.replace()}
  t.addEventListener('click',function(){var n=r.getAttribute('data-theme')==='light'?'dark':'light';r.setAttribute('data-theme',n);localStorage.setItem('portfolio-theme',n);u()});u()}

var h=document.querySelector('.hamburger'),m=document.querySelector('.mob-overlay')
function cl(){h&&h.classList.remove('active');m&&m.classList.remove('active')}
if(h&&m){h.addEventListener('click',function(e){e.stopPropagation();h.classList.toggle('active');m.classList.toggle('active')});m.addEventListener('click',function(e){if(e.target===m)cl()});document.querySelectorAll('.mob-lk a').forEach(function(l){l.addEventListener('click',cl)})}

var ls=0,n=document.getElementById('nav')
window.addEventListener('scroll',function(){var c=window.scrollY;n.classList.toggle('hidden',c>ls&&c>100);ls=c<=0?0:c},{passive:true})

var bt=document.getElementById('bt')
window.addEventListener('scroll',function(){bt.classList.toggle('show',window.scrollY>300)},{passive:true})

var ob=new IntersectionObserver(function(e){e.forEach(function(en){if(en.isIntersecting){en.target.classList.add('visible');ob.unobserve(en.target)}})},{threshold:.08,rootMargin:'0px 0px -40px 0px'})
document.querySelectorAll('.scroll-fade').forEach(function(el){ob.observe(el)})

function ac(el,t,d){d=d||2000;var st=d/16,inc=t/st,c=0,dc=t%1!==0,ti=setInterval(function(){c+=inc;if(c>=t){el.textContent=dc?t.toFixed(2):t;clearInterval(ti)}else{el.textContent=dc?c.toFixed(2):Math.floor(c)}},16)}
var co=new IntersectionObserver(function(e){e.forEach(function(en){if(en.isIntersecting&&!en.target.dataset.c){en.target.dataset.c='true';var v=parseFloat(en.target.textContent);if(!isNaN(v))ac(en.target,v);co.unobserve(en.target)}})},{threshold:.5})
document.querySelectorAll('.cnt').forEach(function(el){co.observe(el)})

var so=new IntersectionObserver(function(e){e.forEach(function(en){if(en.isIntersecting){var el=en.target,pct=el.dataset.p||'0';el.style.width=pct+'%';so.unobserve(el)}})},{threshold:.3})
document.querySelectorAll('.sk-f').forEach(function(el){so.observe(el)})

var nl=document.querySelectorAll('.nav-lk a'),ss=document.querySelectorAll('section[id]')
window.addEventListener('scroll',function(){var cur='';ss.forEach(function(s){var t=s.offsetTop-100;if(window.scrollY>=t)cur=s.getAttribute('id')});nl.forEach(function(l){l.classList.toggle('active',l.getAttribute('href')==='#'+cur)})},{passive:true})
})()
