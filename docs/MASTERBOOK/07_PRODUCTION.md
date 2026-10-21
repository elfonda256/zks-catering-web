# CHAPTER 07 — PRODUCTION & CENTRAL KITCHEN SPECIFICATION

## Domain Overview
The Production & Central Kitchen module bridges customer demand with raw material consumption. It coordinates batch cooking, cook-chill storage, and food hygiene quality controls.

## Core Sub-features

1. **Bill of Materials (BOM) & Recipe Scaling**:
   - Master recipes linked to specific catering menu tiers.
   - Automatic grammage calculation based on pax order numbers (e.g., 2,500 pax factory lunch).
2. **Batch Scheduling & Kitchen Work Orders**:
   - Station division: Butcher Station, Marination, Wok/Stir-fry, Steaming, Baking, Cold Assembly.
   - Start/completion time logging and temperature inspection checkpoints.
3. **HACCP & Critical Control Points (CCP)**:
   - Digital log sheets for oil degradation, core temperature probing (>75°C for poultry), blast chiller cooling curves.

## Domain Boundary & Contracts
- **Exports**:
  - `ProductionService.getActiveWorkOrders()`
  - `ProductionService.getMaterialRequirements(date)`
- **Dependencies**:
  - Draws raw materials from Inventory via standard material issue requisitions.
  - Passes finished meal trays to Distribution Dispatch.
