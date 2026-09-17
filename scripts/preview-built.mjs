// Local preview of the generated route HTML, including extensionless URLs.
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve, relative, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.woff2':'font/woff2','.woff':'font/woff','.ico':'image/x-icon','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
export function createPreviewServer(directory){
 const root=resolve(directory);
 return createServer(async(req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});return res.end();}
  try{
   const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
   let target=resolve(root,'.'+pathname);
   const rel=relative(root,target);
   if(rel==='..'||rel.startsWith('..'+sep)||pathname.includes('\0')||pathname.includes('\\')){res.writeHead(400);return res.end();}
   let info=await stat(target).catch(()=>null),status=200;
   if(info?.isDirectory()){target=resolve(target,'index.html');info=await stat(target).catch(()=>null);}
   if(!info?.isFile()){status=404;target=resolve(root,'404.html');info=await stat(target).catch(()=>null);}
   if(!info?.isFile()){res.writeHead(404);return res.end('Not found');}
   res.writeHead(status,{'Content-Type':mime[extname(target)]||'application/octet-stream','Content-Length':info.size,'Cache-Control':'no-store'});
   if(req.method==='HEAD')return res.end();
   const stream=createReadStream(target);stream.on('error',()=>res.destroy());stream.pipe(res);
  }catch{if(!res.headersSent)res.writeHead(400);res.end();}
 });
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const {values}=parseArgs({options:{root:{type:'string'},host:{type:'string',default:'127.0.0.1'},port:{type:'string',default:'5173'},strictPort:{type:'boolean'}}});
 if(values.host!=='127.0.0.1'&&values.host!=='localhost')throw new Error('This review server is local only. Use 127.0.0.1.');
 const root=values.root?resolve(values.root):fileURLToPath(new URL('../dist/',import.meta.url));
 const server=createPreviewServer(root);server.on('error',error=>{console.error(error.message);process.exitCode=1;});
 server.listen(Number(values.port),values.host,()=>console.log('Local built preview: http://'+values.host+':'+values.port+' | '+root));
}
