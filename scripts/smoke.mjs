import assert from 'node:assert/strict';
const base=process.env.TEST_BASE_URL||'http://localhost:3100';
const routes=[['/',200],['/projects/frontend',200],['/projects/data-analysis',200],['/projects/sample-dashboard',200],['/articles',200],['/articles/sample-notebook',200],['/admin/login',200],['/admin/demo',200],['/admin/preview',307],['/projects/missing',404],['/articles/missing',404],['/api/media/00000000-0000-4000-8000-000000000000',404]];
for(const [path,status] of routes){const response=await fetch(base+path,{redirect:'manual'});assert.equal(response.status,status,path);console.log(`${status} ${path}`);}
const home=await (await fetch(base)).text();assert.match(home,/Front End Engineering/);assert.match(home,/Data Analysis/);assert.match(home,/Sample content/);assert.ok(!home.includes('tegapeace88'));
const sitemap=await(await fetch(base+'/sitemap.xml')).text();assert.ok(sitemap.includes('/projects/frontend'));assert.ok(sitemap.includes('/projects/data-analysis'));assert.ok(!sitemap.includes('/admin'));
const contact=await fetch(base+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:JSON.stringify({name:'Smoke test',email:'test@example.com',message:'This must not be reported as persisted in demo mode.'})});assert.equal(contact.status,503);assert.match((await contact.json()).message,/not configured/);
console.log('Demo HTTP smoke checks passed; no contact message was persisted.');
