function loadPartialHTML_(partial){
    const htmlServ = HtmlService.createTemplateFromFile(partial);
    return htmlServ.evaluate().getContent();
}

function loadFAView(){
    return loadPartialHTML_("FA_component");
}