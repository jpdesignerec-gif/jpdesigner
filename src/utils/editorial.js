const ADMIN_SESSION_KEY='jep-admin-session-v1';
export function isPreviewMode(){try{const params=new URLSearchParams(window.location.search);const session=JSON.parse(sessionStorage.getItem(ADMIN_SESSION_KEY));return params.get('preview')==='1'&&session?.expiresAt>Date.now()}catch{return false}}
export function isContentVisible(item,preview=isPreviewMode()){if(!item)return false;if(preview)return true;const status=item.status||(item.published===false?'draft':'published');if(status==='draft')return false;if(status==='scheduled')return Boolean(item.publishAt)&&new Date(item.publishAt)<=new Date();return item.published!==false}
export function visibleContent(items=[]){const preview=isPreviewMode();return items.filter(item=>isContentVisible(item,preview))}
