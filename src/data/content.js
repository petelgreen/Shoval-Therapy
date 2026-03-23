export const BRAND = {
  nameHe: "שובל",
  nameEn: "Shoval Therapy",
  therapistHe: "שובל כהן",
  therapistEn: "Shoval Cohen",
  taglineHe: "נשימה. מגע. ריפוי.",
  taglineEn: "Breath. Touch. Healing.",
  eyebrowHe: "טיפולי עיסוי ורפואה משלימה",
  eyebrowEn: "Massage Therapy & Complementary Medicine",
  instagram: "https://instagram.com/shovaltherapy",
  instagramHandle: "@shovaltherapy",
  phone: "053-553-7072",
  phoneHref: "tel:0535537072",
  whatsapp: "https://wa.me/972535537072",
  addressHe: "סמטת השרון 3, בת ים",
  addressEn: "Smt. HaSharon 3, Bat Yam",
  // legacy alias kept for backward compat
  get address() {
    return this.addressHe;
  },
};

export const NAV_LINKS = [
  { labelHe: "בית", labelEn: "Home", href: "#hero" },
  { labelHe: "אודות", labelEn: "About", href: "#about" },
  { labelHe: "שירותים", labelEn: "Services", href: "#services" },
  { labelHe: "גלריה", labelEn: "Gallery", href: "#gallery" },
  { labelHe: "צור קשר", labelEn: "Contact", href: "#booking" },
];

export const ABOUT = {
  titleHe: "אודותי",
  titleEn: "About Me",
  paragraphsHe: [
    `היי, אני שובל כהן מעסה בכירה 💆🏽‍♀️
האהבה שלי למגע המקצועי התחילה בכלל במקום הכי אישי- מהרצון להבין איך אפשר להרגיש יותר טוב בגוף. 
עם השנים, גיליתי שמה שאני מרגישה דרך הידיים - עובר הלאה. שהמדע הזה יכול לרפא , לשחרר, להרגיע. 
למדתי עיסוי שוודי, עיסוי רקמות עמוק,עיסוי לומי לומי, פוט מסאז׳, עיסוי פנים , עיסוי תאילנדי , עיסוי הריוניות, 
טיפול כוסות רוח אבנים חמות ודיקור מערבי - וכל טיפול אצלי הוא שילוב מדויק  לפי מה שהגוף שלך צריך. 
אני מזמינה אותך לעצור רגע. 
ככה פשוט.
לפרטים נוספים על הטיפולים השונים , מוזמנות לפנות אליי. 

אוהבת , שובל`,
  ],
  paragraphsEn: [
    "My love for this profession began from a personal place — from the desire to understand how it's possible to feel better. Over the years, I discovered that what I feel through my hands passes forward — that this touch can heal, release, and calm.",
    "I have trained in Swedish massage, deep tissue massage, Lomi Lomi, foot massage, facial massage, Thai massage, and pregnancy treatments.",
    "Hot stone and cupping therapy — every treatment with me is a precise combination based on what your body needs.",
  ],
  // legacy alias
  get paragraphs() {
    return this.paragraphsHe;
  },
  credentialsHe: [
    { textHe: "מטפלת עיסוי מוסמכת", textEn: "Certified Massage Therapist" },
    { textHe: "רפואה משלימה", textEn: "Complementary Medicine" },
    { textHe: "ימי צוות וגיבושים", textEn: "Team Building and Cohesion Days" },
    { textHe: "מאות לקוחות מרוצים", textEn: "Hundreds of Satisfied Clients" },
  ],
  get credentials() {
    return this.credentialsHe;
  },
};

export const SERVICES = [
  {
    id: 1,
    durationMins: 60,
    nameHe: "עיסוי משולב לשחרור כאבים",
    nameEn: "Integrated Pain Relief Massage",
    descriptionHe: `העיסוי המשולב טכניקות מהעולם השבדי והרקמות עמוק- עיסוי מותאם לצרכים שלך.
רוגע, שחרור מתחים כאבים והרפיית שרירים✨.`,
    descriptionEn:
      "The massage combines techniques from the Swedish and deep tissue worlds, a massage tailored to your needs. Relaxation, release of tension, pain and muscle relaxation ✨.",
    durationHe: "60 דקות",
    durationEn: "60 minutes",
    price: "₪300",
    highlight: false,
  },
  {
    id: 2,
    durationMins: 90,
    nameHe: `טיפול מפנק 90 דקות`,
    nameEn: "Premium 90-Minute Treatment",
    descriptionHe: `טיפול 90 דקות מפנק, משלב כוסות רוח/אבנים חמות ע"פ רצון הלקוחה,.שבדי,רקמות עמוק ותאילנדי.שחרור מלא לגוף ולנפש.`,
    descriptionEn:
      "A pampering 90-minute treatment, combining cupping/hot stones according to the client's wishes. Swedish, deep tissue and Thai. Complete release for body and mind 💆‍♀️.",
    durationHe: "90 דקות",
    durationEn: "90 minutes",
    price: "₪400",
    highlight: true,
  },
  {
    id: 3,
    durationMins: 45,
    nameHe: `עיסוי ממוקד 45 דקות`,
    nameEn: "Focused 45-Minute Massage",
    descriptionHe: `טיפול שמתאים למי שזקוקה לשחרור ממוקד עם תחושת רוגע כללית.מתמקד באזורים שבחרת-גב,כתפיים,צוואר או רגליים- משלב טכניקות מגע לשיפור זרימת הדם ולהרפיה.פיתרון מושלם למי שלא רוצה לוותר על טיפול -גם שיש פחות זמן.`,
    descriptionEn:
      "A treatment that is suitable for those who need focused release with a general feeling of relaxation. Focuses on the areas of your choice. Back, shoulders, neck or legs. Combines touch techniques to improve blood circulation and relaxation. A perfect solution for those who don't want to give up treatment, even if they have less time ✨.",
    durationHe: "45 דקות",
    durationEn: "45 minutes",
    price: "₪250",
    highlight: false,
  },
  {
    id: 4,
    durationMins: 60,
    nameHe: `עיסוי לנשים הרות`,
    nameEn: "Prenatal Massage",
    descriptionHe: `עיסוי שוודי מותאם אישית שנועד להקל על כאבים ומתחים שנוצרים במהלך ההריון באמצעות טכניקות עיסוי עדינות ומרגיעות.`,
    descriptionEn:
      "Personalized Swedish massage designed to relieve pain and tension that arise during pregnancy through gentle and relaxing massage techniques 💆‍♀️.",
    durationHe: "60 דקות",
    durationEn: "60 minutes",
    price: "₪300",
    highlight: false,
  },
  {
    id: 5,
    durationMins: 45,
    nameHe: `עיסוי תאילנדי ושיאצו`,
    nameEn: "Thai & Shiatsu Massage",
    descriptionHe: `עיסוי המתבצע עם בגדים,בשילוב טכניקות מהעולם התאילנדי ולחיצות שיאצו. טיפול אנרגטי להרפיית מתחים, שחרור חסימות וחיזוק מערכת העצבים.מתאים במיוחד למי שמחפשת רוגע עמוק ואיזון לגוף ולנפש.`,
    descriptionEn:
      "A massage performed with clothes, combining techniques from the Thai world and shiatsu pressure. An energetic treatment to relax tension, release blockages and strengthen the nervous system. Especially suitable for those seeking deep relaxation and balance for body and mind ✨.",
    durationHe: "45 דקות",
    durationEn: "90 minutes",
    price: "₪250",
    highlight: false,
  },
  {
    id: 6,
    durationMins: 45,
    nameHe: `עיסוי קצוות,פנים קרקפת ופוט מסאז'`,
    nameEn: "Edge massage, face, scalp and foot massage",
    descriptionHe: `טיפול ממוקד להרפיית אזורי הראש,פנים והגפיים- לשחרור עומס ועייפות.עיסוי המעניק שחרור מתחים, משפיע על מערכת העצבים ומשרה תחושה עמוקהשל איזון לגוף ולנפש.מומלץ למי שחווה חוסר שקט,עומס רגשי נפשי או צורך במגע מחבר ורגוע.`,
    descriptionEn:
      "A focused treatment to relax the head, face and limbs - to release stress and fatigue. A massage that provides stress relief, affects the nervous system and induces a deep sense of balance for the body and mind. Recommended for those who experience restlessness, emotional and mental stress or need a connecting and calming touch 💆‍♀️.",
    durationHe: "45 דקות",
    durationEn: "45 minutes",
    price: "₪250",
    highlight: false,
  },
  {
    id: 7,
    durationMins: 30,
    nameHe: `טיפול דיקור מערבי`,
    nameEn: "Western Acupuncture Treatment",
    descriptionHe: `טיפול ממוקד לשחרור נקודות כאב(טריגר פוינטס) בשרירים באמצעות מחטים דקות. מסייע בהפחתת כאבים, שיפור תנועה ושחרור עומסים מהגוף.`,
    descriptionEn:
      "A focused treatment for releasing pain points (trigger points) in the muscles using fine needles. Helps reduce pain, improve movement, and release tension from the body.",
    durationHe: "30 דקות",
    durationEn: "30 minutes",
    price: "₪150",
    highlight: false,
  },
  {
    id: 8,
    durationMins: 30,
    nameHe: `טיפול כוסות רוח/אבנים חמות`,
    nameEn: "Cupping Therapy/Hot Stones",
    descriptionHe: `טיפול ממוקד המשלב כוסות רוח/אבנים חמות לשחרור עומסים והרפיה עמוקה של השרירים.הטיפול מסייע בהמרצת זרימת הדם,הפחתת כאבים ושחרור מתחים ומעניק תחושת קלילות ורוגע לגוף.`,
    descriptionEn:
      "A focused treatment combining cupping therapy and hot stones for deep muscle relaxation and tension release. This treatment helps stimulate blood flow, reduce pain, and promote a sense of lightness and calm.",
    durationHe: "30 דקות",
    durationEn: "30 minutes",
    price: "₪150",
    highlight: false,
  },
];

export const GALLERY = {
  titleHe: "גלריה",
  titleEn: "Gallery",
  subtitleHe: "רגעים של שלווה",
  subtitleEn: "Moments of Tranquility",
  get subtitle() {
    return this.subtitleHe;
  },
  images: [
    { id: 1, altHe: "אווירת הטיפול", altEn: "Treatment Ambiance" },
    { id: 2, altHe: "חדר הטיפולים", altEn: "Treatment Room" },
    {
      id: 3,
      altHe: "עיסויים לצוותים/ארגונים",
      altEn: "Team/Corporate Massages",
    },
    { id: 4, altHe: "אבנים חמות", altEn: "Hot Stones" },
    { id: 5, altHe: "טיפול עיסוי", altEn: "Massage Treatment" },
    { id: 6, altHe: "חוויית הספא", altEn: "Spa Experience" },
  ],
};

export const REVIEWS = {
  titleHe: "ביקורות",
  titleEn: "Reviews",
  subtitleHe: "מה אומרות הלקוחות",
  subtitleEn: "What Our Clients Say",
  items: [
    {
      id: 11,
      nameHe: "שיר חסין.",
      nameEn: "Shir H.",
      treatmentHe: "עיסוי משולב עם כוסות רוח.",
      treatmentEn: "Massage combined with cupping therapy.",
      textHe: "היה מפנק ומהמם!!!!מקצוענית",
      textEn: "It was pampering and stunning!!!! Professional.",
      stars: 5,
    },
    {
      id: 2,
      nameHe: "ספיר כהן.",
      nameEn: "Sapir Cohen.",
      treatmentHe: "עיסוי רקמות עמוק",
      treatmentEn: "Deep Tissue Massage",
      textHe: "מספר 1 בתחום! הכי נהנתי בעולם!אין ידיים כאלה.",
      textEn:
        "Number 1 in the field! I had the most fun in the world! There are no hands like them.",
      stars: 5,
    },
    {
      id: 3,
      nameHe: "ליאת טרגנו.",
      nameEn: "Noa S.",
      treatmentHe: "עיסוי רקמות עמוק",
      treatmentEn: "Deep tissue massage",
      textHe:
        "הגעתי תפוסה בטירוף וקיבלתי שעה וחצי של פינוק עילאי לגוף ולנפש מחכה כבק לפעם הבאה!!!",
      textEn:
        "I arrived insanely busy and received an hour and a half of supreme pampering for body and soul. I'm eagerly awaiting the next time.",
      stars: 5,
    },
    {
      id: 4,
      nameHe: "עדן חצבני.",
      nameEn: "Eden Hatzbani.",
      treatmentHe: "עיסוי משולב עם כוסות רוח",
      treatmentEn: "Massage combined with cupping therapy",
      textHe: "שובל מדהימה וחזקה! היה באמת טוב נהנתי מאוד וכמובן שאחזור.",
      textEn:
        "Amazing and strong trail! It was really good, I enjoyed it a lot and of course I will keep it.",
      stars: 5,
    },
    {
      id: 5,
      nameHe: "ניצן ציון.",
      nameEn: "Nizan Zion.",
      treatmentHe: "עיסוי משולב",
      treatmentEn: "Combined massage",
      textHe:
        "שובל מקסימה, מקצועית ונותנת יחס אישי ונעים :) שובל טיפלה לי באיזור בעייתי שכאב מעל לחודשיים!",
      textEn:
        "Shoval is charming, professional and provides personal and pleasant treatment :) Shoval treated a problem area that had been hurting me for over two months.",
      stars: 5,
    },
    {
      id: 6,
      nameHe: "אלדר מלכה.",
      nameEn: "Eldar M.",
      treatmentHe: "עיסוי משולב עם כוסות רוח",
      treatmentEn: "Massage combined with cupping therapy",
      textHe:
        "שובל אלופה!מסאז' ברמה הכי גבוהה,מקצועית ועם אנרגיה פשוט מושלמת.יצאתי רגוע,קליל ועם חיוך ענק.ממליץ בחום לכל אחת שצריכה שעה של שקט לגוף ולראש",
      textEn:
        "Shoval Aloufa! A massage of the highest level, professional and with simply perfect energy. I left feeling calm, light and with a huge smile. Highly recommend to anyone who needs an hour of peace for the body and mind.",
      stars: 5,
    },
    {
      id: 7,
      nameHe: "טלי רויטל בכר.",
      nameEn: "Tali Revital Bachar",
      treatmentHe: "עיסוי משולב עם אבנים חמות",
      treatmentEn: "Combined massage with hot stones",
      textHe:
        "שובל מעסה מדהימה.מטפלת בחסד עליון.המגע שלה טוב ונעים בדיוק בעוצמה הנכונה.מגע וטיפול משחרר ומרגיע.שובל טיפלה בי כבר מס' פעמים ומחכה כבר לפעם הבאה.ממליצה בחום.אתם תודו לי",
      textEn:
        "Shoval is an amazing masseuse. She treats with divine grace. Her touch is good and pleasant, with just the right intensity. Her touch and treatment are liberating and relaxing. Shoval has treated me several times and is already looking forward to the next time. Highly recommend. You will thank me.",
      stars: 5,
    },
    {
      id: 8,
      nameHe: "אתי שוקרון.",
      nameEn: "Eti Shokron",
      treatmentHe: "עיסוי משולב ",
      treatmentEn: "Combined massage",
      textHe:
        "תודה רבה.הגעתי לשובל.קיבלה אותי בחיוך.יש לציין שהיא מקצועית מאוד,אדיבה,נעימה.היתה אווירה נעימה וסביבה נקייה.ממליצה בחום.",
      textEn:
        "Thank you very much. I arrived at Shuvel. She welcomed me with a smile. It should be noted that she is very professional, kind, and pleasant. There was a pleasant atmosphere and a clean environment. Highly recommend.",
      stars: 5,
    },
    {
      id: 9,
      nameHe: "ניקה.",
      nameEn: "Nika",
      treatmentHe: "עיסוי משולב ",
      treatmentEn: "Combined massage",
      textHe:
        "טיפול מקצועי ביותר,לא רק שהעיסוי עצמו ברמה גבוהה,גם האנרגיות בטיפול עצמו מאוד חיוביות.מאוד נעים לקבל טיפול שנעים גם פיזית וגם באווירה.המון תודה על ההזדמנות.",
      textEn:
        "A very professional treatment, not only is the massage itself at a high level, but the energies in the treatment itself are also very positive. It is very pleasant to receive treatment that is pleasant both physically and in terms of atmosphere. Many thanks for the opportunity.",
      stars: 5,
    },
    {
      id: 10,
      nameHe: "בר אשכנזי.",
      nameEn: "Bar Ashkenazi",
      treatmentHe: "עיסוי משולב ",
      treatmentEn: "Combined massage",
      textHe:
        "שובל המהדימה.קיבלתי עיסוי מפנק מרגיע ומשחרר לנפש ולגוף.היא אלופה ומבינה טוב מאוד מה היא עושה!ממליצה ממליצה ממליצה.",
      textEn:
        "Shoval the Illuminator. I received a pampering massage that is relaxing and liberating for the mind and body. She is a champion and understands very well what she is doing! Recommend, recommend, recommend.",
      stars: 5,
    },
    {
      id: 1,
      nameHe: "מירב פרטיאלי.",
      nameEn: "Merav Partially",
      treatmentHe: " עיסוי משולב עם כוסות רוח ",
      treatmentEn: "Massage combined with cupping therapy",
      textHe:
        "ממליצה בחום רב!!!אין מילים שיתארו כמה היה מושלם!שובל כזו נעימה,הרגשתי ממש בידיים טובות הגעתי תפוסה כולי ועמוסה ויצאתי חדשה.",
      textEn:
        "Highly recommend!!! There are no words to describe how perfect it was! Such a pleasant trail, I felt really in good hands. I arrived completely occupied and loaded and left feeling refreshed.",
      stars: 5,
    },
    {
      id: 11,
      nameHe: "זהבית כהן.",
      nameEn: "Zehavit Cohen",
      treatmentHe: " עיסוי משולב עם כוסות רוח ",
      treatmentEn: "Massage combined with cupping therapy",
      textHe:
        "ממליצה בחוםםם.מקצועית נעימה,אנושית,מלאה באור באנרגיה.נכנסתי עם כאב ועזרה לפתור אותו.תודה עלייך על השלווה והמגע המרפא שלך.",
      textEn:
        "Highly recommend them. Professional, pleasant, humane, full of light and energy. I came in with pain and helped resolve it. Thank you for your peace and healing touch.",
      stars: 5,
    },
    {
      id: 12,
      nameHe: "מירלה ברכה.",
      nameEn: "Mirla Bracha",
      treatmentHe: " עיסוי משולב עם כוסות רוח",
      treatmentEn: "Massage combined with cupping therapy",
      textHe:
        "אתמול הרגשתי תפוסה אבל היום ברוך השם הרבה יותר טוב,מורגשת הקלה ,קמתי חדשה ,ירד לי העומס מהגב,את אלופה בחייי,תודה באמת.",
      textEn:
        "Yesterday I felt busy, but today, thank God, is much better. I feel relieved. I woke up feeling refreshed. The burden has been lifted from my back. You are the champion of my life. Thank you very much.",
      stars: 5,
    },
  ],
};

// Available time slots (Sunday–Friday, 09:00–19:00, last slot allows ≤20:00 end)
export const AVAILABLE_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

export const BOOKING_MODAL = {
  steps: [
    { labelHe: "בחרי טיפול", labelEn: "Choose Treatment" },
    { labelHe: "מתי נתראה?", labelEn: "Date & Time" },
    { labelHe: "קצת עלייך", labelEn: "Your Details" },
    { labelHe: "אישור מהיר", labelEn: "Verify" },
    { labelHe: "הצהרת בריאות", labelEn: "Health Form" },
    { labelHe: "התור נקבע", labelEn: "Booking Confirmed" },
  ],
  nextHe: "המשך",
  nextEn: "Next",
  backHe: "חזור",
  backEn: "Back",
  bookHe: "קבעי תור",
  bookEn: "Book Appointment",
  sendCodeHe: "שלחי קוד אימות",
  sendCodeEn: "Send Verification Code",
  loadingHe: "שולחת...",
  loadingEn: "Sending...",
  otpTitleHe: "אישור מהיר",
  otpTitleEn: "Quick Verification",
  otpSentHe: "שלחנו קוד ל-",
  otpSentEn: "We sent a code to ",
  otpSendingHe: "שולחת קוד — מגיע תוך שניות...",
  otpSendingEn: "Sending code — arrives in seconds...",
  otpVerifyHe: "אמתי קוד",
  otpVerifyEn: "Verify Code",
  otpVerifyingHe: "מאמת...",
  otpVerifyingEn: "Verifying...",
  otpResendHe: "שלחי שוב",
  otpResendEn: "Resend Code",
  otpResendCountdownHe: "שלח שוב בעוד",
  otpResendCountdownEn: "Resend in",
  otpResendSecondsHe: "שניות",
  otpResendSecondsEn: "s",
  otpErrorSendHe: "שגיאה בשליחת הקוד. נסי שוב.",
  otpErrorSendEn: "Failed to send code. Try again.",
  otpErrorInvalidHe: "קוד שגוי.",
  otpErrorInvalidEn: "Incorrect code.",
  otpErrorExpiredHe: "פג תוקף הקוד. שלחי שוב.",
  otpErrorExpiredEn: "Code expired. Please resend.",
  otpErrorGeneralHe: "שגיאה, נסי שוב.",
  otpErrorGeneralEn: "Verification failed. Try again.",
  otpAttemptsLeftHe: "ניסיונות נותרו",
  otpAttemptsLeftEn: "attempts left",
  errorHe: "אירעה שגיאה. בדקי חיבור לאינטרנט ונסי שוב.",
  errorEn: "Something went wrong. Check your connection and try again.",
  errorOfflineHe: "אין חיבור לאינטרנט. בדקי את החיבור ונסי שוב.",
  errorOfflineEn:
    "No internet connection. Check your connection and try again.",
  errorSlotTakenHe: "נראה שהשעה הזו נלקחה. בחרי שעה אחרת.",
  errorSlotTakenEn: "This slot was just taken. Please choose a different time.",
  nameLabelHe: "שם מלא",
  nameLabelEn: "Full Name",
  namePlaceholderHe: "לדוגמה: רחל כהן",
  namePlaceholderEn: "e.g. Rachel Cohen",
  phoneLabelHe: "מספר טלפון",
  phoneLabelEn: "Phone Number",
  phonePlaceholderHe: "05X-XXX-XXXX",
  phonePlaceholderEn: "05X-XXX-XXXX",
  phoneErrorHe: "מספר טלפון לא תקין",
  phoneErrorEn: "Invalid phone number",
  dateLabelHe: "בחרי תאריך",
  dateLabelEn: "Select Date",
  timeLabelHe: "בחרי שעה",
  timeLabelEn: "Select Time",
  noSlotsHe: "אין מקומות פנויים ביום זה",
  noSlotsEn: "No available slots on this date",
  loadingSlotsHe: "טוען שעות זמינות...",
  loadingSlotsEn: "Loading times...",
  healthTitleHe: "הצהרת בריאות",
  healthTitleEn: "Health Declaration",
  healthQ1He: "האם מילאת כבר בעבר?",
  healthQ1En: "Have you filled the health form before?",
  healthQ2He: "האם השתנה משהו מאז?",
  healthQ2En: "Has anything changed since?",
  healthFillBtnHe: "מלאי טופס בריאות",
  healthFillBtnEn: "Fill Health Form",
  healthDoneBtnHe: "סיימתי, המשיכי",
  healthDoneBtnEn: "Done, Continue",
  healthSkipBtnHe: "המשיכי לאישור",
  healthSkipBtnEn: "Continue to Confirmation",
  healthNoteHe: "הטופס ייפתח בחלון חדש. חזרי לכאן לאחר המילוי.",
  healthNoteEn: "The form opens in a new tab. Return here after completing it.",
  healthYesHe: "כן",
  healthYesEn: "Yes",
  healthNoHe: "לא",
  healthNoEn: "No",
  confirmTitleHe: "התור אושר! 🎉",
  confirmTitleEn: "Booking Confirmed! 🎉",
  confirmSubHe: "נתראה בקרוב",
  confirmSubEn: "See you soon",
  closeHe: "סגור",
  closeEn: "Close",
  whatsappMsgHe: "שינוי / ביטול תור בוואצאפ",
  whatsappMsgEn: "Reschedule via WhatsApp",
  rescheduleLabelHe: "לשינוי / ביטול תור",
  rescheduleLabelEn: "Cancel / Reschedule",
  copyDetailsHe: "העתיקי פרטים",
  copyDetailsEn: "Copy Details",
  copiedHe: "הועתק",
  copiedEn: "Copied",
  bookingRefHe: "מספר הזמנה",
  bookingRefEn: "Booking Ref",
  depositTitleHe: "מקדמה לאישור התור",
  depositTitleEn: "Deposit to Confirm Booking",
  depositAmountHe: "₪100",
  depositAmountEn: "₪100",
  depositSubHe: "לאישור התור נדרש תשלום מקדמה בסך",
  depositSubEn: "A deposit is required to confirm your booking",
  depositPolicyTitleHe: "מדיניות ביטולים",
  depositPolicyTitleEn: "Cancellation Policy",
  depositPolicy1He: "בעת קביעת התור ייגבה תשלום מקדמה בסך 100 ₪",
  depositPolicy1En: "A ₪100 deposit is charged when booking",
  depositPolicy2He:
    "ניתן לבטל או לשנות את התור עד 24 שעות לפני מועד הטיפול ללא חיוב נוסף",
  depositPolicy2En:
    "You may cancel or reschedule up to 24 hours before the appointment at no extra charge",
  depositPolicy3He: "במקרה של ביטול מאוחר יותר, ייגבה תשלום טיפול מלא",
  depositPolicy3En: "Late cancellations will be charged the full treatment fee",
  depositBitTitleHe: "ביט",
  depositBitTitleEn: "Bit",
  depositBitNoteHe:
    "שלחי 100 ₪ לטלפון המטפלת דרך אפליקציית ביט. רשמי את מספר ההזמנה בהערה.",
  depositBitNoteEn:
    "Send ₪100 to the therapist via the Bit app. Include your booking ID in the note.",
  depositBitBtnHe: "פתחי ביט",
  depositBitBtnEn: "Open Bit",
  depositCardTitleHe: "כרטיס אשראי",
  depositCardTitleEn: "Credit Card",
  depositCardNoteHe: "תשלום מאובטח בכרטיס אשראי. הדף ייפתח בחלון חדש.",
  depositCardNoteEn: "Secure card payment. Opens in a new tab.",
  depositCardBtnHe: "שלמי בכרטיס",
  depositCardBtnEn: "Pay by Card",
  depositConfirmBtnHe: "שילמתי, המשיכי",
  depositConfirmBtnEn: "I've paid, Continue",
  depositVerifyNoteHe: "התשלום יאומת לפני מועד הטיפול",
  depositVerifyNoteEn: "Payment will be verified before your appointment",
};

export const BOOKING = {
  titleHe: "קביעת תור",
  titleEn: "Book a Session",
  subtitleHe: "מוזמנות ליצור קשר בכל דרך נוחה לכן",
  subtitleEn: "You are welcome to contact us in any convenient way",
  get subtitle() {
    return this.subtitleHe;
  },
  ctaWhatsappHe: "שלחי הודעה בוואטסאפ",
  ctaWhatsappEn: "Send a WhatsApp Message",
  get ctaWhatsapp() {
    return this.ctaWhatsappHe;
  },
  ctaPhoneHe: "חייגי עכשיו",
  ctaPhoneEn: "Call Now",
  get ctaPhone() {
    return this.ctaPhoneHe;
  },
  ctaInstagramHe: "עקבי אחרינו באינסטגרם",
  ctaInstagramEn: "Follow us on Instagram",
  get ctaInstagram() {
    return this.ctaInstagramHe;
  },
  noteHe: "זמינה לתיאום בימים א׳–ו׳ | שעות 9:00–20:00",
  noteEn: "Available Sun–Fri | Hours 9:00–20:00",
  get note() {
    return this.noteHe;
  },
};
