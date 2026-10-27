export default function SanctuaryScene() {
  return <svg className="sanctuary-scene" viewBox="0 0 640 320" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="scene-sky" x2="0" y2="1"><stop stopColor="#1d292c" /><stop offset="1" stopColor="#101719" /></linearGradient>
      <linearGradient id="scene-stone" x2="1" y2="1"><stop stopColor="#334044" /><stop offset=".5" stopColor="#192326" /><stop offset="1" stopColor="#0c1315" /></linearGradient>
      <linearGradient id="scene-door" x2="0" y2="1"><stop stopColor="#c09e61" /><stop offset="1" stopColor="#493e2c" /></linearGradient>
      <radialGradient id="scene-glow"><stop stopColor="#dfb565" stopOpacity=".2" /><stop offset="1" stopColor="#dfb565" stopOpacity="0" /></radialGradient>
      <linearGradient id="scene-fade"><stop stopColor="#101618" stopOpacity="0" /><stop offset="1" stopColor="#101618" /></linearGradient>
    </defs>
    <path fill="url(#scene-sky)" d="M0 0h640v320H0Z" />
    <circle cx="507" cy="55" r="30" fill="#c5ccbd" opacity=".12" /><circle cx="497" cy="47" r="29" fill="#1c282c" />
    <path d="m0 215 88-79 42 29 84-105 63 89 50-44 88 71 57-86 58 77 64-23 46 54v122H0Z" fill="#253237" opacity=".45" />
    <path d="m0 275 70-72 52 16 74-47 73 45 67-21 65 30 70-22 61 41 108-22v97H0Z" fill="#10191c" />
    <circle cx="340" cy="180" r="130" fill="url(#scene-glow)" />
    <g stroke="#6b756c" strokeOpacity=".34" strokeWidth="1" fill="url(#scene-stone)">
      <path d="M180 270V116l22-37 22 37v154Zm-6-154 28-66 28 66Z M207 73V36l4-11 4 11v42" />
      <path d="M414 277V124l20-36 20 36v153Zm-6-153 26-64 26 64Z M429 77V43l5-14 5 14v34" />
      <path d="M224 276V150l40-30 37 26v130Z M366 276V146l26-25 22 29v126Z" />
      <path d="M276 283V104l60-65 60 65v179Z M269 108l67-85 67 85-67-59Z" />
      <path d="M312 72V37l24-37 24 37v35l-24-26Z" />
      <path d="M289 275v-91q0-46 47-85 47 39 47 85v91Zm11 0v-91q0-37 36-70 36 33 36 70v91Z" />
      <path d="M235 204v-42l15-17 15 17v42 M384 204v-42l12-17 12 17v42 M194 175v-36l8-16 8 16v36 M426 176v-35l8-16 8 16v35" fill="#10191a" />
      <path d="M317 275v-66q0-26 19-46 19 20 19 46v66Z" fill="url(#scene-door)" stroke="#b39a68" strokeOpacity=".8" />
      <path d="M336 164v111m-15-58h30 M312 272h48m-53 6h58m-64 6h70m-78 6h86" stroke="#c0a472" strokeOpacity=".52" />
      <path d="M271 140h20m90 0h20M277 152h14m90 0h14M223 230h54m119 0h19M202 270V192m232 80v-79" />
    </g>
    <g fill="none" stroke="#839286" strokeOpacity=".17"><path d="M0 287q120-40 243 0t245-7 152 0 M50 300q140-35 280 0t310-10 M285 55l-22-8m125 26 22-5" /></g>
    <path d="M0 285q190-10 270 20l66-23 72 38H0Z M640 265l-79-11-76 66h155Z" fill="#0e1517" />
    <rect y="240" width="640" height="80" fill="url(#scene-fade)" transform="rotate(90 320 280)" opacity=".1" />
  </svg>;
}
