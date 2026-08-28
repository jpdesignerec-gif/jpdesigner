import { afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => cleanup());
Object.defineProperty(window,'matchMedia',{writable:true,value:query=>({matches:false,media:query,onchange:null,addListener:()=>{},removeListener:()=>{},addEventListener:()=>{},removeEventListener:()=>{},dispatchEvent:()=>false})});
class IntersectionObserverMock{observe(element){element.classList?.add('is-visible')}unobserve(){}disconnect(){}}
window.IntersectionObserver=IntersectionObserverMock;globalThis.IntersectionObserver=IntersectionObserverMock;
window.scrollTo=()=>{};HTMLDialogElement.prototype.showModal=function(){this.open=true};HTMLDialogElement.prototype.close=function(){this.open=false};
beforeEach(()=>{localStorage.clear();sessionStorage.clear();document.documentElement.dataset.theme='dark'});
