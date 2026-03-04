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

// Initialize Quill editors and titles
const editors = {
    case: new Quill("#case-editor", options),
    rebuttal: new Quill("#rebuttal-editor", options),
    summary: new Quill("#summary-editor", options),
    finalFocus: new Quill("#final-focus-editor", options),
};

const titles = {
    case: document.getElementById("case-title"),
    rebuttal: document.getElementById("rebuttal-title"),
    summary: document.getElementById("summary-title"),
    finalFocus: document.getElementById("final-focus-title"),
};

// Flow Specific Stuff
let aff = true;
let flowId = -1;
let deleteId = -1;
// const flows = flow data taken from jinja and can be found in the html file.

/**
 * Modal Control
 * Works by assigning or removing the 'is-active' class to modals.
 * For every button with the 'js-modal-trigger' class, it connects it to the modal that is in its data-target value.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
        $el.classList.add('is-active');
    }

    function closeModal($el) {
        $el.classList.remove('is-active');
    }

    function closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
        });
    }

    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);

        $trigger.addEventListener('click', () => {
        openModal($target);
        });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
        closeModal($target);
        });
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
        if(event.key === "Escape") {
        closeAllModals();
        }
    });

    // Adds an even to 'no' buttons:
    document.getElementById('no-delete-button').addEventListener("click", function(e) {
        closeAllModals();
    });
});

/**
 * Build save data object for current flow state
 */
function buildSaveData() {
    const baseData = {
        id: flowId,
        name: document.getElementById("name-input").value,
    };

    if (aff) {
        return {
            ...baseData,
            affCase: editors.case.getContents(),
            negRebuttal: editors.rebuttal.getContents(),
            affSummary: editors.summary.getContents(),
            negFinalFocus: editors.finalFocus.getContents(),
            negCase: content.negCase,
            affRebuttal: content.affRebuttal,
            negSummary: content.negSummary,
            affFinalFocus: content.affFinalFocus,
        };
    } else {
        return {
            ...baseData,
            affCase: content.affCase,
            negRebuttal: content.negRebuttal,
            affSummary: content.affSummary,
            negFinalFocus: content.negFinalFocus,
            negCase: editors.case.getContents(),
            affRebuttal: editors.rebuttal.getContents(),
            negSummary: editors.summary.getContents(),
            affFinalFocus: editors.finalFocus.getContents(),
        };
    }
}

/**
 * Save Case Button
 * If id of current flow is -1, save a new flow.
 */
document.getElementById("save-button").addEventListener("click", async function(e) {
    const saveURL = "/api/saveFlow/";
    const data = buildSaveData();

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
        const affTitles = { case: "Aff Case", rebuttal: "Neg Rebuttal", summary: "Aff Summary", finalFocus: "Neg Final Focus" };
        Object.entries(affTitles).forEach(([key, title]) => {
            titles[key].innerText = title;
        });

        editors.case.setContents(content.affCase);
        editors.rebuttal.setContents(content.negRebuttal);
        editors.summary.setContents(content.affSummary);
        editors.finalFocus.setContents(content.negFinalFocus);
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
 * Switch Case Sides
 * Stores the current side's content locally and loads the other. If the other side has no content, it sets the boxes to an empty string.
 */
function swapSides() {
    const titleSets = {
        aff: { case: "Aff Case", rebuttal: "Neg Rebuttal", summary: "Aff Summary", finalFocus: "Neg Final Focus" },
        neg: { case: "Neg Case", rebuttal: "Aff Rebuttal", summary: "Neg Summary", finalFocus: "Aff Final Focus" },
    };

    const editorKeys = ['case', 'rebuttal', 'summary', 'finalFocus'];
    const contentKeys = {
        aff: { case: 'affCase', rebuttal: 'negRebuttal', summary: 'affSummary', finalFocus: 'negFinalFocus' },
        neg: { case: 'negCase', rebuttal: 'affRebuttal', summary: 'negSummary', finalFocus: 'affFinalFocus' },
    };

    const currentSide = aff ? 'aff' : 'neg';
    const nextSide = aff ? 'neg' : 'aff';

    // Store current content and update titles
    editorKeys.forEach(key => {
        content[contentKeys[currentSide][key]] = editors[key].getContents();
        titles[key].innerText = titleSets[nextSide][key];
    });

    // Load next side content or clear
    const nextContent = contentKeys[nextSide]['case'];
    if (content[nextContent] == null) {
        editorKeys.forEach(key => {
            editors[key].setText("");
        });
    } else {
        editorKeys.forEach(key => {
            editors[key].setContents(content[contentKeys[nextSide][key]]);
        });
    }

    aff = !aff;
}

document.getElementById("switch-button").addEventListener("click", swapSides);

/**
 * Get text content from all editors for current side
 */
function getAllEditorText() {
    return {
        case: editors.case.getText(),
        rebuttal: editors.rebuttal.getText(),
        summary: editors.summary.getText(),
        finalFocus: editors.finalFocus.getText(),
    };
}

/**
 * Build summarize data object for current flow state
 */
function buildSummarizeData() {
    const baseData = {
        id: flowId,
        name: document.getElementById("name-input").value,
    };

    if (aff) {
        const affText = getAllEditorText();
        swapSides();
        const negText = getAllEditorText();
        swapSides();

        return {
            ...baseData,
            affCase: affText.case,
            negRebuttal: affText.rebuttal,
            affSummary: affText.summary,
            negFinalFocus: affText.finalFocus,
            negCase: negText.case,
            affRebuttal: negText.rebuttal,
            negSummary: negText.summary,
            affFinalFocus: negText.finalFocus,
        };
    } else {
        const negText = getAllEditorText();
        swapSides();
        const affText = getAllEditorText();
        swapSides();

        return {
            ...baseData,
            negCase: negText.case,
            affRebuttal: negText.rebuttal,
            negSummary: negText.summary,
            affFinalFocus: negText.finalFocus,
            affCase: affText.case,
            negRebuttal: affText.rebuttal,
            affSummary: affText.summary,
            negFinalFocus: affText.finalFocus,
        };
    }
}

document.getElementById("summarize-button").addEventListener("click", async function(e) {
    const data = buildSummarizeData();

    const summaryUrl = "/api/summarizeFlow/";
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
            const summaryTextBox = document.getElementById("response-text");
            summaryTextBox.innerText = "Loading...";

            const responseData = await status.json();
            console.log(responseData.response);

            summaryTextBox.innerText = responseData.response;
        }
    }
    catch (error) {
        console.log(error.message);
    }
});