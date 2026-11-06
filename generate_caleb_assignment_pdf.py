import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, KeepTogether, HRFlowable
)
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.pdfgen import canvas
from reportlab.lib import colors

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber > 1:
            self.saveState()
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#555555"))
            
            # Running Header
            self.drawString(54, 800, "COMPUTER NETWORKING ASSIGNMENT | CALEB JOSEPH")
            self.drawRightString(541.28, 800, "SUBNETTING & INTER-SUBNET ROUTING")
            self.setStrokeColor(colors.HexColor("#CCCCCC"))
            self.setLineWidth(0.6)
            self.line(54, 794, 541.28, 794)

            # Running Footer
            self.line(54, 46, 541.28, 46)
            self.drawString(54, 34, "Cisco Packet Tracer Implementation & OSI Model Analysis")
            self.drawRightString(541.28, 34, f"Page {self._pageNumber} of {page_count}")
            self.restoreState()

def build_assignment_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=50,
        rightMargin=50,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#0D233A"),
        spaceAfter=10
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#2C3E50"),
        spaceAfter=25
    )

    h1_style = ParagraphStyle(
        'AcademicH1',
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        alignment=TA_LEFT,
        textColor=colors.HexColor("#0D233A"),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'AcademicH2',
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        alignment=TA_LEFT,
        textColor=colors.HexColor("#1A5276"),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'AcademicBody',
        fontName='Times-Roman',
        fontSize=10,
        leading=14,
        alignment=TA_JUSTIFY,
        spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        'AcademicBullet',
        fontName='Times-Roman',
        fontSize=10,
        leading=13.5,
        alignment=TA_JUSTIFY,
        leftIndent=15,
        spaceAfter=3
    )

    code_style = ParagraphStyle(
        'AcademicCode',
        fontName='Courier',
        fontSize=8,
        leading=10.5,
        textColor=colors.HexColor("#222222"),
        spaceAfter=2
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        alignment=TA_CENTER,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        fontName='Helvetica',
        fontSize=8,
        leading=10.5,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#2C3E50")
    )

    table_cell_left = ParagraphStyle(
        'TableCellLeft',
        fontName='Helvetica',
        fontSize=8,
        leading=10.5,
        alignment=TA_LEFT,
        textColor=colors.HexColor("#2C3E50")
    )

    cover_meta_label = ParagraphStyle(
        'CoverMetaLabel',
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        alignment=TA_LEFT,
        textColor=colors.HexColor("#1B2631")
    )

    cover_meta_val = ParagraphStyle(
        'CoverMetaVal',
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        alignment=TA_LEFT,
        textColor=colors.HexColor("#2C3E50")
    )

    story = []

    # ==========================================
    # COVER / TITLE BLOCK
    # ==========================================
    story.append(Spacer(1, 15))
    story.append(Paragraph("COMPUTER NETWORKING LABORATORY REPORT", title_style))
    story.append(Paragraph("Design, Subnetting, Packet Isolation, Inter-Subnet Routing &amp; OSI Packet Flow", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#0D233A"), spaceAfter=15))

    # Student metadata box
    meta_data = [
        [Paragraph("STUDENT NAME:", cover_meta_label), Paragraph("<b>CALEB JOSEPH</b>", cover_meta_val)],
        [Paragraph("ASSIGNED ALLOCATION:", cover_meta_label), Paragraph("<b>ICT: 7 Nodes | SALES: 7 Nodes | ADMIN: 7 Nodes</b>", cover_meta_val)],
        [Paragraph("BASE IP NETWORK:", cover_meta_label), Paragraph("<b>10.10.10.0/24</b>", cover_meta_val)],
        [Paragraph("ADDITIONAL NETWORK (REQ 4):", cover_meta_label), Paragraph("<b>192.1.1.0/24 (4 Nodes)</b>", cover_meta_val)],
        [Paragraph("SIMULATION ENVIRONMENT:", cover_meta_label), Paragraph("Cisco Packet Tracer 9.0.1 (Windows)", cover_meta_val)],
        [Paragraph("TOTAL MARKS / DATE:", cover_meta_label), Paragraph("40 Marks | First Week of November, 2026", cover_meta_val)]
    ]
    meta_table = Table(meta_data, colWidths=[180, 310])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F2F4F4")),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#BDC3C7")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#EAEDED")),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 15))

    # ==========================================
    # REQUIREMENT 1 & 2: SUBNETTING DESIGN & CALCULATION
    # ==========================================
    story.append(Paragraph("1. Mathematical Subnetting &amp; Address Allocation (Req. 1 &amp; 2)", h1_style))
    story.append(Paragraph(
        "The assignment designates the base network <b>10.10.10.0/24</b> for Caleb Joseph, partitioned into three internal organizational departments: "
        "<b>ICT (7 nodes)</b>, <b>SALES (7 nodes)</b>, and <b>ADMIN (7 nodes)</b>. A network node corresponds to a host device requiring an IP address. "
        "In addition, each subnet requires a Default Gateway address residing on the router interface to facilitate external and inter-subnet routing.",
        body_style
    ))
    
    story.append(Paragraph("1.1 Subnet Mask and Host Bits Derivation", h2_style))
    story.append(Paragraph(
        "To accommodate 7 host nodes plus 1 default gateway (total 8 IP addresses) per department without address collisions, the number of required host bits <i>h</i> is governed by the fundamental formula: "
        "<br/>&nbsp;&nbsp;&nbsp;&nbsp;<b>2<sup>h</sup> - 2 &ge; Required Usable Hosts</b>"
        "<br/>For 7 client nodes (or 8 usable addresses including the gateway):"
        "<br/>&bull; If <i>h</i> = 3: 2<sup>3</sup> - 2 = 6 hosts (insufficient for 7 nodes)."
        "<br/>&bull; If <i>h</i> = 4: 2<sup>4</sup> - 2 = 14 usable hosts (fully satisfies 7 nodes + 1 gateway, allowing future scalability).",
        bullet_style
    ))
    story.append(Paragraph(
        "Subtracting host bits from the total 32 IPv4 bits yields the new prefix length: <b>32 - 4 = /28</b>."
        "<br/>The custom Subnet Mask is: <b>255.255.255.240</b>"
        "<br/>Binary representation: <code>11111111 . 11111111 . 11111111 . 11110000</code>"
        "<br/>Block Size (increment) = 256 - 240 = <b>16 addresses per subnet</b>.",
        bullet_style
    ))

    # Subnet Table
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Table 1: Comprehensive Subnet Planning &amp; IP Allocation Matrix</b>", h2_style))
    
    headers = [
        Paragraph("Subnet Name", table_header_style),
        Paragraph("Network ID", table_header_style),
        Paragraph("Subnet Mask", table_header_style),
        Paragraph("Usable Host Range", table_header_style),
        Paragraph("Gateway IP", table_header_style),
        Paragraph("Broadcast IP", table_header_style)
    ]
    
    rows = [
        [
            Paragraph("<b>Subnet 1: ICT</b><br/>(7 nodes)", table_cell_left),
            Paragraph("10.10.10.0/28", table_cell_style),
            Paragraph("255.255.255.240", table_cell_style),
            Paragraph("10.10.10.1 &ndash;<br/>10.10.10.14", table_cell_style),
            Paragraph("10.10.10.1", table_cell_style),
            Paragraph("10.10.10.15", table_cell_style)
        ],
        [
            Paragraph("<b>Subnet 2: SALES</b><br/>(7 nodes)", table_cell_left),
            Paragraph("10.10.10.16/28", table_cell_style),
            Paragraph("255.255.255.240", table_cell_style),
            Paragraph("10.10.10.17 &ndash;<br/>10.10.10.30", table_cell_style),
            Paragraph("10.10.10.17", table_cell_style),
            Paragraph("10.10.10.31", table_cell_style)
        ],
        [
            Paragraph("<b>Subnet 3: ADMIN</b><br/>(7 nodes)", table_cell_left),
            Paragraph("10.10.10.32/28", table_cell_style),
            Paragraph("255.255.255.240", table_cell_style),
            Paragraph("10.10.10.33 &ndash;<br/>10.10.10.46", table_cell_style),
            Paragraph("10.10.10.33", table_cell_style),
            Paragraph("10.10.10.47", table_cell_style)
        ],
        [
            Paragraph("<b>Subnet 4: EXTRA</b><br/>(Req 4: 4 nodes)", table_cell_left),
            Paragraph("192.1.1.0/24", table_cell_style),
            Paragraph("255.255.255.0", table_cell_style),
            Paragraph("192.1.1.1 &ndash;<br/>192.1.1.254", table_cell_style),
            Paragraph("192.1.1.1", table_cell_style),
            Paragraph("192.1.1.255", table_cell_style)
        ]
    ]

    t_alloc = Table([headers] + rows, colWidths=[90, 78, 82, 85, 75, 80])
    t_alloc.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0D233A")),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8F9F9")]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#BDC3C7")),
    ]))
    story.append(t_alloc)
    story.append(Spacer(1, 10))

    # Node Level Breakdown Table
    story.append(Paragraph("1.2 Detailed Node-Level IP Assignment for Caleb Joseph", h2_style))
    
    node_headers = [
        Paragraph("Department", table_header_style),
        Paragraph("Host Designation", table_header_style),
        Paragraph("Assigned IP Address", table_header_style),
        Paragraph("Subnet Mask", table_header_style),
        Paragraph("Configured Default Gateway", table_header_style)
    ]
    node_rows = [
        [Paragraph("ICT Subnet<br/>(10.10.10.0/28)", table_cell_left), Paragraph("ICT-PC1 to ICT-PC7<br/>(7 Nodes)", table_cell_style), Paragraph("10.10.10.2 &ndash; 10.10.10.8", table_cell_style), Paragraph("255.255.255.240", table_cell_style), Paragraph("10.10.10.1 (Router Interface)", table_cell_style)],
        [Paragraph("SALES Subnet<br/>(10.10.10.16/28)", table_cell_left), Paragraph("SALES-PC1 to SALES-PC7<br/>(7 Nodes)", table_cell_style), Paragraph("10.10.10.18 &ndash; 10.10.10.24", table_cell_style), Paragraph("255.255.255.240", table_cell_style), Paragraph("10.10.10.17 (Router Interface)", table_cell_style)],
        [Paragraph("ADMIN Subnet<br/>(10.10.10.32/28)", table_cell_left), Paragraph("ADMIN-PC1 to ADMIN-PC7<br/>(7 Nodes)", table_cell_style), Paragraph("10.10.10.34 &ndash; 10.10.10.40", table_cell_style), Paragraph("255.255.255.240", table_cell_style), Paragraph("10.10.10.33 (Router Interface)", table_cell_style)],
        [Paragraph("Subnet 4 (Req 4)<br/>(192.1.1.0/24)", table_cell_left), Paragraph("NODE-PC1 to NODE-PC4<br/>(4 Nodes)", table_cell_style), Paragraph("192.1.1.2 &ndash; 192.1.1.5", table_cell_style), Paragraph("255.255.255.0", table_cell_style), Paragraph("192.1.1.1 (Router Interface)", table_cell_style)]
    ]
    t_nodes = Table([node_headers] + node_rows, colWidths=[95, 105, 105, 85, 100])
    t_nodes.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1A5276")),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8F9F9")]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#BDC3C7")),
    ]))
    story.append(t_nodes)

    story.append(PageBreak())

    # ==========================================
    # REQUIREMENT 3: PACKET TRACER IMPLEMENTATION & PACKET ISOLATION
    # ==========================================
    story.append(Paragraph("2. Network Architecture &amp; Packet Isolation (Req. 3)", h1_style))
    story.append(Paragraph(
        "Requirement 3 dictates that packets originating within a given subnet must not be transmitted or leaked across to other subnets by default. "
        "In enterprise local area networks (LANs), this isolation is enforced across both <b>Layer 2 (Data Link Layer)</b> and <b>Layer 3 (Network Layer)</b>.",
        body_style
    ))

    story.append(Paragraph("2.1 Mechanics of Subnet Packet Isolation", h2_style))
    story.append(Paragraph(
        "<b>1. Broadcast Domain Segmentation:</b> A Layer 2 Ethernet switch maintains a MAC address table to forward unicast frames directly to the designated destination port. "
        "However, frames sent to the broadcast MAC address (<code>FF:FF:FF:FF:FF:FF</code>) are flooded out of all active ports within the same broadcast domain. By isolating each department "
        "into distinct physical switches or logical Virtual LANs (VLAN 10 for ICT, VLAN 20 for SALES, VLAN 30 for ADMIN, VLAN 40 for Subnet 4), the switch hardware completely restricts broadcast and multicast frames "
        "to that department alone. No broadcast packet can physically or logically spill into an adjacent department.",
        bullet_style
    ))
    story.append(Paragraph(
        "<b>2. IP Subnet Mask Logical Filtering:</b> When an end-station host (e.g., ICT-PC1 at 10.10.10.2) prepares an IP packet, its operating system applies its configured subnet mask (255.255.255.240) "
        "using a bitwise logical AND operation on both its own IP and the target destination IP. If the calculated network prefix does not match its local subnet, the host realizes the destination is external. "
        "Crucially, it will <i>never</i> broadcast an ARP request for the destination IP across the local network; instead, it targets solely the default gateway.",
        bullet_style
    ))
    story.append(Paragraph(
        "<b>3. Collision vs Broadcast Isolation:</b> Switches inherently eliminate collisions through microsegmentation (dedicated collision domain per port in full-duplex mode). "
        "Subnetting and VLAN division extend this isolation to the broadcast domain, safeguarding network bandwidth, enhancing security, and preventing rogue packet sniffing.",
        bullet_style
    ))

    story.append(Spacer(1, 8))

    # ==========================================
    # REQUIREMENT 4 & 5: ROUTING DEVICE & INTER-SUBNET COMMUNICATION
    # ==========================================
    story.append(Paragraph("3. Inter-Subnet Communication &amp; Device Configuration (Req. 4 &amp; 5)", h1_style))
    story.append(Paragraph(
        "Requirement 4 mandates adding a fourth subnet with 4 nodes (<b>192.1.1.0/24</b>), and Requirement 5 calls for enabling controlled inter-subnet communication "
        "(such that any host in Subnet A can successfully ping or transmit data packets to Subnet B).",
        body_style
    ))
    story.append(Paragraph(
        "<b>The Required Device:</b> Because Layer 2 switches are strictly confined to their local broadcast domains, inter-subnet communication requires a <b>Layer 3 device</b>, "
        "specifically an <b>Enterprise Router (e.g., Cisco 2911 or Cisco 4321 / 2811)</b> or a <b>Layer 3 Multilayer Switch (Cisco Catalyst 3560/3650)</b> with IP routing enabled. "
        "The router operates as the default gateway for each subnet, inspecting Layer 3 IP headers and routing packets between different subnets based on its routing table.",
        body_style
    ))

    story.append(Paragraph("3.1 Cisco IOS Configuration Commands (Router-on-a-Stick / Subinterfaces)", h2_style))
    story.append(Paragraph(
        "The industry standard and most elegant Packet Tracer design is <b>Router-on-a-Stick (802.1Q encapsulation)</b> via GigabitEthernet 0/0, connecting to a trunk port on a Cisco 2960 switch:",
        body_style
    ))

    router_cfg = [
        "Router> enable",
        "Router# configure terminal",
        "Router(config)# hostname R1-GATEWAY",
        "R1-GATEWAY(config)# interface GigabitEthernet0/0",
        "R1-GATEWAY(config-if)# no ip address",
        "R1-GATEWAY(config-if)# no shutdown",
        "R1-GATEWAY(config-if)# exit",
        "!",
        "! --- Subnet 1: ICT (10.10.10.0/28) ---",
        "R1-GATEWAY(config)# interface GigabitEthernet0/0.10",
        "R1-GATEWAY(config-subif)# encapsulation dot1Q 10",
        "R1-GATEWAY(config-subif)# ip address 10.10.10.1 255.255.255.240",
        "R1-GATEWAY(config-subif)# description ICT_Gateway",
        "R1-GATEWAY(config-subif)# exit",
        "!",
        "! --- Subnet 2: SALES (10.10.10.16/28) ---",
        "R1-GATEWAY(config)# interface GigabitEthernet0/0.20",
        "R1-GATEWAY(config-subif)# encapsulation dot1Q 20",
        "R1-GATEWAY(config-subif)# ip address 10.10.10.17 255.255.255.240",
        "R1-GATEWAY(config-subif)# description SALES_Gateway",
        "R1-GATEWAY(config-subif)# exit",
        "!",
        "! --- Subnet 3: ADMIN (10.10.10.32/28) ---",
        "R1-GATEWAY(config)# interface GigabitEthernet0/0.30",
        "R1-GATEWAY(config-subif)# encapsulation dot1Q 30",
        "R1-GATEWAY(config-subif)# ip address 10.10.10.33 255.255.255.240",
        "R1-GATEWAY(config-subif)# description ADMIN_Gateway",
        "R1-GATEWAY(config-subif)# exit",
        "!",
        "! --- Subnet 4: EXTRA REQ 4 (192.1.1.0/24) ---",
        "R1-GATEWAY(config)# interface GigabitEthernet0/0.40",
        "R1-GATEWAY(config-subif)# encapsulation dot1Q 40",
        "R1-GATEWAY(config-subif)# ip address 192.1.1.1 255.255.255.0",
        "R1-GATEWAY(config-subif)# description REQ4_4Nodes_Gateway",
        "R1-GATEWAY(config-subif)# exit",
        "R1-GATEWAY(config)# end",
        "R1-GATEWAY# write memory"
    ]
    
    cfg_flowables = [Paragraph(f"<code>{line}</code>", code_style) for line in router_cfg]
    cfg_table = Table([[cfg_flowables]], colWidths=[490])
    cfg_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F4F6F6")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#7F8C8D")),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(cfg_table)
    story.append(Spacer(1, 8))

    story.append(Paragraph("3.2 Switch Trunk &amp; Access Port Configuration", h2_style))
    story.append(Paragraph(
        "On the Cisco 2960 Switch connecting to the router trunk line and user departments:",
        body_style
    ))

    switch_cfg = [
        "Switch> enable",
        "Switch# configure terminal",
        "Switch(config)# vlan 10",
        "Switch(config-vlan)# name ICT_DEPT",
        "Switch(config)# vlan 20",
        "Switch(config-vlan)# name SALES_DEPT",
        "Switch(config)# vlan 30",
        "Switch(config-vlan)# name ADMIN_DEPT",
        "Switch(config)# vlan 40",
        "Switch(config-vlan)# name REQ4_DEPT",
        "Switch(config)# exit",
        "Switch(config)# interface GigabitEthernet0/1",
        "Switch(config-if)# switchport mode trunk",
        "Switch(config-if)# switchport trunk allowed vlan 10,20,30,40",
        "Switch(config-if)# exit",
        "Switch(config)# interface range FastEthernet0/1 - 7",
        "Switch(config-if-range)# switchport mode access",
        "Switch(config-if-range)# switchport access vlan 10",
        "Switch(config-if-range)# exit",
        "Switch(config)# interface range FastEthernet0/8 - 14",
        "Switch(config-if-range)# switchport mode access",
        "Switch(config-if-range)# switchport access vlan 20",
        "Switch(config-if-range)# exit",
        "Switch(config)# interface range FastEthernet0/15 - 21",
        "Switch(config-if-range)# switchport mode access",
        "Switch(config-if-range)# switchport access vlan 30",
        "Switch(config-if-range)# exit",
        "Switch(config)# interface range FastEthernet0/22 - 24",
        "Switch(config-if-range)# switchport mode access",
        "Switch(config-if-range)# switchport access vlan 40",
        "Switch(config-if-range)# end"
    ]
    sw_flowables = [Paragraph(f"<code>{line}</code>", code_style) for line in switch_cfg]
    sw_table = Table([[sw_flowables]], colWidths=[490])
    sw_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F4F6F6")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#7F8C8D")),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(sw_table)

    story.append(PageBreak())

    # ==========================================
    # REQUIREMENT 6: OSI MODEL PACKET TRANSMISSION ANALYSIS
    # ==========================================
    story.append(Paragraph("4. End-to-End Inter-Subnet Packet Flow via OSI Model (Req. 6)", h1_style))
    story.append(Paragraph(
        "Requirement 6 calls for a comprehensive, rigorous explanation of how data packets are transmitted between subnets using the "
        "<b>7-Layer Open Systems Interconnection (OSI) Reference Model</b>. Below is the step-by-step traversal of an ICMP Echo Request (Ping) "
        "originating from <b>ICT-PC1 (IP: 10.10.10.2, Subnet 1)</b> destined for <b>SALES-PC1 (IP: 10.10.10.18, Subnet 2)</b>.",
        body_style
    ))

    osi_headers = [
        Paragraph("OSI Layer", table_header_style),
        Paragraph("Device / Station", table_header_style),
        Paragraph("Protocol Data Unit (PDU)", table_header_style),
        Paragraph("Operational Mechanics &amp; Header Transformation", table_header_style)
    ]
    
    osi_steps = [
        [
            Paragraph("<b>Layer 7: Application</b>", table_cell_left),
            Paragraph("ICT-PC1<br/>(Sender)", table_cell_style),
            Paragraph("User Data / Command", table_cell_style),
            Paragraph("The user executes the command <code>ping 10.10.10.18</code>. The diagnostic utility initiates the ICMP process and prepares the payload.", table_cell_left)
        ],
        [
            Paragraph("<b>Layer 6 &amp; 5: Presentation &amp; Session</b>", table_cell_left),
            Paragraph("ICT-PC1", table_cell_style),
            Paragraph("Formatted Data", table_cell_style),
            Paragraph("Standard data encoding and session handles are maintained by the local operating system network stack.", table_cell_left)
        ],
        [
            Paragraph("<b>Layer 4: Transport</b>", table_cell_left),
            Paragraph("ICT-PC1", table_cell_style),
            Paragraph("Segment / ICMP Message", table_cell_style),
            Paragraph("Constructs an <b>ICMP Type 8 (Echo Request)</b> message containing sequence and identifier tags, encapsulated for network delivery.", table_cell_left)
        ],
        [
            Paragraph("<b>Layer 3: Network</b><br/><i>(Host Decision)</i>", table_cell_left),
            Paragraph("ICT-PC1", table_cell_style),
            Paragraph("IP Packet", table_cell_style),
            Paragraph("An IPv4 header is prepended: <b>Source IP = 10.10.10.2</b>, <b>Destination IP = 10.10.10.18</b>, Protocol = 1 (ICMP), TTL = 128.<br/>"
                      "<b>Subnet Comparison:</b> ICT-PC1 performs bitwise AND: (10.10.10.2 &amp; 255.255.255.240 = 10.10.10.0) vs (10.10.10.18 &amp; 255.255.255.240 = 10.10.10.16). "
                      "Because the network IDs differ, ICT-PC1 recognizes the destination is remote and selects its Default Gateway (<b>10.10.10.1</b>).", table_cell_left)
        ],
        [
            Paragraph("<b>Layer 2: Data Link</b><br/><i>(Local Framing &amp; ARP)</i>", table_cell_left),
            Paragraph("ICT-PC1 &amp;<br/>Local Switch", table_cell_style),
            Paragraph("Ethernet Frame", table_cell_style),
            Paragraph("ICT-PC1 checks its ARP cache for the MAC address of Gateway 10.10.10.1. (If absent, it broadcasts an ARP Request; the router replies with its Subinterface MAC). "
                      "Frame header is encapsulated: <b>Source MAC = MAC_ICT_PC1</b>, <b>Destination MAC = MAC_Router_Subif10</b>. EtherType = 0x0800 (IPv4). The switch forwards the frame over trunk tagged with VLAN 10.", table_cell_left)
        ],
        [
            Paragraph("<b>Layer 1: Physical</b>", table_cell_left),
            Paragraph("Copper / UTP", table_cell_style),
            Paragraph("Bits (Signals)", table_cell_style),
            Paragraph("The Ethernet frame is converted into physical electrical voltage pulses (PAM-5 encoding over Cat5e/Cat6) transmitted along the medium to the router.", table_cell_left)
        ],
        [
            Paragraph("<b>Router Ingestion: Layers 1 &amp; 2</b>", table_cell_left),
            Paragraph("Router R1", table_cell_style),
            Paragraph("Frame to Packet", table_cell_style),
            Paragraph("Router receives bits at Layer 1, extracts the frame at Layer 2, validates the Frame Check Sequence (FCS), strips the 802.1Q tag, and verifies the Destination MAC matches its subinterface. It de-encapsulates the frame.", table_cell_left)
        ],
        [
            Paragraph("<b>Router Layer 3: Routing Lookup &amp; TTL</b>", table_cell_left),
            Paragraph("Router R1<br/>(L3 Engine)", table_cell_style),
            Paragraph("IP Packet Processing", table_cell_style),
            Paragraph("R1 inspects the Destination IP (10.10.10.18) against its routing table. It discovers 10.10.10.16/28 is directly connected on <b>GigabitEthernet0/0.20</b>.<br/>"
                      "R1 decrements the IP <b>TTL by 1</b> (e.g., 128 &rarr; 127) and recalculates the IP Header Checksum.", table_cell_left)
        ],
        [
            Paragraph("<b>Router Layer 2 &amp; 1: Frame Regeneration</b>", table_cell_left),
            Paragraph("Router R1 &amp;<br/>Egress Trunk", table_cell_style),
            Paragraph("New Frame &amp; Bits", table_cell_style),
            Paragraph("<b>CRITICAL OSI MECHANIC:</b> The Layer 3 IP addresses remain <i>completely unchanged</i>, but the Layer 2 Frame is completely rewritten! "
                      "R1 checks its ARP table for 10.10.10.18: <b>Source MAC = MAC_Router_Subif20</b>, <b>Destination MAC = MAC_SALES_PC1</b>. "
                      "A VLAN 20 tag is prepended, converted to bits, and transmitted over the physical medium.", table_cell_left)
        ],
        [
            Paragraph("<b>Receiver Delivery: Layers 1 to 7</b>", table_cell_left),
            Paragraph("SALES-PC1<br/>(Receiver)", table_cell_style),
            Paragraph("Bits &rarr; Frame &rarr; Packet &rarr; ICMP Echo", table_cell_style),
            Paragraph("Switch removes VLAN 20 tag on access port. SALES-PC1 receives bits at Layer 1, verifies destination MAC at Layer 2, de-encapsulates IP packet at Layer 3, matches Destination IP, passes ICMP payload to Layer 4, "
                      "and processes the ping request. SALES-PC1 then reverses the entire process to transmit an <b>ICMP Echo Reply (Type 0)</b> back to ICT-PC1.", table_cell_left)
        ]
    ]

    t_osi = Table([osi_headers] + osi_steps, colWidths=[90, 75, 75, 250])
    t_osi.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0D233A")),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8F9F9")]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#BDC3C7")),
    ]))
    story.append(t_osi)

    story.append(PageBreak())

    # ==========================================
    # SECTION 5: PACKET TRACER STEP-BY-STEP VERIFICATION GUIDE
    # ==========================================
    story.append(Paragraph("5. Step-by-Step Cisco Packet Tracer Implementation Guide", h1_style))
    story.append(Paragraph(
        "To achieve maximum marks (40 Marks), follow these straightforward operational steps inside Cisco Packet Tracer:",
        body_style
    ))

    pt_steps = [
        "<b>Step 1: Place Network Devices:</b>"
        "<br/>&bull; Add 1 x Cisco Router 2911 or 4321."
        "<br/>&bull; Add 1 x Cisco Catalyst 2960-24TT Switch (or 4 switches, one per department)."
        "<br/>&bull; Add 22 end-user PCs: 7 for ICT (PC0&ndash;PC6), 7 for SALES (PC7&ndash;PC13), 7 for ADMIN (PC14&ndash;PC20), and 4 for Subnet 4 (PC21&ndash;PC24).",
        
        "<b>Step 2: Cabling:</b>"
        "<br/>&bull; Use Copper Straight-Through cables from PC FastEthernet ports to switch ports."
        "<br/>&bull; Connect switch port GigabitEthernet0/1 to Router GigabitEthernet0/0.",
        
        "<b>Step 3: End-Device IP Configuration:</b>"
        "<br/>&bull; Open each PC &rarr; Desktop tab &rarr; <b>IP Configuration</b>."
        "<br/>&bull; Assign static IP address, subnet mask, and default gateway as documented in Table 1.",

        "<b>Step 4: Router and Switch CLI Configuration:</b>"
        "<br/>&bull; Click Router &rarr; CLI tab, copy and paste the configuration from Section 3.1."
        "<br/>&bull; Click Switch &rarr; CLI tab, copy and paste the VLAN and trunk configuration from Section 3.2.",

        "<b>Step 5: Testing, Ping Verification &amp; Evidence Collection:</b>"
        "<br/>&bull; Open Command Prompt on ICT-PC1 (10.10.10.2)."
        "<br/>&bull; Execute: <code>ping 10.10.10.18</code> (to SALES-PC1). Note: The first ping may show 'Request timed out' during ARP resolution; subsequent pings will succeed with <code>Reply from 10.10.10.18: bytes=32 time&lt;1ms TTL=127</code>."
        "<br/>&bull; Execute: <code>ping 10.10.10.34</code> (to ADMIN-PC1). Verification confirms inter-subnet routing."
        "<br/>&bull; Execute: <code>ping 192.1.1.2</code> (to Subnet 4 PC1). Confirms routing to the 192.1.1.0/24 subnet.",

        "<b>Step 6: Simulation Mode Inspection (OSI Verification):</b>"
        "<br/>&bull; Switch from Realtime mode to <b>Simulation Mode</b> (Shift+S) in Packet Tracer."
        "<br/>&bull; Send an ICMP packet from ICT-PC1 to SALES-PC1 using the Add Simple PDU tool (P)."
        "<br/>&bull; Click the packet envelope at each hop (PC &rarr; Switch &rarr; Router &rarr; Switch &rarr; PC) to view the <b>OSI Model Model tab</b>, confirming each layer described in Section 4."
    ]
    for s in pt_steps:
        story.append(Paragraph(s, bullet_style))
        story.append(Spacer(1, 2))

    story.append(Spacer(1, 10))
    story.append(Paragraph("6. Academic Verification &amp; Conclusion", h1_style))
    story.append(Paragraph(
        "By rigorously adhering to binary subnetting principles, the base address block 10.10.10.0/24 is efficiently divided into /28 subnets with zero address overlap, "
        "providing tailored capacity for Caleb Joseph's assigned departments (ICT, SALES, ADMIN with 7 nodes each). The integration of the 192.1.1.0/24 network fulfills "
        "Requirement 4, while Layer 2 VLAN partitioning and Layer 3 802.1Q subinterface routing satisfy Requirements 3 and 5. The OSI 7-layer analysis confirms the exact "
        "boundary between logical Layer 3 IP persistence and physical/data-link frame decapsulation and re-encapsulation, satisfying Requirement 6 in full academic compliance.",
        body_style
    ))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated assignment PDF: {filename}")

if __name__ == "__main__":
    out_pdf = r"C:\Users\TechBuddy\Desktop\Networking_Assignment_Caleb_Joseph.pdf"
    build_assignment_pdf(out_pdf)

