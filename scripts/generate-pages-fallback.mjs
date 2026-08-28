import { readFileSync, writeFileSync } from "node:fs";

const basePath = process.env.BASE_PATH || "/";
const normalizedBase = basePath.replace(/\/$/, "");
const index = readFileSync("dist/index.html", "utf8");
const redirect = `<script>(function(){var base=${JSON.stringify(normalizedBase)};var path=window.location.pathname;var route=path.indexOf(base)===0?path.slice(base.length)||"/":path;if(!window.location.hash&&route!=="/")window.location.replace(base+"/#"+route+window.location.search)})();</script>`;

writeFileSync("dist/404.html", index.replace("</head>", `${redirect}</head>`));
