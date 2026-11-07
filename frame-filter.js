export class GreetingFrame {
  async init(){this.background=new Image();this.background.src='./assets/user/sheep-greeting-frame.png';await this.background.decode();}
  draw(ctx,source,faces){
    const w=ctx.canvas.width,h=ctx.canvas.height,face=faces[0];
    ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);
    if(face){ctx.save();ctx.beginPath();ctx.rect(w*.305,h*.505,w*.245,h*.19);ctx.clip();const scale=h*.15/Math.max(face.h,1);ctx.drawImage(source,w*.43-face.x*scale,h*.603-face.y*scale,source.width*scale,source.height*scale);ctx.restore();}
    ctx.drawImage(this.background,0,0,w,h);
  }
}
export class CharmFilter {
  constructor(){this.selected=0;this.images=[];}
  async init(){this.images=await Promise.all([16,17,18].map(async n=>{const im=new Image();im.src=`./assets/final/charm-${n}.png`;await im.decode();return im;}));}
  draw(ctx,faces){
    const im=this.images[this.selected];if(!im)return;
    for(const face of faces){
      const aspect=im.height/im.width;
      const width=.88*Math.max(face.w*1.22/.586,face.h*1.3/(.43*aspect)),height=width*aspect;
      ctx.save();ctx.translate(face.x,face.y);ctx.rotate(face.angle);
      ctx.drawImage(im,-width*.516,-height*.674,width,height);ctx.restore();
    }
  }
}
