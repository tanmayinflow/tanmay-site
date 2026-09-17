import { MobileVajra } from './MobileVajra';

// Fine contour and hatching strokes echo the line weight of the supplied vajra.
// The vajra remains the original, unaltered bitmap through its alpha mask.
export function MobileAnchorIcon({kind}:{kind:number}) {
  if(kind===1)return <MobileVajra className="m7-anchor-icon m8-anchor-vajra"/>;
  return <svg className={'m7-anchor-icon m9-anchor-engraving '+(kind===0?'m9-anchor-mountain':'m9-anchor-leaf')}
    viewBox="0 0 96 96" fill="none" aria-hidden="true" focusable="false">
    <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      {kind===0?<>
        <g strokeWidth="1.6">
          <path d="M5 70 14 55l5 1 10-20 5-1 9-19 10 12 7 7 11 20 7 3 12 14"/>
          <path d="m54 28 9-15 7 13 5 2 8 17 4 2 6 20"/>
          <path d="m43 16-4 16 3 7-6 12 6 12-1 10M63 13l1 15-4 7M29 36l5 10-5 12-5 7"/>
          <path d="M4 74c10-3 15-1 24-2 10-1 14 3 24 1s17 0 23 2c6 2 12 1 17 0"/>
        </g>
        <g strokeWidth="1.05">
          <path d="m39 32-5 3m8 4 8 3-4-9 8 8m-18 9-8 12m14 1 7-7 9 8m-29-6-9 7m40-30 5 14-4 2 9 15m-6-38 7 7 6 14-4 2 5 7"/>
          <path d="m35 39-9 18m9-12-3 10m6-12-5 16m2-1-2 9m7-8 3 8m2-23 4 5m0-9 6 11m-1-6 9 15m-10-6 5 6m-8-10 4 12m8-6 3 8m-10-1 3 4"/>
          <path d="m20 58-4 7m3-3-2 5m7-15-3 8m48-21 5 10m-3-7 7 17m1-8 5 10m-7-3 5 8m4-5 3 7m-26-47 2 6m7 7 4 5"/>
          <path d="M10 78c7-2 14-1 20-1m8 1c7 0 11 2 17 0m7 1c8-1 14 1 22 1M18 82l7-1m23 2 8-1m14 1 6 1"/>
        </g>
      </>:<>
        <g strokeWidth="1.6">
          <path d="M24 69C11 55 15 37 29 27c14-10 31-8 49-19 2 13 1 29-8 42C58 67 41 78 24 69Z"/>
          <path d="M14 86c11-17 23-30 38-44C65 30 72 18 78 8M18 85l10-15"/>
        </g>
        <g strokeWidth="1.05">
          <path d="M26 70c-3-12-3-23 3-34m5 25c-3-11-1-19 4-29m5 20c-1-9 2-16 7-24m1 16c1-8 5-14 9-19m0 10 8-14"/>
          <path d="M29 65c10 1 17-2 25-7M37 57c12 0 19-5 28-12M46 49c11-1 20-7 26-15M54 40c10-3 17-8 22-15M63 29l13-10"/>
          <path d="m25 60-5-7m5 1-4-8m6-1-3-6m10 12-4-7m6 0-3-6m10 4-3-6m6-2-1-6m8 8-1-6m8-2 1-6"/>
          <path d="m36 65 2 5m5-7 2 4m0-11 5 4m3-7 5 2m-2-12 5 2m2-7 5 2m-2-9 6 1"/>
          <path d="M20 49c0-7 3-13 8-17M37 28c8-4 16-5 24-9M40 71c11-3 20-10 26-18M74 32c3-6 3-11 3-16"/>
        </g>
      </>}
    </g>
  </svg>;
}
