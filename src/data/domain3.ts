import type { DomainSection } from '../types';

export const domain3: DomainSection = {
  id: 'domain-3',
  number: 3,
  title: 'Deploy and Manage Azure Compute Resources',
  weight: '20–25%',
  weightRange: [20, 25],
  color: 'from-emerald-600 to-teal-500',
  badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  accentBorder: 'border-emerald-500/40',
  iconName: 'Server',
  description: 'Deploy and orchestrate virtual machines across Availability Zones and Scale Sets, master ARM & Bicep infrastructure automation, deploy serverless containers with ACI and Container Apps, and configure Azure App Service deployment slots.',
  topics: [
    {
      id: 'd3-arm-bicep-automation',
      title: 'ARM Templates & Bicep: Syntax, Modes & Deployment',
      domainId: 'domain-3',
      weightLabel: 'High Yield',
      summary: 'Automating cloud infrastructure using declarative ARM JSON and Bicep, comparing Incremental vs Complete deployment modes, and converting templates.',
      coreConcepts: [
        {
          heading: 'ARM JSON Structure vs Bicep Syntax',
          content: 'ARM templates provide Infrastructure as Code (IaC) in JSON format. Bicep is a modern, domain-specific language (DSL) that compiles directly to ARM JSON with cleaner syntax and automatic dependency management.',
          keyPoints: [
            'ARM JSON Top-level keys: $schema, contentVersion, parameters, variables, resources, outputs, functions.',
            'Bicep keywords: "param" (inputs), "var" (computed values), "resource" (Azure services), "output" (returned data), "module" (reusable child templates).',
            'Decompilation: Convert ARM JSON to Bicep with "az bicep decompile --file template.json".'
          ]
        },
        {
          heading: 'Incremental vs Complete Deployment Modes',
          content: 'The deployment mode dictates what Azure Resource Manager does to existing resources in the resource group that are NOT defined in the template.',
          keyPoints: [
            'Incremental Mode (Default): Deploys new resources and updates matching existing resources. Leaves any existing resources NOT in the template untouched and running.',
            'Complete Mode (Dangerous!): Deploys resources in the template, and DELETES any existing resources in the resource group that are NOT defined in the template!',
            'CRITICAL EXAM TRAP: If a template is deployed in Complete mode to a resource group with 5 VMs and the template only defines 1 storage account, all 5 VMs will be deleted!'
          ]
        }
      ],
      portalWalkthrough: {
        overview: 'Exporting an ARM template from a resource group and validating deployment via the Portal.',
        steps: [
          {
            stepNumber: 1,
            title: 'Export Template from Resource Group',
            portalPath: 'Resource Group > Automation > Export template',
            description: 'Download the generated ARM JSON and parameters file or deploy directly.',
            keyFields: [
              { name: 'Export options', value: 'Download, Add to library (Template Spec), Deploy' }
            ]
          },
          {
            stepNumber: 2,
            title: 'Custom Template Deployment',
            portalPath: 'Azure Portal > Search "Deploy a custom template" > Build your own template in the editor',
            description: 'Paste Bicep or ARM JSON, edit parameters, and review mode.',
            keyFields: [
              { name: 'Subscription & Resource group', value: 'rg-compute-prod' },
              { name: 'Parameters', value: 'vmName, adminUsername, sshPublicKey' }
            ]
          }
        ],
        interactiveBlade: {
          resourceName: 'Custom Template Deployment Blade',
          serviceCategory: 'Deployments',
          icon: 'Code2',
          tabs: [
            {
              id: 'basics',
              label: 'Basics',
              fields: [
                {
                  id: 'deployment-mode',
                  label: 'Deployment Mode',
                  type: 'select',
                  currentValue: 'Incremental',
                  options: [
                    { label: 'Incremental (Default)', value: 'Incremental', description: 'Leaves existing unmentioned resources untouched' },
                    { label: 'Complete', value: 'Complete', description: 'DELETES any unmentioned resources in the target group!', isExamTrap: true }
                  ],
                  examNote: 'Exam trap: Complete mode is destructive. Default is always Incremental.'
                }
              ]
            }
          ]
        }
      },
      examTraps: [
        {
          trapTitle: 'Complete Mode Deletion Behavior',
          scenario: 'A DevOps engineer runs an ARM deployment targeting an existing production resource group using "--mode Complete". The template only contains an Azure SQL Database. The resource group previously had two web apps and a storage account.',
          whyItTricksPeople: 'People think Complete mode just means "run all tasks completely without skipping errors".',
          correctAnswerRule: 'Complete mode deletes everything in the resource group that is not specified in the template. The two web apps and storage account will be permanently deleted.'
        }
      ],
      keyNumbers: [
        { label: 'Max Parameters per Template', value: '256', context: 'ARM template parameter limit' },
        { label: 'Max Variables per Template', value: '256', context: 'ARM template variable limit' },
        { label: 'Max Template Size', value: '4 MB', context: 'Maximum raw template file size' }
      ],
      cliSnippets: [
        {
          title: 'Deploy Bicep Template via Azure CLI',
          cli: 'az deployment group create --resource-group "rg-compute" --template-file "main.bicep" --parameters environment="prod" vmSize="Standard_D2s_v5"',
          powershell: 'New-AzResourceGroupDeployment -ResourceGroupName "rg-compute" -TemplateFile "main.bicep" -environment "prod"',
          explanation: 'Executes an incremental deployment of a Bicep file.'
        }
      ],
      quiz: [
        {
          id: 'q3-1',
          scenario: 'You need to deploy 10 virtual machines using an ARM template to an existing Resource Group called "RG-App". The resource group already contains an Azure Bastion host. You want to ensure the Bastion host remains operational after the deployment. Which deployment mode must you use?',
          options: [
            'Complete mode',
            'Incremental mode',
            'Rollback mode',
            'Validate-only mode'
          ],
          correctAnswer: 1,
          explanation: 'Incremental mode adds or updates the 10 virtual machines while leaving the existing Azure Bastion host completely untouched. Complete mode would delete the Bastion host because it was not defined in the template.',
          trapAlert: 'Never use Complete mode on an existing populated resource group unless you explicitly intend to purge unmanaged resources.'
        }
      ]
    },
    {
      id: 'd3-vms-availability-vmss',
      title: 'Virtual Machines, Availability Sets, Zones & Scale Sets (VMSS)',
      domainId: 'domain-3',
      weightLabel: 'High Yield',
      summary: 'VM sizing, Fault Domains (FD), Update Domains (UD), Availability Zones (99.99%), Proximity Placement Groups, VMSS autoscale rules, and disk caching.',
      coreConcepts: [
        {
          heading: 'High Availability: Availability Sets vs Zones',
          content: 'Architecting compute resiliency against planned platform maintenance and unexpected hardware failures.',
          diagramType: 'vm-resilience',
          keyPoints: [
            'Availability Sets (Single DC protection): Grouping VMs into separate Fault Domains (FD) and Update Domains (UD).',
            'Fault Domains (FD): Share common power source and physical network switch. Max 2 or 3 FDs per set.',
            'Update Domains (UD): Rebooted sequentially during platform patch maintenance. Up to 20 UDs. Only ONE UD is updated at a time.',
            'Availability Zones (Multi-DC protection): 3 physically separated datacenters in a region with independent power, cooling, and networking. 99.99% SLA for multi-zone VMs.',
            'Proximity Placement Groups (PPG): Colocates VMs physically close together inside a single datacenter to achieve lowest possible network latency (< 1 ms).'
          ]
        },
        {
          heading: 'Virtual Machine Scale Sets (VMSS)',
          content: 'Deploy and manage a group of identical, auto-scaling VMs.',
          keyPoints: [
            'Orchestration Modes: Flexible (mix of VM sizes, Spot/Standard instances, availability zones) vs Uniform (identical VMs managed as a single pool).',
            'Autoscale Rules: Metric-based (e.g. Scale out by 2 instances if Average CPU > 75% for 10 min; Scale in by 1 if CPU < 25%).',
            'Upgrade Policies: Automatic (updates rolled out immediately), Rolling (updates applied in batches with health pauses), Manual.'
          ]
        },
        {
          heading: 'VM Disks & Host Caching',
          content: 'Managing OS disks, temporary scratch disks, data disks, and read/write caching.',
          keyPoints: [
            'OS Disk: Persistent, holds boot volume (usually C: or /dev/sda).',
            'Temporary Disk: NON-PERSISTENT (labeled D: or /dev/sdb). High speed scratch disk on physical host. Data is LOST upon VM deallocation or migration!',
            'Host Caching: None, ReadOnly, Read/Write. Write caching is NOT supported on disks 4 TiB or larger.'
          ]
        }
      ],
      portalWalkthrough: {
        overview: 'Deploying an Ubuntu VM in an Availability Zone with Premium SSD and configuring autoscale rules on a VMSS.',
        steps: [
          {
            stepNumber: 1,
            title: 'Create VM with Availability Zone',
            portalPath: 'Azure Portal > Virtual machines > + Create > Azure virtual machine',
            description: 'Select region and Availability Zone 1, 2, or 3.',
            keyFields: [
              { name: 'Availability options', value: 'Availability zone' },
              { name: 'Availability zone', value: 'Zone 1' },
              { name: 'Security type', value: 'Trusted launch virtual machines' }
            ]
          },
          {
            stepNumber: 2,
            title: 'Configure Disks & Caching',
            portalPath: 'Create VM > Disks tab',
            description: 'Select OS disk type and attach data disk.',
            keyFields: [
              { name: 'OS disk type', value: 'Premium SSD' },
              { name: 'Host caching', value: 'Read/write (for OS disk)' }
            ]
          }
        ],
        interactiveBlade: {
          resourceName: 'Create Virtual Machine Blade',
          serviceCategory: 'Virtual Machines',
          icon: 'Cpu',
          tabs: [
            {
              id: 'basics',
              label: 'Basics',
              fields: [
                {
                  id: 'vm-avail-opt',
                  label: 'Availability options',
                  type: 'select',
                  currentValue: 'Availability zone',
                  options: [
                    { label: 'No infrastructure redundancy required', value: 'None' },
                    { label: 'Availability zone', value: 'Availability zone', description: '99.99% SLA across separate DCs' },
                    { label: 'Availability set', value: 'Availability set', description: 'Fault & Update domain separation in single DC' }
                  ]
                },
                {
                  id: 'vm-zone-num',
                  label: 'Availability Zone',
                  type: 'select',
                  currentValue: '1',
                  options: [
                    { label: 'Zone 1', value: '1' },
                    { label: 'Zone 2', value: '2' },
                    { label: 'Zone 3', value: '3' }
                  ]
                }
              ]
            }
          ]
        }
      },
      examTraps: [
        {
          trapTitle: 'Data Saved to Temporary Disk D: is Ephemeral',
          scenario: 'A developer stores a database file on drive D: of an Azure Windows VM. Over the weekend, Azure runs hardware maintenance and moves the VM to a different node. The database file is gone.',
          whyItTricksPeople: 'D: looks like a regular local fixed drive in Windows Explorer.',
          correctAnswerRule: 'Drive D: (or /dev/sdb on Linux) is the Temporary Scratch Disk. Data on it is wiped whenever the VM is resized, restarted on another host, or deallocated.'
        },
        {
          trapTitle: 'Availability Sets Cannot Be Changed After VM Creation',
          scenario: 'A standalone VM was deployed without an availability set. Management wants to add it to an existing Availability Set.',
          whyItTricksPeople: 'Admins expect an "Add to Availability Set" dropdown on the VM configuration blade.',
          correctAnswerRule: 'A VM CANNOT be moved into or out of an Availability Set after creation. The VM must be deleted and recreated from its existing OS disk.'
        }
      ],
      keyNumbers: [
        { label: 'Fault Domains per Set', value: '2 or 3', context: 'Physical rack / power / switch isolation' },
        { label: 'Update Domains per Set', value: 'Up to 20', context: 'Rebooted one at a time during maintenance' },
        { label: 'Availability Zone SLA', value: '99.99%', context: 'With 2+ VMs across zones in same region' }
      ],
      cliSnippets: [
        {
          title: 'Create VM in Availability Zone via CLI',
          cli: 'az vm create --resource-group "rg-compute" --name "vm-web-01" --image "Ubuntu2204" --zone 1 --size "Standard_D2s_v5" --admin-username "azureuser" --generate-ssh-keys',
          powershell: 'New-AzVM -ResourceGroupName "rg-compute" -Name "vm-web-01" -Zone "1" -Image "Ubuntu2204" -Size "Standard_D2s_v5"',
          explanation: 'Deploys an Ubuntu virtual machine into Availability Zone 1.'
        }
      ],
      quiz: [
        {
          id: 'q3-2',
          scenario: 'You deploy 6 virtual machines into a single Availability Set configured with 3 Fault Domains and 5 Update Domains. Azure performs a scheduled platform upgrade that requires rebooting physical hosts. What is the maximum number of VMs that can be rebooted simultaneously?',
          options: [
            '1 VM',
            '2 VMs',
            '3 VMs',
            '6 VMs'
          ],
          correctAnswer: 1,
          explanation: 'With 6 VMs distributed across 5 Update Domains (UDs 0 to 4), UD 0 will contain 2 VMs (VM 1 and VM 6), while UDs 1, 2, 3, and 4 contain 1 VM each. When UD 0 is updated, both of its VMs (2 VMs) reboot together.',
          trapAlert: 'Calculate VM distribution across Update Domains: 6 VMs / 5 UDs = at least one UD has 2 VMs.'
        }
      ]
    },
    {
      id: 'd3-containers-aci-aca',
      title: 'Containers: Azure Container Registry (ACR), ACI & Container Apps',
      domainId: 'domain-3',
      weightLabel: 'Core Domain',
      summary: 'Docker image management in ACR, fast serverless execution with Azure Container Instances (ACI), and microservice scaling with Azure Container Apps (ACA).',
      coreConcepts: [
        {
          heading: 'ACR (Azure Container Registry)',
          content: 'Private Docker and OCI registry hosted in Azure.',
          keyPoints: [
            'SKUs: Basic, Standard, Premium (Premium adds geo-replication, private endpoints, and content trust).',
            'Authentication: Admin user (quick testing/demos), Entra ID Service Principals, or Managed Identities (assigning "AcrPull" role to VM/App Service/AKS).'
          ]
        },
        {
          heading: 'ACI (Azure Container Instances)',
          content: 'Run containers directly without provisioning or managing underlying VMs or Kubernetes clusters.',
          keyPoints: [
            'Fast startup (seconds). Ideal for batch jobs, CI/CD runners, simple webhooks.',
            'Restart Policies: "Always" (web services), "Never" (single run batch tasks), "OnFailure" (retries on error code).',
            'Volume Mounting: Supports mounting Azure File Shares directly into the container.'
          ]
        },
        {
          heading: 'ACA (Azure Container Apps)',
          content: 'Serverless application platform built on Kubernetes, KEDA, Envoy, and Dapr.',
          keyPoints: [
            'Supports auto-scaling to zero (scale-to-zero) based on HTTP requests or event queues.',
            'Revisions: Immutable snapshots of container revisions with traffic splitting (e.g. 80% to v1, 20% to v2 for canary testing).'
          ]
        }
      ],
      portalWalkthrough: {
        overview: 'Deploying a container image from ACR to Azure Container Instances with an Azure Files volume mount.',
        steps: [
          {
            stepNumber: 1,
            title: 'Deploy ACI Container',
            portalPath: 'Azure Portal > Container instances > + Create',
            description: 'Specify container source, image name, and restart policy.',
            keyFields: [
              { name: 'Image source', value: 'Azure Container Registry' },
              { name: 'Restart policy', value: 'Always (for HTTP APIs)' },
              { name: 'DNS name label', value: 'myapp-api-contoso' }
            ]
          }
        ],
        interactiveBlade: {
          resourceName: 'Create Container Instance Blade',
          serviceCategory: 'Containers',
          icon: 'Box',
          tabs: [
            {
              id: 'basics',
              label: 'Basics',
              fields: [
                {
                  id: 'aci-restart-policy',
                  label: 'Restart policy',
                  type: 'radio',
                  currentValue: 'Always',
                  options: [
                    { label: 'Always', value: 'Always', description: 'Restarts automatically if stopped' },
                    { label: 'On failure', value: 'On failure', description: 'Restarts only if non-zero exit code' },
                    { label: 'Never', value: 'Never', description: 'Runs once and stops (batch jobs)' }
                  ]
                }
              ]
            }
          ]
        }
      },
      examTraps: [
        {
          trapTitle: 'ACI Restart Policy for Batch Jobs vs Web Services',
          scenario: 'You deploy an ACI container that processes a batch CSV file and exits. The container keeps restarting indefinitely in an infinite loop.',
          whyItTricksPeople: 'The default restart policy on ACI is "Always".',
          correctAnswerRule: 'Batch or run-to-completion tasks MUST have their restart policy set to "On failure" or "Never".'
        }
      ],
      keyNumbers: [
        { label: 'ACI Startup Time', value: 'Seconds', context: 'Fastest container compute in Azure' },
        { label: 'ACA Scale-to-Zero', value: 'Supported', context: 'Incurs 0 compute cost when idle' }
      ],
      cliSnippets: [
        {
          title: 'Deploy Container to ACI via CLI',
          cli: 'az container create --resource-group "rg-containers" --name "my-app" --image "mcr.microsoft.com/azuredocs/aci-helloworld" --dns-name-label "myapp-test-01" --ports 80',
          explanation: 'Creates a public container instance reachable over HTTP.'
        }
      ],
      quiz: [
        {
          id: 'q3-3',
          scenario: 'You need to run a nightly data aggregation script in a Docker container that takes 20 minutes to complete and then terminates. Which ACI restart policy should you specify?',
          options: [
            'Always',
            'Never or On failure',
            'Continuous',
            'Rolling'
          ],
          correctAnswer: 1,
          explanation: '"Never" or "On failure" ensures the container stops running once the nightly script finishes with exit code 0, rather than endlessly restarting.',
          trapAlert: 'Setting "Always" on a batch job will cause it to repeat endlessly.'
        }
      ]
    },
    {
      id: 'd3-app-service-slots',
      title: 'Azure App Service: Plans, Custom Domains & Deployment Slots',
      domainId: 'domain-3',
      weightLabel: 'High Yield',
      summary: 'App Service Plan tiers, scale up vs scale out, TLS/SSL bindings, zero-downtime deployment slots, and swappable vs sticky settings.',
      coreConcepts: [
        {
          heading: 'App Service Plans: Scale Up vs Scale Out',
          content: 'An App Service Plan defines the compute region, instance size, and features available to all web apps hosted inside it.',
          keyPoints: [
            'Scale Up (Vertical): Upgrading to a higher pricing tier (e.g. Basic to Standard, or Standard to Premium v3). Adds more CPU, RAM, and features (like deployment slots, custom domains, or VNet integration).',
            'Scale Out (Horizontal): Increasing the instance count (e.g., from 1 VM to 5 VMs). Can be configured with metric-based Autoscale rules (CPU percentage, memory percentage).'
          ]
        },
        {
          heading: 'Deployment Slots & Slot Swapping',
          content: 'Deployment slots allow deploying and warming up new application code in a staging slot before swapping it into production with zero downtime.',
          diagramType: 'slot-swap',
          keyPoints: [
            'Minimum tier requirement: Requires Standard, Premium, or Isolated App Service Plan tiers (not available on Free or Basic).',
            'Swap mechanics: Azure warms up the target slot with production traffic and swaps the virtual IP routing.',
            'CRITICAL EXAM TRAP: Swappable vs Sticky (Deployment Slot) Settings!'
          ]
        },
        {
          heading: 'Swappable vs Sticky Settings Reference Table',
          content: 'You must know which settings swap and which settings stay in place during a slot swap.',
          keyPoints: [
            'Settings that SWAP by default: App settings (environment variables), Connection strings, Framework versions, Web sockets.',
            'Settings that NEVER swap (STICKY): Publishing endpoints, Custom domain names, SSL certificates, Scale settings (autoscale rules), IP restrictions, VNet integration.',
            'To make an App Setting stay with the slot: Tick the "Deployment slot setting" checkbox when adding/editing the setting!'
          ]
        }
      ],
      portalWalkthrough: {
        overview: 'Adding a "staging" deployment slot and configuring a sticky environment variable.',
        steps: [
          {
            stepNumber: 1,
            title: 'Add Deployment Slot',
            portalPath: 'App Service > Deployment > Deployment slots > + Add Slot',
            description: 'Name the slot "staging" and optionally clone settings from production.',
            keyFields: [
              { name: 'Name', value: 'staging' },
              { name: 'Clone settings from', value: 'production (or Do not clone)' }
            ]
          },
          {
            stepNumber: 2,
            title: 'Configure Sticky App Setting',
            portalPath: 'App Service (staging) > Settings > Environment variables > + Add',
            description: 'Add a database connection string that should NOT swap into production.',
            keyFields: [
              { name: 'Name', value: 'DB_CONNECTION_STRING' },
              { name: 'Value', value: 'Server=tcp:db-staging.database.windows.net...' },
              { name: 'Deployment slot setting', value: 'Checked (Sticky)', hint: 'Crucial: Ensures staging always points to staging DB even after swap' }
            ]
          }
        ],
        interactiveBlade: {
          resourceName: 'App Service Configuration Blade',
          serviceCategory: 'Web Apps',
          icon: 'Globe',
          tabs: [
            {
              id: 'app-settings',
              label: 'App Settings',
              fields: [
                {
                  id: 'slot-sticky-setting',
                  label: 'Deployment slot setting (Sticky)',
                  type: 'checkbox',
                  currentValue: 'true',
                  helpText: 'When checked, this setting stays with this specific slot and is NOT swapped.'
                }
              ]
            }
          ]
        }
      },
      examTraps: [
        {
          trapTitle: 'Connection Strings Swapping into Production by Default',
          scenario: 'A developer configures a staging slot with a test database connection string. They perform a slot swap. Suddenly, the production app starts reading and writing to the test database!',
          whyItTricksPeople: 'People assume environment variables and connection strings stay with the slot automatically.',
          correctAnswerRule: 'By default, application settings and connection strings SWAP. You must explicitly check "Deployment slot setting" to make them sticky.'
        },
        {
          trapTitle: 'Deployment Slots Not Supported on Basic Tier',
          scenario: 'An admin wants to test slot swapping on an App Service running on the Basic (B1) tier, but cannot find the Deployment Slots menu.',
          whyItTricksPeople: 'Basic supports custom domains and SSL, so people think it also supports slots.',
          correctAnswerRule: 'Deployment slots require at least the Standard (S1) tier.'
        }
      ],
      keyNumbers: [
        { label: 'Minimum Tier for Slots', value: 'Standard (S1)', context: 'Supports up to 5 slots' },
        { label: 'Premium Tier Slot Limit', value: 'Up to 20 slots', context: 'Allows extensive multi-stage pipelines' }
      ],
      cliSnippets: [
        {
          title: 'Swap App Service Deployment Slots via CLI',
          cli: 'az webapp deployment slot swap --resource-group "rg-apps" --name "my-webapp" --slot "staging" --target-slot "production"',
          powershell: 'Switch-AzWebAppSlot -ResourceGroupName "rg-apps" -Name "my-webapp" -SourceSlotName "staging" -DestinationSlotName "production"',
          explanation: 'Executes a zero-downtime swap between staging and production.'
        }
      ],
      quiz: [
        {
          id: 'q3-4',
          scenario: 'You have a Web App named "app1" running in the Standard S1 tier. You configure a staging deployment slot. You want to ensure that after swapping "staging" into "production", the staging slot continues to point to the staging database and production continues to point to the production database. What should you do?',
          options: [
            'Upgrade the App Service Plan to Premium v3',
            'Select the "Deployment slot setting" checkbox for the database connection string in both slots',
            'Configure VNet Integration on the staging slot only',
            'Delete and recreate the staging slot after each swap'
          ],
          correctAnswer: 1,
          explanation: 'Checking "Deployment slot setting" makes that setting sticky to that slot, preventing it from being swapped when traffic is redirected.',
          trapAlert: 'If you do not check "Deployment slot setting", the connection string will swap, pointing your production users to the staging DB.'
        }
      ]
    }
  ]
};
