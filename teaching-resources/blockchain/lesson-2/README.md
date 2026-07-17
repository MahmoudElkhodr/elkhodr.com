# COIT12211 / COIT29223 Week 2 Blockchain Demo v3

Standalone static browser demo for Lecture 2: Types of Blockchain. No build step, no npm, no wallet, no backend and no blockchain network are required. Open `index.html` in any modern browser.

## What changed from v2

The rendering engine was rebuilt. Scenes now mount once and steps toggle CSS classes, so transitions genuinely animate between steps instead of the DOM being rebuilt each time. All positioning was converted from fixed pixels to percentages with SVG connector lines, so the demo scales correctly on projectors and wide lecture screens.

New teaching interactions:

- Scene 2 has a tamper button. Altering Block 1 changes its hash, breaks the `prev` links on Blocks 2 and 3, and all replica nodes flag the mismatch. This demonstrates the integrity row of the Blockchain vs Database comparison live.
- Scene 3 Proof of Work shows a live mining race with ticking nonces and streaming hash attempts, ending with the winning 000-prefixed hash.
- Scene 3 Proof of Stake has a weighted draw button. Repeated draws build a tally that approaches the 68/22/7/3 stake percentages, demonstrating that selection is probabilistic rather than fixed.
- Scene 3 Proof of Elapsed Time runs a real accelerated countdown; nodes sleep and the shortest timer wakes first.
- Scene 4 shows the Interledger packet physically travelling from Ledger A through the connector to Ledger B and back, changing to a green Fulfil or red Reject packet on the return leg.
- Scene 5 lights the Fabric endorsement flow in sequence and appends or rejects the fourth ledger entry depending on the policy outcome.

Presentation improvements:

- Keyboard control: Left and Right arrows step, Shift with arrows changes scene, Space toggles autoplay, R restarts, F toggles fullscreen, keys 1 to 5 jump to a scene.
- Fullscreen button in the control bar for lectern use.
- Manual stepping while autoplay is running resets the autoplay timer, so the presentation no longer jumps unexpectedly mid-explanation.
- The caption card is the only live region announced to screen readers, and a reduced-motion media query disables animation for students who require it.

## Teaching mode

Use the top controls or the keyboard. Autoplay plays through the scene automatically; Back step and Next step support tutor-led explanation; the speed selector adjusts autoplay pacing. The text is student-facing and avoids tutor-only meta commentary.

## Suggested in-class sequence

Scene 1 maps to slides 5 to 23 (public, permissioned, hybrid). Scene 2 maps to slides 28 to 30 (database components and the comparison table); run the tamper demonstration when discussing the integrity row. Scene 3 maps to slides 31 to 35; run several Proof of Stake draws and ask students to predict the tally before revealing it. Scene 4 maps to slides 24 to 27 (payments and Interledger packets). Scene 5 maps to slides 18, 19 and 36 (Fabric roles and Hyperledger).

## Deployment

Copy the folder to any static web location, for example GitHub Pages, and open `index.html`.
