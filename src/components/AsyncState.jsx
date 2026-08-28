import { AlertTriangle, Inbox, LoaderCircle, RotateCcw } from 'lucide-react';
export function SkeletonGrid({count=6}){return <div className="skeleton-grid" aria-busy="true" aria-label="Cargando contenido">{Array.from({length:count},(_,i)=><article key={i}><i/><span/><span/></article>)}</div>}
export function EmptyStateView({title='No hay contenido',copy='Todavía no existen elementos para mostrar.',action}){return <div className="public-empty"><Inbox/><h2>{title}</h2><p>{copy}</p>{action}</div>}
export function ErrorState({title='No pudimos cargar esta sección',copy='Comprueba tu conexión e inténtalo nuevamente.',onRetry}){return <div className="public-error" role="alert"><AlertTriangle/><h2>{title}</h2><p>{copy}</p>{onRetry&&<button className="button ghost" onClick={onRetry}><RotateCcw/>Reintentar</button>}</div>}
export function LoadingStatus({label='Guardando…'}){return <span className="loading-status" role="status" aria-live="polite"><LoaderCircle/>{label}</span>}
