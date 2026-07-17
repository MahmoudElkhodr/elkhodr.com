/* COIT12211 / COIT29223 Week 2 demo, v3.
   Architecture: each scene mounts its DOM once, and step changes only toggle
   classes and inline positions, so CSS transitions produce genuine animation
   instead of elements being rebuilt on every step. */
(function () {
  'use strict';

  const sceneRoot = document.getElementById('sceneRoot');
  const stepCounter = document.getElementById('stepCounter');
  const progressBar = document.getElementById('progressBar');
  const playPause = document.getElementById('playPause');
  const speed = document.getElementById('speed');
  const sceneTabs = Array.from(document.querySelectorAll('.scene-tab'));

  const state = {
    scene: 0,
    step: 0,
    playing: false,
    timer: null,
    dbOperation: 'update',
    tampered: false,
    consensusMode: 'pow',
    posWins: { A: 0, B: 0, C: 0, D: 0 },
    posDraws: 0,
    lastPosWinner: null,
    interledgerOutcome: 'success',
    fabricOutcome: 'success'
  };

  /* Scene-local intervals (mining ticker, PoET countdown, roulette draw).
     Every mount clears them so nothing leaks between scenes. */
  let sceneTimers = [];
  let renderGen = 0;
  function later(fn, ms, repeat) {
    const id = repeat ? setInterval(fn, ms) : setTimeout(fn, ms);
    sceneTimers.push({ id, repeat });
    return id;
  }
  function clearSceneTimers() {
    sceneTimers.forEach(t => t.repeat ? clearInterval(t.id) : clearTimeout(t.id));
    sceneTimers = [];
  }

  /* ---------- small helpers ---------- */

  const HEX = '0123456789abcdef';
  function randHex(n) {
    let s = '';
    for (let i = 0; i < n; i += 1) s += HEX[Math.floor(Math.random() * 16)];
    return s;
  }

  function nodeHtml(icon, label, x, y, delay, extra = '') {
    return `<div class="n ${extra}" style="left:${x}%;top:${y}%;transition-delay:${delay}ms">` +
      `<span>${icon}</span><small>${label}</small></div>`;
  }

  function linksSvg(lines) {
    const body = lines.map((l, i) =>
      `<line x1="${l[0]}" y1="${l[1]}" x2="${l[2]}" y2="${l[3]}" class="link ${l[4] || ''}" ` +
      `style="transition-delay:${120 * i}ms" vector-effect="non-scaling-stroke"/>`).join('');
    return `<svg class="stage-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${body}</svg>`;
  }

  function q(sel) { return sceneRoot.querySelector(sel); }
  function qa(sel) { return Array.from(sceneRoot.querySelectorAll(sel)); }
  function setLive(sel, on) { qa(sel).forEach(el => el.classList.toggle('live', on)); }

  /* ---------- scene definitions ---------- */

  const scenes = [
    {
      title: 'Chain Types: who can join, see and write?',
      kicker: 'Public, permissioned/private and hybrid blockchain',
      purpose: 'This scene visualises access, visibility and privacy across the three main blockchain network types.',
      steps: [
        { label: 'Start with the same transaction', text: 'A record needs to be shared: for example, a shipment update, certificate proof, donation entry or consent event.' },
        { label: 'Public blockchain', text: 'In a public blockchain, the network is open. Anyone can join, submit transactions, inspect records and participate according to the network rules.' },
        { label: 'Permissioned/private blockchain', text: 'In a permissioned network, access is controlled. Known organisations and approved users participate, while outsiders are blocked.' },
        { label: 'Hybrid blockchain', text: 'In a hybrid design, private business data stays inside a controlled network, while a public proof, such as a hash, can be posted for verification.' },
        { label: 'Key distinction', text: 'The main difference is not whether the technology is a blockchain. The difference is who can join, who can write, who can validate and who can see the data.' }
      ],
      mount: mountChainTypes,
      update: updateChainTypes
    },
    {
      title: 'Database vs Blockchain: update a table or append a ledger?',
      kicker: 'CRUD compared with blockchain transactions',
      purpose: 'This scene shows why a database is usually faster and simpler, while a blockchain keeps an append-only, tamper-evident record. Try the tamper button once the ledger is replicated.',
      steps: [
        { label: 'One business record', text: 'Start with a supplier record that can be created, read, updated or deleted in a normal database.' },
        { label: 'Database operation', text: 'In a database, the table can be directly modified. The current row may change or be deleted according to application and DBMS rules.' },
        { label: 'Blockchain operation', text: 'In a blockchain, the earlier entry is not edited. A new transaction is appended to show the next state or decision. Each block records the hash of the previous block.' },
        { label: 'Replicated ledger', text: 'Multiple nodes hold a copy of the ledger. This supports shared verification, but it adds cost and complexity. Try tampering with Block 1 to see why the history is protected.' },
        { label: 'Decision point', text: 'Use a database when one trusted owner can manage the records efficiently. Consider blockchain when several parties need a shared tamper-evident history.' }
      ],
      mount: mountDbVsChain,
      update: updateDbVsChain
    },
    {
      title: 'Consensus: how does the network decide who adds the block?',
      kicker: 'PoW, PoS, DPoS, PoET and PoI',
      purpose: 'This scene shows what the players are trying to achieve: agree on a block of pending transactions before it is added to the chain.',
      steps: [
        { label: 'Pending transactions', text: 'Several transactions are waiting. A candidate block is prepared, but the network must agree before it becomes part of the ledger.' },
        { label: 'Selection rule', text: 'Different consensus mechanisms use different rules to decide who proposes or validates the next block.' },
        { label: 'Competition or selection', text: 'Watch the mechanism operate: mining races, stake-weighted draws, delegate votes, random timers or importance scores.' },
        { label: 'Block accepted', text: 'When the rule is satisfied, the block is accepted and added. The selected node receives the right or reward according to the mechanism.' },
        { label: 'Trade-off', text: 'Consensus is about trade-offs: openness, speed, energy use, decentralisation, identity and governance.' }
      ],
      mount: mountConsensus,
      update: updateConsensus
    },
    {
      title: 'Interledger: moving value across different ledgers',
      kicker: 'Prepare, Fulfil and Reject packets',
      purpose: 'This scene shows an interledger-style payment journey between two different networks using a connector. Watch the packet travel.',
      steps: [
        { label: 'Different ledgers', text: 'Alice is on Ledger A and Bob is on Ledger B. They are not using the same payment network.' },
        { label: 'Prepare packet', text: 'A Prepare packet carries the proposed payment details from Alice towards the connector.' },
        { label: 'Connector routing', text: 'The connector routes the packet on to Ledger B. It may charge a fee for providing this bridge.' },
        { label: 'Fulfil or Reject', text: 'If Bob accepts the payment condition, a Fulfil packet returns. If the payment fails, a Reject packet returns instead.' },
        { label: 'Interoperability', text: 'The return packet reaches Alice and both ledgers settle. Value moved across independent ledgers without forcing everyone onto one network.' }
      ],
      mount: mountInterledger,
      update: updateInterledger
    },
    {
      title: 'Hyperledger Fabric: not just a ledger',
      kicker: 'Enterprise blockchain framework with identities, roles and policies',
      purpose: 'This scene distinguishes a ledger from Hyperledger Fabric and shows how endorsement, ordering and committing work in an enterprise blockchain network.',
      steps: [
        { label: 'Ledger vs framework', text: 'A ledger is the shared record. Hyperledger Fabric is a framework for building permissioned enterprise blockchain networks around that ledger.' },
        { label: 'Known organisations', text: 'Participants are known organisations with identities and permissions, not anonymous public users. A client application submits a transaction proposal.' },
        { label: 'Endorsement', text: 'Required endorsers simulate and sign the proposal according to the endorsement policy.' },
        { label: 'Ordering', text: 'The consenter/orderer orders endorsed transactions into blocks and distributes them to the peers.' },
        { label: 'Committing', text: 'Committers validate the endorsement policy. If the required endorsements are present, every peer appends the block to its copy of the ledger; otherwise the transaction is rejected.' }
      ],
      mount: mountFabric,
      update: updateFabric
    }
  ];

  /* ---------- core engine ---------- */

  function render() {
    renderGen += 1;
    clearSceneTimers();
    const scene = scenes[state.scene];
    sceneRoot.innerHTML = `
      <div class="scene-header">
        <div>
          <p class="scene-kicker">${scene.kicker}</p>
          <h2 class="scene-title">${scene.title}</h2>
          <p class="scene-purpose">${scene.purpose}</p>
        </div>
        <div class="scene-side">
          <button id="scenePlayPause" class="scene-play" type="button" aria-pressed="false">Play animation</button>
          <div class="caption-card" aria-live="polite">
            <strong id="capLabel"></strong>
            <p id="capText"></p>
          </div>
        </div>
      </div>
      <div id="stageHolder"></div>`;
    q('#scenePlayPause').addEventListener('click', toggleAutoplayFromScene);
    scene.mount(q('#stageHolder'));
    applyStep(true);
    syncAutoplayButtons();
  }

  function applyStep(firstPaint) {
    const scene = scenes[state.scene];
    const step = scene.steps[state.step];
    q('#capLabel').textContent = `Step ${state.step + 1}. ${step.label}`;
    q('#capText').textContent = step.text;
    stepCounter.textContent = `Step ${state.step + 1} of ${scene.steps.length}`;
    progressBar.style.width = `${((state.step + 1) / scene.steps.length) * 100}%`;
    if (firstPaint) {
      /* Allow one frame at the initial state so entry transitions can run. */
      deferUpdate(scene);
    } else {
      scene.update(state.step);
    }
  }

  /* Runs scene.update after two frames, but only if no newer render has
     replaced the DOM in the meantime. */
  function deferUpdate(scene) {
    const gen = renderGen;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (gen === renderGen) scene.update(state.step);
    }));
  }

  function setScene(index, keepPlaying) {
    if (!keepPlaying) stopAutoplay();
    state.scene = Math.max(0, Math.min(index, scenes.length - 1));
    state.step = 0;
    state.tampered = false;
    sceneTabs.forEach((tab, i) => tab.classList.toggle('active', i === state.scene));
    render();
  }

  function advance() {
    const total = scenes[state.scene].steps.length;
    if (state.step < total - 1) {
      state.step += 1;
      applyStep(false);
    } else if (state.scene < scenes.length - 1) {
      setScene(state.scene + 1, true);
    } else {
      stopAutoplay();
    }
  }

  function back() {
    if (state.step > 0) {
      state.step -= 1;
      applyStep(false);
    } else if (state.scene > 0) {
      stopAutoplay();
      state.scene -= 1;
      state.step = scenes[state.scene].steps.length - 1;
      sceneTabs.forEach((tab, i) => tab.classList.toggle('active', i === state.scene));
      render();
    }
  }

  function startAutoplay() {
    state.playing = true;
    syncAutoplayButtons();
    resetAutoplayTimer();
  }
  function stopAutoplay() {
    state.playing = false;
    syncAutoplayButtons();
    if (state.timer) clearInterval(state.timer);
    state.timer = null;
  }
  function syncAutoplayButtons() {
    playPause.textContent = state.playing ? 'Pause' : 'Autoplay';
    playPause.classList.toggle('playing', state.playing);
    const scenePlayPause = q('#scenePlayPause');
    if (scenePlayPause) {
      scenePlayPause.textContent = state.playing ? 'Pause animation' : 'Play animation';
      scenePlayPause.classList.toggle('playing', state.playing);
      scenePlayPause.setAttribute('aria-pressed', state.playing ? 'true' : 'false');
    }
  }
  function toggleAutoplayFromScene() {
    if (state.playing) {
      stopAutoplay();
      return;
    }
    if (state.step >= scenes[state.scene].steps.length - 1) {
      state.step = 0;
      render();
    }
    startAutoplay();
  }
  function resetAutoplayTimer() {
    if (state.timer) clearInterval(state.timer);
    state.timer = setInterval(advance, Number(speed.value));
  }
  function manualAdvance(fn) {
    fn();
    if (state.playing) resetAutoplayTimer();
  }

  /* ---------- controls ---------- */

  sceneTabs.forEach((tab, index) => tab.addEventListener('click', () => setScene(index)));
  document.getElementById('prevScene').addEventListener('click', () => setScene(state.scene - 1));
  document.getElementById('nextScene').addEventListener('click', () => setScene(state.scene + 1));
  document.getElementById('backStep').addEventListener('click', () => manualAdvance(back));
  document.getElementById('nextStep').addEventListener('click', () => manualAdvance(advance));
  document.getElementById('restart').addEventListener('click', () => { state.step = 0; state.tampered = false; render(); });
  playPause.addEventListener('click', () => state.playing ? stopAutoplay() : startAutoplay());
  speed.addEventListener('change', () => { if (state.playing) resetAutoplayTimer(); });
  document.getElementById('fullscreen').addEventListener('click', toggleFullscreen);

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  }

  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toUpperCase();
    if (tag === 'SELECT' || tag === 'INPUT' || tag === 'TEXTAREA') return;
    if ((e.key === ' ' || e.key === 'Enter') && tag === 'BUTTON') return;
    switch (e.key) {
      case 'ArrowRight': e.preventDefault(); e.shiftKey ? setScene(state.scene + 1) : manualAdvance(advance); break;
      case 'ArrowLeft': e.preventDefault(); e.shiftKey ? setScene(state.scene - 1) : manualAdvance(back); break;
      case ' ': e.preventDefault(); state.playing ? stopAutoplay() : startAutoplay(); break;
      case 'r': case 'R': state.step = 0; state.tampered = false; render(); break;
      case 'f': case 'F': toggleFullscreen(); break;
      case '1': case '2': case '3': case '4': case '5': setScene(Number(e.key) - 1); break;
      default: break;
    }
  });

  /* =========================================================
     Scene 1: chain types
     ========================================================= */

  function mountChainTypes(holder) {
    holder.innerHTML = `
      <div class="grid-3">
        <article class="panel network-panel" id="panelPublic">
          <h3>Public blockchain</h3>
          <div class="network-stage public-stage">
            ${linksSvg([[24, 30, 50, 50], [78, 22, 50, 50], [16, 80, 50, 50], [52, 88, 50, 50], [86, 78, 50, 50], [24, 30, 78, 22]])}
            ${nodeHtml('👩‍💻', 'User', 24, 30, 0)}
            ${nodeHtml('⛏️', 'Miner', 78, 22, 90)}
            ${nodeHtml('🌍', 'Any user', 16, 80, 180)}
            ${nodeHtml('🔍', 'Explorer', 52, 88, 270)}
            ${nodeHtml('💻', 'Node', 86, 78, 360)}
            <div class="tx-card" style="left:50%;top:50%">Open TX<div class="hash">0xA4...9F</div></div>
          </div>
          <ul class="key-points">
            <li>Open participation: anyone may join.</li>
            <li>High transparency and censorship resistance.</li>
            <li>Privacy and performance can be difficult.</li>
          </ul>
        </article>

        <article class="panel network-panel" id="panelPerm">
          <h3>Permissioned / private blockchain</h3>
          <div class="network-stage permissioned-stage">
            <div class="gate"></div><div class="lock-icon">🔐</div>
            ${linksSvg([[26, 32, 46, 58], [70, 28, 46, 58], [80, 74, 46, 58], [26, 32, 70, 28]], )}
            ${nodeHtml('🏢', 'Org A', 26, 32, 0, 'approved')}
            ${nodeHtml('🏭', 'Org B', 70, 28, 90, 'approved')}
            ${nodeHtml('✅', 'Validator', 80, 74, 180, 'approved')}
            ${nodeHtml('🚚', 'Carrier', 22, 78, 270, 'approved')}
            ${nodeHtml('👤', 'Outside', 91, 13, 360, 'denied')}
            <div class="tx-card amber" style="left:46%;top:58%">Approved TX<div class="hash">known ID</div></div>
          </div>
          <ul class="key-points">
            <li>Known members and controlled access.</li>
            <li>Useful for enterprise collaboration.</li>
            <li>Less open than a public blockchain.</li>
          </ul>
        </article>

        <article class="panel network-panel" id="panelHybrid">
          <h3>Hybrid blockchain</h3>
          <div class="network-stage hybrid-stage">
            ${linksSvg([[30, 66, 74, 24], [18, 84, 30, 66], [48, 84, 30, 66]])}
            <div class="private-record">
              <span>Private record</span>
              <b>Batch #A19</b>
              <div class="private-redacted"></div>
              <div class="private-redacted" style="width:70%"></div>
            </div>
            ${nodeHtml('🏢', 'Org A', 18, 84, 0, 'approved')}
            ${nodeHtml('🏭', 'Org B', 48, 84, 90, 'approved')}
            ${nodeHtml('🌐', 'Public', 88, 16, 180)}
            ${nodeHtml('🔍', 'Verifier', 86, 82, 270)}
            <div class="tx-card teal" style="left:30%;top:66%">Hash proof<div class="hash">SHA256</div></div>
            <div class="public-proof">public proof:<br>0x7e3...b91</div>
          </div>
          <ul class="key-points">
            <li>Private details stay inside the controlled network.</li>
            <li>Public proof can support external verification.</li>
            <li>Good fit when transparency and privacy both matter.</li>
          </ul>
        </article>
      </div>
      <div class="result-callout"><h3>Student takeaway</h3><p>Choosing a blockchain type is mostly an access and governance decision: who can join, who can write, who validates, and what data is visible.</p></div>`;
  }

  function updateChainTypes(step) {
    const panels = [q('#panelPublic'), q('#panelPerm'), q('#panelHybrid')];
    const activeFrom = [1, 2, 3];
    panels.forEach((p, i) => {
      const on = step >= activeFrom[i];
      p.querySelectorAll('.n').forEach(n => n.classList.toggle('live', on));
      p.querySelectorAll('.link').forEach(l => l.classList.toggle('live', on));
      p.querySelectorAll('.tx-card').forEach(t => t.classList.toggle('floating', on));
      p.classList.toggle('dim', step >= 1 && step <= 3 && step !== activeFrom[i]);
      p.classList.toggle('focus', step === activeFrom[i]);
    });
    q('.public-proof').classList.toggle('visible', step >= 3);
    q('.result-callout').classList.toggle('visible', step >= 4);
  }

  /* =========================================================
     Scene 2: database vs blockchain, with tamper demo
     ========================================================= */

  function mountDbVsChain(holder) {
    const op = state.dbOperation;
    const operationText = {
      create: 'INSERT INTO SupplierRecords VALUES (A19, Mangoes, Pending);',
      read: 'SELECT * FROM SupplierRecords WHERE BatchID = A19;',
      update: 'UPDATE SupplierRecords SET Status = Approved WHERE BatchID = A19;',
      delete: 'DELETE FROM SupplierRecords WHERE BatchID = A19;'
    }[op];
    const ledgerTx = {
      create: ['TX01: Create Batch A19', 'TX02: Current state = Pending', 'No earlier entry changed.'],
      read: ['TX01: Create Batch A19', 'Read request: current state is checked', 'The ledger history remains unchanged.'],
      update: ['TX01: Create Batch A19', 'TX02: Add approval event', 'Current state is now Approved. Old entry remains.'],
      delete: ['TX01: Create Batch A19', 'TX02: Add revoke/retire event', 'The old entry is not erased; it is superseded.']
    }[op];
    const t = state.tampered;
    holder.innerHTML = `
      <div class="operation-switcher" aria-label="Choose operation">
        ${['create', 'read', 'update', 'delete'].map(x =>
          `<button type="button" data-op="${x}" class="${op === x ? 'active' : ''}">${x.toUpperCase()}</button>`).join('')}
      </div>
      <div class="grid-2">
        <article class="panel db-stage">
          <h3>Normal database / cloud system</h3>
          <div class="db-server">🗄️ <strong>Central DBMS</strong> <span>one controlled copy</span></div>
          <table class="data-table">
            <thead><tr><th>BatchID</th><th>Product</th><th>Status</th><th>Updated by</th></tr></thead>
            <tbody>
              <tr id="rowA19"><td>A19</td><td>Mangoes</td><td id="statusA19">Pending</td><td>Admin</td></tr>
              <tr><td>B07</td><td>Avocados</td><td>Pending</td><td>Warehouse</td></tr>
            </tbody>
          </table>
          <div class="sql-box" id="sqlBox" data-sql="${operationText.replace(/"/g, '&quot;')}">// A table stores the current version of the record.</div>
          <div class="explainer-box"><strong>Database logic:</strong> Fast and efficient when one trusted organisation can control the data, rules, backup, security and access.</div>
        </article>

        <article class="panel ledger-stage ${t ? 'tampered' : ''}">
          <h3>Blockchain ledger</h3>
          <div class="ledger-copy-row">
            <div class="ledger-copy" data-copy>Node 1 copy</div>
            <div class="ledger-copy" data-copy>Node 2 copy</div>
            <div class="ledger-copy" data-copy>Node 3 copy</div>
          </div>
          <div class="block-chain">
            <div class="block b1 live ${t ? 'broken' : ''}">
              <span class="block-num">1</span>
              <div><strong>${t ? 'TX01: Create Batch A19 &rarr; <em>Batch A99</em>' : ledgerTx[0]}</strong>
              <div class="block-hash">${t ? 'hash changed: a91f &rarr; <b class="bad">e07c</b>' : 'prev: 0000 | hash: a91f'}</div></div>
              <span class="tick">${t ? '⚠️' : '✅'}</span>
            </div>
            <div class="chain-joint j1 ${t ? 'snapped' : ''}"></div>
            <div class="block b2 ${t ? 'broken' : ''}">
              <span class="block-num">2</span>
              <div><strong>${ledgerTx[1]}</strong>
              <div class="block-hash">${t ? 'expected prev a91f, found <b class="bad">e07c</b> &rarr; invalid' : 'prev: a91f | hash: c83e'}</div></div>
              <span class="tick">${t ? '❌' : '⏳'}</span>
            </div>
            <div class="chain-joint j2 ${t ? 'snapped' : ''}"></div>
            <div class="block b3 ${t ? 'broken' : ''}">
              <span class="block-num">3</span>
              <div><strong>${ledgerTx[2]}</strong>
              <div class="block-hash">${t ? 'chain invalid from Block 1 onwards' : 'previous entries remain part of history'}</div></div>
              <span class="tick">${t ? '❌' : '—'}</span>
            </div>
          </div>
          <div class="tamper-row">
            <button type="button" id="tamperBtn" class="tamper-btn ${t ? 'undo' : ''}">${t ? 'Undo tampering' : 'Try to tamper with Block 1'}</button>
            <span class="tamper-note ${t ? 'visible' : ''}">The other nodes compare hashes, detect the mismatch and reject the altered copy. This is the integrity property from the Blockchain vs Database comparison.</span>
          </div>
          <div class="explainer-box"><strong>Blockchain logic:</strong> The ledger grows by adding transactions. Earlier entries are not silently edited or deleted; later entries explain the new state.</div>
        </article>
      </div>`;

    qa('[data-op]').forEach(btn => btn.addEventListener('click', () => {
      state.dbOperation = btn.dataset.op;
      state.tampered = false;
      renderGen += 1;
      mountDbVsChain(holder);
      scenes[1].update(state.step);
    }));
    q('#tamperBtn').addEventListener('click', () => {
      state.tampered = !state.tampered;
      renderGen += 1;
      mountDbVsChain(holder);
      scenes[1].update(state.step);
    });
  }

  function updateDbVsChain(step) {
    const op = state.dbOperation;
    const row = q('#rowA19');
    const status = q('#statusA19');
    row.classList.toggle('changed', op === 'update' && step >= 1);
    row.classList.toggle('deleted', op === 'delete' && step >= 1);
    status.textContent = op === 'update' && step >= 1 ? 'Approved'
      : op === 'delete' && step >= 1 ? 'Removed' : 'Pending';
    const sql = q('#sqlBox');
    sql.textContent = step >= 1 ? sql.dataset.sql : '// A table stores the current version of the record.';
    sql.classList.toggle('typed', step >= 1);
    if (!state.tampered) {
      q('.block.b2').classList.toggle('live', step >= 2);
      q('.block.b2 .tick').textContent = step >= 2 ? '✅' : '⏳';
      q('.block.b3').classList.toggle('live', step >= 2 && op !== 'read');
      q('.block.b3 .tick').textContent = step >= 2 && op !== 'read' ? '✅' : '—';
      q('.chain-joint.j1').classList.toggle('live', step >= 2);
      q('.chain-joint.j2').classList.toggle('live', step >= 2 && op !== 'read');
    }
    qa('[data-copy]').forEach((c, i) => {
      c.classList.toggle('active', step >= 3 && !state.tampered);
      c.classList.toggle('reject', state.tampered);
      c.style.transitionDelay = `${i * 140}ms`;
      c.textContent = state.tampered ? `Node ${i + 1}: hash mismatch ✕` : `Node ${i + 1} copy`;
    });
  }

  /* =========================================================
     Scene 3: consensus mechanisms
     ========================================================= */

  const MINERS = [
    { name: 'Mina', base: 0 }, { name: 'Omar', base: 0 }, { name: 'Jana', base: 0 }, { name: 'Ruby', base: 0 }
  ];
  const STAKES = [['A', 68], ['B', 22], ['C', 7], ['D', 3]];

  function consensusRule(mode) {
    return {
      pow: 'find a hash starting with 000',
      pos: 'select validator based on stake probability',
      dpos: 'token holders elect delegates',
      poet: 'shortest trusted random wait wins',
      poi: 'select based on importance score'
    }[mode];
  }

  function mountConsensus(holder) {
    const mode = state.consensusMode;
    holder.innerHTML = `
      <div class="mode-switcher" aria-label="Choose consensus mechanism">
        ${[['pow', 'Proof of Work'], ['pos', 'Proof of Stake'], ['dpos', 'Delegated PoS'], ['poet', 'Proof of Elapsed Time'], ['poi', 'Proof of Importance']]
          .map(([id, label]) => `<button type="button" data-consensus="${id}" class="${mode === id ? 'active' : ''}">${label}</button>`).join('')}
      </div>
      <div class="consensus-stage">
        <aside class="transaction-pool panel">
          <h3>What are the players trying to do?</h3>
          <p>They are trying to agree on whether this candidate block should be added to the ledger.</p>
          <div class="tx-list">
            <div class="tx-pill"><span>TX-A</span><span>Alice &rarr; Bob 4 tokens</span></div>
            <div class="tx-pill"><span>TX-B</span><span>Warehouse approves batch</span></div>
            <div class="tx-pill"><span>TX-C</span><span>Certificate issued</span></div>
          </div>
          <div class="candidate-block">
            <strong>Candidate Block #204</strong>
            <p class="hash-target">Target / rule: ${consensusRule(mode)}</p>
          </div>
          <div class="energy-row"><div class="meter"><span id="energyMeter"></span></div><span>Energy / effort</span></div>
        </aside>
        <section class="mode-visual panel" id="modeVisual"></section>
      </div>
      <div class="result-callout visible"><h3>Student takeaway</h3><p>Consensus is not one fixed method. Each mechanism answers the same question differently: who is trusted to add the next block, and why?</p></div>`;

    qa('[data-consensus]').forEach(btn => btn.addEventListener('click', () => {
      state.consensusMode = btn.dataset.consensus;
      state.step = 0;
      render();
    }));

    const visual = q('#modeVisual');
    if (mode === 'pow') {
      visual.innerHTML = `
        <h3>Proof of Work: puzzle race</h3>
        <p>Miners repeatedly change a nonce and hash the block until one finds a hash below the target. The first valid solution wins the right to add the block.</p>
        <div class="validator-grid">${MINERS.map((m, i) => `
          <div class="validator" data-miner="${i}">
            <div class="validator-name">⛏️ ${m.name}</div>
            <div class="validator-meta">nonce: <b class="nonce">0</b></div>
            <div class="hash-readout">hash: <code class="hashv">&mdash;</code></div>
            <div class="meter"><span class="bar"></span></div>
            <div class="validator-meta win-note">Found 000... hash. Selected to add the block ✅</div>
          </div>`).join('')}
        </div>`;
    } else if (mode === 'pos') {
      visual.innerHTML = `
        <h3>Proof of Stake: stake-weighted selection</h3>
        <p>Validators with more stake have a higher chance of being selected, but selection is still probabilistic. Run the draw several times and watch the tally approach the stake percentages.</p>
        <div class="validator-grid">${STAKES.map(([id, pct]) => `
          <div class="validator" data-val="${id}">
            <div class="validator-name">💰 Validator ${id}</div>
            <div class="validator-meta">stake: ${pct}%</div>
            <div class="meter"><span class="bar" style="width:${pct}%"></span></div>
            <div class="validator-meta tally">wins: <b class="wins">${state.posWins[id]}</b></div>
            <div class="validator-meta win-note">Selected for this block ✅</div>
          </div>`).join('')}
        </div>
        <div class="draw-row">
          <button type="button" id="drawBtn" class="tamper-btn">Run weighted draw</button>
          <span id="drawSummary" class="tamper-note visible">${state.posDraws ? `${state.posDraws} draw(s) so far.` : 'No draws yet. Expected long-run share: 68 / 22 / 7 / 3.'}</span>
        </div>`;
      q('#drawBtn').addEventListener('click', runPosDraw);
    } else if (mode === 'dpos') {
      visual.innerHTML = `
        <h3>Delegated Proof of Stake: vote, then validate</h3>
        <p>Token holders elect a smaller group of delegates. The delegates validate blocks on behalf of the wider community.</p>
        <div class="dpos-voters">
          <span class="voter v1">User 1</span><span class="vote-arrow a1">&rarr;</span><span class="voter d1">Delegate A</span>
          <span class="voter v2">User 2</span><span class="vote-arrow a2">&rarr;</span><span class="voter d2">Delegate A</span>
          <span class="voter v3">User 3</span><span class="vote-arrow a3">&rarr;</span><span class="voter d3">Delegate B</span>
        </div>
        <div class="validator-grid two">
          <div class="validator" data-del="A"><div class="validator-name">🗳️ Delegate A</div><div class="validator-meta">votes: <b class="votes">0</b></div><div class="meter"><span class="bar"></span></div><div class="validator-meta win-note">Elected and validates the block ✅</div></div>
          <div class="validator" data-del="B"><div class="validator-name">🗳️ Delegate B</div><div class="validator-meta">votes: <b class="votes">0</b></div><div class="meter"><span class="bar"></span></div><div class="validator-meta win-note"></div></div>
        </div>`;
    } else if (mode === 'poet') {
      visual.innerHTML = `
        <h3>Proof of Elapsed Time: random wait</h3>
        <p>Each approved node receives a trusted random wait time and goes to sleep. The first timer to expire wakes up and commits the block. The countdown below is accelerated for class.</p>
        <div class="validator-grid">${[['A', 14], ['B', 3], ['C', 9], ['D', 21]].map(([id, s]) => `
          <div class="validator" data-poet="${id}" data-wait="${s}">
            <div class="validator-name">⏱️ Node ${id}</div>
            <div class="validator-meta">random wait: ${s}s</div>
            <div class="timer-circle"><span class="left">${s}</span></div>
            <div class="meter"><span class="bar"></span></div>
            <div class="validator-meta win-note">Timer finished first. Commits the block ✅</div>
          </div>`).join('')}
        </div>`;
    } else {
      visual.innerHTML = `
        <h3>Proof of Importance: score-based selection</h3>
        <p>Nodes receive an importance score from factors such as activity, reputation and network contribution. A higher score means a greater chance of validating the next block.</p>
        <div class="validator-grid">${[['A', 45], ['B', 82], ['C', 34], ['D', 61]].map(([id, score]) => `
          <div class="validator" data-poi="${id}"><div class="validator-name">⭐ Node ${id}</div><div class="validator-meta">importance: ${score}</div><div class="meter"><span class="bar" data-w="${score}"></span></div><div class="validator-meta win-note">Highest importance. Selected ✅</div></div>`).join('')}
        </div>`;
    }
  }

  function updateConsensus(step) {
    clearSceneTimers();
    const mode = state.consensusMode;
    const energy = q('#energyMeter');
    energy.style.width = mode === 'pow' ? (step >= 2 ? '84%' : step >= 1 ? '46%' : '12%') : '16%';

    if (mode === 'pow') {
      const miners = qa('[data-miner]');
      miners.forEach(m => { m.classList.remove('winner'); });
      if (step >= 1 && step < 3) {
        const counts = [0, 0, 0, 0];
        later(() => {
          miners.forEach((m, i) => {
            counts[i] += 17 + Math.floor(Math.random() * 60);
            m.querySelector('.nonce').textContent = counts[i].toLocaleString();
            m.querySelector('.hashv').textContent = randHex(10) + '…';
            m.querySelector('.bar').style.width = `${Math.min(95, counts[i] / 28)}%`;
          });
        }, 110, true);
      } else if (step >= 3) {
        miners.forEach((m, i) => {
          m.querySelector('.nonce').textContent = [1842, 1590, 1031, 1287][i].toLocaleString();
          m.querySelector('.hashv').textContent = i === 0 ? '000f3a91c2…' : randHex(10) + '…';
          m.querySelector('.bar').style.width = i === 0 ? '96%' : `${40 + i * 9}%`;
          m.classList.toggle('winner', i === 0);
        });
      } else {
        miners.forEach(m => {
          m.querySelector('.nonce').textContent = '0';
          m.querySelector('.hashv').textContent = '—';
          m.querySelector('.bar').style.width = '4%';
        });
      }
    }

    if (mode === 'pos') {
      const winner = state.lastPosWinner || 'A';
      qa('[data-val]').forEach(v => v.classList.toggle('winner', step >= 3 && v.dataset.val === winner));
    }

    if (mode === 'dpos') {
      const on = step >= 1;
      ['v1', 'a1', 'd1', 'v2', 'a2', 'd2', 'v3', 'a3', 'd3'].forEach((c, i) => {
        const elx = q(`.${c}`);
        elx.classList.toggle('live', on);
        elx.style.transitionDelay = `${i * 110}ms`;
      });
      const a = q('[data-del="A"]'); const b = q('[data-del="B"]');
      a.querySelector('.votes').textContent = on ? '2' : '0';
      b.querySelector('.votes').textContent = on ? '1' : '0';
      a.querySelector('.bar').style.width = on ? '85%' : '8%';
      b.querySelector('.bar').style.width = on ? '45%' : '8%';
      a.classList.toggle('winner', step >= 3);
    }

    if (mode === 'poet') {
      const nodes = qa('[data-poet]');
      nodes.forEach(n => {
        n.classList.remove('winner', 'asleep');
        n.querySelector('.left').textContent = n.dataset.wait;
        n.querySelector('.bar').style.width = '4%';
      });
      if (step >= 2 && step < 3) {
        const remaining = nodes.map(n => Number(n.dataset.wait));
        nodes.forEach(n => n.classList.add('asleep'));
        later(() => {
          let done = false;
          nodes.forEach((n, i) => {
            if (remaining[i] > 0) {
              remaining[i] -= 1;
              n.querySelector('.left').textContent = remaining[i];
              const total = Number(n.dataset.wait);
              n.querySelector('.bar').style.width = `${((total - remaining[i]) / total) * 100}%`;
              if (remaining[i] === 0) { n.classList.remove('asleep'); n.classList.add('winner'); done = true; }
            }
          });
          if (done) clearSceneTimers();
        }, 320, true);
      } else if (step >= 3) {
        nodes.forEach(n => {
          const isWinner = n.dataset.poet === 'B';
          n.querySelector('.left').textContent = isWinner ? '0' : String(Number(n.dataset.wait) - 3);
          n.querySelector('.bar').style.width = isWinner ? '100%' : '30%';
          n.classList.toggle('winner', isWinner);
        });
      }
    }

    if (mode === 'poi') {
      qa('[data-poi] .bar').forEach(b => { b.style.width = step >= 1 ? `${b.dataset.w}%` : '6%'; });
      qa('[data-poi]').forEach(n => n.classList.toggle('winner', step >= 3 && n.dataset.poi === 'B'));
    }
  }

  function runPosDraw() {
    const vals = qa('[data-val]');
    let hops = 0;
    const maxHops = 14 + Math.floor(Math.random() * 6);
    /* Weighted final pick. */
    const r = Math.random() * 100;
    const finalId = r < 68 ? 'A' : r < 90 ? 'B' : r < 97 ? 'C' : 'D';
    vals.forEach(v => v.classList.remove('winner'));
    later(() => {
      vals.forEach(v => v.classList.remove('scanning'));
      const target = hops < maxHops ? vals[hops % vals.length] : q(`[data-val="${finalId}"]`);
      target.classList.add('scanning');
      hops += 1;
      if (hops > maxHops) {
        clearSceneTimers();
        target.classList.remove('scanning');
        target.classList.add('winner');
        state.posWins[finalId] += 1;
        state.posDraws += 1;
        state.lastPosWinner = finalId;
        vals.forEach(v => { v.querySelector('.wins').textContent = state.posWins[v.dataset.val]; });
        q('#drawSummary').textContent = `${state.posDraws} draw(s): A ${state.posWins.A}, B ${state.posWins.B}, C ${state.posWins.C}, D ${state.posWins.D}. Larger stake, more frequent selection.`;
      }
    }, 90, true);
  }

  /* =========================================================
     Scene 4: interledger packet journey
     ========================================================= */

  function mountInterledger(holder) {
    const success = state.interledgerOutcome === 'success';
    holder.innerHTML = `
      <div class="mode-switcher">
        <button type="button" data-outcome="success" class="${success ? 'active' : ''}">Successful payment</button>
        <button type="button" data-outcome="reject" class="${!success ? 'active' : ''}">Rejected payment</button>
      </div>
      <div class="packet-stage panel">
        ${linksSvg([[16, 30, 50, 30, 'fwd'], [50, 30, 84, 30, 'fwd'], [84, 66, 50, 66, 'ret'], [50, 66, 16, 66, 'ret'], [84, 38, 84, 58, 'turn'], [16, 58, 16, 40, 'turn']])}
        <div class="ledger-box ledger-a" style="left:16%;top:30%"><h3>Ledger A</h3><p><strong>Alice</strong> sends value from this network.</p><p class="reserve">Balance reserved while the condition is checked.</p></div>
        <div class="ledger-box connector" style="left:50%;top:30%"><h3>Connector</h3><p>Routes packets between ledgers and may charge a fee.</p><p class="fee">fee: 0.1%</p></div>
        <div class="ledger-box ledger-b" style="left:84%;top:30%"><h3>Ledger B</h3><p><strong>Bob</strong> receives value if the condition is fulfilled.</p><p class="reserve">Different network, different ledger.</p></div>
        <div class="packet" id="ilPacket">Prepare</div>
        <div class="interledger-legend">
          <div class="legend-item"><b>Prepare</b>Proposes the payment and condition.</div>
          <div class="legend-item"><b>Fulfil</b>Confirms the condition was satisfied.</div>
          <div class="legend-item"><b>Reject</b>Stops the payment if it cannot be completed.</div>
        </div>
      </div>
      <div class="result-callout visible"><h3>Student takeaway</h3><p>Interledger is about connecting independent ledgers. The connector helps value move across networks without forcing both sides to use the same blockchain.</p></div>`;

    qa('[data-outcome]').forEach(btn => btn.addEventListener('click', () => {
      state.interledgerOutcome = btn.dataset.outcome;
      renderGen += 1;
      mountInterledger(holder);
      deferUpdate(scenes[3]);
    }));
  }

  function updateInterledger(step) {
    const success = state.interledgerOutcome === 'success';
    const packet = q('#ilPacket');
    const stops = [
      { x: 16, y: 30, label: 'Prepare', cls: '', show: false },
      { x: 50, y: 30, label: 'Prepare', cls: '', show: true },
      { x: 84, y: 30, label: 'Prepare', cls: '', show: true },
      { x: 50, y: 66, label: success ? 'Fulfil' : 'Reject', cls: success ? 'success' : 'reject', show: true },
      { x: 16, y: 66, label: success ? 'Fulfil' : 'Reject', cls: success ? 'success' : 'reject', show: true }
    ];
    const s = stops[Math.min(step, stops.length - 1)];
    packet.className = `packet ${s.cls} ${s.show ? 'visible' : ''}`;
    packet.style.left = `${s.x}%`;
    packet.style.top = `${s.y}%`;
    packet.textContent = s.label;
    qa('.link.fwd').forEach((l, i) => l.classList.toggle('live', step >= i + 1));
    qa('.link.turn').forEach(l => l.classList.toggle('live', step >= 3));
    qa('.link.ret').forEach((l, i) => l.classList.toggle('live', step >= i + 3));
    q('.connector').classList.toggle('focus', step === 2);
    q('.ledger-b').classList.toggle('focus', step === 3 && success);
    q('.ledger-b').classList.toggle('fail', step >= 3 && !success);
    q('.ledger-a').classList.toggle('focus', step >= 4 && success);
    q('.ledger-a').classList.toggle('fail', step >= 4 && !success);
  }

  /* =========================================================
     Scene 5: Hyperledger Fabric
     ========================================================= */

  function mountFabric(holder) {
    const success = state.fabricOutcome === 'success';
    holder.innerHTML = `
      <div class="mode-switcher">
        <button type="button" data-fabric="success" class="${success ? 'active' : ''}">Policy satisfied</button>
        <button type="button" data-fabric="fail" class="${!success ? 'active' : ''}">Policy fails</button>
      </div>
      <div class="fabric-stage">
        <aside class="ledger-definition panel">
          <h3>Ledger</h3>
          <p>A ledger is the shared record of transactions and current state.</p>
          <div class="mini-ledger">
            <div class="ledger-row"><span>1</span><div>Shipment record created</div></div>
            <div class="ledger-row"><span>2</span><div>Temperature report added</div></div>
            <div class="ledger-row"><span>3</span><div>Delivery accepted</div></div>
            <div class="ledger-row pending" id="newLedgerRow"><span>4</span><div>${success ? 'New transaction committed' : 'Transaction rejected: policy not met'}</div></div>
          </div>
          <div class="explainer-box"><strong>Simple meaning:</strong> the ledger is the record. It is not the whole platform.</div>
        </aside>
        <section class="fabric-definition panel">
          <h3>Hyperledger Fabric network</h3>
          <p>Fabric adds identities, organisations, channels, endorsement policies, ordering and validation around the ledger.</p>
          <div class="fabric-flow">
            <div class="channel-tag">Channel: SupplyChain-A</div>
            ${linksSvg([
              [16, 28, 45, 16, 'f1'], [16, 34, 45, 46, 'f1'],
              [58, 16, 76, 30, 'f2'], [58, 46, 76, 34, 'f2'],
              [76, 42, 48, 76, 'f3'], [52, 80, 74, 82, 'f4']
            ])}
            ${fabricNode('client', '💼', 'Client App', 'submits proposal', 12, 30)}
            ${fabricNode('endorser1', '🏢', 'Endorser 1', 'Org A signs', 52, 14)}
            ${fabricNode('endorser2', '🏭', 'Endorser 2', 'Org B signs', 52, 46)}
            ${fabricNode('orderer', '📦', 'Consenter / Orderer', 'orders block', 84, 30)}
            ${fabricNode('committer', '✅', 'Committer', 'validates policy', 44, 80)}
            ${fabricNode('ledgercopy', '📘', 'Ledger Copy', 'updated if valid', 84, 82)}
            <div class="policy-box" id="policyBox"><strong>Endorsement policy:</strong> Org A AND Org B must endorse.</div>
          </div>
        </section>
      </div>
      <div class="result-callout visible"><h3>Student takeaway</h3><p>Hyperledger Fabric is not just a ledger. It is an enterprise blockchain framework that manages identities, permissions, endorsement policies and shared ledgers across known organisations.</p></div>`;

    qa('[data-fabric]').forEach(btn => btn.addEventListener('click', () => {
      state.fabricOutcome = btn.dataset.fabric;
      renderGen += 1;
      mountFabric(holder);
      deferUpdate(scenes[4]);
    }));
  }

  function fabricNode(id, icon, title, detail, x, y) {
    return `<div class="fabric-node" id="${id}" style="left:${x}%;top:${y}%">` +
      `<span class="icon">${icon}</span><strong>${title}</strong><small>${detail}</small></div>`;
  }

  function updateFabric(step) {
    const success = state.fabricOutcome === 'success';
    const on = (id, cond, cls) => {
      const n = q(`#${id}`);
      n.classList.toggle('live', cond);
      n.classList.toggle('approved', cond && cls === 'ok');
      n.classList.toggle('failed', cond && cls === 'bad');
    };
    on('client', step >= 1);
    on('endorser1', step >= 2, 'ok');
    on('endorser2', step >= 2 && success, success ? 'ok' : undefined);
    q('#endorser2').classList.toggle('failed', step >= 2 && !success);
    on('orderer', step >= 3);
    on('committer', step >= 4, success ? 'ok' : 'bad');
    on('ledgercopy', step >= 4 && success, 'ok');
    q('#ledgercopy').classList.toggle('failed', step >= 4 && !success);
    setLive('.link.f1', step >= 1);
    setLive('.link.f2', step >= 3);
    setLive('.link.f3', step >= 4);
    setLive('.link.f4', step >= 4 && success);
    const policy = q('#policyBox');
    policy.classList.toggle('ok', step >= 4 && success);
    policy.classList.toggle('bad', step >= 4 && !success);
    policy.innerHTML = step >= 4
      ? `<strong>Endorsement policy:</strong> ${success
        ? 'Org A AND Org B must endorse. Both signatures are present, so the transaction is committed.'
        : 'Org A AND Org B must endorse. Only one signature is present, so the transaction is rejected.'}`
      : '<strong>Endorsement policy:</strong> Org A AND Org B must endorse.';
    const newRow = q('#newLedgerRow');
    newRow.classList.toggle('committed', step >= 4 && success);
    newRow.classList.toggle('rejected', step >= 4 && !success);
  }

  /* ---------- boot ---------- */
  setScene(0);
}());
