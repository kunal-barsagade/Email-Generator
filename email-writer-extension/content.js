console.log("Email Writer loaded!!!!!");

function findSendButton(toolbar) {
    return (
        toolbar.querySelector('[data-tooltip="Send"]') ||
        toolbar.querySelector('div[role="button"][tabindex="1"]')
    );
}



/* This is the  EMAIL CONTENT  */
function getEmailContent() {
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];

    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerText.trim();
        }
    }
    return '';
}

/* ---------------- TOOLBAR ---------------- */
function findComposeToolbar() {
    const selectors = ['.aDh', '.btC', '[role="toolbar"]', '.gU.Up'];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) return toolbar;
    }
    return null;
}

/* BUTTON this will create a button */
function createAIButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji ao0 v7 T-I-atl L3 ai-reply-button';
    button.style.marginRight = '8px';
    button.innerText = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    return button;
}

/*  INJECT  */
function injectButton() {
    if (document.querySelector('.ai-reply-button')) return;

    const toolbar = findComposeToolbar();
    if (!toolbar) return;

    const sendButton = findSendButton(toolbar);
    if (!sendButton) return;

    const button = createAIButton();

    button.addEventListener('click', () => {
        button.innerText = 'Generating...';
        button.style.pointerEvents = 'none';
        button.style.opacity = '0.6';

        const emailContent = getEmailContent();

        chrome.runtime.sendMessage(
            {
                type: "GENERATE_EMAIL",
                payload: {
                    emailContent,
                    tone: "professional"
                }
            },
            (response) => {
                button.innerText = 'AI Reply';
                button.style.pointerEvents = 'auto';
                button.style.opacity = '1';

                if (!response || !response.success) {
                    console.error("API Error:", response?.error);
                    return;
                }

                const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
                if (composeBox) {
                    composeBox.focus();
                    document.execCommand('insertText', false, response.data);
                }
            }
        );
    });

    //  INSERT EXACTLY AFTER SEND
    sendButton.parentNode.insertBefore(button, sendButton.nextSibling);
}


/* ---------------- OBSERVER ---------------- */
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);

        const hasCompose = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (
                node.matches?.('[role="dialog"], .aDh, .btC') ||
                node.querySelector?.('[role="dialog"], .aDh, .btC')
            )
        );

        if (hasCompose) {
            console.log("Gmail compose window detected");
            setTimeout(injectButton, 500);
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
