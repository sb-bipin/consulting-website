import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcryptjs";

export async function seedDatabase(): Promise<void> {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Seeding swostik_consulting ...");

    // Clear existing data (order matters due to FKs)
    await prisma.application.deleteMany();
    await prisma.job.deleteMany();
    await prisma.country.deleteMany();
    await prisma.category.deleteMany();
    await prisma.service.deleteMany();
    await prisma.testimonial.deleteMany();
    await prisma.faq.deleteMany();
    await prisma.notice.deleteMany();
    await prisma.inquiry.deleteMany();
    await prisma.siteSetting.deleteMany();
    await prisma.admin.deleteMany();

    // Admin
    const adminEmail = process.env.ADMIN_EMAIL || "admin@swostik.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    await prisma.admin.create({
      data: {
        name: "Super Admin",
        email: adminEmail,
        passwordHash: await bcrypt.hash(adminPassword, 10),
        role: "ADMIN",
      },
    });
    console.log(`  Admin created: ${adminEmail} / ${adminPassword}`);

    // Countries
    const countryData = [
      { nameEn: "Malaysia", nameNe: "मलेसिया", slug: "malaysia", flag: "🇲🇾" },
      { nameEn: "Qatar", nameNe: "कतार", slug: "qatar", flag: "🇶🇦" },
      { nameEn: "Saudi Arabia", nameNe: "साउदी अरब", slug: "saudi-arabia", flag: "🇸🇦" },
      { nameEn: "United Arab Emirates", nameNe: "संयुक्त अरब इमिरेट्स", slug: "uae", flag: "🇦🇪" },
      { nameEn: "Kuwait", nameNe: "कुवेत", slug: "kuwait", flag: "🇰🇼" },
      { nameEn: "Oman", nameNe: "ओमान", slug: "oman", flag: "🇴🇲" },
      { nameEn: "Bahrain", nameNe: "बहराइन", slug: "bahrain", flag: "🇧🇭" },
      { nameEn: "South Korea", nameNe: "दक्षिण कोरिया", slug: "south-korea", flag: "🇰🇷" },
      { nameEn: "Japan", nameNe: "जापान", slug: "japan", flag: "🇯🇵" },
      { nameEn: "Romania", nameNe: "रोमानिया", slug: "romania", flag: "🇷🇴" },
      { nameEn: "Croatia", nameNe: "क्रोएशिया", slug: "croatia", flag: "🇭🇷" },
      { nameEn: "Poland", nameNe: "पोल्याण्ड", slug: "poland", flag: "🇵🇱" },
    ].map((c, i) => ({
      ...c,
      order: i,
      descriptionEn: `We process verified, government-approved job demands for ${c.nameEn} with complete visa, medical and travel support.`,
      descriptionNe: `${c.nameEn} का लागि प्रमाणित र सरकारी स्वीकृत रोजगार मागहरू — भिसा, मेडिकल र यात्रा सहयोग सहित।`,
    }));
    const countries = await Promise.all(
      countryData.map((c) => prisma.country.create({ data: c }))
    );
    const countryBySlug = Object.fromEntries(countries.map((c) => [c.slug, c]));

    // Categories
    const categoryData = [
      { nameEn: "Construction", nameNe: "निर्माण", slug: "construction", icon: "bi-cone-striped" },
      { nameEn: "Factory & Manufacturing", nameNe: "कारखाना तथा उत्पादन", slug: "factory", icon: "bi-gear-wide-connected" },
      { nameEn: "Hospitality & Tourism", nameNe: "आतिथ्य तथा पर्यटन", slug: "hospitality", icon: "bi-cup-hot" },
      { nameEn: "Transportation & Driving", nameNe: "यातायात तथा ड्राइभिङ", slug: "driving", icon: "bi-truck" },
      { nameEn: "Security Services", nameNe: "सुरक्षा सेवा", slug: "security", icon: "bi-shield-shaded" },
      { nameEn: "Healthcare & Caregiving", nameNe: "स्वास्थ्य तथा क्यारेगिभिङ", slug: "healthcare", icon: "bi-heart-pulse" },
      { nameEn: "Agriculture & Farming", nameNe: "कृषि तथा खेती", slug: "agriculture", icon: "bi-tree" },
      { nameEn: "Logistics & Warehouse", nameNe: "लजिस्टिक्स तथा गोदाम", slug: "logistics", icon: "bi-box-seam" },
      { nameEn: "Cleaning & Housekeeping", nameNe: "सफाई तथा हाउसकिपिङ", slug: "cleaning", icon: "bi-brush" },
      { nameEn: "Welding & Fabrication", nameNe: "वेल्डिङ तथा फेब्रिकेसन", slug: "welding", icon: "bi-tools" },
    ].map((c, i) => ({ ...c, order: i }));
    const categories = await Promise.all(
      categoryData.map((c) => prisma.category.create({ data: c }))
    );
    const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

    // Jobs
    const future = (days: number) => new Date(Date.now() + days * 86400000);
    const jobsData = [
      {
        slug: "construction-worker-qatar",
        titleEn: "Construction Worker",
        titleNe: "निर्माण कामदार",
        company: "Al Wakrah Contracting LLC",
        countryId: countryBySlug["qatar"].id,
        categoryId: categoryBySlug["construction"].id,
        salaryMin: 45000,
        salaryMax: 60000,
        vacancies: 120,
        workingHours: "8 hrs/day, 6 days/week",
        contractDuration: "2 years (renewable)",
        accommodation: true,
        food: true,
        overtime: true,
        isFeatured: true,
        deadline: future(30),
        interviewDate: future(15),
        descriptionEn:
          "Excellent opportunity for experienced construction workers in Qatar. Work on large-scale infrastructure projects with free accommodation, food and overtime.",
        descriptionNe:
          "कतारमा अनुभवी निर्माण कामदारहरूका लागि उत्कृष्ट अवसर। निःशुल्क आवास, खाना र ओभरटाइम सहित ठूला पूर्वाधार परियोजनामा काम।",
        requirementsEn:
          "- Age 21-40\n- Minimum 1 year construction experience\n- Valid passport & medical fitness\n- Basic English/Nepali communication",
        requirementsNe:
          "- उमेर २१-४० वर्ष\n- कम्तीमा १ वर्ष निर्माण अनुभव\n- मान्य राहदानी र मेडिकल योग्यता\n- आधारभूत अंग्रेजी/नेपाली सञ्चार",
        benefitsEn:
          "- Free accommodation & food\n- Overtime pay\n- Medical insurance\n- Paid annual leave\n- Free ticket & visa",
        benefitsNe:
          "- निःशुल्क आवास र खाना\n- ओभरटाइम भत्ता\n- मेडिकल बीमा\n- तलबी बिदा\n- निःशुल्क टिकट र भिसा",
      },
      {
        slug: "factory-operator-malaysia",
        titleEn: "Factory Production Operator",
        titleNe: "कारखाना उत्पादन अपरेटर",
        company: "Sunrise Manufacturing Sdn Bhd",
        countryId: countryBySlug["malaysia"].id,
        categoryId: categoryBySlug["factory"].id,
        salaryMin: 35000,
        salaryMax: 48000,
        vacancies: 200,
        workingHours: "8 hrs + OT",
        contractDuration: "3 years",
        accommodation: true,
        food: false,
        overtime: true,
        isFeatured: true,
        deadline: future(45),
        interviewDate: future(20),
        descriptionEn:
          "Leading electronics and packaging factory in Malaysia hiring production operators. No prior experience required; training provided.",
        descriptionNe:
          "मलेसियाको अग्रणी इलेक्ट्रोनिक्स तथा प्याकेजिङ कारखानाले उत्पादन अपरेटर भर्ना गर्दैछ। पूर्व अनुभव आवश्यक छैन; तालिम दिइनेछ।",
        requirementsEn: "- Age 18-38\n- SPM/SEE or equivalent\n- Physically fit\n- Willing to work shifts",
        requirementsNe: "- उमेर १८-३८ वर्ष\n- एसएलसी/एसईई वा समकक्ष\n- शारीरिक रूपमा फिट\n- सिफ्टमा काम गर्न इच्छुक",
        benefitsEn: "- Free hostel\n- Overtime\n- Medical benefits\n- Renewal bonus",
        benefitsNe: "- निःशुल्क छात्रावास\n- ओभरटाइम\n- मेडिकल सुविधा\n- नविकरण बोनस",
      },
      {
        slug: "hospitality-staff-uae",
        titleEn: "Hotel Housekeeping Staff",
        titleNe: "होटल हाउसकिपिङ स्टाफ",
        company: "Emirates Grand Hospitality",
        countryId: countryBySlug["uae"].id,
        categoryId: categoryBySlug["hospitality"].id,
        salaryMin: 55000,
        salaryMax: 75000,
        vacancies: 40,
        workingHours: "8 hrs/day",
        contractDuration: "2 years",
        accommodation: true,
        food: true,
        overtime: true,
        isFeatured: true,
        deadline: future(25),
        interviewDate: future(10),
        descriptionEn:
          "5-star hotels in Dubai & Abu Dhabi require housekeeping staff. Good grooming, hospitality attitude and basic English required.",
        descriptionNe:
          "दुबई र अबुधाबीका ५-तारा होटलहरूलाई हाउसकिपिङ स्टाफ आवश्यक। राम्रो स्वरूप, आतिथ्य व्यवहार र आधारभूत अंग्रेजी आवश्यक।",
        requirementsEn: "- Age 21-35\n- Good communication\n- Hospitality experience preferred\n- Clean background",
        requirementsNe: "- उमेर २१-३५ वर्ष\n- राम्रो सञ्चार\n- आतिथ्य अनुभव प्राथमिकता\n- स्वच्छ पृष्ठभूमि",
        benefitsEn: "- Free accommodation & duty meals\n- Service charge\n- Medical insurance\n- Annual ticket",
        benefitsNe: "- निःशुल्क आवास र ड्युटी खाना\n- सर्भिस चार्ज\n- मेडिकल बीमा\n- वार्षिक टिकट",
      },
      {
        slug: "heavy-driver-saudi",
        titleEn: "Heavy Vehicle Driver",
        titleNe: "भारी सवारी चालक",
        company: "Riyadh Logistics Co.",
        countryId: countryBySlug["saudi-arabia"].id,
        categoryId: categoryBySlug["driving"].id,
        salaryMin: 60000,
        salaryMax: 85000,
        vacancies: 60,
        workingHours: "10 hrs/day",
        contractDuration: "2 years",
        accommodation: true,
        food: true,
        overtime: true,
        isFeatured: false,
        deadline: future(35),
        descriptionEn:
          "Requires licensed heavy/trailer drivers with Gulf experience for logistics company in Riyadh.",
        descriptionNe:
          "रियादको लजिस्टिक्स कम्पनीले खाडी अनुभव भएका इजाजतपत्रधारी भारी/ट्रेलर चालकहरू खोज्दैछ।",
        requirementsEn: "- Valid heavy license\n- Gulf driving experience\n- Age 25-45\n- Clean record",
        requirementsNe: "- मान्य भारी लाइसेन्स\n- खाडी ड्राइभिङ अनुभव\n- उमेर २५-४५ वर्ष\n- स्वच्छ रेकर्ड",
        benefitsEn: "- Accommodation & food\n- Overtime\n- License renewal support",
        benefitsNe: "- आवास र खाना\n- ओभरटाइम\n- लाइसेन्स नविकरण सहयोग",
      },
      {
        slug: "security-guard-kuwait",
        titleEn: "Security Guard",
        titleNe: "सुरक्षा गार्ड",
        company: "Gulf Shield Security",
        countryId: countryBySlug["kuwait"].id,
        categoryId: categoryBySlug["security"].id,
        salaryMin: 40000,
        salaryMax: 55000,
        vacancies: 80,
        workingHours: "12 hrs/shift",
        contractDuration: "2 years",
        accommodation: true,
        food: true,
        overtime: false,
        deadline: future(40),
        descriptionEn:
          "Security guards needed for malls, sites and residential complexes in Kuwait. Training provided on arrival.",
        descriptionNe:
          "कुवेतका मल, साइट र आवासीय परिसरका लागि सुरक्षा गार्ड आवश्यक। आगमनमा तालिम दिइनेछ।",
        requirementsEn: "- Age 21-40\n- Height 5'6\"+\n- Basic English\n- No criminal record",
        requirementsNe: "- उमेर २१-४० वर्ष\n- उचाइ ५ फिट ६ इन्च+\n- आधारभूत अंग्रेजी\n- आपराधिक रेकर्ड नभएको",
        benefitsEn: "- Uniform provided\n- Accommodation & food\n- Medical card",
        benefitsNe: "- पोशाक उपलब्ध\n- आवास र खाना\n- मेडिकल कार्ड",
      },
      {
        slug: "caregiver-japan",
        titleEn: "Caregiver (SSW)",
        titleNe: "क्यारेगिभर (एसएसडब्ल्यू)",
        company: "Sakura Care Partners",
        countryId: countryBySlug["japan"].id,
        categoryId: categoryBySlug["healthcare"].id,
        salaryMin: 150000,
        salaryMax: 200000,
        vacancies: 25,
        workingHours: "8 hrs/day, shift",
        contractDuration: "3-5 years",
        accommodation: true,
        food: false,
        overtime: true,
        isFeatured: true,
        deadline: future(60),
        interviewDate: future(30),
        descriptionEn:
          "Specified Skilled Worker (SSW) caregiver opportunities in Japan. JLPT N4 or JFT-Basic required along with caregiving skills test.",
        descriptionNe:
          "जापानमा एसएसडब्ल्यू क्यारेगिभर अवसर। JLPT N4 वा JFT-Basic र क्यारेगिभिङ सीप परीक्षा आवश्यक।",
        requirementsEn: "- JLPT N4 / JFT-Basic passed\n- Caregiving skills test passed\n- Age 18-45\n- 12th grade preferred",
        requirementsNe: "- JLPT N4 / JFT-Basic उत्तीर्ण\n- क्यारेगिभिङ सीप परीक्षा उत्तीर्ण\n- उमेर १८-४५ वर्ष\n- १२ कक्षा प्राथमिकता",
        benefitsEn: "- High salary\n- Accommodation support\n- Social insurance\n- Family visa eligibility",
        benefitsNe: "- उच्च तलब\n- आवास सहयोग\n- सामाजिक बीमा\n- परिवार भिसा योग्यता",
      },
      {
        slug: "welder-romania",
        titleEn: "MIG/TIG Welder",
        titleNe: "MIG/TIG वेल्डर",
        company: "Carpathia Steel Works",
        countryId: countryBySlug["romania"].id,
        categoryId: categoryBySlug["welding"].id,
        salaryMin: 140000,
        salaryMax: 190000,
        vacancies: 35,
        workingHours: "8 hrs/day",
        contractDuration: "2 years",
        accommodation: true,
        food: false,
        overtime: true,
        isFeatured: false,
        deadline: future(50),
        descriptionEn:
          "European Union work permit welder positions in Romania with full legal contract and family support.",
        descriptionNe:
          "रोमानियामा युरोपेली संघ कार्य अनुमति सहित वेल्डर पदहरू, पूर्ण कानुनी सम्झौता र परिवार सहयोग सहित।",
        requirementsEn: "- 3+ years welding experience\n- Welding certificate preferred\n- EU medical fitness\n- Age 22-45",
        requirementsNe: "- ३ वर्ष+ वेल्डिङ अनुभव\n- वेल्डिङ प्रमाणपत्र प्राथमिकता\n- EU मेडिकल योग्यता\n- उमेर २२-४५ वर्ष",
        benefitsEn: "- EU work permit\n- Overtime\n- Accommodation\n- Path to residency",
        benefitsNe: "- EU कार्य अनुमति\n- ओभरटाइम\n- आवास\n- बसोबासको बाटो",
      },
      {
        slug: "agriculture-worker-south-korea",
        titleEn: "Agriculture Worker (EPS)",
        titleNe: "कृषि कामदार (EPS)",
        company: "EPS Korea",
        countryId: countryBySlug["south-korea"].id,
        categoryId: categoryBySlug["agriculture"].id,
        salaryMin: 160000,
        salaryMax: 220000,
        vacancies: 50,
        workingHours: "8 hrs/day",
        contractDuration: "3 years (renewable)",
        accommodation: true,
        food: true,
        overtime: true,
        isFeatured: true,
        deadline: future(70),
        descriptionEn:
          "Employment Permit System (EPS) agriculture and livestock jobs in South Korea. Korean language test (EPS-TOPIK) required.",
        descriptionNe:
          "दक्षिण कोरियामा रोजगार अनुमति प्रणाली (EPS) कृषि तथा पशुपालन काम। कोरियन भाषा परीक्षा (EPS-TOPIK) आवश्यक।",
        requirementsEn: "- EPS-TOPIK passed\n- Age 18-39\n- Health check\n- No prior deportation",
        requirementsNe: "- EPS-TOPIK उत्तीर्ण\n- उमेर १८-३९ वर्ष\n- स्वास्थ्य जाँच\n- पहिले निर्वासन नभएको",
        benefitsEn: "- High saving potential\n- Full insurance\n- Accommodation & meals\n- Severance pay",
        benefitsNe: "- उच्च बचत सम्भावना\n- पूर्ण बीमा\n- आवास र खाना\n- अन्त्य बेनिफिट",
      },
      {
        slug: "warehouse-worker-croatia",
        titleEn: "Warehouse & Logistics Worker",
        titleNe: "गोदाम तथा लजिस्टिक्स कामदार",
        company: "Adriatic Distribution",
        countryId: countryBySlug["croatia"].id,
        categoryId: categoryBySlug["logistics"].id,
        salaryMin: 120000,
        salaryMax: 160000,
        vacancies: 30,
        workingHours: "8 hrs/day",
        contractDuration: "2 years",
        accommodation: true,
        food: false,
        overtime: true,
        deadline: future(55),
        descriptionEn:
          "Warehouse picker/packer roles in Croatia with EU work permit and modern working conditions.",
        descriptionNe:
          "क्रोएशियामा EU कार्य अनुमति र आधुनिक कार्य वातावरण सहित गोदाम पिकर/प्याकर पदहरू।",
        requirementsEn: "- Basic English\n- Physically fit\n- Age 20-42\n- Warehouse experience a plus",
        requirementsNe: "- आधारभूत अंग्रेजी\n- शारीरिक रूपमा फिट\n- उमेर २०-४२ वर्ष\n- गोदाम अनुभव सहायक",
        benefitsEn: "- EU work permit\n- Accommodation\n- Overtime\n- Health insurance",
        benefitsNe: "- EU कार्य अनुमति\n- आवास\n- ओभरटाइम\n- स्वास्थ्य बीमा",
      },
      {
        slug: "cleaner-bahrain",
        titleEn: "Cleaning Supervisor",
        titleNe: "सफाई सुपरभाइजर",
        company: "Bahrain Facilities Co.",
        countryId: countryBySlug["bahrain"].id,
        categoryId: categoryBySlug["cleaning"].id,
        salaryMin: 38000,
        salaryMax: 52000,
        vacancies: 20,
        workingHours: "8 hrs/day",
        contractDuration: "2 years",
        accommodation: true,
        food: false,
        overtime: true,
        deadline: future(30),
        descriptionEn:
          "Cleaning supervisors and staff for commercial facilities in Bahrain. Leadership experience preferred.",
        descriptionNe:
          "बहराइनका व्यावसायिक भवनका लागि सफाई सुपरभाइजर तथा स्टाफ। नेतृत्व अनुभव प्राथमिकता।",
        requirementsEn: "- Supervisory experience\n- Basic English\n- Age 24-45",
        requirementsNe: "- सुपरिवेक्षण अनुभव\n- आधारभूत अंग्रेजी\n- उमेर २४-४५ वर्ष",
        benefitsEn: "- Accommodation\n- Overtime\n- Medical",
        benefitsNe: "- आवास\n- ओभरटाइम\n- मेडिकल",
      },
      {
        slug: "plumber-oman",
        titleEn: "Plumber / Pipe Fitter",
        titleNe: "प्लम्बर / पाइप फिटर",
        company: "Muscat MEP Services",
        countryId: countryBySlug["oman"].id,
        categoryId: categoryBySlug["construction"].id,
        salaryMin: 48000,
        salaryMax: 65000,
        vacancies: 45,
        workingHours: "9 hrs/day",
        contractDuration: "2 years",
        accommodation: true,
        food: true,
        overtime: true,
        deadline: future(38),
        descriptionEn:
          "MEP company in Muscat hiring skilled plumbers and pipe fitters for commercial projects.",
        descriptionNe:
          "मस्कटको MEP कम्पनीले व्यावसायिक परियोजनाका लागि दक्ष प्लम्बर र पाइप फिटर भर्ना गर्दैछ।",
        requirementsEn: "- 2+ years plumbing experience\n- Trade test\n- Age 22-45",
        requirementsNe: "- २ वर्ष+ प्लम्बिङ अनुभव\n- ट्रेड टेस्ट\n- उमेर २२-४५ वर्ष",
        benefitsEn: "- Accommodation & food\n- Overtime\n- Free visa",
        benefitsNe: "- आवास र खाना\n- ओभरटाइम\n- निःशुल्क भिसा",
      },
      {
        slug: "factory-worker-poland",
        titleEn: "Food Processing Worker",
        titleNe: "खाद्य प्रशोधन कामदार",
        company: "Baltic Foods S.A.",
        countryId: countryBySlug["poland"].id,
        categoryId: categoryBySlug["factory"].id,
        salaryMin: 130000,
        salaryMax: 175000,
        vacancies: 40,
        workingHours: "8 hrs/day",
        contractDuration: "2 years",
        accommodation: true,
        food: false,
        overtime: true,
        isFeatured: false,
        deadline: future(48),
        descriptionEn:
          "Food processing and packaging jobs in Poland with EU work permit and accommodation support.",
        descriptionNe:
          "पोल्याण्डमा EU कार्य अनुमति र आवास सहयोग सहित खाद्य प्रशोधन तथा प्याकेजिङ काम।",
        requirementsEn: "- Basic English\n- Health certificate\n- Age 20-45",
        requirementsNe: "- आधारभूत अंग्रेजी\n- स्वास्थ्य प्रमाणपत्र\n- उमेर २०-४५ वर्ष",
        benefitsEn: "- EU work permit\n- Accommodation\n- Overtime\n- Insurance",
        benefitsNe: "- EU कार्य अनुमति\n- आवास\n- ओभरटाइम\n- बीमा",
      },
    ];

    for (const j of jobsData) {
      await prisma.job.create({
        data: {
          ...j,
          status: "ACTIVE",
          currency: "NPR",
        },
      });
    }
    console.log(`  ${jobsData.length} jobs created`);

    // Services
    await prisma.service.createMany({
      data: [
        {
          titleEn: "International Manpower Recruitment",
          titleNe: "अन्तर्राष्ट्रिय जनशक्ति भर्ना",
          descriptionEn:
            "End-to-end recruitment of skilled, semi-skilled and unskilled workers matched to genuine overseas employer demands.",
          descriptionNe:
            "विदेशी रोजगारदाताको वास्तविक माग अनुसार दक्ष, अर्ध-दक्ष र अदक्ष कामदारको पूर्ण भर्ना सेवा।",
          icon: "bi-globe2",
          order: 0,
        },
        {
          titleEn: "Documentation & Visa Processing",
          titleNe: "कागजात तथा भिसा प्रक्रिया",
          descriptionEn:
            "Complete assistance with demand attestation, DoFE approval, work permits, medical and visa processing.",
          descriptionNe:
            "माग प्रमाणीकरण, वैदेशिक रोजगार विभाग स्वीकृति, कार्य अनुमति, मेडिकल र भिसा प्रक्रियामा पूर्ण सहयोग।",
          icon: "bi-file-earmark-check",
          order: 1,
        },
        {
          titleEn: "Skill Testing & Training",
          titleNe: "सीप परीक्षण तथा तालिम",
          descriptionEn:
            "Trade tests, skill assessment and job-ready training to meet international employer standards.",
          descriptionNe:
            "अन्तर्राष्ट्रिय रोजगारदाताको मापदण्ड अनुसार ट्रेड टेस्ट, सीप मूल्याङ्कन र रोजगार-तयार तालिम।",
          icon: "bi-mortarboard",
          order: 2,
        },
        {
          titleEn: "Pre-Departure Orientation (PDOP)",
          titleNe: "प्रस्थान-पूर्व अभिमुखीकरण (PDOP)",
          descriptionEn:
            "Mandatory orientation on destination laws, workplace culture, safety, rights and financial literacy.",
          descriptionNe:
            "गन्तव्य देशको कानुन, कार्य संस्कृति, सुरक्षा, अधिकार र वित्तीय साक्षरतामा अनिवार्य अभिमुखीकरण।",
          icon: "bi-airplane",
          order: 3,
        },
        {
          titleEn: "Post-Placement Support",
          titleNe: "पदस्थापन पश्चात सहयोग",
          descriptionEn:
            "Continuous follow-up with workers and employers to ensure smooth, safe and sustainable employment.",
          descriptionNe:
            "कामदार र रोजगारदातासँग निरन्तर सम्पर्क, सुरक्षित र दिगो रोजगार सुनिश्चित गर्न।",
          icon: "bi-headset",
          order: 4,
        },
        {
          titleEn: "Air Ticketing & Travel",
          titleNe: "हवाई टिकट तथा यात्रा",
          descriptionEn:
            "Reliable ticketing, insurance and travel arrangements for a stress-free departure.",
          descriptionNe:
            "तनावमुक्त प्रस्थानका लागि भरपर्दो टिकट, बीमा र यात्रा व्यवस्थापन।",
          icon: "bi-ticket-perforated",
          order: 5,
        },
      ],
    });

    // Testimonials
    await prisma.testimonial.createMany({
      data: [
        {
          name: "Ram Bahadur Tamang",
          position: "Construction Worker, Qatar",
          message:
            "Swostik Overseas guided me from interview to Doha. Everything was transparent and fee-free. I now support my family well.",
          rating: 5,
          order: 0,
        },
        {
          name: "Sita Gurung",
          position: "Housekeeping, Dubai",
          message:
            "The team explained every step honestly. My visa and tickets were on time and the pre-departure training really helped.",
          rating: 5,
          order: 1,
        },
        {
          name: "Bikash Shrestha",
          position: "Factory Operator, Malaysia",
          message:
            "Professional and responsive. They even helped after I arrived. Highly recommended for anyone seeking foreign employment.",
          rating: 5,
          order: 2,
        },
      ],
    });

    // FAQs
    await prisma.faq.createMany({
      data: [
        {
          questionEn: "Is your company legally authorized?",
          questionNe: "तपाईंको कम्पनी कानुनी रूपमा अधिकृत छ?",
          answerEn:
            "Yes. We are licensed by the Department of Foreign Employment (DoFE), Government of Nepal, and operate in full compliance with the Foreign Employment Act.",
          answerNe:
            "हो। हामी वैदेशिक रोजगार विभाग (DoFE), नेपाल सरकारबाट इजाजतपत्र प्राप्त छौं र वैदेशिक रोजगार ऐनको पूर्ण पालना गर्छौं।",
          order: 0,
        },
        {
          questionEn: "How can I apply for a job?",
          questionNe: "म कसरी कामका लागि आवेदन दिन सक्छु?",
          answerEn:
            "Browse our available jobs, open a job and click Apply. Submit the online application with your CV, or contact us via WhatsApp/email or visit our office.",
          answerNe:
            "हाम्रा उपलब्ध जागिर हेर्नुहोस्, जागिर खोल्नुहोस् र Apply थिच्नुहोस्। CV सहित अनलाइन आवेदन बुझाउनुहोस्, वा WhatsApp/इमेल वा कार्यालयमा सम्पर्क गर्नुहोस्।",
          order: 1,
        },
        {
          questionEn: "What documents are required?",
          questionNe: "कुन कागजातहरू आवश्यक छन्?",
          answerEn:
            "A valid passport, recent passport-sized photos, academic/experience certificates and an updated CV. Requirements may vary by job.",
          answerNe:
            "मान्य राहदानी, हालसालै खिचिएको पासपोर्ट साइज फोटो, शैक्षिक/अनुभव प्रमाणपत्र र अद्यावधिक CV। जागिर अनुसार फरक पर्न सक्छ।",
          order: 2,
        },
        {
          questionEn: "Do you charge workers any fee?",
          questionNe: "तपाईंहरू कामदारबाट शुल्क लिनुहुन्छ?",
          answerEn:
            "We follow ethical, zero-hidden-cost recruitment. Any government-mandated costs are transparently disclosed before processing.",
          answerNe:
            "हामी नैतिक र लुकेका शुल्क-रहित भर्ना अभ्यास अपनाउँछौं। सरकारी अनिवार्य खर्च प्रक्रिया अघि पारदर्शी रूपमा जानकारी गराइन्छ।",
          order: 3,
        },
        {
          questionEn: "Do you provide pre-departure training?",
          questionNe: "तपाईंहरू प्रस्थान-पूर्व तालिम दिनुहुन्छ?",
          answerEn:
            "Yes, every selected candidate completes a mandatory Pre-Departure Orientation Program covering laws, culture, safety and workers' rights.",
          answerNe:
            "हो, प्रत्येक छानिएको उम्मेदवारले कानुन, संस्कृति, सुरक्षा र कामदार अधिकार समेट्ने अनिवार्य प्रस्थान-पूर्व अभिमुखीकरण पूरा गर्नुपर्छ।",
          order: 4,
        },
      ],
    });

    // Notices
    await prisma.notice.createMany({
      data: [
        {
          titleEn: "Interview Schedule: Qatar Construction Workers",
          titleNe: "अन्तर्वार्ता तालिका: कतार निर्माण कामदार",
          bodyEn:
            "Final employer interview for Qatar construction workers will be held at our Kathmandu office. Shortlisted candidates will be informed by phone.",
          bodyNe:
            "कतार निर्माण कामदारका लागि अन्तिम रोजगारदाता अन्तर्वार्ता हाम्रो काठमाडौं कार्यालयमा हुनेछ। छनोट भएका उम्मेदवारलाई फोनमार्फत जानकारी गराइनेछ।",
          publishedAt: new Date(),
        },
        {
          titleEn: "Japan SSW Caregiver Intake Open",
          titleNe: "जापान SSW क्यारेगिभर भर्ना खुला",
          bodyEn:
            "Applications are open for Japan Specified Skilled Worker (SSW) caregiver positions. JLPT N4 / JFT-Basic required.",
          bodyNe:
            "जापान एसएसडब्ल्यू क्यारेगिभर पदका लागि आवेदन खुला छ। JLPT N4 / JFT-Basic आवश्यक।",
          publishedAt: new Date(),
        },
      ],
    });

    // Site settings
    await prisma.siteSetting.createMany({
      data: [
        { key: "company_name", value: "Swostik Overseas Pvt. Ltd." },
        { key: "tagline", value: "Your Trusted Gateway to Global Careers" },
        { key: "phone", value: "+977-1-4000000" },
        { key: "phone_alt", value: "+977-9800000000" },
        { key: "whatsapp", value: "9779800000000" },
        { key: "email", value: "info@swostikoverseas.com" },
        { key: "address", value: "Pragati Tole, Kathmandu 44600, Nepal" },
        { key: "office_hours", value: "Sun – Fri | 10:00 AM – 5:00 PM" },
        { key: "license_no", value: "DoFE Licence No. 000/000/000" },
        { key: "facebook", value: "https://facebook.com" },
        { key: "instagram", value: "https://instagram.com" },
        { key: "linkedin", value: "https://linkedin.com" },
        { key: "youtube", value: "https://youtube.com" },
        { key: "stat_placements", value: "25000" },
        { key: "stat_countries", value: "12" },
        { key: "stat_clients", value: "300" },
        { key: "stat_years", value: "15" },
        { key: "about_image_url", value: "/swostik-img.jpg" },
        {
          key: "hero_title_en",
          value: "Build Your Career Abroad With Confidence",
        },
        {
          key: "hero_title_ne",
          value: "आत्मविश्वासका साथ विदेशमा आफ्नो करियर बनाउनुहोस्",
        },
        {
          key: "hero_subtitle_en",
          value:
            "Government-licensed, ethical overseas recruitment connecting Nepali talent with trusted employers across the Gulf, Asia and Europe.",
        },
        {
          key: "hero_subtitle_ne",
          value:
            "सरकारी इजाजतपत्र प्राप्त, नैतिक वैदेशिक भर्ना — नेपाली जनशक्तिलाई खाडी, एसिया र युरोपका भरपर्दा रोजगारदातासँग जोड्दै।",
        },
      ],
    });

    console.log("Seed complete.");
  } finally {
    await prisma.$disconnect();
  }
}
