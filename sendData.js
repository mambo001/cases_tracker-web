/* Insert
 *
 */
// CT 3 Reference
let CT3Dump = "1vS_Bok6_ugQmwimCdEYe8WiOVstO28bcs8lOXQPc5QE",
  CT3Dump_FILE = SpreadsheetApp.openById(CT3Dump),
  CT3Dump_All_Cases = CT3Dump_FILE.getSheetByName("All Cases");


function doInsert(req) {

  console.log(JSON.parse(req));
  let data = JSON.parse(req);
  console.log(data);
  console.log(typeof data);
  console.log(data.reviewStatus);

  let reviewStatus = data.reviewStatus,
      // caseID = data.caseID.toString(),
      caseID = data.caseID,
      queueType = data.queueType,
      customerType = data.customerType,
      tool = data.tool,
      language = data.language,
      timesReviewed = data.timesReviewed,
      numberOfQuestions = data.numberOfQuestions,
      country = data.country,
      RMTO = "",
      surveyType = data.surveyType,
      comments = data.comments,
      surveyDecision = data.surveyDecision,
      startTimeMNL = data.startTime,
      endTimeMNL = data.endTime,
      categories = data.categories.toString(),
      AHT = data.aht,
      numberOfInteractions = data.numberOfInteractions,

      referenceID = generateGUID(),
      startTimePST = dateAdd(new Date(startTimeMNL), "hour", -15),
      endTimePST = dateAdd(new Date(endTimeMNL), "hour", -15),
      yearMonth = yyyymm();

  let flag = 1;
  let result;

  if (flag == 1) {
    let rowData = CT3Dump_All_Cases.appendRow([
        ldap,
        reviewStatus,
        referenceID,
        caseID,
        queueType,
        customerType,
        tool,
        language,
        country,
        timesReviewed,
        RMTO,
        surveyType,
        comments,
        surveyDecision,
        startTimeMNL,
        startTimePST,
        endTimeMNL,
        endTimePST,
        categories,
        AHT,
        numberOfQuestions,
        numberOfInteractions,
        yearMonth
    ]);
    result = "Insertion successful";
  }

  return response().json({
    result: result
  });
}