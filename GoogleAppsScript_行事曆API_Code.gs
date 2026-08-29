// BNI 富商分會 V4｜Google Calendar → 網站活動卡片
// 直接貼到 Google Apps Script 的 Code.gs，部署為 Web App 即可。

function doGet(e) {
  const CALENDAR_ID = 'fushang8676@gmail.com';
  const DAYS_AHEAD = 120;

  const cal = CalendarApp.getCalendarById(CALENDAR_ID);
  if (!cal) {
    return ContentService
      .createTextOutput('calendarCallback([])')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  const now = new Date();
  const end = new Date(now.getTime() + DAYS_AHEAD * 24 * 60 * 60 * 1000);
  const events = cal.getEvents(now, end).map(function(ev) {
    return {
      title: ev.getTitle(),
      start: ev.getStartTime().toISOString(),
      end: ev.getEndTime().toISOString(),
      allDay: ev.isAllDayEvent(),
      location: ev.getLocation() || ''
    };
  });

  const callback = (e && e.parameter && e.parameter.callback)
    ? e.parameter.callback
    : 'calendarCallback';

  // 僅允許安全的 JavaScript callback 名稱
  const safeCallback = /^[A-Za-z_$][0-9A-Za-z_$]*$/.test(callback)
    ? callback
    : 'calendarCallback';

  return ContentService
    .createTextOutput(safeCallback + '(' + JSON.stringify(events) + ')')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
