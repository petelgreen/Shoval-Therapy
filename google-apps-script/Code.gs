// ============================================================
// Shoval Therapy — Booking System (Google Apps Script)
// ============================================================
//
// SETUP INSTRUCTIONS:
// 1. Create a new Google Sheet and copy its ID from the URL:
//    https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
// 2. Go to https://script.google.com and create a new project.
// 3. Paste this entire file into the editor (replace any existing code).
// 4. Set SPREADSHEET_ID below to your Sheet ID.
// 5. Click "Deploy" → "New Deployment":
//    - Type: Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 6. Authorize permissions when prompted.
// 7. Copy the Web App URL and paste it into your .env file:
//    VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
//
// SHEET SETUP:
// The script will auto-create a "Bookings" sheet with headers on first run.
// Columns: BookingID | Timestamp | Name | Phone | Service | Date | Time | Status | Duration | Notes
//
// SMS OTP SETUP (Twilio):
// 1. Sign up at https://www.twilio.com and get a free trial number.
// 2. In Apps Script editor: Extensions → Script properties → Add:
//    TWILIO_SID   = your Account SID  (starts with AC...)
//    TWILIO_TOKEN = your Auth Token
//    TWILIO_FROM  = your Twilio number in E.164 format (e.g. +12015551234)
// ============================================================

var SPREADSHEET_ID = "11Z4EwPfnLyYcg-u54tHXKgIHZuPK5fjlQNW9nCMR8Zg";
var SHEET_NAME = "shoval-bookings";
var OTP_SHEET_NAME = "OTPVerifications";
var BLOCKED_SHEET_NAME = "BlockedSlots";
var OTP_EXPIRY_MINUTES = 10;

var POLICY =
  "ביטול או שינוי שיתבצעו פחות מ-24 שעות לפני מועד התור יחויבו בתשלום של 100 ש״ח.";

function doGet(e) {
  try {
    var params = e && e.parameter ? e.parameter : {};

    if (params.action === "checkSlots" && params.date) {
      return respond(getBookedSlots(params.date));
    }

    if (params.action === "createBooking") {
      var bookingId = createBooking(params);
      return respond({ success: true, bookingId: bookingId });
    }

    if (params.action === "sendOTP" && params.phone) {
      return respond(sendOTP(params.phone));
    }

    if (params.action === "verifyOTP" && params.phone && params.code) {
      return respond(verifyOTP(params.phone, params.code));
    }

    return respond({ status: "ok" });
  } catch (err) {
    return respond({ error: err.message });
  }
}

// 08:00–21:45 in 15-minute increments
var ALL_SLOTS = (function () {
  var slots = [];
  for (var m = 8 * 60; m <= 21 * 60 + 45; m += 15) {
    var h = Math.floor(m / 60);
    var mm = m % 60;
    slots.push((h < 10 ? "0" : "") + h + ":" + (mm < 10 ? "0" : "") + mm);
  }
  return slots;
})();
var BREAK_MINUTES = 15;

function normalizeDate(val, tz) {
  if (val instanceof Date) {
    return Utilities.formatDate(val, tz, "yyyy-MM-dd");
  }
  // Strip any time component so "2026-03-22T00:00:00Z" → "2026-03-22"
  return val.toString().trim().substring(0, 10);
}

function normalizeTime(val, tz) {
  if (val instanceof Date) {
    return Utilities.formatDate(val, tz, "HH:mm");
  }
  var s = val.toString().trim();
  // Ensure HH:mm zero-padding — "9:00" → "09:00"
  if (/^\d:\d\d$/.test(s)) s = "0" + s;
  return s;
}

function pad(n) {
  return n < 10 ? "0" + n : n.toString();
}
function minsToTime(m) {
  return pad(Math.floor(m / 60)) + ":" + pad(m % 60);
}
function timeToMins(t) {
  var p = t.split(":");
  return +p[0] * 60 + +p[1];
}

var MAX_ADVANCE_DAYS = 14;

function isTooFarAhead(dateStr) {
  var tz = Session.getScriptTimeZone();
  var todayStr = Utilities.formatDate(new Date(), tz, "yyyy-MM-dd");
  var today = new Date(todayStr + "T00:00:00");
  var target = new Date(dateStr + "T00:00:00");
  var diffDays = (target - today) / (24 * 60 * 60 * 1000);
  return diffDays > MAX_ADVANCE_DAYS;
}

function getBookedSlots(date) {
  if (isTooFarAhead(date)) {
    return { bookedSlots: ALL_SLOTS.slice(), extraSlots: [] };
  }

  var bookedSlots = [];
  var extraSlots = [];

  var bookingSheet = getOrCreateSheet();
  var lastRow = bookingSheet.getLastRow();

  // Force date (col F=6) and time (col G=7) to known display formats so
  // getDisplayValues() always returns "2026-03-23" and "09:00" regardless of
  // how cells were stored or what timezone the spreadsheet uses.
  if (lastRow > 1) {
    bookingSheet.getRange(2, 6, lastRow - 1, 1).setNumberFormat("yyyy-MM-dd");
    bookingSheet.getRange(2, 7, lastRow - 1, 1).setNumberFormat("HH:mm");
  }

  var bookingRows = bookingSheet.getDataRange().getDisplayValues();
  var ranges = [];
  Logger.log(
    "checkSlots v5 date=" + date + " rows=" + (bookingRows.length - 1),
  );

  for (var i = 1; i < bookingRows.length; i++) {
    var rowDate = bookingRows[i][5]; // "2026-03-23" — no timezone math needed
    var rowTimeStr = bookingRows[i][6]; // "09:00"
    var rowStatus = bookingRows[i][7];
    var rowDuration = parseInt(bookingRows[i][8]) || 60; // Column I: Duration
    Logger.log(
      "row " +
        i +
        ": rowDate=" +
        rowDate +
        " rowTime=" +
        rowTimeStr +
        " rowStatus=" +
        rowStatus,
    );

    if (rowDate !== date || rowStatus === "Cancelled") continue;

    var startMins = timeToMins(rowTimeStr);
    var endWithBreak = startMins + rowDuration + BREAK_MINUTES;
    ranges.push({ start: startMins, end: endWithBreak });

    // Block the booked slot itself
    if (bookedSlots.indexOf(rowTimeStr) === -1) bookedSlots.push(rowTimeStr);

    // Block standard slots that fall inside this booking's window
    for (var s = 0; s < ALL_SLOTS.length; s++) {
      var slotMins = timeToMins(ALL_SLOTS[s]);
      if (slotMins > startMins && slotMins < endWithBreak) {
        if (bookedSlots.indexOf(ALL_SLOTS[s]) === -1)
          bookedSlots.push(ALL_SLOTS[s]);
      }
    }

    // Propose an extra slot at end+break if it doesn't align with a standard slot
    if (endWithBreak < 22 * 60) {
      var candidate = minsToTime(endWithBreak);
      if (
        ALL_SLOTS.indexOf(candidate) === -1 &&
        extraSlots.indexOf(candidate) === -1
      ) {
        extraSlots.push(candidate);
      }
    }
  }

  // Remove extra slots that fall inside another booking's occupied range
  extraSlots = extraSlots.filter(function (slot) {
    var m = timeToMins(slot);
    for (var r = 0; r < ranges.length; r++) {
      if (m >= ranges[r].start && m < ranges[r].end) return false;
    }
    return true;
  });

  // Slots blocked manually by Shoval
  var blockedSheet = getOrCreateBlockedSlotsSheet();
  var blockedRows = blockedSheet.getDataRange().getValues();
  var bTz = Session.getScriptTimeZone();
  for (var j = 1; j < blockedRows.length; j++) {
    var bDate = normalizeDate(blockedRows[j][0], bTz);
    var bTime = normalizeTime(blockedRows[j][1], bTz);
    if (bDate === date) {
      if (!bTime) {
        return { bookedSlots: ALL_SLOTS.slice(), extraSlots: [] };
      }
      if (bookedSlots.indexOf(bTime) === -1) bookedSlots.push(bTime);
    }
  }

  // Day-of-week restrictions
  var dayOfWeek = new Date(date + "T12:00:00").getDay(); // 0=Sun … 5=Fri, 6=Sat

  // Friday: nothing after 14:00
  if (dayOfWeek === 5) {
    for (var f = 0; f < ALL_SLOTS.length; f++) {
      if (
        timeToMins(ALL_SLOTS[f]) > timeToMins("14:00") &&
        bookedSlots.indexOf(ALL_SLOTS[f]) === -1
      ) {
        bookedSlots.push(ALL_SLOTS[f]);
      }
    }
    // Extra slots past 14:00 are irrelevant on Fridays
    extraSlots = extraSlots.filter(function (s) {
      return timeToMins(s) <= timeToMins("14:00");
    });
  }

  // Saturday: only 19:00–21:00 is available
  if (dayOfWeek === 6) {
    for (var sa = 0; sa < ALL_SLOTS.length; sa++) {
      if (
        timeToMins(ALL_SLOTS[sa]) < timeToMins("19:00") &&
        bookedSlots.indexOf(ALL_SLOTS[sa]) === -1
      ) {
        bookedSlots.push(ALL_SLOTS[sa]);
      }
    }
    extraSlots = extraSlots.filter(function (s) { return timeToMins(s) >= timeToMins("19:00"); });
  }

  return { bookedSlots: bookedSlots, extraSlots: extraSlots };
}

function getOrCreateBlockedSlotsSheet() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(BLOCKED_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(BLOCKED_SHEET_NAME);
    sheet.appendRow(["Date", "Time", "Reason"]);
    sheet.setFrozenRows(1);
    var header = sheet.getRange(1, 1, 1, 3);
    header.setBackground("#C9A96E");
    header.setFontColor("#FFFFFF");
    header.setFontWeight("bold");
    sheet.setColumnWidths(1, 3, 180);
    // Add usage note in row 2
    sheet.appendRow([
      "2026-01-01",
      "",
      "Example: leave Time empty to block the whole day",
    ]);
    sheet.getRange(2, 1, 1, 3).setFontColor("#999999").setFontStyle("italic");
  }

  return sheet;
}

function createBooking(data) {
  if (isTooFarAhead(data.date)) {
    throw new Error(
      "לא ניתן להזמין תור ביותר מ-" + MAX_ADVANCE_DAYS + " ימים מראש.",
    );
  }

  var sheet = getOrCreateSheet();
  var bookingId = "BK" + Date.now();
  var timestamp = new Date().toISOString();

  sheet.appendRow([
    bookingId,
    timestamp,
    data.name,
    data.phone,
    data.service,
    data.date,
    data.time,
    "מאושר", // Column H: Status
    parseInt(data.duration) || 60, // Column I: Duration in minutes
    data.notes || "", // Column J: Notes
  ]);

  // Force date and time cells to plain text so Sheets never auto-converts them
  // to Date objects (which causes timezone-based date shifts when reading back).
  var newRow = sheet.getLastRow();
  sheet.getRange(newRow, 6).setNumberFormat("@").setValue(data.date);
  sheet.getRange(newRow, 7).setNumberFormat("@").setValue(data.time);

  // Send booking confirmation via WhatsApp
  var e164 = "+" + normalizePhoneDigits(data.phone);
  var displayDate = data.date.split("-").reverse().join("/"); // YYYY-MM-DD → DD/MM/YYYY
  var confirmMsg =
    "שלום " +
    data.name +
    "! ✅ התור שלך אושר.\n\n" +
    "📋 פרטי התור:\n" +
    "שירות: " +
    data.service +
    "\n" +
    "תאריך: " +
    displayDate +
    "\n" +
    "שעה: " +
    data.time +
    "\n" +
    "📍 מיקום: סמטת השרון 3, בת ים\nקומה 3, דירה 11\n\n" +
    "מספר הזמנה: " +
    bookingId +
    "\n\n" +
    POLICY +
    "\n\n" +
    "Shoval Therapy 🌿\n0535537072";
  sendWhatsApp(e164, confirmMsg);

  // Notify owner of new booking via email (silent fail if no permission)
  try {
    MailApp.sendEmail({
      to: "shoval98710@gmail.com",
      subject: "הזמנה חדשה — " + data.name + " (" + displayDate + " " + data.time + ")",
      body:
        "הזמנה חדשה התקבלה:\n\n" +
        "שם: " + data.name + "\n" +
        "טלפון: " + data.phone + "\n" +
        "שירות: " + data.service + "\n" +
        "תאריך: " + displayDate + "\n" +
        "שעה: " + data.time + "\n" +
        (data.notes ? "הערות: " + data.notes + "\n" : "") +
        "\nמספר הזמנה: " + bookingId
    });
  } catch (mailErr) {
    Logger.log("Email notification failed, falling back to SMS: " + mailErr.message);
    var ownerE164 = "+972535537072";
    var ownerMsg =
      "📅 הזמנה חדשה!\n\n" +
      "שם: " + data.name + "\n" +
      "טלפון: " + data.phone + "\n" +
      "שירות: " + data.service + "\n" +
      "תאריך: " + displayDate + "\n" +
      "שעה: " + data.time + "\n" +
      "מספר הזמנה: " + bookingId;
    try { sendSMS(ownerE164, ownerMsg); } catch (smsErr) {
      Logger.log("SMS fallback also failed: " + smsErr.message);
    }
  }

  return bookingId;
}

// ── Sends an SMS via Twilio. Falls back to Logger.log if credentials are missing ──
// ── Sends a WhatsApp message via Twilio. Falls back to SMS if no WhatsApp sender is configured ──
// Setup: in Script Properties add TWILIO_WHATSAPP_FROM = whatsapp:+14155238886
// (use the Twilio sandbox number during testing, or your approved WA Business number in production)
function sendWhatsApp(e164, body) {
  var props = PropertiesService.getScriptProperties();
  var sid = props.getProperty("TWILIO_SID");
  var token = props.getProperty("TWILIO_TOKEN");
  var from = props.getProperty("TWILIO_WHATSAPP_FROM");

  if (!sid || !token || !from) {
    Logger.log(
      "WhatsApp fallback to SMS — TWILIO_WHATSAPP_FROM not configured. To: " + e164,
    );
    sendSMS(e164, body);
    return;
  }

  var url =
    "https://api.twilio.com/2010-04-01/Accounts/" + sid + "/Messages.json";
  var res = UrlFetchApp.fetch(url, {
    method: "post",
    payload: { To: "whatsapp:" + e164, From: from, Body: body },
    headers: {
      Authorization: "Basic " + Utilities.base64Encode(sid + ":" + token),
    },
    muteHttpExceptions: true,
  });

  var result = JSON.parse(res.getContentText());
  if (
    result.code ||
    (typeof result.status === "number" && result.status >= 400)
  ) {
    Logger.log("WhatsApp ERROR to " + e164 + ": " + res.getContentText());
  } else {
    Logger.log("WhatsApp sent to " + e164 + " — SID: " + result.sid);
  }
}

// ── Sends an SMS via Twilio. Falls back to Logger.log if credentials are missing ──
function sendSMS(e164, body) {
  var props = PropertiesService.getScriptProperties();
  var sid = props.getProperty("TWILIO_SID");
  var token = props.getProperty("TWILIO_TOKEN");
  var from = props.getProperty("TWILIO_FROM");

  if (!sid || !token || !from) {
    Logger.log("SMS (no Twilio configured) to " + e164 + ":\n" + body);
    return;
  }

  var url =
    "https://api.twilio.com/2010-04-01/Accounts/" + sid + "/Messages.json";
  UrlFetchApp.fetch(url, {
    method: "post",
    payload: { To: e164, From: from, Body: body },
    headers: {
      Authorization: "Basic " + Utilities.base64Encode(sid + ":" + token),
    },
    muteHttpExceptions: true,
  });
}

// ── Sends a "tomorrow" SMS reminder at 17:00 the day before each appointment ──
function sendTomorrowReminders() {
  var tz = SpreadsheetApp.openById(SPREADSHEET_ID).getSpreadsheetTimeZone();
  var tomorrowStr = Utilities.formatDate(
    new Date(Date.now() + 24 * 60 * 60 * 1000),
    tz,
    "yyyy-MM-dd",
  );

  var sheet = getOrCreateSheet();
  var rows = sheet.getDataRange().getValues();

  for (var i = 1; i < rows.length; i++) {
    var rowDate = normalizeDate(rows[i][5], tz);
    var rowStatus = rows[i][7];
    if (rowDate !== tomorrowStr || rowStatus === "Cancelled") continue;

    var name = rows[i][2];
    var phone = rows[i][3].toString();
    var service = rows[i][4];
    var time = normalizeTime(rows[i][6], tz);
    var displayDate = tomorrowStr.split("-").reverse().join("/");
    var e164 = "+" + normalizePhoneDigits(phone);

    var msg =
      "שלום " +
      name +
      "! 🌿 תזכורת לתור מחר אצל Shoval Therapy 🌿\n\n" +
      "תאריך: " +
      displayDate +
      "\n" +
      "שעה: " +
      time +
      "\n" +
      "שירות: " +
      service +
      "\n\n" +
      "📍 מיקום: סמטת השרון 3, בת ים\nקומה 3, דירה 11\n\n" +
      POLICY +
      "\n\n" +
      "לשינויים, ביטולים או פרטים נוספים צרו קשר:\n0535537072";

    sendSMS(e164, msg);
  }
}

// ── Sends a "today" SMS reminder at 09:00 on the day of each appointment ──
function sendTodayReminders() {
  var tz = SpreadsheetApp.openById(SPREADSHEET_ID).getSpreadsheetTimeZone();
  var todayStr = Utilities.formatDate(new Date(), tz, "yyyy-MM-dd");

  var sheet = getOrCreateSheet();
  var rows = sheet.getDataRange().getValues();

  for (var i = 1; i < rows.length; i++) {
    var rowDate = normalizeDate(rows[i][5], tz);
    var rowStatus = rows[i][7];
    if (rowDate !== todayStr || rowStatus === "Cancelled") continue;

    var name = rows[i][2];
    var phone = rows[i][3].toString();
    var service = rows[i][4];
    var time = normalizeTime(rows[i][6], tz);
    var e164 = "+" + normalizePhoneDigits(phone);

    var msg =
      "שלום " +
      name +
      "! ☀️ תזכורת — יש לך תור היום אצל Shoval Therapy\n\n" +
      "שעה: " +
      time +
      "\n" +
      "שירות: " +
      service +
      "\n\n" +
      "📍 מיקום: סמטת השרון 3, בת ים\nקומה 3, דירה 11\n\n" +
      "נתראה היום! 🌿\n0535537072";

    sendSMS(e164, msg);
  }
}

// ── Run this ONCE in the Apps Script editor to register both reminder triggers ──
function setupReminderTrigger() {
  // Remove all existing reminder triggers to avoid duplicates
  ScriptApp.getProjectTriggers().forEach(function (t) {
    var fn = t.getHandlerFunction();
    if (
      fn === "sendDailyReminders" ||
      fn === "sendTomorrowReminders" ||
      fn === "sendTodayReminders"
    )
      ScriptApp.deleteTrigger(t);
  });
  // Day-before reminder at 17:00
  ScriptApp.newTrigger("sendTomorrowReminders")
    .timeBased()
    .everyDays(1)
    .atHour(17)
    .create();
  // Same-day reminder at 09:00
  ScriptApp.newTrigger("sendTodayReminders")
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();
  Logger.log(
    "Reminder triggers set: sendTomorrowReminders at 17:00, sendTodayReminders at 09:00",
  );
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "BookingID",
      "Timestamp",
      "Name",
      "Phone",
      "Service",
      "Date",
      "Time",
      "Status",
      "Duration",
      "Notes",
    ]);
    sheet.setFrozenRows(1);

    // Style the header row
    var header = sheet.getRange(1, 1, 1, 10);
    header.setBackground("#C9A96E");
    header.setFontColor("#FFFFFF");
    header.setFontWeight("bold");
    sheet.setColumnWidths(1, 10, 160);
  }

  return sheet;
}

function normalizePhoneDigits(phone) {
  // Strip everything except digits
  var digits = phone.toString().replace(/\D/g, "");
  // Convert Israeli 05X... to 9725X...
  if (digits.startsWith("0")) digits = "972" + digits.slice(1);
  return digits; // e.g. "972535537072" — no + prefix (avoids Sheets auto-converting to number)
}

function sendOTP(phone) {
  try {
    var digits = normalizePhoneDigits(phone); // "972XXXXXXXXX"
    var e164 = "+" + digits; // "+972XXXXXXXXX" for Twilio

    var code = Math.floor(100000 + Math.random() * 900000).toString();
    var expiry = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000,
    ).toISOString();

    var sheet = getOrCreateOTPSheet();

    // Dedup: if a pending OTP for this phone was written in the last 10 seconds,
    // reuse it instead of writing a new row (prevents React Strict Mode double-fire).
    // We still call Twilio below — we only skip the extra row.
    var existingRows = sheet.getDataRange().getValues();
    var tenSecondsAgo = new Date(Date.now() - 10 * 1000);
    var isDuplicate = false;
    for (var r = existingRows.length - 1; r >= 1; r--) {
      if (
        existingRows[r][0].toString() === digits &&
        existingRows[r][3] === "pending" &&
        new Date(existingRows[r][2]) > tenSecondsAgo
      ) {
        isDuplicate = true;
        code = existingRows[r][1].toString(); // reuse the same code
        break;
      }
    }
    if (!isDuplicate) {
      sheet.appendRow([digits, code, expiry, "pending"]); // store digits (no +)
    }

    var props = PropertiesService.getScriptProperties();
    var sid = props.getProperty("TWILIO_SID");
    var token = props.getProperty("TWILIO_TOKEN");
    var from = props.getProperty("TWILIO_FROM");

    if (!sid || !token || !from) {
      // Twilio not configured — log code for testing
      Logger.log("OTP for " + e164 + ": " + code);
      return { success: true, debug: true };
    }

    var url =
      "https://api.twilio.com/2010-04-01/Accounts/" + sid + "/Messages.json";
    var msgHe =
      "קוד האימות שלך לתור עם Shoval Therapy: " +
      code +
      "\nבתוקף ל-" +
      OTP_EXPIRY_MINUTES +
      " דקות.";
    var options = {
      method: "post",
      payload: { To: e164, From: from, Body: msgHe }, // use +972... for Twilio
      headers: {
        Authorization: "Basic " + Utilities.base64Encode(sid + ":" + token),
      },
      muteHttpExceptions: true,
    };

    var res = UrlFetchApp.fetch(url, options);
    var result = JSON.parse(res.getContentText());

    // Twilio errors: result.code is a number (e.g. 21211) and result.status is an HTTP number (e.g. 400)
    if (
      result.code ||
      (typeof result.status === "number" && result.status >= 400)
    ) {
      Logger.log("Twilio error: " + res.getContentText());
      return { success: false, error: result.message || "SMS failed" };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function verifyOTP(phone, code) {
  try {
    var digits = normalizePhoneDigits(phone); // normalize to "972XXXXXXXXX"
    var sheet = getOrCreateOTPSheet();
    var rows = sheet.getDataRange().getValues();
    var now = new Date();

    // Find the latest pending row for this phone
    var matchRow = -1;
    for (var i = rows.length - 1; i >= 1; i--) {
      var rowPhone = rows[i][0].toString().replace(/\D/g, "");
      if (rowPhone === digits && rows[i][3] === "pending") {
        matchRow = i + 1; // 1-indexed
        break;
      }
    }

    if (matchRow === -1) {
      return { success: false, error: "expired" };
    }

    var storedCode = rows[matchRow - 1][1].toString();
    var expiry = new Date(rows[matchRow - 1][2]);
    var status = rows[matchRow - 1][3];

    if (status !== "pending") {
      return { success: false, error: "expired" };
    }

    if (now > expiry) {
      sheet.getRange(matchRow, 4).setValue("expired");
      return { success: false, error: "expired" };
    }

    if (storedCode !== code) {
      return { success: false, error: "invalid" };
    }

    sheet.getRange(matchRow, 4).setValue("used");
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function getOrCreateOTPSheet() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(OTP_SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(OTP_SHEET_NAME);
    sheet.appendRow(["Phone", "Code", "Expiry", "Status"]);
    sheet.setFrozenRows(1);
    var header = sheet.getRange(1, 1, 1, 4);
    header.setBackground("#C9A96E");
    header.setFontColor("#FFFFFF");
    header.setFontWeight("bold");
    sheet.setColumnWidths(1, 4, 180);
  }

  return sheet;
}

function respond(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

// ── Run this function directly in the Apps Script editor to debug Twilio ──
// Change TEST_PHONE to any Israeli number you want to test.
function testTwilioSMS() {
  var TEST_PHONE = "+972XXXXXXXXX"; // ← replace with a real number

  var props = PropertiesService.getScriptProperties();
  var sid = props.getProperty("TWILIO_SID");
  var token = props.getProperty("TWILIO_TOKEN");
  var from = props.getProperty("TWILIO_FROM");

  Logger.log("SID: " + (sid ? sid.slice(0, 6) + "..." : "MISSING"));
  Logger.log("TOKEN: " + (token ? "present" : "MISSING"));
  Logger.log("FROM: " + (from || "MISSING"));
  Logger.log("TO: " + TEST_PHONE);

  if (!sid || !token || !from) {
    Logger.log("ERROR: Twilio credentials missing in Script Properties");
    return;
  }

  var url =
    "https://api.twilio.com/2010-04-01/Accounts/" + sid + "/Messages.json";
  var options = {
    method: "post",
    payload: {
      To: TEST_PHONE,
      From: from,
      Body: "Test SMS from Shoval booking system",
    },
    headers: {
      Authorization: "Basic " + Utilities.base64Encode(sid + ":" + token),
    },
    muteHttpExceptions: true,
  };

  var res = UrlFetchApp.fetch(url, options);
  Logger.log("HTTP status: " + res.getResponseCode());
  Logger.log("Response: " + res.getContentText());
}
