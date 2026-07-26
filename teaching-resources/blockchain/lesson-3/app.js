const hashA = "8f3a91c2d7e4b61aa0c9f243b76d55d2f4031a8e19dcb4a75e2f987b4c21dd90";
const hashB = "c1e72ab84fd0936e4a50c20117b657fd9ef4b2f666f331e2e3671c8d990a31af";
const txHash = "47bd9a2c19a3e65f...8e0c4d17";
const badTxHash = "91f2d7c0034b9e61...24aa38f0";

const fruits = [
  ["🍌", "Banana", "47 g"], ["🍎", "Apple", "31 g"], ["🥭", "Mango", "22 g"], ["🍓", "Strawberry", "18 g"],
  ["🍊", "Orange", "36 g"], ["🍍", "Pineapple", "27 g"], ["🥝", "Kiwi", "14 g"], ["🍇", "Grape", "29 g"],
  ["🍉", "Watermelon", "43 g"], ["🍐", "Pear", "19 g"], ["🍒", "Cherry", "12 g"], ["🍑", "Peach", "24 g"],
  ["🫐", "Blueberry", "16 g"], ["🍋", "Lemon", "8 g"], ["🥥", "Coconut", "11 g"], ["🍈", "Melon", "34 g"],
  ["🍅", "Tomato", "6 g"], ["🥑", "Avocado", "13 g"], ["🍏", "Green apple", "21 g"], ["🍊", "Mandarin", "17 g"]
];

const lessons = [
  {
    title: "One Secret Key",
    badge: "Symmetric encryption",
    kicker: "Mission 1",
    steps: [
      {
        title: "Alice has a confidential document",
        text: "Alice needs to send a confidential business document to Bob. At the moment, the document is readable plaintext.",
        concept: "Plaintext is the original readable information before encryption.",
        render: () => stage(`
          <div class="flow-row">
            ${actor("👩‍💼", "Alice", "Sender")}
            <div class="document animate-in"><div class="doc-head">Business plan</div><div class="doc-line"></div><div class="doc-line short"></div><div class="doc-line"></div><div class="doc-line short"></div></div>
          </div>
          ${banner("The document is readable. Anyone who obtains it could understand it.", "info")}
        `)
      },
      {
        title: "Alice and Bob share one secret key",
        text: "Symmetric encryption uses the same secret key for both encryption and decryption. Alice and Bob must already possess the same key.",
        concept: "The key must remain secret. If an attacker gets a copy, the confidentiality is lost.",
        render: () => stage(`
          <div class="flow-row">
            ${actor("👩‍💼", "Alice", "Has key K-482")}
            <div class="key-card pop-in"><span class="icon">🗝️</span><strong>Shared secret key</strong><span>K-482</span></div>
            ${actor("👨‍💼", "Bob", "Has key K-482")}
          </div>
          ${banner("One key is shared by both authorised people.", "info")}
        `)
      },
      {
        title: "Alice encrypts the document",
        text: "Alice places the plaintext and the shared key into an encryption algorithm. The output is ciphertext: information that looks meaningless without the key.",
        concept: "Encryption changes readable plaintext into unreadable ciphertext.",
        render: () => stage(`
          <div class="flow-row">
            <div class="document slide-in-left"><div class="doc-head">Plaintext</div><div class="doc-line"></div><div class="doc-line short"></div><div class="doc-line"></div></div>
            <span class="arrow">→</span>
            <div class="machine pop-in"><span class="icon">⚙️</span><strong>Encrypt</strong><p>Document + K-482</p></div>
            <span class="arrow">→</span>
            <div class="document encrypted slide-in-right"><div class="doc-head">Ciphertext</div><div class="doc-line"></div><div class="doc-line short"></div><div class="doc-line"></div></div>
          </div>
        `)
      },
      {
        title: "The encrypted document crosses the network",
        text: "The ciphertext is sent across the network. An attacker may intercept the file, but it remains unreadable without the shared secret key.",
        concept: "Encryption protects confidentiality even when the communication channel is not fully trusted.",
        render: () => stage(`
          <div class="mail-path">
            ${actor("👩‍💼", "Alice", "Sends ciphertext")}
            <div><div class="mail-line"></div><div class="mail-icon">📨</div><div class="mail-line"></div></div>
            ${actor("👨‍💼", "Bob", "Receives ciphertext")}
          </div>
          <div class="flow-row" style="margin-top:18px">
            <div class="visual-card shake"><span style="font-size:2.2rem">🕵️</span><strong>Attacker intercepts it</strong><p>The content still appears unreadable.</p></div>
            <div class="document encrypted"><div class="doc-head">Ciphertext</div><div class="doc-line"></div><div class="doc-line short"></div><div class="doc-line"></div></div>
          </div>
        `)
      },
      {
        title: "Bob decrypts it with the same key",
        text: "Bob enters the ciphertext and the same shared key into the decryption algorithm. The original readable document is recovered.",
        concept: "In symmetric cryptography, the encryption key and decryption key are the same secret.",
        render: () => stage(`
          <div class="flow-row">
            <div class="document encrypted slide-in-left"><div class="doc-head">Ciphertext</div><div class="doc-line"></div><div class="doc-line short"></div><div class="doc-line"></div></div>
            <span class="arrow">→</span>
            <div class="machine pop-in"><span class="icon">🔓</span><strong>Decrypt</strong><p>Ciphertext + K-482</p></div>
            <span class="arrow">→</span>
            <div class="document slide-in-right"><div class="doc-head">Business plan</div><div class="doc-line"></div><div class="doc-line short"></div><div class="doc-line"></div></div>
          </div>
          ${banner("Bob can read the original document again.", "success")}
        `)
      },
      {
        title: "A wrong key does not work",
        text: "If someone tries a different key, the result remains meaningless. The correct key is essential.",
        concept: "Strong cryptography should make guessing the correct key computationally impractical.",
        render: () => stage(`
          <div class="flow-row">
            <div class="key-card private shake"><span class="icon">🗝️</span><strong>Wrong key</strong><span>K-999</span></div>
            <div class="machine"><span class="icon">⚙️</span><strong>Decrypt attempt</strong></div>
            <div class="document encrypted"><div class="doc-head">Unreadable output</div><div class="doc-line"></div><div class="doc-line short"></div><div class="doc-line"></div></div>
          </div>
          ${banner("Decryption failed: the key does not match.", "failure")}
        `)
      },
      {
        title: "The challenge is sharing the secret key",
        text: "Symmetric encryption is efficient, but Alice and Bob need a secure way to exchange the secret key before communication begins.",
        concept: "The key-distribution problem motivates public-key cryptography, where a public key can be shared openly and the private key remains secret.",
        render: () => stage(`
          <div class="three-col">
            <div class="visual-card"><span style="font-size:2.2rem">⚡</span><strong>Fast</strong><p>Efficient for large amounts of data.</p></div>
            <div class="visual-card"><span style="font-size:2.2rem">🗝️</span><strong>One shared key</strong><p>The same key encrypts and decrypts.</p></div>
            <div class="visual-card"><span style="font-size:2.2rem">⚠️</span><strong>Key distribution</strong><p>How do both people obtain it securely?</p></div>
          </div>
        `)
      }
    ]
  },
  {
    title: "The Public Lockbox",
    badge: "Public and private keys",
    kicker: "Mission 2",
    steps: [
      {
        title: "Bob creates a public lock and a private key",
        text: "Bob creates a mathematically related key pair. The public key can be distributed. The private key must remain under Bob's control.",
        concept: "The public key works like an open lock that anyone may use. Only the matching private key can unlock what it protects.",
        render: () => stage(`
          <div class="key-pair-scene">
            <div class="key-card public key-arrive-left"><span class="icon">🔓</span><strong>Public key</strong><span>Open lock — share it</span></div>
            <div class="key-owner-stack">
              ${actor("👨‍💼", "Bob", "Creates the key pair")}
              ${safeBox({ showDocument: false, door: "closed", safeClass: "safe-small safe-glow", label: "Bob's secure safe" })}
            </div>
            <div class="key-card private key-arrive-right"><span class="icon">🗝️</span><strong>Private key</strong><span>Secret key — never share it</span></div>
          </div>
          ${banner("The two keys belong together, but they perform different jobs.", "info")}
        `)
      },
      {
        title: "Bob publishes copies of his open lock",
        text: "Think of Bob's public key as an open padlock. Bob places copies online so anyone can use one to protect information intended for him.",
        concept: "The public lock may be copied and shared freely. Sharing it does not reveal Bob's private key.",
        render: () => stage(`
          <div class="public-key-distribution">
            ${actor("👨‍💼", "Bob", "Publishes his public lock")}
            <div class="distribution-path" aria-label="Copies of Bob's public lock moving online">
              <div class="web-hub"><span>🌐</span><strong>Bob's public page</strong></div>
              <span class="padlock-copy copy-one">🔓</span>
              <span class="padlock-copy copy-two">🔓</span>
              <span class="padlock-copy copy-three">🔓</span>
              <div class="download-arrow">→</div>
            </div>
            ${actor("👩‍💼", "Alice", "Downloads one public lock")}
          </div>
          ${banner("Anyone can obtain the open public lock. Bob keeps the private key.", "success")}
        `)
      },
      {
        title: "Alice places a secret message inside the safe",
        text: "Alice places sensitive information inside a secure box intended for Bob. The message is still readable while the safe remains open.",
        concept: "The safe represents the information being protected. Bob's public lock will secure the door.",
        render: () => stage(`
          <div class="safe-action-scene">
            ${actor("👩‍💼", "Alice", "Places the message inside")}
            <div class="action-arrow">→</div>
            ${safeBox({ door: "open", docClass: "document-drop", safeClass: "safe-arrive", lock: "🔓", label: "Open safe receiving Alice's secret message" })}
          </div>
          <div class="message-preview"><span>📄</span><div><strong>Confidential message</strong><p>Readable before the safe is locked</p></div></div>
          ${banner("The document drops into the open safe.", "info")}
        `)
      },
      {
        title: "Alice closes the safe using Bob's public lock",
        text: "Alice applies Bob's public key and closes the safe. Once it is locked, Alice does not possess the private key needed to reopen it.",
        concept: "The public key can lock information for Bob. The matching private key is required to unlock it.",
        render: () => stage(`
          <div class="lock-action-scene">
            <div class="public-lock-source">
              <span class="large-open-lock">🔓</span>
              <strong>Bob's public key</strong>
              <small>Used to lock</small>
            </div>
            <div class="lock-flight" aria-hidden="true">🔓</div>
            ${safeBox({ door: "closing", docClass: "document-settled", safeClass: "safe-locking", lock: "🔒", label: "Safe closing and locking with Bob's public key" })}
          </div>
          ${banner("Click: the door closes and the public lock secures the message.", "success")}
        `)
      },
      {
        title: "The locked safe travels through an untrusted network",
        text: "The safe can travel across an untrusted network. An attacker may intercept it, but they do not have Bob's private key.",
        concept: "The route does not need to be secret. Security depends on Bob protecting his private key.",
        render: () => stage(`
          <div class="safe-mail-scene">
            ${actor("👩‍💼", "Alice", "Sends the locked safe")}
            <div class="safe-road">
              <div class="road-line"></div>
              <div class="moving-safe">🔒</div>
              <div class="road-markers">• • • • • • •</div>
            </div>
            ${actor("👨‍💼", "Bob", "Waiting with private key")}
          </div>
          <div class="attack-row">
            <div class="attacker-card"><span>🕵️</span><strong>Attacker intercepts it</strong><p>Pulls the handle and tries to force the lock.</p></div>
            ${safeBox({ door: "closed", docClass: "document-settled", safeClass: "safe-resists", lock: "🔒", label: "Locked safe resisting an attack" })}
            <div class="denied-badge">ACCESS<br>DENIED</div>
          </div>
          ${banner("The attacker has the safe, but not the private key.", "failure")}
        `)
      },
      {
        title: "Bob inserts his private key and opens the safe",
        text: "When the safe reaches Bob, his private key moves into the lock, turns, and opens the door so he can recover the message.",
        concept: "Only the matching private key unlocks the protected information. It must remain confidential and under Bob's control.",
        render: () => stage(`
          <div class="unlock-action-scene">
            <div class="private-key-source">
              <span class="large-private-key">🗝️</span>
              <strong>Bob's private key</strong>
              <small>Never transmitted</small>
            </div>
            <div class="flying-private-key" aria-hidden="true">🗝️</div>
            ${safeBox({ door: "opening", docClass: "document-rise", safeClass: "safe-unlocking", lock: "🔓", label: "Bob's private key unlocking the safe" })}
            ${actor("👨‍💼", "Bob", "Reads the recovered message")}
          </div>
          ${banner("The private key turns the lock and the safe opens for Bob.", "success")}
        `)
      },
      {
        title: "What should be shared and what must stay secret?",
        text: "A public key and a blockchain address may be shared. A private key, wallet seed phrase and password must remain secret.",
        concept: "In blockchain, private keys are used mainly to authorise and sign transactions. Public keys help others verify them.",
        render: () => stage(`
          <div class="two-col">
            <div class="visual-card" style="border-color:#9ed4b7;background:var(--green-soft)"><span style="font-size:2.2rem">📢</span><strong>Safe to share</strong><p>Public key<br>Blockchain address</p></div>
            <div class="visual-card" style="border-color:#f0ada6;background:var(--red-soft)"><span style="font-size:2.2rem">🤫</span><strong>Keep secret</strong><p>Private key<br>Seed phrase<br>Password</p></div>
          </div>
        `)
      }
    ]
  },
  {
    title: "The Fruit-Shake Fingerprint",
    badge: "Hashing and integrity",
    kicker: "Mission 3",
    steps: [
      {
        title: "The recipe contains 20 precise ingredients",
        text: "Imagine a fruit shake made from 20 fruits. Each fruit has an exact amount. The complete recipe is the input.",
        concept: "A hash function can accept an input of almost any size: a sentence, document, transaction, file or complete recipe.",
        render: () => stage(`
          <h4 class="stage-title">Original fruit-shake recipe</h4>
          <div class="fruit-grid animate-in">${fruitGrid(false)}</div>
        `)
      },
      {
        title: "The recipe goes into a one-way blender",
        text: "The recipe is placed into an identical digital blender: the hash function. The function produces one fixed-length output regardless of the input size.",
        concept: "The same hash algorithm always applies the same processing rules.",
        render: () => stage(`
          <div class="flow-row">
            <div class="visual-card slide-in-left"><span style="font-size:2.5rem">📋</span><strong>20-fruit recipe</strong><p>Exact fruit types and gram amounts</p></div>
            <span class="arrow">→</span>
            ${blender()}
            <span class="arrow">→</span>
            <div class="hash-card slide-in-right"><strong>Digital fingerprint</strong>${hashA}</div>
          </div>
        `)
      },
      {
        title: "The output is a digital fingerprint",
        text: "The shake analogy helps us imagine mixing many precise inputs into one result. A cryptographic hash is even more one-way: the fingerprint should not reveal useful parts of the original recipe.",
        concept: "Hashing is not encryption. There is no key that simply reverses the hash back into the original input.",
        render: () => stage(`
          <div class="flow-row">
            <div class="hash-card pop-in"><strong>SHA-256-style output</strong>${hashA}</div>
            <div class="visual-card"><span style="font-size:2.4rem">🚫</span><strong>No reverse recipe</strong><p>The fingerprint does not list the fruits or their measurements.</p></div>
          </div>
          ${banner("A cryptographic hash is designed to be one-way.", "info")}
        `)
      },
      {
        title: "The receiver already has the claimed recipe",
        text: "The receiver does not try to reverse the fingerprint. Instead, the receiver takes the claimed recipe and processes it through the same hash function.",
        concept: "Verification means calculating a new hash from the received data and comparing it with the trusted hash.",
        render: () => stage(`
          <div class="flow-row">
            <div class="visual-card slide-in-left"><span style="font-size:2.5rem">📋</span><strong>Received recipe</strong><p>The claimed 20-fruit measurements</p></div>
            <span class="arrow">→</span>
            ${blender()}
            <span class="arrow">→</span>
            <div class="hash-card match slide-in-right"><strong>Calculated fingerprint</strong>${hashA}</div>
          </div>
        `)
      },
      {
        title: "Matching fingerprints mean the recipe is unchanged",
        text: "The newly calculated fingerprint is compared with the trusted fingerprint created earlier. If both match, the recipe has not changed.",
        concept: "A matching hash supports data integrity: the input being checked is identical to the input used for the trusted hash.",
        render: () => stage(`
          <div class="hash-compare">
            <div class="hash-card match pop-in"><strong>Trusted hash</strong>${hashA}</div>
            <div style="font-size:2.6rem">✅</div>
            <div class="hash-card match pop-in"><strong>Calculated hash</strong>${hashA}</div>
          </div>
          ${banner("Match: no change detected.", "success")}
        `)
      },
      {
        title: "Change only one gram of banana",
        text: "The original recipe used 47 g of banana. Someone changes that single value to 48 g. The other 19 fruits and every other measurement remain exactly the same.",
        concept: "The change is only +1 g: banana moves from 47 g to 48 g. Even this tiny input change should produce a substantially different hash.",
        render: () => stage(`
          <h4 class="stage-title">One visible change: banana 47 g → 48 g</h4>
          <div class="banana-change-comparison" aria-label="Banana amount changed from 47 grams to 48 grams">
            <div class="banana-measure original-banana"><span>🍌</span><small>Original recipe</small><strong>47 g</strong></div>
            <div class="banana-change-arrow"><span>+1 g</span><strong>→</strong></div>
            <div class="banana-measure modified-banana"><span>🍌</span><small>Modified recipe</small><strong>48 g</strong></div>
          </div>
          <p class="change-reminder"><strong>Only banana changed.</strong> The remaining 19 fruit measurements are unchanged.</p>
          <div class="fruit-grid fruit-grid-compact animate-in">${fruitGrid(true)}</div>
        `)
      },
      {
        title: "The 48 g banana recipe produces a different hash",
        text: "The modified recipe—with banana changed from 47 g to 48 g—is processed through the same hash function. Its fingerprint is now completely different.",
        concept: "The algorithm is unchanged. The only input difference is banana: 47 g became 48 g.",
        render: () => stage(`
          <div class="recipe-change-strip">
            <div><span>🍌</span><small>Original</small><strong>47 g</strong></div>
            <span class="recipe-change-plus">+1 g →</span>
            <div class="changed"><span>🍌</span><small>Modified</small><strong>48 g</strong></div>
          </div>
          <div class="flow-row">
            <div class="visual-card slide-in-left"><span style="font-size:2.5rem">📋</span><strong>Modified recipe</strong><p>Banana is now 48 g, not 47 g</p></div>
            <span class="arrow">→</span>
            ${blender()}
            <span class="arrow">→</span>
            <div class="hash-card fail slide-in-right"><strong>New fingerprint</strong>${hashB}</div>
          </div>
        `)
      },
      {
        title: "The 47 g and 48 g recipes do not match",
        text: "The trusted fingerprint belongs to the original 47 g banana recipe. The new fingerprint belongs to the modified 48 g banana recipe. They do not match.",
        concept: "The mismatch proves that the received input is not identical to the original, even though the visible difference was only one gram.",
        render: () => stage(`
          <div class="hash-compare labelled-hash-compare">
            <div>
              <div class="banana-hash-label original">🍌 Original banana: <strong>47 g</strong></div>
              <div class="hash-card match"><strong>Trusted hash</strong>${hashA}</div>
            </div>
            <div class="hash-mismatch-symbol">≠</div>
            <div>
              <div class="banana-hash-label modified">🍌 Modified banana: <strong>48 g</strong></div>
              <div class="hash-card fail"><strong>Calculated hash</strong>${hashB}</div>
            </div>
          </div>
          ${banner("Mismatch: changing banana from 47 g to 48 g changed the fingerprint.", "failure")}
        `)
      },
      {
        title: "Hashing protects integrity, not truthfulness",
        text: "A matching fingerprint proves that the recipe did not change after the trusted hash was created. It does not prove that the original recipe was healthy, accurate or honest.",
        concept: "If false information is entered and hashed, blockchain can preserve the false information consistently. This is the garbage-in, garbage-out limitation.",
        render: () => stage(`
          <div class="two-col">
            <div class="visual-card" style="border-color:#9ed4b7;background:var(--green-soft)"><span style="font-size:2.4rem">✅</span><strong>What hashing can show</strong><p>The data has or has not changed.</p></div>
            <div class="visual-card" style="border-color:#f0ada6;background:var(--red-soft)"><span style="font-size:2.4rem">❌</span><strong>What hashing cannot show</strong><p>Whether the original data was truthful or high quality.</p></div>
          </div>
        `)
      }
    ]
  },
  {
    title: "Sign the Transaction",
    badge: "Digital signatures and blockchain",
    kicker: "Mission 4",
    steps: [
      {
        title: "Who approved the trusted recipe?",
        text: "Hashing shows whether the recipe changed, but it does not identify who approved the trusted fingerprint. Digital signatures add that missing evidence.",
        concept: "A digital signature combines data integrity with evidence of authorisation by a private key.",
        render: () => stage(`
          <div class="flow-row">
            <div class="hash-card"><strong>Trusted recipe hash</strong>${hashA}</div>
            <div class="visual-card pop-in"><span style="font-size:2.5rem">❓</span><strong>Who approved it?</strong><p>A hash alone does not answer this.</p></div>
          </div>
        `)
      },
      {
        title: "The chef hashes the recipe",
        text: "The authorised chef processes the complete recipe through the hash function. This produces the exact fingerprint that will be signed.",
        concept: "Digital signature systems normally sign a hash of the data rather than the entire data directly.",
        render: () => stage(`
          <div class="flow-row">
            <div class="visual-card"><span style="font-size:2.4rem">👨‍🍳</span><strong>Authorised chef</strong><p>Owns a private key</p></div>
            <span class="arrow">→</span>
            ${blender()}
            <span class="arrow">→</span>
            <div class="hash-card"><strong>Recipe hash</strong>${hashA}</div>
          </div>
        `)
      },
      {
        title: "The chef signs the hash with the private key",
        text: "The chef uses the private key to create a digital signature for the recipe hash. The private key remains secret and is not sent with the recipe.",
        concept: "Only the holder of the private key should be able to create a valid signature associated with that key pair.",
        render: () => stage(`
          <div class="flow-row">
            <div class="hash-card"><strong>Recipe hash</strong>${hashA}</div>
            <span class="arrow">+</span>
            <div class="key-card private"><span class="icon">🗝️</span><strong>Chef's private key</strong><span>Never shared</span></div>
            <span class="arrow">→</span>
            <div class="signature-stamp pop-in">DIGITALLY<br>SIGNED</div>
          </div>
        `)
      },
      {
        title: "The receiver gets the recipe and signature",
        text: "The receiver obtains the recipe and its digital signature. The receiver does not receive the chef's private key.",
        concept: "The signature can be checked using information associated with the chef's public key.",
        render: () => stage(`
          <div class="flow-row">
            <div class="visual-card slide-in-left"><span style="font-size:2.4rem">📋</span><strong>Recipe</strong><p>20 fruit measurements</p></div>
            <div class="signature-stamp">DIGITALLY<br>SIGNED</div>
            ${actor("👩‍💼", "Receiver", "Verifies package")}
          </div>
        `)
      },
      {
        title: "The receiver calculates the recipe hash again",
        text: "The receiver independently hashes the received recipe. This checks the exact data that arrived.",
        concept: "The receiver should never rely only on a supplied hash. The hash is recalculated from the received data.",
        render: () => stage(`
          <div class="flow-row">
            <div class="visual-card"><span style="font-size:2.4rem">📋</span><strong>Received recipe</strong></div>
            <span class="arrow">→</span>
            ${blender()}
            <span class="arrow">→</span>
            <div class="hash-card match"><strong>Newly calculated hash</strong>${hashA}</div>
          </div>
        `)
      },
      {
        title: "The public key verifies the signature",
        text: "The receiver uses the chef's public key to verify that the signature corresponds to the chef's private key and to the calculated recipe hash.",
        concept: "Successful verification supports authentication and integrity without revealing the private key.",
        render: () => stage(`
          <div class="flow-row">
            <div class="key-card public"><span class="icon">🔓</span><strong>Chef's public key</strong><span>Used to verify</span></div>
            <span class="arrow">→</span>
            <div class="signature-stamp">VERIFY</div>
            <span class="arrow">→</span>
            <div class="hash-card match"><strong>Verified hash</strong>${hashA}</div>
          </div>
          ${banner("Signature valid: unchanged and authorised by the matching private key.", "success")}
        `)
      },
      {
        title: "Changing the recipe breaks the signature",
        text: "If someone changes banana from 47 g to 48 g after signing, the newly calculated hash changes. The existing signature no longer matches the modified data.",
        concept: "A digital signature is tied to the exact data that was signed. Tampering causes verification to fail.",
        render: () => stage(`
          <div class="hash-compare">
            <div class="hash-card fail"><strong>Modified recipe hash</strong>${hashB}</div>
            <div style="font-size:2.6rem">≠</div>
            <div class="signature-stamp shake">OLD<br>SIGNATURE</div>
          </div>
          ${banner("Signature verification failed: the recipe changed after signing.", "failure")}
        `)
      },
      {
        title: "Now replace the recipe with a blockchain transaction",
        text: "The same pattern applies to blockchain. Alice creates a transaction, hashes and signs it with her private key, and sends the signed transaction to the network.",
        concept: "The private key authorises the transaction. It is not sent to the network.",
        render: () => stage(`
          <div class="flow-row">
            ${actor("👩", "Alice", "Transaction sender")}
            <div class="transaction-card pop-in"><strong>Transaction</strong><p>Send 10 tokens to Bob</p><p>Hash: ${txHash}</p><p>Signature attached</p></div>
            <div class="key-card private"><span class="icon">🗝️</span><strong>Alice's private key</strong><span>Signs locally</span></div>
          </div>
        `)
      },
      {
        title: "Blockchain nodes verify before recording",
        text: "Network nodes use Alice's public key information to verify the signature. If the transaction is valid and unchanged, it can proceed through the blockchain's validation and consensus process.",
        concept: "Signature verification supports authentication, integrity, authorisation and accountability.",
        render: () => stage(`
          <div class="flow-row">
            <div class="transaction-card"><strong>Signed transaction</strong><p>Alice → Bob: 10 tokens</p></div>
            <span class="arrow">→</span>
            <div class="visual-card"><span style="font-size:2.4rem">🖥️🖥️🖥️</span><strong>Blockchain nodes</strong><p>Verify signature and transaction rules</p></div>
            <span class="arrow">→</span>
            <div class="block-card pop-in"><strong>Block record</strong><p>Verified transaction accepted</p></div>
          </div>
          ${banner("Accepted: the transaction is unchanged and properly authorised.", "success")}
        `)
      },
      {
        title: "A modified transaction is rejected",
        text: "If an attacker changes 10 tokens to 100 tokens, the transaction hash changes. Alice's original signature no longer verifies against the modified transaction.",
        concept: "The network can reject the modified transaction without learning Alice's private key.",
        render: () => stage(`
          <div class="flow-row">
            <div class="transaction-card" style="border-color:#e58d84;background:var(--red-soft)"><strong>Modified transaction</strong><p>Alice → Bob: 100 tokens</p><p>Hash: ${badTxHash}</p></div>
            <span class="arrow">→</span>
            <div class="visual-card shake"><span style="font-size:2.4rem">🖥️🖥️🖥️</span><strong>Verification fails</strong><p>Hash and signature do not match</p></div>
          </div>
          ${banner("Rejected: transaction altered after signing.", "failure")}
        `)
      },
      {
        title: "Different cryptographic tools perform different jobs",
        text: "Encryption protects confidentiality, hashing supports integrity, and digital signatures support authentication and authorisation. Blockchain combines these tools with distributed records and consensus.",
        concept: "Cryptography is a collection of specialised tools, not one single security mechanism.",
        render: () => stage(`
          <div class="three-col">
            <div class="visual-card"><span style="font-size:2.3rem">🔒</span><strong>Encryption</strong><p>Who can read it?</p></div>
            <div class="visual-card"><span style="font-size:2.3rem">#️⃣</span><strong>Hashing</strong><p>Has it changed?</p></div>
            <div class="visual-card"><span style="font-size:2.3rem">✍️</span><strong>Signature</strong><p>Who authorised it?</p></div>
          </div>
          ${banner("Blockchain uses these ideas together to protect and verify transactions.", "info")}
        `)
      }
    ]
  }
];

let missionIndex = 0;
let stepIndex = 0;

const els = {
  missionCount: document.getElementById("mission-count"),
  stepCount: document.getElementById("step-count"),
  lessonKicker: document.getElementById("lesson-kicker"),
  lessonTitle: document.getElementById("lesson-title"),
  lessonBadge: document.getElementById("lesson-badge"),
  stepLabel: document.getElementById("step-label"),
  stepTitle: document.getElementById("step-title"),
  stepText: document.getElementById("step-text"),
  conceptBox: document.getElementById("concept-box"),
  scene: document.getElementById("scene"),
  stepDots: document.getElementById("step-dots"),
  tabs: [...document.querySelectorAll(".mission-tab")],
  back: document.getElementById("back-button"),
  next: document.getElementById("next-button"),
  backBottom: document.getElementById("back-button-bottom"),
  nextBottom: document.getElementById("next-button-bottom"),
  restart: document.getElementById("restart-button")
};

function actor(icon, name, role) {
  return `<div class="actor animate-in"><span class="icon">${icon}</span><strong>${name}</strong><span>${role}</span></div>`;
}

function banner(text, type = "info") {
  return `<div class="result-banner ${type} animate-in">${text}</div>`;
}

function stage(content) {
  return `<div class="scene-stage">${content}</div>`;
}

function blender() {
  return `<div class="blender pop-in"><div class="blender-jar"><div class="blender-liquid"></div></div><div class="blender-base"></div><div class="blender-button"></div></div>`;
}

function safeBox({ door = "closed", showDocument = true, docClass = "", safeClass = "", lock = "🔒", label = "Secure safe" } = {}) {
  const document = showDocument
    ? `<div class="safe-document ${docClass}"><span class="safe-paper-icon">📄</span><span class="safe-paper-label">Secret</span></div>`
    : "";

  return `<div class="safe-wrap ${safeClass}" role="img" aria-label="${label}">
    <div class="safe-body">
      <div class="safe-interior">${document}</div>
      <div class="safe-door ${door}">
        <span class="safe-hinge safe-hinge-top"></span>
        <span class="safe-hinge safe-hinge-bottom"></span>
        <div class="safe-wheel"><span>✦</span></div>
        <div class="safe-lock-icon">${lock}</div>
        <div class="safe-handle"></div>
      </div>
    </div>
  </div>`;
}

function fruitGrid(changed) {
  return fruits.map(([emoji, name, grams], i) => {
    const value = changed && i === 0 ? "48 g" : grams;
    return `<div class="fruit-chip ${changed && i === 0 ? "changed" : ""}"><span class="fruit">${emoji}</span><strong>${name}</strong><br>${value}</div>`;
  }).join("");
}

function render() {
  const lesson = lessons[missionIndex];
  const step = lesson.steps[stepIndex];

  els.missionCount.textContent = `Mission ${missionIndex + 1} of ${lessons.length}`;
  els.stepCount.textContent = `Step ${stepIndex + 1} of ${lesson.steps.length}`;
  els.lessonKicker.textContent = lesson.kicker;
  els.lessonTitle.textContent = lesson.title;
  els.lessonBadge.textContent = lesson.badge;
  els.stepLabel.textContent = `Step ${stepIndex + 1}`;
  els.stepTitle.textContent = step.title;
  els.stepText.textContent = step.text;
  els.conceptBox.innerHTML = `<strong>Key idea</strong><p>${step.concept}</p>`;
  els.scene.innerHTML = step.render();

  els.tabs.forEach((tab, i) => {
    tab.classList.toggle("active", i === missionIndex);
    tab.setAttribute("aria-current", i === missionIndex ? "step" : "false");
  });

  els.stepDots.innerHTML = lesson.steps.map((_, i) => {
    const cls = i === stepIndex ? "active" : i < stepIndex ? "complete" : "";
    const current = i === stepIndex ? ' aria-current="step"' : "";
    return `<button type="button" class="step-dot ${cls}" data-step="${i}" aria-label="Go to step ${i + 1}"${current}></button>`;
  }).join("");

  [...els.stepDots.querySelectorAll(".step-dot")].forEach(dot => {
    dot.addEventListener("click", () => {
      stepIndex = Number(dot.dataset.step);
      render();
    });
  });

  const atFirst = missionIndex === 0 && stepIndex === 0;
  const atLast = missionIndex === lessons.length - 1 && stepIndex === lesson.steps.length - 1;
  els.back.disabled = atFirst;
  els.backBottom.disabled = atFirst;
  els.next.disabled = atLast;
  els.nextBottom.disabled = atLast;
  els.next.textContent = stepIndex === lesson.steps.length - 1 && missionIndex < lessons.length - 1 ? "Next mission →" : "Next →";
  els.nextBottom.textContent = els.next.textContent;
}

function goNext() {
  const lesson = lessons[missionIndex];
  if (stepIndex < lesson.steps.length - 1) {
    stepIndex += 1;
  } else if (missionIndex < lessons.length - 1) {
    missionIndex += 1;
    stepIndex = 0;
  }
  render();
}

function goBack() {
  if (stepIndex > 0) {
    stepIndex -= 1;
  } else if (missionIndex > 0) {
    missionIndex -= 1;
    stepIndex = lessons[missionIndex].steps.length - 1;
  }
  render();
}

els.tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    missionIndex = Number(tab.dataset.mission);
    stepIndex = 0;
    render();
  });
});

[els.next, els.nextBottom].forEach(button => button.addEventListener("click", goNext));
[els.back, els.backBottom].forEach(button => button.addEventListener("click", goBack));
els.restart.addEventListener("click", () => {
  stepIndex = 0;
  render();
});

document.addEventListener("keydown", event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (event.key === "ArrowRight") {
    event.preventDefault();
    goNext();
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    goBack();
  }
});

render();
