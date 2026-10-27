(function(){
  var QUESTIONS_PER_LEVEL = 4, TOTAL_LEVELS = 5;
  var playerName="", score=0, lives=3, level=1, qIndex=0, questions=[], current=null, stars=0;
  var soundOn=true, musicTimer=null, audioCtx=null;
  function $(id){ return document.getElementById(id); }
  function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
  function shuffle(arr){ for(var i=arr.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=arr[i]; arr[i]=arr[j]; arr[j]=t; } return arr; }
  function coeff(a){ if(a===1) return "x"; if(a===-1) return "-x"; return a+"x"; }
  function eqLeft(a,b){ return coeff(a) + (b===0?"":(b>0?" + "+b:" - "+Math.abs(b))); }
  function makeOptions(ans){
    var cand=[];
    if(Math.abs(ans)>=1000) cand=[ans+1000,ans-1000,ans+2000,ans-2000,ans+500,ans-500];
    else if(Math.abs(ans)>=100) cand=[ans+100,ans-100,ans+50,ans-50,ans+10,ans-10];
    else cand=[ans+1,ans-1,ans+2,ans-2,ans+10,ans-10,-ans,ans+3,ans-3];
    shuffle(cand);
    var set={}; set[ans]=true; var opts=[ans];
    for(var i=0;i<cand.length && opts.length<4;i++){ if(!set[cand[i]]){ set[cand[i]]=true; opts.push(cand[i]); } }
    return shuffle(opts);
  }
  function makeQ(text, ans, exp){ return {text:text, answer:ans, explanation:exp, options:makeOptions(ans)}; }
  function genL1(){
    if(Math.random()<0.5){
      var x=randInt(2,20), a=randInt(2,20), b=x+a;
      return makeQ("x + "+a+" = "+b, x, "Jawaban benar: x = "+b+" − "+a+" = "+x+". Kurangkan "+a+" pada kedua ruas, lalu periksa: "+x+" + "+a+" = "+b+".");
    } else {
      var xx=randInt(10,20), aa=randInt(2,9), bb=xx-aa;
      return makeQ("x − "+aa+" = "+bb, xx, "Jawaban benar: x = "+bb+" + "+aa+" = "+xx+". Tambahkan "+aa+" pada kedua ruas, lalu periksa: "+xx+" − "+aa+" = "+bb+".");
    }
  }
  function genL2(){
    var t=randInt(1,3);
    if(t===1){
      var a=randInt(2,9), x=randInt(2,12), b=a*x;
      return makeQ(a+"x = "+b, x, "Jawaban benar: x = "+b+" ÷ "+a+" = "+x+". Bagikan kedua ruas dengan "+a+", lalu periksa: "+a+" × "+x+" = "+b+".");
    } else if(t===2){
      var a2=randInt(2,9), x2=randInt(2,12), b2=randInt(2,20), c=a2*x2+b2;
      return makeQ(eqLeft(a2,b2)+" = "+c, x2, "Jawaban benar: "+a2+"x = "+c+" − "+b2+" = "+(a2*x2)+", lalu x = "+(a2*x2)+" ÷ "+a2+" = "+x2+". Periksa: "+a2+" × "+x2+" + "+b2+" = "+c+".");
    } else {
      var a3=randInt(2,9), x3=randInt(5,12), b3=randInt(2,20), c3=a3*x3-b3;
      if(c3<=0){ c3=a3*x3+5; b3=a3*x3-c3; }
      return makeQ(eqLeft(a3,-b3)+" = "+c3, x3, "Jawaban benar: "+a3+"x = "+c3+" + "+b3+" = "+(a3*x3)+", lalu x = "+(a3*x3)+" ÷ "+a3+" = "+x3+". Periksa: "+a3+" × "+x3+" − "+b3+" = "+c3+".");
    }
  }
  function genL3(){
    if(Math.random()<0.5){
      var a=randInt(4,9), c=randInt(1,a-1), x=randInt(2,10), b=randInt(2,15), d=(a-c)*x+b;
      return makeQ(eqLeft(a,b)+" = "+eqLeft(c,d), x, "Jawaban benar: kumpulkan x di kiri dan konstanta di kanan: "+(a-c)+"x = "+d+" − "+b+" = "+((a-c)*x)+", lalu x = "+((a-c)*x)+" ÷ "+(a-c)+" = "+x+". Periksa dengan substitusi x = "+x+".");
    } else {
      var a2=randInt(2,6), b2=randInt(2,9), x2=randInt(2,10), cc=a2*(x2+b2);
      return makeQ(a2+"(x + "+b2+") = "+cc, x2, "Jawaban benar: bagikan kedua ruas dengan "+a2+": x + "+b2+" = "+cc+" ÷ "+a2+" = "+(x2+b2)+", lalu x = "+(x2+b2)+" − "+b2+" = "+x2+".");
    }
  }
  function genL4(){
    var t=randInt(1,3);
    if(t===1){
      var a=randInt(2,6), x=randInt(2,10), b=randInt(15,30), c=-a*x+b;
      return makeQ(eqLeft(-a,b)+" = "+c, x, "Jawaban benar: "+(-a)+"x = "+c+" − "+b+" = "+(-a*x)+", lalu x = "+(-a*x)+" ÷ ("+(-a)+") = "+x+". Hati-hati dengan tanda negatif saat membagi.");
    } else if(t===2){
      var d=randInt(2,3), x2=d*randInt(2,12), b2=randInt(2,15), c2=(x2/d)+b2;
      return makeQ("x ÷ "+d+" + "+b2+" = "+c2, x2, "Jawaban benar: x ÷ "+d+" = "+c2+" − "+b2+" = "+(x2/d)+", lalu x = "+(x2/d)+" × "+d+" = "+x2+". Periksa: "+x2+" ÷ "+d+" + "+b2+" = "+c2+".");
    } else {
      var a3=randInt(-4,-1), c3=randInt(2,5), x3=randInt(2,8), b3=randInt(5,20), d3=a3*x3+b3-c3*x3;
      return makeQ(eqLeft(a3,b3)+" = "+eqLeft(c3,d3), x3, "Jawaban benar: kumpulkan x di satu ruas: "+(a3-c3)+"x = "+d3+" − "+b3+" = "+((a3-c3)*x3)+", lalu x = "+((a3-c3)*x3)+" ÷ ("+(a3-c3)+") = "+x3+". Periksa dengan substitusi.");
    }
  }
  function genL5(){
    var t=randInt(1,4);
    if(t===1){
      var d=randInt(2,5), x=randInt(7,14), f=5, S=(x+f)+(x+d+f);
      return makeQ("Adik berumur x tahun. Kakak "+d+" tahun lebih tua dari adik. "+f+" tahun lagi, jumlah umur mereka "+S+" tahun. Berapa umur adik sekarang?", x, "Jawaban benar: modelnya (x + "+f+") + (x + "+d+" + "+f+") = "+S+", yaitu 2x + "+(d+2*f)+" = "+S+". Jadi 2x = "+(S-(d+2*f))+", x = "+x+" tahun. Periksa: "+(x+f)+" + "+(x+d+f)+" = "+S+".");
    } else if(t===2){
      var n=randInt(3,5), p=randInt(5,12)*1000, fee=2000, total=n*p+fee;
      return makeQ("Seorang pembeli membeli "+n+" paket mi dan membayar biaya kemasan Rp"+fee+", totalnya Rp"+total+". Berapa harga 1 paket mi?", p, "Jawaban benar: modelnya "+n+"x + "+fee+" = "+total+", yaitu "+n+"x = "+total+" − "+fee+" = "+(n*p)+", lalu x = "+(n*p)+" ÷ "+n+" = Rp"+p+".");
    } else if(t===3){
      var d2=randInt(3,8), x2=randInt(5,15), K=2*(x2 + (x2+d2));
      return makeQ("Sebuah kebun persegi panjang lebarnya x meter dan panjangnya "+d2+" meter lebih dari lebarnya. Keliling kebun itu "+K+" meter. Berapa lebar kebun?", x2, "Jawaban benar: modelnya 2(x + (x + "+d2+")) = "+K+", yaitu 2(2x + "+d2+") = "+K+", 4x + "+(2*d2)+" = "+K+", 4x = "+(K-2*d2)+", x = "+x2+" meter.");
    } else {
      var k=randInt(4,12), total2=8000+3000*k;
      return makeQ("Ojek online bertarif dasar Rp8.000 ditambah Rp3.000 per km. Rina membayar Rp"+total2+". Berapa km jarak yang ditempuh Rina?", k, "Jawaban benar: modelnya 8.000 + 3.000k = "+total2+", yaitu 3.000k = "+total2+" − 8.000 = "+(3000*k)+", lalu k = "+(3000*k)+" ÷ 3.000 = "+k+" km.");
    }
  }
  function genQuestion(lv){ if(lv===1) return genL1(); if(lv===2) return genL2(); if(lv===3) return genL3(); if(lv===4) return genL4(); return genL5(); }
  function genLevel(lv){ var arr=[]; for(var i=0;i<QUESTIONS_PER_LEVEL;i++) arr.push(genQuestion(lv)); return arr; }
  function getBest(){ try{ return JSON.parse(localStorage.getItem("bintangEnergiPLSVTerbaik")||"null"); }catch(e){ return null; } }
  function setBest(){ var best=getBest(); if(!best || score>best.skor){ try{ localStorage.setItem("bintangEnergiPLSVTerbaik", JSON.stringify({nama:playerName, skor:score})); }catch(e){} return true; } return false; }
  function showBest(){ var best=getBest(); $("bestScoreText").textContent = best ? "🏆 Skor Terbaik: "+best.skor+" oleh "+best.nama : "🏆 Skor Terbaik: belum ada"; }
  function showScreen(id){ ["startScreen","gameScreen","endScreen"].forEach(function(s){ $(s).classList.toggle("hidden", s!==id); }); }
  function ensureAudio(){ if(!audioCtx){ try{ audioCtx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } if(audioCtx && audioCtx.state==="suspended"){ audioCtx.resume(); } }
  function tone(freq,dur,type,vol,delay){ if(!soundOn||!audioCtx) return; try{ var t=audioCtx.currentTime+(delay||0); var o=audioCtx.createOscillator(); var g=audioCtx.createGain(); o.type=type||"sine"; o.frequency.setValueAtTime(freq,t); g.gain.setValueAtTime(vol||0.12,t); g.gain.exponentialRampToValueAtTime(0.001,t+dur); o.connect(g); g.connect(audioCtx.destination); o.start(t); o.stop(t+dur); }catch(e){} }
  function playClick(){ ensureAudio(); tone(600,0.08,"square",0.06); }
  function playCorrect(){ ensureAudio(); tone(523,0.12,"sine",0.14); tone(659,0.12,"sine",0.14,0.1); tone(784,0.18,"sine",0.14,0.2); }
  function playWrong(){ ensureAudio(); tone(220,0.18,"sawtooth",0.1); tone(160,0.22,"sawtooth",0.1,0.15); }
  function playWin(){ ensureAudio(); [523,659,784,1047].forEach(function(f,i){ tone(f,0.18,"sine",0.14,i*0.14); }); }
  function playLose(){ ensureAudio(); [400,300,200,140].forEach(function(f,i){ tone(f,0.2,"sawtooth",0.09,i*0.16); }); }
  function startMusic(){ if(musicTimer) return; var notes=[262,330,392,523,392,330], i=0; musicTimer=setInterval(function(){ if(!soundOn) return; tone(notes[i%notes.length],0.35,"triangle",0.04); i++; },900); }
  function stopMusic(){ if(musicTimer){ clearInterval(musicTimer); musicTimer=null; } }
  function updateHUD(){ $("hudName").textContent="👩‍🚀 "+playerName; $("hudScore").textContent="⭐ Skor: "+score; $("hudLives").textContent="❤️".repeat(lives)+"🤍".repeat(3-lives)+" ("+lives+")"; $("hudLevel").textContent="Level "+level+" / "+TOTAL_LEVELS; var dots=""; for(var j=1;j<=TOTAL_LEVELS;j++) dots+=(j<level)?"●":(j===level?"◐":"○"); $("levelDots").textContent=dots; $("doorVisual").textContent="🚪 ⭐ "+stars+" / 20 🚪"; }
  function renderQuestion(){ current=questions[qIndex]; $("levelBanner").classList.add("hidden"); $("qLevelLabel").textContent="Level "+level+" • Pintu "+(qIndex+1)+" dari "+QUESTIONS_PER_LEVEL; var qt=$("questionText"); qt.textContent=current.text; qt.style.fontSize = current.text.length>60 ? "20px" : "32px"; $("qHint").textContent = current.text.length>60 ? "Tentukan nilai yang ditanyakan dengan sifat kesetaraan. Jawaban benar +10 poin. Jawaban salah −1 nyawa." : "Tentukan nilai x dengan sifat kesetaraan. Jawaban benar +10 poin. Jawaban salah −1 nyawa."; var box=$("optionsContainer"); box.innerHTML=""; current.options.forEach(function(val){ var b=document.createElement("button"); b.type="button"; b.className="opt"; b.textContent=val; b.onclick=function(){ checkAnswer(val,b); }; box.appendChild(b); }); var fb=$("feedbackBox"); fb.className="feedback"; fb.textContent=""; $("nextBtn").classList.add("hidden"); $("nextBtn").textContent="Lanjut ➜"; updateHUD(); }
  function checkAnswer(val,btn){ var btns=$("optionsContainer").querySelectorAll(".opt"); btns.forEach(function(b){ b.disabled=true; if(parseInt(b.textContent,10)===current.answer) b.classList.add("correct"); }); var fb=$("feedbackBox"); if(val===current.answer){ score+=10; stars+=1; playCorrect(); fb.className="feedback ok"; fb.innerHTML="🎉 <b>Benar! +10 poin.</b> Kamu mendapat ⭐ dan pintu terbuka!<br>"+current.explanation; btn.classList.add("correct"); } else { lives-=1; playWrong(); fb.className="feedback bad"; fb.innerHTML="❌ <b>Belum tepat. Nyawa berkurang 1.</b> Jawaban yang benar adalah <b>"+current.answer+"</b>.<br>"+current.explanation; btn.classList.add("wrong"); } updateHUD(); var nb=$("nextBtn"); nb.classList.remove("hidden"); if(lives<=0){ nb.textContent="Lihat Hasil Akhir"; } else if(qIndex+1>=QUESTIONS_PER_LEVEL && level>=TOTAL_LEVELS){ nb.textContent="Lihat Hasil Akhir 🏆"; } else if(qIndex+1>=QUESTIONS_PER_LEVEL){ nb.textContent="Lanjut ke Level "+(level+1)+" ➜"; } else { nb.textContent="Pintu Berikutnya ➜"; } }
  function nextStep(){ playClick(); if(lives<=0){ endGame(false); return; } if(qIndex+1<QUESTIONS_PER_LEVEL){ qIndex++; renderQuestion(); return; } if(level<TOTAL_LEVELS){ level++; qIndex=0; questions=genLevel(level); renderQuestion(); var banner=$("levelBanner"); banner.textContent="🎉 Level "+(level-1)+" selesai! Selamat datang di Level "+level+" — soal makin sulit, semangat!"; banner.classList.remove("hidden"); return; } endGame(true); }
  function endGame(win){ stopMusic(); if(win) playWin(); else playLose(); var isNewBest=setBest(); var best=getBest(); $("endEmoji").textContent=win?"🏆🚀":"💔🪐"; $("endTitle").textContent=win?"Kamu Menang!":"Nyawa Habis — Coba Lagi!"; $("endMessage").textContent=win?("Luar biasa, "+playerName+"! Kamu membuka semua pintu PLSV sampai Level 5."):("Jangan menyerah, "+playerName+"! Kamu sudah berjuang sampai Level "+level+". Pelajari penjelasan jawabannya, lalu coba lagi."); $("finalName").textContent=playerName; $("finalScore").textContent=score; $("finalStars").textContent=stars; $("finalBest").textContent=best?(best.skor+" oleh "+best.nama+(isNewBest?" — Rekor baru!":"")):"-"; showScreen("endScreen"); }
  function startGame(){ var name=$("playerNameInput").value.trim(); if(!name){ $("startError").style.display="block"; $("playerNameInput").focus(); return; } $("startError").style.display="none"; ensureAudio(); playerName=name; score=0; lives=3; level=1; qIndex=0; stars=0; questions=genLevel(level); showScreen("gameScreen"); renderQuestion(); if(soundOn) startMusic(); playClick(); }
  $("startBtn").onclick=startGame;
  $("playerNameInput").addEventListener("keydown",function(e){ if(e.key==="Enter") startGame(); });
  $("howBtn").onclick=function(){ playClick(); $("howBox").classList.toggle("hidden"); };
  $("soundBtn").onclick=function(){ soundOn=!soundOn; this.textContent=soundOn?"🔊 Suara: Aktif":"🔇 Suara: Mati"; if(soundOn){ ensureAudio(); playClick(); startMusic(); } else { stopMusic(); } };
  $("nextBtn").onclick=nextStep;
  $("quitBtn").onclick=function(){ stopMusic(); showBest(); showScreen("startScreen"); };
  $("playAgainBtn").onclick=function(){ score=0; lives=3; level=1; qIndex=0; stars=0; questions=genLevel(level); showScreen("gameScreen"); renderQuestion(); if(soundOn) startMusic(); playClick(); };
  $("backToStartBtn").onclick=function(){ showBest(); showScreen("startScreen"); };
  showBest();
})();
