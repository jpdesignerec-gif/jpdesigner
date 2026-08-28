import { AtSign, CalendarDays, ExternalLink, Globe2, Mail, MapPin, MessageCircle, Palette, Play, Share2, Sparkles, Users } from 'lucide-react';
import { appUrl, assetUrl } from '../utils/assets';

export const blockCatalog=[
  {type:'text',group:'Contenido',label:'Texto enriquecido',icon:'T',description:'Títulos, párrafos, listas, enlaces y citas.'},
  {type:'columns',group:'Contenido',label:'Columnas',icon:'▥',description:'Dos o tres columnas de contenido.'},
  {type:'mediaText',group:'Contenido',label:'Imagen + texto',icon:'◫',description:'Composición con imagen a izquierda o derecha.'},
  {type:'image',group:'Medios',label:'Imagen',icon:'▧',description:'Imagen pequeña, mediana, grande o expandible.'},
  {type:'banner',group:'Medios',label:'Banner ancho',icon:'▬',description:'Imagen de ancho completo con texto opcional.'},
  {type:'fullscreen',group:'Medios',label:'Imagen de pantalla',icon:'▣',description:'Imagen a ancho y alto de la pantalla.'},
  {type:'gallery',group:'Medios',label:'Galería',icon:'▦',description:'Mosaico, carrusel o cuadrícula.'},
  {type:'video',group:'Medios',label:'Vídeo',icon:'▶',description:'YouTube, Vimeo o archivo de vídeo.'},
  {type:'divider',group:'Estructura',label:'Divisor',icon:'—',description:'Separador fino, punteado o decorativo.'},
  {type:'button',group:'Acciones',label:'Botón / enlace',icon:'↗',description:'Llamada a la acción interna o externa.'},
  {type:'social',group:'Acciones',label:'Redes sociales',icon:'◎',description:'Enlaces sociales con iconos.'},
  {type:'map',group:'Incrustados',label:'Mapa',icon:'⌖',description:'Mapa embebido con dirección.'},
  {type:'embed',group:'Incrustados',label:'HTML incrustado',icon:'</>',description:'Código HTML o iframe personalizado.'},
  {type:'icon',group:'Visual',label:'Icono',icon:'✦',description:'Icono destacado con texto.'},
  {type:'svg',group:'Visual',label:'SVG',icon:'◇',description:'Símbolo vectorial de la biblioteca.'},
  {type:'logo',group:'Visual',label:'Logos',icon:'◉',description:'Logotipo individual o tira de marcas.'},
  {type:'emoji',group:'Visual',label:'Emoji',icon:'☺',description:'Emoji destacado con título y texto.'},
  {type:'date',group:'Datos',label:'Fecha',icon:'◷',description:'Fecha o evento destacado.'},
  {type:'palette',group:'Datos',label:'Paleta de colores',icon:'◍',description:'Muestras con HEX, RGB, CMYK y HSB.'}
];

const defaults={
  text:{html:'<h2>Nuevo bloque de texto</h2><p>Escribe aquí tu contenido.</p>',width:'normal',align:'left'},
  columns:{count:2,columns:['<h3>Primera columna</h3><p>Contenido editable.</p>','<h3>Segunda columna</h3><p>Contenido editable.</p>'],gap:'medium'},
  mediaText:{image:'/assets/marca.jpg',alt:'Proyecto de diseño',eyebrow:'Concepto',title:'Imagen y texto trabajando juntos.',text:'Explica la idea, el proceso o el resultado.',imageSide:'left',ratio:'4/3',fit:'cover',buttonLabel:'',buttonUrl:''},
  image:{src:'/assets/marca.jpg',alt:'Imagen del proyecto',caption:'',size:'large',ratio:'auto',fit:'cover',expandable:true,radius:'medium'},
  banner:{src:'/assets/banner.jpg',alt:'Banner del proyecto',title:'Una idea que ocupa todo el ancho.',overlay:true,height:'medium',align:'left'},
  fullscreen:{src:'/assets/portada.jpg',alt:'Imagen de pantalla completa',title:'Impacto a pantalla completa',position:'center',overlay:true},
  gallery:{images:['/assets/marca.jpg','/assets/diseno.jpg','/assets/banner.jpg'],layout:'mosaic',columns:3,ratio:'4/3',fit:'cover'},
  video:{url:'https://www.youtube.com/watch?v=dQw4w9WgXcQ',title:'Vídeo del proyecto',poster:'',ratio:'16/9',autoplay:false},
  divider:{style:'line',spacing:'medium',label:''},
  button:{label:'Conocer más',url:'/contacto',style:'primary',align:'left',newTab:false,icon:'arrow'},
  social:{title:'Sígueme',links:[{network:'instagram',url:'https://www.instagram.com/jepdesigner.ec'},{network:'whatsapp',url:'https://wa.me/593967971841'}],align:'left'},
  map:{title:'Ubicación',address:'Ecuador',embedUrl:'https://www.google.com/maps?q=Ecuador&output=embed',height:420},
  embed:{html:'<div style="padding:24px;text-align:center">HTML personalizado</div>',label:'Contenido incrustado'},
  icon:{icon:'sparkles',eyebrow:'Detalle',title:'Diseño con intención',text:'Un mensaje breve acompañado por un icono.',align:'center'},
  svg:{shape:'orbit',color:'#ff5a1f',size:'medium',label:'Elemento vectorial'},
  logo:{logos:[{src:'/assets/marca.jpg',alt:'Marca'}],layout:'row',monochrome:false},
  emoji:{emoji:'✨',title:'Una idea brillante',text:'Usa emojis como acentos visuales.',size:'large',align:'center'},
  date:{date:new Date().toISOString().slice(0,10),eyebrow:'Fecha',title:'Próximo evento',text:'Información adicional de la fecha.'},
  palette:{name:'Paleta principal',colors:['#ff5a1f','#0c0b0a','#f5f2eb'],showValues:true}
};

export const createBlock=type=>({id:crypto.randomUUID(),type,visible:true,anchor:'',className:'',data:structuredClone(defaults[type]||{})});

const iconMap={sparkles:Sparkles,palette:Palette,map:MapPin,calendar:CalendarDays,mail:Mail,whatsapp:MessageCircle,instagram:AtSign,youtube:Play,linkedin:Users,facebook:Globe2};
const socialMap={instagram:AtSign,whatsapp:MessageCircle,youtube:Play,linkedin:Users,facebook:Globe2,email:Mail,other:Share2};
const ratioClass=ratio=>ratio==='auto'?'ratio-auto':`ratio-${String(ratio).replace('/','-')}`;
const youtubeUrl=url=>{try{const parsed=new URL(url);if(parsed.hostname.includes('youtu.be'))return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;if(parsed.hostname.includes('youtube.com'))return `https://www.youtube.com/embed/${parsed.searchParams.get('v')||parsed.pathname.split('/').pop()}`;if(parsed.hostname.includes('vimeo.com'))return `https://player.vimeo.com/video/${parsed.pathname.split('/').pop()}`;return url}catch{return url}};
const rgb=hex=>{const value=parseInt(hex.replace('#',''),16);return {r:(value>>16)&255,g:(value>>8)&255,b:value&255}};
const formats=hex=>{const {r,g,b}=rgb(hex),nr=r/255,ng=g/255,nb=b/255,k=1-Math.max(nr,ng,nb),c=k===1?0:(1-nr-k)/(1-k),m=k===1?0:(1-ng-k)/(1-k),y=k===1?0:(1-nb-k)/(1-k),max=Math.max(nr,ng,nb),min=Math.min(nr,ng,nb),d=max-min;let h=0;if(d){if(max===nr)h=60*(((ng-nb)/d)%6);else if(max===ng)h=60*((nb-nr)/d+2);else h=60*((nr-ng)/d+4)}return {rgb:`${r}, ${g}, ${b}`,cmyk:`${Math.round(c*100)}, ${Math.round(m*100)}, ${Math.round(y*100)}, ${Math.round(k*100)}`,hsb:`${Math.round((h+360)%360)}°, ${Math.round(max?d/max*100:0)}%, ${Math.round(max*100)}%`}};

export function BlockRenderer({blocks=[]}){return <div className="content-blocks">{blocks.filter(block=>block.visible!==false).map(block=><RenderBlock key={block.id} block={block}/>)}</div>}

function RenderBlock({block}){const d=block.data||{};const common={id:block.anchor||undefined,className:`content-block block-${block.type} ${block.className||''}`};
  if(block.type==='text')return <section {...common}><div className={`block-inner text-${d.width||'normal'} align-${d.align||'left'} rich-output`} dangerouslySetInnerHTML={{__html:d.html}}/></section>;
  if(block.type==='columns')return <section {...common}><div className={`block-inner columns-grid columns-${d.count||2} gap-${d.gap||'medium'}`}>{(d.columns||[]).slice(0,d.count||2).map((html,i)=><div className="rich-output" dangerouslySetInnerHTML={{__html:html}} key={i}/>)}</div></section>;
  if(block.type==='mediaText')return <section {...common}><div className={`block-inner media-text image-${d.imageSide||'left'}`}><button className={`media-frame ${ratioClass(d.ratio)}`} onClick={()=>d.image&&window.open(assetUrl(d.image),'_blank')}><img loading="lazy" decoding="async" src={assetUrl(d.image)} alt={d.alt||''} style={{objectFit:d.fit||'cover'}}/></button><div><span className="eyebrow">{d.eyebrow}</span><h2>{d.title}</h2><p>{d.text}</p>{d.buttonLabel&&<a className="button primary" href={appUrl(d.buttonUrl)}>{d.buttonLabel}<ExternalLink/></a>}</div></div></section>;
  if(block.type==='image')return <section {...common}><figure className={`block-image size-${d.size||'large'} radius-${d.radius||'medium'} ${ratioClass(d.ratio)}`}><img loading="lazy" decoding="async" src={assetUrl(d.src)} alt={d.alt||''} style={{objectFit:d.fit||'cover'}} onClick={()=>d.expandable&&window.open(assetUrl(d.src),'_blank')}/>{d.caption&&<figcaption>{d.caption}</figcaption>}</figure></section>;
  if(block.type==='banner'||block.type==='fullscreen')return <section {...common}><div className={`${block.type}-media height-${d.height||'medium'} ${d.overlay?'has-overlay':''}`}><img loading="lazy" decoding="async" src={assetUrl(d.src)} alt={d.alt||''} style={{objectPosition:d.position||'center'}}/>{d.title&&<div className={`banner-copy align-${d.align||'left'}`}><h2>{d.title}</h2></div>}</div></section>;
  if(block.type==='gallery')return <section {...common}><div className={`block-gallery layout-${d.layout||'mosaic'} cols-${d.columns||3}`}>{(d.images||[]).map((src,i)=><a href={assetUrl(src)} target="_blank" rel="noreferrer" className={ratioClass(d.ratio)} key={`${src}-${i}`}><img loading="lazy" decoding="async" src={assetUrl(src)} alt={`Galería ${i+1}`} style={{objectFit:d.fit||'cover'}}/></a>)}</div></section>;
  if(block.type==='video')return <section {...common}><div className={`block-inner block-video ${ratioClass(d.ratio)}`}>{/youtube|youtu\.be|vimeo/.test(d.url||'')?<iframe src={youtubeUrl(d.url)} title={d.title||'Vídeo'} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>:<video src={d.url} poster={d.poster} controls autoPlay={d.autoplay} muted={d.autoplay}/>}</div></section>;
  if(block.type==='divider')return <section {...common}><div className={`block-inner block-divider divider-${d.style||'line'} space-${d.spacing||'medium'}`}>{d.label&&<span>{d.label}</span>}</div></section>;
  if(block.type==='button')return <section {...common}><div className={`block-inner block-action align-${d.align||'left'}`}><a className={`button ${d.style||'primary'}`} href={appUrl(d.url)} target={d.newTab?'_blank':undefined} rel={d.newTab?'noreferrer':undefined}>{d.label}{d.icon==='arrow'&&<ExternalLink/>}</a></div></section>;
  if(block.type==='social')return <section {...common}><div className={`block-inner social-block align-${d.align||'left'}`}>{d.title&&<h3>{d.title}</h3>}<div>{(d.links||[]).map((link,i)=>{const Icon=socialMap[link.network]||ExternalLink;return <a href={link.url} target="_blank" rel="noreferrer" aria-label={link.network} key={i}><Icon/></a>})}</div></div></section>;
  if(block.type==='map')return <section {...common}><div className="block-inner map-block">{d.title&&<div><MapPin/><h3>{d.title}</h3><span>{d.address}</span></div>}<iframe src={d.embedUrl} title={d.title||'Mapa'} height={d.height||420} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/></div></section>;
  if(block.type==='embed')return <section {...common}><div className="block-inner embed-block" aria-label={d.label} dangerouslySetInnerHTML={{__html:d.html}}/></section>;
  if(block.type==='icon')return <section {...common}><div className={`block-inner icon-block align-${d.align||'center'}`}>{(()=>{const Icon=iconMap[d.icon]||Sparkles;return <Icon/>})()}<span className="eyebrow">{d.eyebrow}</span><h2>{d.title}</h2><p>{d.text}</p></div></section>;
  if(block.type==='svg')return <section {...common}><div className={`block-inner svg-block size-${d.size||'medium'}`} style={{'--svg-color':d.color}}><SvgShape shape={d.shape}/>{d.label&&<span>{d.label}</span>}</div></section>;
  if(block.type==='logo')return <section {...common}><div className={`block-inner logo-strip layout-${d.layout||'row'} ${d.monochrome?'monochrome':''}`}>{(d.logos||[]).map((logo,i)=><img loading="lazy" decoding="async" src={assetUrl(logo.src)} alt={logo.alt||`Logo ${i+1}`} key={i}/>)}</div></section>;
  if(block.type==='emoji')return <section {...common}><div className={`block-inner emoji-block size-${d.size||'large'} align-${d.align||'center'}`}><span>{d.emoji}</span><h2>{d.title}</h2><p>{d.text}</p></div></section>;
  if(block.type==='date')return <section {...common}><div className="block-inner date-block"><CalendarDays/><div><span className="eyebrow">{d.eyebrow}</span><time dateTime={d.date}>{new Date(`${d.date}T12:00:00`).toLocaleDateString('es-EC',{day:'numeric',month:'long',year:'numeric'})}</time><h3>{d.title}</h3><p>{d.text}</p></div></div></section>;
  if(block.type==='palette')return <section {...common}><div className="block-inner palette-block"><span className="eyebrow">Paleta de colores</span><h2>{d.name}</h2><div>{(d.colors||[]).map(color=>{const f=formats(color);return <article key={color} style={{'--swatch':color}}><i/><b>{color.toUpperCase()}</b>{d.showValues&&<small>RGB {f.rgb}<br/>CMYK {f.cmyk}<br/>HSB {f.hsb}</small>}</article>})}</div></div></section>;
  return null;
}

function SvgShape({shape}){if(shape==='wave')return <svg viewBox="0 0 300 120"><path d="M0 70c60-80 110 80 170 0s90-25 130-45" fill="none" stroke="currentColor" strokeWidth="12" strokeLinecap="round"/></svg>;if(shape==='spark')return <svg viewBox="0 0 120 120"><path d="M60 4c4 36 20 52 56 56-36 4-52 20-56 56-4-36-20-52-56-56C40 56 56 40 60 4Z" fill="currentColor"/></svg>;if(shape==='grid')return <svg viewBox="0 0 120 120">{[10,45,80].flatMap(x=>[10,45,80].map(y=><rect key={`${x}-${y}`} x={x} y={y} width="28" height="28" rx="7" fill="currentColor"/>))}</svg>;return <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="42" fill="none" stroke="currentColor" strokeWidth="9"/><circle cx="60" cy="60" r="13" fill="currentColor"/></svg>}

