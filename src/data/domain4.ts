import type { DomainSection } from '../types';

export const domain4: DomainSection = {
  id: 'domain-4',
  number: 4,
  title: 'Implement and Manage Virtual Networking',
  weight: '15–20%',
  weightRange: [15, 20],
  color: 'from-purple-600 to-indigo-500',
  badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  accentBorder: 'border-purple-500/40',
  iconName: 'Network',
  description: 'Design Azure Virtual Networks, engineer non-transitive peering and custom User-Defined Routes (UDR), configure NSGs, ASGs, and Azure Bastion, deploy Private Endpoints, and implement high-availability Azure Load Balancers.',
  topics: [
    {
      id: 'd4-vnets-peering-udr',
      title: 'VNets, Subnets (5 Reserved IPs), Peering & Route Tables (UDR)',
      domainId: 'domain-4',
      weightLabel: 'High Yield',
      summary: 'Virtual network CIDR sizing, calculating usable IP addresses, non-transitive peering topologies, Gateway Transit, and User-Defined Routes (UDR).',
      coreConcepts: [
        {
          heading: 'VNet Subnets & The 5 Azure Reserved IP Addresses',
          content: 'Azure reserves the first four and the last IP address in EVERY subnet. When calculating host capacity for subnets, you must always subtract 5 from the total IPs available in the CIDR block.',
          diagramType: 'hub-spoke',
          keyPoints: [
            '.0: Network address (reserved by TCP/IP standard).',
            '.1: Default Gateway assigned by Azure.',
            '.2 and .3: Azure DNS mapping IPs (to map Azure DNS IPs to the VNet space).',
            '.255 (or last IP in subnet): Broadcast address.',
            'Formula: Usable IPs = (2^(32 - prefix)) - 5. For example, a /24 has 256 - 5 = 251 usable IPs. A /28 has 16 - 5 = 11 usable IPs. A /29 has 8 - 5 = 3 usable IPs.'
          ]
        },
        {
          heading: 'Virtual Network Peering & Non-Transitivity',
          content: 'Peering connects two Azure virtual networks over the private Microsoft backbone network with ultra-low latency.',
          keyPoints: [
            'Non-Transitive Nature: Peering is NOT transitive! If VNet A is peered with VNet B (Hub), and VNet B is peered with VNet C, VNet A CANNOT communicate with VNet C directly.',
            'To allow VNet A to reach VNet C: You must deploy a Network Virtual Appliance (NVA) / Azure Firewall in VNet B, and configure User-Defined Routes (UDR) in VNet A and C pointing to the NVA IP.',
            'Gateway Transit: Allows spoke VNets to share a VPN or ExpressRoute gateway in the hub VNet (configure "Allow gateway transit" on Hub and "Use remote gateways" on Spoke).'
          ]
        },
        {
          heading: 'User-Defined Routes (UDR) & Route Selection',
          content: 'Azure creates default system routes for every subnet (Local VNet, Internet, None). Custom Route Tables override default routing.',
          keyPoints: [
            'Next Hop Types: "Virtual appliance" (IP of firewall/router), "Virtual network gateway", "Virtual network", "Internet", "None" (drops/blackholes traffic).',
            'Route Selection Rule: Longest prefix match (most specific subnet mask wins). If there is a route for 10.0.0.0/16 pointing to VNet and a UDR for 10.0.1.0/24 pointing to Virtual Appliance, traffic to 10.0.1.50 matches the /24 and goes to the Virtual Appliance.'
          ]
        }
      ],
      portalWalkthrough: {
        overview: 'Creating a custom Route Table with a Next Hop pointing to an NVA and associating it with a subnet.',
        steps: [
          {
            stepNumber: 1,
            title: 'Create Route Table',
            portalPath: 'Azure Portal > Route tables > + Create',
            description: 'Name the route table and select region.',
            keyFields: [
              { name: 'Name', value: 'rt-spoke-to-hub' },
              { name: 'Resource group', value: 'rg-networking' }
            ]
          },
          {
            stepNumber: 2,
            title: 'Add User-Defined Route',
            portalPath: 'Route table > Settings > Routes > + Add',
            description: 'Direct all traffic heading to the other spoke through the firewall.',
            keyFields: [
              { name: 'Route name', value: 'Route-To-Spoke-2' },
              { name: 'Destination type', value: 'IP Addresses' },
              { name: 'Destination IP addresses/CIDR', value: '10.2.0.0/16' },
              { name: 'Next hop type', value: 'Virtual appliance' },
              { name: 'Next hop address', value: '10.0.1.4 (Firewall private IP)' }
            ]
          },
          {
            stepNumber: 3,
            title: 'Associate Route Table to Subnet',
            portalPath: 'Route table > Subnets > + Associate',
            description: 'Bind the route table to the target spoke subnet.',
            keyFields: [
              { name: 'Virtual network', value: 'vnet-spoke-1' },
              { name: 'Subnet', value: 'subnet-workload' }
            ]
          }
        ],
        interactiveBlade: {
          resourceName: 'Add Route Blade',
          serviceCategory: 'Virtual Networks',
          icon: 'Route',
          tabs: [
            {
              id: 'route-config',
              label: 'Route Settings',
              fields: [
                {
                  id: 'destination-cidr',
                  label: 'Destination IP addresses/CIDR ranges',
                  type: 'text',
                  currentValue: '10.2.0.0/16',
                  helpText: 'Target address space to intercept.'
                },
                {
                  id: 'next-hop-type',
                  label: 'Next hop type',
                  type: 'select',
                  currentValue: 'Virtual appliance',
                  options: [
                    { label: 'Virtual appliance', value: 'Virtual appliance', description: 'Firewall or router private IP' },
                    { label: 'Virtual network gateway', value: 'Virtual network gateway', description: 'VPN or ExpressRoute' },
                    { label: 'None', value: 'None', description: 'Drops/blackholes matching packets' },
                    { label: 'Internet', value: 'Internet', description: 'Forces direct public outbound' }
                  ]
                },
                {
                  id: 'next-hop-ip',
                  label: 'Next hop IP address',
                  type: 'text',
                  currentValue: '10.0.1.4'
                }
              ]
            }
          ]
        }
      },
      examTraps: [
        {
          trapTitle: 'Subnet Usable IP Calculation Trap',
          scenario: 'A company needs to deploy 12 virtual machines into a dedicated subnet. An engineer proposes creating a /28 subnet (16 IPs).',
          whyItTricksPeople: '16 sounds like plenty for 12 VMs (16 - 12 = 4 left over).',
          correctAnswerRule: 'Azure reserves 5 IPs in EVERY subnet. A /28 has 16 - 5 = 11 usable IPs! It cannot host 12 VMs. You must use at least a /27 (32 - 5 = 27 usable IPs).'
        },
        {
          trapTitle: 'VNet Peering is Non-Transitive',
          scenario: 'VNet 1 is peered with VNet 2. VNet 2 is peered with VNet 3. VMs in VNet 1 cannot ping VMs in VNet 3.',
          whyItTricksPeople: 'In standard physical switching, transitive routing is often automatic.',
          correctAnswerRule: 'Azure VNet peering is strictly non-transitive. Traffic cannot pass through VNet 2 without an explicit NVA/Router and UDRs in place.'
        }
      ],
      keyNumbers: [
        { label: 'Azure Reserved IPs per Subnet', value: '5 IPs', context: '.0, .1, .2, .3, and .255' },
        { label: 'Minimum Subnet Mask', value: '/29 (3 usable IPs)', context: 'Smallest subnet allowed in Azure' },
        { label: 'Maximum Subnet Mask', value: '/8', context: 'Largest single address block' }
      ],
      cliSnippets: [
        {
          title: 'Create VNet Peering via Azure CLI',
          cli: 'az network vnet peering create --name "peering-hub-to-spoke1" --resource-group "rg-net" --vnet-name "vnet-hub" --remote-vnet "/subscriptions/.../vnet-spoke1" --allow-vnet-access --allow-forwarded-traffic',
          powershell: 'Add-AzVirtualNetworkPeering -Name "peering-hub-to-spoke1" -VirtualNetwork $hubVnet -RemoteVirtualNetworkId $spokeVnet.Id',
          explanation: 'Establishes bidirectional peering between hub and spoke virtual networks.'
        }
      ],
      quiz: [
        {
          id: 'q4-1',
          scenario: 'You need to create a subnet that will host exactly 25 virtual machines. You must minimize the number of unused IP addresses while ensuring all 25 VMs can be assigned IP addresses. What subnet mask should you choose?',
          options: [
            '/28',
            '/27',
            '/26',
            '/25'
          ],
          correctAnswer: 1,
          explanation: 'A /28 has 16 total IPs minus 5 reserved = 11 usable (not enough). A /27 has 32 total IPs minus 5 reserved = 27 usable (fits 25 VMs with minimal waste).',
          trapAlert: 'Always remember the 5 reserved IPs rule!'
        },
        {
          id: 'q4-2',
          scenario: 'VNet A is peered with VNet B. VNet B has a VPN Gateway connected to an on-premises datacenter. You want virtual machines in VNet A to connect to the on-premises datacenter through the VPN Gateway in VNet B. Which two settings must you configure on the peerings?',
          options: [
            'On VNet A peering: Enable "Allow gateway transit". On VNet B peering: Enable "Use remote gateways".',
            'On VNet B peering: Enable "Allow gateway transit". On VNet A peering: Enable "Use remote gateways".',
            'Enable Service Endpoints on both VNets',
            'Deploy Azure Bastion in VNet A'
          ],
          correctAnswer: 1,
          explanation: 'The hub VNet (VNet B) hosts the gateway and must allow others to use it ("Allow gateway transit"). The spoke VNet (VNet A) must be instructed to use that gateway ("Use remote gateways").',
          trapAlert: 'Reversing these two options is one of the most common mistakes on the AZ-104.'
        }
      ]
    },
    {
      id: 'd4-nsg-asg-bastion-private-endpoints',
      title: 'NSGs, ASGs, Azure Bastion & Private Endpoints',
      domainId: 'domain-4',
      weightLabel: 'High Yield',
      summary: 'Network Security Group rule evaluation order (100–4096), Application Security Groups (ASGs), Azure Bastion secure connectivity, and Private Endpoints vs Service Endpoints.',
      coreConcepts: [
        {
          heading: 'NSG Rule Priority & Evaluation Flow',
          content: 'Network Security Groups filter network traffic to and from Azure resources. Rules are evaluated sequentially by priority number.',
          diagramType: 'nsg-flow',
          keyPoints: [
            'Priority Range: 100 to 4096. Lower numbers have higher priority (evaluated first). Once a match is found, evaluation stops.',
            'Default Inbound Rules: 65000 (AllowVNetInBound), 65001 (AllowAzureLoadBalancerInBound), 65500 (DenyAllInBound).',
            'Default Outbound Rules: 65000 (AllowVNetOutBound), 65001 (AllowInternetOutBound), 65500 (DenyAllOutBound).',
            'Inbound Processing Flow: Subnet NSG is processed FIRST, then NIC NSG is processed. If traffic is allowed by Subnet NSG but denied by NIC NSG, it is BLOCKED.',
            'Outbound Processing Flow: NIC NSG is processed FIRST, then Subnet NSG.'
          ]
        },
        {
          heading: 'Application Security Groups (ASGs)',
          content: 'ASGs group virtual machine network interfaces logically without requiring static IP addresses in NSG rules.',
          keyPoints: [
            'Simplifies security rules: Instead of maintaining 20 IP addresses in an NSG, assign all web NICs to "ASG-Web" and create a single rule: Source: ASG-Web -> Destination: ASG-DB -> Port 1433 -> Allow.',
            'Constraint: All NICs assigned to an ASG must belong to the same Virtual Network.'
          ]
        },
        {
          heading: 'Azure Bastion',
          content: 'Provides secure, seamless RDP and SSH connectivity directly through the Azure Portal in your browser over TLS (port 443) without exposing public IPs on your VMs.',
          keyPoints: [
            'Subnet Name Requirement: MUST be deployed in a dedicated subnet named EXACTLY "AzureBastionSubnet".',
            'Subnet Prefix: Must be a /26 or larger (/25, /24).',
            'Cannot associate Route Tables with 0.0.0.0/0 to Virtual Appliance on AzureBastionSubnet; Bastion requires direct Internet outbound.'
          ]
        },
        {
          heading: 'Service Endpoints vs Private Endpoints (Private Link)',
          content: 'A cornerstone exam comparison between securing PaaS traffic.',
          keyPoints: [
            'Service Endpoints: Keeps traffic on the Microsoft backbone, but the PaaS service (e.g. Storage) STILL retains its public IP address. Storage firewall restricts access to specific VNet subnets.',
            'Private Endpoints (Most Secure): Allocates a private network interface (NIC) with a private IP from YOUR subnet directly to the PaaS resource. Completely eliminates the need for public IP access. Integrates with Private DNS Zones.',
            'Private DNS Zone integration: Storage account privatelink endpoint resolves to "privatelink.blob.core.windows.net". A private DNS zone linked to the VNet maps this to the private IP (e.g. 10.0.2.5).'
          ]
        },
        {
          heading: 'Virtual Network NAT (Azure NAT Gateway)',
          content: 'Provides outbound-only internet connectivity for virtual network subnets.',
          keyPoints: [
            'Outbound SNAT: All VMs in the subnet share one or more static public IP addresses or public IP prefixes for outbound traffic.',
            'Prevents SNAT Port Exhaustion: Efficiently manages connection pools without allocating individual public IPs to VMs.',
            'Inbound Traffic: NAT Gateway is strictly outbound-only; it does NOT accept unsolicited inbound traffic from the internet.',
            'Association: Associated at the subnet level. Coexists with NSGs.'
          ]
        },
        {
          heading: 'Hybrid Connectivity: Azure VPN Gateway & ExpressRoute',
          content: 'Connecting on-premises networks to Azure virtual networks.',
          keyPoints: [
            'Point-to-Site (P2S) VPN: Connects individual remote client machines (OpenVPN, IKEv2, or SSTP) authenticated via Microsoft Entra ID, certificates, or RADIUS.',
            'Site-to-Site (S2S) VPN: Connects an on-premises branch office or datacenter over an IPsec/IKE VPN tunnel traversing the public Internet (requires GatewaySubnet and Local Network Gateway).',
            'ExpressRoute: A dedicated, private, high-speed connection through a third-party connectivity provider. Traffic does NOT traverse the public Internet. Lowest latency and highest SLA.'
          ]
        }
      ],
      portalWalkthrough: {
        overview: 'Creating an NSG rule utilizing an Application Security Group (ASG) and deploying Azure Bastion.',
        steps: [
          {
            stepNumber: 1,
            title: 'Create Application Security Group',
            portalPath: 'Azure Portal > Application security groups > + Create',
            description: 'Create ASG-WebServers and ASG-DatabaseServers.',
            keyFields: [
              { name: 'Name', value: 'ASG-WebServers' },
              { name: 'Resource group', value: 'rg-networking' }
            ]
          },
          {
            stepNumber: 2,
            title: 'Add Inbound NSG Rule using ASG',
            portalPath: 'Network security group > Inbound security rules > + Add',
            description: 'Allow HTTPS traffic from any source to the Web ASG.',
            keyFields: [
              { name: 'Source', value: 'Any' },
              { name: 'Destination', value: 'Application security group' },
              { name: 'Destination application security group', value: 'ASG-WebServers' },
              { name: 'Destination port ranges', value: '443' },
              { name: 'Action', value: 'Allow' },
              { name: 'Priority', value: '200' }
            ]
          }
        ],
        interactiveBlade: {
          resourceName: 'Add Inbound Security Rule Blade',
          serviceCategory: 'Network Security',
          icon: 'ShieldAlert',
          tabs: [
            {
              id: 'rule-definition',
              label: 'Rule Definition',
              fields: [
                {
                  id: 'destination-type',
                  label: 'Destination',
                  type: 'select',
                  currentValue: 'Application security group',
                  options: [
                    { label: 'Any', value: 'Any' },
                    { label: 'IP Addresses', value: 'IP' },
                    { label: 'Application security group', value: 'ASG', description: 'Group NICs dynamically' },
                    { label: 'Service Tag', value: 'ServiceTag' }
                  ]
                },
                {
                  id: 'rule-priority',
                  label: 'Priority (100-4096)',
                  type: 'text',
                  currentValue: '150',
                  helpText: 'Evaluated in order of priority; lower numbers first.'
                },
                {
                  id: 'rule-action',
                  label: 'Action',
                  type: 'radio',
                  currentValue: 'Allow',
                  options: [
                    { label: 'Allow', value: 'Allow' },
                    { label: 'Deny', value: 'Deny' }
                  ]
                }
              ]
            }
          ]
        }
      },
      examTraps: [
        {
          trapTitle: 'Subnet NSG vs NIC NSG Evaluation Conflict',
          scenario: 'Traffic is allowed on port 80 in the Subnet NSG (Priority 100), but the VM network interface (NIC) has an NSG with a rule denying port 80 (Priority 200).',
          whyItTricksPeople: 'People think if the subnet allows it, the VM will receive it.',
          correctAnswerRule: 'On inbound traffic, both Subnet NSG AND NIC NSG must allow the traffic. If either denies it, the packet is dropped.'
        },
        {
          trapTitle: 'AzureBastionSubnet Name and Sizing Requirements',
          scenario: 'An admin tries to deploy Azure Bastion into a subnet named "BastionSubnet" with a /28 mask.',
          whyItTricksPeople: 'Any subnet name usually works for Azure services.',
          correctAnswerRule: 'Azure Bastion strictly requires the subnet name to be EXACTLY "AzureBastionSubnet" and the prefix to be at least /26 (minimum 64 IPs).'
        }
      ],
      keyNumbers: [
        { label: 'NSG Priority Range', value: '100 to 4096', context: 'Lower number = higher priority' },
        { label: 'Default Deny Rule Priority', value: '65500', context: 'DenyAllInBound and DenyAllOutBound' },
        { label: 'Bastion Subnet Requirement', value: 'AzureBastionSubnet (/26 min)', context: 'Exact name required' }
      ],
      cliSnippets: [
        {
          title: 'Create NSG Inbound Rule via CLI',
          cli: 'az network nsg rule create --resource-group "rg-net" --nsg-name "nsg-web" --name "Allow-HTTPS" --priority 150 --direction Inbound --access Allow --protocol Tcp --destination-port-ranges 443',
          powershell: 'Add-AzNetworkSecurityRuleConfig -NetworkSecurityGroup $nsg -Name "Allow-HTTPS" -Priority 150 -Direction Inbound -Access Allow -Protocol Tcp -DestinationPortRange 443',
          explanation: 'Creates a high-priority inbound rule allowing HTTPS traffic.'
        }
      ],
      quiz: [
        {
          id: 'q4-3',
          scenario: 'You have a virtual machine connected to Subnet A. Subnet A has an associated NSG with an inbound rule of Priority 100 allowing port 3389 (RDP). The VM network interface has an associated NSG with an inbound rule of Priority 120 denying port 3389. Can an administrator establish an RDP connection to the VM?',
          options: [
            'Yes, because Subnet NSG has a lower priority number (100) and was evaluated first',
            'No, because the NIC NSG rule denies port 3389 and inbound traffic must pass both NSGs',
            'Yes, if the administrator uses Azure Bastion',
            'No, because RDP is permanently disabled in Azure'
          ],
          correctAnswer: 1,
          explanation: 'For inbound traffic, the packet must be permitted by the Subnet NSG AND by the NIC NSG. Although the Subnet NSG allows it, the NIC NSG denies it, so the connection is rejected.',
          trapAlert: 'Lower priority number does not span across different NSGs. Subnet rules and NIC rules are evaluated sequentially in separate evaluation phases.'
        }
      ]
    },
    {
      id: 'd4-dns-load-balancers',
      title: 'Azure DNS, Load Balancers & Azure Front Door Decision Matrix',
      domainId: 'domain-4',
      weightLabel: 'High Yield',
      summary: 'Public/Private DNS zones with auto-registration, Layer 4 Azure Load Balancer, and the high-yield 4-way decision matrix: Azure Load Balancer vs Application Gateway vs Azure Front Door vs Traffic Manager.',
      coreConcepts: [
        {
          heading: 'Azure Private DNS Zones & Auto-Registration',
          content: 'Provides name resolution for VMs within and between virtual networks without custom DNS servers.',
          keyPoints: [
            'Virtual Network Link: Connects a private DNS zone (e.g. corp.internal) to a virtual network.',
            'Auto-Registration: When enabled on a link, Azure automatically registers and updates DNS host records (A records) for VMs deployed in that VNet. Each private zone can support auto-registration for up to 100 linked VNets.'
          ]
        },
        {
          heading: 'The 4 Azure Load Balancing Services: Decision Matrix',
          content: 'One of the most frequently tested architecture scenarios on the AZ-104 is knowing which load balancer to select based on protocol (HTTP vs TCP/UDP) and scope (Regional vs Global).',
          diagramType: 'load-balancer-matrix',
          keyPoints: [
            'Regional + Non-HTTP (TCP/UDP) = Azure Load Balancer: Operates at Layer 4. Ultra-high throughput, private VNet or public IP. No SSL termination.',
            'Regional + HTTP/HTTPS = Azure Application Gateway: Operates at Layer 7. Dedicated subnet in VNet. URL path routing (/images vs /api), SSL offloading, cookie affinity, and Web Application Firewall (WAF).',
            'Global + Non-HTTP / Any Protocol = Azure Traffic Manager: Operates at the DNS level. Resolves DNS requests to the closest or primary regional IP. Does NOT proxy traffic, cannot terminate SSL, and cannot inspect HTTP.',
            'Global + HTTP/HTTPS = Azure Front Door: Operates at Layer 7 using Microsoft global Anycast edge network. Terminates SSL at the edge, provides global path-based routing, instant cross-region failover, and CDN caching.'
          ]
        },
        {
          heading: 'Azure Front Door vs Azure Traffic Manager Deep-Dive',
          content: 'Candidates constantly confuse Front Door and Traffic Manager on global multi-region questions.',
          keyPoints: [
            'Azure Front Door is a REVERSE PROXY: Traffic enters Microsoft\'s global edge PoPs. It terminates TLS/SSL right at the edge near the user, inspects HTTP headers, accelerates dynamic content, and routes to backend regions.',
            'Azure Traffic Manager is a DNS ROUTER: It only returns an IP address during DNS lookup. The client connects directly to the backend IP. It does NOT see or touch the payload, cannot inspect HTTP requests, and cannot do SSL offloading.',
            'Instant Failover: Front Door detects unhealthy backends and instantly routes packets elsewhere. Traffic Manager failover is delayed by DNS caching / TTL on client resolvers.'
          ]
        },
        {
          heading: 'Azure Load Balancer Configuration Details',
          content: 'Distributes incoming TCP/UDP traffic across backend healthy VM instances.',
          keyPoints: [
            'Types: Public Load Balancer (inbound internet traffic) vs Internal Load Balancer (private VNet IP).',
            'Components: Frontend IP, Backend pools (VM NICs), Health probes (TCP, HTTP, HTTPS), Load balancing rules, Inbound NAT rules (port forwarding direct to specific VM).',
            'Session Persistence Modes: None (5-tuple: Source IP, Source Port, Destination IP, Destination Port, Protocol), Client IP (2-tuple: Source IP, Destination IP), Client IP and protocol (3-tuple).'
          ]
        }
      ],
      portalWalkthrough: {
        overview: 'Configuring Azure Load Balancer rules and configuring an Azure Front Door / Application Gateway routing rule.',
        steps: [
          {
            stepNumber: 1,
            title: 'Create Internal Load Balancer',
            portalPath: 'Azure Portal > Load balancers > + Create',
            description: 'Select type "Internal" and assign a private subnet IP.',
            keyFields: [
              { name: 'Type', value: 'Internal' },
              { name: 'SKU', value: 'Standard' },
              { name: 'Virtual network & Subnet', value: 'vnet-hub / subnet-frontend' }
            ]
          },
          {
            stepNumber: 2,
            title: 'Configure Health Probe & Rule',
            portalPath: 'Load balancer > Health probes > + Add',
            description: 'Define probe port and consecutive failure threshold.',
            keyFields: [
              { name: 'Protocol', value: 'TCP' },
              { name: 'Port', value: '80' },
              { name: 'Interval', value: '5 seconds' },
              { name: 'Unhealthy threshold', value: '2 consecutive failures' }
            ]
          },
          {
            stepNumber: 3,
            title: 'Configure Azure Front Door Profile',
            portalPath: 'Azure Portal > Front Door and CDN profiles > + Create',
            description: 'Configure global Layer 7 endpoint and origin groups.',
            keyFields: [
              { name: 'Tier', value: 'Standard or Premium (WAF + Private Link)' },
              { name: 'Origin type', value: 'App Service / Custom origin' },
              { name: 'Routing rule', value: 'Match /* -> Forward to Origin Group' }
            ]
          }
        ],
        interactiveBlade: {
          resourceName: 'Load Balancer & Front Door Blade',
          serviceCategory: 'Networking',
          icon: 'Shuffle',
          tabs: [
            {
              id: 'lb-rules',
              label: 'Load Balancer Rules',
              fields: [
                {
                  id: 'lb-session-persistence',
                  label: 'Session persistence',
                  type: 'select',
                  currentValue: 'Client IP (2-tuple)',
                  options: [
                    { label: 'None (5-tuple)', value: 'None', description: 'Successive requests routed to any healthy instance' },
                    { label: 'Client IP (2-tuple)', value: 'Client IP', description: 'Requests from same client IP go to same backend VM' },
                    { label: 'Client IP and protocol (3-tuple)', value: 'Client IP and protocol' }
                  ]
                }
              ]
            },
            {
              id: 'service-selection',
              label: 'Service Selection Wizard',
              fields: [
                {
                  id: 'routing-scope',
                  label: 'Routing Scope & Protocol Requirement',
                  type: 'select',
                  currentValue: 'front-door',
                  options: [
                    { label: 'Global + HTTP/HTTPS with SSL offload (Azure Front Door)', value: 'front-door', description: 'Global Anycast Layer 7 reverse proxy' },
                    { label: 'Global + Non-HTTP or DNS-only (Azure Traffic Manager)', value: 'traffic-manager', description: 'DNS resolution only, no SSL termination' },
                    { label: 'Regional + HTTP/HTTPS with URL path routing (Application Gateway)', value: 'app-gateway', description: 'VNet subnet Layer 7 proxy with cookie affinity' },
                    { label: 'Regional + TCP/UDP ultra-low latency (Azure Load Balancer)', value: 'azure-lb', description: 'Layer 4 transport level load balancer' }
                  ],
                  examNote: 'Classic AZ-104 question pattern: match requirements (Global vs Regional, Layer 4 vs Layer 7) to the correct service.'
                }
              ]
            }
          ]
        }
      },
      examTraps: [
        {
          trapTitle: 'Front Door vs Traffic Manager: SSL Offloading',
          scenario: 'A company has web apps in East US and West Europe. They need global load balancing, SSL/TLS termination at the edge, and WAF protection. An architect suggests Azure Traffic Manager.',
          whyItTricksPeople: 'Traffic Manager is a well-known global routing tool, so people assume it can handle web application security.',
          correctAnswerRule: 'Traffic Manager only does DNS lookups. It CANNOT terminate SSL or inspect HTTP headers. You MUST choose Azure Front Door for global HTTP/HTTPS with edge SSL offload and WAF.'
        },
        {
          trapTitle: 'Load Balancer Cannot Inspect URL Paths',
          scenario: 'A scenario asks you to route traffic destined for "contoso.com/images/*" to Pool 1 and "contoso.com/video/*" to Pool 2 using an Azure Load Balancer.',
          whyItTricksPeople: 'People see "load balance traffic across pools" and assume Azure Load Balancer handles it.',
          correctAnswerRule: 'Azure Load Balancer is strictly Layer 4. URL path-based routing requires an Application Gateway (Regional) or Azure Front Door (Global).'
        },
        {
          trapTitle: 'Application Gateway is Regional, Not Global',
          scenario: 'A company wants to use Application Gateway to load balance users between an Azure region in North America and an Azure region in Asia.',
          whyItTricksPeople: 'Application Gateway has rich Layer 7 features like WAF and URL routing.',
          correctAnswerRule: 'Application Gateway is deployed inside a specific Virtual Network subnet in ONE region. For global cross-region Layer 7 load balancing, use Azure Front Door.'
        }
      ],
      keyNumbers: [
        { label: 'Health Probe Default Interval', value: '5 seconds', context: 'Time between probe attempts' },
        { label: 'Health Probe Unhealthy Threshold', value: '2 failures', context: 'Instance removed from pool' },
        { label: 'Azure Front Door PoPs', value: '190+ edge locations', context: 'Anycast edge locations globally' }
      ],
      cliSnippets: [
        {
          title: 'Create Load Balancer Health Probe via CLI',
          cli: 'az network lb probe create --resource-group "rg-net" --lb-name "lb-internal" --name "hp-http" --protocol Tcp --port 80 --interval 5 --threshold 2',
          explanation: 'Creates a health probe monitoring TCP port 80.'
        },
        {
          title: 'Create Azure Front Door Profile via CLI',
          cli: 'az afd profile create --resource-group "rg-net" --profile-name "afd-global-prod" --sku "Standard_AzureFrontDoor"',
          powershell: 'New-AzFrontDoorCdnProfile -ResourceGroupName "rg-net" -Name "afd-global-prod" -SkuName "Standard_AzureFrontDoor" -Location "Global"',
          explanation: 'Provisions an Azure Front Door global profile.'
        }
      ],
      quiz: [
        {
          id: 'q4-4',
          scenario: 'You need to configure an Azure Load Balancer rule so that all requests from the same client workstation are routed to the same backend virtual machine for the duration of a user session. Which session persistence setting should you select?',
          options: [
            'None',
            'Client IP',
            'Cookie-based affinity',
            'Header rewrite'
          ],
          correctAnswer: 1,
          explanation: 'Setting Session Persistence to "Client IP" (2-tuple) ensures that all successive requests from the same client IP address are directed to the same backend instance.',
          trapAlert: 'Cookie-based affinity is an Application Gateway (Layer 7) feature, not an Azure Load Balancer (Layer 4) feature.'
        },
        {
          id: 'q4-5',
          scenario: 'Your company hosts web applications across two Azure regions: East US and North Europe. You need to implement a global load balancing solution that provides SSL/TLS offloading at Microsoft\'s edge, URL path-based routing, and instant cross-region failover. Which service should you deploy?',
          options: [
            'Azure Traffic Manager',
            'Azure Front Door',
            'Azure Load Balancer (Standard)',
            'Azure Application Gateway'
          ],
          correctAnswer: 1,
          explanation: 'Azure Front Door is a global Layer 7 reverse proxy that terminates SSL/TLS at the edge (PoP), supports URL path routing, and provides instant failover between regions.',
          trapAlert: 'Traffic Manager cannot terminate SSL (it is DNS only). Application Gateway is regional, not global.'
        },
        {
          id: 'q4-6',
          scenario: 'You need to distribute traffic across a pool of virtual machines in a single Azure region based on the request URL path (routing /images/* to VM Pool 1 and /api/* to VM Pool 2) with cookie-based session affinity. Which service should you choose?',
          options: [
            'Azure Load Balancer',
            'Azure Application Gateway',
            'Azure Traffic Manager',
            'Azure Network Watcher'
          ],
          correctAnswer: 1,
          explanation: 'Azure Application Gateway is a regional Layer 7 load balancer that supports URL path-based routing, cookie-based session affinity, and SSL termination.',
          trapAlert: 'Azure Load Balancer operates at Layer 4 and cannot inspect URL paths or cookies.'
        }
      ]
    }
  ]
};
