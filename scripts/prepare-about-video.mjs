import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
import ffprobe from '@ffprobe-installer/ffprobe';

const source=path.resolve('public/Woman_typing_and_waving_hello_20260928201615.mp4');
const destination=path.resolve('public/demo');
const qa=path.resolve('test-results/about-video');
fs.mkdirSync(destination,{recursive:true});fs.mkdirSync(qa,{recursive:true});
const hash=()=>createHash('sha256').update(fs.readFileSync(source)).digest('hex');
const before=hash();
const probe=file=>JSON.parse(execFileSync(ffprobe.path,['-v','error','-show_streams','-show_format','-of','json',file],{encoding:'utf8'}));
const input=probe(source);
const output=path.join(destination,'about-hello.mp4');
execFileSync(ffmpeg.path,['-hide_banner','-loglevel','error','-y','-i',source,'-map','0:v:0','-an','-c:v','libx264','-preset','slow','-crf','24','-pix_fmt','yuv420p','-movflags','+faststart',output],{stdio:'inherit'});
const seconds=Number(input.format.duration);
// A smiling/waving moment, extracted from the actual footage (no generated image).
execFileSync(ffmpeg.path,['-hide_banner','-loglevel','error','-y','-ss',String(Math.max(0,seconds-0.8)),'-i',output,'-frames:v','1','-q:v','2',path.join(destination,'about-hello-poster.jpg')],{stdio:'inherit'});
// Review every half second at the original aspect ratio, including the final pose.
execFileSync(ffmpeg.path,['-hide_banner','-loglevel','error','-y','-i',output,'-vf','fps=2,scale=384:216,tile=4x4','-frames:v','1',path.join(qa,'contact-sheet.jpg')],{stdio:'inherit'});
const result=probe(output),video=result.streams.find(s=>s.codec_type==='video');
if(result.streams.some(s=>s.codec_type==='audio'))throw Error('Web copy still contains audio');
if(video.width!==1280||video.height!==720)throw Error('Unexpected crop or dimensions');
if(Math.abs(Number(result.format.duration)-seconds)>.1)throw Error('Unexpected duration change');
if(hash()!==before)throw Error('Original file changed');
const report={original:{name:path.basename(source),sha256:before,bytes:fs.statSync(source).size,duration:seconds,streams:input.streams.map(s=>({type:s.codec_type,codec:s.codec_name,width:s.width,height:s.height}))},web:{name:path.basename(output),bytes:fs.statSync(output).size,duration:Number(result.format.duration),width:video.width,height:video.height,audio:false},poster:{name:'about-hello-poster.jpg',time:seconds-.8},originalPreserved:true};
fs.writeFileSync(path.join(qa,'media-report.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
