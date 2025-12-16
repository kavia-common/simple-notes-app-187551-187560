 // PUBLIC_INTERFACE
 export function renderMarkdownToHtml(markdownText) {
   /**
    * Very lightweight markdown renderer for a safe preview without extra deps.
    * Supports: headings (# to ######), bold **text**, italic *text*, inline code `code`,
    * links [text](url). Escapes HTML to prevent XSS then transforms.
    * Note: This is intentionally minimal to avoid adding dependencies.
    */
   const text = String(markdownText ?? '');

   // Escape HTML entities first
   const escape = (s) =>
     s
       .replace(/&/g, '&amp;')
       .replace(/</g, '&lt;')
       .replace(/>/g, '&gt;');

   let html = escape(text);

   // Inline code
   html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

   // Bold and italic
   html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
   html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

   // Links [text](url)
   html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

   // Headings at start of lines
   html = html.replace(/^###### (.*)$/gm, '<h6>$1</h6>');
   html = html.replace(/^##### (.*)$/gm, '<h5>$1</h5>');
   html = html.replace(/^#### (.*)$/gm, '<h4>$1</h4>');
   html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>');
   html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>');
   html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>');

   // Paragraphs: split by blank lines and wrap
   const blocks = html.split(/\n{2,}/).map((blk) => {
     // preserve single newlines as <br/>
     const withBreaks = blk.replace(/\n/g, '<br/>');
     // if already contains a heading tag, don't wrap in p
     if (/^<h[1-6]>/.test(withBreaks)) return withBreaks;
     return `<p>${withBreaks}</p>`;
   });

   return blocks.join('\n');
 }
