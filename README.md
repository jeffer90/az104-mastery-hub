# AZ-104 Mastery Hub

> **Interactive, Visual Study Platform & Azure Portal Blade Simulator for the Microsoft Certified: Azure Administrator Associate (AZ-104) Certification.**

![AZ-104 Mastery Hub](https://img.shields.io/badge/Certification-AZ--104-blue?style=for-the-badge&logo=microsoft-azure)
![React](https://img.shields.io/badge/React-19-cyan?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-8-purple?style=for-the-badge&logo=vite)

---

## Overview

**AZ-104 Mastery Hub** is an all-in-one interactive study system built to help engineers pass the **Microsoft Certified: Azure Administrator Associate (AZ-104)** exam on their first attempt. Rather than reading dry documentation, this platform provides:

1. **Interactive Azure Portal Blade Simulators**: Practice real portal workflows (*Basics, Networking, Management, Monitoring, Review + Create*) with inline **AZ-104 Exam Insight** alerts without needing an active Azure subscription or burning credits.
2. **Architecture Mental Models**: Interactive visual diagrams for Hub-and-Spoke non-transitive peering, RBAC scope inheritance, Storage lifecycle tiering, NSG evaluation order, App Service slot swapping, and the **4-Way Load Balancing Decision Matrix** (Azure Front Door vs Traffic Manager vs Application Gateway vs Load Balancer).
3. **High-Yield Exam Traps & Gotchas**: Detailed breakdowns of why candidates get tricked by Microsoft's scenario questions and the exact rules needed to answer correctly.
4. **Scenario Practice Exam Engine**: Full scenario-based question bank with immediate feedback and trap alerts.
5. **Readiness Tracker & Touch Checklist**: S-Pen and finger-friendly study checklist with `localStorage` persistence, optimized for tablets (like the Samsung Galaxy Tab S9 FE) and desktop tiling window managers (like Hyprland on Omarchy).

---

## Exam Curriculum Breakdown

| Domain | Weight | Core Focus Areas |
| :--- | :---: | :--- |
| **Domain 1: Manage Azure Identities and Governance** | **20–25%** | Microsoft Entra ID (Users, Groups, Dynamic Membership, Administrative Units, SSPR), RBAC custom roles & scopes, Azure Policy, Management Groups, and Cost Management Budgets. |
| **Domain 2: Implement and Manage Storage** | **15–20%** | Storage accounts, LRS/ZRS/GRS/GZRS redundancy, account failover, SAS tokens & stored access policies, Blob access tiers & lifecycle rules, Azure Files & File Sync. |
| **Domain 3: Deploy and Manage Azure Compute Resources** | **20–25%** | ARM templates & Bicep, VM sizing & Availability Sets/Zones, VMSS autoscale rules, ACI, Azure Container Apps (ACA), and App Service deployment slots (sticky vs swappable settings). |
| **Domain 4: Implement and Manage Virtual Networking** | **15–20%** | VNets, subnets (the 5 reserved IPs), non-transitive peering, Route Tables / UDRs, NAT Gateway (outbound SNAT), NSGs & ASGs, Azure Bastion, Private Endpoints, Azure DNS, and the 4 Load Balancers (Front Door, Traffic Manager, App Gateway, Azure Load Balancer). |
| **Domain 5: Monitor and Maintain Azure Resources** | **10–15%** | Azure Monitor metrics & Log Analytics (KQL queries), Azure Monitor Agent (AMA) & Data Collection Rules (DCR), Action Groups & alert processing rules, Network Watcher, Recovery Services Vault vs Backup Vault, and Azure Site Recovery (ASR). |

---

## Getting Started

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- npm, pnpm, or yarn

### Installation & Local Development

```bash
# Clone the repository
git clone https://github.com/<your-username>/az104-mastery-hub.git
cd az104-mastery-hub

# Install dependencies
npm install

# Start development server (accessible over local network)
npm run dev
```

Open your browser at `http://localhost:5173`.

### Tablet & Remote Access (e.g. Samsung Galaxy Tab S9 FE)
The dev server binds to `0.0.0.0`. On your tablet, connect to the same Wi-Fi network (or via Tailscale) and open:
```
http://<your-workstation-ip>:5173
```

### Production Build

```bash
npm run build
npm run preview
```

---

## Free 1-Click Deployment Options

Because this is a static single-page application (SPA), you can host it for free with zero maintenance:

* **Azure Static Web Apps (Free Tier)**: Connect your GitHub repository to an Azure Static Web App resource (App location: `/`, Output location: `dist`).
* **Cloudflare Pages**: Run `npx wrangler pages deploy dist --project-name az104-mastery-hub` or connect via Git.
* **Vercel**: Run `npx vercel` in the project root.
* **Netlify Drop**: Drag and drop the compiled `dist/` folder into [app.netlify.com/drop](https://app.netlify.com/drop).

---

## License
MIT License. Created for cloud engineers and administrators mastering Azure infrastructure.
