/* Alle lengtes in meter. x = vanaf de buurzijde; z = vanaf voorgevel.
 * Elke niet eenduidige waarde heeft een herkomst hieronder. */
window.DAK_CONFIG = {
  revision: 'BE-1 t/m BE-3: wijziging a, 22-09-2026; BE-4: 09-09-2026',
  plan: { widthInside: 5.959, sideNeighbour: .239, sideStreet: .213,
    length: 7.926, endWall: .239, rightEndWall: .275, leftWidth: 2.485, divider: .136,
    crossWall: .114, laundryDepth: 1.921, landingDepth: 1.880,
    rightSplitFromFront: .275 + 2.847 + .114 / 2 },
  levels: { firstFloor: 2.800, slabTop: 5.420, screed: .050,
    eaves: 6.200, ceiling: 8.030, roofEdge: 8.720 },
  roof: { angleDegrees: 55, kneeHeightDrawing: 1.132, thickness: .30, flatThickness: .36 },
  windows: { width: 1.140, height: 1.180,
    // Harten uit verhouding BE-1 dakaanzicht, dus schattingen; geen maatlabels.
    front: [{ x: 1.43, slopeFraction: .52 }, { x: 4.07, slopeFraction: .52 }],
    rear: [{ x: 1.58, slopeFraction: .52 }, { x: 4.77, slopeFraction: .52 }] },
  stairs: { width: .940, treads: 12, landingTread: 1, riseDrawing: .200,
    goingDrawing: .190, nosing: .040, railHeight: .900, railSpacing: .100 },
  doors: { width: .830, height: 2.10, leftDoorX: 1.80, rightDoorGap: .13 },
  visual: { floorThickness: .08, frame: .065, doorThickness: .035,
    surfaceOffset: .002, cutHeight: .90, contextLength: 9.40, contextSetback: .737 },
  structure: { roofRib: [.038,.235], flatRib: [.038,.285], spacing: .600,
    beamRibs: 5, wallRib: [.038,.184], plasterboard: .0125 },
  drawingAreas: { room1: 5.2, room2: 11, room3: 5.8 },
  provenance: [
    ['Maat', 'BE-1', 'Binnenbreedte 5.959; lengte opbouw 7.926; wasruimte 1.921; overloop 1.880; scheidingswanden dwars 114 mm.'],
    ['Keuze / tegenstrijdig', 'BE-1', 'Onderste breedteketting 2.485 + 136 + 3.338 = 5.959 is gevolgd. Bovenaan staat 2.000 + 114 + 3.845 = 5.959. De getekende wand past bij de onderste ketting.'],
    ['Afgeleid / onzeker', 'BE-1', 'Zijwanden 239 en 213 mm; kopwanden links 239 en rechts 275 mm. Rechter dwarswand begint op 275 + 2.847 = 3.122 m; 114 mm dikte is bij de maat 4.529 inbegrepen. Dit is een interpretatie van de ketting zonder afzonderlijke wanddikte.'],
    ['Maat / tegenstrijdig', 'BE-2/3', 'Peilen 2.800, 5.420, 6.200, 8.030 en 8.720 zijn gevolgd; afwerkvloer 50 mm toegevoegd. Vrije hoogte hierdoor 2.560 m. De losse maat 2.425 en borstweringmaat 1.132 sluiten niet rechtstreeks aan. Laat deze interpretatie bevestigen.'],
    ['Maat', 'BE-1/2', 'Dakhelling 55°; vier Velux GPL SK06 1.140 × 1.180 m, wit, triple glas.'],
    ['Schatting', 'BE-1', 'Alle Velux-hartposities en de positie op de helling zijn visueel uit het dakaanzicht gemeten. De tekeningen geven hiervoor geen maatketting.'],
    ['Maat + schematisch', 'BE-1/2/4', 'Trap met draai zoals op BE-1, 12 treden + 1 weltrede. Tekening: optrede 200, aantrede 190, wel 40 mm; trapbreedte 940 mm. Trapgat en verdeling van de draai zijn geïnterpreteerd. Optrede in het model sluit aan op de gekozen vloerpeilen en wijkt af van 200 mm.'],
    ['Schatting', 'BE-1', 'Deurposities en deurhoogte 2.10 m; breedte 830 mm staat op BE-1. Meubels en apparaten zijn uitsluitend schaalobjecten.'],
    ['Schatting', 'BE-2/3', 'Schuindakdikte 300 mm en platdakpakket 360 mm zijn visuele vereenvoudigingen. De terugligging en lengte van het bestaande huis zijn uit het zijaanzicht geschat; context is geen ingemeten bestaand model.'],
    ['Maat', 'BE-3/4', 'Smeervloer 50 mm; dakribben 38×235 h.o.h. 600; platdakribben 38×285 h.o.h. 600, draagbalk 5 ribben. Twee lagen bitumen; Monier Tuile Plat zwart vol donker. Rc ≥6,3 staat op BE-3; elders op hetzelfde blad staat nog Rc=6.'],
    ['Onbepaald', 'BE-1/3', 'Dakafschot staat als richting ingetekend; hellingsmaat en overstorthoogte ontbreken. Plat dak horizontaal weergegeven. Geen verzonnen afvoerhoogtes.'],
    ['Tekeninglabel', 'BE-1', '5,2 / 11 / 5,8 m² zijn overgenomen labels. Berekende vloervlakken in dit model zijn geometrisch en geen NEN 2580-oppervlakten.']
  ]
};
(function (root) {
  function derive(c, laundryDepth=c.plan.laundryDepth) {
    const p=c.plan, l=c.levels;
    if (!Number.isFinite(laundryDepth) || laundryDepth<1.2 || laundryDepth>2.8) throw new RangeError('Wasruimtediepte moet tussen 1,20 en 2,80 m liggen.');
    const width=p.sideNeighbour+p.widthInside+p.sideStreet;
    const x0=p.sideNeighbour, x1=x0+p.leftWidth, x2=x1+p.divider, x3=width-p.sideStreet;
    const z0=p.endWall, z1=z0+laundryDepth, z2=z1+p.crossWall,
      z3=z2+p.landingDepth, z4=z3+p.crossWall, z5=p.length-p.endWall;
    const split=p.rightSplitFromFront+(laundryDepth-p.laundryDepth);
    const floor=l.slabTop+l.screed;
    const angle=c.roof.angleDegrees*Math.PI/180;
    const run=(l.roofEdge-l.eaves)/Math.tan(angle);
    const rooms=[
      {id:'room1',name:'Kamer 1',x0,x1,z0:z4,z1:z5,color:0xc2d9cb},
      {id:'room2',name:'Kamer 2',x0:x2,x1:x3,z0:split+p.crossWall/2,z1:p.length-p.rightEndWall,color:0xe8d7b4},
      {id:'room3',name:'Kamer 3',x0:x2,x1:x3,z0:p.rightEndWall,z1:split-p.crossWall/2,color:0xc7d7e5},
      {id:'laundry',name:'Wasruimte',x0,x1,z0,z1,color:0xd8cbe3},
      {id:'landing',name:'Overloop',x0:x0+c.stairs.width,x1,z0:z2,z1:z3,color:0xe4e2d8}
    ];
    rooms.forEach(r=>r.area=(r.x1-r.x0)*(r.z1-r.z0));
    return {width,length:p.length,x0,x1,x2,x3,z0,z1,z2,z3,z4,z5,split,floor,angle,run,rooms,
      stair:{x0,x1:x0+c.stairs.width,z0:z2,z1:z3},
      doors:{room3:(z2+split-p.crossWall/2)/2,room2:(split+p.crossWall/2+z3)/2},
      rise:(floor-l.firstFloor)/(c.stairs.treads+c.stairs.landingTread)};
  }
  root.deriveDak=derive;
})(typeof window==='undefined'?globalThis:window);
