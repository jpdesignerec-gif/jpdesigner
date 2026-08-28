import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';

const normalizeOptions=options=>options.map(option=>typeof option==='string'?{value:option,label:option}:option);

export function SelectMenu({value='',onChange,options=[],placeholder='Selecciona una opción',searchable=false,ariaLabel='Seleccionar opción'}){
  const [open,setOpen]=useState(false);const [query,setQuery]=useState('');const root=useRef(null);
  const items=useMemo(()=>normalizeOptions(options),[options]);
  const selected=items.find(item=>item.value===value);
  const visible=items.filter(item=>item.label.toLowerCase().includes(query.toLowerCase()));
  useEffect(()=>{const close=e=>!root.current?.contains(e.target)&&setOpen(false);const escape=e=>e.key==='Escape'&&setOpen(false);document.addEventListener('pointerdown',close);document.addEventListener('keydown',escape);return()=>{document.removeEventListener('pointerdown',close);document.removeEventListener('keydown',escape)}},[]);
  const choose=next=>{onChange(next);setOpen(false);setQuery('')};
  return <div className={`modern-select ${open?'is-open':''}`} ref={root}><button type="button" className="modern-select-trigger" aria-label={ariaLabel} aria-haspopup="listbox" aria-expanded={open} onClick={()=>setOpen(!open)}><span className={selected?'':'placeholder'}>{selected?.label||placeholder}</span><ChevronDown/></button>{open&&<div className="modern-select-popover">{searchable&&<label className="modern-select-search"><Search/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar…"/></label>}<div className="modern-select-list" role="listbox">{visible.map(item=><button type="button" role="option" aria-selected={item.value===value} className={item.value===value?'selected':''} key={item.value} onClick={()=>choose(item.value)}><span>{item.label}</span>{item.value===value&&<Check/>}</button>)}{!visible.length&&<span className="modern-select-empty">No hay coincidencias</span>}</div></div>}</div>;
}

const iso=date=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const parse=value=>value?new Date(`${value}T12:00:00`):new Date();
const monthLabel=date=>new Intl.DateTimeFormat('es-EC',{month:'long',year:'numeric'}).format(date);

export function ModernCalendar({value,onChange}){
  const [open,setOpen]=useState(false);const [view,setView]=useState(()=>parse(value));const root=useRef(null);const selected=value?parse(value):null;
  useEffect(()=>{const close=e=>!root.current?.contains(e.target)&&setOpen(false);const escape=e=>e.key==='Escape'&&setOpen(false);document.addEventListener('pointerdown',close);document.addEventListener('keydown',escape);return()=>{document.removeEventListener('pointerdown',close);document.removeEventListener('keydown',escape)}},[]);
  const first=new Date(view.getFullYear(),view.getMonth(),1);const offset=(first.getDay()+6)%7;const count=new Date(view.getFullYear(),view.getMonth()+1,0).getDate();const cells=[...Array(offset).fill(null),...Array.from({length:count},(_,i)=>new Date(view.getFullYear(),view.getMonth(),i+1))];
  const display=selected?new Intl.DateTimeFormat('es-EC',{day:'2-digit',month:'long',year:'numeric'}).format(selected):'Selecciona una fecha';
  return <div className={`modern-calendar ${open?'is-open':''}`} ref={root}><button type="button" className="modern-calendar-trigger" onClick={()=>setOpen(!open)}><CalendarDays/><span className={selected?'':'placeholder'}>{display}</span><ChevronDown/></button>{open&&<div className="calendar-popover"><header><button type="button" aria-label="Mes anterior" onClick={()=>setView(new Date(view.getFullYear(),view.getMonth()-1,1))}><ChevronLeft/></button><b>{monthLabel(view)}</b><button type="button" aria-label="Mes siguiente" onClick={()=>setView(new Date(view.getFullYear(),view.getMonth()+1,1))}><ChevronRight/></button></header><div className="calendar-weekdays">{['L','M','X','J','V','S','D'].map(day=><span key={day}>{day}</span>)}</div><div className="calendar-days">{cells.map((day,index)=>day?<button type="button" key={iso(day)} className={`${value===iso(day)?'selected ':''}${iso(day)===iso(new Date())?'today':''}`} onClick={()=>{onChange(iso(day));setOpen(false)}}>{day.getDate()}</button>:<span key={`empty-${index}`}/>)}</div><footer><button type="button" onClick={()=>{const today=new Date();onChange(iso(today));setView(today);setOpen(false)}}>Hoy</button>{value&&<button type="button" onClick={()=>onChange('')}><X/> Limpiar</button>}</footer></div>}</div>;
}
