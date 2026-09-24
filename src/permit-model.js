/* Permit geometry added to the original GitHub app. Measurements: config.js. */
window.installPermitModel=function(legacy){
  'use strict';
  const E=legacy.engine,C=window.DAK_CONFIG;
  const {Ot:Mesh,we:BoxGeometry,le:Material,ue:Group,Wi:Shape,Ls:ExtrudeGeometry,
    Cn:CylinderGeometry,Is:CanvasTexture,Er:Sprite,Ts:SpriteMaterial,He:SRGBColorSpace}=E;
  const $=id=>document.getElementById(id),fmt=(n,d=3)=>n.toLocaleString('nl-NL',{minimumFractionDigits:d,maximumFractionDigits:d});
  const state={laundry:C.plan.laundryDepth,door:true};
  let D=deriveDak(C),root,labels,furniture,shell,framing,context,roofs,stairsModel;
  const materials=[];
  function mat(color,options={}) { const m=new Material({color,roughness:.8,...options});materials.push(m);return m; }
  const M={wall:legacy.ot.wand,edge:legacy.ot.trim,roof:legacy.roofMaterial,
    bitumen:legacy.bitumenMaterial,wood:legacy.ot.hout,white:legacy.ot.wit,
    glass:legacy.ot.glas,frame:legacy.ot.veluxFrame,orange:mat(0xcf8b37),
    metal:legacy.ot.alu,concrete:mat(0xaaa99e),context:mat(0xc7bea8),
    bed:legacy.ot.matras,linen:legacy.ot.dekbed};
  const floorM={};D.rooms.forEach(r=>floorM[r.id]=mat(r.color));
  function box(group,w,h,d,x,y,z,material=M.wall){
    if(w<=0||h<=0||d<=0)throw new Error('Ongeldige geometrie');
    const m=new Mesh(new BoxGeometry(w,h,d),material);m.position.set(x,y,z);
    m.castShadow=true;m.receiveShadow=true;group.add(m);return m;
  }
  function polygon(group,points,depth,material=M.wall){
    const s=new Shape();points.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();
    const m=new Mesh(new ExtrudeGeometry(s,{depth,bevelEnabled:false}),material);
    m.castShadow=true;m.receiveShadow=true;group.add(m);return m;
  }
  function text(group,value,x,y,z,color='#294f49',size=.23){
    const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
    ctx.font='600 32px sans-serif';canvas.width=Math.ceil(ctx.measureText(value).width)+32;canvas.height=54;
    ctx.font='600 32px sans-serif';ctx.fillStyle='#fffffff0';ctx.beginPath();ctx.roundRect(0,0,canvas.width,54,10);ctx.fill();
    ctx.fillStyle=color;ctx.textBaseline='middle';ctx.fillText(value,16,28);
    const texture=new CanvasTexture(canvas);texture.colorSpace=SRGBColorSpace;
    const m=new Sprite(new SpriteMaterial({map:texture,depthTest:false}));m.scale.set(canvas.width/54*size,size,1);m.position.set(x,y,z);group.add(m);
  }
  function freeHeight(z){
    return Math.min(C.levels.ceiling,D.floor+C.roof.kneeHeightDrawing+Math.max(0,Math.min(z-D.z0,D.z5-z))*Math.tan(D.angle));
  }
  function wallZ(x,z0,z1,thickness){
    const low=(legacy.state.binnen && $('permit-cut').checked), ceiling=z=>low?D.floor+C.visual.cutHeight:freeHeight(z);
    const shoulder=(C.levels.ceiling-D.floor-C.roof.kneeHeightDrawing)/Math.tan(D.angle)+D.z0;
    const zs=[z0,...[shoulder,D.length-shoulder].filter(z=>z>z0&&z<z1),z1];
    const points=[[z0,D.floor],[z1,D.floor],...zs.slice().reverse().map(z=>[z,ceiling(z)])];
    const m=polygon(shell,points,thickness);m.rotation.y=-Math.PI/2;m.position.x=x+thickness/2;
  }
  function exteriorWalls(){
    const low=(legacy.state.binnen && $('permit-cut').checked);
    for(const [x,t] of [[C.plan.sideNeighbour/2,C.plan.sideNeighbour],[D.width-C.plan.sideStreet/2,C.plan.sideStreet]]){
      const points=low?[[0,D.floor],[D.length,D.floor],[D.length,D.floor+C.visual.cutHeight],[0,D.floor+C.visual.cutHeight]]:
        [[0,D.floor],[D.length,D.floor],[D.length,C.levels.eaves],[D.length-D.run,C.levels.roofEdge],[D.run,C.levels.roofEdge],[0,C.levels.eaves]];
      const mesh=polygon(shell,points,t,x<D.width/2?legacy.neighbourMaterial:legacy.streetMaterial);mesh.rotation.y=-Math.PI/2;mesh.position.x=x+t/2+(x<D.width/2?C.visual.surfaceOffset:-C.visual.surfaceOffset);
    }
    const h=low?C.visual.cutHeight:C.levels.eaves-D.floor;
    for(const [x0,x1,t] of[[D.x0,D.x2,C.plan.endWall],[D.x2,D.x3,C.plan.rightEndWall]])for(const z of[t/2,D.length-t/2])box(shell,x1-x0,h,t,(x0+x1)/2,D.floor+h/2,z,legacy.roofMaterial);
  }
  function wallX(x0,x1,z,thickness,doorX=null){
    const height=(legacy.state.binnen && $('permit-cut').checked)?C.visual.cutHeight:freeHeight(z)-D.floor;
    if(doorX!==null){
      const a=doorX-C.doors.width/2,b=doorX+C.doors.width/2;
      box(shell,a-x0,height,thickness,(x0+a)/2,D.floor+height/2,z);
      box(shell,x1-b,height,thickness,(x1+b)/2,D.floor+height/2,z);
      if(height>C.doors.height)box(shell,C.doors.width,height-C.doors.height,thickness,doorX,D.floor+C.doors.height+(height-C.doors.height)/2,z);
      const leaf=box(shell,C.doors.width,Math.min(height,C.doors.height),C.visual.doorThickness,a+C.doors.width*.32,D.floor+Math.min(height,C.doors.height)/2,z+.31,M.wood);leaf.rotation.y=-Math.PI/4;
    }else box(shell,x1-x0,height,thickness,(x0+x1)/2,D.floor+height/2,z);
  }
  function dividerDoor(z0,z1,doorCentre){
    const a=doorCentre-C.doors.width/2,b=doorCentre+C.doors.width/2;
    wallZ((D.x1+D.x2)/2,z0,a,C.plan.divider);wallZ((D.x1+D.x2)/2,b,z1,C.plan.divider);
    if(!(legacy.state.binnen && $('permit-cut').checked)){const h=freeHeight(doorCentre)-D.floor-C.doors.height;
      box(shell,C.plan.divider,h,C.doors.width,(D.x1+D.x2)/2,D.floor+C.doors.height+h/2,doorCentre);}
    const leaf=box(shell,C.visual.doorThickness,(legacy.state.binnen && $('permit-cut').checked)?C.visual.cutHeight:C.doors.height,C.doors.width,D.x2+.31,D.floor+((legacy.state.binnen && $('permit-cut').checked)?C.visual.cutHeight:C.doors.height)/2,a+C.doors.width*.32,M.wood);leaf.rotation.y=Math.PI/4;
  }
  function slopeBox(group,width,height,length,x,s,side,material,offset=0){
    const front=side==='front';
    const m=box(group,width,height,length,x,C.levels.eaves+s*Math.sin(D.angle)+offset,
      front?s*Math.cos(D.angle):D.length-s*Math.cos(D.angle),material);
    m.rotation.x=front?-D.angle:D.angle;return m;
  }
  function makeRoof(){
    const slopeLength=(C.levels.roofEdge-C.levels.eaves)/Math.sin(D.angle);
    for(const side of ['front','rear']){
      const windows=C.windows[side].map(w=>({...w,s:w.slopeFraction*slopeLength}));
      const xs=[...new Set([0,D.width,...windows.flatMap(w=>[w.x-C.windows.width/2,w.x+C.windows.width/2])])].sort((a,b)=>a-b);
      const ss=[...new Set([0,slopeLength,...windows.flatMap(w=>[w.s-C.windows.height/2,w.s+C.windows.height/2])])].sort((a,b)=>a-b);
      for(let i=1;i<xs.length;i++)for(let j=1;j<ss.length;j++){
        const x=(xs[i]+xs[i-1])/2,s=(ss[j]+ss[j-1])/2;
        if(windows.some(w=>Math.abs(x-w.x)<C.windows.width/2-.001&&Math.abs(s-w.s)<C.windows.height/2-.001))continue;
        slopeBox(roofs,xs[i]-xs[i-1],C.roof.thickness,ss[j]-ss[j-1],x,s,side,M.roof);
      }
      for(const w of windows){
        const f=C.visual.frame,W=C.windows.width,H=C.windows.height;
        slopeBox(roofs,W-2*f,.035,H-2*f,w.x,w.s,side,M.glass,.08);
        for(const dx of[-(W-f)/2,(W-f)/2])slopeBox(roofs,f,.12,H,w.x+dx,w.s,side,M.frame,.08);
        for(const ds of[-(H-f)/2,(H-f)/2])slopeBox(roofs,W,.12,f,w.x,w.s+ds,side,M.frame,.08);
        // Orange markers identify the estimated window positions even with the roof off.
        text(labels,'≈ Velux',w.x,C.levels.eaves+w.s*Math.sin(D.angle)+.2,side==='front'?w.s*Math.cos(D.angle):D.length-w.s*Math.cos(D.angle),'#a56925',.19);
      }
    }
    box(roofs,D.width,C.roof.flatThickness,D.length-2*D.run,D.width/2,C.levels.roofEdge-C.roof.flatThickness/2,D.length/2,M.bitumen);
    for(const x of [.04,D.width-.04])box(roofs,.08,.08,D.length-2*D.run,x,C.levels.roofEdge+.04,D.length/2,M.metal);
    // Schematic framing: exact member sections/spacing; end positions follow the model envelope.
    for(let z=D.run;z<=D.length-D.run+.001;z+=C.structure.spacing)
      box(framing,D.width,C.structure.flatRib[1],C.structure.flatRib[0],D.width/2,C.levels.ceiling+C.structure.flatRib[1]/2,z,M.wood);
    for(const z of [D.run,D.length-D.run])box(framing,D.width,.285,.038*C.structure.beamRibs,D.width/2,C.levels.ceiling+.1425,z,M.wood);
    for(let x=.019;x<D.width;x+=C.structure.spacing)for(const side of['front','rear'])
      slopeBox(framing,.038,.235,slopeLength,x,slopeLength/2,side,M.wood,-.14);
  }
  function makeStair(){
    stairsModel=new Group();shell.add(stairsModel);
    const s=D.stair, centreZ=(s.z0+s.z1)/2, axisX=s.x1;
    const straight=3, fanCount=C.stairs.treads-2*straight, going=C.stairs.goingDrawing;
    const fanHalf=(s.z1-s.z0)/2-straight*going;
    for(let i=0;i<C.stairs.treads;i++){
      let points;
      if(i<straight){
        const z=s.z1-i*going;points=[[s.x0,z],[s.x1,z],[s.x1,z-going],[s.x0,z-going]];
      }else if(i>=straight+fanCount){
        const z=centreZ-fanHalf-(i-straight-fanCount)*going;
        points=[[s.x0,z],[s.x1,z],[s.x1,z-going],[s.x0,z-going]];
      }else{
        const j=i-straight,a=Math.PI/2+j*Math.PI/fanCount,b=Math.PI/2+(j+1)*Math.PI/fanCount;
        points=[[axisX,centreZ],[axisX+Math.cos(a)*C.stairs.width,centreZ+Math.sin(a)*fanHalf],
          [axisX+Math.cos(b)*C.stairs.width,centreZ+Math.sin(b)*fanHalf]];
      }
      const tread=polygon(stairsModel,points,.045,M.wood);tread.rotation.x=Math.PI/2;
      tread.position.y=C.levels.firstFloor+(i+1)*D.rise;
    }
    const y=D.floor+C.stairs.railHeight;
    box(stairsModel,.035,.035,s.z1-s.z0,s.x1,y,centreZ,M.metal);
    for(let z=s.z0;z<=s.z1;z+=C.stairs.railSpacing)box(stairsModel,.018,C.stairs.railHeight,.018,s.x1,D.floor+C.stairs.railHeight/2,z,M.metal);
    text(labels,'≈ trap ↑',s.x0+.47,D.floor+.65,centreZ,'#a56925',.22);
  }
  function makeFurniture(){
    for(const r of D.rooms.filter(r=>r.id.startsWith('room'))){
      const x=r.x0+.65,z=r.id==='room3'?r.z0+1.15:r.z1-1.15;
      box(furniture,.90,.25,2,x,D.floor+.125,z,M.wood);box(furniture,.90,.16,2,x,D.floor+.33,z,M.bed);
      box(furniture,.90,.05,1.35,x,D.floor+.435,z-.20,M.linen);
      box(furniture,.70,.09,.40,x,D.floor+.44,z+.70,M.white);
    }
    const r=D.rooms.find(r=>r.id==='laundry');
    for(let i=0;i<2;i++){
      const z=r.z1-.30-i*.60;box(furniture,.60,.85,.60,r.x0+.32,D.floor+.425,z,M.white);
      const drum=new Mesh(new CylinderGeometry(.20,.20,.025,24),M.metal);
      drum.rotation.z=Math.PI/2;drum.position.set(r.x0+.63,D.floor+.43,z);furniture.add(drum);
    }
  }
  function dispose(group){if(!group)return;group.traverse(o=>{o.geometry?.dispose();if(o.isSprite){o.material.map?.dispose();o.material.dispose();}});legacy.Dn.remove(group);}
  function rebuild(){
    D=deriveDak(C,state.laundry);dispose(root);root=new Group();legacy.Dn.add(root);root.scale.x=-1;root.rotation.y=Math.PI/2;root.position.set(C.visual.contextSetback,0,-D.width/2);
    shell=new Group();labels=new Group();furniture=new Group();roofs=new Group();framing=new Group();context=new Group();
    root.add(shell,labels,furniture,roofs,framing,context);
    for(const r of D.rooms){
      box(shell,r.x1-r.x0,C.visual.floorThickness,r.z1-r.z0,(r.x0+r.x1)/2,D.floor-C.visual.floorThickness/2,(r.z0+r.z1)/2,floorM[r.id]);
      text(labels,r.name,(r.x0+r.x1)/2,D.floor+1.15,(r.z0+r.z1)/2);
      text(labels,`≈ ${fmt(r.x1-r.x0,2)} × ${fmt(r.z1-r.z0,2)} m`,(r.x0+r.x1)/2,D.floor+.87,(r.z0+r.z1)/2,'#6d7c74',.18);
    }
    exteriorWalls();
    wallX(D.x0,D.x1,D.z1+C.plan.crossWall/2,C.plan.crossWall,state.door?C.doors.leftDoorX:null);
    if(!state.door){
      // Door removal means an open doorway, as proposed in the architect's mail.
      const last=shell.children.pop();last.geometry.dispose();
      wallX(D.x0,D.x1,D.z1+C.plan.crossWall/2,C.plan.crossWall,C.doors.leftDoorX);
      const leaf=shell.children.pop();leaf.geometry.dispose();
    }
    wallX(D.x0,D.x1,D.z3+C.plan.crossWall/2,C.plan.crossWall,C.doors.leftDoorX);
    wallX(D.x2,D.x3,D.split,C.plan.crossWall);
    dividerDoor(D.z0,D.split-C.plan.crossWall/2,D.doors.room3);
    dividerDoor(D.split+C.plan.crossWall/2,D.z5,D.doors.room2);
    wallZ((D.x1+D.x2)/2,D.split-C.plan.crossWall/2,D.split+C.plan.crossWall/2,C.plan.divider);
    makeStair();makeRoof();makeFurniture();
    updateVisibility();updateUI();
  }
  function updateVisibility(){stairsModel.visible=!!legacy.state.binnen||false;roofs.visible=!legacy.state.binnen;labels.visible=true&&!!legacy.state.binnen;furniture.visible=$('permit-furniture').checked;framing.visible=$('permit-structure').checked;context.visible=false;}
  function updateUI(){
    $('permit-laundry').value=state.laundry;$('permit-laundry-value').textContent=fmt(state.laundry)+' m';
    const changed=Math.abs(state.laundry-C.plan.laundryDepth)>.0001||!state.door;
    $('permit-variant').textContent=changed?'Ontwerpvariant: overloop, trap en dwarswand schuiven mee.':'BE-1: gekozen interpretatie van de maatkettingen.';
    $('permit-rooms').innerHTML=D.rooms.map(r=>`<li><span class="w">${r.name}</span><span class="v">≈ ${fmt(r.x1-r.x0)} × ${fmt(r.z1-r.z0)} m<br><small>${fmt(r.area,2)} m² vloervlak${C.drawingAreas[r.id]!==undefined?' · BE-1: '+fmt(C.drawingAreas[r.id],1)+' m²':''}</small></span></li>`).join('');
  }

  function changeLaundry(value){state.laundry=Math.max(1.2,Math.min(2.8,Math.round(value*1000)/1000));rebuild();}
  $('permit-laundry').oninput=e=>changeLaundry(+e.target.value);
  $('permit-smaller').onclick=()=>changeLaundry(state.laundry-.1);
  $('permit-larger').onclick=()=>changeLaundry(state.laundry+.1);
  $('permit-reset').onclick=()=>{state.door=true;$('permit-door').checked=true;changeLaundry(C.plan.laundryDepth);};
  $('permit-door').onchange=e=>{state.door=e.target.checked;rebuild();};
  $('permit-cut').onchange=rebuild;
  $('permit-furniture').onchange=updateVisibility;
  $('permit-structure').onchange=updateVisibility;
  $('permit-sources').innerHTML=C.provenance.map(([kind,source,description])=>`<p><strong>${kind} · ${source}</strong><br>${description}</p>`).join('');
  $('permit-plan').onclick=()=>{legacy.state.opbouw=true;legacy.state.binnen=true;legacy.state.v1=false;
    for(const key of['opbouw','binnen','v1'])$('sw-'+key).checked=legacy.state[key];
    legacy.camera.position.set(C.visual.contextSetback+D.length/2,D.floor+13.5,.001);
    legacy.controls.target.set(C.visual.contextSetback+D.length/2,D.floor,0);legacy.controls.update();legacy.refresh();};
  rebuild();
  window.dakModel={get geometry(){return deriveDak(C,state.laundry);},get state(){return{...state,...legacy.state};},
    get stats(){let meshes=0,invalid=0;root.traverse(o=>{if(o.isMesh){meshes++;for(const v of o.geometry.attributes.position.array)if(!Number.isFinite(v))invalid++;}});return{meshes,invalid,geometries:legacy.renderer.info.memory.geometries};}};
  return {refresh:rebuild};
};
