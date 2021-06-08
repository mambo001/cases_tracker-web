// const CTDB = SpreadsheetApp.openById("13Hk2Pawc7CnHo7a1JYnOKuhq_qedJiR9YqHYZftIPdI");
// let utilizationSheet = CTDB.getSheetByName("All Cases"),
//     attendanceSheet = CTDB.getSheetByName("Consulted Bucket")
//     email = Session.getActiveUser().getEmail(),
//     ldap = email.split("@")[0];

function doGet(e) {
  Logger.log(Utilities.jsonStringify(e));
  if (!e.parameter.page) {
    // When no specific page requested, return "home page"
    if (e.parameter.caseID != null) {
      var htmlTemplate = HtmlService.createTemplateFromFile('response');
    }
    else
      var htmlTemplate = HtmlService.createTemplateFromFile('index');

    var htmlOutput = htmlTemplate.evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

    // appendDataToHtmlOutput modifies the html and returns the same htmlOutput object
    return htmlOutput;
  }
  // else, use page parameter to pick an html file from the script
  return HtmlService.createTemplateFromFile(e.parameter['page']).evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


//From Real DB GS
var email,ldap,profileURL;

(() => {
   email = Session.getActiveUser().getEmail() || "",
   ldap = email.split("@")[0] || "",
   profileURL = `https://moma-teams-photos.corp.google.com/photos/${ldap}?sz=600&type=CUSTOM` || ""
})();

//Function for including external files into html
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
}

function getUserInfo(){
  let user = {}

  user.email = email;
  user.ldap = ldap;
  user.profileURL = profileURL;

  Logger.log(user);
  return user;
}

function deleteById(caseRef){
  const ss = SpreadsheetApp.openById('1_P9DiCAdwda0NSmDR6kpSGoVIg2zQfp2xLtqwGa6WhE');
  const ws = ss.getSheetByName("Assigned Cases");
  const caseRefArray = ws.getRange(2, 2, ws.getLastRow()-1, 1).getValues().map(r => r[0]);
  const posIndex = caseRefArray.indexOf(caseRef);
  const rowNumber = posIndex === -1 ? 0 : posIndex + 2;
  ws.deleteRow(rowNumber);
}

function doAssignFACases(data){
  const ss = SpreadsheetApp.openById('1_P9DiCAdwda0NSmDR6kpSGoVIg2zQfp2xLtqwGa6WhE');
  const ws = ss.getSheetByName("Assigned Cases");

  console.log(data)

  data.forEach(d => {
    ws.appendRow([
      d.ldap,
      generateGUID(),
      d.cases
    ]);
  });

  const result = "Success"

  return response().json({
    result: "result"
  });
}



function doAddCase(data){
  const ss = SpreadsheetApp.openById('1_P9DiCAdwda0NSmDR6kpSGoVIg2zQfp2xLtqwGa6WhE');
  const ws = ss.getSheetByName("All Cases");
  const c = JSON.parse(data);
  console.log("Adding this: " + JSON.stringify(data));

  // {"comments":"","categories":[],"surveyType":"","endTime":"8/9/2020 2:7:41","language":"","caseRef":"case-c2d1-12df","startTime":"8/9/2020 2:7:36","aht":"00:0:5"}
  // LDAP	Review Status	Reference ID	Survey URL	Language	Survey Type	Screenshot/Comments	Survey Decision	Start Time	End Time	Categories	AHT
  ws.appendRow([
    ldap,
    "reviewed",
    c.caseRef,
    c.surveyURL,
    c.language,
    c.surveyType,
    c.comments,
    c.surveyDecision,
    c.startTime,
    c.endTime,
    c.categories.toString(),
    c.aht
  ]);

   return response().json({
      result: 'Success'
   });
}

function doSubmitCase(data){
  let parsedData = JSON.parse(data);
  // doAddCase(parsedData);
  // deleteById(JSON.parse(parsedData).caseRef);
  console.log(parsedData)
}

function doSubmitQAAudit(data){
  let parsedData = JSON.parse(data),
      // caseRef = "case-ec30-c34d";
      caseRef = parsedData.caseRef;
  
  console.log(parsedData)
  console.log(caseRef)

  const ss = SpreadsheetApp.openById('1_P9DiCAdwda0NSmDR6kpSGoVIg2zQfp2xLtqwGa6WhE');
  const ws = ss.getSheetByName("All Cases");
  const caseRefArray = ws.getRange(2, 3, ws.getLastRow()-1, 1).getValues().map(r => r[0]);
  const posIndex = caseRefArray.indexOf(caseRef);
  const rowNumber = posIndex === -1 ? 0 : posIndex + 2;
  console.log({rowNumber})
  console.log({posIndex})

  ws.getRange(rowNumber, 13, 1, 3).setValues([[
    ldap,
    parsedData.score,
    parsedData.comments
  ]]);
  addCaseLog(rowNumber, parsedData.caseLog);
  
  console.log(parsedData["caseLog"])
}

function doSubmitVarianceAudit(data){
  let parsedData = JSON.parse(data),
      // caseRef = "case-ec30-c34d";
      caseRef = parsedData.caseRef;

  const ss = SpreadsheetApp.openById('1_P9DiCAdwda0NSmDR6kpSGoVIg2zQfp2xLtqwGa6WhE');
  const ws = ss.getSheetByName("All Cases");
  const caseRefArray = ws.getRange(2, 3, ws.getLastRow()-1, 1).getValues().map(r => r[0]);
  const posIndex = caseRefArray.indexOf(caseRef);
  const rowNumber = posIndex === -1 ? 0 : posIndex + 2;
  console.log({rowNumber})

  // { caseRef: 'case-604d-5950',
  // comments: 'test comment',
  // score: '100',
  // caseLog: 
  //  [ { auditor: 'reubenmark',
  //      auditAHT: '00:0:3',
  //      auditDate: '9/15/2020 6:17:30' } ] }
  ws.getRange(rowNumber, 16, 1, 2).setValues([[
    parsedData.score,
    parsedData.comments
  ]]);
  addCaseLog(rowNumber, parsedData.caseLog);
  
  console.log(parsedData["caseLog"])
}

function addCaseLog(row,data){
  const ss = SpreadsheetApp.openById('1_P9DiCAdwda0NSmDR6kpSGoVIg2zQfp2xLtqwGa6WhE');
  const ws = ss.getSheetByName("All Cases");
  // row = "624"
  let log = ws.getRange(row, 18, 1, 1).getValues();
  log.push(data);
  console.log(log);
  ws.getRange(row, 18, 1, 1).setValues([[log]]);
}

function response() {
   return {
      json: function(data) {
         return ContentService
            .createTextOutput(JSON.stringify(data))
            .setMimeType(ContentService.MimeType.JSON);
      }
   }
}

function getAgents(){
  var FILEID = "1_P9DiCAdwda0NSmDR6kpSGoVIg2zQfp2xLtqwGa6WhE";
  var file = SpreadsheetApp.openById(FILEID);
  var sheet = file.getSheetByName("QA_roster_ref");
  var data = sheet.getDataRange().getValues();
  data.shift();

  console.log(data);
  return JSON.stringify(data);
}

function getCases(){
  var FILEID = "1Wa5nOpO7G5JISXgapxdhAEmhuRsyjvdm60rAgC2UinQ";
  var file = SpreadsheetApp.openById(FILEID);
  var sheet = file.getSheetByName("Sheet1");
  var data = sheet.getDataRange().getValues();

  return JSON.stringify(data);
}

function getCAD(){
  var FILEID = "1vVbGbXPFBEMgldBimA9613ODwnekD-qB4wO8w-PFbHg";
  var file = SpreadsheetApp.openById(FILEID);
  var sheet = file.getSheetByName("Apr - Jun 2020");
  var data = sheet.getDataRange().getValues();

  return JSON.stringify(data);
}

function getLastSomething(quantity){
  // quantity = 5;
  var FILEID = "1vVbGbXPFBEMgldBimA9613ODwnekD-qB4wO8w-PFbHg";
  var file = SpreadsheetApp.openById(FILEID);
  var sheet = file.getSheetByName("Apr - Jun 2020");
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();
  var lastRowLessQuantity = lastRow - quantity;
  var range = sheet.getRange(lastRowLessQuantity, 1, lastRow - 1, lastColumn);
  var values = range.getValues();
  console.log(`${lastRowLessQuantity} ${values.length}`);
  console.log(values)
  return JSON.stringify(values);
}

// Utility Functions
function generateGUID() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    }
    return 'case' + '-' + s4() + '-' + s4() + '-' + s4();
}

function yyyymm() {
  var now = new Date();
  var y = now.getFullYear();
  var m = now.getMonth() + 1;
  return '' + y + "-" + (m < 10 ? '0' : '') + m ;
}

function dateAdd(date, interval, units) {
  var ret = new Date(date); //don't change original date
  var checkRollover = function() { if(ret.getDate() != date.getDate()) ret.setDate(0);};
  switch(interval.toLowerCase()) {
    case 'year'   :  ret.setFullYear(ret.getFullYear() + units); checkRollover();  break;
    case 'quarter':  ret.setMonth(ret.getMonth() + 3*units); checkRollover();  break;
    case 'month'  :  ret.setMonth(ret.getMonth() + units); checkRollover();  break;
    case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
    case 'day'    :  ret.setDate(ret.getDate() + units);  break;
    case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
    case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
    case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
    default       :  ret = undefined;  break;
  }
  return ret;
}

function response() {
   return {
      json: function(data) {
         return ContentService
            .createTextOutput(JSON.stringify(data))
            .setMimeType(ContentService.MimeType.JSON);
      }
   }
}

function sendJSON(jsonResponse){
  return ContentService
    .createTextOutput(JSON.stringify(jsonResponse))
    .setMimeType(ContentService.MimeType.JSON);
}