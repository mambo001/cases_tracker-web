// 
let mockCasesDump = "1_P9DiCAdwda0NSmDR6kpSGoVIg2zQfp2xLtqwGa6WhE",
  file = SpreadsheetApp.openById(mockCasesDump),
  sheetAllCases = file.getSheetByName("All Cases"),
  sheetAssignedCases = file.getSheetByName("Assigned Cases"),
  QARosterRef = file.getSheetByName("QA_roster_ref"),
  VarianceRosterRef = file.getSheetByName("Variance_roster_ref") ;

function getMockCases(){
  var data = sheetAllCases.getDataRange().getValues();
  console.log(JSON.stringify(data));
  return JSON.stringify(data);
}

function getStatsData(){
  let stats,
    data = sheetAllCases.getDataRange().getValues();

  
  data.shift();

  let finishedCases =  data.filter((e) => {
    return e[0] == ldap;
  });

  stats = {
    finished: data.filter((e) => {
      return e[0] == ldap;
    }),
    dailyRequired: data.filter((e) => {
      let test = new Date().toLocaleDateString() == new Date(e[8]).toLocaleDateString() && ldap == e[0];
      console.log(test);
      return test;
      // return new Date().toLocaleDateString() == new Date(e[8]).toLocaleDateString();
    }),
    scores: finishedCases.map(e => e[13])
  };

  
  return JSON.stringify(stats);
}

function getQAStatsData(){
  // refactor
  let stats,
    data = sheetAllCases.getDataRange().getValues(),
    QARosterRefSheet = file.getSheetByName("QA_roster_ref"),
    rosterList = QARosterRefSheet.getDataRange().getValues();

  
  data.shift();
  rosterList.shift();

  const myRoster = rosterList.filter(e => e[0] == ldap),
        myRosterArray = myRoster[0][1].split(","),
        myRosterCasesArray = data.filter(e => myRosterArray.includes(e[0])),
        myRosterPendingAudit = myRosterCasesArray.filter(e => e[12] == "" || e[12] == undefined),
        myAuditedCases = myRosterCasesArray.filter(e => e[12] == ldap);

  myAuditedCases.reverse();
  console.log(myAuditedCases);

  stats = {
    auditedCases: myAuditedCases.length || 0,
    pendingAudits: myRosterPendingAudit.length || 0,
    disputeRate: 0,
    auditedCasesData: myAuditedCases
  };

  
  return JSON.stringify(stats);
}

function getVarianceStatsData(){
  // refactor
  let stats,
    data = sheetAllCases.getDataRange().getValues(),
    VarianceRosterRefSheet = file.getSheetByName("Variance_roster_ref"),
    rosterList = VarianceRosterRefSheet.getDataRange().getValues();

  
  data.shift();
  rosterList.shift();

  const myRoster = rosterList.filter(e => e[0] == ldap),
        myRosterArray = myRoster[0][1].split(","),
        myRosterCasesArray = data.filter(e => myRosterArray.includes(e[0]));
        myRosterPendingAudit = myRosterCasesArray.filter(e => e[15] == "" || e[15] == undefined),
        myAuditedCases = myRosterCasesArray.filter(e => e[15] != "");

  myAuditedCases.reverse();
  

  stats = {
    auditedCases: myAuditedCases.length || 0,
    pendingAudits: myRosterPendingAudit.length || 0,
    disputeRate: 0,
    auditedCasesData: myAuditedCases
  };

  console.log(stats);
  
  return JSON.stringify(stats);
}

function getCaseListData(){
    let list = sheetAssignedCases.getDataRange().getValues(),
        filteredList = list.filter((e) => {
          return e[0] == ldap;
        });
//    filteredList.shift();
    filteredList.reverse();

    console.log(filteredList);
    
    return (JSON.stringify(filteredList));
}

function getAllCaseListData(){
    let list = sheetAssignedCases.getDataRange().getValues(),
        filteredList = list;

    filteredList.shift();
    filteredList.reverse();

    console.log(filteredList);
    
    return (JSON.stringify(filteredList));
}

function getQAList(){
  let rosterList = QARosterRef.getRange(2, 1, QARosterRef.getLastRow(), 1).getValues(),
      flattenedArray = rosterList.filter((e) => e != "");
  
  console.log(flattenedArray);

  return flattenedArray;
}

function getSLList(){
  let rosterList = VarianceRosterRef.getRange(2, 1, VarianceRosterRef.getLastRow(), 1).getValues(),
      flattenedArray = rosterList.filter((e) => e != "");
  
  console.log(flattenedArray);

  return flattenedArray;
}

function getFinishedCaseList(){

}


