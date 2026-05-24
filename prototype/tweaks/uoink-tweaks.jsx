// uoink-tweaks.jsx — Tweaks panel for the homepage.
// Lets the reviewer flip mode, headline copy, Mac CTA hint and stamps in-browser.

const UOINK_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mode": "dark",
  "headline": "shit",
  "showMacCta": true,
  "showStamps": true,
  "showFinalCta": true
}/*EDITMODE-END*/;

const HEADLINES = {
  shit:     'Uoink that <em>shit.</em>',
  uoinkDoc: 'Uoink any video.<br/>Read it like <em>a doc.</em>',
  itReadIt: 'Uoink it. <em>Read it.</em>',
  yo:       'Yo. <em>Uoink that.</em>'
};

const HEADLINE_LABELS = {
  shit:     'Uoink that shit. ★ (homepage)',
  uoinkDoc: 'Uoink any video. Read it like a doc. (CWS-safe)',
  itReadIt: 'Uoink it. Read it. (safe playful)',
  yo:       'Yo. Uoink that. (Discord lean)'
};

function UoinkTweaks() {
  const [t, setTweak] = useTweaks(UOINK_TWEAK_DEFAULTS);

  // mode → body class
  React.useEffect(function () {
    const body = document.body;
    body.classList.remove('mode-dark', 'mode-light', 'mode-loud');
    body.classList.add('mode-' + t.mode);
  }, [t.mode]);

  // headline → swap innerHTML on [data-headline]
  React.useEffect(function () {
    const el = document.querySelector('[data-headline]');
    if (!el) return;
    el.innerHTML = HEADLINES[t.headline] || HEADLINES.uoinkDoc;
  }, [t.headline]);

  // mac cta — toggle .sub-cta visibility of "Mac v2.1" mention via class on body
  React.useEffect(function () {
    document.body.classList.toggle('hide-mac-cta', !t.showMacCta);
  }, [t.showMacCta]);

  // stamps — toggle corner-stamp visibility
  React.useEffect(function () {
    document.body.classList.toggle('hide-stamps', !t.showStamps);
  }, [t.showStamps]);

  // final CTA section
  React.useEffect(function () {
    document.body.classList.toggle('hide-final-cta', !t.showFinalCta);
  }, [t.showFinalCta]);

  return (
    <TweaksPanel title="Uoink tweaks">
      <TweakSection label="Mode" />
      <TweakRadio
        label="Volume"
        value={t.mode}
        options={[{value:'dark',label:'Dark'},{value:'loud',label:'Loud'},{value:'light',label:'Light'}]}
        onChange={(v) => setTweak('mode', v)}
      />

      <TweakSection label="Hero" />
      <TweakSelect
        label="Headline"
        value={t.headline}
        options={[
          {value:'shit',     label:HEADLINE_LABELS.shit},
          {value:'uoinkDoc', label:HEADLINE_LABELS.uoinkDoc},
          {value:'itReadIt', label:HEADLINE_LABELS.itReadIt},
          {value:'yo',       label:HEADLINE_LABELS.yo}
        ]}
        onChange={(v) => setTweak('headline', v)}
      />

      <TweakSection label="Display" />
      <TweakToggle label="Mac v2.1 hint" value={t.showMacCta}
                   onChange={(v) => setTweak('showMacCta', v)} />
      <TweakToggle label="Corner stamps" value={t.showStamps}
                   onChange={(v) => setTweak('showStamps', v)} />
      <TweakToggle label="Final CTA" value={t.showFinalCta}
                   onChange={(v) => setTweak('showFinalCta', v)} />
    </TweaksPanel>
  );
}

// mount when React + TweaksPanel are ready
(function mount() {
  if (typeof React === 'undefined' || typeof TweaksPanel === 'undefined') {
    setTimeout(mount, 50);
    return;
  }
  const root = ReactDOM.createRoot(document.getElementById('tweaks-root'));
  root.render(<UoinkTweaks />);
})();
