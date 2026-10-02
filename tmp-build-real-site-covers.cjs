const sharp = require("sharp");

const root = "C:/Users/USER/Desktop/portfolio-by-hassy";
const outDir = `${root}/public/demo`;

const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

function frame({ image, x, y, width, height, angle = 0, fit = "xMidYMid slice", radius = 24 }) {
  const data = image.toString("base64");
  const innerX = 18;
  const innerY = 62;
  const innerW = width - 36;
  const innerH = height - 80;
  return `<g transform="translate(${x} ${y}) rotate(${angle} ${width / 2} ${height / 2})">
    <defs><clipPath id="clip-${x}-${y}"><rect x="${innerX}" y="${innerY}" width="${innerW}" height="${innerH}" rx="${radius}"/></clipPath></defs>
    <rect x="0" y="0" width="${width}" height="${height}" rx="${radius + 6}" fill="#17152c" opacity="0.2" filter="url(#shadow)"/>
    <rect x="0" y="0" width="${width}" height="${height}" rx="${radius + 6}" fill="#ffffff"/>
    <rect x="0" y="0" width="${width}" height="58" rx="${radius + 6}" fill="#ffffff"/>
    <rect x="0" y="34" width="${width}" height="24" fill="#ffffff"/>
    <circle cx="30" cy="29" r="7" fill="#ff6f66"/><circle cx="54" cy="29" r="7" fill="#f8c951"/><circle cx="78" cy="29" r="7" fill="#9ba2a6"/>
    <rect x="${innerX}" y="${innerY}" width="${innerW}" height="${innerH}" rx="${radius}" fill="#f6f6f4"/>
    <image href="data:image/png;base64,${data}" x="${innerX}" y="${innerY}" width="${innerW}" height="${innerH}" preserveAspectRatio="${fit}" clip-path="url(#clip-${x}-${y})"/>
    <rect x="${innerX}" y="${innerY}" width="${innerW}" height="${innerH}" rx="${radius}" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.8"/>
  </g>`;
}

async function file(name) {
  return sharp(`${root}/${name}`).png().toBuffer();
}

async function writeCover(name, background, layers) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="960" viewBox="0 0 1600 960">
    <defs><filter id="shadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="20" stdDeviation="18" flood-color="#17152c" flood-opacity="0.2"/></filter></defs>
    <rect width="1600" height="960" fill="${background.base}"/>
    <path d="M-90 170 C230 20 460 60 690 220 C880 350 1040 260 1190 80 C1350 -100 1510 -20 1690 60 L1690 0 L-90 0Z" fill="${background.top}" opacity="0.72"/>
    <path d="M-90 890 C240 760 490 790 730 900 C970 1000 1260 850 1690 690 L1690 960 L-90 960Z" fill="#ffffff" opacity="0.44"/>
    ${layers.join("\n")}
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(`${outDir}/${name}`);
  console.log(`${outDir}/${name}`);
}

async function main() {
  const [hersite, academy, saqo, pheroblis, treaties, phaedrafilms] = await Promise.all([
    file("tmp-g3-hersite-fast.png"),
    file("tmp-academy.png"),
    file("tmp-saqo.png"),
    file("tmp-pheroblis.png"),
    file("tmp-treaties.png"),
    file("tmp-phaedrafilms.png"),
  ]);

  const academyDetail = await sharp(academy).extract({ left: 780, top: 170, width: 700, height: 720 }).png().toBuffer();
  const saqoDetail = await sharp(saqo).extract({ left: 700, top: 120, width: 800, height: 760 }).png().toBuffer();

  await writeCover("women-techmakers-sprint-cover-real.png", { base: "#eee8f7", top: "#f1d7c8" }, [
    frame({ image: hersite, x: 72, y: 64, width: 1200, height: 700, angle: -2, fit: "xMidYMid meet" }),
    frame({ image: treaties, x: 1040, y: 170, width: 430, height: 290, angle: 5, fit: "xMidYMid slice", radius: 20 }),
    frame({ image: pheroblis, x: 980, y: 500, width: 520, height: 340, angle: 4, fit: "xMidYMid slice", radius: 20 }),
    frame({ image: phaedrafilms, x: 1160, y: 650, width: 400, height: 260, angle: -4, fit: "xMidYMid slice", radius: 18 }),
  ]);

  await writeCover("g3women-academy-cover-real.png", { base: "#e5f0eb", top: "#d5e3f0" }, [
    frame({ image: academy, x: 72, y: 64, width: 1390, height: 760, angle: -2, fit: "xMidYMid meet" }),
    frame({ image: academyDetail, x: 1040, y: 520, width: 500, height: 330, angle: 4, fit: "xMidYMid slice", radius: 20 }),
  ]);

  await writeCover("saqo-frontend-cover-real.png", { base: "#f0e8da", top: "#dfe0f2" }, [
    frame({ image: saqo, x: 72, y: 64, width: 1390, height: 760, angle: -2, fit: "xMidYMid meet" }),
    frame({ image: saqoDetail, x: 1030, y: 520, width: 510, height: 340, angle: 4, fit: "xMidYMid slice", radius: 20 }),
  ]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
