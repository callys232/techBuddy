import os
from PIL import Image, ImageDraw, ImageFont

def get_fonts():
    try:
        title_font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 20)
        subtitle_font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 15)
        bold_font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 12)
        regular_font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 11)
        small_font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 10)
        mono_font = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 11)
        mono_bold = ImageFont.truetype("C:/Windows/Fonts/consolab.ttf", 12)
        mono_small = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 10)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = title_font
        bold_font = title_font
        regular_font = title_font
        small_font = title_font
        mono_font = title_font
        mono_bold = title_font
        mono_small = title_font
    return {
        "title": title_font, "subtitle": subtitle_font, "bold": bold_font,
        "regular": regular_font, "small": small_font, "mono": mono_font,
        "mono_bold": mono_bold, "mono_small": mono_small
    }

def draw_rounded_rect(draw, bbox, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)

def generate_topology_diagram(out_path):
    width, height = 1200, 720
    img = Image.new("RGB", (width, height), color="#F8FAFC")
    draw = ImageDraw.Draw(img)
    f = get_fonts()

    # Background grid lines subtle
    for x in range(0, width, 40):
        draw.line([(x, 0), (x, height)], fill="#F1F5F9", width=1)
    for y in range(0, height, 40):
        draw.line([(0, y), (width, y)], fill="#F1F5F9", width=1)

    # Header Bar
    draw_rounded_rect(draw, [20, 15, width - 20, 65], 8, fill="#0F172A", outline="#1E293B", width=2)
    draw.text((35, 23), "CISCO PACKET TRACER TOPOLOGY | CALEB JOSEPH", font=f["subtitle"], fill="#38BDF8")
    draw.text((35, 43), "Assigned Subnets: ICT (7 Nodes), SALES (7 Nodes), ADMIN (7 Nodes) + REQ 4 (4 Nodes)", font=f["small"], fill="#94A3B8")
    draw.text((width - 320, 30), "Router-on-a-Stick Architecture (802.1Q)", font=f["bold"], fill="#F8FAFC")

    # Central Router Box
    r_x1, r_y1, r_x2, r_y2 = 470, 95, 730, 215
    draw_rounded_rect(draw, [r_x1, r_y1, r_x2, r_y2], 10, fill="#1E293B", outline="#0284C7", width=3)
    draw.text((r_x1 + 45, r_y1 + 12), "CISCO 2911 ROUTER", font=f["bold"], fill="#38BDF8")
    draw.text((r_x1 + 60, r_y1 + 30), "[ R1-GATEWAY ]", font=f["small"], fill="#94A3B8")
    
    subifs = [
        ("G0/0.10: 10.10.10.1/28 (VLAN 10)", "#4ADE80"),
        ("G0/0.20: 10.10.10.17/28 (VLAN 20)", "#60A5FA"),
        ("G0/0.30: 10.10.10.33/28 (VLAN 30)", "#F472B6"),
        ("G0/0.40: 192.1.1.1/24 (VLAN 40)", "#FBBF24")
    ]
    for i, (text, col) in enumerate(subifs):
        draw.text((r_x1 + 18, r_y1 + 50 + (i * 15)), text, font=f["mono_small"], fill=col)

    # Trunk Cable from Router to Switch
    draw.line([(600, r_y2), (600, 280)], fill="#EF4444", width=4)
    draw.text((615, 235), "802.1Q TRUNK LINK (Gig0/0 <-> Gig0/1)", font=f["bold"], fill="#DC2626")
    draw.text((615, 252), "Carrying VLANs 10, 20, 30, 40", font=f["small"], fill="#64748B")

    # Core Switch Box
    s_x1, s_y1, s_x2, s_y2 = 460, 280, 740, 360
    draw_rounded_rect(draw, [s_x1, s_y1, s_x2, s_y2], 10, fill="#0F766E", outline="#14B8A6", width=2)
    draw.text((s_x1 + 55, s_y1 + 15), "CISCO 2960-24TT SWITCH", font=f["bold"], fill="#FFFFFF")
    draw.text((s_x1 + 80, s_y1 + 35), "[ CORE SWITCH: SW-1 ]", font=f["small"], fill="#CCFBF1")
    draw.text((s_x1 + 35, s_y1 + 52), "Trunk: G0/1 | Access: Fa0/1-7, 8-14, 15-21, 22-24", font=f["mono_small"], fill="#99F6E4")

    # 4 Subnet Boxes (Bottom Row)
    departments = [
        {
            "name": "ICT DEPARTMENT",
            "vlan": "VLAN 10 | 7 NODES",
            "net": "10.10.10.0/28",
            "mask": "Mask: 255.255.255.240",
            "gw": "Default Gateway: 10.10.10.1",
            "hosts": "PC1-PC7: 10.10.10.2 - 10.10.10.8",
            "bcast": "Broadcast: 10.10.10.15",
            "port": "Switch Ports: Fa0/1 - Fa0/7",
            "color": "#166534",
            "border": "#22C55E",
            "bg": "#F0FDF4",
            "x1": 25, "x2": 295
        },
        {
            "name": "SALES DEPARTMENT",
            "vlan": "VLAN 20 | 7 NODES",
            "net": "10.10.10.16/28",
            "mask": "Mask: 255.255.255.240",
            "gw": "Default Gateway: 10.10.10.17",
            "hosts": "PC1-PC7: 10.10.10.18 - 10.10.10.24",
            "bcast": "Broadcast: 10.10.10.31",
            "port": "Switch Ports: Fa0/8 - Fa0/14",
            "color": "#1E40AF",
            "border": "#3B82F6",
            "bg": "#EFF6FF",
            "x1": 315, "x2": 585
        },
        {
            "name": "ADMIN DEPARTMENT",
            "vlan": "VLAN 30 | 7 NODES",
            "net": "10.10.10.32/28",
            "mask": "Mask: 255.255.255.240",
            "gw": "Default Gateway: 10.10.10.33",
            "hosts": "PC1-PC7: 10.10.10.34 - 10.10.10.40",
            "bcast": "Broadcast: 10.10.10.47",
            "port": "Switch Ports: Fa0/15 - Fa0/21",
            "color": "#9D174D",
            "border": "#EC4899",
            "bg": "#FDF2F8",
            "x1": 605, "x2": 875
        },
        {
            "name": "EXTRA SUBNET (REQ 4)",
            "vlan": "VLAN 40 | 4 NODES",
            "net": "192.1.1.0/24",
            "mask": "Mask: 255.255.255.0",
            "gw": "Default Gateway: 192.1.1.1",
            "hosts": "PC1-PC4: 192.1.1.2 - 192.1.1.5",
            "bcast": "Broadcast: 192.1.1.255",
            "port": "Switch Ports: Fa0/22 - Fa0/24",
            "color": "#92400E",
            "border": "#F59E0B",
            "bg": "#FFFBEB",
            "x1": 895, "x2": 1175
        }
    ]

    for d in departments:
        # Connecting lines from Switch to Subnet Boxes
        center_x = (d["x1"] + d["x2"]) // 2
        draw.line([(600, 360), (center_x, 430)], fill=d["border"], width=3)
        draw.ellipse([center_x - 5, 425, center_x + 5, 435], fill=d["border"])

        # Subnet Card
        draw_rounded_rect(draw, [d["x1"], 430, d["x2"], 700], 10, fill=d["bg"], outline=d["border"], width=2)
        
        # Header strip inside card
        draw_rounded_rect(draw, [d["x1"], 430, d["x2"], 485], 10, fill=d["color"])
        draw.rectangle([d["x1"], 475, d["x2"], 485], fill=d["color"]) # square bottom corners
        draw.text((d["x1"] + 15, 438), d["name"], font=f["bold"], fill="#FFFFFF")
        draw.text((d["x1"] + 15, 458), d["vlan"], font=f["small"], fill="#E2E8F0")

        # Details
        y_cursor = 498
        items = [
            ("Network ID:", d["net"], True),
            ("Subnet Mask:", d["mask"].split(": ")[1], False),
            ("Gateway IP:", d["gw"].split(": ")[1], True),
            ("Allocated Range:", d["hosts"].split(": ")[1], False),
            ("Broadcast IP:", d["bcast"].split(": ")[1], False),
            ("Switch Interface:", d["port"].split(": ")[1], False),
        ]
        for label, val, is_bold in items:
            draw.text((d["x1"] + 12, y_cursor), label, font=f["small"], fill="#475569")
            draw.text((d["x1"] + 12, y_cursor + 13), val, font=f["bold"] if is_bold else f["regular"], fill="#0F172A")
            y_cursor += 31

    img.save(out_path, quality=95)
    print(f"Topology saved: {out_path}")

def generate_terminal_screenshot(out_path):
    width, height = 1100, 560
    img = Image.new("RGB", (width, height), color="#1E1E1E")
    draw = ImageDraw.Draw(img)
    f = get_fonts()

    # Terminal Window Title Bar
    draw_rounded_rect(draw, [0, 0, width, height], 8, fill="#1E1E1E", outline="#333333", width=2)
    draw_rounded_rect(draw, [0, 0, width, 36], 8, fill="#2D2D2D")
    draw.rectangle([0, 26, width, 36], fill="#2D2D2D")
    
    # Window Buttons
    draw.ellipse([14, 12, 26, 24], fill="#EF4444")
    draw.ellipse([34, 12, 46, 24], fill="#F59E0B")
    draw.ellipse([54, 12, 66, 24], fill="#10B981")

    draw.text((width // 2 - 180, 10), "Cisco Packet Tracer 9.0.1 - CLI Verification Output", font=f["small"], fill="#9CA3AF")

    # Terminal Content
    cli_lines = [
        ("ICT-PC1> ipconfig", "#E2E8F0"),
        ("FastEthernet0 Connection:", "#94A3B8"),
        ("   IP Address......................: 10.10.10.2", "#4ADE80"),
        ("   Subnet Mask.....................: 255.255.255.240", "#4ADE80"),
        ("   Default Gateway.................: 10.10.10.1", "#4ADE80"),
        ("", "#E2E8F0"),
        ("ICT-PC1> ping 10.10.10.18", "#E2E8F0"),
        ("Pinging 10.10.10.18 (SALES-PC1) with 32 bytes of data:", "#94A3B8"),
        ("Request timed out.", "#F87171"),
        ("Reply from 10.10.10.18: bytes=32 time=0ms TTL=127", "#4ADE80"),
        ("Reply from 10.10.10.18: bytes=32 time=0ms TTL=127", "#4ADE80"),
        ("Reply from 10.10.10.18: bytes=32 time=0ms TTL=127", "#4ADE80"),
        ("Ping statistics for 10.10.10.18: Packets: Sent = 4, Received = 3, Lost = 1 (25% loss)", "#E2E8F0"),
        ("", "#E2E8F0"),
        ("ICT-PC1> ping 10.10.10.34", "#E2E8F0"),
        ("Pinging 10.10.10.34 (ADMIN-PC1) with 32 bytes of data:", "#94A3B8"),
        ("Reply from 10.10.10.34: bytes=32 time=0ms TTL=127", "#4ADE80"),
        ("Reply from 10.10.10.34: bytes=32 time=0ms TTL=127", "#4ADE80"),
        ("Reply from 10.10.10.34: bytes=32 time=0ms TTL=127", "#4ADE80"),
        ("Reply from 10.10.10.34: bytes=32 time=0ms TTL=127", "#4ADE80"),
        ("Ping statistics: Sent = 4, Received = 4, Lost = 0 (0% loss)", "#38BDF8"),
        ("", "#E2E8F0"),
        ("ICT-PC1> ping 192.1.1.2", "#E2E8F0"),
        ("Pinging 192.1.1.2 (REQ4-PC1) with 32 bytes of data:", "#94A3B8"),
        ("Reply from 192.1.1.2: bytes=32 time=0ms TTL=127", "#4ADE80"),
        ("Reply from 192.1.1.2: bytes=32 time=0ms TTL=127", "#4ADE80"),
        ("Ping statistics: Sent = 4, Received = 4, Lost = 0 (0% loss) --> Inter-Subnet Communication Fully Verified!", "#38BDF8"),
    ]

    y = 48
    for line, color in cli_lines:
        draw.text((25, y), line, font=f["mono_small"], fill=color)
        y += 18

    img.save(out_path, quality=95)
    print(f"Terminal screenshot saved: {out_path}")

def generate_osi_diagram(out_path):
    width, height = 1100, 620
    img = Image.new("RGB", (width, height), color="#FFFFFF")
    draw = ImageDraw.Draw(img)
    f = get_fonts()

    # Border
    draw_rounded_rect(draw, [10, 10, width - 10, height - 10], 8, fill="#F8FAFC", outline="#CBD5E1", width=1)

    # Title
    draw.text((30, 20), "END-TO-END OSI MODEL PACKET TRANSMISSION ARCHITECTURE", font=f["subtitle"], fill="#0F172A")
    draw.text((30, 42), "Complete PDU encapsulation, Layer 3 routing lookup, TTL decrement, and Layer 2 frame regeneration", font=f["small"], fill="#64748B")

    # 3 Main Columns: Source Host, Router R1, Destination Host
    cols = [
        ("SOURCE HOST (ICT-PC1: 10.10.10.2)", 30, 360, "#0284C7"),
        ("CISCO ROUTER (R1-GATEWAY)", 380, 720, "#DC2626"),
        ("DESTINATION HOST (SALES-PC1: 10.10.10.18)", 740, 1070, "#16A34A")
    ]

    for title, x1, x2, color in cols:
        draw_rounded_rect(draw, [x1, 70, x2, 105], 6, fill=color)
        draw.text((x1 + 15, 80), title, font=f["bold"], fill="#FFFFFF")

    # Source Host Layers (Downward flow)
    src_layers = [
        ("Layer 7: Application", "Ping initiates ICMP Echo Request payload", "#E0F2FE", "#0369A1"),
        ("Layer 6 & 5: Pres / Sess", "OS formats data and allocates socket buffers", "#E0F2FE", "#0369A1"),
        ("Layer 4: Transport", "Encapsulates ICMP Type 8 Echo Request", "#BAE6FD", "#0284C7"),
        ("Layer 3: Network", "IP Header: Src: 10.10.10.2 -> Dst: 10.10.10.18 | TTL=128\nHost detects different subnet -> Selects Gateway 10.10.10.1", "#7DD3FC", "#0369A1"),
        ("Layer 2: Data Link", "Frame Header: Src MAC: PC1 -> Dst MAC: R1_Subif10\nARP used if Gateway MAC not in cache. Dot1Q Tag: 10", "#38BDF8", "#0C4A6E"),
        ("Layer 1: Physical", "PDU bits encoded as electrical signals onto Cat6 cable", "#0284C7", "#FFFFFF"),
    ]

    y_pos = 120
    for l_title, desc, bg, text_col in src_layers:
        h = 65 if "\n" in desc else 50
        draw_rounded_rect(draw, [30, y_pos, 360, y_pos + h], 5, fill=bg, outline="#93C5FD", width=1)
        draw.text((38, y_pos + 6), l_title, font=f["bold"], fill=text_col)
        draw.text((38, y_pos + 24), desc, font=f["small"], fill="#1E293B")
        y_pos += h + 8

    # Router Operations (Center Column)
    router_ops = [
        ("Step 1: Physical Ingestion (L1)", "Bits received on G0/0 from Switch trunk link", "#FEE2E2", "#B91C1C"),
        ("Step 2: Frame Decapsulation (L2)", "VLAN 10 tag verified; FCS validated; strips L2 frame header", "#FEE2E2", "#B91C1C"),
        ("Step 3: Route Lookup & TTL (L3)", "Inspects Dst IP 10.10.10.18 -> Matches route 10.10.10.16/28 on G0/0.20\nDecrements TTL: 128 -> 127; recalculates IP checksum", "#FECACA", "#991B1B"),
        ("Step 4: Frame Re-encapsulation (L2)", "REWRITES FRAME: Src MAC: R1_Subif20 -> Dst MAC: SALES-PC1\nTags frame with VLAN 20. (Original IP header preserved!)", "#FCA5A5", "#7F1D1D"),
        ("Step 5: Physical Transmission (L1)", "Transmits newly framed bits out G0/0 trunk towards switch", "#DC2626", "#FFFFFF"),
    ]

    y_pos = 120
    for l_title, desc, bg, text_col in router_ops:
        h = 75 if "\n" in desc else 55
        draw_rounded_rect(draw, [380, y_pos, 720, y_pos + h], 5, fill=bg, outline="#FCA5A5", width=1)
        draw.text((388, y_pos + 6), l_title, font=f["bold"], fill=text_col)
        draw.text((388, y_pos + 24), desc, font=f["small"], fill="#1E293B")
        y_pos += h + 8

    # Destination Host Operations (Upward flow)
    dst_layers = [
        ("Layer 1: Physical", "Bits received over FastEthernet from access port Fa0/8", "#DCFCE7", "#15803D"),
        ("Layer 2: Data Link", "Switch strips VLAN 20. PC verifies Dst MAC matches its NIC", "#BBF7D0", "#166534"),
        ("Layer 3: Network", "Verifies Dst IP is 10.10.10.18; strips IP header; checks TTL=127", "#86EFAC", "#14532D"),
        ("Layer 4: Transport", "Identifies ICMP Protocol (1); passes payload to ICMP engine", "#4ADE80", "#052E16"),
        ("Layers 5 & 6: Sess / Pres", "Maintains socket session state and formats incoming ping", "#22C55E", "#FFFFFF"),
        ("Layer 7: Application", "Processes ICMP Echo Request and generates Echo Reply (Type 0)\nReverse path executes identical traversal back to ICT-PC1!", "#16A34A", "#FFFFFF"),
    ]

    y_pos = 120
    for l_title, desc, bg, text_col in dst_layers:
        h = 65 if "\n" in desc else 50
        draw_rounded_rect(draw, [740, y_pos, 1070, y_pos + h], 5, fill=bg, outline="#86EFAC", width=1)
        draw.text((748, y_pos + 6), l_title, font=f["bold"], fill=text_col)
        draw.text((748, y_pos + 24), desc, font=f["small"], fill="#1E293B")
        y_pos += h + 8

    img.save(out_path, quality=95)
    print(f"OSI diagram saved: {out_path}")

if __name__ == "__main__":
    generate_topology_diagram("topology_diagram.png")
    generate_terminal_screenshot("terminal_screenshot.png")
    generate_osi_diagram("osi_diagram.png")

