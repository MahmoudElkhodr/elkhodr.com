I teach blockchain to undergraduate and postgraduate students at CQUniversity, and I have written a book examining the security aspects of integrating blockchain and artificial intelligence in smart cities.

One of the main benefits I highlight to my students is how blockchain protects shared records against unauthorised changes. But when billions of dollars disappear from a cryptocurrency exchange, it is reasonable to ask: what happened to the security blockchain was supposed to provide?

Binance [reported approximately US$6.3 billion in stolen assets](https://www.binance.com/en/support/announcement/detail/d3306d9dca5243548c813b605e1d1751). In its [1 November update](https://www.binance.com/en-GB/support/announcement/security-incident-recovery-update-4-withdrawals-resume-in-phases-2026-11-01-73911fb819b240f88b88256bdd318eda), it said it had covered about 95% of the affected amount and was reopening withdrawals in phases. Covering the loss is different from getting the stolen money back. Binance has been buying replacement tokens with company resources. Separately, it reported that approximately US$3 billion had been frozen, with recovery efforts continuing. Freezing funds prevents their movement; it does not necessarily mean they have been returned.

To understand what may have happened at Binance, first consider what a cryptocurrency wallet actually holds.

## What a crypto wallet actually holds

Despite its name, a crypto wallet does not contain digital coins in the way a physical wallet holds cash.

Think of a banking app: the money is not stored inside your phone. Your bank keeps records of your balance and payments. The app gives you a way to view that balance and instruct the bank to make a payment.

With cryptocurrency, there is no single bank keeping the payment records. Instead, many computers keep copies of the same transaction history. New transactions are checked and grouped into digital “blocks”. Each block is linked to the previous one, creating a chain of blocks—hence the name blockchain.

A crypto wallet gives you a way to view your funds and request a transfer, much like a banking app. But the way you authorise that transfer is different.

## How a transfer is authorised

When you make a bank payment, the bank uses checks such as your login and a verification code to confirm you have permission to move the money. A crypto wallet instead uses a secret code, called a private key, to produce a digital signature for the transaction.

The computers maintaining the blockchain can check that signature without seeing the private key. Alongside other checks, this allows them to confirm that the transaction is authorised by the key controlling those funds.

When you use an exchange such as Binance, however, the company generally manages the wallets and private keys on your behalf. Your login gives you access to your Binance account. When you request a withdrawal, Binance’s systems check the request and use the relevant keys to authorise the transfer.

## What may have happened at Binance

The emerging explanation is that attackers gained access to Binance’s internal systems and used them to request transfers. Binance initially identified a possibly compromised engineer’s laptop, although it later [found other points of entry](https://www.binance.com/en/support/announcement/detail/d3306d9dca5243548c813b605e1d1751). Think of someone getting inside a bank’s payment processing system. Rather than stealing your banking password, they make the bank process a payment as though you had approved it. Something similar may have happened at Binance: the private keys may have remained protected, while attackers made Binance’s own systems use those keys to approve fraudulent transfers.

On Ethereum, blockchain investigation firm [TRM Labs reports that attackers went further](https://www.trmlabs.com/resources/blog/north-korea-steals-usd-6-36-billion-from-binance-in-the-largest-hack-in-history). They obtained signed approval for a Binance wallet to use a program they controlled. Think of a fraudulent standing instruction that lets someone repeatedly move money out of an account. The program allowed attackers to transfer funds from the wallet, including new funds arriving afterwards. The blockchain’s computers received instructions supported by genuine digital signatures, so the signature checks could not expose the fraudulent approval. The precise failures that allowed this to happen inside Binance remain under investigation.

## The wider security lesson

The wider issue is that a decentralised blockchain can still depend on a centralised company to manage customers’ funds. If many wallets rely on the same approval system, that system can become a single point of failure, allowing one compromise to affect funds across several blockchains. Exchanges therefore need genuinely independent checks, so access to one system cannot unlock the entire payment process. Separate approvals, limits on transfers and keeping fewer funds in hot wallets—those connected to online systems for everyday withdrawals—could help contain the damage. Spreading the blockchain’s records across thousands of computers offers little protection against an exchange being tricked into approving a fraudulent payment.

## Generative AI declaration

Generative AI tools assisted with the editing, organisation and presentation of this article. Responsibility for the content and any errors remains with the author.
