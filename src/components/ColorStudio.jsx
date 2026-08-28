import { useMemo, useState } from 'react';
import { Plus, X } from 'lucide-react';

const clamp=(value,min=0,max=255)=>Math.min(max,Math.max(min,Number(value)||0));
const hexToRgb=hex=>{const clean=hex.replace('#','');const value=parseInt(clean.length===3?clean.split('').map(x=>x+x).join(''):clean,16);return Number.isNaN(value)?{r:255,g:90,b:31}:{r:(value>>16)&255,g:(value>>8)&255,b:value&255}};
const rgbToHex=({r,g,b})=>`#${[r,g,b].map(x=>Math.round(clamp(x)).toString(16).padStart(2,'0')).join('')}`;
const rgbToCmyk=({r,g,b})=>{const nr=r/255,ng=g/255,nb=b/255,k=1-Math.max(nr,ng,nb);if(k===1)return {c:0,m:0,y:0,k:100};return {c:Math.round((1-nr-k)/(1-k)*100),m:Math.round((1-ng-k)/(1-k)*100),y:Math.round((1-nb-k)/(1-k)*100),k:Math.round(k*100)}};
const rgbToHsb=({r,g,b})=>{r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;let h=0;if(d){if(max===r)h=60*(((g-b)/d)%6);else if(max===g)h=60*((b-r)/d+2);else h=60*((r-g)/d+4)}return {h:Math.round((h+360)%360),s:Math.round(max?d/max*100:0),b:Math.round(max*100)}};

export function ColorStudio({value=[],onChange}){
  const [hex,setHex]=useState('#ff5a1f');const rgb=useMemo(()=>hexToRgb(hex),[hex]);const cmyk=useMemo(()=>rgbToCmyk(rgb),[rgb]);const hsb=useMemo(()=>rgbToHsb(rgb),[rgb]);
  const updateRgb=(key,next)=>setHex(rgbToHex({...rgb,[key]:clamp(next)}));
  const add=()=>{const normalized=rgbToHex(hexToRgb(hex));if(!value.includes(normalized))onChange([...value,normalized])};
  return <div className="color-studio"><div className="color-preview" style={{'--selected-color':hex}}><input aria-label="Selector visual de color" type="color" value={hex} onChange={e=>setHex(e.target.value)}/><div><b>{hex.toUpperCase()}</b><small>Selecciona o introduce valores</small></div></div><div className="color-models"><label><span>HEX</span><input value={hex} onChange={e=>/^#?[0-9a-fA-F]{0,6}$/.test(e.target.value)&&setHex(e.target.value.startsWith('#')?e.target.value:`#${e.target.value}`)}/></label>{['r','g','b'].map(key=><label key={key}><span>{key.toUpperCase()}</span><input type="number" min="0" max="255" value={rgb[key]} onChange={e=>updateRgb(key,e.target.value)}/></label>)}</div><div className="color-readouts"><span>CMYK {cmyk.c} / {cmyk.m} / {cmyk.y} / {cmyk.k}</span><span>HSB {hsb.h}° / {hsb.s}% / {hsb.b}%</span></div><button type="button" className="button small ghost" onClick={add}><Plus/>Añadir a la paleta</button><div className="color-chips">{value.map(color=><button type="button" key={color} style={{'--chip':color}} onClick={()=>onChange(value.filter(x=>x!==color))}>{color.toUpperCase()}<X size={12}/></button>)}</div></div>;
}
