import { applyPosterizeToImage } from './posterize.js';
import { audioCtx, getBackgroundAudio } from './audio.js';
import { animateBirds } from './birds.js';

export async function startCutscene(){
  const cs=document.getElementById('cutscene'), img=document.createElement('img'); img.id='cutscene-image'; img.alt='Cutscene scene'; cs.prepend(img);
  const canvas=document.getElementById('cutscene-canvas'); const loading=cs.querySelector('.cutscene-loading'); cs.style.display='flex'; loading.style.display='grid';
  let posterCleanup = null;
  img.onload=()=>{ loading.style.display='none'; posterCleanup = applyPosterizeToImage(canvas, img, 5.0, 0.12); canvas.classList.add('reveal'); img.style.display='none'; animateBirds(()=>goNext()); };
  img.src='cutscene_landscape.png';
  const bg = getBackgroundAudio(); if(bg){ try{ bg.pause(); }catch(e){} }
  const cutsceneAudio=new Audio('Distant Transmission - Sonauto.ai.ogg'); const src=audioCtx.createMediaElementSource(cutsceneAudio); const g=audioCtx.createGain(); g.gain.value=0; src.connect(g).connect(audioCtx.destination);
  await audioCtx.resume(); await cutsceneAudio.play().catch(()=>{}); g.gain.linearRampToValueAtTime(1, audioCtx.currentTime+7);
  setTimeout(()=>{ g.gain.cancelScheduledValues(audioCtx.currentTime); g.gain.linearRampToValueAtTime(0, audioCtx.currentTime+7); }, (115-7)*1000);

  async function goNext(){
    canvas.classList.remove('reveal'); canvas.classList.remove('drive-zoom'); // fade out and reset zoom
    await new Promise(r=>setTimeout(r, 1200));
    if (posterCleanup) { try{ posterCleanup(); }catch{} }
    const img2 = new Image(); img2.alt='Cutscene scene 2 - roadside and distant ruins';
    img2.onload = ()=>{ posterCleanup = applyPosterizeToImage(canvas, img2, 5.0, 0.12); requestAnimationFrame(()=>{ canvas.classList.add('reveal'); canvas.classList.add('drive-zoom'); }); };
    img2.src = 'cutscene_roadside.png';
  }
}