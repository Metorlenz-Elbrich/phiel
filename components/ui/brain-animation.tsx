"use client";

import { useEffect, useRef } from "react";

export default function BrainAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    let animFrame: number;
    let W = 0, H = 0;
    let isDark = document.documentElement.classList.contains("dark");
    let mouseX = -9999, mouseY = -9999;
    let isMouseInLeft = false, isMouseInRight = false;

    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isMouseInLeft  = mouseX < W / 2;
      isMouseInRight = mouseX > W / 2;
    };
    const onMouseLeave = () => { mouseX = -9999; mouseY = -9999; isMouseInLeft = false; isMouseInRight = false; };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    function rgba(hex: string, a: number) {
      const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
      return `rgba(${r},${g},${b},${Math.min(1,Math.max(0,a))})`;
    }
    const CYAN = "#00d4ff", BLUE = "#0066cc";

    // ── Brain path ─────────────────────────────────────────
    function makeBrainPath(cx: number, cy: number, R: number): Path2D {
      const p = new Path2D();
      const x = (d: number) => cx + d * R, y = (d: number) => cy + d * R;
      p.moveTo(x(0), y(-0.72));
      p.bezierCurveTo(x(-0.10),y(-0.95),x(-0.30),y(-1.05),x(-0.42),y(-0.88));
      p.bezierCurveTo(x(-0.52),y(-0.75),x(-0.68),y(-0.82),x(-0.72),y(-0.65));
      p.bezierCurveTo(x(-0.82),y(-0.55),x(-0.98),y(-0.50),x(-0.95),y(-0.30));
      p.bezierCurveTo(x(-0.92),y(-0.12),x(-1.02),y(-0.02),x(-0.98),y( 0.15));
      p.bezierCurveTo(x(-0.95),y( 0.30),x(-1.00),y( 0.42),x(-0.90),y( 0.52));
      p.bezierCurveTo(x(-0.80),y( 0.62),x(-0.78),y( 0.72),x(-0.62),y( 0.75));
      p.bezierCurveTo(x(-0.48),y( 0.80),x(-0.30),y( 0.82),x(-0.16),y( 0.75));
      p.bezierCurveTo(x(-0.08),y( 0.70),x(-0.02),y( 0.65),x(0),    y( 0.55));
      p.bezierCurveTo(x( 0.01),y( 0.45),x( 0.01),y( 0.40),x(0),    y( 0.30));
      p.bezierCurveTo(x( 0.02),y( 0.65),x( 0.08),y( 0.70),x( 0.16),y( 0.75));
      p.bezierCurveTo(x( 0.30),y( 0.82),x( 0.48),y( 0.80),x( 0.62),y( 0.75));
      p.bezierCurveTo(x( 0.78),y( 0.72),x( 0.80),y( 0.62),x( 0.90),y( 0.52));
      p.bezierCurveTo(x( 1.00),y( 0.42),x( 0.95),y( 0.30),x( 0.98),y( 0.15));
      p.bezierCurveTo(x( 1.02),y(-0.02),x( 0.92),y(-0.12),x( 0.95),y(-0.30));
      p.bezierCurveTo(x( 0.98),y(-0.50),x( 0.82),y(-0.55),x( 0.72),y(-0.65));
      p.bezierCurveTo(x( 0.68),y(-0.82),x( 0.52),y(-0.75),x( 0.42),y(-0.88));
      p.bezierCurveTo(x( 0.30),y(-1.05),x( 0.10),y(-0.95),x(0),    y(-0.72));
      p.closePath();
      return p;
    }

    function inBrain(px: number, py: number, cx: number, cy: number, R: number) {
      const nx=(px-cx)/R, ny=(py-cy)/R;
      if(nx*nx/0.9025+ny*ny/0.7225>0.88) return false;
      if(Math.abs(nx)<0.06&&ny<-0.60) return false;
      return true;
    }
    function inLeft(px:number,py:number,cx:number,cy:number,R:number){return px<cx-5&&inBrain(px,py,cx,cy,R);}
    function inRight(px:number,py:number,cx:number,cy:number,R:number){return px>cx+5&&inBrain(px,py,cx,cy,R);}

    function mulberry32(seed: number){
      return()=>{seed|=0;seed=(seed+0x6D2B79F5)|0;let t=Math.imul(seed^(seed>>>15),1|seed);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};
    }
    const rng = mulberry32(0xc0ffee42);

    interface Pt      { x:number; y:number }
    interface CNode   { hx:number; hy:number; cx:number; cy:number; lit:number; traceIdx:number[] }
    interface Trace   { pts:Pt[]; nodeIndices:number[]; progress:number; speed:number; boost:number }
    interface Neuron  { hx:number; hy:number; cx:number; cy:number; r:number; phase:number; speed:number; cascadeGlow:number }
    interface Synapse { a:number; b:number; progress:number; speed:number; active:boolean; timer:number; cascading:boolean }

    let traces:   Trace[]   = [];
    let cnodes:   CNode[]   = [];
    let neurons:  Neuron[]  = [];
    let synapses: Synapse[] = [];

    function segLen(pts:Pt[]){let l=0;for(let i=1;i<pts.length;i++)l+=Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y);return l;}
    function pointAt(pts:Pt[],t:number):Pt{
      let rem=t*segLen(pts);
      for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y);if(rem<=d){const f=rem/d;return{x:pts[i-1].x+(pts[i].x-pts[i-1].x)*f,y:pts[i-1].y+(pts[i].y-pts[i-1].y)*f};}rem-=d;}
      return pts[pts.length-1];
    }

    function build(){
      const cx=W/2,cy=H/2,R=Math.min(W,H)*0.42;
      traces=[];cnodes=[];neurons=[];synapses=[];

      // LEFT: circuit traces + nodes
      for(let i=0;i<16;i++){
        let sx=0,sy=0,att=0;
        do{sx=cx-R*(0.08+rng()*0.82);sy=cy+R*(rng()*1.55-0.78);att++;}while(!inLeft(sx,sy,cx,cy,R)&&att<80);
        if(!inLeft(sx,sy,cx,cy,R))continue;

        const pts:Pt[]=[{x:sx,y:sy}];
        const nodeIndices:number[]=[];
        let cur={x:sx,y:sy};
        for(let s=0;s<3+Math.floor(rng()*4);s++){
          const horiz=rng()>0.5,len=20+rng()*55;
          const nx=horiz?cur.x+(rng()>0.5?len:-len):cur.x;
          const ny=horiz?cur.y:cur.y+(rng()>0.5?len:-len);
          if(inLeft(nx,ny,cx,cy,R)){
            cur={x:nx,y:ny};pts.push(cur);
            const ni=cnodes.length;
            cnodes.push({hx:nx,hy:ny,cx:nx,cy:ny,lit:0,traceIdx:[i]});
            nodeIndices.push(ni);
          }
        }
        if(pts.length>1)traces.push({pts,nodeIndices,progress:rng(),speed:0.0014+rng()*0.0032,boost:1});
      }

      // RIGHT: neurons
      for(let i=0;i<30;i++){
        let nx=0,ny=0,att=0;
        do{const angle=(rng()-0.5)*Math.PI,dist=R*(0.10+rng()*0.78);nx=cx+dist*Math.cos(angle);ny=cy+dist*Math.sin(angle);att++;}
        while(!inRight(nx,ny,cx,cy,R)&&att<80);
        if(!inRight(nx,ny,cx,cy,R))continue;
        neurons.push({hx:nx,hy:ny,cx:nx,cy:ny,r:2.2+rng()*3.8,phase:rng()*Math.PI*2,speed:0.009+rng()*0.022,cascadeGlow:0});
      }

      for(let a=0;a<neurons.length;a++){
        let conn=0;
        for(let b=a+1;b<neurons.length&&conn<3;b++){
          if(Math.hypot(neurons[a].hx-neurons[b].hx,neurons[a].hy-neurons[b].hy)<R*0.40){
            synapses.push({a,b,progress:0,speed:0.007+rng()*0.015,active:rng()>0.35,timer:rng()*180,cascading:false});
            conn++;
          }
        }
      }
    }

    // ── CASCADE: trigger synapses from neuron index ──────────
    function triggerCascade(neuronIdx:number,depth:number){
      if(depth<=0)return;
      neurons[neuronIdx].cascadeGlow=1.0;
      synapses.forEach(s=>{
        if((s.a===neuronIdx||s.b===neuronIdx)&&!s.cascading){
          s.cascading=true;s.progress=0;s.active=true;
          // chain: when this synapse ends, trigger the other neuron
          const target=s.a===neuronIdx?s.b:s.a;
          setTimeout(()=>{
            s.cascading=false;
            triggerCascade(target,depth-1);
          },Math.round((1/s.speed)*16*1.2)); // approx duration
        }
      });
    }

    const cascadeCooldowns = new Set<number>();

    function draw(){
      ctx.clearRect(0,0,W,H);
      const cx=W/2,cy=H/2,R=Math.min(W,H)*0.42;
      const brainPath=makeBrainPath(cx,cy,R);
      const cyanC=isDark?CYAN:BLUE;
      const borderA=isDark?0.38:0.60;
      const divA=isDark?0.70:0.85;
      const ATTRACT_R = R*0.55; // attraction radius for circuits
      const REPEL_R   = R*0.45; // repulsion radius for neurons
      const CASCADE_R = R*0.12; // cascade trigger radius

      // ── UPDATE POSITIONS ──────────────────────────────────

      // LEFT attraction: circuit nodes drift toward mouse
      cnodes.forEach(n=>{
        if(isMouseInLeft){
          const dx=mouseX-n.hx, dy=mouseY-n.hy;
          const dist=Math.hypot(dx,dy);
          if(dist<ATTRACT_R&&dist>1){
            const force=(1-dist/ATTRACT_R)*0.06;
            const maxD=28;
            const tx=n.hx+dx/dist*Math.min(maxD,dist*force*8);
            const ty=n.hy+dy/dist*Math.min(maxD,dist*force*8);
            n.cx+=(tx-n.cx)*0.08;
            n.cy+=(ty-n.cy)*0.08;
            n.lit=Math.min(1,n.lit+0.15);
          } else {
            n.cx+=(n.hx-n.cx)*0.06;
            n.cy+=(n.hy-n.cy)*0.06;
            n.lit=Math.max(0,n.lit-0.05);
          }
        } else {
          n.cx+=(n.hx-n.cx)*0.06;
          n.cy+=(n.hy-n.cy)*0.06;
          n.lit=Math.max(0,n.lit-0.05);
        }
        // boost trace speed when node is lit
        if(n.lit>0.3) n.traceIdx.forEach(ti=>{ if(traces[ti]) traces[ti].boost=1+n.lit*3; });
      });

      // Decay boosts
      traces.forEach(tr=>{ tr.boost+=(1-tr.boost)*0.05; });

      // RIGHT repulsion: neurons flee the mouse
      neurons.forEach((n,ni)=>{
        if(isMouseInRight){
          const dx=n.hx-mouseX, dy=n.hy-mouseY;
          const dist=Math.hypot(dx,dy);
          if(dist<REPEL_R&&dist>1){
            const force=(1-dist/REPEL_R)*0.18;
            const maxD=40;
            const push=Math.min(maxD,force*80);
            const tx=n.hx+dx/dist*push;
            const ty=n.hy+dy/dist*push;
            n.cx+=(tx-n.cx)*0.10;
            n.cy+=(ty-n.cy)*0.10;
          } else {
            n.cx+=(n.hx-n.cx)*0.04;
            n.cy+=(n.hy-n.cy)*0.04;
          }
          // CASCADE trigger
          if(dist<CASCADE_R&&!cascadeCooldowns.has(ni)){
            cascadeCooldowns.add(ni);
            triggerCascade(ni,3);
            setTimeout(()=>cascadeCooldowns.delete(ni),2500);
          }
        } else {
          n.cx+=(n.hx-n.cx)*0.04;
          n.cy+=(n.hy-n.cy)*0.04;
        }
        n.cascadeGlow=Math.max(0,n.cascadeGlow-0.018);
      });

      // ── DRAW ─────────────────────────────────────────────

      // Outer glow
      ctx.save();
      ctx.filter="blur(28px)";
      ctx.fillStyle=rgba(cyanC,isDark?0.12:0.15);
      ctx.fill(brainPath);
      ctx.filter="none";
      ctx.restore();

      // Brain outline
      ctx.strokeStyle=rgba(cyanC,borderA); ctx.lineWidth=2; ctx.stroke(brainPath);
      ctx.strokeStyle=rgba(cyanC,0.07);   ctx.lineWidth=1; ctx.stroke(brainPath);

      // Clip
      ctx.save();
      ctx.clip(brainPath);

      // Background fill
      const bg=ctx.createRadialGradient(cx-R*0.2,cy,0,cx,cy,R);
      bg.addColorStop(0,rgba(BLUE,isDark?0.10:0.14));
      bg.addColorStop(0.5,rgba(CYAN,isDark?0.05:0.08));
      bg.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=bg; ctx.fill(brainPath);

      // Mouse glow LEFT
      if(isMouseInLeft&&mouseX>0){
        const mg=ctx.createRadialGradient(mouseX,mouseY,0,mouseX,mouseY,ATTRACT_R*0.8);
        mg.addColorStop(0,rgba(CYAN,isDark?0.10:0.13));
        mg.addColorStop(1,"rgba(0,212,255,0)");
        ctx.fillStyle=mg; ctx.beginPath(); ctx.arc(mouseX,mouseY,ATTRACT_R*0.8,0,Math.PI*2); ctx.fill();
      }
      // Mouse glow RIGHT
      if(isMouseInRight&&mouseX>0){
        const mg=ctx.createRadialGradient(mouseX,mouseY,0,mouseX,mouseY,REPEL_R*0.9);
        mg.addColorStop(0,rgba(CYAN,isDark?0.08:0.10));
        mg.addColorStop(1,"rgba(0,212,255,0)");
        ctx.fillStyle=mg; ctx.beginPath(); ctx.arc(mouseX,mouseY,REPEL_R*0.9,0,Math.PI*2); ctx.fill();
      }

      // Gyri fold lines
      [[-.62,-.55,-.45,-.72,-.25,-.60],[-.80,-.20,-.60,-.35,-.40,-.22],
       [-.85, .18,-.65, .05,-.42, .20],[-.75, .50,-.55, .38,-.30, .52],
       [-.45,-.10,-.28,-.25,-.10,-.08],
       [ .62,-.55, .45,-.72, .25,-.60],[ .80,-.20, .60,-.35, .40,-.22],
       [ .85, .18, .65, .05, .42, .20],[ .75, .50, .55, .38, .30, .52],
       [ .45,-.10, .28,-.25, .10,-.08],
      ].forEach(([x0,y0,x1,y1,x2,y2])=>{
        ctx.beginPath(); ctx.moveTo(cx+x0*R,cy+y0*R);
        ctx.quadraticCurveTo(cx+x1*R,cy+y1*R,cx+x2*R,cy+y2*R);
        ctx.strokeStyle=rgba(cyanC,isDark?.07:.12); ctx.lineWidth=0.8; ctx.stroke();
      });

      // LEFT: circuit traces (use current node positions for start/end)
      traces.forEach(tr=>{
        tr.progress+=tr.speed*tr.boost;
        if(tr.progress>1)tr.progress=0;

        // Redraw trace from home pts (stable backbone)
        ctx.beginPath(); ctx.moveTo(tr.pts[0].x,tr.pts[0].y);
        tr.pts.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));
        ctx.strokeStyle=rgba(BLUE,isDark?.38:.55); ctx.lineWidth=0.9; ctx.stroke();

        const pos=pointAt(tr.pts,tr.progress);
        const g=ctx.createRadialGradient(pos.x,pos.y,0,pos.x,pos.y,10);
        g.addColorStop(0,rgba(cyanC,isDark?.95:1)); g.addColorStop(1,"rgba(0,212,255,0)");
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(pos.x,pos.y,10,0,Math.PI*2); ctx.fill();
        ctx.fillStyle=isDark?"#fff":"#003388"; ctx.beginPath(); ctx.arc(pos.x,pos.y,2.2,0,Math.PI*2); ctx.fill();
      });

      // Circuit nodes (displaced by attraction)
      cnodes.forEach(n=>{
        const litBoost=n.lit;
        const size=litBoost>0?6+litBoost*6:6;
        if(litBoost>0){
          const ng=ctx.createRadialGradient(n.cx,n.cy,0,n.cx,n.cy,size*2.5);
          ng.addColorStop(0,rgba(CYAN,litBoost*0.6)); ng.addColorStop(1,"rgba(0,212,255,0)");
          ctx.fillStyle=ng; ctx.beginPath(); ctx.arc(n.cx,n.cy,size*2.5,0,Math.PI*2); ctx.fill();
        }
        ctx.fillStyle=rgba(BLUE,isDark?0.70+litBoost*0.3:0.90);
        ctx.fillRect(n.cx-size/2,n.cy-size/2,size,size);
        ctx.fillStyle=rgba(CYAN,0.5+litBoost*0.5);
        ctx.fillRect(n.cx-1,n.cy-1,2,2);
      });

      // RIGHT: synapses
      synapses.forEach(s=>{
        const na=neurons[s.a],nb=neurons[s.b];
        ctx.beginPath(); ctx.moveTo(na.cx,na.cy); ctx.lineTo(nb.cx,nb.cy);
        const synA=s.cascading?(isDark?.35:.50):(isDark?.13:.22);
        ctx.strokeStyle=rgba(cyanC,synA); ctx.lineWidth=s.cascading?1.5:.8; ctx.stroke();
        if(s.active){
          s.progress+=s.speed*(s.cascading?2.5:1);
          if(s.progress>1){s.progress=0;s.active=s.cascading?false:Math.random()>.3;s.cascading=false;}
          const px=na.cx+(nb.cx-na.cx)*s.progress,py=na.cy+(nb.cy-na.cy)*s.progress;
          const r=s.cascading?10:7;
          const gp=ctx.createRadialGradient(px,py,0,px,py,r);
          gp.addColorStop(0,rgba(cyanC,s.cascading?1.0:(isDark?.95:1)));
          gp.addColorStop(1,"rgba(0,212,255,0)");
          ctx.fillStyle=gp; ctx.beginPath(); ctx.arc(px,py,r,0,Math.PI*2); ctx.fill();
        } else { s.timer--; if(s.timer<=0){s.active=true;s.timer=60+Math.random()*120;} }
      });

      // Neurons (displaced by repulsion)
      neurons.forEach(n=>{
        n.phase+=n.speed;
        const pulse=0.55+0.45*Math.sin(n.phase);
        const cglow=n.cascadeGlow;
        const alpha=(isDark?.4:.65)+0.6*pulse+cglow*0.5;
        const radius=n.r*(0.8+0.35*pulse)*(1+cglow*0.6);

        const gn=ctx.createRadialGradient(n.cx,n.cy,0,n.cx,n.cy,radius*(cglow>0?5:4));
        gn.addColorStop(0,rgba(cyanC,(isDark?.45:.55)*pulse+cglow*.4));
        gn.addColorStop(1,"rgba(0,212,255,0)");
        ctx.fillStyle=gn; ctx.beginPath(); ctx.arc(n.cx,n.cy,radius*(cglow>0?5:4),0,Math.PI*2); ctx.fill();
        ctx.fillStyle=rgba(cyanC,Math.min(1,alpha));
        ctx.beginPath(); ctx.arc(n.cx,n.cy,radius,0,Math.PI*2); ctx.fill();
        ctx.fillStyle=`rgba(255,255,255,${Math.min(1,alpha*(isDark?.6:.9))})`;
        ctx.beginPath(); ctx.arc(n.cx-radius*.25,n.cy-radius*.25,radius*.32,0,Math.PI*2); ctx.fill();
      });

      // Centre divider
      const divG=ctx.createLinearGradient(cx,cy-R*1.1,cx,cy+R*1.1);
      divG.addColorStop(0,"rgba(0,212,255,0)");
      divG.addColorStop(0.2,rgba(cyanC,divA));
      divG.addColorStop(0.8,rgba(cyanC,divA));
      divG.addColorStop(1,"rgba(0,212,255,0)");
      ctx.strokeStyle=divG; ctx.lineWidth=1.6; ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(cx,cy-R*1.1); ctx.lineTo(cx,cy+R*1.1); ctx.stroke();

      ctx.restore();
      animFrame=requestAnimationFrame(draw);
    }

    function resize(){
      W=canvas.offsetWidth; H=canvas.offsetHeight;
      canvas.width=W*devicePixelRatio; canvas.height=H*devicePixelRatio;
      ctx.scale(devicePixelRatio,devicePixelRatio);
      build();
    }

    const prefersReduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(!prefersReduced){
      const ro=new ResizeObserver(resize);
      ro.observe(canvas); resize();
      animFrame=requestAnimationFrame(draw);
      return()=>{
        cancelAnimationFrame(animFrame); ro.disconnect();
        themeObserver.disconnect();
        canvas.removeEventListener("mousemove",onMouseMove);
        canvas.removeEventListener("mouseleave",onMouseLeave);
      };
    }
    return()=>{themeObserver.disconnect();};
  },[]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{display:"block",width:"100%",height:"100%",cursor:"crosshair"}}
    />
  );
}

export { BrainAnimation };
