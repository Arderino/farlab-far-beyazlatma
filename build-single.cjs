/* FarLab -> TEK self-contained HTML uretir.
   CSS, JS ve gorsel (data-URI) tek dosyaya gomulur; sunucusuz acilir, tek dosya yayinlanabilir. */
'use strict';
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const R = f => fs.readFileSync(path.join(DIR, f), 'utf8');
const B64 = f => fs.readFileSync(path.join(DIR, f)).toString('base64');

// script/style erken kapanmasin diye kacis
const safeJs  = s => s.replace(/<\/(script)/gi, '<\\/$1');
const safeCss = s => s.replace(/<\/(style)/gi, '<\\/$1');

const mainCss   = safeCss(R('assets/index-BjG4I1I8.css'));
const enhCss    = safeCss(R('enhance.css'));
// firma logosunu data-URI yap, enhance.js icindeki yer tutucuyu doldur
const firmaMime = (function(){ const b = fs.readFileSync(path.join(DIR,'fartech-logo.jpg')); return (b[0]===0xFF&&b[1]===0xD8)?'image/jpeg':(b[0]===0x89?'image/png':'application/octet-stream'); })();
const firmaData = 'data:' + firmaMime + ';base64,' + B64('fartech-logo.jpg');
let enhJsRaw    = R('enhance.js').split('__FIRMA_IMG__').join(firmaData);
const enhJs     = safeJs(enhJsRaw);

// gorseli data-URI yap (gercek turu sihirli baytlardan sniff et), bundle referansini degistir
function sniffMime(f) {
  const b = fs.readFileSync(path.join(DIR, f));
  if (b[0] === 0xFF && b[1] === 0xD8) return 'image/jpeg';
  if (b[0] === 0x89 && b[1] === 0x50) return 'image/png';
  if (b.slice(0, 4).toString() === 'RIFF') return 'image/webp';
  return 'application/octet-stream';
}
const imgMime = sniffMime('far-beyazlatma-kampanya.png');
const imgData = 'data:' + imgMime + ';base64,' + B64('far-beyazlatma-kampanya.png');
let bundleJs = R('assets/index-D8F6OuLR.js');
bundleJs = bundleJs.split('/far-beyazlatma-kampanya.png').join(imgData);
// Marka: FarLab -> FarTech ("far beyazlatma" kelimesine DOKUNMA)
bundleJs = bundleJs.split('`LAB`').join('`TECH`');   // logo: FAR|LAB -> FAR|TECH
bundleJs = bundleJs.split('FarLab').join('FarTech'); // aria-label + footer telif
bundleJs = safeJs(bundleJs);

const favData = 'data:image/svg+xml;base64,' + B64('favicon.svg');

const html = `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="${favData}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#050b11" />
    <meta name="description" content="Sararmis ve matlasmis araba farlarina temiz, net ve dogal gorunum kazandiran profesyonel far beyazlatma hizmeti." />
    <meta property="og:title" content="FarTech | Profesyonel Far Beyazlatma" />
    <meta property="og:description" content="Farlarin yenilensin, yolun aydinlansin. Kampanya fiyati 999 TL." />
    <meta property="og:type" content="website" />
    <title>FarTech | Profesyonel Far Beyazlatma</title>
    <style>${mainCss}</style>
    <style>${enhCss}</style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module">${bundleJs}</script>
    <script type="module">${enhJs}</script>
  </body>
</html>`;

// hem cift-tikla dosyasi hem de yayin dosyasi (index.html) ayni icerik
const outPath = path.join(DIR, 'FarLab-tek-dosya.html');
const indexPath = path.join(DIR, 'index.html');
fs.writeFileSync(outPath, html);
fs.writeFileSync(indexPath, html);
console.log(JSON.stringify({
  ok: true,
  cikti: [outPath, indexPath],
  gorselTuru: imgMime,
  boyutKB: Math.round(fs.statSync(outPath).size / 1024)
}, null, 2));
