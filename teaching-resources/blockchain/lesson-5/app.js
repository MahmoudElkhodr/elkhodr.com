const lessons = [
  {
    kicker:'Challenge 1', title:'Trace the DApp', badge:'Ethereum architecture',
    steps:[
      {
        title:'Put the request path in the right order',
        text:'A student presses “Send” in a DApp. Tap the five components in the order the request should move. The scene will only advance when the next component is correct.',
        concept:'A DApp uses a user interface and wallet, then communicates through an Ethereum node to the wider network and any target smart contract.',
        render:()=>pathChallenge()
      },
      {
        title:'What does the Ethereum node do?',
        text:'The node is more than a relay. Choose the tasks that belong to an Ethereum client according to this week’s architecture.',
        concept:'Ethereum client software participates in the network by verifying transactions, executing smart-contract logic and processing blockchain data.',
        render:()=>nodeTaskChallenge()
      },
      {
        title:'Where is the shared Ethereum state?',
        text:'The DApp screen can disappear and the user can close the browser. The blockchain state is not dependent on that one frontend. Choose where the shared state belongs.',
        concept:'Ethereum maintains shared account and contract state across the blockchain network rather than inside one DApp browser window.',
        render:()=>worldStateChallenge()
      },
      {
        title:'Watch the whole request move',
        text:'Now replay the complete path. A signed request leaves the user interface, reaches an Ethereum node, propagates through the network, and can trigger a contract that changes shared state.',
        concept:'The frontend is only the entry point; the decentralised backend is the Ethereum network and its shared state.',
        render:()=>requestReplay()
      }
    ]
  },
  {
    kicker:'Challenge 2', title:'Account Detective', badge:'EOA, contract account and state transitions',
    steps:[
      {
        title:'Which account is controlled by a private key?',
        text:'One account belongs to an external user. The other contains smart-contract code. Tap the account that a person controls by signing with a private key.',
        concept:'An Externally Owned Account (EOA) is controlled by a private key.',
        render:()=>accountChoice('eoa')
      },
      {
        title:'Which account contains executable code?',
        text:'Now identify the account whose behaviour comes from smart-contract code and internal storage rather than a user’s private key.',
        concept:'A Contract Account contains code and may maintain storage. Transactions can trigger that code.',
        render:()=>accountChoice('contract')
      },
      {
        title:'Choose the correct transaction route',
        text:'Alice wants to call an escrow smart contract. Which route makes sense: EOA to EOA, or EOA to Contract Account?',
        concept:'Transactions are initiated from an EOA and may transfer value to another EOA or invoke a Contract Account.',
        render:()=>routeChallenge()
      },
      {
        title:'A transaction changes the world state',
        text:'Watch the account state before and after a transaction. The blockchain records the transaction that caused the state transition.',
        concept:'Ethereum transactions move the system from one account state to another.',
        render:()=>stateTransition()
      }
    ]
  },
  {
    kicker:'Challenge 3', title:'Wallet, Gas & Tokens', badge:'Keys, computation and standards',
    steps:[
      {
        title:'What does an Ethereum wallet actually keep?',
        text:'Choose what the wallet itself is responsible for. The blockchain maintains the account balance; the wallet gives the user control of the account.',
        concept:'Wallets manage private keys or signing capability. Ether and token balances are represented in blockchain state.',
        render:()=>walletChallenge()
      },
      {
        title:'Which action uses more computation?',
        text:'Tap each action to compare its computational workload. The bars are qualitative: they show the idea, not a quoted network fee.',
        concept:'Gas measures computational work. More complex contract execution can require more computation than a simple transfer.',
        render:()=>gasLab()
      },
      {
        title:'Fungible or non-fungible?',
        text:'Classify the two examples. Tap an item, then choose whether it behaves like a fungible ERC-20-style token or a unique NFT-style asset.',
        concept:'Fungible tokens are interchangeable; non-fungible tokens represent distinguishable items.',
        render:()=>tokenChallenge()
      },
      {
        title:'Mission complete',
        text:'You have followed the main Ethereum development path from a DApp request to accounts, transactions, gas and token standards.',
        concept:'The useful mental model is: user → wallet → signed transaction → Ethereum node/network → account or smart contract → updated state.',
        render:()=>finishCard()
      }
    ]
  }
];

const el={
  missionCount:document.getElementById('mission-count'),stepCount:document.getElementById('step-count'),scoreCount:document.getElementById('score-count'),
  kicker:document.getElementById('lesson-kicker'),title:document.getElementById('lesson-title'),badge:document.getElementById('lesson-badge'),
  stepLabel:document.getElementById('step-label'),stepTitle:document.getElementById('step-title'),stepText:document.getElementById('step-text'),conceptBox:document.getElementById('concept-box'),scene:document.getElementById('scene'),dots:document.getElementById('step-dots'),tabs:[...document.querySelectorAll('.mission-tab')],
  backTop:document.getElementById('back-button'),nextTop:document.getElementById('next-button'),backBottom:document.getElementById('back-button-bottom'),nextBottom:document.getElementById('next-button-bottom'),restart:document.getElementById('restart-button')
};
const maxScore=7;
let mission=0,step=0,score=0;
const earned=new Set();

function award(id){if(!earned.has(id)){earned.add(id);score++;el.scoreCount.textContent=`Score ${score} / ${maxScore}`;}}
function feedback(text,type='neutral'){return `<div class="feedback ${type}" aria-live="polite">${text}</div>`}
function render(){
  const m=lessons[mission],s=m.steps[step];
  el.missionCount.textContent=`Challenge ${mission+1} of ${lessons.length}`;el.stepCount.textContent=`Step ${step+1} of ${m.steps.length}`;el.scoreCount.textContent=`Score ${score} / ${maxScore}`;
  el.kicker.textContent=m.kicker;el.title.textContent=m.title;el.badge.textContent=m.badge;el.stepLabel.textContent=`Step ${step+1}`;el.stepTitle.textContent=s.title;el.stepText.textContent=s.text;el.conceptBox.innerHTML=`<strong>Key idea</strong><p>${s.concept}</p>`;el.scene.innerHTML=s.render();
  el.tabs.forEach((t,i)=>{const activeTab=i===mission;t.classList.toggle('active',activeTab);if(activeTab)t.setAttribute('aria-current','step');else t.removeAttribute('aria-current')});
  el.dots.innerHTML=m.steps.map((_,i)=>`<button class="dot ${i===step?'active':i<step?'done':''}" data-step="${i}" aria-label="Go to step ${i+1}"></button>`).join('');
  el.dots.querySelectorAll('.dot').forEach(d=>d.addEventListener('click',()=>{step=Number(d.dataset.step);render()}));
  const first=mission===0&&step===0,last=mission===lessons.length-1&&step===m.steps.length-1;[el.backTop,el.backBottom].forEach(b=>b.disabled=first);[el.nextTop,el.nextBottom].forEach(b=>b.disabled=last);
  const nextLabel=step===m.steps.length-1&&mission<lessons.length-1?'Next challenge →':'Next →';el.nextTop.textContent=nextLabel;el.nextBottom.textContent=nextLabel;
  bindInteractive();
}
function next(){const m=lessons[mission];if(step<m.steps.length-1)step++;else if(mission<lessons.length-1){mission++;step=0}render()}
function back(){if(step>0)step--;else if(mission>0){mission--;step=lessons[mission].steps.length-1}render()}
el.tabs.forEach(t=>t.addEventListener('click',()=>{mission=Number(t.dataset.mission);step=0;render()}));el.nextTop.addEventListener('click',next);el.nextBottom.addEventListener('click',next);el.backTop.addEventListener('click',back);el.backBottom.addEventListener('click',back);el.restart.addEventListener('click',()=>{step=0;render()});document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')next();if(e.key==='ArrowLeft')back()});

function pathChallenge(){
  const items=[['dapp','🖥️','DApp','User presses Send'],['wallet','👛','Wallet','Signs the request'],['node','🖧','Ethereum node','Receives via Web3 / RPC'],['network','🌐','Network','Peers verify and propagate'],['contract','📜','Smart contract','May execute and update state']];
  return `<h3 class="challenge-title">Tap the path in order</h3><div class="path-board" id="path-board"><span class="packet" id="packet">📨</span>${items.map((x,i)=>`<button class="path-node" data-path="${x[0]}" data-index="${i}" type="button"><span class="big">${x[1]}</span><strong>${x[2]}</strong><small>${x[3]}</small></button>`).join('')}</div><p class="helper">Start with the component the student is looking at.</p><div id="path-feedback">${feedback('Tap the first component.','neutral')}</div>`
}
function nodeTaskChallenge(){return `<h3 class="challenge-title">Select every task that belongs to an Ethereum client</h3><div class="multi-answer">${[['verify','✅','Verify transactions'],['execute','⚙️','Execute smart-contract logic'],['blocks','🧱','Process blockchain data'],['photos','🖼️','Store all DApp photos'],['password','🔑','Guess a user password'],['own','🏢','Act as the one central owner']].map(x=>`<button class="choice" data-node-task="${x[0]}" type="button"><span>${x[1]}</span>${x[2]}</button>`).join('')}</div><div id="node-feedback">${feedback('Three choices belong to the client.','neutral')}</div>`}
function worldStateChallenge(){return `<h3 class="challenge-title">Where does the shared Ethereum state belong?</h3><div class="choice-grid"><button class="choice" data-world="browser" type="button"><span>🌐</span>Inside one student’s browser</button><button class="choice" data-world="network" type="button"><span>⛓️</span>Across the Ethereum blockchain network</button><button class="choice" data-world="usb" type="button"><span>💾</span>Only on the wallet device</button><button class="choice" data-world="email" type="button"><span>✉️</span>Inside an email server</button></div><div id="world-feedback">${feedback('Choose the shared backend state.','neutral')}</div>`}
function requestReplay(){return `<h3 class="challenge-title">Click Replay and follow the request</h3><div class="path-board replay" id="replay-board">${[['🖥️','DApp'],['👛','Wallet'],['🖧','Node'],['🌐','Network'],['📜','Contract']].map((x,i)=>`<div class="path-node" id="replay-${i}"><span class="big">${x[0]}</span><strong>${x[1]}</strong></div>`).join('')}<span class="packet" id="replay-packet">⚡</span></div><button class="control primary" id="replay-btn" type="button" style="margin-top:14px">▶ Replay request</button><div id="replay-feedback">${feedback('The animation pauses at each major layer.','neutral')}</div>`}
function accountChoice(target){return `<h3 class="challenge-title">${target==='eoa'?'Find the private-key account':'Find the code-controlled account'}</h3><div class="account-duel"><button class="account-card" data-account="eoa" type="button"><div class="big">👤</div><h4>Externally Owned Account</h4><p>Address • nonce • balance</p><div class="badge-row"><span class="mini-badge">private-key control</span></div></button><button class="account-card" data-account="contract" type="button"><div class="big">📜</div><h4>Contract Account</h4><p>Address • balance • code • storage</p><div class="badge-row"><span class="mini-badge">code + storage</span></div></button></div><div id="account-feedback">${feedback('Tap one account.','neutral')}</div><input type="hidden" id="account-target" value="${target}">`}
function routeChallenge(){return `<h3 class="challenge-title">Alice calls an escrow smart contract</h3><div class="choice-grid"><button class="choice" data-route="eoa-eoa" type="button"><span>👤 → 👤</span>EOA to EOA</button><button class="choice" data-route="eoa-ca" type="button"><span>👤 → 📜</span>EOA to Contract Account</button></div><div id="route-feedback">${feedback('Which destination executes the escrow code?','neutral')}</div>`}
function stateTransition(){return `<h3 class="challenge-title">Press the transaction to change the state</h3><div class="world"><div class="state-box"><h4>World State A</h4><div class="acct-row"><span>Alice</span><strong>5 ETH</strong></div><div class="acct-row"><span>Bob</span><strong>1 ETH</strong></div></div><button class="control primary" id="state-btn" type="button">Send 1 ETH →</button><div class="state-box" id="state-b"><h4>World State B</h4><div class="acct-row"><span>Alice</span><strong id="alice-b">5 ETH</strong></div><div class="acct-row"><span>Bob</span><strong id="bob-b">1 ETH</strong></div></div></div><div id="state-feedback">${feedback('The transaction is the event that causes the state transition.','neutral')}</div>`}
function walletChallenge(){return `<h3 class="challenge-title">What does the wallet manage?</h3><div class="choice-grid"><button class="choice" data-wallet="keys" type="button"><span>🗝️</span>Private keys / signing capability</button><button class="choice" data-wallet="coins" type="button"><span>🪙</span>The actual Ether coins stored inside the app</button></div><div class="wallet-vault" style="margin-top:14px"><div class="wallet"><div class="big">👛</div><strong>Your wallet</strong><div id="wallet-inside"></div></div><div class="chain-balance"><div class="big">⛓️</div><strong>Blockchain state</strong><p>Account balance lives here</p></div></div><div id="wallet-feedback">${feedback('Choose one answer.','neutral')}</div>`}
function gasLab(){return `<h3 class="challenge-title">Tap both actions and compare the work</h3><div class="gas-lab"><button class="gas-card" data-gas="transfer" type="button"><div class="big">💸</div><h4>Simple value transfer</h4><div class="gas-meter"><div class="gas-fill transfer"></div></div><div class="gas-label">Qualitative workload</div></button><button class="gas-card" data-gas="contract" type="button"><div class="big">📜⚙️</div><h4>Smart-contract execution</h4><div class="gas-meter"><div class="gas-fill contract"></div></div><div class="gas-label">Qualitative workload</div></button></div><div id="gas-feedback">${feedback('The bars illustrate relative computation, not an exact fee.','neutral')}</div>`}
function tokenChallenge(){return `<h3 class="challenge-title">Classify each example</h3><p class="helper">First tap an item. Then choose its category.</p><div class="token-items"><button class="token-item" data-token-item="points" type="button">🪙 100 identical reward tokens</button><button class="token-item" data-token-item="ticket" type="button">🎟️ Unique numbered digital ticket</button></div><div class="token-sort" style="margin-top:14px"><button class="token-zone" data-token-zone="fungible" type="button"><h4>Fungible</h4><p>Interchangeable units</p><strong>ERC-20-style</strong></button><button class="token-zone" data-token-zone="nft" type="button"><h4>Non-fungible</h4><p>Distinct item</p><strong>NFT / ERC-721-style</strong></button></div><div id="token-feedback">${feedback('Select an item to begin.','neutral')}</div>`}
function finishCard(){return `<div class="final-card"><div class="trophy">🏆</div><h3>Ethereum Journey complete</h3><div class="final-score">${score} / ${maxScore} challenge points</div><p>You traced the DApp path, distinguished EOAs from Contract Accounts, followed a state transition, opened the wallet, compared gas workload and classified token types.</p><div class="feedback good">Core path: user → wallet → signed transaction → node/network → account or contract → updated state.</div></div>`}

function bindInteractive(){
  // Path challenge
  const pathNodes=[...document.querySelectorAll('[data-path]')];if(pathNodes.length){let expected=0;const packet=document.getElementById('packet'),fb=document.getElementById('path-feedback');pathNodes.forEach(btn=>btn.addEventListener('click',()=>{const idx=Number(btn.dataset.index);if(idx===expected){btn.classList.add('done','current');setTimeout(()=>btn.classList.remove('current'),500);packet.style.left=`${7+idx*21.5}%`;packet.classList.toggle('fly');expected++;fb.innerHTML=feedback(expected===5?'Perfect route. The request has reached the contract.':'Correct. Tap the next component.','good');if(expected===5)award('path');}else{btn.classList.add('wrong');setTimeout(()=>btn.classList.remove('wrong'),500);fb.innerHTML=feedback('Not yet. Follow the request from the user outward.','bad')}}));}
  // Node tasks
  const nodeBtns=[...document.querySelectorAll('[data-node-task]')];if(nodeBtns.length){const good=new Set(['verify','execute','blocks']),chosen=new Set(),fb=document.getElementById('node-feedback');nodeBtns.forEach(b=>b.addEventListener('click',()=>{const v=b.dataset.nodeTask;if(good.has(v)){b.classList.add('good');chosen.add(v);fb.innerHTML=feedback(chosen.size===3?'Excellent — those are the three client roles highlighted in the lesson.':'Correct — find the remaining client task.','good');if(chosen.size===3)award('node');}else{b.classList.add('bad');fb.innerHTML=feedback('That is not one of the Ethereum client roles shown in this lesson.','bad')}}));}
  // World state
  document.querySelectorAll('[data-world]').forEach(b=>b.addEventListener('click',()=>{const fb=document.getElementById('world-feedback');document.querySelectorAll('[data-world]').forEach(x=>x.classList.remove('good','bad'));if(b.dataset.world==='network'){b.classList.add('good');fb.innerHTML=feedback('Correct. Shared Ethereum state belongs to the blockchain network.','good');}else{b.classList.add('bad');fb.innerHTML=feedback('Think beyond one device or frontend.','bad')}}));
  // Replay
  const replay=document.getElementById('replay-btn');if(replay){replay.addEventListener('click',async()=>{const packet=document.getElementById('replay-packet'),fb=document.getElementById('replay-feedback');replay.disabled=true;for(let i=0;i<5;i++){document.querySelectorAll('[id^="replay-"]').forEach(x=>x.classList.remove('current'));const n=document.getElementById(`replay-${i}`);if(n)n.classList.add('current');packet.style.left=`${7+i*21.5}%`;packet.classList.toggle('fly');fb.innerHTML=feedback(['DApp creates the request.','Wallet authorises it.','Node receives it through the Web3/RPC interface.','Peers verify and propagate it.','A target contract may execute and update state.'][i],'good');await wait(700)}replay.disabled=false;});}
  // Account choice
  const acctTarget=document.getElementById('account-target');if(acctTarget){document.querySelectorAll('[data-account]').forEach(b=>b.addEventListener('click',()=>{const fb=document.getElementById('account-feedback');document.querySelectorAll('[data-account]').forEach(x=>x.classList.remove('selected-good','selected-bad'));if(b.dataset.account===acctTarget.value){b.classList.add('selected-good');fb.innerHTML=feedback(acctTarget.value==='eoa'?'Correct. The EOA is controlled by a private key.':'Correct. The Contract Account contains executable code and storage.','good');award(acctTarget.value==='eoa'?'eoa':'ca');}else{b.classList.add('selected-bad');fb.innerHTML=feedback('Try the other account and look at what controls it.','bad')}}));}
  // Route
  document.querySelectorAll('[data-route]').forEach(b=>b.addEventListener('click',()=>{const fb=document.getElementById('route-feedback');document.querySelectorAll('[data-route]').forEach(x=>x.classList.remove('good','bad'));if(b.dataset.route==='eoa-ca'){b.classList.add('good');fb.innerHTML=feedback('Correct. Alice’s EOA initiates a transaction that invokes the Contract Account.','good');}else{b.classList.add('bad');fb.innerHTML=feedback('EOA → EOA fits a direct account transfer, but not invoking escrow code.','bad')}}));
  // State transition
  const stateBtn=document.getElementById('state-btn');if(stateBtn){stateBtn.addEventListener('click',()=>{document.getElementById('alice-b').textContent='4 ETH';document.getElementById('bob-b').textContent='2 ETH';document.getElementById('state-b').classList.add('pop');document.getElementById('state-feedback').innerHTML=feedback('Transaction applied: World State A → World State B.','good');stateBtn.disabled=true;});}
  // Wallet
  document.querySelectorAll('[data-wallet]').forEach(b=>b.addEventListener('click',()=>{const fb=document.getElementById('wallet-feedback');document.querySelectorAll('[data-wallet]').forEach(x=>x.classList.remove('good','bad'));if(b.dataset.wallet==='keys'){b.classList.add('good');document.getElementById('wallet-inside').innerHTML='<div class="key-chip">🗝️ Private key / signing</div>';fb.innerHTML=feedback('Correct. The wallet manages the keys used to control the account.','good');award('wallet');}else{b.classList.add('bad');fb.innerHTML=feedback('The balance is represented in blockchain state, not as coins physically stored in the wallet app.','bad')}}));
  // Gas
  const gasSeen=new Set();document.querySelectorAll('[data-gas]').forEach(b=>b.addEventListener('click',()=>{b.classList.add('active');gasSeen.add(b.dataset.gas);const fb=document.getElementById('gas-feedback');fb.innerHTML=feedback(b.dataset.gas==='transfer'?'A simple transfer requires computation, shown here as a shorter workload bar.':'Executing contract logic can require more computational work, shown here as a longer bar.','good');if(gasSeen.size===2)award('gas');}));
  // Token classify
  let currentToken=null;const answers={points:'fungible',ticket:'nft'},done=new Set();document.querySelectorAll('[data-token-item]').forEach(b=>b.addEventListener('click',()=>{currentToken=b.dataset.tokenItem;document.querySelectorAll('[data-token-item]').forEach(x=>x.classList.remove('good','bad'));b.classList.add('good');document.getElementById('token-feedback').innerHTML=feedback('Now choose the category for this item.','neutral')}));document.querySelectorAll('[data-token-zone]').forEach(z=>z.addEventListener('click',()=>{const fb=document.getElementById('token-feedback');if(!currentToken){fb.innerHTML=feedback('Select an item first.','bad');return}const item=document.querySelector(`[data-token-item="${currentToken}"]`);if(z.dataset.tokenZone===answers[currentToken]){item.classList.add('good');done.add(currentToken);fb.innerHTML=feedback(currentToken==='points'?'Correct. Identical interchangeable units are fungible.':'Correct. A unique numbered item is non-fungible.','good');currentToken=null;if(done.size===2)award('token');}else{item.classList.add('bad');fb.innerHTML=feedback('Not quite. Ask whether one unit can be replaced by an identical unit.','bad')}}));
}
function wait(ms){return new Promise(r=>setTimeout(r,ms))}
render();
