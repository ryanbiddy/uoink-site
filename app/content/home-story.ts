import { CANDIDATE_VERSION, PUBLISHED_VERSION } from "./release-status";

export const homeStory = `
<section class="story-hero" aria-labelledby="story-heading">
  <div class="container story-hero-grid">
    <div class="story-copy">
      <p class="eyebrow">Your sources. Your disk. Your AI.</p>
      <h1 id="story-heading">Save the good stuff.<br><em>Use it again.</em></h1>
      <p class="story-lede">Turn videos, podcasts and articles into a library you can search, read and give to your AI. Keep the words, the context and the link back to the source.</p>
      <div class="story-actions"><a class="btn primary large" href="/install">Get Uoink for Windows <span aria-hidden="true">↗</span></a><a class="story-text-link" href="#from-source">See how it works <span aria-hidden="true">↓</span></a></div>
      <p class="story-install-note">Free and open source · Windows 10/11<br>Local helper + browser extension</p>
    </div>
    <div class="story-source-stack" aria-label="Example of a source saved as a readable local file">
      <div class="story-source-tab"><span class="story-dot" aria-hidden="true"></span> One source, more than a bookmark <span>↓</span></div>
      <div class="story-source-file">
        <div class="story-file-top"><span>MY LIBRARY / research-note.md</span><span>EXAMPLE</span></div>
        <h2>The idea worth keeping.</h2>
        <p class="story-file-meta">Original URL · author · capture date</p>
        <div class="story-file-rule"></div>
        <p class="story-file-label">THE WORDS</p><p>Readable text, with timestamps when the source has them.</p>
        <p class="story-file-label">THE CONTEXT</p><p>Frames, comments and source details, where available.</p>
        <div class="story-file-bottom"><span>Saved on your computer</span><span>.md + .json</span></div>
      </div>
      <div class="story-handoff"><span>What next?</span><strong>Read it. Search it. Bring it into a chat.</strong><span aria-hidden="true">↗</span></div>
    </div>
  </div>
</section>
<section class="story-source-line" aria-label="Source types"><div class="container"><span>Bring your own rabbit hole.</span><p>YouTube <span>/</span> Podcasts <span>/</span> Articles <span>/</span> Threads</p><a href="/sources">Supported sources ↗</a></div></section>
<section class="section story-workflow" id="from-source" aria-labelledby="workflow-heading">
  <div class="container">
    <div class="story-section-heading"><span class="eyebrow">From watching to working</span><h2 id="workflow-heading">A useful idea deserves<br>more than another open tab.</h2></div>
    <div class="story-steps">
      <article><span class="story-step-number">01 / CAPTURE</span><h3>See something good? <br>Uoink it.</h3><p>Save a supported page from your browser. Uoink collects the available text and context into readable files.</p></article>
      <article><span class="story-step-number">02 / KEEP</span><h3>Find it when <br>you need it.</h3><p>Your library lives on your disk, with a local index for search. Open a saved source and pick up where you left off.</p></article>
      <article><span class="story-step-number">03 / USE</span><h3>Give your AI <br>something to work with.</h3><p>Copy a capture into Claude or ChatGPT. Connect a compatible local MCP client to read and search through Uoink’s tools.</p></article>
    </div>
  </div>
</section>
<section class="section story-library" aria-labelledby="library-heading">
  <div class="container">
    <div class="story-section-heading"><span class="eyebrow">All those “I should save this” moments</span><h2 id="library-heading">A library you can come back to.</h2><p>Keep source links alongside what you saved. Search the collection when a project, question or draft needs it.</p></div>
    <figure class="story-library-shot"><img src="/product/hero-library.webp" width="1440" height="900" loading="lazy" decoding="async" alt="A Uoink library with saved source cards, a search field and source filters." /><figcaption>A Uoink library view. Available details depend on the source and capture settings.</figcaption></figure>
  </div>
</section>
<section class="section story-ownership" aria-labelledby="ownership-heading"><div class="container story-ownership-grid">
  <div><span class="eyebrow">Keep control of the collection</span><h2 id="ownership-heading">Local files.<br><em>Useful anywhere.</em></h2></div>
  <div><p class="story-lede">Uoink stores captures on your computer. You choose what to export and which AI tools can read them.</p><p>Capturing contacts the source website. Enabled feed subscriptions can check for new items in the background. Optional AI features send the selected content to your provider using your key.</p><a class="story-text-link" href="/privacy">See what connects to the internet ↗</a></div>
</div></section>
<section class="section story-next" aria-labelledby="next-heading"><div class="container story-next-grid">
  <div><span class="story-preview-label">Next release / ${CANDIDATE_VERSION} / in testing</span><h2 id="next-heading">Find the moment.<br>Cite the source.</h2><p>The Living Library candidate adds clip search, evidence cards, source subscriptions and more library access over MCP. We’re testing the complete install-to-capture journey before making it the public download.</p></div>
  <div class="story-release-note"><span>AVAILABLE TODAY</span><strong>Uoink ${PUBLISHED_VERSION}</strong><p>The download still points to the published Windows release. The ${CANDIDATE_VERSION} candidate is not publicly released.</p><a class="story-text-link" href="/changelog">What’s released and what’s next ↗</a></div>
</div></section>
<section class="story-final"><div class="container"><span class="eyebrow">Keep the source. Start making.</span><h2>Found something good?</h2><a class="btn primary large" href="/install">Uoink it. Get the Windows app ↗</a><p>Free · MIT license · No Uoink account required</p></div></section>
`;
