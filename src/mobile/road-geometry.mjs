/** Open perspective bend. Both edges share each horizontal station, avoiding
 * offset-curve loops while the width projected on the centreline normal grows. */
export function roadPair({x,y,height,bend}, startWidth, endWidth, samples = 64) {
  const edges = [[], []];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const cx=x+bend*Math.sin(Math.PI*t),cy=y+height*t;
    const slope=bend*Math.PI*Math.cos(Math.PI*t)/height;
    const half=(startWidth+(endWidth-startWidth)*t)*Math.hypot(1,slope)/2;
    edges[0].push([cx-half,cy]); edges[1].push([cx+half,cy]);
  }
  return edges;
}
export const roadPath = points => points.map(([x,y],i)=>`${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
