const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
require('node:fs').mkdirSync('test-results',{recursive:true});
(async()=>{
 const b=await chromium.launch({headless:true,...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{})});
 const p=await b.newPage({viewport:{width:1440,height:1000}}),errors=[];
 p.on('pageerror',e=>errors.push(e.stack));
 await p.goto('http://127.0.0.1:4173');await p.waitForTimeout(800);
 assert.equal(await p.locator('#merk h1').textContent(),'Dakopbouw in 3D');
 assert.equal(await p.locator('.mat-rij').count(),7);
 assert.equal(await p.evaluate(()=>dakModel.geometry.rooms.filter(r=>r.id.startsWith('room')).length),3);
 await p.screenshot({path:'test-results/original-outside.png'});
 for(const id of['v-straat','v-voor','v-tuin','v-lucht']){await p.click('#'+id);await p.waitForTimeout(1000);}
 await p.locator('#sw-binnen').check();await p.waitForTimeout(1100);await p.screenshot({path:'test-results/original-inside.png'});
 for(const value of['1.2','2.8','1.921']){
  await p.locator('#permit-laundry').fill(value);await p.locator('#permit-laundry').dispatchEvent('input');
  const data=await p.evaluate(()=>({g:dakModel.geometry,s:dakModel.stats}));assert.equal(data.s.invalid,0);
  assert.ok(Math.abs(data.g.z1-data.g.z0-Number(value))<1e-8);
  for(const z of Object.values(data.g.doors)){assert.ok(z-.415>=data.g.z2);assert.ok(z+.415<=data.g.z3);}
 }
 await p.locator('#permit-door').uncheck();assert.match(await p.locator('#permit-variant').textContent(),/Ontwerpvariant/);
 await p.click('#permit-reset');assert.equal(await p.locator('#permit-laundry').inputValue(),'1.921');assert.ok(await p.locator('#permit-door').isChecked());
 for(const id of['permit-cut','permit-furniture','permit-structure']){await p.locator('#'+id).check();await p.locator('#'+id).uncheck();}
 await p.locator('#permit-cut').check();await p.locator('#permit-furniture').check();
 await p.click('#permit-plan');await p.waitForTimeout(300);await p.screenshot({path:'test-results/original-plan.png'});
 await p.waitForTimeout(200);const before=await p.evaluate(()=>dakModel.stats.geometries);
 for(let i=0;i<6;i++){await p.click('#permit-larger');await p.click('#permit-smaller');}
 await p.waitForTimeout(200);assert.ok((await p.evaluate(()=>dakModel.stats.geometries))<=before+3);
 for(const id of['sw-maat','sw-kaart','sw-draai','sw-licht','sw-v1']){await p.locator('#'+id).check();await p.locator('#'+id).uncheck();}
 await p.locator('#sw-binnen').uncheck();await p.locator('#sw-panelen').uncheck();await p.locator('#sw-panelen').check();
 await p.locator('#sw-opbouw').uncheck();await p.locator('#sw-opbouw').check();
 await p.click('[data-s=winter]');await p.locator('#zon-uur').fill('10');await p.locator('#zon-uur').dispatchEvent('input');assert.equal(await p.locator('#zon-tijd').textContent(),'10:00');
 await p.click('[data-m=pan]');assert.ok(await p.locator('[data-m=pan]').evaluate(e=>e.classList.contains('vast')));await p.click('[data-m=pan]');
 await p.locator('#sw-binnen').check();await p.waitForTimeout(1100);
 await p.locator('#paneel .inhoud').evaluate(e=>e.scrollTop=0);
 await p.setViewportSize({width:390,height:844});await p.waitForTimeout(300);await p.screenshot({path:'test-results/original-mobile.png'});
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 if(errors.length)throw Error(errors.join('\n'));
 console.log('PASS: oorspronkelijke UI, vier camerastanden, alle lagen, zon, materiaalkeuze, 3 kamers, wasruimtevarianten, reset, mobiele weergave en stabiele geometrie.');
 await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
