(function(){
"use strict";
var RM=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var COLORS=["#ff2ea6","#b6ff28","#ff9a1f","#2bb4ff","#8a3ffc","#ffd83a"];
var loadedAt=Date.now();
var human=false;
function markHuman(e){if(e&&e.isTrusted)human=true}
document.addEventListener("keydown",markHuman,true);
document.addEventListener("pointerdown",markHuman,true);

var mb=document.querySelector(".menu-btn"),nav=document.getElementById("nav");
if(mb&&nav){
mb.addEventListener("click",function(){var o=nav.classList.toggle("open");mb.setAttribute("aria-expanded",o?"true":"false")});
nav.addEventListener("click",function(e){if(e.target.closest("a")){nav.classList.remove("open");mb.setAttribute("aria-expanded","false")}});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&nav.classList.contains("open")){nav.classList.remove("open");mb.setAttribute("aria-expanded","false");mb.focus()}});
}

function burst(x,y,n){
if(RM)return;
var c=document.createElement("canvas");c.className="confetti";c.setAttribute("aria-hidden","true");
var dpr=Math.min(window.devicePixelRatio||1,2),W=window.innerWidth,H=window.innerHeight;
c.width=W*dpr;c.height=H*dpr;document.body.appendChild(c);
var g=c.getContext("2d");g.scale(dpr,dpr);
var P=[],i;n=n||60;
for(i=0;i<n;i++){var a=Math.random()*Math.PI*2,s=3+Math.random()*7;
P.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-4,r:3+Math.random()*5,c:COLORS[i%COLORS.length],k:i%3,rot:Math.random()*6,vr:(Math.random()-.5)*.3})}
var t0=performance.now();
(function f(t){var e=(t-t0)/1100;g.clearRect(0,0,W,H);
P.forEach(function(p){p.vy+=.28;p.vx*=.985;p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;g.globalAlpha=Math.max(0,1-e);g.fillStyle=p.c;g.save();g.translate(p.x,p.y);g.rotate(p.rot);
if(p.k===0){g.fillRect(-p.r,-p.r/2,p.r*2,p.r)}else if(p.k===1){g.beginPath();g.arc(0,0,p.r*.8,0,7);g.fill()}else{g.beginPath();g.ellipse(0,0,p.r*1.3,p.r*.7,0,0,7);g.fill();g.beginPath();g.arc(p.r*1.4,p.r*.4,p.r*.35,0,7);g.fill()}
g.restore()});
if(e<1)requestAnimationFrame(f);else c.remove()})(t0);
}
function burstAt(el){var r=el.getBoundingClientRect();burst(r.left+r.width/2,r.top+r.height/2)}
document.addEventListener("click",function(e){var b=e.target.closest(".btn,.chip-btn");if(b&&!b.hasAttribute("data-noconfetti"))burstAt(b)});

var eyes=[].slice.call(document.querySelectorAll(".eyes"));
function look(px,py){eyes.forEach(function(s){s.querySelectorAll(".eye").forEach(function(eg){
var b=eg.querySelector(".eb"),bb=b.getBoundingClientRect();if(!bb.width)return;
var cx=bb.left+bb.width/2,cy=bb.top+bb.height/2,dx=px-cx,dy=py-cy,d=Math.sqrt(dx*dx+dy*dy)||1,m=Math.min(d/12,bb.width*.17);
eg.querySelector(".pg").setAttribute("transform","translate("+(dx/d*m*30/bb.width).toFixed(2)+" "+(dy/d*m*30/bb.width).toFixed(2)+")")})})}
if(!RM&&eyes.length){
var raf=0,lx=0,ly=0;
window.addEventListener("pointermove",function(e){lx=e.clientX;ly=e.clientY;if(!raf)raf=requestAnimationFrame(function(){raf=0;look(lx,ly)})},{passive:true});
if(window.matchMedia("(hover: none)").matches){
setInterval(function(){look(Math.random()*window.innerWidth,Math.random()*window.innerHeight)},2600);
window.addEventListener("pointerdown",function(e){look(e.clientX,e.clientY)},{passive:true});
}
}

if("IntersectionObserver" in window){
var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add("snap");io.unobserve(en.target)}})},{threshold:.6});
document.querySelectorAll(".clap").forEach(function(c){io.observe(c)});
}

var el2=document.getElementById("earthloop");if(el2&&!RM){var p2=el2.play();if(p2&&p2.catch)p2.catch(function(){})}
var v=document.getElementById("sting");
if(v){
var tc=document.getElementById("tc"),sb=document.getElementById("sound"),mute=document.getElementById("quiet"),silentSrc=null;
var fps=24;
function pad(n){return(n<10?"0":"")+n}
v.addEventListener("timeupdate",function(){if(!tc)return;var t=v.currentTime,s=Math.floor(t);tc.textContent="REC 00:00:"+pad(s)+":"+pad(Math.floor((t-s)*fps))});
if(!RM){v.muted=true;var p=v.play();if(p&&p.catch)p.catch(function(){})}
function backToSilent(){
if(!silentSrc)return;v.pause();v.removeAttribute("src");v.loop=true;v.muted=true;
while(v.firstChild)v.removeChild(v.firstChild);
silentSrc.forEach(function(s){v.appendChild(s)});silentSrc=null;v.load();if(!RM){var q=v.play();if(q&&q.catch)q.catch(function(){})}
if(sb)sb.hidden=false;if(mute)mute.hidden=true;
}
if(sb){sb.addEventListener("click",function(){
silentSrc=[].slice.call(v.querySelectorAll("source"));
silentSrc.forEach(function(s){s.remove()});
v.src=sb.getAttribute("data-src");v.loop=false;v.muted=false;v.load();
var q=v.play();if(q&&q.catch)q.catch(function(){backToSilent()});
sb.hidden=true;if(mute)mute.hidden=false;
})}
if(mute)mute.addEventListener("click",backToSilent);
v.addEventListener("ended",backToSilent);
}

function pick(a){return a[Math.floor(Math.random()*a.length)]}
var toy=document.getElementById("toy");
if(toy){
var W={
who:["a retired rodeo clown","a nervous weather robot","a llama with a law degree","a grandma who speedruns video games","a sock puppet detective","the last honest vending machine","a surfer who is secretly a cloud","a pizza delivery astronaut","a kid inventor and her grumpy toaster","a mime who just found his voice","a goldfish with big city dreams","a substitute teacher from the future"],
what:["accidentally becomes mayor of the internet","wakes up inside a cooking show","finds a remote that rewinds Tuesdays","inherits a haunted ice cream truck","is mistaken for a famous movie star","starts a band with three raccoons","learns the moon is a giant snooze button","gets stuck in a town where everyone sings their texts","swaps lives with a very confident pigeon","wins a lifetime supply of bubble wrap"],
goal:["and must win the world's loudest bake-off","and has to throw the best birthday party in history","and must teach a whole city to be kind again","and needs to return a lost dinosaur egg","and must get everyone off their phones for one sunset","and has to save the county fair","and must deliver one very important sandwich","and needs to find the world's missing left socks"],
stakes:["before the Wi-Fi runs out forever.","before Friday's big parade.","before the sun clocks out for good.","before Grandma's casserole wakes up.","before the sequel gets cancelled.","before lunch. Probably.","before the rubber ducks unionize.","before the credits roll."],
pre:["Revenge of the","Attack of the","Return of the","The Secret Life of the","Night of the","Rise of the","Curse of the","The Great","Planet of the","Honey, I Shrunk the"],
adj:["Polite","Sparkly","Grumpy","Wobbly","Cosmic","Turbo","Very Sleepy","Unstoppable","Glittery","Suspicious","Bouncy","Overcaffeinated"],
noun:["Pickles","Toasters","Llamas","Socks","Robots","Grandmas","Raccoons","Clouds","Pigeons","Meatballs","Mimes","Goldfish"],
genre:["Comedy","Sci-fi comedy","Family adventure","Mockumentary","Musical comedy","Cartoon short","Buddy comedy","Space opera (ish)"],
rate:["Rated W for Wacky","Rated G for Giggles","Rated S for Silly","Rated FUN for Everyone"],
pal:[["#c80c70","#6420d6"],["#b84300","#c80c70"],["#0067b8","#6420d6"],["#3f7d00","#0067b8"],["#6420d6","#c80c70"],["#b54d00","#3f7d00"]]
};
var pt=document.getElementById("p-title"),pl=document.getElementById("p-line"),pg=document.getElementById("p-genre"),pr=document.getElementById("p-rate"),pc=document.getElementById("poster");
function spin(){
pt.textContent=pick(W.pre)+" "+pick(W.adj)+" "+pick(W.noun);
var w=pick(W.who);pl.textContent=w.charAt(0).toUpperCase()+w.slice(1)+" "+pick(W.what)+" "+pick(W.goal)+" "+pick(W.stakes);
pg.textContent=pick(W.genre);pr.textContent=pick(W.rate);
var c=pick(W.pal);pc.classList.remove("p0","p1","p2","p3","p4","p5");pc.classList.add("p"+W.pal.indexOf(c));
if(!RM){pc.classList.remove("spin");void pc.offsetWidth;pc.classList.add("spin")}
}
document.getElementById("spin").addEventListener("click",spin);
var cp=document.getElementById("copy");
cp.addEventListener("click",function(){
var txt=pt.textContent+" ("+pg.textContent+"). "+pl.textContent+" Made with the Madwackd Pitch-O-Matic at madwackd.com";
var done=function(){cp.textContent="Copied!";setTimeout(function(){cp.textContent="Copy pitch"},1600)};
if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(done,function(){cp.textContent="Copy blocked"})}else{cp.textContent="Copy blocked"}
});
}

var forms=[].slice.call(document.querySelectorAll("form.inq"));
var HINTS={
"Investing":"Nothing on this site is an offer to sell, or a solicitation of an offer to buy, any security. Any investment discussion happens only privately, with qualified parties, under written agreements and applicable securities laws.",
"Acting or voice talent":"Send a link to your public reel. There is no promise of roles or pay. Submissions are reviewed at our discretion and we may not reply to everyone.",
"Partnership":"Partnerships happen only by written agreement signed by both sides.",
"Collaboration":"Collabs happen only by written agreement. Please share links to public work, not story ideas or scripts.",
"Hire us to produce":"Tell us what you need made (ad, short, music video, brand film), your timeline and a rough budget range. Every project is scoped in writing first.",
"Press":"Tell us your outlet and deadline. We will do our best to get back to you quickly."
};
var PH={"Hire us to produce":"What do you want made? Ad, short, music video or brand film, plus timeline and budget range.","Investing":"Tell us a little about you and what interests you about Madwackd.","Acting or voice talent":"Who are you and what kind of roles or voices do you do?","Press":"Your outlet, your story angle and your deadline."};
function setAbout(f,val){var r=f.querySelector('input[name="Reaching out about"][value="'+val+'"]');if(r){r.checked=true;r.dispatchEvent(new Event("change",{bubbles:true}))}}
forms.forEach(function(f){
var hint=f.querySelector(".hint"),msg=f.querySelector("textarea"),base=msg?msg.getAttribute("placeholder"):"";
f.addEventListener("change",function(e){if(e.target.name!=="Reaching out about")return;var h=HINTS[e.target.value];
if(hint){if(h){hint.textContent=h;hint.classList.add("on")}else{hint.textContent="";hint.classList.remove("on")}}
if(msg)msg.setAttribute("placeholder",PH[e.target.value]||base)});
var q=new URLSearchParams(location.search).get("about");
if(q){var m={investing:"Investing",talent:"Acting or voice talent",partnership:"Partnership",collab:"Collaboration",produce:"Hire us to produce",press:"Press",friend:"Friend of the studio"}[q];if(m)setAbout(f,m)}
f.addEventListener("submit",function(e){
e.preventDefault();
var st=f.querySelector(".status"),btn=f.querySelector("button[type=submit]");
function say(cls,t){st.className="status "+cls;st.textContent=t}
if(f.querySelector('[name="_honey"]').value){say("ok","Thanks! Message sent.");f.reset();return}
if(Date.now()-loadedAt<3000){say("warn","Whoa, speedy! Give it a few seconds and press send again.");return}
if(!human){say("warn","Please type into the form or tap a field before sending.");return}
if(!f.querySelector('input[name="Reaching out about"]:checked')){say("err","Pick what you are reaching out about.");f.querySelector('input[name="Reaching out about"]').focus();return}
var link=f.querySelector('input[type=url]');
if(link&&link.value&&!/^https?:\/\//i.test(link.value)){link.value="https://"+link.value.replace(/^\/+/,"")}
if(!f.checkValidity()){f.reportValidity();say("err","A couple of fields need a look.");return}
var d=f.dataset,to=atob(d.u)+String.fromCharCode(64)+atob(d.d)+"."+atob(d.t);
var url="https://formsubmit.co/ajax/"+to;
btn.disabled=true;var old=btn.textContent;btn.textContent="Sending...";say("warn","Sending...");
fetch(url,{method:"POST",headers:{"Accept":"application/json"},body:new FormData(f)}).then(function(r){return r.json().catch(function(){return{}}).then(function(j){return{ok:r.ok,j:j}})}).then(function(res){
var s=res.j&&String(res.j.success);
if(res.ok&&s==="true"){say("ok","Sent! Thanks for reaching out. If it is a fit, we will reply by email.");f.reset();if(hint){hint.classList.remove("on")}burstAt(btn)}
else if(res.ok){say("warn","Your message went out, but delivery is not confirmed yet. If you do not hear back in a few days, please try again.")}
else{say("err","That did not go through. Please try again in a minute.")}
}).catch(function(){say("err","That did not go through (connection problem). Please try again in a minute.")}).then(function(){btn.disabled=false;btn.textContent=old});
});
});
document.querySelectorAll("[data-about]").forEach(function(a){a.addEventListener("click",function(e){
var f=document.querySelector("form.inq");if(!f)return;e.preventDefault();setAbout(f,a.getAttribute("data-about"));
var card=document.getElementById("inquire");card.scrollIntoView({behavior:RM?"auto":"smooth",block:"start"});
setTimeout(function(){var n=f.querySelector('input[name="Name"]');if(n)n.focus({preventScroll:true})},RM?0:500);
})});
})();
