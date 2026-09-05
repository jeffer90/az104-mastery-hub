import type { DomainSection } from '../types';

export const domain5: DomainSection = {
  id: 'domain-5',
  number: 5,
  title: 'Monitor and Maintain Azure Resources',
  weight: '10–15%',
  weightRange: [10, 15],
  color: 'from-rose-600 to-pink-500',
  badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  accentBorder: 'border-rose-500/40',
  iconName: 'Activity',
  description: 'Master observability with Azure Monitor metrics, Log Analytics workspaces, and KQL, troubleshoot network paths with Network Watcher, and safeguard workloads with Recovery Services Vaults and Azure Site Recovery (ASR).',
  topics: [
    {
      id: 'd5-azure-monitor-kql-alerts',
      title: 'Azure Monitor: Metrics, Log Analytics, KQL & Alert Rules',
      domainId: 'domain-5',
      weightLabel: 'High Yield',
      summary: 'Observability telemetry, Kusto Query Language (KQL) queries, metric/log alerts, Action Groups, and alert processing rules for scheduled maintenance suppression.',
      coreConcepts: [
        {
          heading: 'Metrics vs Logs in Azure Monitor',
          content: 'Azure Monitor collects two fundamental types of telemetry data: Metrics and Logs.',
          keyPoints: [
            'Metrics: Numerical time-series values collected at regular intervals (lightweight, near real-time, capable of triggering fast alerts). Retained for 93 days.',
            'Logs: Structured or unstructured textual data stored in Log Analytics tables. Supports complex analytics and historical querying via Kusto Query Language (KQL). Retained from 30 up to 730 days.'
          ]
        },
        {
          heading: 'Kusto Query Language (KQL) High-Yield Operators',
          content: 'KQL is used to query Log Analytics workspaces. Microsoft tests your ability to recognize and assemble query pipelines using the pipe (|) operator.',
          keyPoints: [
            'where: Filters records based on a predicate (e.g. | where TimeGenerated > ago(24h) and Level == "Error").',
            'project: Selects specific columns to display (e.g. | project TimeGenerated, Computer, EventID).',
            'summarize: Produces an aggregated table (e.g. | summarize count() by bin(TimeGenerated, 1h), Computer).',
            'sort by / order by: Orders results (e.g. | sort by TimeGenerated desc).',
            'render: Generates chart visuals (e.g. | render timechart or | render barchart).'
          ]
        },
        {
          heading: 'Alerts, Action Groups & Alert Processing Rules',
          content: 'How alerts notify engineers or trigger automated remediation.',
          keyPoints: [
            'Action Groups: Reusable collections of notification channels (Email, SMS, Push, Voice) and automated actions (Azure Functions, Logic Apps, Automation Runbooks, Webhooks).',
            'Alert Processing Rules: Modify fired alerts or SUPPRESS notifications during planned maintenance windows (e.g., mute alerts every Sunday 02:00 to 04:00 without disabling the underlying alert rules).'
          ]
        },
        {
          heading: 'Azure Monitor Agent (AMA) & Data Collection Rules (DCR)',
          content: 'The modern monitoring pipeline replacing the legacy Log Analytics (MMA) agent.',
          keyPoints: [
            'Azure Monitor Agent (AMA): Deployed on Azure VMs and hybrid ARC servers using managed identities for secure telemetry ingestion.',
            'Data Collection Rules (DCR): Define what data to collect (Performance Counters, Windows Event Logs, Syslog) and where to send it (Log Analytics workspace or Azure Monitor Metrics).',
            'Multi-Homing: A single VM with AMA can send different telemetry streams to multiple Log Analytics workspaces or subscriptions via separate DCR associations.'
          ]
        }
      ],
      portalWalkthrough: {
        overview: 'Writing a KQL query in Log Analytics and configuring an Alert Processing Rule to suppress notifications during maintenance.',
        steps: [
          {
            stepNumber: 1,
            title: 'Run KQL Query in Log Analytics',
            portalPath: 'Azure Portal > Log Analytics workspaces > Select workspace > Logs',
            description: 'Query failed sign-ins or VM heartbeats.',
            keyFields: [
              { name: 'Query Editor', value: 'Heartbeat | where TimeGenerated > ago(1h) | summarize count() by Computer' }
            ]
          },
          {
            stepNumber: 2,
            title: 'Create Alert Processing Rule',
            portalPath: 'Monitor > Alerts > Alert processing rules > + Create',
            description: 'Define scheduled suppression for maintenance.',
            keyFields: [
              { name: 'Rule action', value: 'Suppress notifications' },
              { name: 'Schedule', value: 'Recurring weekly (Sundays 01:00 to 04:00)' }
            ]
          }
        ],
        interactiveBlade: {
          resourceName: 'Create Alert Processing Rule Blade',
          serviceCategory: 'Azure Monitor',
          icon: 'BellRing',
          tabs: [
            {
              id: 'rule-settings',
              label: 'Rule Settings',
              fields: [
                {
                  id: 'rule-action-type',
                  label: 'Rule action',
                  type: 'radio',
                  currentValue: 'Suppress notifications',
                  options: [
                    { label: 'Apply action group', value: 'Apply action group' },
                    { label: 'Suppress notifications', value: 'Suppress notifications', description: 'Prevents emails/SMS during maintenance' }
                  ]
                }
              ]
            }
          ]
        }
      },
      examTraps: [
        {
          trapTitle: 'Disabling Alert Rules vs Using Alert Processing Rules',
          scenario: 'During weekend server patching, an operations team wants to stop receiving hundreds of false alert emails. An admin suggests disabling all 50 alert rules manually and re-enabling them on Monday.',
          whyItTricksPeople: 'Disabling works, but is error-prone and risks leaving rules disabled.',
          correctAnswerRule: 'The Microsoft-recommended method is creating an Alert Processing Rule with "Suppress notifications" set on a schedule. Alerts are still recorded, but emails/notifications are suppressed.'
        }
      ],
      keyNumbers: [
        { label: 'Metric Data Retention', value: '93 days', context: 'Built-in metric storage period' },
        { label: 'Log Analytics Retention', value: '30 to 730 days', context: 'Configurable interactive retention' },
        { label: 'Alert Severity Levels', value: 'Sev 0 to Sev 4', context: 'Sev 0 = Critical, Sev 4 = Verbose' }
      ],
      cliSnippets: [
        {
          title: 'Query Log Analytics via Azure CLI',
          cli: 'az monitor log-analytics query --workspace "ws-prod" --analytics-query "Heartbeat | take 10"',
          explanation: 'Executes a KQL query against a Log Analytics workspace.'
        }
      ],
      quiz: [
        {
          id: 'q5-1',
          scenario: 'You need to write a KQL query that lists the top 5 computers generating the highest number of error events in the last 24 hours. Which sequence of KQL operators should you use?',
          options: [
            'Event | where TimeGenerated > ago(24h) | where EventLevelName == "Error" | summarize count() by Computer | top 5 by count_',
            'Event | project Computer | summarize sum() | filter 5',
            'Event | render timechart | where Computer == 5',
            'Event | take 5 | where EventLevelName == "Error"'
          ],
          correctAnswer: 0,
          explanation: 'KQL pipelines filter first (| where), aggregate (| summarize count() by Computer), and then sort/limit (| top 5 by count_).',
          trapAlert: 'KQL operates sequentially; filtering after an aggregation is inefficient or invalid if the columns were dropped.'
        }
      ]
    },
    {
      id: 'd5-network-watcher-diagnostics',
      title: 'Azure Network Watcher: IP Flow Verify, Next Hop & Connection Monitor',
      domainId: 'domain-5',
      weightLabel: 'Core Domain',
      summary: 'Diagnosing network reachability, verifying NSG rules with IP Flow Verify, diagnosing routing with Next Hop, and continuous testing with Connection Monitor.',
      coreConcepts: [
        {
          heading: 'Network Watcher Diagnostics Suite',
          content: 'Azure Network Watcher provides regional tools to monitor, diagnose, view metrics, and enable or disable logs for resources in an Azure virtual network.',
          keyPoints: [
            'IP Flow Verify: Tests whether a specific packet (Source IP, Port, Destination IP, Port, Protocol) is Allowed or Denied by an NSG rule, and identifies the exact rule name that matched.',
            'Next Hop: Determines the route and next hop type (Virtual appliance, Internet, VNet, None) for traffic destined to a given IP, identifying routing table misconfigurations.',
            'Connection Monitor: Proactively monitors and tests end-to-end network connectivity between source VMs and destination targets (VMs, FQDNs, URLs), measuring latency and packet loss.',
            'Packet Capture: Initiates a real-time network packet capture on a VM NIC and saves the .cap/.pcap file to an Azure Storage account or local disk.'
          ]
        }
      ],
      portalWalkthrough: {
        overview: 'Using IP Flow Verify to determine why a web browser cannot connect to an Azure VM.',
        steps: [
          {
            stepNumber: 1,
            title: 'Run IP Flow Verify',
            portalPath: 'Azure Portal > Network Watcher > Network diagnostic tools > IP flow verify',
            description: 'Specify the target VM, protocol, and ports.',
            keyFields: [
              { name: 'Target virtual machine', value: 'vm-web-prod' },
              { name: 'Protocol', value: 'TCP' },
              { name: 'Direction', value: 'Inbound' },
              { name: 'Local IP & Port', value: '10.0.1.4 : 80' },
              { name: 'Remote IP & Port', value: '198.51.100.25 : 54321' }
            ]
          }
        ],
        interactiveBlade: {
          resourceName: 'IP Flow Verify Tool Blade',
          serviceCategory: 'Network Watcher',
          icon: 'Radar',
          tabs: [
            {
              id: 'diagnostic-input',
              label: 'Test Inputs',
              fields: [
                {
                  id: 'test-direction',
                  label: 'Direction',
                  type: 'radio',
                  currentValue: 'Inbound',
                  options: [
                    { label: 'Inbound', value: 'Inbound' },
                    { label: 'Outbound', value: 'Outbound' }
                  ]
                }
              ]
            }
          ]
        }
      },
      examTraps: [
        {
          trapTitle: 'Network Watcher Must Be Enabled in the Target Region',
          scenario: 'An admin attempts to run Packet Capture on a VM in East US, but Network Watcher reports an error that no instance exists.',
          whyItTricksPeople: 'Network Watcher is a regional service; an instance of Network Watcher must exist in the region where the VM resides.',
          correctAnswerRule: 'Ensure Network Watcher is explicitly enabled for the region of the target virtual network / virtual machine.'
        }
      ],
      keyNumbers: [
        { label: 'Network Watcher Regional Instance', value: '1 per region', context: 'Automatically created in NetworkWatcherRG' }
      ],
      cliSnippets: [
        {
          title: 'Run IP Flow Verify via CLI',
          cli: 'az network watcher test-ip-flow --resource-group "rg-net" --vm "vm-web-01" --direction Inbound --protocol TCP --local 10.0.1.4:80 --remote 198.51.100.20:12345',
          explanation: 'Checks whether inbound traffic to port 80 is permitted by NSG rules.'
        }
      ],
      quiz: [
        {
          id: 'q5-2',
          scenario: 'A virtual machine cannot reach an external API server at 203.0.113.10. You suspect a custom Route Table is misdirecting the traffic to a disabled firewall. Which Network Watcher tool will instantly confirm which route and next hop Azure is using for traffic to 203.0.113.10?',
          options: [
            'IP Flow Verify',
            'Next Hop',
            'Connection Monitor',
            'NSG Flow Logs'
          ],
          correctAnswer: 1,
          explanation: '"Next Hop" looks up the effective routing table for a given VM and returns the next hop type and IP address (e.g., Virtual Appliance vs Internet).',
          trapAlert: 'IP Flow Verify checks NSG firewall rules, whereas Next Hop checks Route Tables.'
        }
      ]
    },
    {
      id: 'd5-backup-recovery-asr',
      title: 'Azure Backup, Recovery Services Vault & Site Recovery (ASR)',
      domainId: 'domain-5',
      weightLabel: 'High Yield',
      summary: 'Recovery Services Vault vs Backup Vault, VM backup policies, Item-Level Recovery (ILR), Cross-Region Restore (CRR), Azure Site Recovery (ASR) test failovers, and soft delete protection.',
      coreConcepts: [
        {
          heading: 'Recovery Services Vault vs Azure Backup Vault',
          content: 'A frequent point of confusion on the exam: Azure has two distinct vault types for different workloads.',
          diagramType: 'backup-vault',
          keyPoints: [
            'Recovery Services Vault: Backs up Azure Virtual Machines, SQL Server inside Azure VMs, SAP HANA inside Azure VMs, and Azure Files.',
            'Azure Backup Vault: Backs up Azure Blob Storage (operational backup), Azure Managed Disks, Azure Database for PostgreSQL, and AKS clusters.',
            'CRITICAL EXAM RULE: You CANNOT back up an Azure VM to an Azure Backup Vault! You MUST use a Recovery Services Vault.'
          ]
        },
        {
          heading: 'Restore Options: VM Restore vs Item-Level Recovery (ILR)',
          content: 'Restoring data from a Recovery Services Vault backup point.',
          keyPoints: [
            'Create new VM: Provisions a brand new VM from the backup disks and configuration.',
            'Restore disks: Restores the VHD disks to a storage account so you can manually attach them.',
            'Item-Level Recovery (ILR): Generates and downloads an executable script (.exe for Windows, .sh for Linux) that mounts the recovery point as a local virtual iSCSI drive directly onto the VM, allowing you to browse and copy individual files and folders.'
          ]
        },
        {
          heading: 'Azure Site Recovery (ASR) Failover Types',
          content: 'Disaster Recovery (BCDR) replicating Azure VMs from a primary region to a secondary paired region.',
          keyPoints: [
            'Test Failover: NON-DISRUPTIVE! Spins up a replica VM in an isolated test virtual network. Does NOT impact ongoing replication or production.',
            'Planned Failover: Used for anticipated events (zero data loss). Shuts down primary VM, replicates final changes, starts secondary VM.',
            'Unplanned Failover: Emergency failover when primary region is down (potential data loss based on RPO).',
            'Reprotect: Reverses replication direction so changes replicate back from the secondary to the primary region.'
          ]
        },
        {
          heading: 'Soft Delete & Multi-User Authorization (MUA)',
          content: 'Security features protecting against ransomware or rogue administrators.',
          keyPoints: [
            'Soft Delete for Backups: Retains deleted backup data for 14 additional days at no additional cost before permanent deletion.',
            'Multi-User Authorization (MUA) with Azure Resource Guard: Requires approval from a secondary administrator before anyone can delete a vault or disable soft delete.'
          ]
        }
      ],
      portalWalkthrough: {
        overview: 'Creating a Recovery Services Vault and initiating an ASR Test Failover in an isolated virtual network.',
        steps: [
          {
            stepNumber: 1,
            title: 'Create Recovery Services Vault',
            portalPath: 'Azure Portal > Recovery Services vaults > + Create',
            description: 'Deploy vault in target region with Cross-Region Restore.',
            keyFields: [
              { name: 'Vault name', value: 'rsv-prod-eastus' },
              { name: 'Storage redundancy', value: 'Geo-Redundant (GRS)' },
              { name: 'Cross Region Restore', value: 'Enabled' }
            ]
          },
          {
            stepNumber: 2,
            title: 'Perform ASR Test Failover',
            portalPath: 'Recovery Services vault > Replicated items > Select VM > Test Failover',
            description: 'Run non-disruptive disaster recovery drill.',
            keyFields: [
              { name: 'Recovery point', value: 'Latest processed' },
              { name: 'Azure virtual network', value: 'vnet-dr-test-isolated', hint: 'Must use an isolated test VNet, never production!' }
            ]
          }
        ],
        interactiveBlade: {
          resourceName: 'ASR Test Failover Blade',
          serviceCategory: 'Disaster Recovery',
          icon: 'LifeBuoy',
          tabs: [
            {
              id: 'test-failover-settings',
              label: 'Test Failover Settings',
              fields: [
                {
                  id: 'test-vnet',
                  label: 'Azure virtual network',
                  type: 'select',
                  currentValue: 'vnet-dr-test-isolated',
                  options: [
                    { label: 'vnet-dr-test-isolated (Recommended)', value: 'vnet-dr-test-isolated', description: 'Isolated sandbox network' },
                    { label: 'vnet-production-secondary', value: 'prod-sec', description: 'WARNING: Can cause IP conflicts!', isExamTrap: true }
                  ],
                  examNote: 'Exam trap: ASR Test Failover should always use an isolated non-production VNet.'
                }
              ]
            }
          ]
        }
      },
      examTraps: [
        {
          trapTitle: 'Recovery Services Vault vs Backup Vault Workloads',
          scenario: 'A question asks which vault type is required to protect an Azure Virtual Machine.',
          whyItTricksPeople: 'It has "Backup" in the name, so people instinctively choose "Azure Backup Vault".',
          correctAnswerRule: 'Azure Virtual Machines CANNOT be backed up to a Backup Vault. They MUST use a Recovery Services Vault.'
        },
        {
          trapTitle: 'Test Failover Does NOT Interrupt Replication',
          scenario: 'Management wants to conduct a disaster recovery test during business hours without interrupting production or stopping replication.',
          whyItTricksPeople: 'People fear that a failover stops the live system.',
          correctAnswerRule: 'An ASR "Test Failover" is completely non-disruptive. It boots a copy of the VM inside an isolated VNet while the production VM and continuous replication continue running.'
        }
      ],
      keyNumbers: [
        { label: 'Backup Soft Delete Retention', value: '14 days', context: 'Retained free of charge' },
        { label: 'Instant Restore Retention', value: '1 to 5 days', context: 'Local disk snapshot for instant recovery' }
      ],
      cliSnippets: [
        {
          title: 'Trigger Azure VM Backup via Azure CLI',
          cli: 'az backup protection backup-now --resource-group "rg-vault" --vault-name "rsv-prod-eastus" --container-name "iaasvmcontainer;iaasvmcontainerv2;rg-compute;vm-web-01" --item-name "vm-web-01" --retain-until 2026-10-01',
          powershell: 'Backup-AzRecoveryServicesBackupItem -Item $backupItem',
          explanation: 'Initiates an immediate on-demand backup of an Azure VM.'
        }
      ],
      quiz: [
        {
          id: 'q5-3',
          scenario: 'A user accidentally deleted a critical financial spreadsheet from drive C: of an Azure Windows VM yesterday. You have a nightly backup taken by a Recovery Services Vault. You need to recover this single spreadsheet as quickly as possible without modifying any other files or replacing the running VM. What should you do?',
          options: [
            'Restore the VM and assign it a new public IP',
            'Restore the OS disk to a storage account and swap the OS disk',
            'Perform Item-Level Recovery (ILR) by mounting the recovery point volume and copying the file',
            'Initiate an ASR Planned Failover to the secondary region'
          ],
          correctAnswer: 2,
          explanation: 'Item-Level Recovery (ILR) mounts the backup point as a local drive letter using an iSCSI script, allowing the admin to copy the individual spreadsheet file directly with zero downtime.',
          trapAlert: 'Restoring the entire VM or OS disk would overwrite or replace existing newer work.'
        }
      ]
    }
  ]
};
