const lessons = [
  {
    kicker: 'Lesson 1',
    title: 'Where Does Control Live?',
    badge: 'Centralised, distributed and decentralised systems',
    steps: [
      {
        label: 'Step 1',
        title: 'The same service can be organised in different ways',
        text: 'Imagine a simple digital service used by many people, such as file sharing, payments or messaging. The user experience might look similar, but the system architecture behind it can be centralised, distributed or decentralised.',
        concept: 'The location of data and processing is only part of the story. We also need to ask who controls decisions and who becomes a single point of failure.',
        render: () => simpleRow([
          nodeCard('👤','User A','Requests the service','pop'),
          arrow(),
          nodeCard('🌐','Digital service','Could be organised in different ways','pulse'),
          arrow(),
          nodeCard('👤','User B','Receives the result','pop')
        ], infoBanner('We will now compare three ways of organising the same kind of service.'))
      },
      {
        label: 'Step 2',
        title: 'Centralised system: one centre controls the service',
        text: 'In a centralised system, user requests go to one central server. That server stores the main data, applies the rules and decides how the service behaves.',
        concept: 'Centralisation means one authority has primary control over the system.',
        render: () => networkScene('central')
      },
      {
        label: 'Step 3',
        title: 'The central server handles requests for everyone',
        text: 'Every client depends on the central server. This can make security, updates and management easier because there is one main place to control.',
        concept: 'Centralised systems are often efficient and easier to administer, but they concentrate control in one place.',
        render: () => networkScene('central-active')
      },
      {
        label: 'Step 4',
        title: 'When the centre fails, the whole service can stop',
        text: 'If the central server goes down, clients may lose access even if their own devices still work. This is the classic single-point-of-failure problem.',
        concept: 'A single point of failure is a component whose failure can stop the whole system.',
        render: () => networkScene('central-fail')
      },
      {
        label: 'Step 5',
        title: 'Distributed system: several machines share the work',
        text: 'Now the service is spread across several servers or sites. The workload is distributed, so one failed machine does not necessarily stop the whole service.',
        concept: 'Distributed refers to where the work happens. It does not automatically mean that authority is decentralised.',
        render: () => distributedServers('normal')
      },
      {
        label: 'Step 6',
        title: 'A distributed service can still be centrally controlled',
        text: 'Even with many servers, one organisation may still own the infrastructure, define the rules and control updates. The system is distributed, but governance remains centralised.',
        concept: 'Distributed and decentralised are not synonyms. A system can be distributed in infrastructure but centralised in control.',
        render: () => distributedServers('controlled')
      },
      {
        label: 'Step 7',
        title: 'Decentralised system: peers communicate without one controlling server',
        text: 'In a decentralised design, many nodes can communicate directly and no single node has complete authority over the whole network. Decisions are spread across peers.',
        concept: 'Decentralisation is about reducing or removing one dominant authority from the decision process.',
        render: () => networkScene('decentral')
      },
      {
        label: 'Step 8',
        title: 'Decentralisation improves resilience but raises coordination demands',
        text: 'If one peer fails, the rest of the network can continue. However, decentralised systems usually require more coordination, more messaging and more complex agreement processes than a simple central server.',
        concept: 'Centralised designs can simplify coordination and improve efficiency. Decentralised designs can improve resilience and shared control, with added coordination costs.',
        render: () => networkScene('decentral-fail')
      }
    ]
  },
  {
    kicker: 'Lesson 2',
    title: 'From Intermediary to Blockchain',
    badge: 'Disintermediation and blockchain suitability',
    steps: [
      {
        label: 'Step 1',
        title: 'Traditional transfer: several intermediaries sit in the middle',
        text: 'Imagine Alice sending money to Bob across borders. In a traditional process, several intermediaries may participate, such as sending banks, receiving banks and correspondent institutions.',
        concept: 'An intermediary performs coordination, verification or recordkeeping between participants.',
        render: () => traditionalFlow('start')
      },
      {
        label: 'Step 2',
        title: 'Each intermediary keeps its own records and checks',
        text: 'Each party usually updates its own ledger or database, checks its own rules and may wait for another institution before the transfer completes.',
        concept: 'Traditional systems often rely on multiple separate databases rather than one shared ledger.',
        render: () => traditionalFlow('ledger')
      },
      {
        label: 'Step 3',
        title: 'Intermediaries can add cost, delay and repeated trust assumptions',
        text: 'Intermediaries may provide valuable services, but they also add fees, reconciliation overhead and dependencies. Each organisation must trust the others to maintain correct records.',
        concept: 'Disintermediation means removing or changing one or more intermediary roles in a process.',
        render: () => traditionalFlow('fees')
      },
      {
        label: 'Step 4',
        title: 'Blockchain alternative: one signed transaction reaches a network',
        text: 'Instead of updating several isolated ledgers, Alice can create one signed transaction and broadcast it to a blockchain network. Network participants then verify and record it according to shared rules.',
        concept: 'Blockchain replaces some intermediary verification with digital signatures, consensus and a shared ledger.',
        render: () => blockchainFlow('broadcast')
      },
      {
        label: 'Step 5',
        title: 'Verified transactions become part of a shared ledger',
        text: 'When the network accepts the transaction, nodes append it to the shared ledger. Bob and other authorised participants can rely on the same agreed history rather than several different ledgers.',
        concept: 'A blockchain is append-oriented: new transactions are added to the ledger rather than silently replacing old history.',
        render: () => blockchainFlow('ledger')
      },
      {
        label: 'Step 6',
        title: 'Blockchain is not always the right answer',
        text: 'Before using blockchain, we should ask whether one trusted organisation already controls updates, whether the parties trust one another and whether high throughput is more important than shared immutability.',
        concept: 'A traditional database remains preferable in many scenarios, especially when trust and central control are already established.',
        render: () => decisionFlow()
      },
      {
        label: 'Step 7',
        title: 'A blockchain solution can distribute storage, communication and computation',
        text: 'Blockchain involves more than a ledger. A particular design may distribute where records are stored, how transactions are communicated and where business logic is executed or verified.',
        concept: 'The storage, communication and computation layers help us inspect what a blockchain-based system actually distributes or decentralises rather than assuming every layer is decentralised.',
        render: () => layerScene()
      }
    ]
  },
  {
    kicker: 'Lesson 3',
    title: 'Smart Contract Escrow',
    badge: 'Programmable business logic and DApps',
    steps: [
      {
        label: 'Step 1',
        title: 'A DApp combines interface, wallet, contract and blockchain',
        text: 'A decentralised application is not only a smart contract. It usually includes a web or mobile interface, a wallet for signing requests, a smart contract for business rules and a blockchain backend for recording outcomes.',
        concept: 'The smart contract is one layer in a broader decentralised application stack.',
        render: () => architectureScene()
      },
      {
        label: 'Step 2',
        title: 'The escrow contract stores clear rules',
        text: 'Now imagine Alice buying a laptop from Bob. The smart contract contains the rule: if payment is deposited and delivery is confirmed, release payment to Bob. If delivery is not confirmed by the deadline, refund Alice.',
        concept: 'A smart contract is a software program that executes business logic when specified conditions are met.',
        render: () => escrowScene('rules')
      },
      {
        label: 'Step 3',
        title: 'Alice deposits the payment into the contract',
        text: 'Alice sends payment to the smart contract rather than directly to Bob. The contract now holds the funds according to the published rules.',
        concept: 'The contract can act as a neutral digital escrow that follows predefined logic.',
        render: () => escrowScene('deposit')
      },
      {
        label: 'Step 4',
        title: 'Bob ships the laptop, but the contract still waits',
        text: 'Bob ships the product. However, shipment alone does not trigger payment. The contract waits for the delivery condition to be satisfied.',
        concept: 'Smart contracts respond to defined conditions, not to assumptions or promises.',
        render: () => escrowScene('ship')
      },
      {
        label: 'Step 5',
        title: 'An oracle or external data source reports the outcome',
        text: 'The blockchain cannot directly observe the physical world. A trusted data source, often called an oracle, may report that delivery succeeded or that a timeout occurred.',
        concept: 'Smart contracts often need external data to connect digital rules with real-world events.',
        render: () => escrowScene('oracle')
      },
      {
        label: 'Step 6',
        title: 'Successful delivery releases payment to Bob',
        text: 'When the contract receives a valid delivery confirmation, the payment is released to Bob and the result is recorded on the blockchain.',
        concept: 'Once conditions are met, the contract can execute deterministically according to its stored rules.',
        render: () => escrowScene('success')
      },
      {
        label: 'Step 7',
        title: 'If delivery fails or times out, the contract refunds Alice',
        text: 'If the expected delivery confirmation never arrives by the deadline, the contract can execute the alternative rule and return the payment to Alice.',
        concept: 'Smart contracts can enforce conditional outcomes, not only successful transfers.',
        render: () => escrowScene('refund')
      },
      {
        label: 'Step 8',
        title: 'Blockchain nodes verify and record the final state',
        text: 'The final contract action becomes part of the blockchain state. Other participants can inspect the outcome, and the DApp frontend can show the updated result to its users.',
        concept: 'Smart contracts provide computation on the blockchain, while the DApp frontend presents the result to users.',
        render: () => escrowScene('recorded')
      }
    ]
  }
];

const el = {
  missionCount: document.getElementById('mission-count'),
  stepCount: document.getElementById('step-count'),
  kicker: document.getElementById('lesson-kicker'),
  title: document.getElementById('lesson-title'),
  badge: document.getElementById('lesson-badge'),
  stepLabel: document.getElementById('step-label'),
  stepTitle: document.getElementById('step-title'),
  stepText: document.getElementById('step-text'),
  conceptBox: document.getElementById('concept-box'),
  scene: document.getElementById('scene'),
  dots: document.getElementById('step-dots'),
  tabs: [...document.querySelectorAll('.mission-tab')],
  backTop: document.getElementById('back-button'),
  nextTop: document.getElementById('next-button'),
  backBottom: document.getElementById('back-button-bottom'),
  nextBottom: document.getElementById('next-button-bottom'),
  restart: document.getElementById('restart-button')
};

let lessonIndex = 0;
let stepIndex = 0;

function render() {
  const lesson = lessons[lessonIndex];
  const step = lesson.steps[stepIndex];

  el.missionCount.textContent = `Lesson ${lessonIndex + 1} of ${lessons.length}`;
  el.stepCount.textContent = `Step ${stepIndex + 1} of ${lesson.steps.length}`;
  el.kicker.textContent = lesson.kicker;
  el.title.textContent = lesson.title;
  el.badge.textContent = lesson.badge;
  el.stepLabel.textContent = step.label;
  el.stepTitle.textContent = step.title;
  el.stepText.textContent = step.text;
  el.conceptBox.innerHTML = `<strong>Key idea</strong><p>${step.concept}</p>`;
  el.scene.innerHTML = step.render();

  el.tabs.forEach((tab, i) => {
    tab.classList.toggle('active', i === lessonIndex);
    tab.setAttribute('aria-current', i === lessonIndex ? 'step' : 'false');
  });
  el.dots.innerHTML = lesson.steps.map((_, i) => `<button type="button" class="dot ${i === stepIndex ? 'active' : i < stepIndex ? 'done' : ''}" data-step="${i}" aria-label="Go to step ${i + 1}"${i === stepIndex ? ' aria-current="step"' : ''}></button>`).join('');
  el.dots.querySelectorAll('.dot').forEach(dot => dot.addEventListener('click', () => {
    stepIndex = Number(dot.dataset.step);
    render();
  }));

  const first = lessonIndex === 0 && stepIndex === 0;
  const last = lessonIndex === lessons.length - 1 && stepIndex === lesson.steps.length - 1;
  [el.backTop, el.backBottom].forEach(btn => btn.disabled = first);
  [el.nextTop, el.nextBottom].forEach(btn => btn.disabled = last);
  const nextLabel = stepIndex === lesson.steps.length - 1 && lessonIndex < lessons.length - 1 ? 'Next lesson →' : 'Next →';
  el.nextTop.textContent = nextLabel;
  el.nextBottom.textContent = nextLabel;
}

function nextStep() {
  const lesson = lessons[lessonIndex];
  if (stepIndex < lesson.steps.length - 1) stepIndex++;
  else if (lessonIndex < lessons.length - 1) { lessonIndex++; stepIndex = 0; }
  render();
}

function previousStep() {
  if (stepIndex > 0) stepIndex--;
  else if (lessonIndex > 0) { lessonIndex--; stepIndex = lessons[lessonIndex].steps.length - 1; }
  render();
}

el.tabs.forEach(tab => tab.addEventListener('click', () => {
  lessonIndex = Number(tab.dataset.mission);
  stepIndex = 0;
  render();
}));
el.nextTop.addEventListener('click', nextStep);
el.nextBottom.addEventListener('click', nextStep);
el.backTop.addEventListener('click', previousStep);
el.backBottom.addEventListener('click', previousStep);
el.restart.addEventListener('click', () => { stepIndex = 0; render(); });
document.addEventListener('keydown', (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
  if (e.key === 'ArrowRight') { e.preventDefault(); nextStep(); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); previousStep(); }
});

function arrow() { return '<span class="arrow" aria-hidden="true">→</span>'; }
function nodeCard(icon, title, text, cls = '') { return `<div class="panel-card ${cls}"><span class="icon">${icon}</span><strong>${title}</strong><p>${text}</p></div>`; }
function infoBanner(text, type='info') { return `<div class="banner ${type} fade">${text}</div>`; }
function simpleRow(items, after='') { return `<div class="row">${items.join('')}</div>${after}`; }

function networkScene(mode) {
  const centralFail = mode === 'central-fail';
  const decentral = mode.startsWith('decentral');
  const decentralFail = mode === 'decentral-fail';
  const title = mode.startsWith('central') ? 'Centralised network' : 'Decentralised peer network';
  return `
  <div class="network-wrap ${mode}">
    <div class="badge-mini">${mode.startsWith('central') ? '🏛️ Central authority' : '🤝 Peer authority'} • ${title}</div>
    <svg class="network-svg" viewBox="0 0 760 300" role="img" aria-label="${title}">
      ${mode.startsWith('central') ? `
      <line class="net-line ${mode === 'central-active' ? 'active' : ''}" x1="380" y1="145" x2="120" y2="65" />
      <line class="net-line ${mode === 'central-active' ? 'active' : ''}" x1="380" y1="145" x2="240" y2="235" />
      <line class="net-line ${mode === 'central-active' ? 'active' : ''}" x1="380" y1="145" x2="520" y2="70" />
      <line class="net-line ${mode === 'central-active' ? 'active' : ''}" x1="380" y1="145" x2="640" y2="225" />
      <circle class="net-node central ${centralFail ? 'fail' : ''}" cx="380" cy="145" r="54"></circle>
      <text class="network-label" x="380" y="138" text-anchor="middle">Central</text>
      <text class="network-label" x="380" y="157" text-anchor="middle">server</text>
      <circle class="net-node" cx="120" cy="65" r="38"></circle>
      <text class="network-label" x="120" y="70" text-anchor="middle">User A</text>
      <circle class="net-node" cx="240" cy="235" r="38"></circle>
      <text class="network-label" x="240" y="240" text-anchor="middle">User B</text>
      <circle class="net-node" cx="520" cy="70" r="38"></circle>
      <text class="network-label" x="520" y="75" text-anchor="middle">User C</text>
      <circle class="net-node" cx="640" cy="225" r="38"></circle>
      <text class="network-label" x="640" y="230" text-anchor="middle">User D</text>
      ${centralFail ? `<text x="380" y="225" text-anchor="middle" class="network-label" fill="#b42318">Server failure stops the service</text>` : ''}
      ` : `
      <line class="net-line ${!decentralFail ? 'active' : ''}" x1="130" y1="80" x2="270" y2="70"></line>
      <line class="net-line ${!decentralFail ? 'active' : ''}" x1="270" y1="70" x2="425" y2="120"></line>
      <line class="net-line ${!decentralFail ? 'active' : ''}" x1="425" y1="120" x2="610" y2="85"></line>
      <line class="net-line ${!decentralFail ? 'active' : ''}" x1="130" y1="80" x2="250" y2="220"></line>
      <line class="net-line ${!decentralFail ? 'active' : ''}" x1="250" y1="220" x2="430" y2="225"></line>
      <line class="net-line ${decentralFail ? 'fail' : 'active'}" x1="430" y1="225" x2="610" y2="85"></line>
      <line class="net-line ${!decentralFail ? 'active' : ''}" x1="270" y1="70" x2="430" y2="225"></line>
      <circle class="net-node peer" cx="130" cy="80" r="38"></circle>
      <text class="network-label" x="130" y="85" text-anchor="middle">Peer A</text>
      <circle class="net-node peer" cx="270" cy="70" r="38"></circle>
      <text class="network-label" x="270" y="75" text-anchor="middle">Peer B</text>
      <circle class="net-node peer" cx="425" cy="120" r="38"></circle>
      <text class="network-label" x="425" y="125" text-anchor="middle">Peer C</text>
      <circle class="net-node peer ${decentralFail ? 'fail' : ''}" cx="610" cy="85" r="38"></circle>
      <text class="network-label" x="610" y="90" text-anchor="middle">Peer D</text>
      <circle class="net-node peer" cx="250" cy="220" r="38"></circle>
      <text class="network-label" x="250" y="225" text-anchor="middle">Peer E</text>
      <circle class="net-node peer" cx="430" cy="225" r="38"></circle>
      <text class="network-label" x="430" y="230" text-anchor="middle">Peer F</text>
      ${decentralFail ? `<text x="380" y="280" text-anchor="middle" class="network-label" fill="#205f3f">One peer fails, but the rest of the network can still communicate</text>` : ''}
      `}
    </svg>
    ${mode==='central-active' ? infoBanner('Requests flow to the centre because the central server controls the service.', 'info') : ''}
    ${mode==='central-fail' ? infoBanner('Single point of failure: users lose service when the central server is unavailable.', 'bad') : ''}
    ${mode==='decentral' ? infoBanner('Peers communicate without one dominant server controlling every interaction.', 'ok') : ''}
    ${mode==='decentral-fail' ? infoBanner('Resilience improves because the network does not rely on one centre.', 'ok') : ''}
  </div>`;
}

function distributedServers(mode) {
  const controlled = mode === 'controlled';
  return `
  <div>
    <div class="badge-mini">☁️ Distributed infrastructure${controlled ? ' • 🏢 one organisation still controls it' : ''}</div>
    <div class="server-grid" style="margin-top:14px;">
      <div class="component ${controlled ? 'pulse' : ''}"><span class="icon">🖥️</span><strong>Server 1</strong><p>Processes part of the workload</p></div>
      <div class="component ${mode==='normal' ? 'offline' : ''}"><span class="icon">🖥️</span><strong>Server 2</strong><p>${mode==='normal' ? 'This one can fail without stopping everything' : 'Processes part of the workload'}</p></div>
      <div class="component"><span class="icon">🖥️</span><strong>Server 3</strong><p>Processes part of the workload</p></div>
    </div>
    <div class="row" style="margin-top:14px;">
      ${nodeCard('👤','Users','Connect to the service')} ${arrow()} ${nodeCard(controlled ? '🏢' : '⚖️','Service owner', controlled ? 'Still sets the rules and controls updates' : 'Load is spread across several machines')}
    </div>
    ${mode==='normal' ? infoBanner('Distribution improves reliability and performance because work is spread across several machines.', 'ok') : ''}
    ${controlled ? infoBanner('Even though several servers exist, authority and governance can still remain centralised.', 'info') : ''}
  </div>`;
}

function traditionalFlow(mode) {
  return `
  <div>
    <div class="flow-grid">
      <div class="bank pop"><span class="icon">👩</span><strong>Alice</strong><p>Wants to send money</p></div>
      <div class="arrow-col">→</div>
      <div class="bank ${mode==='fees' ? 'shake' : ''}"><span class="icon">🏦</span><strong>Bank A</strong><p>Originating bank</p></div>
      <div class="arrow-col">→</div>
      <div class="bank ${mode!=='start' ? 'pulse' : ''}"><span class="icon">🏛️</span><strong>Intermediaries</strong><p>Correspondent / clearing roles</p></div>
      <div class="arrow-col">→</div>
      <div class="bank ${mode!=='start' ? 'pulse' : ''}"><span class="icon">🏦</span><strong>Bank B</strong><p>Receiving bank</p></div>
      <div class="arrow-col">→</div>
      <div class="bank pop"><span class="icon">👨</span><strong>Bob</strong><p>Receives the money</p></div>
    </div>
    ${mode==='ledger' ? `<div class="row" style="margin-top:14px;">${nodeCard('🗃️','Bank A ledger','Own internal record')} ${nodeCard('🗃️','Intermediate ledger','Own internal record')} ${nodeCard('🗃️','Bank B ledger','Own internal record')}</div>` : ''}
    ${mode==='fees' ? `<div class="fee-strip"><span class="fee-pill">Fee 1</span><span class="fee-pill">Fee 2</span><span class="fee-pill">Fee 3</span><span class="fee-pill">Time delay</span></div>` : ''}
    ${mode==='start' ? infoBanner('A traditional process may depend on several institutions between sender and receiver.', 'info') : ''}
    ${mode==='ledger' ? infoBanner('Each intermediary usually keeps its own ledger or database and performs its own checks.', 'info') : ''}
    ${mode==='fees' ? infoBanner('Intermediaries may be useful, but they can introduce reconciliation effort, delays and fees.', 'bad') : ''}
  </div>`;
}

function blockchainFlow(mode) {
  return `
  <div>
    <div class="row">
      ${nodeCard('👩','Alice','Creates and signs a transaction','pop')}
      ${arrow()}
      ${nodeCard('✍️','Signed transaction','Authorised with a private key','pulse')}
      ${arrow()}
      ${nodeCard('🖥️🖥️🖥️','Blockchain network','Nodes verify according to shared rules', mode==='broadcast' ? 'slide' : '')}
      ${arrow()}
      ${nodeCard('👨','Bob','Receives the outcome','pop')}
    </div>
    ${mode==='ledger' ? `<div class="shared-ledger" style="margin-top:16px;"><strong>Shared ledger</strong><div class="ledger-strip"><span class="ledger-block">Block A</span><span class="ledger-block">Block B</span><span class="ledger-block pulse">New transaction</span></div></div>` : ''}
    ${mode==='broadcast' ? infoBanner('The transaction is sent to a network rather than to one central recordkeeper.', 'ok') : ''}
    ${mode==='ledger' ? infoBanner('Once verified, the transaction becomes part of a shared append-only ledger.', 'ok') : ''}
  </div>`;
}

function decisionFlow() {
  return `
  <div class="decision-flow">
    <div class="decision-step"><span>Are updates centrally controlled by one trusted organisation?</span><span class="answer yes">Yes → database</span></div>
    <div class="decision-step"><span>Do several parties need a shared record but do not fully trust one another?</span><span class="answer no">No → database</span></div>
    <div class="decision-step"><span>Is strict immutability or shared verification required?</span><span class="answer yes">Yes → blockchain may help</span></div>
    <div class="decision-step"><span>Is extremely high throughput the main requirement?</span><span class="answer yes">Yes → database may still be better</span></div>
  </div>
  ${infoBanner('The correct design choice depends on the problem. Blockchain is valuable in some scenarios, but not all.', 'info')}`;
}

function layerScene() {
  return `
  <div class="layer-stack">
    <div class="layer storage pop">💾 Storage layer — replicated records and ledger history</div>
    <div class="layer communication pulse">📡 Communication layer — transactions and messages between nodes</div>
    <div class="layer computation slide">⚙️ Computation layer — validation and smart-contract logic</div>
  </div>
  ${infoBanner('A blockchain-based system can decentralise storage, communication and computation together.', 'ok')}`;
}

function architectureScene() {
  return `
  <div class="arch">
    <div class="component pop"><span class="icon">🖥️</span><strong>Frontend</strong><p>Web or mobile interface used by the person</p></div>
    <div class="link-arrow">↓</div>
    <div class="component pulse"><span class="icon">👛</span><strong>Wallet</strong><p>Signs requests and manages keys</p></div>
    <div class="link-arrow">↓</div>
    <div class="component slide"><span class="icon">📜</span><strong>Smart contract</strong><p>Contains the business rules</p></div>
    <div class="link-arrow">↓</div>
    <div class="component pop"><span class="icon">⛓️</span><strong>Blockchain</strong><p>Verifies and records the outcome</p></div>
  </div>`;
}

function escrowScene(mode) {
  const rules = `
    <div class="rule"><strong>Rule 1</strong><br>If payment is deposited and delivery is confirmed, release payment to Bob.</div>
    <div class="rule"><strong>Rule 2</strong><br>If delivery is not confirmed by the deadline, refund Alice.</div>`;
  const center = `
    <div class="contract-box ${mode==='rules' ? 'pulse' : ''}">
      <h4>Escrow smart contract</h4>
      ${rules}
      ${mode==='deposit' ? '<div style="margin-top:10px;"><span class="token float">💰</span></div>' : ''}
      ${mode==='success' ? '<div style="margin-top:10px; font-weight:800; color:#205f3f;">Payment condition satisfied</div>' : ''}
      ${mode==='refund' ? '<div style="margin-top:10px; font-weight:800; color:#8e1e18;">Refund condition satisfied</div>' : ''}
      ${mode==='recorded' ? '<div style="margin-top:10px; font-weight:800; color:#164f74;">State updated on-chain</div>' : ''}
    </div>`;
  const oracle = mode==='oracle' || mode==='success' || mode==='refund' || mode==='recorded'
    ? `<div class="row" style="margin:12px 0 0;"><div class="oracle ${mode==='oracle' ? 'pulse' : 'pop'}">📦 Delivery oracle: ${mode==='refund' ? 'No delivery by deadline' : 'Package delivered'}</div></div>` : '';
  const resultBanner = {
    rules: infoBanner('The smart contract stores the business logic agreed by the parties.', 'info'),
    deposit: infoBanner('The payment is locked in escrow until the contract conditions are resolved.', 'ok'),
    ship: infoBanner('The product is on the way, but the contract still waits for the required condition.', 'info'),
    oracle: infoBanner('The contract relies on an external data source to learn what happened in the physical world.', 'info'),
    success: infoBanner('Delivery confirmed: the contract releases payment to Bob automatically.', 'ok'),
    refund: infoBanner('No delivery confirmation: the contract returns the payment to Alice.', 'bad'),
    recorded: infoBanner('Blockchain nodes verify the state transition and the DApp can show the final outcome to users.', 'ok')
  }[mode] || '';

  return `
  <div>
    <div class="escrow-stage">
      <div class="actor ${mode==='deposit' || mode==='refund' ? 'pop' : ''}">
        <span class="icon">👩</span><strong>Alice</strong><p>Buyer</p>
        ${mode==='refund' ? '<div style="margin-top:8px;"><span class="token">💰</span></div>' : ''}
      </div>
      <div>
        ${center}
      </div>
      <div class="actor ${mode==='ship' || mode==='success' ? 'pop' : ''}">
        <span class="icon">👨</span><strong>Bob</strong><p>Seller</p>
        ${mode==='ship' ? '<div style="margin-top:8px;"><span class="package float">📦</span></div>' : ''}
        ${mode==='success' ? '<div style="margin-top:8px;"><span class="token">💰</span></div>' : ''}
      </div>
    </div>
    ${mode==='deposit' ? '<div class="row" style="margin-top:12px;">' + nodeCard('💰','Deposit','Alice sends funds into the contract','slide') + '</div>' : ''}
    ${mode==='ship' ? '<div class="row" style="margin-top:12px;">' + nodeCard('📦','Shipment','Bob sends the laptop') + '</div>' : ''}
    ${oracle}
    ${mode==='recorded' ? '<div class="row" style="margin-top:12px;">' + nodeCard('🖥️🖥️🖥️','Blockchain nodes','Verify and record the state change','pulse') + '</div>' : ''}
    ${resultBanner}
  </div>`;
}

render();
