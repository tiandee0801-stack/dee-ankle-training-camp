/* Progressive enhancements: all content remains readable without JavaScript. */
const buttons=[...document.querySelectorAll('[data-chapter]')];
const chapters=[...document.querySelectorAll('.chapter')];
document.querySelector('.journey-chapters').classList.add('chapters-enhanced');
function showChapter(index){buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));chapters.forEach((c,i)=>{c.classList.toggle('is-active',i===index);c.hidden=i!==index;});}
buttons.forEach((button,i)=>{button.addEventListener('click',()=>showChapter(i));button.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();const next=(i+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;showChapter(next);buttons[next].focus();}});});
showChapter(0);
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!reduced.matches&&'IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target);}}),{threshold:.1});document.querySelectorAll('.section-head,.note-sheet,.task-card,.dee-letter,.services .card').forEach(el=>observer.observe(el));}
let ticking=false;
function updateProgress(){const height=document.documentElement.scrollHeight-innerHeight;document.querySelector('.reading-progress').style.width=(height>0?Math.min(100,scrollY/height*100):0)+'%';ticking=false;}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateProgress);ticking=true;}},{passive:true});addEventListener('resize',updateProgress);updateProgress();
const menu=document.querySelector('#chapter-menu');
const menuToggle=document.querySelector('#menu-toggle');
menuToggle.addEventListener('click',()=>{menu.showModal();menuToggle.setAttribute('aria-expanded','true');});
document.querySelector('.close-menu').addEventListener('click',()=>menu.close());
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.close()));
menu.addEventListener('close',()=>{menuToggle.setAttribute('aria-expanded','false');menuToggle.focus();});
menu.addEventListener('click',event=>{if(event.target===menu){const r=menu.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)menu.close();}});
const motionToggle=document.querySelector('#motion-toggle');
let paused=reduced.matches;
const scene=document.querySelector('.comeback-scene');
const sceneImage=scene.querySelector('img');
const hero=document.querySelector('.hero');
let motionFrame=false;
function updateMotion(){motionFrame=false;if(paused){sceneImage.style.transform='';hero.style.setProperty('--hero-inset','0%');hero.style.setProperty('--hero-radius','0px');return;}const r=scene.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){sceneImage.style.transform='translateY('+Math.max(-35,Math.min(35,(innerHeight/2-r.top-r.height/2)*.06))+'px)';}const progress=Math.min(1,Math.max(0,-hero.getBoundingClientRect().top/650));hero.style.setProperty('--hero-inset',progress*5+'%');hero.style.setProperty('--hero-radius',progress*70+'px');}
function syncMotion(){document.body.classList.toggle('motion-paused',paused);motionToggle.textContent=paused?'开启动效':'暂停动效';motionToggle.setAttribute('aria-pressed',String(paused));updateMotion();}
motionToggle.addEventListener('click',()=>{paused=!paused;syncMotion();});
reduced.addEventListener('change',e=>{paused=e.matches;syncMotion();});
addEventListener('scroll',()=>{if(!motionFrame){requestAnimationFrame(updateMotion);motionFrame=true;}},{passive:true});
addEventListener('resize',updateMotion);syncMotion();
