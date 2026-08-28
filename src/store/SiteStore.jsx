import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { seedData } from '../data/seed';

const STORAGE_KEY = 'jep-site-data-v2';
const SiteContext = createContext(null);

const collectionKeys=['pages','categories','projects','services','plans','testimonials','faqs','inquiries','media','trash','versions'];
const editorialCollections=['pages','projects','services','plans','testimonials','faqs'];

function normalizeData(input={}) {
  const normalized={...seedData,...input,settings:{...seedData.settings,...(input.settings||{})}};
  collectionKeys.forEach(key=>{normalized[key]=Array.isArray(input[key])?input[key]:seedData[key]||[]});
  normalized.pages=seedData.pages.map(defaultPage=>{
    const saved=normalized.pages.find(page=>page.id===defaultPage.id);
    if(!saved)return defaultPage;
    return {...defaultPage,...saved,blocks:Array.isArray(saved.blocks)&&saved.blocks.length?saved.blocks:defaultPage.blocks};
  });
  normalized.projects=normalized.projects.map(project=>({...project,tags:Array.isArray(project.tags)?project.tags:[],services:Array.isArray(project.services)?project.services:[],gallery:Array.isArray(project.gallery)?project.gallery:[],blocks:Array.isArray(project.blocks)?project.blocks:[]}));
  editorialCollections.forEach(collection=>{normalized[collection]=(normalized[collection]||[]).map(item=>({...item,status:item.status||(item.published===false?'draft':'published'),published:item.status?item.status==='published':item.published!==false,publishAt:item.publishAt||null,updatedAt:item.updatedAt||new Date().toISOString(),seo:{title:item.seo?.title||'',description:item.seo?.description||'',image:item.seo?.image||'',noIndex:Boolean(item.seo?.noIndex)},contentVerified:Boolean(item.contentVerified),rightsVerified:Boolean(item.rightsVerified)}))});
  normalized.schemaVersion=seedData.schemaVersion;
  delete normalized.settings.adminCode;
  return normalized;
}

function loadData() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored) return normalizeData(seedData);
    const version=stored.schemaVersion||0;
    let migrated={...stored};
    if(version<3)migrated={...migrated,services:seedData.services,plans:seedData.plans};
    if(version<4)migrated={...migrated,testimonials:seedData.testimonials,faqs:seedData.faqs};
    if(version<5)migrated={...migrated,pages:(migrated.pages||[]).map(page=>({...page,blocks:page.blocks||seedData.pages.find(x=>x.id===page.id)?.blocks||[]})),projects:(migrated.projects||[]).map(project=>({...project,blocks:project.blocks||seedData.projects.find(x=>x.id===project.id)?.blocks||[]}))};
    if(version<6)migrated={...migrated,pages:(migrated.pages||[]).map(page=>page.id==='home'&&!page.blocks?.length?{...page,blocks:seedData.pages.find(x=>x.id==='home').blocks}:page)};
    return normalizeData(migrated);
  } catch { return normalizeData(seedData); }
}

export function SiteProvider({ children }) {
  const [data, setData] = useState(loadData);
  const [theme, setTheme] = useState(() => localStorage.getItem('jep-theme') || data.settings.theme || 'dark');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }, [data]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('jep-theme', theme);
  }, [theme]);
  const notify=(input,type='success')=>{const item=typeof input==='string'?{message:input,type}:{...input,type:input.type||type};const notification={id:crypto.randomUUID(),title:item.title||({success:'Listo',error:'Ocurrió un problema',warning:'Atención',info:'Información'}[item.type]||'Listo'),...item};setNotifications(prev=>[...prev.slice(-3),notification]);setTimeout(()=>setNotifications(prev=>prev.filter(x=>x.id!==notification.id)),4200)};

  const api = useMemo(() => ({
    data, setData, theme, setTheme, toast:notifications[0]?.message||'', notifications, notify, dismissNotification:id=>setNotifications(prev=>prev.filter(x=>x.id!==id)),
    updateItem(collection, id, patch) {
      setData(prev => ({ ...prev, [collection]: prev[collection].map(item => item.id === id ? { ...item, ...patch } : item) }));
    },
    saveEditorial(collection,id,next,{label='Guardado manual',version=true}={}) {
      setData(prev=>{
        const current=prev[collection].find(item=>item.id===id);
        const now=new Date().toISOString();
        const snapshot=version&&current?{id:crypto.randomUUID(),collection,itemId:id,label,createdAt:now,snapshot:current}:null;
        const item={...next,id,updatedAt:now,published:next.status?next.status==='published':next.published!==false};
        return {...prev,[collection]:prev[collection].map(entry=>entry.id===id?item:entry),versions:snapshot?[snapshot,...(prev.versions||[])].slice(0,250):(prev.versions||[])};
      });
    },
    autosaveItem(collection,id,patch) { setData(prev=>({...prev,[collection]:prev[collection].map(item=>item.id===id?{...item,...patch,autosavedAt:new Date().toISOString()}:item)})); },
    duplicateItem(collection,id) {
      const source=data[collection].find(item=>item.id===id);if(!source)return null;
      const copy={...structuredClone(source),id:crypto.randomUUID(),title:source.title?`${source.title} — copia`:undefined,name:source.name?`${source.name} — copia`:undefined,slug:source.slug?`${source.slug}-copia-${Date.now().toString().slice(-4)}`:source.slug,status:'draft',published:false,publishAt:null,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
      setData(prev=>({...prev,[collection]:[copy,...prev[collection]]}));return copy;
    },
    trashItem(collection,id) { setData(prev=>{const item=prev[collection].find(entry=>entry.id===id);if(!item)return prev;return {...prev,[collection]:prev[collection].filter(entry=>entry.id!==id),trash:[{id:crypto.randomUUID(),collection,itemId:id,deletedAt:new Date().toISOString(),item},...(prev.trash||[])]}}); },
    restoreTrash(trashId) { setData(prev=>{const record=(prev.trash||[]).find(entry=>entry.id===trashId);if(!record)return prev;return {...prev,[record.collection]:[record.item,...(prev[record.collection]||[])],trash:prev.trash.filter(entry=>entry.id!==trashId)}}); },
    permanentlyDelete(trashId) { setData(prev=>({...prev,trash:(prev.trash||[]).filter(entry=>entry.id!==trashId)})); },
    restoreVersion(versionId) { setData(prev=>{const version=(prev.versions||[]).find(entry=>entry.id===versionId);if(!version)return prev;const current=prev[version.collection].find(item=>item.id===version.itemId);const now=new Date().toISOString();return {...prev,[version.collection]:prev[version.collection].map(item=>item.id===version.itemId?{...version.snapshot,updatedAt:now}:item),versions:[{id:crypto.randomUUID(),collection:version.collection,itemId:version.itemId,label:'Antes de restaurar',createdAt:now,snapshot:current},...prev.versions]}}); },
    addItem(collection, item) { setData(prev => ({ ...prev, [collection]: [...prev[collection], item] })); },
    removeItem(collection, id) { setData(prev => ({ ...prev, [collection]: prev[collection].filter(item => item.id !== id) })); },
    reorderItem(collection, id, direction) {
      setData(prev => {
        const items = [...prev[collection]];
        const index = items.findIndex(item => item.id === id);
        const next = index + direction;
        if (index < 0 || next < 0 || next >= items.length) return prev;
        [items[index], items[next]] = [items[next], items[index]];
        return { ...prev, [collection]: items.map((item, i) => ({ ...item, order:i + 1 })) };
      });
    },
    resetData() { setData(normalizeData(seedData)); },
    importData(next) { setData(normalizeData(next)); },
    exportData() {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = 'jep-designer-backup.json'; link.click();
      URL.revokeObjectURL(url);
    }
  }), [data, theme, notifications]);

  return <SiteContext.Provider value={api}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
