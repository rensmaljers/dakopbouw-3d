const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const scope={window:{}};vm.createContext(scope);vm.runInContext(readFileSync(require('node:path').join(__dirname,'../src/config.js'),'utf8'),scope);
const c=scope.window.DAK_CONFIG,derive=scope.window.deriveDak;
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const d=derive(c);near(d.width,6.411);near(d.length,7.926);near(d.floor,5.47);
near(d.x3-d.x2,3.338);near(d.rooms[0].z1-d.rooms[0].z0,3.419);
assert.equal(d.rooms.filter(r=>r.id.startsWith('room')).length,3);
for(const depth of [1.2,1.921,2.2,2.8]){
 const v=derive(c,depth);
 near(v.z3-v.z2,1.880);near(v.stair.z1-v.stair.z0,1.880);
 near(v.rooms[0].area+v.rooms[3].area,d.rooms[0].area+d.rooms[3].area);
 for(const r of v.rooms){assert.ok(r.area>0);assert.ok(r.x0>=0&&r.x1<=v.width);assert.ok(r.z0>=0&&r.z1<=v.length);}
 for(const z of [v.doors.room3,v.doors.room2]){assert.ok(z-c.doors.width/2>=v.z2-.001);assert.ok(z+c.doors.width/2<=v.z3+.001);}
 assert.ok(v.doors.room3+c.doors.width/2<=v.split-c.plan.crossWall/2);
 assert.ok(v.doors.room2-c.doors.width/2>=v.split+c.plan.crossWall/2);
 near(v.split-d.split,depth-c.plan.laundryDepth);
 const roofLength=(c.levels.roofEdge-c.levels.eaves)/Math.sin(v.angle);
 for(const side of ['front','rear'])for(const w of c.windows[side]){
  assert.ok(w.x-c.windows.width/2>0&&w.x+c.windows.width/2<v.width);
  assert.ok(w.slopeFraction*roofLength-c.windows.height/2>0);
  assert.ok(w.slopeFraction*roofLength+c.windows.height/2<roofLength);
 }
}
assert.throws(()=>derive(c,NaN));assert.throws(()=>derive(c,4));
console.log('OK: maatkettingen, drie kamers, wasruimtevarianten, trapgat en dakramen.');
