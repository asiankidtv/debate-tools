const options = {
    placeholder: "Begin typing here...",
    theme: "snow",
}

let content = {
    affCase: null,
    affRebuttal: null,
    affSummary: null,
    affFinalFocus: null,

    negCase: null,
    negRebuttal: null,
    negSummary: null,
    negFinalFocus: null,
}

// Initialize Quill editors
const caseQuill = new Quill("#case-editor", options);
const rebuttalQuill = new Quill("#rebuttal-editor", options);
const summaryQuill = new Quill("#summary-editor", options);
const finalFocusQuill = new Quill("#final-focus-editor", options);

// Editor Titles:
const caseTitle = document.getElementById("case-title");
const rebuttalTitle = document.getElementById("rebuttal-title");
const summaryTitle = document.getElementById("summary-title");
const finalFocusTitle = document.getElementById("final-focus-title");

let aff = true;


/**
 * Switch Case Sides Button
 * Stores the current side's content locally and loads the other. If the other side has no content, it sets the boxes to an empty string.
 * 
 * @NOTE Please, Please, Please refactor this when you have time. This is gross and unsustainable.
*/
document.getElementById("switch-button").addEventListener("click", function(e) {
    if (aff) {
        caseTitle.innerText = "Neg Case";
        rebuttalTitle.innerText = "Neg Rebuttal";
        summaryTitle.innerText = "Neg Summary";
        finalFocusTitle.innerText = "Neg Final Focus";

        content.affCase = caseQuill.getContents();
        content.affRebuttal = rebuttalQuill.getContents();
        content.affSummary = summaryQuill.getContents();
        content.affFinalFocus = finalFocusQuill.getContents();

        if (content.negCase == null) {
            caseQuill.setText("");
            rebuttalQuill.setText("");
            summaryQuill.setText("");
            finalFocusQuill.setText("");
        }
        else {
            caseQuill.setContents(content.negCase);
            rebuttalQuill.setContents(content.negRebuttal);
            summaryQuill.setContents(content.negSummary);
            finalFocusQuill.setContents(content.negFinalFocus);
        }
    }
    else {
        caseTitle.innerText = "Aff Case";
        rebuttalTitle.innerText = "Aff Rebuttal";
        summaryTitle.innerText = "Aff Summary";
        finalFocusTitle.innerText = "Aff Final Focus";

        content.negCase = caseQuill.getContents();
        content.negRebuttal = rebuttalQuill.getContents();
        content.negSummary = summaryQuill.getContents();
        content.negFinalFocus = finalFocusQuill.getContents();

        if (content.affCase == null) {
            caseQuill.setText("");
            rebuttalQuill.setText("");
            summaryQuill.setText("");
            finalFocusQuill.setText("");
        }
        else {
            caseQuill.setContents(content.affCase);
            rebuttalQuill.setContents(content.affRebuttal);
            summaryQuill.setContents(content.affSummary);
            finalFocusQuill.setContents(content.affFinalFocus);
        }
    }

    aff = !aff;
});