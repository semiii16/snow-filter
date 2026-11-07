import {ImageSegmenter} from './vendor/vision_bundle.mjs';
// All pixels and inference stay in this browser; model and artwork are bundled locally.
export class WinterBackground {
  constructor(){this.ready=false;this.enabled=true;this.mask=document.createElement('canvas');this.cutout=document.createElement('canvas');}
  async init(resolver){
    this.image=new Image();this.image.src='./assets/user/winter-background.png';await this.image.decode();
    this.model=await ImageSegmenter.createFromOptions(resolver,{baseOptions:{modelAssetPath:'./vendor/selfie_segmenter.tflite',delegate:'CPU'},runningMode:'IMAGE',outputConfidenceMasks:true,outputCategoryMask:false});
    this.ready=true;
  }
  drawScene(ctx){const {width:w,height:h}=ctx.canvas;const s=Math.max(w/this.image.width,h/this.image.height);ctx.drawImage(this.image,(w-this.image.width*s)/2,(h-this.image.height*s)/2,this.image.width*s,this.image.height*s);}
  apply(ctx){
    if(!this.enabled||!this.ready)return;
    const {width:w,height:h}=ctx.canvas;
    this.model.segment(ctx.canvas,result=>{
      const masks=result.confidenceMasks;if(!masks?.length)throw new Error('배경 분리 결과가 없습니다.');
      const mask=masks[masks.length===1?0:1],values=mask.getAsFloat32Array();
      this.mask.width=mask.width;this.mask.height=mask.height;
      const mc=this.mask.getContext('2d'),pixels=mc.createImageData(mask.width,mask.height);
      for(let i=0;i<values.length;i++){
        // Soft transition keeps hair edges natural without retaining the old room.
        const a=Math.max(0,Math.min(1,(values[i]-.2)/.6));
        pixels.data[i*4+3]=Math.round(a*a*(3-2*a)*255);
      }
      mc.putImageData(pixels,0,0);
      this.cutout.width=w;this.cutout.height=h;const cc=this.cutout.getContext('2d');
      cc.drawImage(ctx.canvas,0,0);cc.globalCompositeOperation='destination-in';cc.drawImage(this.mask,0,0,w,h);cc.globalCompositeOperation='source-over';
      ctx.clearRect(0,0,w,h);this.drawScene(ctx);ctx.drawImage(this.cutout,0,0);
    });
  }
}
