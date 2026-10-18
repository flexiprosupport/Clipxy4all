import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(new URL('../caption_renderer/package.json',import.meta.url));
const {createCanvas,GlobalFonts}=require('@napi-rs/canvas');
import {createCaptionRenderer} from '../caption_renderer/adapter.mjs';
const root=path.resolve(import.meta.dirname,'..');
for(const file of fs.readdirSync(path.join(root,'assets/fonts')))if(/\.(ttf|otf)$/i.test(file))GlobalFonts.registerFromPath(path.join(root,'assets/fonts',file));
globalThis.document={createElement:()=>createCanvas(1,1),fonts:{load:async()=>[],ready:Promise.resolve()}};
const catalog=JSON.parse(fs.readFileSync(path.join(root,'caption_renderer/catalog.json'),'utf8'));
let results=[];
for(const style of catalog){
 const c=createCanvas(360,640),renderer=await createCaptionRenderer(c,{style:style.id,words:[{word:'Create',start:0,end:.7},{word:'great',start:.7,end:1.4},{word:'clips',start:1.4,end:2.1}],duration:2.1,language:'en',overrides:{}});
 await renderer.draw(.9);
 const data=c.data();let visible=0;for(let i=3;i<data.length;i+=4)if(data[i]>0)visible++;
 if(!visible)throw Error('Empty caption: '+style.id);
 results.push({id:style.id,pixels:visible});
}
fs.writeFileSync(path.join(root,'tests/results/caption-results.json'),JSON.stringify(results,null,2));
console.log('PASS: '+results.length+' caption styles drew visible pixels');
