import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
)
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
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
            self.setFont("Times-Roman", 10)
            # Standard page numbering at bottom center (no header text, no student text in footer)
            self.drawCentredString(297.6, 36, str(self._pageNumber))
            self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=58,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    body_style = ParagraphStyle(
        'AcademicBody',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=12,
        leading=14.5,
        alignment=TA_JUSTIFY,
        firstLineIndent=20,
        spaceAfter=5,
        spaceBefore=0
    )

    body_item = ParagraphStyle(
        'AcademicItem',
        parent=body_style,
        firstLineIndent=0,
        leftIndent=14,
        spaceAfter=4,
        spaceBefore=1
    )

    h1_style = ParagraphStyle(
        'AcademicH1',
        fontName='Times-Bold',
        fontSize=13,
        leading=16,
        alignment=TA_LEFT,
        spaceBefore=12,
        spaceAfter=5,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'AcademicH2',
        fontName='Times-Bold',
        fontSize=12,
        leading=15,
        alignment=TA_LEFT,
        spaceBefore=9,
        spaceAfter=3,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        'AcademicH3',
        fontName='Times-Italic',
        fontSize=12,
        leading=15,
        alignment=TA_LEFT,
        spaceBefore=7,
        spaceAfter=2,
        keepWithNext=True
    )

    ref_style = ParagraphStyle(
        'AcademicRef',
        fontName='Times-Roman',
        fontSize=11,
        leading=13.5,
        alignment=TA_JUSTIFY,
        leftIndent=20,
        firstLineIndent=-20,
        spaceAfter=4
    )

    cover_inst = ParagraphStyle(
        'CoverInst',
        fontName='Times-Bold',
        fontSize=16,
        leading=20,
        alignment=TA_CENTER,
        spaceAfter=8
    )

    cover_dept = ParagraphStyle(
        'CoverDept',
        fontName='Times-Roman',
        fontSize=13,
        leading=17,
        alignment=TA_CENTER,
        spaceAfter=4
    )

    cover_title = ParagraphStyle(
        'CoverTitle',
        fontName='Times-Bold',
        fontSize=14,
        leading=18,
        alignment=TA_CENTER,
        spaceAfter=10
    )

    cover_sub = ParagraphStyle(
        'CoverSub',
        fontName='Times-Roman',
        fontSize=12,
        leading=16,
        alignment=TA_CENTER,
        spaceAfter=6
    )

    cover_meta_label = ParagraphStyle(
        'CoverMetaLabel',
        fontName='Times-Bold',
        fontSize=12,
        leading=16,
        alignment=TA_LEFT
    )

    cover_meta_val = ParagraphStyle(
        'CoverMetaVal',
        fontName='Times-Roman',
        fontSize=12,
        leading=16,
        alignment=TA_LEFT
    )

    story = []

    # ==========================
    # COVER PAGE
    # ==========================
    story.append(Spacer(1, 40))
    story.append(Paragraph("KADUNA STATE UNIVERSITY", cover_inst))
    story.append(Paragraph("FACULTY OF SOCIAL AND MANAGEMENT SCIENCES", cover_dept))
    story.append(Paragraph("DEPARTMENT OF MANAGEMENT SCIENCES", cover_dept))
    story.append(Spacer(1, 40))

    story.append(Paragraph("ASSIGNMENT ON VENTURE CREATION AND GROWTH", cover_title))
    story.append(Paragraph("COURSE CODE: ENT 302 / ENT 402", cover_title))
    story.append(Spacer(1, 20))

    story.append(Paragraph("TOPIC:", cover_sub))
    story.append(Paragraph("A CRITICAL AND COMPREHENSIVE DISCUSSION ON THE DRIVING FORCES OF ENTREPRENEURSHIP, CREATIVE IDEATION, RISK BEARING, ENVIRONMENTAL DYNAMICS, AND VENTURE SURVIVAL", cover_title))
    story.append(Spacer(1, 60))

    meta_data = [
        [Paragraph("NAME OF STUDENT:", cover_meta_label), Paragraph("ANITA AMOS", cover_meta_val)],
        [Paragraph("MATRICULATION NUMBER:", cover_meta_label), Paragraph("KASU/23/MKT/1041", cover_meta_val)],
        [Paragraph("DEPARTMENT:", cover_meta_label), Paragraph("MANAGEMENT SCIENCES (MARKETING)", cover_meta_val)],
        [Paragraph("LEVEL:", cover_meta_label), Paragraph("300 / 400 LEVEL", cover_meta_val)],
        [Paragraph("DATE OF SUBMISSION:", cover_meta_label), Paragraph("OCTOBER 2026", cover_meta_val)]
    ]
    meta_table = Table(meta_data, colWidths=[200, 240])
    meta_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(meta_table)

    story.append(PageBreak())

    # ==========================
    # SECTION A: INTRODUCTION
    # ==========================
    story.append(Paragraph("(A) INTRODUCTION", h1_style))
    story.append(Spacer(1, 2))

    intro_p1 = (
        "Entrepreneurship and venture creation constitute the primary catalysts of structural transformation, "
        "sustainable economic development, and technological innovation across modern economies. In contemporary "
        "managerial and economic discourse, entrepreneurship is understood not simply as the routine mechanical "
        "establishment of a commercial business, but as an integrative, dynamic socio-economic process wherein "
        "individuals identify, evaluate, and exploit commercially viable opportunities by mobilizing scarce resources "
        "under prevailing conditions of uncertainty (Shane & Venkataraman, 2000). From the pioneering conceptualization "
        "of 'creative destruction' advanced by Joseph Schumpeter (1934) to the alertness paradigm formulated by Israel "
        "Kirzner (1973), the entrepreneur functions as an indispensable agent of economic equilibrium disruption. By "
        "discovering unfulfilled societal needs, bridging market imperfections, and reconfiguring factors of production, "
        "entrepreneurs unlock latent wealth and propel aggregate productivity."
    )
    story.append(Paragraph(intro_p1, body_style))

    intro_p2 = (
        "The study of venture creation and growth—the core academic mandate of ENT 302 and ENT 402—examines the complex "
        "lifecycle through which an embryonic business concept evolves into an operational, self-sustaining, and scalable "
        "commercial enterprise. While the initial venture creation phase is dominated by opportunity recognition, ideation, "
        "resource bootstrapping, and foundational risk exposure, the subsequent growth phase demands institutionalized "
        "governance, managerial competence, strategic flexibility, environmental alignment, and systemic risk mitigation. "
        "The trajectory of any business venture is heavily conditioned by the initial motivations and driving forces that "
        "compelled its emergence, the quality and distinctiveness of its underlying creative ideas, and the capability "
        "of the founding team to navigate operational volatility."
    )
    story.append(Paragraph(intro_p2, body_style))

    intro_p3 = (
        "It is fundamentally axiomatic that entrepreneurial endeavors do not emerge within a socioeconomic vacuum. Rather, "
        "they are the manifest product of a continuous, reciprocal interaction between internal human attributes (such as "
        "cognitive creativity, internal locus of control, tolerance for ambiguity, and the willingness to bear calculated "
        "risk) and external contextual realities (such as macroeconomic stability, regulatory consistency, infrastructural "
        "efficiency, and sociopolitical stability). A comprehensive appreciation of these foundational dimensions is vital "
        "not only for theoretical enquiry but also for practical venture management within developing economies such as "
        "Nigeria, where resource constraints, institutional voids, and market volatility test the resilience of emerging "
        "enterprises on a daily basis."
    )
    story.append(Paragraph(intro_p3, body_style))

    intro_p4 = (
        "Accordingly, the objective of this academic assignment is to provide a thorough, rigorous, and logically coherent "
        "examination of the driving forces of entrepreneurship. The discussion is systematically organized around five thematic "
        "imperatives: (1) the multifaceted driving forces of entrepreneurship; (2) the concept of creativity and the specific "
        "typologies of creative ideas; (3) the theoretical doctrine of risk bearing and calculated risk management; (4) the "
        "internal and external environmental variables that govern entrepreneurial development; and (5) the systemic challenges "
        "and empirical causes of venture failure, complemented by strategic measures designed to ensure organizational survival "
        "and long-term competitive advantage."
    )
    story.append(Paragraph(intro_p4, body_style))
    story.append(Spacer(1, 4))

    story.append(PageBreak())

    # ==========================
    # SECTION B: DISCUSSION
    # ==========================
    story.append(Paragraph("(B) DISCUSSION", h1_style))
    story.append(Spacer(1, 2))

    # --- TOPIC 1: DRIVING FORCES ---
    story.append(Paragraph("1. Entrepreneurship Driving Forces", h2_style))

    df_p1 = (
        "The forces that propel individuals to embark upon entrepreneurial ventures are diverse, complex, and multifaceted. "
        "In modern entrepreneurship literature, these driving mechanisms are predominantly examined through the lens of Push "
        "and Pull theories, supported by classic holistic models such as the Timmons Model of Entrepreneurship. Entrepreneurial "
        "action is initiated when motivational impulses—whether intrinsic desires or external socioeconomic imperatives—reach "
        "a critical threshold, triggering the mobilization of physical, financial, and intellectual capital toward the "
        "exploitation of a perceived commercial opportunity."
    )
    story.append(Paragraph(df_p1, body_style))

    story.append(Paragraph("1.1 Pull Factors (Opportunity-Driven Forces)", h3_style))
    df_pull_intro = (
        "Pull factors represent positive, attractive incentives that draw individuals toward entrepreneurial ventures by choice. "
        "Entrepreneurs motivated by pull factors typically exhibit proactive behavioral patterns, identifying high-potential market "
        "opportunities and seeking to build scalable organizations. Key pull drivers include:"
    )
    story.append(Paragraph(df_pull_intro, body_style))

    pull_items = [
        "<b>(a) Perception of Market Gaps:</b> Alertness to unmet consumer demands, inefficiencies in established distribution channels, or newly emerging technological capabilities allows individuals to envision profitable market interventions (Kirzner, 1973).",
        "<b>(b) The Desire for Autonomy and Self-Determination:</b> A profound psychological preference to be one's own boss, manage one's own schedule, define corporate vision, and avoid bureaucratic stagnation inherent in large corporate hierarchies.",
        "<b>(c) The Need for Achievement (n-Ach):</b> Conceptualized by David McClelland (1961), individuals possessing high achievement motivation seek out challenging goals, derive deep intrinsic satisfaction from problem-solving, take personal responsibility for performance outcomes, and measure self-worth through tangible business milestones.",
        "<b>(d) Wealth Accumulation and Financial Prosperity:</b> The prospective opportunity to capture residual economic profit, build substantial enterprise equity value, and secure intergenerational wealth that far exceeds the linear earning ceiling of salaried employment."
    ]
    for pi in pull_items:
        story.append(Paragraph(pi, body_item))

    story.append(Paragraph("1.2 Push Factors (Necessity-Driven Forces)", h3_style))
    df_push_intro = (
        "Conversely, push factors denote external, coercive, or adverse socioeconomic pressures that compel individuals to enter "
        "entrepreneurship out of economic necessity, survival, or lack of satisfactory alternatives. This phenomenon is especially "
        "pronounced in developing and emerging markets characterized by structural labor market deficits:"
    )
    story.append(Paragraph(df_push_intro, body_style))

    push_items = [
        "<b>(a) Unemployment and Underemployment:</b> When formal labor markets fail to absorb graduates and skilled labor, self-employment emerges as the sole viable mechanism to prevent destitution and guarantee personal livelihood.",
        "<b>(b) Corporate Retrenchment and Job Insecurity:</b> Macroeconomic recessions, structural adjustment policies, corporate mergers, and technological automation frequently displace mid-career professionals, who are subsequently pushed into establishing commercial ventures.",
        "<b>(c) Dissatisfaction with Prior Employment:</b> Toxic work environments, perceived wage exploitation, systemic glass ceilings, and professional boredom create unbearable cognitive dissonance, compelling employees to resign and create their own enterprises.",
        "<b>(d) Economic Survival and Family Sustenance:</b> For millions of micro-entrepreneurs across Africa, enterprise creation is an immediate survival mechanism deployed to feed households, cover basic healthcare, and pay school fees in the absence of comprehensive state welfare safety nets."
    ]
    for psh in push_items:
        story.append(Paragraph(psh, body_item))

    story.append(Paragraph("1.3 Systemic and Contextual Catalysts", h3_style))
    df_system = (
        "Beyond purely individualized push and pull stimuli, systemic environmental catalysts play an indispensable role in accelerating "
        "entrepreneurial initiatives. The rapid diffusion of information and communication technologies (ICT), cloud computing, "
        "e-commerce platforms, and digital payment gateways has drastically democratized market entry, radically diminishing the initial "
        "capital expenditure historically required to launch a commercial venture. Furthermore, institutional incentives—such as "
        "streamlined corporate registration portals, public small-business credit guarantees, entrepreneurship education curriculums, "
        "and specialized enterprise incubation hubs—provide fertile institutional backing. Finally, sociocultural legitimacy, wherein "
        "a community actively valorizes, respects, and rewards entrepreneurial initiative, fosters a vibrant social climate wherein "
        "young people actively aspire to venture creation rather than passive employment."
    )
    story.append(Paragraph(df_system, body_style))
    story.append(Spacer(1, 4))

    # --- TOPIC 2: CREATIVITY AND CREATIVE IDEAS ---
    story.append(Paragraph("2. Concept of Creativity and Forms of Creative Ideas", h2_style))

    cr_p1 = (
        "Creativity forms the indispensable intellectual fountainhead of all entrepreneurial endeavors. In academic management "
        "literature, creativity is defined as the cognitive ability to combine previously disparate concepts, resources, or knowledge "
        "domains to generate novel, original, and valuable ideas, processes, or solutions that resolve real-world problems or satisfy "
        "unmet market demands (Amabile, 1996). However, an essential distinction must be maintained between creativity, innovation, "
        "and entrepreneurship: creativity refers to the mental ideation of novel concepts; innovation constitutes the practical "
        "refinement, development, and commercial conversion of those concepts into functional products or services; and entrepreneurship "
        "represents the holistic business process of assembling resources, bearing risks, and building an organization to commercialize "
        "those innovations sustainably within competitive markets."
    )
    story.append(Paragraph(cr_p1, body_style))

    cr_process = (
        "To comprehend how creative ideas emerge, scholars frequently rely on Graham Wallas's (1926) foundational five-stage model "
        "of the creative process: (1) Preparation (deliberate investigation, data gathering, and active problem framing); "
        "(2) Incubation (a period of non-conscious mental processing where the subconscious synthesizes diverse information without "
        "cognitive rigidity); (3) Intimation (the intuitive premonition that a coherent solution is imminent); (4) Illumination "
        "(the iconic breakthrough 'eureka' moment where the creative insight crystallizes into conscious clarity); and (5) Verification "
        "(rigorous empirical testing, financial modeling, prototyping, and critical validation to confirm commercial viability)."
    )
    story.append(Paragraph(cr_process, body_style))

    story.append(Paragraph("2.1 Forms and Typologies of Creative Ideas", h3_style))
    cr_forms_intro = (
        "Within commercial environments, creative business ideas manifest across five distinct structural forms, each carrying different "
        "resource requirements, technological complexities, and risk profiles:"
    )
    story.append(Paragraph(cr_forms_intro, body_style))

    forms_items = [
        "<b>(a) Invention (Radical or Breakthrough Innovation):</b> The total creation of an unprecedented, novel product, service, or technological architecture that possesses no historical market equivalent. Inventions typically emerge from scientific discoveries or patentable engineering breakthroughs. Historical archetypes include Thomas Edison's electric lighting system, Alexander Graham Bell's telephone, and in contemporary times, artificial intelligence neural transformers.",
        "<b>(b) Duplication (Creative Replication and Adaptation):</b> The deliberate replication of an established, validated business model or product concept within a different geographic market or demographic niche, accompanied by indispensable localized modifications. A prominent example is the founding of Jumia in 2012, which adapted the Amazon e-commerce framework to the distinct logistics, mobile internet adoption, and cash-on-delivery realities of African urban centers.",
        "<b>(c) Extension (Incremental Innovation and Line Expansion):</b> The strategic process of taking an established, commercially mature product or service and extending its functionality, performance envelope, or operational scope into adjacent use-cases. An illustrative archetype is the gradual evolution of cellular telecommunications hardware from basic voice-and-SMS handsets into high-powered, multimedia smartphones equipped with biometric sensors and touchscreens.",
        "<b>(d) Synthesis (Integrative Innovation):</b> The innovative combination of two or more existing, disparate ideas, technologies, or operational systems into a completely unified, hybrid solution that delivers superior utility. The most ubiquitous contemporary illustration is Financial Technology (FinTech)—such as Paystack, Flutterwave, and M-Pesa—which synthesized traditional banking services with mobile telecommunications infrastructure and internet protocols.",
        "<b>(e) Disruptive Innovation:</b> As conceptualized by Clayton Christensen (1997), disruptive innovation describes the process whereby a simpler, more affordable, and convenient product initially takes root at the lower, unserved tier of a market and subsequently moves relentlessly upmarket, displacing established legacy market leaders (e.g., digital streaming displacing physical media retail)."
    ]
    for fi in forms_items:
        story.append(Paragraph(fi, body_item))

    story.append(Spacer(1, 4))

    # --- TOPIC 3: RISK BEARING ---
    story.append(Paragraph("3. Concept of Risk Bearing in Entrepreneurship", h2_style))

    risk_p1 = (
        "The assumption of risk is widely recognized as one of the defining historical hallmarks of the entrepreneurial function. "
        "Early economic theorists, notably Richard Cantillon in 1755, laid the theoretical bedrock of entrepreneurship by defining "
        "the entrepreneur as an economic actor who purchases goods and services at known, fixed costs in order to produce and sell "
        "them at unknown, fluctuating prices in the future, thereby consciously absorbing the residual financial exposure of market "
        "volatility. This conceptualization established that without the willingness to bear financial and operational jeopardy, "
        "enterprise creation cannot take place."
    )
    story.append(Paragraph(risk_p1, body_style))

    story.append(Paragraph("3.1 The Theoretical Dichotomy: Measurable Risk versus Knightian Uncertainty", h3_style))
    risk_knight = (
        "In his seminal 1921 treatise, <i>Risk, Uncertainty and Profit</i>, economist Frank H. Knight articulated a fundamental, "
        "qualitative distinction between 'measurable risk' and 'true uncertainty': "
        "(a) Measurable Risk (Actuarial Risk): Pertains to decision environments where the full spectrum of potential future outcomes "
        "is known, and the mathematical probability distribution of those outcomes can be precisely calculated through actuarial data, "
        "historical records, or statistical modeling (e.g., fire hazards, shipping cargo loss, employee theft). Because these risks "
        "are quantifiable, they can be hedged or transferred to third-party underwriters through commercial insurance contracts. "
        "(b) True Uncertainty (Knightian Uncertainty): Pertains to unique, non-insurable economic situations where the future state of "
        "the market is intrinsically unknowable, and statistical probabilities cannot be assigned because the events are unprecedented "
        "(e.g., consumer reception of a revolutionary technology, geopolitical shifts). Knight argued that pure economic profit is the "
        "residual reward earned exclusively by the entrepreneur for willingly shouldering non-quantifiable Knightian uncertainty."
    )
    story.append(Paragraph(risk_knight, body_style))

    story.append(Paragraph("3.2 Multidimensional Nature of Entrepreneurial Risk", h3_style))
    risk_multi_intro = (
        "Contrary to the narrow perception that entrepreneurial risk is confined to financial loss, empirical analysis demonstrates "
        "that entrepreneurs navigate multidimensional risks across four interconnected domains:"
    )
    story.append(Paragraph(risk_multi_intro, body_style))

    risk_items = [
        "<b>(1) Financial Risk:</b> The tangible hazard of losing personal savings, mortgaged family real estate, invested equity, and credit standing. In the event of corporate insolvency, founders face severe personal exposure where personal guarantees were extended.",
        "<b>(2) Career and Opportunity Risk:</b> The irreversible forfeiture of guaranteed monthly salaries, structured corporate promotion pathways, institutional pensions, and professional seniority. An individual who leaves a corporate trajectory risks occupational dislocation if the venture collapses.",
        "<b>(3) Psychological and Psychic Risk:</b> The severe emotional toll, acute stress, chronic insomnia, and psychological vulnerability resulting from relentless operational pressures and fear of public failure. Because founders deeply intertwine personal identity with business success, business distress frequently triggers severe emotional exhaustion.",
        "<b>(4) Social and Relational Risk:</b> The acute strain placed upon personal relationships, marriages, and family cohesion due to the extreme work hours, emotional preoccupation, and financial volatility demanded during venture development."
    ]
    for ri in risk_items:
        story.append(Paragraph(ri, body_item))

    story.append(Paragraph("3.3 The Reality of Calculated Risk-Taking", h3_style))
    risk_calc = (
        "A critical academic insight is that successful entrepreneurs are not reckless, thrill-seeking gamblers. Empirical studies "
        "(Brockhaus, 1980; Sarasvathy, 2001) demonstrate that elite entrepreneurs exhibit moderate, calculated risk propensities. "
        "Rather than taking wild risks, they actively seek to identify, deconstruct, and systematically minimize venture exposure through "
        "deliberate risk mitigation strategies: applying the principle of 'affordable loss' (limiting investments strictly to what one "
        "can afford to forfeit without catastrophic ruin), executing lean iterative prototyping, sharing risk through equity syndicates "
        "and strategic joint ventures, and securing advance customer pre-orders before committing capital expenditure."
    )
    story.append(Paragraph(risk_calc, body_style))
    story.append(Spacer(1, 4))

    # --- TOPIC 4: ENVIRONMENTAL VARIABLES ---
    story.append(Paragraph("4. Internal and External Environmental Variables for Entrepreneurial Development", h2_style))

    env_p1 = (
        "Business ventures are open, adaptive socio-technical systems that exist in perpetual exchange with their environment. The "
        "development, operational continuity, and long-term survival of an enterprise are determined by the dynamic alignment—or "
        "strategic fit—achieved between its internal operational capabilities and the external macroeconomic and microeconomic forces "
        "surrounding it. While internal environmental variables are subject to direct managerial control, external environmental "
        "variables are largely exogenous, requiring the venture to develop robust surveillance, flexibility, and adaptive strategies."
    )
    story.append(Paragraph(env_p1, body_style))

    story.append(Paragraph("4.1 Internal Environmental Variables (Controllable Factors)", h3_style))
    env_internal_intro = (
        "Rooted in the Resource-Based View (RBV) of the firm (Barney, 1991), internal variables comprise endogenous assets and capabilities "
        "under direct managerial control that confer sustainable competitive advantage when valuable, rare, and inimitable:"
    )
    story.append(Paragraph(env_internal_intro, body_style))

    internal_items = [
        "<b>(a) Human Capital and Founder Competencies:</b> Academic knowledge, industry experience, technical acumen, emotional intelligence, and execution discipline of the founding team. Leadership deficits represent the most potent internal bottleneck to venture scaling.",
        "<b>(b) Financial Capital and Liquidity Structure:</b> The capitalization base, retained earnings reserves, working capital management, debt-equity ratio, and disciplined operating cash flow. Adequate cash buffers protect the enterprise during market downturns.",
        "<b>(c) Organizational Culture and Values:</b> Informal shared norms, operational ethics, dedication to customer satisfaction, meritocratic incentives, and openness to adaptive change.",
        "<b>(d) Technological Capability and Proprietary Assets:</b> Specialized manufacturing tools, enterprise software architectures, registered trademarks, patents, proprietary algorithms, and trade secrets that erect protective barriers against competitor duplication.",
        "<b>(e) Organizational Structure and Internal Control Systems:</b> Delineated lines of authority, rigorous cost accounting controls, inventory monitoring procedures, and sound corporate governance standards that prevent organizational entropy and fraud."
    ]
    for ii in internal_items:
        story.append(Paragraph(ii, body_item))

    story.append(Paragraph("4.2 External Environmental Variables (Uncontrollable / Contextual Factors)", h3_style))
    story.append(Paragraph("A. The Micro-Environment (Task / Operating Environment)", h3_style))

    micro_items = [
        "<b>(1) Customers and Consumer Demand:</b> Shifting consumer preferences, demographic profiles, purchasing power, and price sensitivity directly dictate corporate revenue streams.",
        "<b>(2) Suppliers and Input Costs:</b> Pricing power, quality consistency, and credit terms offered by material and service vendors. Severe supplier concentration can compress operating margins.",
        "<b>(3) Competitors and Industry Rivalry:</b> Aggressive positioning, predatory pricing strategies, promotional battles, and product innovations by direct rivals and substitute producers (Porter, 1985).",
        "<b>(4) Financial and Marketing Intermediaries:</b> Commercial banks, venture funds, wholesale distributors, retail agents, and logistics providers linking the firm to target markets."
    ]
    for mi in micro_items:
        story.append(Paragraph(mi, body_item))

    story.append(Paragraph("B. The Macro-Environment (PESTLE Framework)", h3_style))

    macro_items = [
        "<b>(1) Political Environment:</b> Political regime stability, democratic continuity, trade policies, national security, and civil peace. Instability immediately elevates commercial risk.",
        "<b>(2) Economic Environment:</b> Macroeconomic parameters such as inflation rates, currency foreign exchange volatility, monetary policy interest rates, and GDP trajectories. In Nigeria, sharp currency depreciations and inflation severely escalate production costs.",
        "<b>(3) Socio-Cultural Environment:</b> Prevailing social values, religious ethics, educational levels, urban-rural migration patterns, and consumption ethics influencing market receptivity.",
        "<b>(4) Technological Environment:</b> The pace of technological obsolescence, internet penetration, mobile device ubiquity, and digital automation transforming operating dynamics.",
        "<b>(5) Legal and Regulatory Environment:</b> Statutory business registration protocols, tax codes, minimum wage legislation, environmental regulations, and judicial contract enforcement.",
        "<b>(6) Ecological and Physical Environment:</b> Natural resource availability, climatic conditions, alongside acute infrastructural realities such as chronic deficits in national electric power grids and transportation networks."
    ]
    for mci in macro_items:
        story.append(Paragraph(mci, body_item))

    story.append(Spacer(1, 4))

    # --- TOPIC 5: CHALLENGES AND CAUSES OF FAILURE ---
    story.append(Paragraph("5. Challenges and Causes of Failure in Business Ventures", h2_style))

    fail_p1 = (
        "The empirical landscape of venture creation is characterized by severe operational fragility and high mortality rates. Global "
        "empirical data consistently demonstrate that approximately 20% of new business ventures fail within their first year, roughly "
        "50% collapse by the end of their fifth year, and upwards of 70% dissolve before completing a decade of commercial operation "
        "(SBA, 2023). Within developing African economies, these mortality rates are even more pronounced due to institutional voids "
        "and severe macroeconomic turbulence. Venture failure is rarely the outcome of a single isolated shock; instead, it is "
        "typically the catastrophic culmination of cascading internal managerial deficiencies compounded by unforgiving external shocks."
    )
    story.append(Paragraph(fail_p1, body_style))

    story.append(Paragraph("5.1 Internal Causes of Business Failure", h3_style))
    fail_internal_items = [
        "<b>(a) Severe Cash Flow Depletion and Under-Capitalization:</b> Cash flow is the operational bloodstream of an enterprise. A large proportion of ventures fail because liquid cash reserves are depleted before revenues materialize. Poor working capital cycles, excessive debt leverage, long payment cycles from corporate clients, and undisciplined capital expenditures rapidly induce technical insolvency.",
        "<b>(b) Absence of Market Need (Product-Market Mismatch):</b> Rigorous empirical autopsies of collapsed startups (CB Insights, 2021) reveal that the single greatest cause of venture death (accounting for ~35–42% of failures) is developing products without verifying paying market demand.",
        "<b>(c) Managerial Incompetence and Strategic Myopia:</b> Technical competence does not equate to managerial aptitude. Brilliant craftsmen or programmers often lack literacy in strategic planning, pricing algorithms, financial bookkeeping, and personnel administration.",
        "<b>(d) Premature Scaling:</b> Attempting to rapidly expand marketing expenditures, hire large headcounts, and lease expensive corporate facilities before achieving indisputable product-market fit burns scarce capital on unsustainable acquisition.",
        "<b>(e) Co-Founder Conflict and Team Dysfunction:</b> Disagreements regarding corporate vision, equity ownership distribution, executive compensation, and work ethics frequently create destructive internal gridlock, culminating in venture dissolution.",
        "<b>(f) Internal Fraud, Poor Inventory Controls, and Account Commingling:</b> Commingling personal and business funds, inadequate accounting audits, and lack of inventory monitoring systems leave the venture highly vulnerable to employee pilferage and cash embezzlement."
    ]
    for fii in fail_internal_items:
        story.append(Paragraph(fii, body_item))

    story.append(Paragraph("5.2 External Challenges and Causes of Business Failure", h3_style))
    fail_external_items = [
        "<b>(a) Macroeconomic Shocks and Currency Devaluation:</b> Hyperinflation, sharp currency devaluations, and spikes in central bank interest rates compress consumer purchasing power while exponentially inflating operational production and imported input costs.",
        "<b>(b) Severe Infrastructural Deficits:</b> In developing nations like Nigeria, persistent failure of national electricity grids forces small enterprises to rely on expensive diesel generators, increasing overhead by 30% to 50% relative to foreign competitors.",
        "<b>(c) Policy Inconsistency and Multiple Taxation:</b> Arbitrary regulatory shifts, sudden sector bans, foreign exchange allocation restrictions, and overlapping levies imposed by local, state, and federal tax agencies create a hostile business climate.",
        "<b>(d) Predatory Incumbent Competition:</b> Monopolistic or well-capitalized industry incumbents that retaliate against emerging entrants through aggressive price wars, exclusive distributor lockouts, and overwhelming advertising budgets.",
        "<b>(e) Unforeseen Force Majeure and Systemic Shocks:</b> Exogenous black-swan events—such as pandemics (COVID-19 lockdowns), civil unrest, localized riots, and natural ecological disasters—that sever supply chains and halt commercial revenue generation overnight."
    ]
    for fei in fail_external_items:
        story.append(Paragraph(fei, body_item))

    story.append(Paragraph("5.3 Strategic Frameworks for Venture Survival and Resilience", h3_style))
    fail_strategy_items = [
        "<b>(1) Implementation of the Lean Startup Methodology:</b> Prioritizing iterative experimentation, continuous customer feedback, and rapid deployment of Minimum Viable Products (MVPs) to validate commercial assumptions prior to committing major financial resources (Ries, 2011).",
        "<b>(2) Conservative Financial Stewardship:</b> Maintaining a mandatory liquid cash buffer covering 6 to 12 months of operational overheads, enforcing rigorous cash-flow forecasting, conducting routine external audits, and strictly separating founder personal finances from corporate revenue.",
        "<b>(3) Continuous Environmental Scanning:</b> Systematically utilizing SWOT and PESTLE frameworks to monitor macroeconomic volatility, track changing statutory regulations, and anticipate competitor maneuvers well in advance.",
        "<b>(4) Establishing Independent Advisory Boards:</b> Assembling seasoned industry mentors, legal advisors, and financial specialists who provide strategic oversight, governance accountability, and objective counsel to mitigate founder blindspots."
    ]
    for fsi in fail_strategy_items:
        story.append(Paragraph(fsi, body_item))

    story.append(Spacer(1, 10))

    # ==========================
    # SECTION C: REFERENCES
    # ==========================
    story.append(Paragraph("(C) REFERENCES", h1_style))
    story.append(Spacer(1, 4))

    references_list = [
        "Amabile, T. M. (1996). <i>Creativity in context: Update to the social psychology of creativity</i>. Westview Press.",
        "Barney, J. (1991). Firm resources and sustained competitive advantage. <i>Journal of Management</i>, 17(1), 99–120. https://doi.org/10.1177/014920639101700108",
        "Brockhaus, R. H. (1980). Risk taking propensity of entrepreneurs. <i>Academy of Management Journal</i>, 23(3), 509–520. https://doi.org/10.2307/255515",
        "Cantillon, R. (1755). <i>Essai sur la nature du commerce en général</i> (H. Higgs, Trans., 1931). Macmillan.",
        "CB Insights. (2021). <i>The top 12 reasons startups fail</i>. CB Information Services Inc.",
        "Christensen, C. M. (1997). <i>The innovator's dilemma: When new technologies cause great firms to fail</i>. Harvard Business School Press.",
        "Dew, N., Sarasvathy, S. D., Read, S., & Wiltbank, R. (2009). Affordable loss: How entrepreneurs balance risk and return in decision making. <i>Long Range Planning</i>, 42(4), 488–506. https://doi.org/10.1016/j.lrp.2009.05.004",
        "Drucker, P. F. (1985). <i>Innovation and entrepreneurship: Practice and principles</i>. Harper & Row.",
        "Kirzner, I. M. (1973). <i>Competition and entrepreneurship</i>. University of Chicago Press.",
        "Knight, F. H. (1921). <i>Risk, uncertainty and profit</i>. Houghton Mifflin.",
        "McClelland, D. C. (1961). <i>The achieving society</i>. D. Van Nostrand Co.",
        "Porter, M. E. (1985). <i>Competitive advantage: Creating and sustaining superior performance</i>. Free Press.",
        "Ries, E. (2011). <i>The lean startup: How today's entrepreneurs use continuous innovation to create radically successful businesses</i>. Crown Business.",
        "Sarasvathy, S. D. (2001). Causation and effectuation: Toward a theoretical shift from economic inevitability to entrepreneurial contingency. <i>Academy of Management Review</i>, 26(2), 243–263. https://doi.org/10.5465/amr.2001.4378020",
        "Schumpeter, J. A. (1934). <i>The theory of economic development: An inquiry into profits, capital, credit, interest, and the business cycle</i>. Harvard University Press.",
        "Shane, S., & Venkataraman, S. (2000). The promise of entrepreneurship as a field of research. <i>Academy of Management Review</i>, 25(1), 217–226. https://doi.org/10.5465/amr.2000.2791611",
        "Small Business Administration [SBA]. (2023). <i>Frequently asked questions about small business survival and mortality</i>. U.S. Small Business Administration Office of Advocacy.",
        "Timmons, J. A., & Spinelli, S. (2008). <i>New venture creation: Entrepreneurship for the 21st century</i> (8th ed.). McGraw-Hill/Irwin.",
        "Wallas, G. (1926). <i>The art of thought</i>. Harcourt, Brace and Company."
    ]

    for ref in references_list:
        story.append(Paragraph(ref, ref_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Document successfully created at: {filename}")

if __name__ == "__main__":
    output_pdf = r"c:\Users\TechBuddy\Desktop\techBuddy\ENT_302_402_Assignment_Anita_Amos.pdf"
    build_pdf(output_pdf)
