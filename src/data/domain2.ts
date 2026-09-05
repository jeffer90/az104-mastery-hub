import type { DomainSection } from '../types';

export const domain2: DomainSection = {
  id: 'domain-2',
  number: 2,
  title: 'Implement and Manage Storage',
  weight: '15–20%',
  weightRange: [15, 20],
  color: 'from-amber-600 to-yellow-500',
  badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  accentBorder: 'border-amber-500/40',
  iconName: 'Database',
  description: 'Design and manage scalable Azure Storage accounts, configure geo-redundancy and account failovers, secure data with SAS and firewalls, optimize tiers with lifecycle policies, and deploy Azure File Sync.',
  topics: [
    {
      id: 'd2-storage-redundancy-failover',
      title: 'Storage Account Types, Redundancy (LRS/ZRS/GRS) & Failover',
      domainId: 'domain-2',
      weightLabel: 'High Yield',
      summary: 'Storage account kinds, comparing 11 to 16 nines of durability across LRS, ZRS, GRS, GZRS, secondary read access (RA-GRS), and customer-initiated failovers.',
      coreConcepts: [
        {
          heading: 'Redundancy Models Breakdown',
          content: 'Azure Storage always stores multiple copies of your data to protect against hardware failures, power outages, and natural disasters.',
          diagramType: 'storage-tiers',
          keyPoints: [
            'LRS (Locally Redundant Storage): 3 synchronous copies within a single datacenter. 11 nines (99.999999999%) durability. Vulnerable to datacenter-level fire/flood.',
            'ZRS (Zone-Redundant Storage): 3 synchronous copies across 3 separate Availability Zones in the primary region. 12 nines durability. Survives an entire datacenter outage.',
            'GRS (Geo-Redundant Storage): LRS in primary region + replicated asynchronously to an LRS secondary region hundreds of miles away. 16 nines durability.',
            'GZRS (Geo-Zone-Redundant Storage): ZRS across 3 zones in primary region + LRS in secondary region. Maximum resilience against both datacenter and regional disasters.',
            'RA-GRS / RA-GZRS: Provides read-only access to the secondary endpoint (accountname-secondary.blob.core.windows.net) even while the primary region is online.'
          ]
        },
        {
          heading: 'Customer-Initiated Account Failover',
          content: 'If the primary region suffers a major, prolonged outage, customers can manually initiate an account failover via the Portal, CLI, or PowerShell.',
          keyPoints: [
            'Failover mechanic: Updates DNS records so that the secondary region becomes the new primary endpoint.',
            'CRITICAL EXAM TRAP: After failover, the storage account type is automatically downgraded to Locally Redundant Storage (LRS) in the new primary region! Geo-replication is lost until you manually re-enable GRS.'
          ]
        },
        {
          heading: 'Storage Account Encryption',
          content: 'All data is encrypted at rest by default using Microsoft-managed keys (MMK). For compliance, customers can use Customer-managed keys (CMK) stored in Azure Key Vault.',
          keyPoints: [
            'Key rotation: CMK supports automated or manual key rotation.',
            'Infrastructure encryption: Enables double-encryption (two independent layers: one at the service layer, one at the hardware infrastructure layer).'
          ]
        }
      ],
      portalWalkthrough: {
        overview: 'Creating a standard General-purpose v2 storage account with Geo-Zone-Redundant Storage (GZRS) and inspecting secondary endpoints.',
        steps: [
          {
            stepNumber: 1,
            title: 'Configure Basics',
            portalPath: 'Azure Portal > Storage accounts > + Create',
            description: 'Provide globally unique name, region, and primary performance tier.',
            keyFields: [
              { name: 'Storage account name', value: 'storprodcorp01 (3-24 lowercase alphanum)' },
              { name: 'Primary service', value: 'Azure Blob Storage or Azure Data Lake' },
              { name: 'Performance', value: 'Standard (general-purpose v2)' },
              { name: 'Redundancy', value: 'Geo-zone-redundant storage (GZRS)' }
            ]
          },
          {
            stepNumber: 2,
            title: 'Verify Secondary Region Read Access',
            portalPath: 'Storage account > Redundancy blade',
            description: 'Check primary and secondary location statuses and test endpoint URLs.',
            keyFields: [
              { name: 'Make read access to data available in the event of regional unavailability', value: 'Checked (RA-GZRS)' }
            ]
          }
        ],
        interactiveBlade: {
          resourceName: 'Create Storage Account',
          serviceCategory: 'Storage',
          icon: 'HardDrive',
          tabs: [
            {
              id: 'basics',
              label: 'Basics',
              fields: [
                {
                  id: 'account-perf',
                  label: 'Performance',
                  type: 'radio',
                  currentValue: 'Standard',
                  options: [
                    { label: 'Standard (general-purpose v2)', value: 'Standard', description: 'Recommended for most scenarios (Blob, File, Queue, Table)' },
                    { label: 'Premium', value: 'Premium', description: 'Low latency, SSD-backed (Block blobs, File shares, Page blobs)' }
                  ]
                },
                {
                  id: 'account-redundancy',
                  label: 'Redundancy',
                  type: 'select',
                  currentValue: 'GRS',
                  options: [
                    { label: 'Locally-redundant storage (LRS)', value: 'LRS', description: 'Lowest cost, single DC' },
                    { label: 'Zone-redundant storage (ZRS)', value: 'ZRS', description: 'Survives zone outage' },
                    { label: 'Geo-redundant storage (GRS)', value: 'GRS', description: 'Cross-region replication' },
                    { label: 'Geo-zone-redundant storage (GZRS)', value: 'GZRS', description: 'High availability + disaster recovery' }
                  ],
                  examNote: 'Exam tip: GRS and GZRS replicate asynchronously to paired regions.'
                }
              ]
            }
          ]
        }
      },
      examTraps: [
        {
          trapTitle: 'Account Failover Downgrades Redundancy to LRS',
          scenario: 'A company performs an unplanned customer-initiated failover of an RA-GRS storage account to its secondary region. The exam asks: What is the redundancy of the storage account immediately after the failover completes?',
          whyItTricksPeople: 'Candidates expect the account to remain GRS or reverse replicate automatically.',
          correctAnswerRule: 'After failover, the account is converted to Locally Redundant Storage (LRS) in the new region. You must manually reconfigure it to GRS to restore geo-protection.'
        }
      ],
      keyNumbers: [
        { label: 'LRS Durability', value: '11 nines (99.999999999%)', context: '3 copies in single datacenter' },
        { label: 'ZRS Durability', value: '12 nines (99.9999999999%)', context: '3 copies across 3 AZs' },
        { label: 'GRS/GZRS Durability', value: '16 nines (99.99999999999999%)', context: 'Primary region + Secondary paired region' }
      ],
      cliSnippets: [
        {
          title: 'Trigger Account Failover via Azure CLI',
          cli: 'az storage account failover --name "storprodcorp01" --resource-group "rg-storage" --yes',
          powershell: 'Invoke-AzStorageAccountFailover -ResourceGroupName "rg-storage" -Name "storprodcorp01" -Force',
          explanation: 'Initiates a manual failover to the paired secondary region.'
        }
      ],
      quiz: [
        {
          id: 'q2-1',
          scenario: 'You have a storage account configured with GRS. You need to provide client applications with continuous read access to blob data even if the primary Azure region suffers an unexpected outage, without waiting for a manual failover. What should you configure?',
          options: [
            'Change redundancy to ZRS',
            'Enable Read-Access Geo-Redundant Storage (RA-GRS)',
            'Deploy Azure File Sync with Cloud Tiering',
            'Configure Azure Storage Explorer with secondary credentials'
          ],
          correctAnswer: 1,
          explanation: 'RA-GRS gives clients read-only access to the secondary endpoint (accountname-secondary.blob.core.windows.net) at all times, including during primary region downtime, without needing a failover.',
          trapAlert: 'Standard GRS replicates data, but the secondary region is not accessible for reading until a failover is executed unless RA-GRS is chosen.'
        }
      ]
    },
    {
      id: 'd2-storage-security-sas',
      title: 'Storage Security: SAS Tokens, Stored Access Policies & Firewalls',
      domainId: 'domain-2',
      weightLabel: 'High Yield',
      summary: 'Securing Azure Storage using Account SAS, Service SAS, User Delegation SAS, Stored Access Policies, and Network Firewalls.',
      coreConcepts: [
        {
          heading: 'SAS Token Types: Account vs Service vs User Delegation',
          content: 'Shared Access Signatures grant limited access to storage resources without revealing your account access keys.',
          keyPoints: [
            'User Delegation SAS (Most Secure): Secured with Microsoft Entra ID credentials rather than storage account keys. Recommended by Microsoft for maximum security.',
            'Service SAS: Scoped to a specific resource (blob container, file share, directory). Can be associated with a Stored Access Policy.',
            'Account SAS: Delegated access to resources in one or more storage services (Blob, Queue, Table, File). Cannot use Stored Access Policies.',
            'Key Parameters in SAS URI: "sv" (storage version), "se" (signed expiry), "sp" (signed permissions: r,w,d,l), "spr" (protocol: httpsonly).'
          ]
        },
        {
          heading: 'Stored Access Policies & SAS Revocation',
          content: 'How do you revoke a SAS token before its expiry date without regenerating your primary/secondary account keys (which would break all other connected apps)?',
          keyPoints: [
            'Stored Access Policy: Defined on a container or share. The Service SAS references this policy ID.',
            'Revocation method: To revoke the SAS immediately, simply delete or edit the Stored Access Policy (change the expiry date or remove permissions) on the container. No account keys need to be regenerated!'
          ]
        },
        {
          heading: 'Storage Firewalls & Virtual Networks',
          content: 'Restricting public network access to storage accounts.',
          keyPoints: [
            'Default setting: "Enabled from all networks".',
            'Restricted setting: "Enabled from selected virtual networks and IP addresses".',
            'Allowed IP formats: Only public IP addresses or CIDR ranges. You CANNOT add RFC 1918 private IP addresses (like 10.0.0.5 or 192.168.1.0/24) directly into the firewall rules; private subnets must connect via Service Endpoints or Private Endpoints!'
          ]
        }
      ],
      portalWalkthrough: {
        overview: 'Creating a Stored Access Policy on a blob container and generating a revocable Service SAS.',
        steps: [
          {
            stepNumber: 1,
            title: 'Create Stored Access Policy',
            portalPath: 'Storage account > Containers > Select container > Settings > Access policy',
            description: 'Define an access policy with an identifier and permission bounds.',
            keyFields: [
              { name: 'Identifier', value: 'Policy-Contractors-2026' },
              { name: 'Permissions', value: 'Read, List' },
              { name: 'Start & Expiry time', value: 'Valid for 14 days' }
            ]
          },
          {
            stepNumber: 2,
            title: 'Generate SAS using the Policy',
            portalPath: 'Container > Shared access tokens',
            description: 'Link the SAS to the stored policy identifier.',
            keyFields: [
              { name: 'Stored access policy', value: 'Policy-Contractors-2026' },
              { name: 'Allowed protocols', value: 'HTTPS only' }
            ]
          }
        ],
        interactiveBlade: {
          resourceName: 'Generate SAS Token Blade',
          serviceCategory: 'Storage Access',
          icon: 'Shield',
          tabs: [
            {
              id: 'token-config',
              label: 'Configuration',
              fields: [
                {
                  id: 'signing-method',
                  label: 'Signing method',
                  type: 'radio',
                  currentValue: 'Account key',
                  options: [
                    { label: 'User delegation key (Microsoft Entra ID)', value: 'Entra', description: 'Recommended for security' },
                    { label: 'Account key', value: 'Account key', description: 'Signed with storage access key' }
                  ]
                },
                {
                  id: 'stored-policy',
                  label: 'Stored access policy',
                  type: 'select',
                  currentValue: 'Policy-Contractors-2026',
                  options: [
                    { label: 'None', value: 'None', description: 'Cannot be revoked without regenerating master keys' },
                    { label: 'Policy-Contractors-2026', value: 'Policy-Contractors-2026', description: 'Can be revoked instantly' }
                  ]
                }
              ]
            }
          ]
        }
      },
      examTraps: [
        {
          trapTitle: 'Revoking a SAS without Changing Account Keys',
          scenario: 'A contractor leaves the company early. They were given a SAS token that expires in 30 days. You must immediately invalidate their access without disrupting any other production systems using the storage account.',
          whyItTricksPeople: 'Candidates immediately jump to "Regenerate Account Key 1", which breaks every other application relying on that key.',
          correctAnswerRule: 'If the SAS was linked to a Stored Access Policy, simply delete or edit the Stored Access Policy on the container. This revokes the SAS immediately with zero impact on other apps.'
        },
        {
          trapTitle: 'Adding Private RFC 1918 IPs to Storage Firewall',
          scenario: 'An admin tries to allow a VM with private IP 10.1.2.4 through the Storage Account Firewall by adding 10.1.2.4 in the Firewall IP rules.',
          whyItTricksPeople: 'It feels like a standard firewall rule.',
          correctAnswerRule: 'Storage account IP rules only accept public Internet IP addresses. Private IPs must be permitted via Virtual Network subnets (Service Endpoints) or Private Endpoints.'
        }
      ],
      keyNumbers: [
        { label: 'Max Stored Access Policies per Container', value: '5', context: 'Limit on policies per container, share, table, or queue' },
        { label: 'Default SAS Protocol Requirement', value: 'HTTPS only', context: 'Ensures credentials cannot be intercepted over plain HTTP' }
      ],
      cliSnippets: [
        {
          title: 'Generate User Delegation SAS using Azure CLI',
          cli: 'az storage container generate-sas --account-name "storprodcorp01" --name "invoices" --permissions rl --expiry 2026-10-01T00:00:00Z --auth-mode login --as-user',
          powershell: 'New-AzStorageContainerSASToken -Name "invoices" -Context $ctx -Permission "rl" -ExpiryTime (Get-Date).AddDays(7)',
          explanation: 'Generates a SAS token secured by Microsoft Entra ID credentials rather than master keys.'
        }
      ],
      quiz: [
        {
          id: 'q2-2',
          scenario: 'You need to grant an external analytics service temporary read access to a specific blob container for 48 hours. If the vendor completes the job early, you must be able to revoke their access immediately without impacting other applications using the primary or secondary access keys. What should you do?',
          options: [
            'Create an Account SAS with read permissions and delete the secondary access key when done',
            'Create a Stored Access Policy on the container, generate a Service SAS linked to that policy, and delete the policy when done',
            'Add the vendor\'s IP to the storage firewall and remove it later',
            'Assign the vendor the Storage Account Contributor RBAC role'
          ],
          correctAnswer: 1,
          explanation: 'Creating a Stored Access Policy and linking the Service SAS to it allows immediate revocation simply by modifying or deleting the policy, without touching the account master keys.',
          trapAlert: 'Account SAS cannot be linked to stored access policies. Only Service SAS can.'
        }
      ]
    },
    {
      id: 'd2-blob-tiers-lifecycle',
      title: 'Blob Storage Tiers (Hot/Cool/Cold/Archive) & Lifecycle Rules',
      domainId: 'domain-2',
      weightLabel: 'High Yield',
      summary: 'Optimizing storage costs across Hot, Cool, Cold, and Archive tiers, rehydration priorities, automated lifecycle policies, soft delete, and blob versioning.',
      coreConcepts: [
        {
          heading: 'Blob Access Tiers Comparison',
          content: 'Azure Blob Storage offers four access tiers tailored to data usage patterns and retention lengths.',
          diagramType: 'storage-tiers',
          keyPoints: [
            'Hot tier: Highest storage cost, lowest access/read cost. Optimized for frequent read/write access.',
            'Cool tier: Lower storage cost, higher access cost. Minimum retention period: 30 days (early deletion incurs pro-rated fees).',
            'Cold tier: Lower storage cost than Cool, higher access cost. Minimum retention period: 90 days.',
            'Archive tier: Lowest storage cost, highest access/data retrieval cost. Stored offline; minimum retention period: 180 days.',
            'Archive Rehydration: Data in Archive tier cannot be read directly. You must rehydrate it back to Hot or Cool. Rehydration priority: Standard (up to 15 hours) or High (under 1 hour for blobs < 10 GB).'
          ]
        },
        {
          heading: 'Blob Lifecycle Management Rules',
          content: 'Lifecycle management automates moving blobs to cooler tiers or deleting them as they age, based on rules executed once per day.',
          keyPoints: [
            'Action triggers: daysAfterModificationGreaterThan, daysAfterCreationGreaterThan, or daysAfterLastAccessTimeGreaterThan.',
            'Supported transitions: Hot -> Cool, Hot -> Cold, Hot -> Archive, Cool -> Cold, Cool -> Archive, Cold -> Archive, or Delete.',
            'Archive transition constraint: Blobs cannot transition from Archive back to Cool or Hot via lifecycle rules; rehydration must be requested manually or via API.'
          ]
        },
        {
          heading: 'Data Protection: Soft Delete & Versioning',
          content: 'Guarding against accidental overwrites or malicious deletions.',
          keyPoints: [
            'Soft delete for blobs: Retains deleted blobs in a soft-deleted state for a configurable retention period (1 to 365 days).',
            'Soft delete for containers: Protects entire containers from deletion.',
            'Blob versioning: Automatically maintains previous versions of a blob whenever it is overwritten.'
          ]
        }
      ],
      portalWalkthrough: {
        overview: 'Configuring an automated Lifecycle Management rule to tier logs from Hot to Cool after 30 days and to Archive after 90 days.',
        steps: [
          {
            stepNumber: 1,
            title: 'Create Lifecycle Rule',
            portalPath: 'Storage account > Data management > Lifecycle management > + Add a rule',
            description: 'Define the scope and rule actions.',
            keyFields: [
              { name: 'Rule name', value: 'ArchiveHistoricalLogs' },
              { name: 'Rule scope', value: 'Limit blobs with filters (prefix: logs/)' },
              { name: 'Blob type', value: 'Block blobs' }
            ]
          },
          {
            stepNumber: 2,
            title: 'Define Action Set',
            portalPath: 'Add rule > Base blobs tab',
            description: 'Configure aging triggers and tiering destinations.',
            keyFields: [
              { name: 'Move to cool storage', value: '30 days after last modified' },
              { name: 'Move to archive storage', value: '90 days after last modified' },
              { name: 'Delete the blob', value: '365 days after last modified' }
            ]
          }
        ],
        interactiveBlade: {
          resourceName: 'Blob Lifecycle Rule Blade',
          serviceCategory: 'Blob Data Management',
          icon: 'Clock',
          tabs: [
            {
              id: 'actions',
              label: 'Action Set',
              fields: [
                {
                  id: 'move-cool-days',
                  label: 'Move to Cool storage (days after modification)',
                  type: 'text',
                  currentValue: '30',
                  helpText: 'Cool tier minimum retention is 30 days.'
                },
                {
                  id: 'move-archive-days',
                  label: 'Move to Archive storage (days after modification)',
                  type: 'text',
                  currentValue: '90',
                  helpText: 'Archive tier minimum retention is 180 days.'
                },
                {
                  id: 'delete-days',
                  label: 'Delete blob (days after modification)',
                  type: 'text',
                  currentValue: '365'
                }
              ]
            }
          ]
        }
      },
      examTraps: [
        {
          trapTitle: 'Archive Tier Blobs Cannot Be Read Online',
          scenario: 'An application queries an Archive tier blob directly using its HTTP URL, but the request fails with 409 Conflict.',
          whyItTricksPeople: 'Users assume Archive is just a slower cloud drive.',
          correctAnswerRule: 'Archive blobs are stored completely offline. You CANNOT read an archive blob until it has been rehydrated to the Hot or Cool tier, or copied to a new Hot/Cool blob using Put Block From URL.'
        },
        {
          trapTitle: 'Minimum Retention Penalty Days',
          scenario: 'A blob is placed in the Cool tier and deleted 5 days later. The company is charged an unexpected early deletion fee.',
          whyItTricksPeople: 'People forget about minimum billable retention windows.',
          correctAnswerRule: 'Cool has a 30-day minimum, Cold has 90-day minimum, and Archive has 180-day minimum billable retention.'
        }
      ],
      keyNumbers: [
        { label: 'Cool Minimum Retention', value: '30 days', context: 'Early deletion fee applies if deleted before 30d' },
        { label: 'Cold Minimum Retention', value: '90 days', context: 'Early deletion fee applies if deleted before 90d' },
        { label: 'Archive Minimum Retention', value: '180 days', context: 'Early deletion fee applies if deleted before 180d' },
        { label: 'Standard Rehydration Time', value: 'Up to 15 hours', context: 'Default rehydration speed' },
        { label: 'High Priority Rehydration', value: 'Under 1 hour', context: 'For blobs under 10 GB' }
      ],
      cliSnippets: [
        {
          title: 'Change Blob Tier via Azure CLI',
          cli: 'az storage blob set-tier --account-name "storprodcorp01" --container-name "backups" --name "backup-2026.bak" --tier Archive --rehydrate-priority High',
          powershell: '$blob = Get-AzStorageBlob -Container "backups" -Blob "backup-2026.bak" -Context $ctx; $blob.BlobClient.SetAccessTier("Archive")',
          explanation: 'Sets blob access tier to Archive with High rehydration priority.'
        }
      ],
      quiz: [
        {
          id: 'q2-3',
          scenario: 'Your company stores 50 TB of compliance audit records that must be retained for 7 years. The records are accessed at most once or twice during the entire 7-year period. You need to minimize storage costs while maintaining the ability to retrieve files within 12 hours when an audit occurs. Which blob tier should you use?',
          options: [
            'Hot tier',
            'Cool tier',
            'Cold tier',
            'Archive tier'
          ],
          correctAnswer: 3,
          explanation: 'The Archive tier offers by far the lowest cost per gigabyte of storage. Since standard rehydration takes up to 15 hours (and high priority takes under 1 hour), Archive meets the requirement with maximum cost savings.',
          trapAlert: 'Cold tier is still online and significantly more expensive per GB than Archive.'
        }
      ]
    },
    {
      id: 'd2-azure-files-sync',
      title: 'Azure Files & Azure File Sync: Shares, Cloud Tiering & Sync Groups',
      domainId: 'domain-2',
      weightLabel: 'Core Domain',
      summary: 'Deploying SMB/NFS Azure File Shares, large file shares (100 TiB), Storage Sync Services, Cloud Endpoints, Server Endpoints, and Cloud Tiering.',
      coreConcepts: [
        {
          heading: 'Azure Files: SMB vs NFS Shares',
          content: 'Azure Files provides fully managed serverless cloud file shares accessible via standard Server Message Block (SMB) or Network File System (NFS) protocols.',
          keyPoints: [
            'SMB shares: Standard or Premium file shares. Accessible from Windows, Linux, and macOS. Requires outbound TCP port 445 open on local ISPs.',
            'NFS shares: ONLY supported on Premium FileStorage accounts. Does not support encryption in transit over public internet (requires VNet / VPN / ExpressRoute).',
            'Large file shares: Support up to 100 TiB and 10,000 IOPS per share.'
          ]
        },
        {
          heading: 'Azure File Sync Architecture',
          content: 'Azure File Sync transforms an on-premises Windows Server into a high-speed local cache for Azure Files, centralizing file services.',
          keyPoints: [
            'Storage Sync Service: Top-level Azure resource that manages sync relationships.',
            'Sync Group: Defines the replication relationship between a Cloud Endpoint and one or more Server Endpoints.',
            'Cloud Endpoint: An Azure File Share (can only have ONE Cloud Endpoint per Sync Group).',
            'Server Endpoint: A folder path on a registered Windows Server (e.g. D:\\Data). Cannot be on the system volume (C:\\) if cloud tiering is enabled.'
          ]
        },
        {
          heading: 'Cloud Tiering Policies',
          content: 'Cloud Tiering caches frequently accessed files locally while tiering infrequently used files to Azure Files, saving local disk space.',
          keyPoints: [
            'Volume Free Space Policy: Specifies the minimum percentage of free space on the local volume (e.g., maintain 20% free space). Files are tiered until this target is met.',
            'Date Policy: Caches files that were accessed or modified within a specified number of days (e.g., cache files accessed within the last 14 days).'
          ]
        }
      ],
      portalWalkthrough: {
        overview: 'Creating an Azure File Share and setting up an Azure File Sync group with Cloud Tiering.',
        steps: [
          {
            stepNumber: 1,
            title: 'Create Azure File Share',
            portalPath: 'Storage account > File shares > + File share',
            description: 'Name the share and select tier and quota.',
            keyFields: [
              { name: 'Name', value: 'corp-share-data' },
              { name: 'Tier', value: 'Transaction optimized or Hot' },
              { name: 'Size limit (quota)', value: '5120 GiB (up to 100 TiB)' }
            ]
          },
          {
            stepNumber: 2,
            title: 'Configure Sync Group & Cloud Tiering',
            portalPath: 'Storage Sync Service > Sync groups > + Sync group',
            description: 'Bind Azure File Share as Cloud Endpoint and add on-premises Server Endpoint.',
            keyFields: [
              { name: 'Cloud Endpoint > Azure file share', value: 'corp-share-data' },
              { name: 'Server Endpoint > Local path', value: 'E:\\Shares\\CorpData' },
              { name: 'Cloud Tiering', value: 'Enabled' },
              { name: 'Volume free space policy', value: '25%' }
            ]
          }
        ],
        interactiveBlade: {
          resourceName: 'Azure File Sync Server Endpoint Blade',
          serviceCategory: 'Azure File Sync',
          icon: 'FolderSync',
          tabs: [
            {
              id: 'tiering',
              label: 'Cloud Tiering',
              fields: [
                {
                  id: 'tiering-toggle',
                  label: 'Cloud Tiering',
                  type: 'radio',
                  currentValue: 'Enabled',
                  options: [
                    { label: 'Enabled', value: 'Enabled', description: 'Tier cold files to Azure' },
                    { label: 'Disabled', value: 'Disabled', description: 'Full copy kept locally' }
                  ]
                },
                {
                  id: 'free-space-pct',
                  label: 'Volume Free Space policy',
                  type: 'text',
                  currentValue: '20%',
                  helpText: 'Coldest files tiered first when volume space drops below this limit.'
                }
              ]
            }
          ]
        }
      },
      examTraps: [
        {
          trapTitle: 'NFS File Shares Require Premium FileStorage',
          scenario: 'An admin tries to create an NFS v4.1 file share inside a standard general-purpose v2 storage account, but the NFS option is greyed out.',
          whyItTricksPeople: 'Users think NFS is available on any tier like SMB.',
          correctAnswerRule: 'NFS file shares are EXCLUSIVELY supported on Premium FileStorage storage accounts.'
        },
        {
          trapTitle: 'Cloud Endpoint Limit per Sync Group',
          scenario: 'You want to sync files between two different Azure File Shares in different storage accounts using a single Azure File Sync group.',
          whyItTricksPeople: 'People assume sync groups can link multiple cloud shares.',
          correctAnswerRule: 'A Sync Group can have EXACTLY ONE Cloud Endpoint (one Azure file share).'
        }
      ],
      keyNumbers: [
        { label: 'Max File Share Size', value: '100 TiB', context: 'With large file shares enabled' },
        { label: 'Port Required for SMB', value: 'TCP Port 445', context: 'Must be open outbound' },
        { label: 'Cloud Endpoints per Sync Group', value: 'Exactly 1', context: 'Only one Azure File Share per sync group' }
      ],
      cliSnippets: [
        {
          title: 'Create Azure File Share via Azure CLI',
          cli: 'az storage share-rm create --storage-account "storprodcorp01" --name "corp-share" --quota 10240',
          powershell: 'New-AzRmStorageShare -ResourceGroupName "rg-storage" -StorageAccountName "storprodcorp01" -Name "corp-share" -QuotaGiB 10240',
          explanation: 'Creates a 10 TiB Azure File Share.'
        }
      ],
      quiz: [
        {
          id: 'q2-4',
          scenario: 'Your branch office has a Windows Server with a 2 TB volume that is 90% full. You install Azure File Sync and enable Cloud Tiering with a Volume Free Space policy of 30%. What will happen to files on the server?',
          options: [
            'All files older than 30 days are permanently deleted from both local and cloud storage',
            'Infrequently accessed files are replaced by lightweight pointers (stubs) and tiered to Azure until 30% of the volume is free',
            'The entire 2 TB volume is compressed to 30% of its original size',
            'Sync pauses until an administrator attaches a new physical hard disk'
          ],
          correctAnswer: 1,
          explanation: 'Cloud Tiering transforms cold files into lightweight pointer stubs on the local drive, freeing up physical disk space until the 30% free space threshold is met, while files remain fully visible to users.',
          trapAlert: 'Files are not deleted; they are transparently recalled on-demand when a user opens them.'
        }
      ]
    }
  ]
};
