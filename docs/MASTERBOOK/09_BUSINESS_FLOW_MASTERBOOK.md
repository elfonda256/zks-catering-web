# CHAPTER 09 — BUSINESS FLOW MASTERBOOK
# ENTERPRISE ERP BUSINESS ARCHITECTURE

**Company**: PT. Zahdan Kamal Sentosa (ZKS)  
**Document Class**: Enterprise Business Architecture & Operational Single Source of Truth (SSOT)  
**Author**: Enterprise Architecture, Solution Architecture & Business Systems Team  
**Scope**: End-to-End Industrial Catering Operations, Supply Chain, Central Kitchen, Distribution, and Financial Governance  

---

## EXECUTIVE SUMMARY & GOVERNANCE MANDATE

This **Business Flow Masterbook** establishes the definitive operational architecture for the Zahdan Kamal Sentosa Enterprise Resource Planning (ERP) platform. 

Operating an industrial central kitchen serving thousands of daily meals across corporate towers, manufacturing plants, healthcare centers, and large-scale industrial estates requires surgical coordination across supply chain, food safety, recipe engineering, shift-based kitchen operations, and time-critical logistics. 

Every module, API contract, database schema, workflow state machine, UI component, and automation system built in subsequent development phases **must strictly adhere to the business rules, approval hierarchies, and architectural boundaries defined in this document**.

---

## TABLE OF CONTENTS
1. [PART 01: User Roles & Operational Responsibilities](#part-01-user-roles--operational-responsibilities)
2. [PART 02: Role Permissions Matrix (RBAC)](#part-02-role-permissions-matrix-rbac)
3. [PART 03: End-to-End Business Flow (19-Stage Journey)](#part-03-end-to-end-business-flow)
4. [PART 04: Approval Hierarchies & Threshold Chains](#part-04-approval-hierarchies--threshold-chains)
5. [PART 05: Finite State Machine (Status Lifecycles)](#part-05-finite-state-machine-status-lifecycles)
6. [PART 06: Module Dependencies & Domain Contracts](#part-06-module-dependencies--domain-contracts)
7. [PART 07: Immutable Business Invariants & Rules](#part-07-immutable-business-invariants--rules)
8. [PART 08: Artificial Intelligence (AI) Co-Pilot Roadmap](#part-08-artificial-intelligence-ai-co-pilot-roadmap)
9. [PART 09: Root Cause Friendly Traceability (5W1H Framework)](#part-09-root-cause-friendly-traceability-5w1h-framework)

---

## PART 01: USER ROLES & OPERATIONAL RESPONSIBILITIES

To enforce separation of duties (SoD) and enterprise accountability, the platform defines **16 distinct operational roles**.

```
                           ┌────────────────────────┐
                           │      Super Admin       │
                           └───────────┬────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
┌────────────────────────┐                             ┌────────────────────┐
│       Management       │                             │      Auditor       │
└───────────┬────────────┘                             └────────────────────┘
            │
            ├─────────────────────┬─────────────────────┬─────────────────────┐
            ▼                     ▼                     ▼                     ▼
┌───────────────────────┐ ┌───────────────┐ ┌───────────────────────┐ ┌───────────────┐
│     Sales & CS        │ │  Procurement  │ │  Kitchen & Production │ │   Logistics   │
│ - Sales Executive     │ │ - Purchasing  │ │ - Production Planner  │ │ - Warehouse   │
│ - Customer Service    │ │ - Supplier Mgt│ │ - Prod. Supervisor    │ │ - Inv. Control│
│                       │ │               │ │ - Kitchen Cook        │ │ - Delivery    │
│                       │ │               │ │ - QA / QC Inspector   │ │               │
└───────────────────────┘ └───────────────┘ └───────────────────────┘ └───────────────┘
                                      │
                         ┌────────────┴────────────┐
                         ▼                         ▼
              ┌─────────────────────┐   ┌─────────────────────┐
              │  Finance & Acct     │   │     HR & Admin      │
              └─────────────────────┘   └─────────────────────┘
```

---

### 1. Super Admin
* **Core Responsibilities**: System integrity, tenant security, role-permission provisioning, global environment configurations, disaster recovery, and infrastructure maintenance.
* **Allowed Modules**: Complete access to all 12 modules (`Dashboard`, `Sales`, `Inventory`, `Warehouse`, `Procurement`, `Supplier`, `Production`, `Kitchen`, `Delivery`, `Finance`, `Reports`, `Settings`).
* **Restricted Modules**: None.
* **Daily Operational Activities**: Audit log inspections, API latency reviews, user access lifecycle management, system health monitoring.
* **Key Performance Indicators (KPIs)**: System uptime (≥ 99.9%), mean time to detect/resolve security alerts (< 15 mins), zero unhandled access violations.

---

### 2. Management (Board of Directors / General Manager)
* **Core Responsibilities**: Strategic oversight, company-wide profitability, capital expenditure approvals, high-value supplier contract sign-offs, and operational SLA reviews.
* **Allowed Modules**: `Dashboard`, `Reports`, `Finance`, `Procurement` (Approvals), `Production` (Read-only), `Sales` (Executive overview).
* **Restricted Modules**: Direct item creation, granular warehouse inventory adjustments, technical `Settings`.
* **Daily Operational Activities**: Review executive morning dashboard (cash flow, daily meal counts, fleet dispatch status), approve high-value POs (> Rp 50.000.000), review weekly gross margin variances.
* **KPIs**: Corporate gross margin (target ≥ 35%), customer retention rate (≥ 95%), operational cost variance within ±2% of budget.

---

### 3. Sales (Corporate Account Executive)
* **Core Responsibilities**: B2B client acquisition, corporate catering contract negotiation, event scheduling, custom menu tier proposal drafting, and client account health.
* **Allowed Modules**: `Sales`, `Dashboard` (Sales view), `Reports` (Sales analytics), `Production` (Calendar availability check).
* **Restricted Modules**: `Finance` (Direct ledger modification), `Inventory` (Physical balance modification), `Kitchen`, `Settings`.
* **Daily Operational Activities**: Follow up incoming tender RFPs, validate order lead-time (min. H-1 for <500 pax, min. H-3 for ≥500 pax), establish corporate billing terms, confirm event reservation parameters.
* **KPIs**: Monthly sales volume (pax and revenue targets), proposal-to-deal conversion rate (≥ 40%), contract renewal rate.

---

### 4. Customer Service (Order Desk & Client Support)
* **Core Responsibilities**: Order entry validation, customer inquiry handling, meal headcount adjustments within SLA cutoffs, dietary preference coordination, and delivery tracking communication.
* **Allowed Modules**: `Sales` (Order entry & customer tokens), `Delivery` (Real-time tracking), `Dashboard` (Order desk view).
* **Restricted Modules**: `Procurement`, `Inventory` adjustments, `Finance` accounting records, `Settings`.
* **Daily Operational Activities**: Process daily order bookings, confirm delivery time slots, communicate client feedback to kitchen and delivery teams, assist clients with payment proof upload.
* **KPIs**: First-response resolution time (< 15 mins), customer satisfaction score (CSAT ≥ 4.8/5.0), order error rate (< 0.1%).

---

### 5. Purchasing (Procurement Officer / Buyer)
* **Core Responsibilities**: Vendor negotiations, purchase order generation, supplier performance evaluation, price benchmarking, and contract renewals.
* **Allowed Modules**: `Procurement`, `Supplier` (SRM), `Inventory` (Read-only stock levels), `Warehouse` (Incoming receiving schedule).
* **Restricted Modules**: `Finance` disbursements, `Kitchen` recipe management, `Delivery` fleet dispatch, `Settings`.
* **Daily Operational Activities**: Review automated low-stock PRs from kitchen/warehouse, generate vendor POs against approved price contracts, coordinate urgent raw material procurement, evaluate AVL performance scorecards.
* **KPIs**: Cost savings against benchmark (≥ 3%), PO placement SLA (< 4 hours from approved PR), on-time vendor delivery rate (≥ 95%).

---

### 6. Warehouse (Storekeeper / Receiving Staff)
* **Core Responsibilities**: Loading dock goods receiving, physical put-away, warehouse bin allocation, cold chain monitoring, internal store issues, and physical stock counts.
* **Allowed Modules**: `Warehouse` (Receiving, Transfers), `Inventory` (Stock movements, Opname), `Supplier` (Receiving documents).
* **Restricted Modules**: `Sales`, `Procurement` (PO creation/approval), `Finance`, `Settings`.
* **Daily Operational Activities**: Inspect delivery trucks and temperature loggers at dock, log Advance Shipping Notices (ASN), execute material issue requisitions for kitchen prep shifts, log daily walk-in freezer temperatures.
* **KPIs**: Receiving turnaround time (< 45 mins per truck), put-away accuracy (100%), cold-chain breach incidents (0).

---

### 7. Inventory Controller (Inventory Analyst)
* **Core Responsibilities**: Par stock level maintenance, FIFO/FEFO compliance audits, stock movement traceability, variance investigations, and scrap/write-off auditing.
* **Allowed Modules**: `Inventory`, `Warehouse`, `Procurement` (PR generation), `Reports` (Inventory valuations & scrap ratios).
* **Restricted Modules**: Direct cash/payment posting, direct order generation, technical settings.
* **Daily Operational Activities**: Run daily stock replenishment checks, schedule and reconcile cyclic stock opname sessions, monitor expiry dates on perishable items, analyze inventory turnover velocity.
* **KPIs**: Inventory record accuracy (IRA ≥ 99.0%), food waste/scrap write-off (< 1.5% of inventory value), zero stockout incidents for core menu items.

---

### 8. Kitchen (Head Chef / Station Cook)
* **Core Responsibilities**: Food preparation, culinary execution, taste profile calibration, recipe adherence, station mise-en-place, and cooking hygiene standards.
* **Allowed Modules**: `Kitchen` (Work orders, BOM recipes), `Inventory` (Material requisition requests).
* **Restricted Modules**: `Sales`, `Procurement` (PO issuance), `Finance`, `Supplier`, `Settings`.
* **Daily Operational Activities**: Review daily production batch orders, pull ingredients from staging cold room, supervise cooking core temperatures (>75°C for meats), record cooking yield weights.
* **KPIs**: Kitchen recipe yield accuracy (±1.5% of BOM spec), client taste complaints (< 0.1%), kitchen station hygiene compliance (100%).

---

### 9. Production Planner (PPIC - Production Planning & Inventory Control)
* **Core Responsibilities**: Master Production Scheduling (MPS), capacity allocation across central kitchen stations, Bill of Materials (BOM) scaling, and material requirement planning (MRP).
* **Allowed Modules**: `Production`, `Kitchen`, `Inventory` (Allocation & reservation), `Sales` (Order visibility), `Reports`.
* **Restricted Modules**: `Finance`, `Supplier` commercial contract terms, technical `Settings`.
* **Daily Operational Activities**: Convert validated sales orders into production work orders, compute scaled ingredient requirements based on pax reservations, issue automated PRs for procurement gaps.
* **KPIs**: Master schedule attainment (≥ 98%), kitchen equipment capacity utilization (75%-85%), plan-to-actual material variance (< 1%).

---

### 10. Production Supervisor (Shift In-Charge)
* **Core Responsibilities**: Shift execution management, line balancing across kitchen prep stations, staff shift attendance, equipment sanitization supervision, and packaging hand-off.
* **Allowed Modules**: `Production`, `Kitchen`, `Warehouse` (Material issue), `Delivery` (Staging hand-off).
* **Restricted Modules**: `Finance`, `Procurement` contracts, `Settings`.
* **Daily Operational Activities**: Lead pre-shift briefing, ensure kitchen stations complete cooking batches on time, supervise hot-holding and blast-chilling cooling curves, verify bento box packing counts.
* **KPIs**: On-time packaging completion (≥ 99% before dispatch cutoff), zero shift work-place safety accidents, yield variance adherence.

---

### 11. QA / QC (Food Safety & Quality Inspector)
* **Core Responsibilities**: HACCP and ISO 22000 regulatory adherence, organoleptic raw material inspections at dock, cooking temperature log verification, retention sample storage, and hygiene audits.
* **Allowed Modules**: `Warehouse` (QC gate), `Production` (In-process QC), `Kitchen`, `Supplier` (Compliance docs & audit).
* **Restricted Modules**: Commercial sales pricing, procurement payment terms, financial ledgers.
* **Daily Operational Activities**: Perform core probe checks on incoming meats and poultry, audit laboratory microbiological tests, inspect water filtration and oil degradation levels, approve/reject receiving lots.
* **KPIs**: Critical Control Point (CCP) inspection rate (100%), food safety audit passing score (≥ 98%), zero microbiological non-conformances in delivered food.

---

### 12. Delivery (Fleet Dispatcher & Courier Driver)
* **Core Responsibilities**: Fleet scheduling, route sequencing, insulated thermal food container handling, temperature logger insertion, digital Proof of Delivery (PoD) capture, and empty container retrieval.
* **Allowed Modules**: `Delivery` (Dispatch runs, routes, digital PoD), `Sales` (Delivery destination details).
* **Restricted Modules**: `Inventory`, `Procurement`, `Finance`, `Kitchen`, `Settings`.
* **Daily Operational Activities**: Inspect fleet van refrigeration units, load sealed insulated thermal boxes, execute assigned delivery routes, secure signed digital delivery notes, return empty bento containers.
* **KPIs**: On-time delivery SLA (≥ 98.5% within ±10 mins of client meal window), temperature upon arrival compliance (Hot food ≥ 60°C, Chilled food ≤ 5°C), PoD capture rate (100%).

---

### 13. Finance (Cost Accountant & Billing Specialist)
* **Core Responsibilities**: Accounts Receivable (AR), Accounts Payable (AP), customer payment verification, VAT/PPN tax invoice issuance, actual vs standard food costing (COGS), and bank reconciliations.
* **Allowed Modules**: `Finance`, `Sales` (Payment status & invoicing), `Procurement` (PO 3-way matching), `Reports`.
* **Restricted Modules**: Physical inventory edits, kitchen recipes, technical settings.
* **Daily Operational Activities**: Verify customer DP and final invoice settlements, match PO + Goods Receiving + Supplier Invoice (3-Way Match), process vendor disbursements, compute weekly COGS variances.
* **KPIs**: Day Sales Outstanding (DSO < 30 days), 3-way match error rate (0%), tax compliance filing accuracy (100%).

---

### 14. HR (Human Resources & Kitchen Health Compliance)
* **Core Responsibilities**: Food handler health card tracking (Buku Kuning / Typhoid vaccination), kitchen labor capacity, chef certifications, shift rosters, and hygiene training records.
* **Allowed Modules**: `HR`, `Dashboard` (Staffing overview), `Reports` (Labor cost per meal).
* **Restricted Modules**: Commercial sales, procurement purchasing, technical configuration.
* **Daily Operational Activities**: Track mandatory medical checkup expirations, manage kitchen overtime allocations, verify certification compliance for butchery and pastry chefs.
* **KPIs**: Food handler health card compliance rate (100%), kitchen staff retention rate (≥ 90%), labor cost percentage within standard budget.

---

### 15. Auditor (Internal Audit & Compliance Officer)
* **Core Responsibilities**: Independent verification of business controls, anti-fraud monitoring, inventory variance investigations, price variance audits, and regulatory compliance reviews.
* **Allowed Modules**: Complete Read-Only access across all modules (`Dashboard`, `Sales`, `Inventory`, `Warehouse`, `Procurement`, `Supplier`, `Production`, `Kitchen`, `Delivery`, `Finance`, `Reports`).
* **Restricted Modules**: Cannot create, edit, or delete any operational records.
* **Daily Operational Activities**: Review system change logs (5W1H), investigate unexpected inventory adjustments, review supplier price variance flags, conduct random batch traceability reconciliations.
* **KPIs**: Audit coverage of high-risk transactions (100%), resolution of operational findings (< 30 days), zero undetected compliance breaches.

---

### 16. Guest (Client Portal Viewer / External Vendor)
* **Core Responsibilities**: Read-only tracking of client-specific orders, digital delivery note viewing, and invoice review.
* **Allowed Modules**: Limited External Portal (Own Orders & Delivery Status only).
* **Restricted Modules**: All internal ERP operational and administrative modules.
* **Daily Operational Activities**: Check today's meal dispatch ETA, download monthly tax invoices, submit meal headcount updates for upcoming weeks.
* **KPIs**: Portal self-service adoption rate (≥ 80%).

---

## PART 02: ROLE PERMISSIONS MATRIX (RBAC)

The following Role-Based Access Control matrix governs all operations.

**Legend**:
* **V** = View / Read
* **C** = Create
* **E** = Edit / Update
* **A** = Approve / Authorize
* **D** = Delete (Soft delete / Void)
* **X** = Export (CSV / Excel / PDF)
* **—** = No Access

| Module | Super Admin | Management | Sales | Cust. Service | Purchasing | Warehouse | Inv. Controller | Kitchen | Prod. Planner | Prod. Superv. | QA / QC | Delivery | Finance | HR | Auditor |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Dashboard** | V,X | V,X | V | V | V | V | V | V | V | V | V | V | V,X | V | V,X |
| **Sales** | V,C,E,A,D,X | V,A,X | V,C,E,X | V,C,E | — | — | — | — | V | — | — | V | V,E,A,X | — | V,X |
| **Inventory** | V,C,E,A,D,X | V,X | — | — | V | V,C,E | V,C,E,A,X | V | V,E | V | V | — | V,X | — | V,X |
| **Warehouse** | V,C,E,A,D,X | V,X | — | — | V | V,C,E,A | V,C,E,X | — | V | V,E | V,A | V | V,X | — | V,X |
| **Procurement** | V,C,E,A,D,X | V,A,X | — | — | V,C,E,X | V,C | V,C,E | — | V,C | — | — | — | V,A,X | — | V,X |
| **Supplier** | V,C,E,A,D,X | V,A,X | — | — | V,C,E,X | V | V | — | — | — | V,E,A | — | V,E,X | — | V,X |
| **Production** | V,C,E,A,D,X | V,X | V | — | — | V | V | V | V,C,E,A,X | V,E,A | V,A | V | V,X | — | V,X |
| **Kitchen** | V,C,E,A,D,X | V,X | — | — | — | V | — | V,C,E | V,C,E | V,E,A | V,A | — | — | — | V,X |
| **Delivery** | V,C,E,A,D,X | V,X | V | V | — | V | — | — | V | V | — | V,C,E,A,X| V,X | — | V,X |
| **Finance** | V,C,E,A,D,X | V,A,X | V | — | V | — | V | — | — | — | — | — | V,C,E,A,X| V | V,X |
| **Reports** | V,C,E,A,D,X | V,X | V,X | V | V,X | V,X | V,X | — | V,X | V,X | V,X | V,X | V,X | V,X | V,X |
| **Settings** | V,C,E,A,D,X | V | — | — | — | — | — | — | — | — | — | — | — | — | V |

---

## PART 03: END-TO-END BUSINESS FLOW

The end-to-end operational lifecycle connects corporate demand to raw ingredient procurement, kitchen batching, dispatch, and revenue reconciliation.

```
[1. CUSTOMER ORDER]
        │ (Contract or Ad-Hoc Request)
        ▼
[2. SALES VALIDATION] ───────────────► (Rejected / Quota Exceeded)
        │ (Capacity & Lead Time Confirmed)
        ▼
[3. PRODUCTION PLANNING (PPIC)]
        │ (Master Production Schedule)
        ▼
[4. RECIPE BILL OF MATERIALS (BOM)]
        │ (Scaled by Pax Count & Scrap Factor)
        ▼
[5. INGREDIENT REQUIREMENT (MRP)]
        │ (Gross Requirement Computed)
        ▼
[6. INVENTORY AVAILABILITY CHECK]
       /                                 \
(Sufficient Stock)                (Shortage Detected)
     │                                    │
     │                            [7. PURCHASE REQUEST (PR)]
     │                                    │ (PPIC / Kitchen Auto-Trigger)
     │                                    ▼
     │                            [8. PURCHASE APPROVAL]
     │                                    │ (Department Head / GM)
     │                                    ▼
     │                            [9. PURCHASE ORDER (PO)]
     │                                    │ (Issued to Approved Supplier)
     │                                    ▼
     │                            [10. SUPPLIER DISPATCH]
     │                                    │ (ASN & Cold Truck Delivery)
     │                                    ▼
     │                            [11. GOODS RECEIVING (DOCK)]
     │                                    │ (Physical Count & Manifest)
     │                                    ▼
     │                            [12. QUALITY CONTROL (QC)] ──► (Quarantine / Reject)
     │                                    │ (Temp & Hygiene Approved)
     │                                    ▼
     │                            [13. WAREHOUSE PUT-AWAY]
     │                                    │ (FEFO Batch Tagged & Stored)
     \                                   /
      ───────► [14. MATERIAL ISSUE TO KITCHEN]
                       │ (Requisition Pulled via FEFO)
                       ▼
               [15. KITCHEN PRODUCTION]
                       │ (Butchery -> Marination -> Cooking >75°C)
                       ▼
               [16. POST-COOKING QA & CHILL/HOLD]
                       │ (Blast Chilling / Hot Holding Inspected)
                       ▼
               [17. PACKAGING & PORTIONING]
                       │ (Bento Sealing & Thermal Box Tagging)
                       ▼
               [18. FLEET DISPATCH & DISTRIBUTION]
                       │ (Route Optimized & Loggers Active)
                       ▼
               [19. CUSTOMER DELIVERY & INVOICE]
                       │ (Digital PoD Signed -> AR Invoiced -> COGS Report)
                       ▼
                 [COMPLETED CYCLE]
```

### Granular Stage Specifications

1. **Customer Order**:
   * *Trigger*: B2B corporate catering contract, event reservation, or recurring factory meal schedule entered into the platform.
   * *Payload*: Client ID, pax count, menu package tier, delivery location, meal time window, special dietary requests (halal, vegetarian, allergy exclusions).
2. **Sales Validation**:
   * *Process*: Automated validation of client credit limit and minimum lead-time (min. H-1 for <500 pax, min. H-3 for ≥500 pax).
   * *Output*: Sales Order locked in `CONFIRMED` status.
3. **Production Planning (PPIC)**:
   * *Process*: Production schedule generated based on delivery windows. Batches allocated across kitchen stations (Butchery, Hot Kitchen, Steaming, Cold Assembly).
4. **Recipe Bill of Materials (BOM)**:
   * *Process*: System references master recipes and multiplies ingredient grammage by total pax count, applying culinary scrap factors (e.g. 15% bone/skin loss on whole chicken).
5. **Ingredient Requirement Calculation (MRP)**:
   * *Formula*: $\text{Gross Requirement} = \text{Pax} \times \text{Standard Portion} \times (1 + \text{Waste Factor})$.
6. **Inventory Availability Check**:
   * *Process*: System checks current available balances in warehouse bins.
   * *Outcome A*: Stock is sufficient $\rightarrow$ status set to `ALLOCATED` to reserve inventory.
   * *Outcome B*: Stock is insufficient $\rightarrow$ net shortage balance computed.
7. **Purchase Request (PR)**:
   * *Process*: Automated PR generated for raw material deficits plus standard safety buffers.
8. **Purchase Approval**:
   * *Process*: Authorization routed based on spending thresholds (Supervisor, Operational Manager, GM).
9. **Purchase Order (PO)**:
   * *Process*: Procurement issues formal PO to selected vendor from Approved Vendor List (AVL), enforcing agreed price contracts and delivery timeframes.
10. **Supplier Fulfillment**:
    * *Process*: Vendor acknowledges PO and dispatches goods via refrigerated transport accompanied by delivery note and certificates of analysis (CoA).
11. **Goods Receiving (Dock)**:
    * *Process*: Warehouse receiver inspects truck seal, verifies physical box counts against ASN and PO, and logs arrival time.
12. **Quality Control (QC Gate)**:
    * *Process*: QC inspector probes internal temperatures (Poultry/Meat $\le -18^\circ\text{C}$ or $\le 4^\circ\text{C}$, Dairy $\le 4^\circ\text{C}$), inspects freshness, and verifies Halal logo and expiry dates.
    * *Decision*: Lot accepted, quarantined, or rejected back to supplier.
13. **Warehouse Put-Away**:
    * *Process*: Accepted items tagged with barcode batch labels containing receiving date, expiry date, and storage location (Walk-in Freezer, Chiller, Dry Storage).
14. **Material Issue to Kitchen**:
    * *Process*: Kitchen station issues material requisition; warehouse fulfills requisition following First-Expired, First-Out (FEFO).
15. **Kitchen Production**:
    * *Process*: Station cooks execute work orders: butchery trimming, marination, blast steaming, stir-frying, and deep baking. Core temperatures recorded on digital CCP sheets.
16. **Post-Cooking QA & Temperature Holding**:
    * *Process*: Core temperature probed ($\ge 75^\circ\text{C}$ for cooked proteins). Hot meals maintained at $\ge 60^\circ\text{C}$ in insulated cabinets; cook-chill items blasted to $<4^\circ\text{C}$ within 120 minutes.
17. **Packaging & Portioning**:
    * *Process*: Assembly line packaging into biodegradable bento boxes or bulk gastronomy trays. Inspected with digital scale for portion grammage adherence. Boxes packed into insulated thermal containers.
18. **Fleet Dispatch & Distribution**:
    * *Process*: Fleet manager assigns vans based on route sequencing and traffic windows. Digital route sheets generated.
19. **Customer Delivery, PoD, Invoicing & Reporting**:
    * *Process*: Driver arrives at corporate drop-off dock, client PIC verifies counts and food temperature, signs digital Proof of Delivery (PoD).
    * *Financial Settlement*: Finance auto-generates official tax invoice, reconciles food cost (actual vs standard COGS), and archives transaction in audit database.

---

## PART 04: APPROVAL HIERARCHIES & THRESHOLD CHAINS

To prevent fraud and maintain financial control, transactions enforce multi-tier approval chains.

```
                              [PURCHASE ORDER APPROVAL]
                                         │
                                         ▼
                            Total Value <= Rp 10.000.000?
                             /                         \
                          (YES)                        (NO)
                            │                            │
                            ▼                            ▼
                 [Purchasing Supervisor]       Total Value <= Rp 50.000.000?
                            │                   /                         \
                        (APPROVED)           (YES)                        (NO)
                                               │                            │
                                               ▼                            ▼
                                    [Procurement Manager]          [General Manager / BoD]
                                               │                            │
                                           (APPROVED)                   (APPROVED)
```

### Detailed Approval Matrix

| Transaction Type | Threshold / Condition | Tier 1 Approver | Tier 2 Approver | Tier 3 Approver |
| :--- | :--- | :--- | :--- | :--- |
| **Purchase Request (PR)** | Standard Operational Low-Stock | Kitchen / Warehouse Supervisor | Procurement Lead | — |
| **Purchase Request (PR)** | Urgent / Emergency Requisition | Operational Manager | General Manager | — |
| **Purchase Order (PO)** | $\le \text{Rp } 10.000.000$ | Purchasing Supervisor | — | — |
| **Purchase Order (PO)** | $\text{Rp } 10.000.001 - \text{Rp } 50.000.000$ | Purchasing Supervisor | Procurement Manager | — |
| **Purchase Order (PO)** | $> \text{Rp } 50.000.000$ | Procurement Manager | Finance Director | General Manager |
| **Stock Adjustment (Minus)**| Variance value $\le \text{Rp } 1.000.000$ | Inventory Controller | Warehouse Manager | — |
| **Stock Adjustment (Minus)**| Variance value $> \text{Rp } 1.000.000$ (Scrap) | Warehouse Manager | Finance Controller | General Manager |
| **Stock Opname Reconciliation**| Total Accuracy $\ge 98\%$ | Inventory Controller | Warehouse Manager | — |
| **Stock Opname Reconciliation**| Total Accuracy $< 98\%$ | Warehouse Manager | Internal Auditor | Finance Director |
| **Warehouse Transfer** | Internal Kitchen Staging Transfer | Storekeeper | Station Lead | — |
| **Warehouse Transfer** | Inter-Facility / Remote Kitchen | Warehouse Supervisor | Logistics Manager | — |
| **Production Work Order** | Standard Recipe Execution | Production Planner | Head Chef | — |
| **Recipe BOM Override** | Substituted Ingredient or Grammage Change | Head Chef | QA / QC Manager | General Manager |
| **Customer Credit Limit** | Term extension or Credit $\ge \text{Rp } 50.000.000$ | Sales Lead | Finance Manager | General Manager |
| **Vendor Suspension (SRM)** | Compliance breach or rating $< 70$ | Procurement Lead | QA / QC Manager | General Manager |

---

## PART 05: FINITE STATE MACHINE (STATUS LIFECYCLES)

Every entity follows a strict lifecycle state machine. Transitions outside the defined paths are rejected.

### 1. Purchase Request (PR) Lifecycle
```
[DRAFT] ──► [SUBMITTED] ──► [UNDER_REVIEW] ──► [APPROVED] ──► [CONVERTED_TO_PO] ──► [CLOSED]
                 │                 │
                 ▼                 ▼
            [CANCELLED]       [REJECTED]
```
* **DRAFT**: Created by requester, items editable.
* **SUBMITTED**: Locked for edits, notification sent to supervisor.
* **UNDER_REVIEW**: Approver inspecting stock levels and budget.
* **APPROVED**: Validated for PO generation.
* **REJECTED**: Returned to requester with mandatory explanation note.
* **CONVERTED_TO_PO**: Items fully linked to active Purchase Orders.
* **CLOSED**: All items received and verified at dock.

---

### 2. Purchase Order (PO) Lifecycle
```
[DRAFT] ──► [WAITING_APPROVAL] ──► [APPROVED] ──► [ISSUED] ──► [ACKNOWLEDGED]
                 │                                                   │
                 ▼                                                   ▼
            [REJECTED]                                         [IN_DELIVERY]
                                                                     │
                                                                     ▼
                                                          [PARTIALLY_RECEIVED]
                                                                     │
                                                                     ▼
                                                           [COMPLETED / PAID]
```
* **DRAFT**: Prepared by buyer, vendor assigned, prices calculated.
* **WAITING_APPROVAL**: Awaiting authorized signatures based on financial tier.
* **APPROVED**: Legally authorized for commercial release.
* **ISSUED**: Official PO PDF transmitted to supplier.
* **ACKNOWLEDGED**: Supplier confirms order quantities, prices, and delivery slot.
* **IN_DELIVERY**: Vendor dispatches truck; ASN number recorded.
* **PARTIALLY_RECEIVED**: First batch arrived at dock; remainder pending.
* **COMPLETED**: 100% quantity delivered, QC inspected, and 3-way matched.
* **CANCELLED**: Order voided prior to dispatch; audit justification required.

---

### 3. Inventory Stock State Lifecycle
```
[AVAILABLE] ──► [RESERVED] ──► [ALLOCATED] ──► [ISSUED_TO_KITCHEN] ──► [CONSUMED]
     │              │               │
     ▼              ▼               ▼
[QUARANTINE] ──► [DAMAGED] ──► [WRITTEN_OFF]
     │
     ▼
 [EXPIRED]
```
* **AVAILABLE**: Physically present in warehouse bin, QC cleared, ready for picking.
* **RESERVED**: Committed to future production schedule (not pickable for other jobs).
* **ALLOCATED**: Assigned to active shift work order currently in preparation.
* **ISSUED_TO_KITCHEN**: Physically moved from warehouse to central kitchen station.
* **CONSUMED**: Cooked into meals, deducted from on-hand balances.
* **QUARANTINE**: Held pending re-inspection, temperature check, or lab audit.
* **EXPIRED / DAMAGED**: Shelf-life exceeded or package breached; locked from kitchen issue.
* **WRITTEN_OFF**: Approved disposal and financial scrap deduction logged.

---

### 4. Goods Receiving & QC Inspection Lifecycle
```
[ASN_SCHEDULED] ──► [DOCK_ARRIVED] ──► [IN_QC_INSPECTION]
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      ▼                                               ▼
              [ACCEPTED_FULL]                                 [REJECTED_FULL]
                      │                                               ▲
                      ▼                                               │
              [PUT_AWAY_COMPLETE]                             [PARTIAL_REJECT]
```
* **ASN_SCHEDULED**: Supplier advance notice logged with expected arrival window.
* **DOCK_ARRIVED**: Truck docked at central kitchen bay, manifest unsealed.
* **IN_QC_INSPECTION**: QC staff probing core temperature, organoleptic smell/color, and seal integrity.
* **ACCEPTED_FULL**: 100% passed inspection; batch barcode labels generated.
* **PARTIAL_REJECT**: Defective portion returned immediately on supplier truck; credit note generated.
* **REJECTED_FULL**: Entire shipment returned due to cold-chain break or quality defect.
* **PUT_AWAY_COMPLETE**: Stored in target bin (Freezer, Chiller, Dry Storage).

---

### 5. Production Work Order Lifecycle
```
[PLANNED] ──► [SCHEDULED] ──► [MATERIAL_ISSUED] ──► [IN_COOKING] ──► [QUALITY_HOLD] ──► [PACKED] ──► [DISPATCHED]
```
* **PLANNED**: Generated from master sales contract and pax forecast.
* **SCHEDULED**: Shift, station cooks, and cooking vessels locked.
* **MATERIAL_ISSUED**: FEFO ingredients picked and transferred to kitchen prep.
* **IN_COOKING**: Active thermal execution (roasting, steaming, frying).
* **QUALITY_HOLD**: Post-cooking temperature probe and retention sample archiving.
* **PACKED**: Sealed in bento boxes, boxed in thermal insulated dispatch totes.
* **DISPATCHED**: Handed over to fleet logistics drivers.

---

### 6. Delivery Run Lifecycle
```
[SCHEDULED] ──► [STAGED] ──► [LOADING] ──► [IN_TRANSIT] ──► [ARRIVED_CLIENT] ──► [DELIVERED_POD]
                                                                                    │
                                                                                    ▼
                                                                             [EXCEPTION_LOGGED]
```
* **SCHEDULED**: Vehicle and driver assigned to route.
* **STAGED**: Thermal containers aligned at loading dock.
* **LOADING**: Van temperature confirmed ($\le 4^\circ\text{C}$ or ambient), boxes loaded.
* **IN_TRANSIT**: GPS live tracking active, delivery countdown running.
* **ARRIVED_CLIENT**: Van docked at client building facility.
* **DELIVERED_POD**: Client PIC signs digital delivery note, temperature verified.
* **EXCEPTION_LOGGED**: Client claims missing items or traffic delay; auto-escalated to CS.

---

## PART 06: MODULE DEPENDENCIES & DOMAIN CONTRACTS

To prevent circular dependencies and maintain modular scalability, modules communicate through strict **contract interfaces**.

```
   ┌──────────┐
   │  Sales   │
   └────┬─────┘
        │ (Sales Order Contract)
        ▼
   ┌──────────┐
   │   PPIC   │◄──────────┐
   └────┬─────┘           │
        │ (MRP Contract)  │ (BOM Definition)
        ▼                 │
   ┌──────────┐     ┌─────┴──────┐
   │Inventory │     │  Kitchen   │
   └────┬─────┘     └────────────┘
        │ (Shortage / PR Contract)
        ▼
   ┌──────────┐
   │Procurem. │
   └────┬─────┘
        │ (PO Contract)
        ▼
   ┌──────────┐
   │ Supplier │
   └────┬─────┘
        │ (ASN / Delivery Contract)
        ▼
   ┌──────────┐
   │Warehouse │
   └────┬─────┘
        │ (Material Issue Contract)
        ▼
   ┌──────────┐
   │Production│
   └────┬─────┘
        │ (Packed Totes Contract)
        ▼
   ┌──────────┐
   │ Delivery │
   └────┬─────┘
        │ (Proof of Delivery Contract)
        ▼
   ┌──────────┐
   │ Finance  │
   └──────────┘
```

### Domain Interface Contracts

1. **Sales $\rightarrow$ Production (Order Contract)**:
   * *Exposes*: `getConfirmedOrders(dateRange, mealType)`
   * *Guarantees*: Meal pax count, delivery deadline, customer allergy constraints.
2. **Production $\rightarrow$ Kitchen (Recipe Contract)**:
   * *Exposes*: `getScaledRecipeBOM(recipeId, targetPax)`
   * *Guarantees*: Net ingredient weights scaled with scrap loss percentages.
3. **Kitchen $\rightarrow$ Inventory (Requisition Contract)**:
   * *Exposes*: `requestMaterialIssue(stationId, workOrderId, items[])`
   * *Guarantees*: Deductions occur according to strict FEFO batch logic.
4. **Inventory $\rightarrow$ Procurement (Replenishment Contract)**:
   * *Exposes*: `getDeficitIngredients(productionDate)`
   * *Guarantees*: Net deficit calculation subtracting safety buffer and current stock.
5. **Procurement $\rightarrow$ Supplier (Purchase Contract)**:
   * *Exposes*: `issueSupplierPO(supplierId, lineItems[], paymentTerms)`
   * *Guarantees*: Vendor is active on Approved Vendor List (AVL) with valid Halal/ISO certification.
6. **Supplier $\rightarrow$ Warehouse (ASN Contract)**:
   * *Exposes*: `registerIncomingDelivery(poId, truckManifest, expectedArrival)`
   * *Guarantees*: Pre-notifies dock receiving crew and reserves cold storage staging bay.
7. **Warehouse $\rightarrow$ Production (Material Transfer Contract)**:
   * *Exposes*: `transferToKitchenPrep(workOrderId, verifiedLots[])`
   * *Guarantees*: No quarantined or un-inspected lot can enter kitchen production.
8. **Production $\rightarrow$ Delivery (Dispatch Manifest Contract)**:
   * *Exposes*: `registerDispatchRun(orderId, thermalBoxCount, targetTemp)`
   * *Guarantees*: Every box is labeled with dispatch barcode and security tamper seal.
9. **Delivery $\rightarrow$ Finance (Billing Settlement Contract)**:
   * *Exposes*: `confirmClientReceipt(poDId, clientSignature, receivedPaxCount)`
   * *Guarantees*: Triggers final invoice generation and seals transaction in audit log.

---

## PART 07: IMMUTABLE BUSINESS INVARIANTS & RULES

The following rules represent **inviolable operational laws**. The ERP system must reject any transaction that violates these constraints.

### 1. Inventory & Stock Rules
* **Rule 1.1 (No Negative Stock)**: Inventory balances can **never drop below zero**. If system stock is insufficient, physical adjustment or emergency procurement must precede material issue.
* **Rule 1.2 (Mandatory FEFO Execution)**: Ingredients with earlier expiration dates must be picked first. Overriding FEFO requires Head Chef and QC authorization with a recorded reason.
* **Rule 1.3 (Zero Uninspected Put-Away)**: No ingredient can be added to available inventory without a signed QC inspection record verifying temperature and organoleptic quality.
* **Rule 1.4 (Lot Immutability)**: Once a batch is received, its batch number, supplier code, receiving date, and expiry date cannot be modified. Corrections must occur via audited adjustment transactions.

### 2. Food Safety & Temperature Governance
* **Rule 2.1 (Cold Chain Invariant)**: Perishable proteins must arrive and be stored at $\le -18^\circ\text{C}$ (frozen) or $\le 4^\circ\text{C}$ (chilled). Any breach of $>6^\circ\text{C}$ for $>30\text{ minutes}$ triggers automatic lot quarantine.
* **Rule 2.2 (Cooking Core Temperature Invariant)**: All poultry and meat preparations must reach an internal core temperature of $\ge 75^\circ\text{C}$ for at least 15 seconds. Batches failing this check cannot be packaged.
* **Rule 2.3 (Blast Chill Curve)**: Cook-chill preparations must be cooled from $60^\circ\text{C}$ to $<4^\circ\text{C}$ within 120 minutes. Failure requires disposal.
* **Rule 2.4 (Hot Holding Threshold)**: Hot-service catered meals must be maintained at $\ge 60^\circ\text{C}$ from packaging through customer delivery.

### 3. Procurement & Commercial Rules
* **Rule 3.1 (No PO Without Approved Supplier)**: Purchase orders can only be issued to vendors with `ACTIVE` or `PREFERRED` status on the Approved Vendor List.
* **Rule 3.2 (No Expired Vendor Compliance)**: Vendors with expired Halal certificates or business licenses are automatically blocked from receiving new POs.
* **Rule 3.3 (Dual Control Financial Authorization)**: Any PO exceeding $\text{Rp } 50.000.000$ requires independent approval from both Procurement Manager and General Manager.
* **Rule 3.4 (3-Way Matching Invariant)**: Finance disbursements require exact automated matching across:
  1. Approved Purchase Order
  2. Verified Goods Receiving Note (GRN)
  3. Supplier Commercial Tax Invoice

### 4. Sales & Order Execution Rules
* **Rule 4.1 (Lead Time Enforceability)**: Standard orders require minimum H-1 (24h lead time). Large orders ($\ge 500\text{ pax}$) require minimum H-3 (72h lead time). System rejects orders submitted inside the lock window without General Manager override.
* **Rule 4.2 (Down Payment Lock)**: Production work orders cannot be scheduled until the mandatory 20% down payment (or approved corporate credit terms) is verified by Finance.
* **Rule 4.3 (No Dispatch Without Client Validation)**: Delivery fleet cannot depart the facility without confirmed client PIC contact information and target delivery time window.

### 5. Audit & Data Integrity Rules
* **Rule 5.1 (No Hard Deletes)**: System never executes hard SQL `DELETE` operations on operational entities. Entities are soft-deleted or marked `CANCELLED` / `VOID` with full historical preservation.
* **Rule 5.2 (Approved Transaction Immutability)**: Once a PO, Stock Opname, Invoice, or Delivery Note is `APPROVED` or `COMPLETED`, it cannot be edited. Corrections require reversal entries or debit/credit notes.
* **Rule 5.3 (Mandatory 5W1H Logging)**: Every creation, status change, price override, and approval must generate an immutable audit log capturing Who, What, When, Where, Why, and How.

---

## PART 08: ARTIFICIAL INTELLIGENCE (AI) CO-PILOT ROADMAP

The ERP architecture incorporates targeted artificial intelligence agents designed to optimize operations, reduce food waste, and automate routine operational decisions.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ZKS AI CO-PILOT ENGINE                          │
├──────────────────┬──────────────────┬──────────────────┬───────────────┤
│ 1. Demand & Pax  │ 2. Yield & Scrap │ 3. Smart SRM &   │ 4. Cold Chain │
│    Forecaster    │    Optimizer     │    Auto-PO       │    & Routing  │
├──────────────────┼──────────────────┼──────────────────┼───────────────┤
│ Forecasts daily  │ Computes dynamic │ Evaluates vendor │ Optimizes van │
│ meal counts from │ scrap factors by │ scorecards,      │ loading,      │
│ factory calendar │ vegetable batch  │ prices & SLAs    │ routes, and   │
│ & weather cues   │ quality          │ to suggest POs   │ arrival temps │
└──────────────────┴──────────────────┴──────────────────┴───────────────┘
```

### 1. Demand & Pax Forecasting
* **Objective**: Predict daily fluctuating meal volumes for industrial corporate clients.
* **Data Signals**: Historical contract reservations, client manufacturing shift schedules, national holidays, local weather forecasts (rain correlates with higher on-site meal consumption).
* **Business Benefit**: Eliminates over-purchasing of perishable vegetables and proteins; prevents last-minute emergency procurement premiums.

### 2. Ingredient Requirement & Scrap Optimization
* **Objective**: Calculate dynamic scrap factors based on seasonal agricultural quality.
* **Mechanism**: When processing bulk produce (e.g. carrots, onions, whole chickens), seasonal rain affects trim loss. AI dynamically updates the BOM waste factor (e.g. adjusting onion trim loss from 12% to 16% in rainy months), ensuring kitchen cooks never run short during prep.
* **Business Benefit**: Zero mid-shift recipe shortages; true food costing accuracy.

### 3. Smart Supplier Allocation & Auto-PO Recommendation
* **Objective**: Automatically recommend the optimal vendor for generated Purchase Requests.
* **Mechanism**: Multi-variable optimization balancing:
  - Unit price contract
  - Historical On-Time Delivery %
  - Recent QC acceptance score
  - Minimum lead time
* **Business Benefit**: 80% reduction in manual buyer allocation time; automated enforcement of preferred vendor distribution.

### 4. Food Waste Prediction & Surplus Repurposing
* **Objective**: Minimize central kitchen organic waste.
* **Mechanism**: Analyzes residual batches and suggests cross-utilization (e.g. clean roasted meat trims from lunch bento runs converted into stock bases or shredded filling for evening shift snacks).
* **Business Benefit**: Lowers corporate food waste from 3.5% to under 1.2% of raw material volume.

### 5. Fleet Route Sequencing & Thermal Latency Optimization
* **Objective**: Protect food temperature integrity across multi-stop corporate deliveries.
* **Mechanism**: Integrates real-time Jakarta traffic signals with insulated thermal container heat-loss curves ($0.8^\circ\text{C}$ loss per 30 minutes). Orders deliveries so highest-temperature-sensitive meals arrive first.
* **Business Benefit**: 100% adherence to $\ge 60^\circ\text{C}$ hot food delivery standard; 18% fuel cost reduction.

### 6. Automated Cost Anomaly & Price Gouging Detection
* **Objective**: Protect corporate procurement margins.
* **Mechanism**: Scans supplier quotes against national food commodity benchmark indices (PIHPS / Pasar Induk Cipinang). Flags supplier price increases exceeding 3% for managerial review.
* **Business Benefit**: Prevents procurement leakage and unauthorized vendor price creep.

---

## PART 09: ROOT CAUSE FRIENDLY TRACEABILITY (5W1H)

During operational incidents (e.g. food quality complaints, delivery delays, inventory write-offs, or audit inquiries), the system enables **instant root cause analysis (RCA)** through a standardized **5W1H audit framework**.

```
[CUSTOMER COMPLAINT / AUDIT QUERY]
                 │
                 ▼
       [5W1H AUDIT INSPECTOR]
                 │
                 ├─► WHO:   Operator, Supervisor, Approver User IDs
                 ├─► WHAT:  Item SKU, Batch Number, Temperature Log, Qty
                 ├─► WHEN:  Timestamp accurate to millisecond (ISO 8601)
                 ├─► WHERE: Warehouse Bin, Kitchen Station, Van ID, Dock
                 ├─► WHY:   Business reason, Order code, Exception code
                 └─► HOW:   FEFO Requisition, Work Order, Thermal Run
```

### Full Backward Lot Traceability Chain
In under 60 seconds, an auditor or QC manager can trace backward from a single catered meal box:

1. **Meal Box**: Client receives Bento Box at 11:30 WIB $\rightarrow$ Barcode scanned.
2. **Delivery Run**: Delivered on Van `B 9021 KKS` $\rightarrow$ Driver `Ahmad` $\rightarrow$ Departure 10:15 WIB $\rightarrow$ Temperature arrival $64.2^\circ\text{C}$.
3. **Packaging Line**: Packed at Packing Station 2 at 09:30 WIB $\rightarrow$ Sealing Inspector `Siti`.
4. **Cooking Batch**: Cooked in Steam Convection Oven 3 $\rightarrow$ Work Order `WO-20261021-04` $\rightarrow$ Core temp probed at $82.4^\circ\text{C}$ by Chef `Bambang`.
5. **Prep Station**: Marinated and butchered at Station 1 $\rightarrow$ Pull time 06:45 WIB.
6. **Warehouse Lot**: Material Requisition `REQ-8819` pulled 250 kg Chicken Fillet from Batch `LOT-CP-20261018-01` $\rightarrow$ Location: Cold Room 1 Bin A-04.
7. **Dock Receiving**: Received on 2026-10-18 07:15 WIB $\rightarrow$ QC Inspector `Rudi` $\rightarrow$ Probe temp $2.1^\circ\text{C}$ $\rightarrow$ CoA Halal Valid.
8. **Purchase Order**: Purchased under `PO-202610-0089` from `PT Charoen Pokphand Indonesia Tbk` $\rightarrow$ Approved by GM `Budi Santoso`.

### Universal Audit Log Schema Requirements
Every transactional record in the database must capture:
```typescript
interface EnterpriseAuditLog {
  id: string;
  entityType: "ORDER" | "PO" | "PR" | "INVENTORY_BATCH" | "WORK_ORDER" | "DELIVERY_RUN" | "PAYMENT";
  entityId: string;
  action: "CREATE" | "UPDATE" | "APPROVE" | "REJECT" | "CANCEL" | "OVERRIDE" | "QC_PASS" | "QC_FAIL";
  actorId: string;
  actorName: string;
  actorRole: string;
  ipAddress: string;
  timestamp: string; // ISO 8601 UTC with ms
  locationCode?: string; // e.g. "DOCK-01", "KITCHEN-STATION-2", "VAN-04"
  previousState?: Record<string, unknown>;
  newState: Record<string, unknown>;
  justificationReason?: string; // Mandatory for overrides, rejections, scrap adjustments
  verificationHash: string; // SHA-256 tamper-evident checksum
}
```

---

## CONCLUSION & ARCHITECTURAL COMPLIANCE

This **Business Flow Masterbook** serves as the permanent foundation for all upcoming development sprints:
* **No UI component** may violate the layout, field definitions, or operational sequence defined herein.
* **No backend service or API** may execute state transitions outside the finite state machine models.
* **No database schema** may omit the foreign key relationships required for end-to-end 5W1H backward lot traceability.
* **Every future module** (Warehouse, Kitchen, Production, Delivery, Finance, HR) must implement the contract interfaces and permission matrices documented above.

*PT. Zahdan Kamal Sentosa Enterprise ERP — Built for industrial precision, culinary excellence, and bulletproof operational governance.*
