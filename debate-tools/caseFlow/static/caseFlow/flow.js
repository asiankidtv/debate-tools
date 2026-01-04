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

/**
 * Takes a string of the name of a cookie and returns the cookie's value.
 * See https://docs.djangoproject.com/en/6.0/howto/csrf/#:~:text=AJAX for reference
 * @param {string} name 
 * @returns {value}
 */
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
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

// Flow Specific Stuff
let aff = true;
let flowId = -1;
let deleteId = -1;
// const flows = flow data taken from jinja


/**
 * Save Case Button
 * If id of current flow is -1, save a new flow.
 */
document.getElementById("save-button").addEventListener("click", async function(e) {
    const saveURL = "/api/saveFlow/"
    let data = null
    if (aff) {
        data = {
            "id": flowId,
            "name": document.getElementById("name-input").value,
            "affCase": caseQuill.getContents(),
            "negRebuttal": rebuttalQuill.getContents(),
            "affSummary": summaryQuill.getContents(),
            "negFinalFocus": finalFocusQuill.getContents(),
            "negCase": content.negCase,
            "affRebuttal": content.affRebuttal,
            "negSummary": content.negSummary,
            "affFinalFocus": content.affFinalFocus,
        }
    }
    else {
        data = {
            "id": flowId,
            "name": document.getElementById("name-input").value,
            "affCase": content.affCase,
            "negRebuttal": content.negRebuttal,
            "affSummary": content.affSummary,
            "negFinalFocus": content.negFinalFocus,
            "negCase": caseQuill.getContents(),
            "affRebuttal": rebuttalQuill.getContents(),
            "negSummary": summaryQuill.getContents(),
            "affFinalFocus": finalFocusQuill.getContents(),
        }
    }

    try {
        const status = await fetch(saveURL, {
            method: "POST",
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: JSON.stringify(data)
        });
        if (!status.ok) {
            throw new Error(`Response status: ${status.status}`);           
        }
        else {
            console.log(`Flow was saved!`)
            window.location.reload()
        }
    }
    catch (error) {
        console.log(error.message);
    }
});

document.getElementById("new-flow-button").addEventListener("click", function(e) {
    flowId = -1
    document.getElementById("save-label").innerText = "New Flow Name:"
});

/**
 * Load Cases Button
 * 
 */
document.querySelectorAll(".load-button").forEach((button, index) => {
    button.addEventListener("click", function(e) {
        console.log(flows);
        flowId = flows[index].pk;
        document.getElementById("name-input").value = flows[index].fields.name;
        
        for (const [key, value] of Object.entries(flows[index].fields)) {
            if (key != "name" && key != "created") {
                content[key] = value;
            }
        }
        console.log(content);
        aff = true;
        caseTitle.innerText = "Aff Case";
        rebuttalTitle.innerText = "Neg Rebuttal";
        summaryTitle.innerText = "Aff Summary";
        finalFocusTitle.innerText = "Neg Final Focus";
        caseQuill.setContents(content.affCase)
        rebuttalQuill.setContents(content.negRebuttal)
        summaryQuill.setContents(content.affSummary)
        finalFocusQuill.setContents(content.negFinalFocus)
    });
});

/**
 * Delete Flow Confirmation:
 * Clicking yes sends a request to the API to delete the chosen flow.
 */
document.getElementById("yes-delete-button").addEventListener("click", async function(e) {
    if (deleteId == -1) {
        return;
    }
    
    const confirmModalElement = document.getElementById("delete-confirm-modal");
    const confirmModal = bootstrap.Modal.getInstance(confirmModalElement)
    confirmModal.hide()
    deleteURL = "/api/deleteFlow/"
    try {
        const status = await fetch(deleteURL, {
            method: "POST",
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: JSON.stringify({
                "id": deleteId,
            })
        });
        if (!status.ok) {
            throw new Error(`Response status: ${status.status}`);           
        }
        else {
            console.log(`Flow was Deleted.`)
            window.location.reload()
        }
    }
    catch (error) {
        console.log(error.message);
    }
});

document.querySelectorAll(".delete-button").forEach(button => {
    button.addEventListener("click", function(e) {
        deleteId = button.value
    });
});

/**
 * Switch Case Sides Button
 * Stores the current side's content locally and loads the other. If the other side has no content, it sets the boxes to an empty string.
 * 
 * @NOTE Please, Please, Please refactor this when future me has time. This is very unsustainable :<
*/
document.getElementById("switch-button").addEventListener("click", function(e) {
    if (aff) {
        caseTitle.innerText = "Neg Case";
        rebuttalTitle.innerText = "Aff Rebuttal";
        summaryTitle.innerText = "Neg Summary";
        finalFocusTitle.innerText = "Aff Final Focus";

        content.affCase = caseQuill.getContents();
        content.negRebuttal = rebuttalQuill.getContents();
        content.affSummary = summaryQuill.getContents();
        content.negFinalFocus = finalFocusQuill.getContents();

        if (content.negCase == null) {
            caseQuill.setText("");
            rebuttalQuill.setText("");
            summaryQuill.setText("");
            finalFocusQuill.setText("");
        }
        else {
            caseQuill.setContents(content.negCase);
            rebuttalQuill.setContents(content.affRebuttal);
            summaryQuill.setContents(content.negSummary);
            finalFocusQuill.setContents(content.affFinalFocus);
        }
    }
    else {
        caseTitle.innerText = "Aff Case";
        rebuttalTitle.innerText = "Neg Rebuttal";
        summaryTitle.innerText = "Aff Summary";
        finalFocusTitle.innerText = "Neg Final Focus";

        content.negCase = caseQuill.getContents();
        content.affRebuttal = rebuttalQuill.getContents();
        content.negSummary = summaryQuill.getContents();
        content.affFinalFocus = finalFocusQuill.getContents();

        if (content.affCase == null) {
            caseQuill.setText("");
            rebuttalQuill.setText("");
            summaryQuill.setText("");
            finalFocusQuill.setText("");
        }
        else {
            caseQuill.setContents(content.affCase);
            rebuttalQuill.setContents(content.negRebuttal);
            summaryQuill.setContents(content.affSummary);
            finalFocusQuill.setContents(content.negFinalFocus);
        }
    }

    aff = !aff;
});

document.getElementById("summarize-button").addEventListener("click", async function(e) {
    if (aff) {
        data = {
            "id": flowId,
            "name": document.getElementById("name-input").value,
            "affCase": caseQuill.getContents(),
            "negRebuttal": rebuttalQuill.getContents(),
            "affSummary": summaryQuill.getContents(),
            "negFinalFocus": finalFocusQuill.getContents(),
            "negCase": content.negCase,
            "affRebuttal": content.affRebuttal,
            "negSummary": content.negSummary,
            "affFinalFocus": content.negFinalFocus,
        }
    }
    else {
        data = {
            "id": flowId,
            "name": document.getElementById("name-input").value,
            "affCase": content.affCase,
            "affRebuttal": content.affRebuttal,
            "affSummary": content.affSummary,
            "affFinalFocus": content.affFinalFocus,
            "negCase": caseQuill.getContents(),
            "negRebuttal": rebuttalQuill.getContents(),
            "negSummary": summaryQuill.getContents(),
            "negFinalFocus": finalFocusQuill.getContents(),
        }
    }
    
    const summaryUrl = "/api/summarizeFlow/"
    try {
        const status = await fetch(summaryUrl, {
            method: "POST",
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            },
            body: JSON.stringify(data)
        });
        if (!status.ok) {
            throw new Error(`Response status: ${status.status}`);           
        }
        else {
            console.log(`Flow was Deleted.`)
            window.location.reload()
        }
    }
    catch (error) {
        console.log(error.message);
    }    
});