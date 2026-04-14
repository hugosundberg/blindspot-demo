import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════
   BLINDSPOT — FULL INTERACTIVE PROTOTYPE
   ═══════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#08080A;--s1:#111114;--s2:#19191D;--s3:#222228;
  --red:#DC2626;--red-b:#EF4444;--red-g:rgba(220,38,38,0.25);--red-gs:rgba(220,38,38,0.5);
  --grn:#22C55E;--grn-g:rgba(34,197,94,0.25);
  --amb:#F59E0B;--amb-g:rgba(245,158,11,0.25);
  --txt:#F0F0F2;--txt-m:#6B6B76;--txt-d:#44444F;--bdr:#2A2A32;
  --fd:'Bebas Neue',sans-serif;--fb:'Outfit',sans-serif;--fm:'JetBrains Mono',monospace;
}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}
@keyframes slideRight{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}}
@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
@keyframes pulseRed{0%,100%{box-shadow:0 0 0 0 var(--red-g)}50%{box-shadow:0 0 40px 8px var(--red-gs)}}
@keyframes borderGlow{0%,100%{border-color:var(--red);box-shadow:0 0 12px var(--red-g)}50%{border-color:var(--red-b);box-shadow:0 0 24px var(--red-gs)}}
@keyframes countPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
@keyframes shakeX{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
@keyframes flash{0%{opacity:.6}100%{opacity:0}}
@keyframes stealFlash{0%,20%,40%,60%,80%,100%{opacity:1}10%,30%,50%,70%,90%{opacity:.5}}
@keyframes typewriter{from{width:0}to{width:100%}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes spinIn{from{opacity:0;transform:rotate(-180deg) scale(0)}to{opacity:1;transform:rotate(0) scale(1)}}
@keyframes ripple{0%{transform:scale(1);opacity:.4}100%{transform:scale(2.5);opacity:0}}
@keyframes marquee{0%{transform:translateX(100%)}100%{transform:translateX(-100%)}}
input{font-family:var(--fb)}
input::placeholder{color:var(--txt-d)}
`;

// ── Data ──
const PLAYERS_DATA = [
  { id:1, name:"You",  av:"Y", color:"#DC2626", chips:10 },
  { id:2, name:"Mia",  av:"M", color:"#8B5CF6", chips:10 },
  { id:3, name:"Kai",  av:"K", color:"#0EA5E9", chips:10 },
  { id:4, name:"Zoe",  av:"Z", color:"#F59E0B", chips:10 },
];

const ROUNDS_DATA = [
  {
    num:3, category:"SCIENCE",
    fragment:"In 2006, astronomers voted...",
    otherFragments:["...to reclassify a celestial body...","...orbiting beyond Neptune...","...stripping it of its status as a planet."],
    answer:"Pluto", type:"normal", poison:false,
  },
  {
    num:4, category:"HISTORY",
    fragment:"This wall divided a European capital...",
    otherFragments:["...for nearly three decades...","...until crowds dismantled it...","...in November 1989."],
    answer:"Berlin Wall", type:"steal", poison:false,
  },
  {
    num:7, category:"POP CULTURE",
    fragment:"This artist's 'Eras' concert tour...",
    otherFragments:["...became the highest-grossing tour...","...discovered by the Hubble telescope in 1996...","...spanning 146 shows worldwide."],
    answer:"Taylor Swift", type:"poison", poison:true, poisonHolder:"Kai", poisonFragment:"...discovered by the Hubble telescope in 1996...",
  },
];

const PACKS = [
  { name:"Mixed", icon:"🎲", desc:"A bit of everything" },
  { name:"Pop Culture", icon:"🎬", desc:"Movies, music, memes" },
  { name:"History", icon:"📜", desc:"Events that shaped the world" },
  { name:"Science", icon:"🔬", desc:"From atoms to galaxies" },
];

// ── Utility hooks ──
function useTimeout(callback, delay, deps=[]) {
  useEffect(() => {
    if (delay === null) return;
    const t = setTimeout(callback, delay);
    return () => clearTimeout(t);
  }, [delay, ...deps]);
}

// ── Reusable Components ──

function Phone({ children, flash }) {
  return (
    <div style={{
      width:390,minWidth:390,maxWidth:390,height:760,minHeight:760,maxHeight:760,
      margin:"0 auto",background:"var(--bg)",
      borderRadius:40,border:"2px solid var(--bdr)",overflow:"hidden",position:"relative",
      fontFamily:"var(--fb)",color:"var(--txt)",display:"flex",flexDirection:"column",
    }}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 28px 4px",fontSize:13,fontWeight:500,color:"var(--txt-m)",fontFamily:"var(--fm)",letterSpacing:.5,flexShrink:0}}>
        <span>21:37</span>
        <div style={{width:16,height:10,border:"1.5px solid var(--txt-m)",borderRadius:2,position:"relative"}}>
          <div style={{position:"absolute",right:1.5,top:1.5,bottom:1.5,left:"30%",background:"var(--txt-m)",borderRadius:1}}/>
        </div>
      </div>
      {flash && <div style={{position:"absolute",inset:0,background:flash,zIndex:100,animation:"flash 0.6s ease-out forwards",borderRadius:40,pointerEvents:"none"}}/>}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>{children}</div>
    </div>
  );
}

function Hdr({round,total,phase,chips}) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 24px 12px"}}>
      <div>
        <div style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--txt-d)",letterSpacing:2,marginBottom:2}}>ROUND {round}/{total}</div>
        <div style={{fontFamily:"var(--fd)",fontSize:28,letterSpacing:2,lineHeight:1}}>{phase}</div>
      </div>
      <ChipBadge chips={chips}/>
    </div>
  );
}

function ChipBadge({chips,size="md"}) {
  const s = size==="sm" ? {p:"4px 10px",fs:13,dot:6} : {p:"6px 14px",fs:16,dot:8};
  return (
    <div style={{display:"flex",alignItems:"center",gap:6,background:"var(--s1)",borderRadius:20,padding:s.p,border:"1px solid var(--bdr)"}}>
      <div style={{width:s.dot,height:s.dot,borderRadius:"50%",background:"var(--red)",boxShadow:"0 0 8px var(--red-g)"}}/>
      <span style={{fontFamily:"var(--fm)",fontSize:s.fs,fontWeight:600}}>{chips}</span>
    </div>
  );
}

function TimerBar({pct,color="var(--red)"}) {
  return (
    <div style={{height:3,background:"var(--s2)",borderRadius:2,overflow:"hidden",margin:"0 24px"}}>
      <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:2,transition:"width 0.5s linear"}}/>
    </div>
  );
}

function Pill({children,color="var(--txt-d)",bg="var(--s2)"}) {
  return <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,fontSize:11,fontFamily:"var(--fm)",letterSpacing:.5,color,background:bg,fontWeight:500}}>{children}</span>;
}

function Avatar({player,size=44,glow=false,onClick,muted=false}) {
  return (
    <div onClick={onClick} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:onClick?"pointer":"default",opacity:muted?.35:1,transition:"all 0.2s"}}>
      <div style={{
        width:size,height:size,borderRadius:"50%",
        background:`linear-gradient(135deg,${player.color}22,${player.color}44)`,
        border:`2px solid ${glow?player.color:"var(--bdr)"}`,
        display:"flex",alignItems:"center",justifyContent:"center",
        fontFamily:"var(--fd)",fontSize:size*.45,color:player.color,letterSpacing:1,
        boxShadow:glow?`0 0 20px ${player.color}33`:"none",transition:"all 0.3s",
      }}>{player.av}</div>
    </div>
  );
}

function Btn({children,primary=false,danger=false,full=true,onClick,disabled=false,glow=false,style:sx={}}) {
  const bg = danger ? "var(--red)" : primary ? "var(--red)" : "var(--s1)";
  const clr = primary||danger ? "white" : "var(--txt-m)";
  const shadow = (primary||danger) ? "0 4px 20px var(--red-g)" : "none";
  return (
    <button disabled={disabled} onClick={onClick} style={{
      width:full?"100%":"auto",padding:"14px 20px",borderRadius:12,
      background:bg,border:primary||danger?"none":`1.5px solid var(--bdr)`,
      color:clr,fontFamily:"var(--fb)",fontSize:15,fontWeight:600,cursor:disabled?"default":"pointer",
      letterSpacing:.5,boxShadow:shadow,opacity:disabled?.5:1,transition:"all 0.2s",
      animation:glow?"borderGlow 2s ease-in-out infinite":"none",
      ...sx,
    }}>{children}</button>
  );
}

function FragmentCard({text,label="Your Fragment",accent="var(--red)",verified=true}) {
  return (
    <div style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:16,padding:"28px 24px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,width:40,height:3,background:accent,borderRadius:"0 0 2px 0"}}/>
      <div style={{position:"absolute",top:0,left:0,width:3,height:40,background:accent}}/>
      <div style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--txt-d)",letterSpacing:2,marginBottom:14,textTransform:"uppercase"}}>{label}</div>
      <div style={{fontFamily:"var(--fb)",fontSize:21,fontWeight:300,lineHeight:1.5,color:"var(--txt)",letterSpacing:.3}}>"{text}"</div>
      {verified !== null && (
        <div style={{marginTop:20,display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:verified?"var(--grn)":"var(--red)",boxShadow:`0 0 6px ${verified?"var(--grn-g)":"var(--red-g)"}`}}/>
          <span style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--txt-d)"}}>{verified?"Verified fragment":"Poison fragment"}</span>
        </div>
      )}
    </div>
  );
}

function ScreenTransition({children,type="fade"}) {
  const anim = {fade:"fadeIn 0.4s ease-out",up:"fadeUp 0.5s ease-out",scale:"scaleIn 0.4s ease-out"}[type]||"fadeIn 0.4s";
  return <div style={{animation:anim,flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0}}>{children}</div>;
}

function ActivityItem({text,detail,time,i=0}) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:"var(--s1)",borderRadius:10,border:"1px solid var(--bdr)",animation:`slideRight 0.3s ease-out ${i*0.1}s both`}}>
      <span style={{fontSize:13,color:"var(--txt-m)"}}>{text}</span>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        {detail && <span style={{fontFamily:"var(--fm)",fontSize:12,color:"var(--red)"}}>{detail}</span>}
        {time && <span style={{fontFamily:"var(--fm)",fontSize:10,color:"var(--txt-d)"}}>{time}</span>}
      </div>
    </div>
  );
}

function IncomingTradeModal({from,amount,onAccept,onReject}) {
  return (
    <div style={{position:"absolute",bottom:0,left:0,right:0,zIndex:50,animation:"slideUp 0.35s ease-out"}}>
      <div style={{background:"var(--s1)",borderTop:"1.5px solid var(--bdr)",borderRadius:"20px 20px 0 0",padding:"24px"}}>
        <div style={{width:40,height:4,background:"var(--s3)",borderRadius:2,margin:"0 auto 16px"}}/>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          <Avatar player={from} size={40}/>
          <div>
            <div style={{fontSize:15,fontWeight:600}}>{from.name} wants to buy</div>
            <div style={{fontSize:13,color:"var(--txt-m)"}}>Offering {amount} chips for your fragment</div>
          </div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn onClick={onReject} style={{flex:1}}>Reject</Btn>
          <Btn primary onClick={onAccept} style={{flex:2}}>Accept {amount} chips</Btn>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SCREENS
   ═══════════════════════════════════════════ */

// ── Splash ──
function Splash({onNext}) {
  return (
    <Phone>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:32,position:"relative"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% 35%, var(--red-g) 0%, transparent 60%)",opacity:.5}}/>
        <div style={{animation:"scaleIn 0.6s ease-out",textAlign:"center",position:"relative",zIndex:1}}>
          <div style={{fontFamily:"var(--fd)",fontSize:72,letterSpacing:8,color:"var(--txt)",lineHeight:1,textShadow:"0 0 60px var(--red-gs)"}}>BLIND<span style={{color:"var(--red)"}}>SPOT</span></div>
          <div style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--txt-d)",letterSpacing:3,marginTop:8}}>THE PARTY QUIZ WHERE NOBODY KNOWS ENOUGH</div>
        </div>
        <div style={{position:"relative",zIndex:1,marginTop:60,width:"100%",animation:"fadeUp 0.5s ease-out 0.3s both"}}>
          <Btn primary onClick={onNext}>Create Game</Btn>
          <div style={{textAlign:"center",marginTop:16}}>
            <span style={{fontSize:14,color:"var(--txt-d)",cursor:"pointer"}}>Join with code</span>
          </div>
        </div>
        <div style={{position:"absolute",bottom:32,fontFamily:"var(--fm)",fontSize:10,color:"var(--txt-d)",letterSpacing:2}}>3–8 PLAYERS • 30–60 MIN</div>
      </div>
    </Phone>
  );
}

// ── Lobby ──
function Lobby({onNext}) {
  const [joined, setJoined] = useState([PLAYERS_DATA[0]]);
  const [canStart, setCanStart] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setJoined(j => [...j, PLAYERS_DATA[1]]), 1200),
      setTimeout(() => setJoined(j => [...j, PLAYERS_DATA[2]]), 2600),
      setTimeout(() => setJoined(j => [...j, PLAYERS_DATA[3]]), 3800),
      setTimeout(() => setCanStart(true), 4200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <Phone>
      <ScreenTransition type="up">
        <div style={{padding:"16px 24px 8px"}}>
          <div style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--txt-d)",letterSpacing:2,marginBottom:4}}>ROOM CODE</div>
          <div style={{display:"flex",gap:8,marginBottom:24}}>
            {["7","K","2","Q"].map((c,i) => (
              <div key={i} style={{width:52,height:60,background:"var(--s1)",border:"1.5px solid var(--bdr)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fd)",fontSize:32,color:"var(--txt)",letterSpacing:2,animation:`scaleIn 0.3s ease-out ${i*0.08}s both`}}>{c}</div>
            ))}
          </div>
        </div>

        <div style={{padding:"0 24px",flex:1,overflow:"auto",minHeight:0}}>
          <div style={{fontFamily:"var(--fm)",fontSize:10,color:"var(--txt-d)",letterSpacing:2,marginBottom:12}}>PLAYERS ({joined.length}/8)</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {joined.map((p,i) => (
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",background:"var(--s1)",borderRadius:14,border:"1px solid var(--bdr)",animation:`slideRight 0.4s ease-out`}}>
                <Avatar player={p} size={38}/>
                <div style={{flex:1}}>
                  <span style={{fontSize:14,fontWeight:500}}>{p.name}</span>
                  {i===0 && <span style={{marginLeft:8,fontFamily:"var(--fm)",fontSize:10,color:"var(--amb)",letterSpacing:1}}>HOST</span>}
                </div>
                <div style={{width:8,height:8,borderRadius:"50%",background:"var(--grn)",boxShadow:"0 0 8px var(--grn-g)"}}/>
              </div>
            ))}
            {joined.length < 4 && (
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"16px",borderRadius:14,border:"1.5px dashed var(--bdr)"}}>
                <div style={{display:"flex",gap:4,marginRight:8}}>{[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:"var(--txt-d)",animation:`pulse 1.2s ease-in-out ${i*.3}s infinite`}}/>)}</div>
                <span style={{fontSize:13,color:"var(--txt-d)"}}>Waiting for players...</span>
              </div>
            )}
          </div>
        </div>

        <div style={{padding:"12px 24px 28px"}}>
          <Btn primary disabled={!canStart} onClick={onNext}>
            {canStart ? "Select Pack & Start" : "Waiting for players..."}
          </Btn>
        </div>
      </ScreenTransition>
    </Phone>
  );
}

// ── Pack Select ──
function PackSelect({onNext}) {
  const [selected, setSelected] = useState(null);
  return (
    <Phone>
      <ScreenTransition type="up">
        <div style={{padding:"16px 24px 8px"}}>
          <div style={{fontFamily:"var(--fd)",fontSize:28,letterSpacing:2,lineHeight:1}}>CHOOSE YOUR PACK</div>
          <div style={{fontSize:13,color:"var(--txt-m)",marginTop:4}}>What do you want to be wrong about?</div>
        </div>
        <div style={{flex:1,padding:"12px 24px",display:"flex",flexDirection:"column",gap:10,overflow:"auto",minHeight:0}}>
          {PACKS.map((pk,i) => (
            <div key={pk.name} onClick={() => setSelected(pk.name)} style={{
              display:"flex",alignItems:"center",gap:16,padding:"18px 16px",
              background:selected===pk.name?"var(--red)10":"var(--s1)",
              border:`1.5px solid ${selected===pk.name?"var(--red)":"var(--bdr)"}`,
              borderRadius:14,cursor:"pointer",transition:"all 0.2s",
              animation:`fadeUp 0.3s ease-out ${i*0.06}s both`,
            }}>
              <span style={{fontSize:28}}>{pk.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:16,fontWeight:600}}>{pk.name}</div>
                <div style={{fontSize:12,color:"var(--txt-m)",marginTop:2}}>{pk.desc}</div>
              </div>
              {selected===pk.name && <div style={{width:20,height:20,borderRadius:"50%",background:"var(--red)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"white"}}>✓</div>}
            </div>
          ))}
          <div style={{marginTop:8}}>
            <div style={{fontFamily:"var(--fm)",fontSize:10,color:"var(--txt-d)",letterSpacing:2,marginBottom:8}}>MATCH LENGTH</div>
            <div style={{display:"flex",gap:8}}>
              {[{l:"Short",v:"10"},{l:"Standard",v:"15"},{l:"Marathon",v:"20"}].map((m,i) => (
                <div key={m.l} style={{flex:1,padding:"10px",background:m.l==="Standard"?"var(--red)12":"var(--s1)",border:`1.5px solid ${m.l==="Standard"?"var(--red)":"var(--bdr)"}`,borderRadius:10,textAlign:"center",cursor:"pointer"}}>
                  <div style={{fontFamily:"var(--fd)",fontSize:22,color:m.l==="Standard"?"var(--red)":"var(--txt)"}}>{m.v}</div>
                  <div style={{fontFamily:"var(--fm)",fontSize:9,color:"var(--txt-d)",letterSpacing:1}}>{m.l.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{padding:"12px 24px 28px"}}>
          <Btn primary disabled={!selected} onClick={onNext}>Start Game</Btn>
        </div>
      </ScreenTransition>
    </Phone>
  );
}

// ── Countdown ──
function Countdown({onNext}) {
  const [count, setCount] = useState(3);
  useEffect(() => {
    if (count === 0) { setTimeout(onNext, 400); return; }
    const t = setTimeout(() => setCount(c => c - 1), 800);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <Phone>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",position:"relative"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% 50%, var(--red-g) 0%, transparent 50%)",opacity:.6}}/>
        {count > 0 ? (
          <div key={count} style={{animation:"scaleIn 0.4s ease-out",textAlign:"center",position:"relative"}}>
            <div style={{fontFamily:"var(--fd)",fontSize:120,color:"var(--red)",lineHeight:1,textShadow:"0 0 60px var(--red-gs)"}}>{count}</div>
            <div style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--txt-d)",letterSpacing:3,marginTop:8}}>GET READY</div>
          </div>
        ) : (
          <div style={{animation:"scaleIn 0.3s ease-out",textAlign:"center",position:"relative"}}>
            <div style={{fontFamily:"var(--fd)",fontSize:48,color:"var(--txt)",letterSpacing:6}}>GO</div>
          </div>
        )}
      </div>
    </Phone>
  );
}

// ── Read Phase ──
function ReadPhase({round,chips,onNext}) {
  const [revealed, setRevealed] = useState(false);
  const [timer, setTimer] = useState(100);

  useEffect(() => { setTimeout(() => setRevealed(true), 500); }, []);
  useEffect(() => {
    const iv = setInterval(() => setTimer(t => Math.max(0, t - 2)), 200);
    return () => clearInterval(iv);
  }, []);

  return (
    <Phone>
      <ScreenTransition type="fade">
        <Hdr round={round.num} total={15} phase="READ" chips={chips}/>
        <TimerBar pct={timer}/>
        <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 24px"}}>
          <div style={{textAlign:"center",marginBottom:28,animation:"fadeIn 0.3s ease-out"}}><Pill>{round.category}</Pill></div>
          <div style={{opacity:revealed?1:0,transform:revealed?"translateY(0)":"translateY(16px)",transition:"all 0.6s ease-out"}}>
            <FragmentCard
              text={round.fragment}
              verified={!round.poison}
              label={round.poison ? "⚠ Your Fragment" : "Your Fragment"}
              accent={round.poison ? "var(--amb)" : "var(--red)"}
            />
          </div>
          {round.poison && revealed && (
            <div style={{textAlign:"center",marginTop:16,animation:"fadeIn 0.5s ease-out 0.8s both"}}>
              <Pill color="var(--amb)" bg="rgba(245,158,11,0.1)">⚠ YOU HOLD A POISON FRAGMENT</Pill>
            </div>
          )}
          <div style={{marginTop:28,display:"flex",justifyContent:"center",gap:16,animation:"fadeIn 0.6s ease-out 0.4s both"}}>
            {PLAYERS_DATA.slice(1).map((p,i) => (
              <div key={p.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <Avatar player={p} size={34} muted/>
                <span style={{fontSize:10,color:"var(--txt-d)"}}>Reading...</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{padding:"12px 24px 28px"}}>
          <Btn primary onClick={onNext}>Continue to Trade</Btn>
        </div>
      </ScreenTransition>
    </Phone>
  );
}

// ── Trade Phase ──
function TradePhase({round,chips,onAnswer,onSteal,showIncoming=false,stealBy=null}) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [tradeAmt, setTradeAmt] = useState(3);
  const [showOffer, setShowOffer] = useState(false);
  const [incomingVisible, setIncomingVisible] = useState(false);
  const [offerSent, setOfferSent] = useState(false);
  const [activity, setActivity] = useState([]);
  const [timer, setTimer] = useState(100);

  useEffect(() => {
    const iv = setInterval(() => setTimer(t => Math.max(0, t - 0.5)), 300);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setActivity(a => [...a, {text:"Mia is looking around...",time:"0:04"}]), 2000);
    const t2 = setTimeout(() => setActivity(a => [...a, {text:"Kai bought from Zoe",detail:"2 chips",time:"0:08"}]), 4000);
    const t3 = showIncoming ? setTimeout(() => setIncomingVisible(true), 5500) : null;
    return () => { clearTimeout(t1); clearTimeout(t2); if(t3) clearTimeout(t3); };
  }, []);

  const handleSendOffer = () => {
    setOfferSent(true);
    setActivity(a => [...a, {text:`You offered ${selectedPlayer.name}`,detail:`${tradeAmt} chips`,time:"0:12"}]);
    setTimeout(() => {
      setActivity(a => [...a, {text:`${selectedPlayer.name} accepted!`,detail:"Fragment revealed",time:"0:15"}]);
      setSelectedPlayer(null);
      setShowOffer(false);
      setOfferSent(false);
    }, 1500);
  };

  return (
    <Phone>
      <ScreenTransition type="fade">
        <Hdr round={round.num} total={15} phase="TRADE" chips={chips}/>
        <TimerBar pct={timer} color={timer<30?"var(--amb)":"var(--red)"}/>

        <div style={{flex:1,padding:"12px 24px",display:"flex",flexDirection:"column",gap:12,overflow:"auto",minHeight:0,position:"relative"}}>
          {/* Player grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
            {PLAYERS_DATA.slice(1).map((p,i) => (
              <div key={p.id} onClick={() => {setSelectedPlayer(p);setShowOffer(true);}} style={{
                background:selectedPlayer?.id===p.id?`${p.color}12`:"var(--s1)",
                border:`1.5px solid ${selectedPlayer?.id===p.id?p.color:"var(--bdr)"}`,
                borderRadius:14,padding:"14px 10px",display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer",transition:"all 0.2s",animation:`fadeUp 0.3s ease-out ${i*0.06}s both`,
              }}>
                <Avatar player={p} size={40} glow={selectedPlayer?.id===p.id}/>
                <span style={{fontSize:12,fontWeight:500}}>{p.name}</span>
                <ChipBadge chips={p.chips} size="sm"/>
              </div>
            ))}
          </div>

          {/* Trade panel */}
          {showOffer && selectedPlayer && !incomingVisible && (
            <div style={{background:"var(--s1)",border:"1px solid var(--bdr)",borderRadius:14,padding:18,animation:"fadeUp 0.3s ease-out"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <Avatar player={selectedPlayer} size={30}/>
                  <span style={{fontSize:14,fontWeight:500}}>Buy from {selectedPlayer.name}</span>
                </div>
                <div onClick={() => setShowOffer(false)} style={{color:"var(--txt-d)",cursor:"pointer",fontSize:16,padding:4}}>✕</div>
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:20,margin:"8px 0 16px"}}>
                <div onClick={() => setTradeAmt(Math.max(1,tradeAmt-1))} style={{width:34,height:34,borderRadius:"50%",background:"var(--s2)",border:"1px solid var(--bdr)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,color:"var(--txt-m)"}}>−</div>
                <div style={{fontFamily:"var(--fd)",fontSize:46,color:"var(--red)",lineHeight:1,minWidth:50,textAlign:"center",textShadow:"0 0 20px var(--red-g)"}}>{tradeAmt}</div>
                <div onClick={() => setTradeAmt(Math.min(10,tradeAmt+1))} style={{width:34,height:34,borderRadius:"50%",background:"var(--s2)",border:"1px solid var(--bdr)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,color:"var(--txt-m)"}}>+</div>
              </div>
              <Btn primary onClick={handleSendOffer} disabled={offerSent}>{offerSent ? "Offer sent..." : "Send Offer"}</Btn>
            </div>
          )}

          {/* Activity */}
          <div>
            <div style={{fontFamily:"var(--fm)",fontSize:10,color:"var(--txt-d)",letterSpacing:2,marginBottom:6}}>ACTIVITY</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {activity.map((a,i) => <ActivityItem key={i} text={a.text} detail={a.detail} time={a.time} i={i}/>)}
              {activity.length === 0 && <div style={{fontSize:12,color:"var(--txt-d)",padding:12,textAlign:"center"}}>No trades yet...</div>}
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div style={{padding:"8px 24px 28px",display:"flex",gap:10}}>
          <Btn onClick={onAnswer} style={{flex:1}}>Answer</Btn>
          {stealBy ? (
            <Btn danger onClick={onSteal} style={{flex:2,animation:"borderGlow 2s ease-in-out infinite",background:"transparent",border:"2px solid var(--red)",color:"var(--red)"}}>⚡ STEAL</Btn>
          ) : (
            <Btn danger onClick={onSteal} style={{flex:2,animation:"borderGlow 2s ease-in-out infinite",background:"transparent",border:"2px solid var(--red)",color:"var(--red)"}}>⚡ STEAL</Btn>
          )}
        </div>

        {/* Incoming trade modal */}
        {incomingVisible && (
          <IncomingTradeModal
            from={PLAYERS_DATA[1]}
            amount={3}
            onAccept={() => {
              setIncomingVisible(false);
              setActivity(a => [...a, {text:"You sold to Mia",detail:"+3 chips",time:"0:18"}]);
            }}
            onReject={() => setIncomingVisible(false)}
          />
        )}
      </ScreenTransition>
    </Phone>
  );
}

// ── Answer Phase ──
function AnswerPhase({round,chips,correctAnswer,onSubmit}) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [timer, setTimer] = useState(100);

  useEffect(() => {
    const iv = setInterval(() => setTimer(t => Math.max(0, t - 1.5)), 200);
    return () => clearInterval(iv);
  }, []);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => onSubmit(answer.trim().toLowerCase() === correctAnswer.toLowerCase()), 1200);
  };

  return (
    <Phone>
      <ScreenTransition type="fade">
        <Hdr round={round.num} total={15} phase="ANSWER" chips={chips}/>
        <TimerBar pct={timer} color={timer<30?"var(--amb)":"var(--red)"}/>

        <div style={{flex:1,padding:"20px 24px",display:"flex",flexDirection:"column"}}>
          <div style={{textAlign:"center",marginBottom:24,animation:"fadeIn 0.3s"}}>
            <div style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--txt-d)",letterSpacing:2,marginBottom:6}}>TRADE WINDOW CLOSED</div>
            <div style={{fontSize:14,color:"var(--txt-m)",fontWeight:300}}>Submit your answer or pass</div>
          </div>

          <div style={{background:"var(--s1)",borderRadius:14,border:"1px solid var(--bdr)",padding:16,marginBottom:16,animation:"fadeUp 0.3s ease-out 0.1s both"}}>
            <div style={{fontFamily:"var(--fm)",fontSize:10,color:"var(--txt-d)",letterSpacing:2,marginBottom:10}}>FRAGMENTS COLLECTED</div>
            {[round.fragment, round.otherFragments[1]].map((f,i) => (
              <div key={i} style={{padding:"7px 12px",background:"var(--s2)",borderRadius:8,fontSize:13,color:"var(--txt-m)",fontWeight:300,borderLeft:`2px solid ${i===0?"var(--red)":"#0EA5E9"}`,marginBottom:6}}>"{f}"</div>
            ))}
            <div style={{padding:"7px 12px",background:"var(--s2)",borderRadius:8,fontSize:13,color:"var(--txt-d)",fontWeight:300,borderLeft:"2px solid var(--bdr)",fontStyle:"italic"}}>2 fragments unknown</div>
          </div>

          <div style={{animation:"fadeUp 0.3s ease-out 0.2s both"}}>
            <div style={{background:"var(--s1)",borderRadius:14,border:`1.5px solid ${submitted?"var(--grn)":"var(--bdr)"}`,padding:"4px",transition:"border-color 0.3s"}}>
              <input
                type="text" value={answer} onChange={e=>setAnswer(e.target.value)}
                placeholder="Type your answer..."
                style={{width:"100%",background:"transparent",border:"none",padding:"14px 16px",fontSize:18,fontWeight:500,color:"var(--txt)",outline:"none",letterSpacing:.5}}
              />
            </div>
          </div>

          <div style={{flex:1}}/>

          <div style={{display:"flex",gap:12,animation:"fadeUp 0.4s ease-out 0.3s both"}}>
            <Btn onClick={() => onSubmit(null)} style={{flex:1}}>Pass</Btn>
            <Btn primary disabled={!answer.trim()||submitted} onClick={handleSubmit} style={{flex:2,background:submitted?"var(--grn)":"var(--red)",boxShadow:submitted?"0 4px 20px var(--grn-g)":"0 4px 20px var(--red-g)"}}>
              {submitted ? "✓ Locked In" : "Submit Answer"}
            </Btn>
          </div>
        </div>
        <div style={{height:16}}/>
      </ScreenTransition>
    </Phone>
  );
}

// ── Round Result ──
function RoundResult({round,correct,chips,chipDelta,onNext}) {
  return (
    <Phone flash={correct ? "rgba(34,197,94,0.3)" : correct===false ? "rgba(220,38,38,0.3)" : null}>
      <ScreenTransition type="scale">
        <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:24,position:"relative"}}>
          <div style={{position:"absolute",inset:0,background:`radial-gradient(circle at 50% 40%, ${correct?"var(--grn-g)":"var(--red-g)"} 0%, transparent 60%)`,opacity:.5}}/>

          <div style={{position:"relative",zIndex:1,textAlign:"center",width:"100%"}}>
            {correct === null ? (
              <>
                <div style={{fontFamily:"var(--fd)",fontSize:36,letterSpacing:4,color:"var(--txt-m)",marginBottom:8}}>PASSED</div>
                <div style={{fontSize:14,color:"var(--txt-d)"}}>No risk, no reward</div>
              </>
            ) : (
              <>
                <div style={{
                  width:72,height:72,borderRadius:"50%",margin:"0 auto 16px",
                  background:correct?"rgba(34,197,94,0.1)":"rgba(220,38,38,0.1)",
                  border:`2px solid ${correct?"var(--grn)":"var(--red)"}`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,
                  boxShadow:`0 0 30px ${correct?"var(--grn-g)":"var(--red-g)"}`,
                  animation:"scaleIn 0.4s ease-out",
                }}>{correct ? "✓" : "✗"}</div>
                <div style={{fontFamily:"var(--fd)",fontSize:36,letterSpacing:4,color:correct?"var(--grn)":"var(--red)",marginBottom:4}}>
                  {correct ? "CORRECT" : "WRONG"}
                </div>
                <div style={{fontSize:14,color:"var(--txt-m)",marginBottom:4}}>The answer was</div>
                <div style={{fontFamily:"var(--fd)",fontSize:42,letterSpacing:3,marginBottom:8}}>{round.answer.toUpperCase()}</div>
                <div style={{fontFamily:"var(--fm)",fontSize:18,fontWeight:600,color:chipDelta>0?"var(--grn)":"var(--red)",animation:"scaleIn 0.3s ease-out 0.3s both"}}>
                  {chipDelta>0?"+":""}{chipDelta} chips
                </div>
              </>
            )}

            {/* Other players results */}
            <div style={{marginTop:28,display:"flex",flexDirection:"column",gap:6,width:"100%"}}>
              {PLAYERS_DATA.slice(1).map((p,i) => {
                const pCorrect = i < 2;
                return (
                  <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:"var(--s1)",borderRadius:10,border:"1px solid var(--bdr)",animation:`fadeUp 0.3s ease-out ${0.4+i*0.08}s both`}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <Avatar player={p} size={28}/>
                      <span style={{fontSize:13,fontWeight:500}}>{p.name}</span>
                    </div>
                    <span style={{fontFamily:"var(--fm)",fontSize:13,fontWeight:600,color:pCorrect?"var(--grn)":"var(--red)"}}>{pCorrect?"+5":"−2"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div style={{padding:"12px 24px 28px"}}><Btn primary onClick={onNext}>Next Round</Btn></div>
      </ScreenTransition>
    </Phone>
  );
}

// ── Steal Sequence ──
function StealSequence({round,stealer,onNext}) {
  const [phase, setPhase] = useState("flash");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("countdown"), 900);
    const t2 = setTimeout(() => setPhase("typing"), 2800);
    const t3 = setTimeout(() => setPhase("result"), 4500);
    return () => { clearTimeout(t1);clearTimeout(t2);clearTimeout(t3); };
  }, []);

  return (
    <Phone flash={phase==="flash"?"var(--red)":null}>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:24,position:"relative"}}>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(circle at 50% 40%, var(--red-gs) 0%, transparent 60%)`,opacity:phase==="flash"||phase==="countdown"?.7:.3,transition:"opacity 0.5s"}}/>

        {phase==="flash" && (
          <div style={{animation:"scaleIn 0.4s ease-out",textAlign:"center",position:"relative",zIndex:1}}>
            <div style={{fontFamily:"var(--fd)",fontSize:56,color:"var(--red)",letterSpacing:8,textShadow:"0 0 40px var(--red-gs)"}}>⚡ STEAL</div>
            <div style={{fontFamily:"var(--fm)",fontSize:12,color:"var(--txt-m)",marginTop:8,letterSpacing:2}}>{stealer.name.toUpperCase()} IS ATTEMPTING A STEAL</div>
          </div>
        )}

        {phase==="countdown" && (
          <div style={{textAlign:"center",animation:"scaleIn 0.3s ease-out",position:"relative",zIndex:1}}>
            <div style={{width:100,height:100,borderRadius:"50%",border:"3px solid var(--red)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",animation:"pulseRed 1s ease-in-out infinite"}}>
              <span style={{fontFamily:"var(--fd)",fontSize:52,color:"var(--red)",animation:"countPulse 1s ease-in-out infinite"}}>12</span>
            </div>
            <div style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--txt-d)",letterSpacing:2}}>SECONDS REMAINING</div>
            <div style={{marginTop:24,display:"flex",gap:12,justifyContent:"center"}}>
              {PLAYERS_DATA.filter(p=>p.id!==stealer.id).map(p=>(
                <div key={p.id} style={{width:36,height:36,borderRadius:"50%",background:"var(--s1)",border:"1.5px solid var(--bdr)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fd)",fontSize:14,color:"var(--txt-d)",animation:"stealFlash 0.8s ease-in-out infinite"}}>{p.av}</div>
              ))}
            </div>
            <div style={{fontFamily:"var(--fm)",fontSize:10,color:"var(--txt-d)",marginTop:8}}>ALL TRADES FROZEN</div>
          </div>
        )}

        {phase==="typing" && (
          <div style={{textAlign:"center",animation:"fadeIn 0.3s ease-out",width:"100%",position:"relative",zIndex:1}}>
            <Avatar player={stealer} size={64} glow/>
            <div style={{fontSize:14,color:"var(--txt-m)",marginTop:12,marginBottom:24}}>{stealer.name} is typing...</div>
            <div style={{background:"var(--s1)",border:"1.5px solid var(--bdr)",borderRadius:12,padding:"16px 20px",margin:"0 20px",display:"flex",alignItems:"center",gap:8}}>
              <div style={{display:"flex",gap:4}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:"var(--txt-d)",animation:`pulse 1.2s ease-in-out ${i*.3}s infinite`}}/>)}</div>
              <span style={{fontFamily:"var(--fm)",fontSize:12,color:"var(--txt-d)"}}>answer locked</span>
            </div>
          </div>
        )}

        {phase==="result" && (
          <div style={{textAlign:"center",animation:"scaleIn 0.4s ease-out",width:"100%",position:"relative",zIndex:1}}>
            <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(34,197,94,0.1)",border:"2px solid var(--grn)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",boxShadow:"0 0 40px var(--grn-g)"}}>
              <span style={{fontSize:32}}>✓</span>
            </div>
            <div style={{fontFamily:"var(--fd)",fontSize:32,letterSpacing:4,color:"var(--grn)",marginBottom:4}}>CORRECT</div>
            <div style={{fontSize:14,color:"var(--txt-m)",marginBottom:4}}>The answer was</div>
            <div style={{fontFamily:"var(--fd)",fontSize:40,letterSpacing:3,marginBottom:24}}>{round.answer.toUpperCase()}</div>
            <div style={{display:"flex",flexDirection:"column",gap:6,width:"100%"}}>
              {PLAYERS_DATA.map((p,i) => (
                <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:"var(--s1)",borderRadius:10,border:`1px solid ${p.id===stealer.id?"var(--grn)":"var(--bdr)"}`,animation:`fadeUp 0.3s ease-out ${i*0.08}s both`}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <Avatar player={p} size={28}/>
                    <span style={{fontSize:13,fontWeight:500}}>{p.name}</span>
                  </div>
                  <span style={{fontFamily:"var(--fm)",fontSize:14,fontWeight:600,color:p.id===stealer.id?"var(--grn)":"var(--red)"}}>{p.id===stealer.id?"+8":"−1"}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {phase==="result" && <div style={{padding:"12px 24px 28px"}}><Btn primary onClick={onNext}>Next Round</Btn></div>}
    </Phone>
  );
}

// ── Poison Reveal ──
function PoisonReveal({round,chips,onNext}) {
  const [phase, setPhase] = useState("result");
  useEffect(() => { setTimeout(() => setPhase("poison"), 2000); }, []);

  if (phase === "result") {
    return (
      <Phone>
        <ScreenTransition type="scale">
          <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:24}}>
            <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(220,38,38,0.1)",border:"2px solid var(--red)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",animation:"shakeX 0.5s ease-out"}}>
              <span style={{fontSize:32}}>✗</span>
            </div>
            <div style={{fontFamily:"var(--fd)",fontSize:36,letterSpacing:4,color:"var(--red)",marginBottom:4}}>WRONG</div>
            <div style={{fontSize:14,color:"var(--txt-m)",marginBottom:4}}>The answer was</div>
            <div style={{fontFamily:"var(--fd)",fontSize:42,letterSpacing:3}}>{round.answer.toUpperCase()}</div>
            <div style={{fontFamily:"var(--fm)",fontSize:18,fontWeight:600,color:"var(--red)",marginTop:8}}>−2 chips</div>
            <div style={{marginTop:16,fontFamily:"var(--fm)",fontSize:11,color:"var(--txt-d)",letterSpacing:2,animation:"pulse 1s ease-in-out infinite"}}>INVESTIGATING FRAGMENTS...</div>
          </div>
        </ScreenTransition>
      </Phone>
    );
  }

  return (
    <Phone flash="rgba(245,158,11,0.2)">
      <ScreenTransition type="scale">
        <Hdr round={round.num} total={15} phase="REVEAL" chips={chips}/>
        <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"0 24px"}}>
          <div style={{textAlign:"center"}}>
            <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(245,158,11,0.08)",border:"2px solid var(--amb)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",animation:"pulseRed 1.5s ease-in-out infinite",boxShadow:"0 0 30px var(--amb-g)"}}>
              <span style={{fontSize:32}}>☠</span>
            </div>
            <div style={{fontFamily:"var(--fd)",fontSize:32,letterSpacing:4,color:"var(--amb)",marginBottom:8}}>POISON FRAGMENT</div>
            <div style={{fontSize:14,color:"var(--txt-m)",marginBottom:20,fontWeight:300}}>Kai's fragment was a decoy planted by the app</div>

            <div style={{background:"var(--s1)",border:"1.5px solid rgba(245,158,11,0.3)",borderRadius:14,padding:20,textAlign:"left",marginBottom:16}}>
              <div style={{fontFamily:"var(--fm)",fontSize:10,color:"var(--amb)",letterSpacing:2,marginBottom:10}}>DECOY FRAGMENT</div>
              <div style={{fontSize:16,color:"var(--txt-m)",fontWeight:300,fontStyle:"italic",lineHeight:1.5}}>"{round.poisonFragment}"</div>
            </div>

            <div style={{background:"var(--s1)",borderRadius:14,padding:14,display:"flex",justifyContent:"space-between",alignItems:"center",border:"1px solid var(--bdr)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <Avatar player={PLAYERS_DATA[2]} size={30}/>
                <span style={{fontSize:13,fontWeight:500}}>Kai sold it to Zoe</span>
              </div>
              <span style={{fontFamily:"var(--fm)",fontSize:13,color:"var(--amb)"}}>3 chips</span>
            </div>
          </div>
        </div>
        <div style={{padding:"12px 24px 28px"}}><Btn primary onClick={onNext}>Continue</Btn></div>
      </ScreenTransition>
    </Phone>
  );
}

// ── Leaderboard ──
function Leaderboard({onRestart}) {
  const lb = [
    {name:"Kai",av:"K",color:"#0EA5E9",chips:28,correct:8,steals:2,bluff:87},
    {name:"You",av:"Y",color:"#DC2626",chips:22,correct:7,steals:1,bluff:45},
    {name:"Zoe",av:"Z",color:"#F59E0B",chips:16,correct:5,steals:0,bluff:92},
    {name:"Mia",av:"M",color:"#8B5CF6",chips:12,correct:4,steals:1,bluff:23},
  ];

  return (
    <Phone>
      <ScreenTransition type="scale">
        <div style={{padding:"12px 24px 8px",textAlign:"center"}}>
          <div style={{fontFamily:"var(--fd)",fontSize:36,letterSpacing:4,lineHeight:1}}>GAME OVER</div>
          <div style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--txt-d)",letterSpacing:2,marginTop:4}}>15 ROUNDS COMPLETED</div>
        </div>

        <div style={{flex:1,padding:"12px 20px",overflow:"auto",minHeight:0}}>
          {lb.map((p,i) => (
            <div key={p.name} style={{
              background:i===0?`${p.color}08`:"var(--s1)",
              border:`1.5px solid ${i===0?p.color:"var(--bdr)"}`,
              borderRadius:16,padding:16,marginBottom:10,position:"relative",overflow:"hidden",
              animation:`fadeUp 0.4s ease-out ${i*0.1}s both`,
            }}>
              {i===0 && <div style={{position:"absolute",top:0,right:0,background:p.color,color:"white",fontFamily:"var(--fd)",fontSize:12,letterSpacing:2,padding:"4px 12px",borderRadius:"0 0 0 8px"}}>WINNER</div>}
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
                <div style={{fontFamily:"var(--fd)",fontSize:32,color:"var(--txt-d)",width:28,textAlign:"center",lineHeight:1}}>{i+1}</div>
                <div style={{width:44,height:44,borderRadius:"50%",background:`${p.color}20`,border:`2px solid ${p.color}60`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--fd)",fontSize:20,color:p.color}}>{p.av}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:16,fontWeight:600}}>{p.name}</div>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:"var(--red)"}}/>
                    <span style={{fontFamily:"var(--fm)",fontSize:14,fontWeight:600}}>{p.chips} chips</span>
                  </div>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {[{l:"Correct",v:p.correct},{l:"Steals",v:p.steals},{l:"Bluff",v:`${p.bluff}%`}].map(s=>(
                  <div key={s.l} style={{background:"var(--s2)",borderRadius:8,padding:8,textAlign:"center"}}>
                    <div style={{fontFamily:"var(--fm)",fontSize:15,fontWeight:600}}>{s.v}</div>
                    <div style={{fontFamily:"var(--fm)",fontSize:9,color:"var(--txt-d)",letterSpacing:1,marginTop:2}}>{s.l.toUpperCase()}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{padding:"8px 20px 28px",display:"flex",gap:10}}>
          <Btn style={{flex:1}}>Share</Btn>
          <Btn primary onClick={onRestart} style={{flex:2}}>Play Again</Btn>
        </div>
      </ScreenTransition>
    </Phone>
  );
}

/* ═══════════════════════════════════════════
   GAME FLOW CONTROLLER
   ═══════════════════════════════════════════ */

const FLOW = [
  "splash","lobby","pack","countdown",
  "r1_read","r1_trade","r1_answer","r1_result",
  "r2_read","r2_trade","r2_steal",
  "r3_read","r3_trade","r3_answer","r3_poison",
  "leaderboard",
];

export default function BlindspotFull() {
  const [step, setStep] = useState(0);
  const [chips, setChips] = useState(10);
  const screen = FLOW[step];

  const next = () => setStep(s => Math.min(s + 1, FLOW.length - 1));
  const restart = () => { setStep(0); setChips(10); };
  const jumpTo = (name) => { const idx = FLOW.indexOf(name); if (idx >= 0) setStep(idx); };

  const renderScreen = () => {
    switch(screen) {
      case "splash": return <Splash onNext={next}/>;
      case "lobby": return <Lobby onNext={next}/>;
      case "pack": return <PackSelect onNext={next}/>;
      case "countdown": return <Countdown onNext={next}/>;

      case "r1_read": return <ReadPhase round={ROUNDS_DATA[0]} chips={chips} onNext={next}/>;
      case "r1_trade": return <TradePhase round={ROUNDS_DATA[0]} chips={chips} showIncoming={true} onAnswer={next} onSteal={() => jumpTo("r1_answer")}/>;
      case "r1_answer": return <AnswerPhase round={ROUNDS_DATA[0]} chips={chips} correctAnswer="Pluto" onSubmit={(correct) => { if(correct) setChips(c=>c+5); else if(correct===false) setChips(c=>c-2); next(); }}/>;
      case "r1_result": return <RoundResult round={ROUNDS_DATA[0]} correct={true} chips={chips} chipDelta={5} onNext={next}/>;

      case "r2_read": return <ReadPhase round={ROUNDS_DATA[1]} chips={chips} onNext={next}/>;
      case "r2_trade": return <TradePhase round={ROUNDS_DATA[1]} chips={chips} stealBy={PLAYERS_DATA[2]} onAnswer={next} onSteal={next}/>;
      case "r2_steal": return <StealSequence round={ROUNDS_DATA[1]} stealer={PLAYERS_DATA[2]} onNext={() => { setChips(c=>c-1); next(); }}/>;

      case "r3_read": return <ReadPhase round={ROUNDS_DATA[2]} chips={chips} onNext={next}/>;
      case "r3_trade": return <TradePhase round={ROUNDS_DATA[2]} chips={chips} onAnswer={next} onSteal={() => jumpTo("r3_answer")}/>;
      case "r3_answer": return <AnswerPhase round={ROUNDS_DATA[2]} chips={chips} correctAnswer="Taylor Swift" onSubmit={(correct) => { if(correct===false) setChips(c=>c-2); next(); }}/>;
      case "r3_poison": return <PoisonReveal round={ROUNDS_DATA[2]} chips={chips} onNext={next}/>;

      case "leaderboard": return <Leaderboard onRestart={restart}/>;
      default: return <Splash onNext={next}/>;
    }
  };

  // Progress dots
  const sections = [
    {label:"Setup", steps:["splash","lobby","pack","countdown"]},
    {label:"Round 1", steps:["r1_read","r1_trade","r1_answer","r1_result"]},
    {label:"Round 2 — Steal", steps:["r2_read","r2_trade","r2_steal"]},
    {label:"Round 3 — Poison", steps:["r3_read","r3_trade","r3_answer","r3_poison"]},
    {label:"Results", steps:["leaderboard"]},
  ];

  const currentSection = sections.findIndex(s => s.steps.includes(screen));

  return (
    <div style={{minHeight:"100vh",background:"#050506",fontFamily:"var(--fb)",display:"flex",flexDirection:"column",alignItems:"center",paddingTop:16,paddingBottom:16}}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
        <span style={{fontFamily:"var(--fd)",fontSize:22,letterSpacing:6,color:"#DC2626",textShadow:"0 0 20px rgba(220,38,38,0.3)"}}>BLINDSPOT</span>
        <span style={{fontFamily:"var(--fm)",fontSize:9,color:"#44444F",letterSpacing:2,border:"1px solid #2A2A32",padding:"2px 8px",borderRadius:4}}>FULL PROTOTYPE</span>
      </div>

      {/* Section nav */}
      <div style={{display:"flex",gap:3,marginBottom:6,flexWrap:"wrap",justifyContent:"center",maxWidth:400,padding:"0 12px"}}>
        {sections.map((s,i) => (
          <div key={s.label} onClick={() => jumpTo(s.steps[0])} style={{
            padding:"4px 10px",borderRadius:6,cursor:"pointer",
            background:i===currentSection?"var(--red)":"#111114",
            border:`1px solid ${i===currentSection?"var(--red)":"#2A2A32"}`,
            fontSize:10,fontFamily:"'Outfit',sans-serif",color:i===currentSection?"white":"#6B6B76",
            fontWeight:i===currentSection?600:400,letterSpacing:.3,transition:"all 0.2s",
          }}>{s.label}</div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{display:"flex",gap:2,marginBottom:16,maxWidth:390,width:"100%",padding:"0 12px"}}>
        {FLOW.map((_,i) => (
          <div key={i} style={{flex:1,height:2,borderRadius:1,background:i<=step?"var(--red)":"#2A2A32",transition:"background 0.3s"}}/>
        ))}
      </div>

      {/* Screen */}
      <div key={screen} style={{width:390,height:760,flexShrink:0}}>{renderScreen()}</div>

      <div style={{marginTop:12,fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#44444F",letterSpacing:1,textAlign:"center",padding:"0 20px"}}>
        NAVIGATE VIA SECTION TABS OR IN-APP BUTTONS • {step+1}/{FLOW.length}
      </div>
    </div>
  );
}
