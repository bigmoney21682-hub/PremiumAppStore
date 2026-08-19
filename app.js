/* =========================================================================
   Premium App Store — grid, detail sheet, share sheet.
   ========================================================================= */
(function () {
  'use strict';

  var CATALOG = window.CATALOG || [];
  var SHOT_EXTS = ['png', 'jpg', 'webp'];   // tried in order, per screenshot
  var SHOT_COUNT = 3;

  var $ = function (id) { return document.getElementById(id); };

  var shelf        = $('shelf');
  var overlay      = $('overlay');
  var sheet        = $('sheet');
  var shareOverlay = $('shareOverlay');
  var toastEl      = $('toast');

  var current = null;      // app currently shown in the sheet
  var lastFocus = null;    // element to restore focus to on close
  var pushed = false;      // whether the sheet added a history entry

  /* ------------------------------------------------------------ helpers */

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  var toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2000);
  }

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // file:// and other non-secure contexts land here
    return new Promise(function (resolve, reject) {
      var ta = el('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error('copy failed'));
    });
  }

  /* --------------------------------------------------------------- grid */

  function buildGrid() {
    var total = 0;

    CATALOG.forEach(function (cat) {
      var section = el('section', 'category');

      var head = el('div', 'cat-head');
      head.appendChild(el('h2', 'cat-name', cat.category));
      if (cat.blurb) head.appendChild(el('p', 'cat-blurb', cat.blurb));
      section.appendChild(head);
      section.appendChild(el('div', 'cat-rule'));

      var grid = el('div', 'grid');

      cat.apps.forEach(function (app) {
        app._category = cat.category;
        total++;

        var btn = el('button', 'app' + (app.soon ? ' soon' : ''));
        btn.type = 'button';
        btn.setAttribute('aria-label', app.name + (app.soon ? ' — not public yet' : ' — view details'));

        var iconBox = el('div', 'app-icon');
        if (app.soon) iconBox.appendChild(el('span', 'soon-badge', 'Soon'));
        var img = el('img');
        img.src = app.icon;
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';
        iconBox.appendChild(img);

        btn.appendChild(iconBox);
        btn.appendChild(el('div', 'app-name', app.name));
        btn.addEventListener('click', function () { openSheet(app, btn); });

        grid.appendChild(btn);
      });

      section.appendChild(grid);
      shelf.appendChild(section);
    });

    $('appCount').textContent = total;
  }

  /* -------------------------------------------------- screenshot loading
     Tries assets/screenshots/<slug>/1.png, then .jpg, .jpeg, .webp.
     If none resolve, leaves a placeholder naming the exact path to drop
     the file at.                                                        */

  function shotTile(app, n) {
    var tile = el('div', 'shot');
    var attempt = 0;

    var img = el('img');
    img.alt = app.name + ' screenshot ' + n;
    img.loading = 'lazy';
    img.decoding = 'async';

    img.addEventListener('error', function () {
      attempt++;
      if (attempt < SHOT_EXTS.length) {
        img.src = 'assets/screenshots/' + app.slug + '/' + n + '.' + SHOT_EXTS[attempt];
      } else {
        placeholder(tile, app, n);
      }
    });

    img.addEventListener('click', function () { lightbox(img.src, img.alt); });

    tile.appendChild(img);
    img.src = 'assets/screenshots/' + app.slug + '/' + n + '.' + SHOT_EXTS[0];
    return tile;
  }

  function placeholder(tile, app, n) {
    tile.innerHTML = '';
    tile.className = 'shot empty';
    tile.appendChild(el('div', 'ph-num', String(n)));
    tile.appendChild(el('div', 'ph-label', 'Drop screenshot here'));
    tile.appendChild(el('div', 'ph-path', 'assets/screenshots/' + app.slug + '/' + n + '.png'));
  }

  function lightbox(src, alt) {
    var box = el('div', 'lightbox');
    var big = el('img');
    big.src = src;
    big.alt = alt;
    box.appendChild(big);
    box.addEventListener('click', function () { box.remove(); });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { box.remove(); document.removeEventListener('keydown', esc); }
    });
    document.body.appendChild(box);
  }

  /* -------------------------------------------------------- detail sheet */

  function openSheet(app, origin) {
    var wasOpen = !overlay.hidden;
    current = app;
    lastFocus = origin || document.activeElement;

    // give every app its own address, so a sheet can be linked to directly
    // and the back button closes it
    if (wasOpen || pushed) history.replaceState({ slug: app.slug }, '', '#' + app.slug);
    else { history.pushState({ slug: app.slug }, '', '#' + app.slug); pushed = true; }

    $('sheetIcon').innerHTML = '';
    var icon = el('img');
    icon.src = app.icon;
    icon.alt = '';
    $('sheetIcon').appendChild(icon);

    $('sheetTitle').textContent   = app.name;
    $('sheetTagline').textContent = app.tagline || '';
    $('sheetCat').textContent     = app._category || '';
    $('sheetDesc').textContent    = app.description || '';

    var note = $('sheetNote');
    if (app.note) { note.textContent = app.note; note.hidden = false; }
    else { note.textContent = ''; note.hidden = true; }

    // an app with no public address yet: no link to open, nothing to share
    var open = $('btnOpen');
    var share = $('btnShare');
    var chip = $('urlChip');

    if (app.soon) {
      open.removeAttribute('href');
      open.setAttribute('aria-disabled', 'true');
      open.querySelector('span').textContent = 'Not public yet';
      share.disabled = true;
      chip.disabled = true;
      $('urlChipText').textContent = 'No public address yet';
      chip.querySelector('.urlchip-copy').textContent = 'Soon';
    } else {
      open.href = app.url;
      open.removeAttribute('aria-disabled');
      open.querySelector('span').textContent = 'Open App';
      share.disabled = false;
      chip.disabled = false;
      $('urlChipText').textContent = app.url;
      chip.querySelector('.urlchip-copy').textContent = 'Copy';
    }
    sheet.classList.toggle('is-soon', !!app.soon);

    var shots = $('sheetShots');
    shots.innerHTML = '';
    for (var i = 1; i <= SHOT_COUNT; i++) shots.appendChild(shotTile(app, i));

    overlay.hidden = false;
    document.body.classList.add('locked');
    sheet.querySelector('.sheet-scroll').scrollTop = 0;
    sheet.focus();
  }

  // closeSheet unwinds history (so Back behaves); hideSheet does the DOM work
  function closeSheet() {
    if (pushed) { pushed = false; history.back(); return; }
    hideSheet();
  }

  function hideSheet() {
    overlay.hidden = true;
    if (shareOverlay.hidden) document.body.classList.remove('locked');
    current = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function appBySlug(slug) {
    for (var i = 0; i < CATALOG.length; i++) {
      var list = CATALOG[i].apps;
      for (var j = 0; j < list.length; j++) if (list[j].slug === slug) return list[j];
    }
    return null;
  }

  function syncToHash() {
    var slug = (location.hash || '').replace(/^#/, '');
    var app = slug ? appBySlug(slug) : null;
    if (app) openSheet(app, null);
    else if (!overlay.hidden) hideSheet();
  }

  /* --------------------------------------------------------- share sheet */

  var SHARE_TARGETS = [
    {
      key: 'copy', label: 'Copy Link', primary: true,
      icon: '<rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M15 6.5V5.5A1.5 1.5 0 0 0 13.5 4h-8A1.5 1.5 0 0 0 4 5.5v8A1.5 1.5 0 0 0 5.5 15h1"/>',
      run: function (a) {
        copy(a.url)
          .then(function () { toast('Link copied'); closeShare(); })
          .catch(function () { toast('Could not copy — long-press the address to copy'); });
      }
    },
    {
      key: 'mail', label: 'Mail',
      icon: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.6 6.5 12 13l8.4-6.5"/>',
      run: function (a) {
        go('mailto:?subject=' + enc(a.name) + '&body=' + enc(a.name + ' — ' + (a.tagline || '') + '\n\n' + a.url));
      }
    },
    {
      key: 'sms', label: 'Message',
      icon: '<path d="M21 12a8 8 0 0 1-8 8H7l-4 3 1.2-4.4A8 8 0 1 1 21 12Z"/>',
      run: function (a) { go('sms:?&body=' + enc(a.name + ' — ' + a.url)); }
    },
    {
      key: 'whatsapp', label: 'WhatsApp',
      icon: '<path d="M20 12a8 8 0 0 1-11.9 7L4 20l1.1-3.9A8 8 0 1 1 20 12Z"/><path d="M9.2 9.4c.5 1.9 2 3.4 3.9 3.9l1-1.1 1.6.8v1.3c-2.9.5-6-2.6-5.5-5.5h1.3l.8 1.6-1.1 1"/>',
      run: function (a) { go('https://wa.me/?text=' + enc(a.name + ' — ' + a.url)); }
    },
    {
      key: 'x', label: 'X',
      icon: '<path d="M4 4l16 16M20 4L4 20"/>',
      run: function (a) {
        go('https://twitter.com/intent/tweet?text=' + enc(a.name + ' — ' + (a.tagline || '')) + '&url=' + enc(a.url));
      }
    },
    {
      key: 'facebook', label: 'Facebook',
      icon: '<path d="M15 4h-2.2A3.8 3.8 0 0 0 9 7.8V10H7v3h2v7h3.2v-7H15l.6-3h-3.4V8.2c0-.7.5-1.2 1.2-1.2H15Z"/>',
      run: function (a) { go('https://www.facebook.com/sharer/sharer.php?u=' + enc(a.url)); }
    },
    {
      key: 'reddit', label: 'Reddit',
      icon: '<circle cx="12" cy="13" r="7"/><circle cx="9.4" cy="12.4" r="1"/><circle cx="14.6" cy="12.4" r="1"/><path d="M9.4 15.6c1.5 1.1 3.7 1.1 5.2 0M14 6.4 15.2 4l3 .8"/>',
      run: function (a) {
        go('https://www.reddit.com/submit?url=' + enc(a.url) + '&title=' + enc(a.name));
      }
    },
    {
      key: 'native', label: 'More…', when: function () { return !!navigator.share; },
      icon: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
      run: function (a) {
        navigator.share({
          title: a.name,
          text: a.name + ' — ' + (a.tagline || ''),
          url: a.url
        }).then(closeShare).catch(function () { /* dismissed */ });
      }
    },
    {
      key: 'qr', label: 'QR Code',
      icon: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z"/>',
      run: function (a) { showQR(a); }
    }
  ];

  function enc(s) { return encodeURIComponent(s); }
  function go(href) { window.open(href, '_blank', 'noopener,noreferrer'); closeShare(); }

  function buildShareGrid() {
    var grid = $('shareGrid');
    grid.innerHTML = '';

    SHARE_TARGETS.forEach(function (t) {
      if (t.when && !t.when()) return;   // e.g. no OS share sheet on this device

      var b = el('button', 'share-item' + (t.primary ? ' primary' : ''));
      b.type = 'button';

      var ico = el('span', 'share-ico');
      ico.innerHTML =
        '<svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" ' +
        'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + t.icon + '</svg>';

      b.appendChild(ico);
      b.appendChild(el('span', 'share-label', t.label));
      b.addEventListener('click', function () { if (current) t.run(current); });
      grid.appendChild(b);
    });
  }

  function openShare() {
    if (!current) return;
    $('shareSub').textContent = current.name + ' · ' + current.url;
    shareOverlay.hidden = false;
    document.body.classList.add('locked');
  }

  function closeShare() {
    shareOverlay.hidden = true;
    if (overlay.hidden) document.body.classList.remove('locked');
  }

  /* QR built inline — no library, no network. Uses a compact encoder for
     the short URLs in this catalog (byte mode, error level L).          */
  function showQR(app) {
    var box = el('div', 'lightbox');
    var wrap = el('div');
    wrap.style.cssText = 'text-align:center';

    var svg = qrSVG(app.url, 320);
    if (!svg) { toast('URL too long for a QR code'); return; }
    wrap.innerHTML = svg;

    var cap = el('p', null, app.name);
    cap.style.cssText = 'margin:16px 0 0;color:#d4af37;font-size:14px;font-weight:600;letter-spacing:.02em';
    wrap.appendChild(cap);

    box.appendChild(wrap);
    box.addEventListener('click', function () { box.remove(); });
    document.body.appendChild(box);
    closeShare();
  }

  /* ------------------------------------------------------------- wiring */

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) closeSheet();
    if (e.target.closest('[data-share-close]')) closeShare();
  });

  $('btnShare').addEventListener('click', openShare);

  $('urlChip').addEventListener('click', function () {
    if (!current) return;
    copy(current.url)
      .then(function () { toast('Link copied'); })
      .catch(function () { toast('Could not copy — long-press to select'); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!shareOverlay.hidden) { closeShare(); return; }
    if (!overlay.hidden) closeSheet();
  });

  window.addEventListener('popstate', function () {
    pushed = false;
    syncToHash();
  });

  buildGrid();
  buildShareGrid();
  syncToHash();   // honour a direct link like index.html#smart-nav

  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }

  /* =======================================================================
     Minimal QR encoder (byte mode, EC level L, versions 1-10).
     Enough for every URL in this catalog; returns an SVG string or null.
     ======================================================================= */
  function qrSVG(text, size) {
    var m = qrMatrix(text);
    if (!m) return null;
    var n = m.length, quiet = 4, total = n + quiet * 2, cell = size / total;
    var s = '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
            '" viewBox="0 0 ' + total + ' ' + total + '" shape-rendering="crispEdges">' +
            '<rect width="' + total + '" height="' + total + '" fill="#fff" rx="1"/>';
    for (var y = 0; y < n; y++) {
      for (var x = 0; x < n; x++) {
        if (m[y][x]) s += '<rect x="' + (x + quiet) + '" y="' + (y + quiet) + '" width="1" height="1" fill="#000"/>';
      }
    }
    return s + '</svg>';
  }

  function qrMatrix(text) {
    var data = [], i;
    for (i = 0; i < text.length; i++) {
      var c = text.charCodeAt(i);
      if (c < 128) data.push(c);
      else {
        var enc8 = unescape(encodeURIComponent(text.charAt(i)));
        for (var k = 0; k < enc8.length; k++) data.push(enc8.charCodeAt(k));
      }
    }

    // total data codewords at EC level L, versions 1..10
    var CAP = [null, 19, 34, 55, 80, 108, 136, 156, 194, 232, 274];
    var ECC = [null, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18];   // EC codewords per block
    var BLOCKS = [null, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4];

    // header is 4 mode bits + length bits, plus a 4-bit terminator
    var ver = 0, lenBits;
    for (i = 1; i <= 10; i++) {
      lenBits = i < 10 ? 8 : 16;
      if (4 + lenBits + data.length * 8 + 4 <= CAP[i] * 8) { ver = i; break; }
    }
    if (!ver) return null;

    lenBits = ver < 10 ? 8 : 16;
    var bits = [];
    push(bits, 4, 4);                       // byte mode
    push(bits, data.length, lenBits);
    for (i = 0; i < data.length; i++) push(bits, data[i], 8);

    var capBits = CAP[ver] * 8;
    for (i = 0; i < 4 && bits.length < capBits; i++) bits.push(0);
    while (bits.length % 8) bits.push(0);

    var cws = [];
    for (i = 0; i < bits.length; i += 8) {
      var b = 0;
      for (var j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
      cws.push(b);
    }
    var pad = [0xEC, 0x11], p = 0;
    while (cws.length < CAP[ver]) cws.push(pad[p++ % 2]);

    // split into blocks, generate EC per block, interleave
    var nb = BLOCKS[ver], ecLen = ECC[ver];
    var short = Math.floor(cws.length / nb), extra = cws.length % nb;
    var blocks = [], ecBlocks = [], off = 0;
    for (i = 0; i < nb; i++) {
      var len = short + (i >= nb - extra ? 1 : 0);
      var blk = cws.slice(off, off + len);
      off += len;
      blocks.push(blk);
      ecBlocks.push(rs(blk, ecLen));
    }
    var out = [], maxLen = 0;
    blocks.forEach(function (b) { maxLen = Math.max(maxLen, b.length); });
    for (i = 0; i < maxLen; i++) blocks.forEach(function (b) { if (i < b.length) out.push(b[i]); });
    for (i = 0; i < ecLen; i++) ecBlocks.forEach(function (b) { out.push(b[i]); });

    return place(out, ver);
  }

  function push(arr, val, len) {
    for (var i = len - 1; i >= 0; i--) arr.push((val >>> i) & 1);
  }

  // GF(256) tables
  var EXP = new Array(512), LOG = new Array(256);
  (function () {
    var x = 1;
    for (var i = 0; i < 255; i++) {
      EXP[i] = x; LOG[x] = i;
      x <<= 1; if (x & 0x100) x ^= 0x11D;
    }
    for (i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  })();
  function mul(a, b) { return (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]]; }

  function rs(data, ecLen) {
    var gen = [1], i, j;
    for (i = 0; i < ecLen; i++) {
      var next = gen.concat([0]);
      for (j = 0; j < gen.length; j++) next[j + 1] ^= mul(gen[j], EXP[i]);
      gen = next;
    }
    var res = data.concat(new Array(ecLen).fill(0));
    for (i = 0; i < data.length; i++) {
      var f = res[i];
      if (!f) continue;
      for (j = 0; j < gen.length; j++) res[i + j] ^= mul(gen[j], f);
    }
    return res.slice(data.length);
  }

  var ALIGN = [null, [], [6,18], [6,22], [6,26], [6,30], [6,34],
               [6,22,38], [6,24,42], [6,26,46], [6,28,50]];

  function place(cws, ver) {
    var n = ver * 4 + 17, i, j;
    var m = [], reserved = [];
    for (i = 0; i < n; i++) { m.push(new Array(n).fill(0)); reserved.push(new Array(n).fill(0)); }

    function set(r, c, v) { if (r >= 0 && c >= 0 && r < n && c < n) { m[r][c] = v; reserved[r][c] = 1; } }

    // finder patterns + separators
    [[0,0],[0,n-7],[n-7,0]].forEach(function (pos) {
      for (i = -1; i <= 7; i++) for (j = -1; j <= 7; j++) {
        var r = pos[0] + i, c = pos[1] + j;
        var on = (i >= 0 && i <= 6 && (j === 0 || j === 6)) ||
                 (j >= 0 && j <= 6 && (i === 0 || i === 6)) ||
                 (i >= 2 && i <= 4 && j >= 2 && j <= 4);
        set(r, c, on ? 1 : 0);
      }
    });

    // timing patterns
    for (i = 8; i < n - 8; i++) { set(6, i, i % 2 ? 0 : 1); set(i, 6, i % 2 ? 0 : 1); }

    // alignment patterns
    var al = ALIGN[ver];
    al.forEach(function (r) {
      al.forEach(function (c) {
        if ((r <= 8 && c <= 8) || (r <= 8 && c >= n - 9) || (r >= n - 9 && c <= 8)) return;
        for (i = -2; i <= 2; i++) for (j = -2; j <= 2; j++) {
          set(r + i, c + j, (Math.abs(i) === 2 || Math.abs(j) === 2 || (i === 0 && j === 0)) ? 1 : 0);
        }
      });
    });

    // reserve format info areas
    for (i = 0; i < 9; i++) { if (!reserved[8][i]) set(8, i, 0); if (!reserved[i][8]) set(i, 8, 0); }
    for (i = 0; i < 8; i++) { set(8, n - 1 - i, 0); set(n - 1 - i, 8, 0); }
    set(n - 8, 8, 1);   // dark module

    // version info (v7+)
    if (ver >= 7) {
      var vinfo = verBits(ver);
      for (i = 0; i < 18; i++) {
        var bit = (vinfo >> i) & 1;
        set(Math.floor(i / 3), n - 11 + (i % 3), bit);
        set(n - 11 + (i % 3), Math.floor(i / 3), bit);
      }
    }

    // data placement, mask 0, zigzag from bottom-right
    var bitIdx = 0, dir = -1, row = n - 1;
    for (var col = n - 1; col > 0; col -= 2) {
      if (col === 6) col--;
      while (row >= 0 && row < n) {
        for (var s = 0; s < 2; s++) {
          var c2 = col - s;
          if (reserved[row][c2]) continue;
          var bit = 0;
          if (bitIdx < cws.length * 8) {
            bit = (cws[bitIdx >> 3] >> (7 - (bitIdx & 7))) & 1;
          }
          bitIdx++;
          if ((row + c2) % 2 === 0) bit ^= 1;   // mask 0
          m[row][c2] = bit;
        }
        row += dir;
      }
      dir = -dir; row += dir;
    }

    // format info: EC level L (01), mask 0 — written twice, once down the
    // column beside the top-left finder, once along row 8.
    var fmt = fmtBits(0x01 << 3 | 0);
    for (i = 0; i < 15; i++) {
      var fbit = (fmt >> i) & 1;

      if (i < 6)      m[i][8] = fbit;
      else if (i < 8) m[i + 1][8] = fbit;
      else            m[n - 15 + i][8] = fbit;

      if (i < 8)        m[8][n - 1 - i] = fbit;
      else if (i === 8) m[8][7] = fbit;
      else              m[8][14 - i] = fbit;
    }
    m[n - 8][8] = 1;   // dark module

    return m;
  }

  function fmtBits(data) {
    var d = data << 10, g = 0x537;
    for (var i = 4; i >= 0; i--) if (d & (1 << (i + 10))) d ^= g << i;
    return ((data << 10) | d) ^ 0x5412;
  }

  function verBits(ver) {
    var d = ver << 12, g = 0x1F25;
    for (var i = 5; i >= 0; i--) if (d & (1 << (i + 12))) d ^= g << i;
    return (ver << 12) | d;
  }
})();
