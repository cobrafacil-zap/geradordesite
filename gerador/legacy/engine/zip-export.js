/* ==========================================================================
   ZIP EXPORT — Empacota arquivos reais em um ZIP para download
   ========================================================================== */

const ZipExport = (()=>{

  async function buildZIP(files, projectName){
    const zip = new JSZip();
    const folderName = slugify(projectName||'site');

    // add files
    for(const [path, content] of files.entries()){
      if(typeof content === 'string'){
        zip.file(`${folderName}/${path}`, content);
      } else {
        // base64 binary
        zip.file(`${folderName}/${path}`, content, {base64:true});
      }
    }

    const blob = await zip.generateAsync({
      type:'blob',
      compression:'DEFLATE',
      compressionOptions:{level:6}
    });
    return blob;
  }

  function slugify(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')||'site';}

  function downloadBlob(blob,filename){
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;a.download=filename;
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),5000);
  }

  // File tree HTML for preview
  function buildTree(files){
    const items=[];
    files.forEach((v,k)=>{
      const isDir=k.includes('/');
      const ext=k.split('.').pop();
      const cls = ext==='tsx'||ext==='ts'?'next':ext==='html'?'static':ext==='css'?'static':ext==='js'?'static':ext==='md'?'next':ext==='json'?'next':ext==='mjs'?'next':'';
      items.push(`<div class="${isDir?'dir':'file '+cls}">${k}</div>`);
    });
    return items.join('');
  }

  return {buildZIP,downloadBlob,buildTree,slugify};
})();
