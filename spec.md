# Valorant Agents Hub

## Current State
Full Valorant-themed single-page app with: Navbar, HeroSection, AgentsSection, GuidanceSection (ORION AI chat), FullPricingSection (3 tiers), BankPaymentModal (3-step: bank select → details → success), and Footer. All in `src/frontend/src/App.tsx`.

## Requested Changes (Diff)

### Add
- A `TransactionHistory` section accessible from the navbar (new nav link "TRANSACTIONS") and from the payment success screen (step 3 of BankPaymentModal).
- The section shows a styled table/list UI with columns: Transaction ID, Date, Plan, Bank, Amount, Status (badge: Pending/Success/Failed).
- Empty state: no mock data, just a clean empty state message ("No transactions yet") when the list is empty.
- When a payment completes (step 3 of BankPaymentModal), append a new transaction entry to the shared transaction list with: txnId, date (now), plan name, bank name, amount, status "Success".
- A `Transaction` type/interface.

### Modify
- Navbar: add "TRANSACTIONS" link that scrolls to / shows the transaction history section.
- BankPaymentModal step 3 success screen: add a "VIEW TRANSACTIONS" button that closes the modal and scrolls to the transactions section.
- App state: lift transaction list state up to `App` component and pass down to `BankPaymentModal` (onComplete callback) and `TransactionHistory`.

### Remove
- Nothing.

## Implementation Plan
1. Add `Transaction` interface at top of App.tsx.
2. Add `transactions` state to `App`, pass `onComplete` callback to `BankPaymentModal` that appends a transaction.
3. Add `TransactionHistory` section component with empty state and transaction table using existing shadcn Table or custom styled divs.
4. Render `TransactionHistory` in `<main>` between pricing and footer.
5. Add "TRANSACTIONS" to Navbar links with anchor `#transactions`.
6. Add "VIEW TRANSACTIONS" button in step 3 of BankPaymentModal that calls `onClose` and scrolls to `#transactions`.
