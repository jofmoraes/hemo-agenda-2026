import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const css=readFileSync(new URL('../public/b18.css',import.meta.url),'utf8');

function channel(value){
 const n=parseInt(value,16)/255;
 return n<=0.03928?n/12.92:((n+0.055)/1.055)**2.4;
}

function luminance(hex){
 const value=hex.replace('#','');
 return 0.2126*channel(value.slice(0,2))+0.7152*channel(value.slice(2,4))+0.0722*channel(value.slice(4,6));
}

function contrast(foreground,background){
 const a=luminance(foreground),b=luminance(background);
 return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
}

test('UX2-R1: principal active control pair meets WCAG AA',()=>{
 assert.ok(contrast('#ad5d2d','#ffffff')>=4.5);
 assert.ok(contrast('#3f4145','#ffffff')>=4.5);
 assert.ok(contrast('#d9823d','#ffffff')<4.5,'the decorative orange must not return to white-text controls');
 assert.match(css,/\.tab\.active,\.day\.active,\.view\.active,[\s\S]*?background:var\(--orange-deep\)!important/);
 assert.match(css,/\.filter-segments button\.selected,[\s\S]*?background:var\(--orange-deep\)!important/);
 assert.match(css,/#backupBtn\.clear-filters-active[\s\S]*?background:var\(--orange-deep\)!important/);
});
