// User artwork stays untouched. Coordinates describe the transparent face opening.
export const initialLayers=[
{id:'hood',name:'양 탈',src:'assets/final/hood-1.png',anchor:'face',opening:[.5,.60,.44,.46],size:100,x:0,y:0,enabled:true},
{id:'happy',name:'HAPPY',src:'assets/final/happy.png',anchor:'screen',size:30,x:25,y:29,enabled:true},
{id:'year',name:'2027',src:'assets/final/year.png',anchor:'screen',size:34,x:25,y:39,enabled:true},
{id:'starPink',name:'분홍 별',src:'assets/final/star-pink.png',anchor:'screen',size:12,x:-39,y:27,enabled:true},
{id:'starYellow',name:'노란 별',src:'assets/final/star-yellow.png',anchor:'screen',size:12,x:39,y:-34,enabled:true}
];
export function paintLayers(ctx,layers,cache,faces,screen){
 const {width:W,height:H}=ctx.canvas;
 for(const l of layers){if(!l.enabled||((l.anchor==='screen')!==screen))continue;const im=cache.get(l.src);if(!im)continue;
 const targets=screen?[{x:W/2,y:H/2,w:W,h:H,angle:0}]:faces;
 for(const f of targets){let w,h,x=f.x,y=f.y;
 if(l.anchor==='screen'){w=W*l.size/100;h=w*im.height/im.width;x+=W*l.x/100;y+=H*l.y/100;}
 else if(l.anchor==='face'){const o=l.opening||[.5,.635,.39,.43];w=f.w/o[2]*l.size/100;h=f.h/o[3]*l.size/100;}
 else {w=f.w*l.size/100;h=w*im.height/im.width;if(l.anchor==='chin'){x=f.chinX;y=f.chinY;}}
 ctx.save();ctx.translate(x,y);ctx.rotate(f.angle||0);
 if(!screen)ctx.translate(f.w*l.x/100,f.h*l.y/100);
 // Align the center of the hood opening, rather than the image center, to the face.
 ctx.drawImage(im,-w*(l.anchor==='face'?(l.opening?.[0]??.5):.5),-h*(l.anchor==='face'?(l.opening?.[1]??.635):.5),w,h);ctx.restore();}
 }
}
