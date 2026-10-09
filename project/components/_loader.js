/* Card-only helper: loads the component sources directly when the compiled bundle isn't present yet.
   Prefers window.ObsydianDS from _ds_bundle.js when available. */
(function () {
  // Order matters: a file comes after what it composes.
  var FILES = [
    'core/Interaction.jsx', 'core/Icon.jsx', 'core/Text.jsx', 'core/ShardMark.jsx', 'core/Logo.jsx', 'core/Splash.jsx',
    'feedback/Spinner.jsx', 'actions/Button.jsx', 'actions/Chip.jsx', 'inputs/Field.jsx',
    'feedback/Notice.jsx', 'content/Tag.jsx', 'content/Lists.jsx', 'content/Grid.jsx', 'content/Signal.jsx',
    'sections/Section.jsx', 'navigation/Nav.jsx', 'navigation/Footer.jsx', 'navigation/RouteProgress.jsx',
    'agent/AgentVisualizer.jsx'
  ];
  var HOOKS = 'const {useState,useRef,useEffect,useLayoutEffect,useMemo,useCallback,useId,useReducer}=React;\n';
  function findBundle() {
    try { if (window.ObsydianDS && window.ObsydianDS.Button) return window.ObsydianDS; } catch (e) {}
    return null;
  }
  window.loadDS = async function (base) {
    var b = findBundle(); if (b) { window.DS = b; return b; }
    var src = HOOKS;
    var texts = await Promise.all(FILES.map(function (f) { return fetch(base + f).then(function (r) { return r.ok ? r.text() : ''; }).catch(function () { return ''; }); }));
    texts.forEach(function (t) { src += t.replace(/^import[^\n]*$/mg, '').replace(/^export\s+(function|const|let)/mg, '$1') + '\n'; });
    var names = []; src.replace(/^(?:function|const|let)\s+([A-Za-z_]\w*)/mg, function (m, n) { if (names.indexOf(n) < 0) names.push(n); return m; });
    var code = Babel.transform(src + '\nwindow.DS={' + names.join(',') + '};', { presets: [['react', { runtime: 'classic' }]] }).code;
    (0, eval)(code);
    return window.DS;
  };
  /** Load DS from dsBase, then the kit's own screen files (relative to kitBase). Returns {...DS, ...screens}. */
  window.loadKit = async function (dsBase, kitBase, kitFiles) {
    var DS = await window.loadDS(dsBase);
    var texts = await Promise.all(kitFiles.map(function (f) { return fetch(kitBase + f).then(function (r) { return r.ok ? r.text() : ''; }).catch(function () { return ''; }); }));
    var src = '';
    texts.forEach(function (t) { src += t.replace(/^import[^\n]*$/mg, '').replace(/^export\s+(function|const|let)/mg, '$1') + '\n'; });
    var names = []; src.replace(/^(?:function|const|let)\s+([A-Za-z_]\w*)/mg, function (m, n) { if (names.indexOf(n) < 0) names.push(n); return m; });
    var pre = 'const {' + Object.keys(DS).join(',') + '}=window.DS;' + HOOKS;
    var code = Babel.transform(pre + src + '\nwindow.KIT={' + names.join(',') + '};', { presets: [['react', { runtime: 'classic' }]] }).code;
    (0, eval)(code);
    return Object.assign({}, DS, window.KIT);
  };
})();
