import type { DomainSection } from '../types';

export const domain1: DomainSection = {
  id: 'domain-1',
  number: 1,
  title: 'Manage Azure Identities and Governance',
  weight: '20–25%',
  weightRange: [20, 25],
  color: 'from-blue-600 to-cyan-500',
  badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  accentBorder: 'border-blue-500/40',
  iconName: 'ShieldCheck',
  description: 'Master Microsoft Entra ID identity management, fine-grained Role-Based Access Control (RBAC), and enterprise governance through Azure Policy, Management Groups, and resource locks.',
  topics: [
    {
      id: 'd1-entra-id-users-groups',
      title: 'Microsoft Entra ID: Users, Groups, Dynamic Rules & SSPR',
      domainId: 'domain-1',
      weightLabel: 'High Yield',
      summary: 'Configuring cloud identities, dynamic user/device memberships, Administrative Units for delegated boundaries, and Self-Service Password Reset (SSPR).',
      coreConcepts: [
        {
          heading: 'User & Group Types in Microsoft Entra ID',
          content: 'Microsoft Entra ID is a multi-tenant cloud identity service. Users can be Cloud-only, Directory-synchronized (via Entra Connect from Active Directory), or External Guests (B2B collaboration). Groups are divided into Security Groups (for assigning permissions and software) and Microsoft 365 Groups (for team collaboration with shared mailbox, calendar, and SharePoint).',
          keyPoints: [
            'Usage Location is mandatory: You cannot assign a Microsoft 365 or Entra P1/P2 license to a user without setting their Usage Location first.',
            'Group-based licensing: Automatically assigns licenses based on group membership. If a license conflict occurs (e.g., mutually exclusive plans), the user enters an error state but remains in the group.',
            'Role-assignable groups: Must have "Microsoft Entra roles can be assigned to the group" set to Yes at CREATION time. This setting can NEVER be changed later. These groups cannot be dynamic and cannot contain nested groups.'
          ]
        },
        {
          heading: 'Dynamic Membership Syntax & Rules',
          content: 'Dynamic groups evaluate user or device attributes periodically. Membership cannot be manually added or removed when dynamic membership is enabled.',
          keyPoints: [
            'User syntax example: (user.department -eq "Sales") and (user.country -eq "US")',
            'Device syntax example: (device.deviceOS -startsWith "Windows") and (device.deviceOwnership -eq "Company")',
            'Dynamic groups require Microsoft Entra ID P1 or P2 licenses for each unique member.'
          ]
        },
        {
          heading: 'Administrative Units (AUs)',
          content: 'Administrative Units allow delegating administrative responsibilities over subsets of users, groups, or devices (e.g., Regional IT Helpdesk managing only the "Paris Office" users) without granting broad directory-wide administrator roles.',
          keyPoints: [
            'Scope of authority: Roles assigned at the AU scope only apply to members of that specific AU.',
            'Restricted management AUs: Prevent Global Administrators or lower admins from modifying members unless explicitly assigned to that restricted AU.'
          ]
        },
        {
          heading: 'Self-Service Password Reset (SSPR)',
          content: 'SSPR allows users to reset their own passwords without contacting the helpdesk. It requires configuring authentication methods, registration enforcement, and optional password writeback to on-premises AD.',
          keyPoints: [
            'Licensing: Microsoft Entra ID Free allows SSPR only for directory administrators. Entra ID P1 or P2 is required for standard users.',
            'Authentication methods: Admin can require 1 or 2 methods (Email, Mobile phone, Office phone, Security questions, Microsoft Authenticator app).',
            'Security questions requirement: If enabled, users must register 3 to 5 questions and answer 3 to 5 correctly to reset.'
          ]
        }
      ],
      portalWalkthrough: {
        overview: 'Walkthrough of configuring Microsoft Entra SSPR and creating a Dynamic Security Group in the Azure/Entra Portal.',
        steps: [
          {
            stepNumber: 1,
            title: 'Navigate to Password Reset (SSPR)',
            portalPath: 'Azure Portal > Microsoft Entra ID > Password reset',
            description: 'Enable SSPR for a pilot security group before rolling it out tenant-wide.',
            keyFields: [
              { name: 'Self service password reset enabled', value: 'Selected', hint: 'Best practice is to pilot with a group before choosing "All"' },
              { name: 'Select group', value: 'Pilot-SSPR-Users', hint: 'Target group containing test identities' }
            ]
          },
          {
            stepNumber: 2,
            title: 'Configure Authentication Methods',
            portalPath: 'Password reset > Authentication methods',
            description: 'Specify how many methods are required to reset and which options are available.',
            keyFields: [
              { name: 'Number of methods required to reset', value: '2', hint: 'Demands 2 separate proofs for higher security' },
              { name: 'Methods available to users', value: 'Email, Mobile phone, Notification via app', hint: 'Select at least as many methods as required' }
            ]
          },
          {
            stepNumber: 3,
            title: 'Create a Dynamic Security Group',
            portalPath: 'Microsoft Entra ID > Groups > + New group',
            description: 'Define an automated rule for user membership.',
            keyFields: [
              { name: 'Group type', value: 'Security' },
              { name: 'Group name', value: 'Sec-Marketing-USA' },
              { name: 'Membership type', value: 'Dynamic User' },
              { name: 'Dynamic query', value: '(user.department -eq "Marketing") and (user.usageLocation -eq "US")' }
            ]
          }
        ],
        interactiveBlade: {
          resourceName: 'Password Reset (SSPR) Settings',
          serviceCategory: 'Microsoft Entra ID',
          icon: 'KeyRound',
          tabs: [
            {
              id: 'properties',
              label: 'Properties',
              fields: [
                {
                  id: 'sspr-enablement',
                  label: 'Self service password reset enabled',
                  type: 'radio',
                  currentValue: 'Selected',
                  options: [
                    { label: 'None', value: 'None', description: 'SSPR is disabled for all users' },
                    { label: 'Selected', value: 'Selected', description: 'Only members of designated groups can reset' },
                    { label: 'All', value: 'All', description: 'Enabled tenant-wide' }
                  ],
                  helpText: 'Always test SSPR with Selected groups before enabling for All.'
                },
                {
                  id: 'methods-count',
                  label: 'Number of methods required to reset',
                  type: 'select',
                  currentValue: '2',
                  options: [
                    { label: '1 method', value: '1' },
                    { label: '2 methods', value: '2', description: 'Recommended for enterprise production' }
                  ]
                }
              ]
            },
            {
              id: 'methods',
              label: 'Authentication Methods',
              fields: [
                {
                  id: 'method-email',
                  label: 'Email',
                  type: 'checkbox',
                  currentValue: 'true',
                  helpText: 'Sends a 6-digit code to the user alternative email address.'
                },
                {
                  id: 'method-mobile',
                  label: 'Mobile phone (SMS/Call)',
                  type: 'checkbox',
                  currentValue: 'true',
                  helpText: 'Sends SMS verification or automated phone call.'
                },
                {
                  id: 'method-app',
                  label: 'Mobile app code / notification',
                  type: 'checkbox',
                  currentValue: 'true',
                  helpText: 'Uses Microsoft Authenticator push notification.'
                }
              ]
            }
          ]
        }
      },
      examTraps: [
        {
          trapTitle: 'Assigning Licenses to Users Without Usage Location',
          scenario: 'You create a new cloud-only user "Jane Doe" via script or portal and attempt to assign an Entra ID P2 license, but the assignment fails.',
          whyItTricksPeople: 'Most directories do not require location at creation, but Azure enforces compliance with telecommunication and cloud export laws before assigning any SKU.',
          correctAnswerRule: 'You MUST set user.UsageLocation (ISO 2-letter country code like "US") before license assignment can succeed.'
        },
        {
          trapTitle: 'Role-Assignable Groups Cannot Be Converted or Dynamic',
          scenario: 'You want to automate membership of a group that has the "User Access Administrator" directory role assigned by using dynamic user attributes.',
          whyItTricksPeople: 'People assume any security group can have dynamic membership.',
          correctAnswerRule: 'Role-assignable groups CANNOT have dynamic membership rules, and "Microsoft Entra roles can be assigned" can ONLY be toggled during group creation.'
        },
        {
          trapTitle: 'SSPR Licensing for Non-Admins',
          scenario: 'A company with Entra ID Free wants all 500 standard employees to use SSPR.',
          whyItTricksPeople: 'Entra ID Free provides SSPR for administrators, so people think it covers normal users too.',
          correctAnswerRule: 'Entra ID Free ONLY supports SSPR for directory administrators. Standard users require Entra ID P1 or P2 licenses.'
        }
      ],
      keyNumbers: [
        { label: '5 IPs reserved in VNets vs 0 in Entra', value: 'N/A', context: 'Remember that Entra ID has no network subnets' },
        { label: 'SSPR Question Count', value: '3 to 5', context: 'Security questions require 3-5 to register and 3-5 to answer' },
        { label: 'Role-Assignable Groups', value: 'Max 500', context: 'Tenant limit on role-assignable groups' }
      ],
      cliSnippets: [
        {
          title: 'Create User with Usage Location via Azure CLI',
          cli: 'az ad user create --display-name "Alex Rivera" --user-principal-name "arivera@contoso.com" --password "P@ssw0rd12345!" --force-change-password-next-sign-in true',
          powershell: 'New-MgUser -DisplayName "Alex Rivera" -UserPrincipalName "arivera@contoso.com" -UsageLocation "US" -PasswordProfile @{Password="P@ssw0rd12345!"}',
          explanation: 'Creates a user and ensures password reset is mandated on first login.'
        },
        {
          title: 'Add User to Administrative Unit',
          cli: 'az rest --method POST --uri "https://graph.microsoft.com/v1.0/directory/administrativeUnits/{au-id}/members/$ref" --body \'{"@odata.id":"https://graph.microsoft.com/v1.0/users/{user-id}"}\'',
          powershell: 'New-MgDirectoryAdministrativeUnitMemberByRef -AdministrativeUnitId $auId -BodyParameter @{"@odata.id"="https://graph.microsoft.com/v1.0/users/$userId"}',
          explanation: 'Binds a user identity into a regional Administrative Unit boundary.'
        }
      ],
      quiz: [
        {
          id: 'q1-1',
          scenario: 'You have a Microsoft Entra tenant with 200 users. You need to enable Self-Service Password Reset for all users. What is the minimum license required for the non-administrative users?',
          options: [
            'Microsoft Entra ID Free',
            'Microsoft Entra ID Governance',
            'Microsoft Entra ID P1 or P2',
            'Azure Cost Management tier'
          ],
          correctAnswer: 2,
          explanation: 'Microsoft Entra ID Free allows SSPR only for administrators. To enable SSPR for regular employees/users, Microsoft Entra ID P1 or P2 licenses are required.',
          trapAlert: 'Do not confuse admin SSPR (free) with user SSPR (requires P1/P2).'
        },
        {
          id: 'q1-2',
          scenario: 'You want to delegate the ability to reset passwords for all users in the "Tokyo" office to the local IT Helpdesk lead, without allowing them to modify users in London or New York. What should you create?',
          options: [
            'An Azure Management Group with a Helpdesk RBAC role',
            'An Administrative Unit containing Tokyo users, with the Helpdesk Administrator role scoped to it',
            'A Resource Group with a CanNotDelete resource lock',
            'A dynamic group with user.department -eq "Helpdesk"'
          ],
          correctAnswer: 1,
          explanation: 'Administrative Units (AUs) are designed specifically to delegate administrative authority over a specific subset of directory users or devices without granting tenant-wide privileges.',
          trapAlert: 'Management Groups and Resource Groups are for Azure Azure Resource Manager (Azure resources), NOT Entra ID directory objects!'
        }
      ]
    },
    {
      id: 'd1-azure-rbac',
      title: 'Azure RBAC: Roles, Scopes, Inheritance & Custom Roles',
      domainId: 'domain-1',
      weightLabel: 'Core Domain',
      summary: 'Configuring role assignments, understanding scope hierarchy, writing custom JSON roles, and distinguishing control-plane from data-plane permissions.',
      coreConcepts: [
        {
          heading: 'RBAC Scope Hierarchy & Inheritance',
          content: 'Azure RBAC permissions are assigned at specific scopes and flow downward through the hierarchy. Permissions cannot be blocked or restricted at lower levels (there is no "block inheritance" button).',
          diagramType: 'rbac-hierarchy',
          keyPoints: [
            'Hierarchy order: Management Group > Subscription > Resource Group > Resource.',
            'Additive nature: If a user is Reader at Subscription scope and Contributor at Resource Group scope, their effective permission on that Resource Group is Contributor.',
            'Deny assignments take precedence over role assignments. Deny assignments cannot be created manually in the portal; they are created by Azure Blueprints or Azure Managed Applications.'
          ]
        },
        {
          heading: 'Core Built-In Roles vs Data Plane Roles',
          content: 'A classic exam trap is confusing control-plane (management) permissions with data-plane (content) permissions.',
          keyPoints: [
            'Owner: Full access to all resources + ability to delegate access to others (assign roles).',
            'Contributor: Full access to create and manage all resources, CANNOT delegate access to others.',
            'Reader: View existing resources only.',
            'User Access Administrator: Manage user access to Azure resources (assign roles), but does NOT grant contributor rights on VMs or storage data.',
            'Data-plane roles: "Storage Account Contributor" allows managing storage account keys, but does NOT allow reading blobs! To read blobs via Entra ID, you need "Storage Blob Data Reader" or "Storage Blob Data Contributor".'
          ]
        },
        {
          heading: 'Custom Roles Structure',
          content: 'When built-in roles do not meet specific needs, you create a custom role using JSON or Azure CLI/PowerShell.',
          keyPoints: [
            'Actions: Control plane operations (e.g. "Microsoft.Compute/virtualMachines/start/action").',
            'NotActions: Excluded from Actions. CRITICAL: NotActions is NOT a Deny rule! It simply subtracts strings from the Actions list.',
            'DataActions: Data plane operations (e.g. "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read").',
            'AssignableScopes: Array specifying where the role can be assigned (e.g. ["/subscriptions/sub-id-123"]). Cannot be a Resource scope.'
          ]
        }
      ],
      portalWalkthrough: {
        overview: 'Assigning a built-in role at the Resource Group scope and inspecting Effective Access.',
        steps: [
          {
            stepNumber: 1,
            title: 'Open Access Control (IAM)',
            portalPath: 'Resource Group > Access control (IAM) > + Add > Add role assignment',
            description: 'Choose the appropriate role from the catalog of Job function roles.',
            keyFields: [
              { name: 'Role', value: 'Virtual Machine Contributor', hint: 'Allows managing VMs, but cannot assign roles or manage the VNet they connect to' }
            ]
          },
          {
            stepNumber: 2,
            title: 'Select Members & Assignment Type',
            portalPath: 'Add role assignment > Members tab',
            description: 'Select User, Group, or Managed Identity.',
            keyFields: [
              { name: 'Assign access to', value: 'User, group, or service principal' },
              { name: 'Members', value: 'DevOps-Engineers (Security Group)', hint: 'Best practice is assigning roles to Groups, not individual users' }
            ]
          },
          {
            stepNumber: 3,
            title: 'Verify Effective Permissions',
            portalPath: 'Access control (IAM) > Check access tab',
            description: 'Enter a user name to calculate their inherited vs directly assigned permissions.',
            keyFields: [
              { name: 'Check access for', value: 'User, group, or service principal' }
            ]
          }
        ],
        interactiveBlade: {
          resourceName: 'Add Role Assignment',
          serviceCategory: 'Access Control (IAM)',
          icon: 'UserCheck',
          tabs: [
            {
              id: 'role',
              label: 'Role',
              fields: [
                {
                  id: 'selected-role',
                  label: 'Role to assign',
                  type: 'select',
                  currentValue: 'Contributor',
                  options: [
                    { label: 'Owner', value: 'Owner', description: 'Grants full access including role delegation' },
                    { label: 'Contributor', value: 'Contributor', description: 'Grants full access to manage resources, cannot assign roles', isExamTrap: true },
                    { label: 'Reader', value: 'Reader', description: 'View only' },
                    { label: 'User Access Administrator', value: 'User Access Administrator', description: 'Manage user access only' },
                    { label: 'Storage Blob Data Contributor', value: 'Storage Blob Data Contributor', description: 'Data plane blob read/write/delete' }
                  ],
                  examNote: 'Exam trap: Contributor CANNOT assign roles. Only Owner and User Access Administrator can.'
                }
              ]
            },
            {
              id: 'members',
              label: 'Members',
              fields: [
                {
                  id: 'assignee-type',
                  label: 'Assign access to',
                  type: 'radio',
                  currentValue: 'Group',
                  options: [
                    { label: 'User', value: 'User' },
                    { label: 'Group (Recommended)', value: 'Group' },
                    { label: 'Managed identity', value: 'Managed identity' }
                  ]
                }
              ]
            }
          ]
        }
      },
      examTraps: [
        {
          trapTitle: 'NotActions is NOT a Deny Assignment',
          scenario: 'A custom role has Actions: ["*"] and NotActions: ["Microsoft.Compute/virtualMachines/delete"]. The user is also assigned the built-in Contributor role.',
          whyItTricksPeople: 'People think NotActions denies VM deletion.',
          correctAnswerRule: 'NotActions simply does not grant the action. Because the user also has Contributor (which grants VM deletion), the permissions combine additively, and the user CAN delete the VM!'
        },
        {
          trapTitle: 'Storage Account Contributor vs Blob Data Reader',
          scenario: 'An admin gives a developer the "Storage Account Contributor" role, but the developer still gets 403 Forbidden when trying to view blobs in the portal.',
          whyItTricksPeople: 'People assume Contributor on a storage account allows viewing everything inside it.',
          correctAnswerRule: 'Storage Account Contributor only grants control plane rights (manage keys, network rules). To read blob contents using Entra credentials, you must assign "Storage Blob Data Reader" or "Storage Blob Data Contributor".'
        }
      ],
      keyNumbers: [
        { label: 'Max Role Assignments per Subscription', value: '4,000', context: 'Subscription-level role assignment limit' },
        { label: 'Custom Roles per Tenant', value: '5,000', context: 'Maximum number of custom RBAC definitions' }
      ],
      cliSnippets: [
        {
          title: 'Assign Contributor Role at Resource Group Scope',
          cli: 'az role assignment create --assignee "developer@contoso.com" --role "Contributor" --resource-group "rg-production"',
          powershell: 'New-AzRoleAssignment -SignInName "developer@contoso.com" -RoleDefinitionName "Contributor" -ResourceGroupName "rg-production"',
          explanation: 'Grants contributor rights scoped strictly to the specified resource group.'
        }
      ],
      quiz: [
        {
          id: 'q1-3',
          scenario: 'User A is assigned the "Reader" role at the Subscription level. User A is also assigned the "Contributor" role on a Resource Group named "RG1" inside that subscription. Can User A create a virtual machine inside RG1?',
          options: [
            'No, because Subscription Reader overrides Resource Group Contributor',
            'Yes, because permissions are additive and Contributor grants VM creation in RG1',
            'No, because User Access Administrator must approve it first',
            'Yes, but only if RG1 does not have any tags'
          ],
          correctAnswer: 1,
          explanation: 'Azure RBAC role assignments are additive. A broader Reader role at the subscription does not block a narrower Contributor role at the resource group level.',
          trapAlert: 'There is no concept of "deny by higher scope inheritance" in standard Azure RBAC.'
        }
      ]
    },
    {
      id: 'd1-governance-policy-locks',
      title: 'Azure Governance: Policy, Management Groups, Locks & Budgets',
      domainId: 'domain-1',
      weightLabel: 'High Yield',
      summary: 'Implementing enterprise guardrails with Azure Policy effects, Management Group hierarchies, CanNotDelete/ReadOnly resource locks, and cost management budgets.',
      coreConcepts: [
        {
          heading: 'Management Groups Hierarchy',
          content: 'Management groups provide a level of scope above subscriptions. Policies, RBAC, and budgets assigned at a parent management group automatically apply to all subscriptions nested underneath.',
          keyPoints: [
            'Root Management Group: Every directory has a single top-level Root Management Group (Tenant Root Group). All subscriptions roll up to it.',
            'Nesting limit: Management group trees can support up to 6 levels of depth (excluding root and subscriptions).',
            'A management group can contain multiple subscriptions and child management groups, but each subscription can have only ONE direct parent.'
          ]
        },
        {
          heading: 'Azure Policy Definitions & Effects',
          content: 'Azure Policy enforces organizational standards and assesses compliance at scale. Policy sets (Initiatives) group multiple definitions together.',
          keyPoints: [
            'Deny: Prevents the deployment or request if non-compliant (e.g. blocking VM creation without an approved SKU).',
            'Audit: Allows the deployment, but flags the resource as non-compliant in the compliance dashboard.',
            'Append: Adds required fields to the resource definition during creation (e.g. appending a specific tag if missing).',
            'Modify: Adds, updates, or removes properties and tags on existing or new resources (supports remediation tasks).',
            'DeployIfNotExists (DINE): Automatically deploys a dependent resource (like the Azure Monitor Agent or diagnostic settings) if it does not exist.'
          ]
        },
        {
          heading: 'Resource Locks: CanNotDelete vs ReadOnly',
          content: 'Locks prevent accidental deletion or modification of critical resources, regardless of who has Contributor or Owner permissions.',
          keyPoints: [
            'CanNotDelete (Delete lock): Authorized users can still read and modify the resource, but cannot delete it.',
            'ReadOnly (Read-only lock): Authorized users can only read the resource; they cannot modify properties or delete it.',
            'ReadOnly Lock Side Effect Trap: Putting a ReadOnly lock on a Resource Group containing a VM prevents users from STARTING or STOPPING that VM! Starting a VM writes dynamic state info to Azure, which the lock blocks.'
          ]
        },
        {
          heading: 'Tags & Tag Inheritance Truth',
          content: 'Tags are key-value metadata pairs used for cost allocation, resource grouping, and automation.',
          keyPoints: [
            'CRITICAL EXAM TRAP: Tags applied to a Resource Group are NEVER inherited automatically by child resources inside it!',
            'To enforce tag inheritance, you must assign an Azure Policy with the "Modify" or "Append" effect to copy tags from the resource group to its resources.'
          ]
        }
      ],
      portalWalkthrough: {
        overview: 'Assigning a "Require a tag on resources" policy and applying a CanNotDelete lock on a production resource group.',
        steps: [
          {
            stepNumber: 1,
            title: 'Assign an Azure Policy',
            portalPath: 'Azure Portal > Policy > Assignments > Assign policy',
            description: 'Select the scope and built-in policy definition.',
            keyFields: [
              { name: 'Scope', value: 'Subscription / Production RG' },
              { name: 'Policy definition', value: 'Require a tag on resources (Built-in)' },
              { name: 'Parameters > Tag name', value: 'CostCenter', hint: 'Resources deployed without this tag will be denied or audited' }
            ]
          },
          {
            stepNumber: 2,
            title: 'Add a Resource Lock',
            portalPath: 'Resource Group > Settings > Locks > + Add',
            description: 'Apply a protection lock to safeguard against accidental deletion.',
            keyFields: [
              { name: 'Lock name', value: 'Lock-DoNotDelete' },
              { name: 'Lock type', value: 'Delete (CanNotDelete)', hint: 'Allows changes and VM restarts, but blocks deletion' },
              { name: 'Notes', value: 'Production environment safeguard' }
            ]
          }
        ],
        interactiveBlade: {
          resourceName: 'Azure Policy Assignment Blade',
          serviceCategory: 'Azure Governance',
          icon: 'FileText',
          tabs: [
            {
              id: 'basics',
              label: 'Basics',
              fields: [
                {
                  id: 'policy-scope',
                  label: 'Scope',
                  type: 'text',
                  currentValue: '/subscriptions/sub-001/resourceGroups/rg-prod'
                },
                {
                  id: 'policy-effect',
                  label: 'Policy Enforcement',
                  type: 'radio',
                  currentValue: 'Enabled',
                  options: [
                    { label: 'Enabled', value: 'Enabled', description: 'Enforces Deny, Audit, or Modify rules' },
                    { label: 'Disabled', value: 'Disabled', description: 'Suspends enforcement without deleting assignment' }
                  ]
                }
              ]
            },
            {
              id: 'parameters',
              label: 'Parameters',
              fields: [
                {
                  id: 'tag-name-param',
                  label: 'Required Tag Name',
                  type: 'text',
                  currentValue: 'CostCenter',
                  helpText: 'Deployments lacking this tag key will be rejected if effect is Deny.'
                }
              ]
            }
          ]
        }
      },
      examTraps: [
        {
          trapTitle: 'Tags Are Never Inherited Automatically',
          scenario: 'An admin adds the tag "Department: Finance" to a Resource Group. Later, they view the cost breakdown of a VM created inside that group and notice the tag is missing.',
          whyItTricksPeople: 'Almost all users assume child resources inherit tags from their parent resource group like files in a folder.',
          correctAnswerRule: 'Resource Groups do NOT propagate tags down to resources. You must use an Azure Policy with a Modify/Append effect to automatically push tags to child resources.'
        },
        {
          trapTitle: 'Starting a VM Blocked by ReadOnly Lock',
          scenario: 'A user with the Owner role is trying to start a stopped (deallocated) VM in a Resource Group that has a ReadOnly lock. The start operation fails.',
          whyItTricksPeople: 'Starting a VM feels like "reading" or operational use, not modifying the hardware configuration.',
          correctAnswerRule: 'Starting a VM updates internal runtime state/properties and allocates a new compute host. A ReadOnly lock blocks this write request.'
        }
      ],
      keyNumbers: [
        { label: 'Management Group Tree Depth', value: '6 levels', context: 'Excluding root and subscriptions' },
        { label: 'Management Groups per Tenant', value: '10,000', context: 'Directory limit' },
        { label: 'Resource Lock Override', value: 'Cannot be bypassed', context: 'Even Subscription Owners must delete the lock first to perform blocked actions' }
      ],
      cliSnippets: [
        {
          title: 'Create a CanNotDelete Resource Lock via CLI',
          cli: 'az lock create --name "PreventDelete" --resource-group "rg-database" --lock-type CanNotDelete',
          powershell: 'New-AzResourceLock -LockName "PreventDelete" -ResourceGroupName "rg-database" -LockLevel CanNotDelete',
          explanation: 'Blocks deletion of the resource group and all resources inside it.'
        }
      ],
      quiz: [
        {
          id: 'q1-4',
          scenario: 'You have applied a "CanNotDelete" lock on a Resource Group that contains three virtual machines. An administrator needs to resize one of the VMs to a larger instance type. What will happen?',
          options: [
            'The resize will fail because all changes are blocked by the lock',
            'The resize will succeed because CanNotDelete locks permit modifications, only blocking deletion',
            'The lock must be deleted by a Global Administrator first',
            'The resize will fail unless the VM is in an Availability Zone'
          ],
          correctAnswer: 1,
          explanation: 'A CanNotDelete lock allows authorized users to read and modify resource configurations (like resizing a VM or attaching a disk); it only prevents the resource from being deleted.',
          trapAlert: 'Do not confuse CanNotDelete with ReadOnly. ReadOnly blocks resizing, but CanNotDelete permits it.'
        }
      ]
    }
  ]
};
