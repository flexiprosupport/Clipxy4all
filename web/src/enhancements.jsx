import { React, CanvasContext, captionSample } from './dashboard.js';
import { createCaptionRenderer, overridesFromConfig, palettes } from '../../caption_renderer/adapter.mjs';
import { templates } from '../../caption_renderer/engine.mjs';
import './enhancements.css';

async function request(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Request failed');
  return data;
}

export function EnhancementShell({ children }) {
  const [color, setColor] = React.useState('black');
  return <CanvasContext.Provider value={{color,setColor}}>{children}
    <a className="clipxy-support" href="https://t.me/BMG009" target="_blank" rel="noopener noreferrer" aria-label="Telegram support @BMG009">↗ Telegram support <b>@BMG009</b></a>
  </CanvasContext.Provider>;
}

export function CanvasControl({value,onChange}) {
  const shared = React.useContext(CanvasContext);
  const color = value ?? shared.color;
  const set = onChange ?? shared.setColor;
  return <fieldset className="clipxy-canvas-control"><legend>Video background</legend>
    <div role="group" aria-label="Video background color" className="toggle">
      {['black','white'].map(c=><button type="button" key={c} aria-pressed={color===c} className={color===c?'active':''} onClick={()=>set(c)}><span className="canvas-swatch" style={{background:c}}/>{c==='black'?'Black':'White'}</button>)}
    </div><p className="note">Colors empty canvas and rounded corners. Full-frame cropped video has no padding.</p>
  </fieldset>;
}

export function CaptionPosition({studio}) {
  const cfg=studio.cfg;
  return <div className="cz-field"><label className="cz-label">Position anywhere in the video</label><div className="cz-row2">
    {['x','y'].map(axis=><label key={axis}>{axis==='x'?'Horizontal':'Vertical'} (%)<input aria-label={'Caption '+(axis==='x'?'horizontal':'vertical')+' position'} type="number" min="0" max="100" step="0.1" value={cfg['pos_'+axis] ?? (axis==='x'?50:88)} onChange={e=>studio.setOverride({pos_x:cfg.pos_x??50,pos_y:cfg.pos_y??88,['pos_'+axis]:Math.max(0,Math.min(100,Number(e.target.value)))})}/></label>)}
  </div><p className="note">Drag the preview or enter 0–100%. The caption center can reach every edge; text beyond the frame is clipped.</p></div>;
}

export function NativeControls({studio}) {
  if(studio.cfg.engine!=='canvas') return null;
  const cfg=studio.cfg, template=templates.find(t=>'studio:'+t.id===cfg.id);
  const motions=template?.compositionId?['none','pop','fade-in']:[...new Set(templates.map(t=>t.motion))];
  return <div className="cz-field"><label className="cz-label">Caption palette and movement</label><div className="cz-row2">
    <select aria-label="Caption palette" value={cfg.native_palette||'original'} onChange={e=>studio.setOverride('native_palette',e.target.value)}><option value="original">Original palette</option>{palettes.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
    <select aria-label="Caption movement" value={cfg.native_motion??template?.motion??'none'} onChange={e=>studio.setOverride('native_motion',e.target.value)}>{motions.map(m=><option key={m} value={m}>{m.replaceAll('-',' ').replaceAll('_',' ')}</option>)}</select>
  </div></div>;
}

export function NativePreview({cfg,language='en',thumbnail=false,aspect='9:16'}) {
  const ref=React.useRef(null), [error,setError]=React.useState('');
  const key=JSON.stringify(cfg);
  React.useEffect(()=>{
    let disposed=false, frame;
    const canvas=ref.current;
    const sample=captionSample(language);
    const words=sample.words.map((word,i)=>({word,start:i*.65,end:(i+1)*.65}));
    const duration=words.length*.65+.3;
    const overrides=overridesFromConfig(cfg.id,cfg);
    // The tile strip is only ~62 CSS px tall, and the engine derives glyph size
    // from canvas height, so a relative font_scale renders unreadably small here.
    // An absolute font_size gives every tile the same legible, comparable sample.
    if(thumbnail) Object.assign(overrides,{pos_x:50,pos_y:50,font_size:400});
    setError('');
    (async()=>{
      const renderer=await createCaptionRenderer(canvas,{style:cfg.id,overrides,words,language,duration,fps:15});
      if(disposed) return;
      const start=performance.now();
      async function tick(now) {
        if(disposed) return;
        try { await renderer.draw(thumbnail?.8:((now-start)/1000)%duration); }
        catch {setError('Caption preview unavailable.'); return;}
        if(!disposed&&!thumbnail) frame=requestAnimationFrame(tick);
      }
      await tick(start);
    })().catch(()=>{if(!disposed)setError('Caption preview unavailable.');});
    return ()=>{disposed=true;cancelAnimationFrame(frame)};
  },[key,language,thumbnail,aspect]);
  // The style picker's tile is a short, wide strip (~2.7:1). A 4:3 thumbnail
  // canvas overflowed it and the sample text was cut in half by the tile label,
  // so thumbnails render at the tile's own shape and can never exceed its box.
  const width=thumbnail?384:aspect==='16:9'?1920:1080;
  const height=thumbnail?144:aspect==='16:9'?1080:aspect==='4:5'?1350:1920;
  const style=thumbnail
    ?{width:'100%',maxHeight:'100%',display:'block',margin:'0 auto',pointerEvents:'none'}
    :{width:'100%',height:'100%',display:'block',pointerEvents:'none'};
  return <><canvas ref={ref} width={width} height={height} aria-label={'Caption preview '+cfg.label} style={style}/>{error&&<span role="status">{error}</span>}</>;
}

export function NativeLayer({cfg,language,aspect,region,setOverride}) {
  const drag=React.useRef(null);
  const move=e=>{
    if(!drag.current||!setOverride)return;
    const r=e.currentTarget.getBoundingClientRect();
    setOverride({pos_x:Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100)),pos_y:Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100))});
  };
  return <div className="clipxy-native-layer" style={{top:region.top+'%',height:region.height+'%',left:region.left+'%',width:region.width+'%',cursor:setOverride?'move':'default'}} onPointerDown={e=>{if(!setOverride)return;drag.current=e.pointerId;e.currentTarget.setPointerCapture(e.pointerId);move(e)}} onPointerMove={move} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null} title="Drag or click to position the caption">
    <NativePreview cfg={cfg} language={language} aspect={aspect}/>
  </div>;
}

const labels={queued:'Queued',running:'Processing',done:'Completed',error:'Failed',cancelled:'Cancelled',interrupted:'Interrupted'};
export function ProcessingPanel({onCreate,onLibrary}) {
  const [open,setOpen]=React.useState(()=>localStorage.getItem('clipxy4all-processing-open')==='true');
  const [jobs,setJobs]=React.useState([]),[limit,setLimit]=React.useState(2),[error,setError]=React.useState('');
  React.useEffect(()=>{localStorage.setItem('clipxy4all-processing-open',String(open));},[open]);
  React.useEffect(()=>{
    let active=true,timer;
    async function refresh(){try{const d=await request('/api/jobs');if(active){setJobs(d.jobs);setLimit(d.max_concurrent);setError('')}}catch(e){if(active)setError('Reconnecting to processing history…')}finally{if(active)timer=setTimeout(refresh,1000)}}
    function submitted(){setOpen(true)}
    window.addEventListener('clipxy-job-submitted',submitted);refresh();
    return()=>{active=false;clearTimeout(timer);window.removeEventListener('clipxy-job-submitted',submitted)};
  },[]);
  async function cancel(id){try{await request('/api/cancel/'+id,{method:'POST'});setJobs(j=>j.map(x=>x.id===id?{...x,status:'cancelled',message:'Cancellation requested.'}:x))}catch(e){setError(e.message)}}
  const running=jobs.filter(j=>j.status==='running').length,queued=jobs.filter(j=>j.status==='queued').length;
  return <>
    <button className="btn clipxy-processing-toggle" aria-expanded={open} aria-controls="clipxy-processing" onClick={()=>setOpen(v=>!v)}>Processing · {running} active · {queued} queued</button>
    {open&&<aside id="clipxy-processing" className="clipxy-processing card" aria-label="Processing tasks"><div className="card-h"><h2>Processing</h2><button className="btn btn-ghost" aria-label="Collapse processing sidebar" onClick={()=>setOpen(false)}>−</button></div>
      <div className="clipxy-queue-toolbar"><span className="note">{running} of {limit} slots in use</span><button className="btn btn-primary" onClick={onCreate}>+ New video</button></div>
      {error&&<p role="status" className="note">{error}</p>}
      <div className="clipxy-job-list">{jobs.length===0&&<p className="note">Your video tasks will appear here.</p>}{jobs.map(job=><article className="clipxy-job" key={job.id} data-job-id={job.id}>
        <strong title={job.name}>{job.name}</strong><div className="clipxy-job-status"><span>{labels[job.status]||job.status}</span>{job.status==='running'&&Number.isFinite(job.progress)&&<span>{Math.round(job.progress*100)}%</span>}</div>
        {job.status==='running'&&<progress max="1" value={job.progress??0} aria-label={'Progress for '+job.name}/>}
        <p className="note">{job.message}</p><div className="clipxy-job-actions">{['running','queued'].includes(job.status)&&<button className="btn btn-ghost" onClick={()=>cancel(job.id)} aria-label={'Cancel '+job.name}>Cancel</button>}{job.clips?.length>0&&<button className="btn btn-ghost" onClick={onLibrary}>Open Library · {job.clips.length}</button>}</div>
      </article>)}</div><p className="note clipxy-queue-footer">You can collapse this panel or navigate while work continues. Keep the app server running.</p>
    </aside>}
  </>;
}

export function ReframeBackground({clipId,index,source,time,position,color,setColor}) {
  const [recipe,setRecipe]=React.useState(null),ref=React.useRef(null);
  React.useEffect(()=>{let alive=true;request(`/api/clip/${clipId}/${index}/reframe`).then(r=>{if(alive){setRecipe(r);setColor(r.video_background||'black')}}).catch(()=>{});return()=>{alive=false}},[clipId,index]);
  React.useEffect(()=>{if(ref.current&&recipe)ref.current.currentTime=recipe.start+time},[time,recipe]);
  if(!recipe) return null;
  const square=recipe.fit_mode==='square',aspect=square?'9 / 16':(recipe.aspect_ratio||'9:16').replace(':',' / ');
  return <div><CanvasControl value={color} onChange={setColor}/><div className="clipxy-reframe-preview" style={{aspectRatio:aspect,background:color}}><div style={{position:'absolute',overflow:'hidden',inset:square?'23.4375% 2.7778%':'0',borderRadius:recipe.square_corners==='round'?'8px':0}}><video ref={ref} src={source} muted playsInline preload="auto" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:`${position.pos_x}% ${position.pos_y}%`,transform:`scale(${100/(position.zoom||100)})`}}/></div></div><p className="note">Canvas preview. Captions and effects are preserved on export.</p></div>;
}
