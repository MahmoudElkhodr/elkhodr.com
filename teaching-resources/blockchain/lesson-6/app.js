const lessons = [
  {
    kicker: 'Challenge 1',
    title: 'Solidity to EVM',
    badge: 'Compile, deploy and execute',
    steps: [
      {
        title: 'Build the execution pipeline',
        text: 'A smart contract starts as Solidity source code, but the EVM does not execute Solidity directly. Tap the four cards in the order the code travels from source to execution.',
        concept: 'Solidity source → compiler → bytecode → EVM. Compilation is the bridge between high-level Solidity and the lower-level instructions the EVM can execute.',
        render: renderPipeline
      },
      {
        title: 'Read call or state-changing call?',
        text: 'The Week 5 primer introduced the difference between reading contract state and changing it. Inspect the two functions and choose the call that reads state without changing it.',
        concept: 'A view function reads contract state. A state-changing function must execute as a transaction and can update persistent state.',
        render: renderReadWrite
      },
      {
        title: 'Deploying creates a contract account',
        text: 'Compilation gives us bytecode. Deployment sends that bytecode in an Ethereum transaction. Trigger deployment and watch the constructor run once as a new contract account is created.',
        concept: 'A deployed contract is not just a local program object: it has a blockchain address, persistent state and code that can be invoked by later transactions.',
        render: renderDeploy
      }
    ]
  },
  {
    kicker: 'Challenge 2',
    title: 'Build the Vote Rules',
    badge: 'Mappings, require, branches and events',
    steps: [
      {
        title: 'A mapping remembers each address separately',
        text: 'SimpleVote uses mapping(address => bool) to remember whether each caller address has voted. Record a vote for Account 1 and watch which mapping entry changes.',
        concept: 'The address is the key and the Boolean is the value. A new address reads as false until the contract stores another value for that address.',
        render: renderMapping
      },
      {
        title: 'Choose the rule that must be true',
        text: 'Before changing state, the contract must reject an address that has already voted. Choose the expression that means “the current caller has not voted”.',
        concept: 'require describes the condition that must be true for execution to continue. The ! operator reverses the stored Boolean value.',
        render: renderVoteRule
      },
      {
        title: 'Try to trick the voting contract',
        text: 'Run the same sequence used in the Week 6 tutorial: invalid candidate, valid vote, repeated vote, then a different address. Watch which calls revert and which state changes survive.',
        concept: 'Validate first, then change state. A failed require reverts the call, so the vote counters and hasVoted state remain unchanged.',
        render: renderVotingMission
      },
      {
        title: 'State and event evidence are different',
        text: 'After a successful vote, the contract has updated state and emits VoteCast. Select the item that is an event log rather than persistent state.',
        concept: 'State is used by future contract calls. An event is transaction log evidence for off-chain observation. A transaction receipt contains execution outcome and metadata.',
        render: renderEvidence
      }
    ]
  },
  {
    kicker: 'Challenge 3',
    title: 'Beat the Time Lock',
    badge: 'Payable deployment, ownership and blockchain time',
    steps: [
      {
        title: 'Deployment has three different inputs',
        text: 'TimeLockedVault needs a waiting period, an Ether deposit and a deploying account. Identify which Remix input becomes msg.value and which input determines owner.',
        concept: 'Constructor parameter, Value field and selected account are separate parts of the same deployment transaction: waitTimeInSeconds, msg.value and msg.sender.',
        render: renderVaultInputs
      },
      {
        title: 'Two rules can stop withdrawal',
        text: 'The vault is funded and locked for 120 seconds. Try Account 2 first, then try Account 1 before the deadline. Both should fail, but for different reasons.',
        concept: 'The contract checks caller identity and blockchain time independently. A failed rule prevents the transfer and preserves the existing vault state.',
        render: renderVaultAttempts
      },
      {
        title: 'Advance blockchain time',
        text: 'Use the button to advance the simulated block timestamp in 30-second steps. Watch the comparison block.timestamp >= unlockTime change from false to true.',
        concept: 'The stored unlockTime is a future timestamp. Withdrawal is permitted only when the current block timestamp has reached or passed that deadline.',
        render: renderClock
      },
      {
        title: 'Withdraw after unlock, then test the empty vault',
        text: 'Once the deadline is reached, withdraw as the owner. Then attempt a second withdrawal and inspect why it fails.',
        concept: 'A successful withdrawal transfers the contract balance and leaves the vault at zero. A later call fails the amount > 0 rule with “Vault is empty”.',
        render: renderFinalVault
      }
    ]
  }
];

const points = {
  pipeline: false,
  read: false,
  mapping: false,
  rule: false,
  voting: false,
  evidence: false,
  inputs: false
};

const runtime = {
  pipelineOrder: [],
  mappingMarked: false,
  voting: { account: 1, a: 0, b: 0, voted: {1:false,2:false}, flags:{invalid:false,validA1:false,repeat:false,validA2:false} },
  evidencePicked: false,
  inputStage: 0,
  vaultAttempts: { nonOwner:false, early:false },
  clock: 0,
  vaultBalance: 1,
  finalWithdrawn: false
};

let lessonIndex = 0;
let stepIndex = 0;

const el = {
  missionCount: document.getElementById('mission-count'),
  stepCount: document.getElementById('step-count'),
  scoreCount: document.getElementById('score-count'),
  kicker: document.getElementById('lesson-kicker'),
  title: document.getElementById('lesson-title'),
  badge: document.getElementById('lesson-badge'),
  stepLabel: document.getElementById('step-label'),
  stepTitle: document.getElementById('step-title'),
  stepText: document.getElementById('step-text'),
  concept: document.getElementById('concept-box'),
  scene: document.getElementById('scene'),
  dots: document.getElementById('step-dots'),
  tabs: [...document.querySelectorAll('.mission-tab')],
  back: document.getElementById('back-button'),
  next: document.getElementById('next-button'),
  backBottom: document.getElementById('back-button-bottom'),
  nextBottom: document.getElementById('next-button-bottom'),
  restart: document.getElementById('restart-button')
};

function score() { return Object.values(points).filter(Boolean).length; }
function award(key) {
  if (!points[key]) {
    points[key] = true;
    el.scoreCount.textContent = `Score ${score()} / 7`;
    el.scoreCount.classList.remove('pop');
    void el.scoreCount.offsetWidth;
    el.scoreCount.classList.add('pop');
  }
}
function feedback(text, type='neutral') { return `<div class="feedback ${type}" role="status">${text}</div>`; }
function codeLine(text, cls='') { return `<span class="${cls}">${text}</span>`; }

function render() {
  const lesson = lessons[lessonIndex];
  const step = lesson.steps[stepIndex];
  el.missionCount.textContent = `Challenge ${lessonIndex + 1} of ${lessons.length}`;
  el.stepCount.textContent = `Step ${stepIndex + 1} of ${lesson.steps.length}`;
  el.scoreCount.textContent = `Score ${score()} / 7`;
  el.kicker.textContent = lesson.kicker;
  el.title.textContent = lesson.title;
  el.badge.textContent = lesson.badge;
  el.stepLabel.textContent = `Step ${stepIndex + 1}`;
  el.stepTitle.textContent = step.title;
  el.stepText.textContent = step.text;
  el.concept.innerHTML = `<strong>Key idea</strong><p>${step.concept}</p>`;
  el.scene.innerHTML = step.render();

  el.tabs.forEach((tab, i) => {
    const active = i === lessonIndex;
    tab.classList.toggle('active', active);
    if (active) tab.setAttribute('aria-current', 'step');
    else tab.removeAttribute('aria-current');
  });
  el.dots.innerHTML = lesson.steps.map((_, i) => `<button class="dot ${i === stepIndex ? 'active' : i < stepIndex ? 'done' : ''}" data-step="${i}" aria-label="Go to step ${i + 1}"></button>`).join('');
  el.dots.querySelectorAll('.dot').forEach(dot => dot.addEventListener('click', () => { stepIndex = Number(dot.dataset.step); render(); }));

  const first = lessonIndex === 0 && stepIndex === 0;
  const last = lessonIndex === lessons.length - 1 && stepIndex === lesson.steps.length - 1;
  el.back.disabled = el.backBottom.disabled = first;
  el.next.disabled = el.nextBottom.disabled = last;
  const label = stepIndex === lesson.steps.length - 1 && lessonIndex < lessons.length - 1 ? 'Next challenge →' : 'Next →';
  el.next.textContent = el.nextBottom.textContent = label;
}

function next() {
  const lesson = lessons[lessonIndex];
  if (stepIndex < lesson.steps.length - 1) stepIndex++;
  else if (lessonIndex < lessons.length - 1) { lessonIndex++; stepIndex = 0; }
  render();
}
function back() {
  if (stepIndex > 0) stepIndex--;
  else if (lessonIndex > 0) { lessonIndex--; stepIndex = lessons[lessonIndex].steps.length - 1; }
  render();
}
function resetCurrentChallenge() {
  if (lessonIndex === 0) runtime.pipelineOrder = [];
  if (lessonIndex === 1) {
    runtime.mappingMarked = false;
    runtime.voting = { account: 1, a: 0, b: 0, voted: {1:false,2:false}, flags:{invalid:false,validA1:false,repeat:false,validA2:false} };
    runtime.evidencePicked = false;
  }
  if (lessonIndex === 2) {
    runtime.inputStage = 0;
    runtime.vaultAttempts = { nonOwner:false, early:false };
    runtime.clock = 0;
    runtime.vaultBalance = 1;
    runtime.finalWithdrawn = false;
  }
  stepIndex = 0;
  render();
}

el.tabs.forEach(tab => tab.addEventListener('click', () => { lessonIndex = Number(tab.dataset.mission); stepIndex = 0; render(); }));
el.next.addEventListener('click', next); el.nextBottom.addEventListener('click', next);
el.back.addEventListener('click', back); el.backBottom.addEventListener('click', back);
el.restart.addEventListener('click', resetCurrentChallenge);
document.addEventListener('keydown', e => {
  if (['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) return;
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') back();
});

// Challenge 1 -----------------------------------------------------------------
function renderPipeline() {
  runtime.pipelineOrder = [];
  setTimeout(bindPipeline, 0);
  const items = [
    ['evm','🧠','EVM','Executes bytecode'],
    ['source','📝','Solidity source','Human-readable contract'],
    ['bytecode','0101','Bytecode','Lower-level instructions'],
    ['compiler','⚙️','Compiler','Converts Solidity']
  ];
  return `<div><p class="challenge-title">Tap the cards in the correct order</p>
    <div class="pipeline" id="pipeline">${items.map(([id,icon,name,desc]) => `<button class="pipe-node" data-id="${id}" type="button"><span class="num">?</span><span class="big">${icon}</span><strong>${name}</strong><small>${desc}</small></button>`).join('')}</div>
    <div class="pipe-line"><div class="pipe-flow" id="pipe-flow"></div></div>
    <p class="helper">Start with the code the developer writes. A wrong choice simply resets your attempt.</p>
    <div id="pipeline-feedback">${feedback('Choose the first stage.', 'neutral')}</div></div>`;
}
function bindPipeline() {
  const expected = ['source','compiler','bytecode','evm'];
  document.querySelectorAll('#pipeline .pipe-node').forEach(btn => btn.addEventListener('click', () => {
    const nextExpected = expected[runtime.pipelineOrder.length];
    if (btn.dataset.id !== nextExpected) {
      document.querySelectorAll('#pipeline .pipe-node').forEach(x => {x.classList.remove('good'); x.querySelector('.num').textContent='?';});
      btn.classList.add('bad'); setTimeout(() => btn.classList.remove('bad'), 500);
      runtime.pipelineOrder = [];
      document.getElementById('pipe-flow').style.width = '0%';
      document.getElementById('pipeline-feedback').innerHTML = feedback('Not quite. Start again with Solidity source code.', 'bad');
      return;
    }
    runtime.pipelineOrder.push(btn.dataset.id);
    btn.classList.add('good');
    btn.querySelector('.num').textContent = runtime.pipelineOrder.length;
    document.getElementById('pipe-flow').style.width = `${runtime.pipelineOrder.length * 25}%`;
    if (runtime.pipelineOrder.length === expected.length) {
      award('pipeline');
      document.getElementById('pipeline-feedback').innerHTML = feedback('Correct: Solidity → compiler → bytecode → EVM. +1', 'good');
    } else {
      document.getElementById('pipeline-feedback').innerHTML = feedback(`Correct. Now choose stage ${runtime.pipelineOrder.length + 1}.`, 'good');
    }
  }));
}

function renderReadWrite() {
  setTimeout(bindReadWrite,0);
  return `<div><p class="challenge-title">Which function reads state without changing it?</p>
    <div class="choice-grid">
      <button class="choice" data-read="yes" type="button"><span>👁️</span><strong>get()</strong><br><small>public view returns (uint)</small></button>
      <button class="choice" data-read="no" type="button"><span>✏️</span><strong>set(uint x)</strong><br><small>stores a new value</small></button>
    </div>
    <div class="code-card" style="margin-top:14px;">${codeLine('uint storeData;')}<br><br>${codeLine('function set(uint x) public { storeData = x; }')}<br>${codeLine('function get() public view returns (uint) { return storeData; }')}</div>
    <div id="read-feedback">${feedback('Choose one function.', 'neutral')}</div></div>`;
}
function bindReadWrite() {
  document.querySelectorAll('[data-read]').forEach(btn => btn.addEventListener('click', () => {
    const good = btn.dataset.read === 'yes';
    btn.classList.add(good ? 'good':'bad');
    if (good) { award('read'); document.getElementById('read-feedback').innerHTML = feedback('Correct. get() is a view call: it reads state without changing it. +1','good'); }
    else document.getElementById('read-feedback').innerHTML = feedback('set(x) changes persistent state, so it is the state-changing call.','bad');
  }));
}

function renderDeploy() {
  setTimeout(() => document.getElementById('deploy-btn').addEventListener('click', () => {
    document.getElementById('deploy-area').innerHTML = `<div class="deploy-stage"><div class="account-card pop"><span class="big">👤</span><h4>Account 1</h4><p>msg.sender during deployment</p></div><div class="deploy-arrow">→</div><div class="contract-account pop"><span class="big">📜</span><strong>Contract Account</strong><div class="address-chip">0xC0DE…A620</div><p>Constructor ran once<br>Persistent code + state now exist</p></div></div>${feedback('Deployment transaction accepted. The contract now has its own blockchain address.','good')}`;
  }),0);
  return `<div id="deploy-area"><p class="challenge-title">Create the contract account</p><div class="deploy-stage"><div class="account-card"><span class="big">👤</span><h4>Account 1</h4><p>Selected deployer</p></div><div class="deploy-arrow">→</div><div class="contract-account"><span class="big">📦</span><strong>Compiled bytecode</strong><p>Ready to deploy</p></div></div><button id="deploy-btn" class="vote-btn" style="margin-top:16px" type="button">🚀 Send deployment transaction</button>${feedback('The constructor will execute once during deployment.','neutral')}</div>`;
}

// Challenge 2 -----------------------------------------------------------------
function renderMapping() {
  setTimeout(() => document.getElementById('mark-vote').addEventListener('click', () => {
    runtime.mappingMarked = true; award('mapping');
    document.getElementById('map-a1').className='bool true'; document.getElementById('map-a1').textContent='true';
    document.getElementById('map-a2').className='bool false'; document.getElementById('map-a2').textContent='false';
    document.getElementById('mapping-feedback').innerHTML = feedback('Only Account 1 changed. Account 2 still has its own default false entry. +1','good');
  }),0);
  return `<div><p class="challenge-title">Watch one key change without changing the other</p><div class="mapping-board"><div class="map-card"><h4>Account 1 address</h4><div class="map-state"><span>hasVoted[A1]</span><span id="map-a1" class="bool ${runtime.mappingMarked?'true':'false'}">${runtime.mappingMarked?'true':'false'}</span></div></div><div class="map-card"><h4>Account 2 address</h4><div class="map-state"><span>hasVoted[A2]</span><span id="map-a2" class="bool false">false</span></div></div></div><div class="code-card" style="margin-top:14px;">mapping(address =&gt; bool) public hasVoted;</div><button id="mark-vote" class="vote-btn" style="margin-top:14px" type="button">Record Account 1 as having voted</button><div id="mapping-feedback">${feedback('Both addresses begin with the bool default value false.','neutral')}</div></div>`;
}

function renderVoteRule() {
  setTimeout(bindVoteRule,0);
  const opts = [
    ['bad','hasVoted[msg.sender]','The caller has already voted'],
    ['good','!hasVoted[msg.sender]','The caller has not voted'],
    ['bad','msg.sender == address(0)','The caller is the zero address']
  ];
  return `<div><p class="challenge-title">Which expression belongs inside the first require?</p><div class="rule-options">${opts.map(([kind,expr,meaning])=>`<button class="rule-btn" data-rule="${kind}" type="button"><code>${expr}</code><br><small>${meaning}</small></button>`).join('')}</div><div id="rule-feedback">${feedback('Remember: require states what must be true to continue.','neutral')}</div></div>`;
}
function bindVoteRule() {
  document.querySelectorAll('[data-rule]').forEach(btn => btn.addEventListener('click', () => {
    const good = btn.dataset.rule === 'good'; btn.classList.add(good?'good':'bad');
    if (good) { award('rule'); document.getElementById('rule-feedback').innerHTML=feedback('Correct. ! reverses true/false, so only an address whose stored value is false may continue. +1','good'); }
    else document.getElementById('rule-feedback').innerHTML=feedback('That expression does not mean “the caller has not voted”. Try again.','bad');
  }));
}

function renderVotingMission() {
  setTimeout(bindVoting,0);
  return votingMarkup('Follow the sequence: A1→3, A1→1, A1→2 again, then switch to A2→2.');
}
function votingMarkup(message) {
  const v=runtime.voting, f=v.flags;
  return `<div><p class="challenge-title">Try to trick the contract</p>
    <div class="badge-row"><span class="mini-badge">Selected caller: Account ${v.account}</span><button id="switch-account" class="vote-btn" type="button">Switch to Account ${v.account===1?2:1}</button><span class="mini-badge">hasVoted[A1] = ${v.voted[1]}</span><span class="mini-badge">hasVoted[A2] = ${v.voted[2]}</span></div>
    <div class="vote-stage" style="margin-top:13px"><div class="candidate"><strong>Candidate A</strong><div class="count">${v.a}</div></div><div class="candidate"><strong>Candidate B</strong><div class="count">${v.b}</div></div></div>
    <div class="vote-buttons"><button class="vote-btn" data-candidate="1" type="button">Vote 1</button><button class="vote-btn" data-candidate="2" type="button">Vote 2</button><button class="vote-btn invalid" data-candidate="3" type="button">Try 3</button></div>
    <div class="badge-row" style="margin-top:12px"><span class="mini-badge">${f.invalid?'✓':'○'} invalid candidate</span><span class="mini-badge">${f.validA1?'✓':'○'} A1 valid vote</span><span class="mini-badge">${f.repeat?'✓':'○'} repeat rejected</span><span class="mini-badge">${f.validA2?'✓':'○'} A2 valid vote</span></div>
    <div id="voting-feedback">${feedback(message,'neutral')}</div></div>`;
}
function bindVoting() {
  const sw=document.getElementById('switch-account'); if(sw) sw.addEventListener('click',()=>{runtime.voting.account=runtime.voting.account===1?2:1; refreshVoting('Caller changed. msg.sender will now be the selected account address.');});
  document.querySelectorAll('[data-candidate]').forEach(btn=>btn.addEventListener('click',()=>processVote(Number(btn.dataset.candidate))));
}
function refreshVoting(msg,type='neutral') { el.scene.innerHTML=votingMarkup(msg); bindVoting(); const fb=document.getElementById('voting-feedback'); if(fb) fb.className=`feedback ${type}`; }
function processVote(candidate) {
  const v=runtime.voting, acct=v.account, f=v.flags;
  if (candidate!==1 && candidate!==2) {
    f.invalid=true;
    refreshVoting('Reverted: Invalid candidate. No state changed.', 'bad');
    checkVotingCompletion();
    return;
  }
  if (v.voted[acct]) {
    if (acct===1) f.repeat=true;
    refreshVoting('Reverted: Already voted. The counters remain unchanged.', 'bad');
    checkVotingCompletion();
    return;
  }
  v.voted[acct]=true;
  if(candidate===1)v.a++; else v.b++;
  if(acct===1) f.validA1=true; else f.validA2=true;
  refreshVoting(`Success: Account ${acct} voted for candidate ${candidate}. State updated and VoteCast emitted.`, 'good');
  checkVotingCompletion();
}
function checkVotingCompletion(){
  const f=runtime.voting.flags;
  if(f.invalid && f.validA1 && f.repeat && f.validA2){
    award('voting');
    const box=document.getElementById('voting-feedback');
    if(box) box.outerHTML=feedback('Mission complete: you observed invalid input, a valid vote, a repeated-vote revert and a separate-address success. +1','good');
  }
}

function renderEvidence() {
  setTimeout(bindEvidence,0);
  return `<div><p class="challenge-title">Which item is the event log?</p><div class="evidence-grid"><button class="evidence" data-evidence="state" type="button"><span class="icon">🧮</span><strong>candidateA = 1</strong><p>Used by later calls</p></button><button class="evidence" data-evidence="event" type="button"><span class="icon">📣</span><strong>VoteCast(A1, 1)</strong><p>Recorded in transaction logs</p></button><button class="evidence" data-evidence="receipt" type="button"><span class="icon">🧾</span><strong>Transaction receipt</strong><p>Status, gas and logs</p></button></div><div id="evidence-feedback">${feedback('Choose the event evidence.','neutral')}</div></div>`;
}
function bindEvidence(){document.querySelectorAll('[data-evidence]').forEach(btn=>btn.addEventListener('click',()=>{const good=btn.dataset.evidence==='event';btn.classList.add(good?'good':'bad');if(good){award('evidence');document.getElementById('evidence-feedback').innerHTML=feedback('Correct. VoteCast is an event log; candidateA is state and the receipt is execution evidence. +1','good');}else document.getElementById('evidence-feedback').innerHTML=feedback(btn.dataset.evidence==='state'?'candidateA is persistent contract state, not an event.':'The receipt contains execution metadata and may include logs, but VoteCast is the event itself.','bad');}));}

// Challenge 3 -----------------------------------------------------------------
function renderVaultInputs() {
  runtime.inputStage=0;
  setTimeout(bindVaultInputs,0);
  return `<div><p class="challenge-title" id="input-question">1 of 2: Which Remix input supplies <code>msg.value</code>?</p><div class="choice-grid"><button class="choice" data-input="wait" type="button"><span>⏱️</span><strong>Constructor input: 120</strong><small>waitTimeInSeconds</small></button><button class="choice" data-input="value" type="button"><span>💰</span><strong>Value: 1 Ether</strong><small>Ether attached to deployment</small></button><button class="choice" data-input="account" type="button"><span>👤</span><strong>Selected Account 1</strong><small>Caller of deployment</small></button><button class="choice" data-input="deploy" type="button"><span>🚀</span><strong>Deploy button</strong><small>Sends the transaction</small></button></div><div id="input-feedback">${feedback('First identify the source of msg.value.','neutral')}</div></div>`;
}
function bindVaultInputs(){document.querySelectorAll('[data-input]').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.input;if(runtime.inputStage===0){if(id==='value'){btn.classList.add('good');runtime.inputStage=1;document.getElementById('input-question').innerHTML='2 of 2: Which input becomes <code>msg.sender</code> and therefore <code>owner</code>?';document.getElementById('input-feedback').innerHTML=feedback('Correct: Value = 1 Ether becomes msg.value. Now identify the owner.','good');}else{btn.classList.add('bad');document.getElementById('input-feedback').innerHTML=feedback('Not this one. msg.value is the Ether attached to the transaction.','bad');}}else{if(id==='account'){btn.classList.add('good');runtime.inputStage=2;award('inputs');document.getElementById('input-feedback').innerHTML=feedback('Correct. Account 1 is msg.sender, so the constructor stores Account 1 as owner. +1','good');}else{btn.classList.add('bad');document.getElementById('input-feedback').innerHTML=feedback('The owner comes from msg.sender: the account selected when Deploy is pressed.','bad');}}}));}

function renderVaultAttempts() {
  setTimeout(bindVaultAttempts,0);
  const a=runtime.vaultAttempts;
  return `<div><p class="challenge-title">The vault holds 1 test ETH and unlockTime is 120 seconds away</p><div class="vault"><div class="door">🔐</div><div class="funds">💰</div><div class="status">Balance: 1 ETH • Locked</div></div><div class="attempt-row" style="margin-top:14px"><button id="nonowner" class="attempt ${a.nonOwner?'bad':''}" type="button"><strong>👤 Account 2 withdraw</strong><p>Test the owner rule</p></button><button id="early" class="attempt ${a.early?'bad':''}" type="button"><strong>👤 Account 1 withdraw now</strong><p>Test the time rule</p></button></div><div id="attempt-feedback">${feedback(a.nonOwner&&a.early?'Both failures were expected and the 1 ETH remains in the vault.':'Run both failed cases.','neutral')}</div></div>`;
}
function bindVaultAttempts(){document.getElementById('nonowner').addEventListener('click',()=>{runtime.vaultAttempts.nonOwner=true;document.getElementById('nonowner').classList.add('bad');document.getElementById('attempt-feedback').innerHTML=feedback('Reverted: Not owner. msg.sender does not equal owner. Balance stays 1 ETH.','bad');});document.getElementById('early').addEventListener('click',()=>{runtime.vaultAttempts.early=true;document.getElementById('early').classList.add('bad');document.getElementById('attempt-feedback').innerHTML=feedback('Reverted: Too early. Owner is correct, but block.timestamp has not reached unlockTime.','bad');});}

function renderClock() {
  if (runtime.clock>120) runtime.clock=120;
  setTimeout(bindClock,0);
  return clockMarkup();
}
function clockMarkup() {
  const t=runtime.clock, pass=t>=120;
  return `<div><p class="challenge-title">Advance the simulated block timestamp</p><div class="time-display">Elapsed: ${t} s</div><div class="clock-track"><div id="clock-fill" class="clock-fill" style="width:${Math.max(4,t/120*100)}%"></div></div><div class="clock-labels"><span>Deployment: 0 s</span><span>unlockTime: 120 s</span></div><div class="code-card" style="margin-top:14px"><span class="${pass?'goodline':'badline'}">block.timestamp &gt;= unlockTime → ${pass?'true':'false'}</span></div><button id="advance-time" class="time-btn" style="margin-top:14px" ${pass?'disabled':''} type="button">⏩ Advance 30 seconds</button><div id="clock-feedback">${feedback(pass?'Deadline reached. The time rule can now pass.':'Before 120 seconds, the owner still receives “Too early”.',pass?'good':'neutral')}</div></div>`;
}
function bindClock(){const btn=document.getElementById('advance-time');if(btn)btn.addEventListener('click',()=>{runtime.clock=Math.min(120,runtime.clock+30);el.scene.innerHTML=clockMarkup();bindClock();});}

function renderFinalVault() {
  setTimeout(bindFinalVault,0);
  return finalVaultMarkup();
}
function finalVaultMarkup(msg = runtime.clock >= 120
  ? 'The deadline has been reached. Withdraw as Account 1.'
  : 'The deadline has not been reached. Return to the previous step and advance blockchain time.') {
  const bal=runtime.vaultBalance;
  const unlocked = runtime.clock >= 120;
  return `<div><p class="challenge-title">Final state test</p><div class="vault"><div class="door">${bal>0?(unlocked?'🔓':'🔐'):'🧰'}</div>${bal>0?'<div class="funds float">💰</div>':''}<div class="status">Balance: ${bal} ETH • Time rule: ${unlocked?'passed':'blocked'}</div></div><div class="vote-buttons"><button id="owner-withdraw" class="vote-btn" type="button">Account 1: withdraw</button></div><div id="final-feedback">${feedback(msg, bal===0?'good':unlocked?'neutral':'bad')}</div>${runtime.finalWithdrawn?'<div class="event-log" style="margin-top:12px">Transaction status: success<br>owner received 1 test ETH<br>contract balance: 0 ETH</div>':''}</div>`;
}
function bindFinalVault(){document.getElementById('owner-withdraw').addEventListener('click',()=>{if(runtime.clock<120){document.getElementById('final-feedback').innerHTML=feedback('Reverted: Too early. block.timestamp has not reached unlockTime.','bad');}else if(runtime.vaultBalance>0){runtime.vaultBalance=0;runtime.finalWithdrawn=true;el.scene.innerHTML=finalVaultMarkup('Success. The owner passed both rules and the vault balance became 0. Click withdraw once more to test the empty-vault rule.');bindFinalVault();}else{document.getElementById('final-feedback').innerHTML=feedback('Reverted: Vault is empty. The first successful withdrawal already removed the balance.','bad');}});}

render();
