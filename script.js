const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateButton = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type='checkbox']");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider() ;

setIndicator("#ccc") ;

// Update the slider and length display
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

// Set the strength indicator color
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = '0px 0px 12px 1px ${color}'
}

// Generate a random integer within a range
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Generate random characters
function generateRandomNumber() {
    return getRndInteger(0, 10);
}

function generateLowercase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUppercase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbols() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

// Calculate password strength
function calcStrength() {
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNumber = numbersCheck.checked;
    let hasSymbols = symbolsCheck.checked;

    if (hasUpper && hasLower && (hasNumber || hasSymbols) && passwordLength >= 10) {
        setIndicator("#0f0"); // Strong
    } else if ((hasLower || hasUpper) && (hasNumber || hasSymbols) && passwordLength >= 5) {
        setIndicator("#ff0"); // Medium
    } else {
        setIndicator("#f00"); // Weak
    }
}

// Copy password to clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
        passwordDisplay.value = "";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

// Shuffle the password for randomness
function shufflePassword(passwordArray) {
    for (let i = passwordArray.length - 1; i > 0; i--) {
        const j = getRndInteger(0, i + 1);
        [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
    }
    return passwordArray.join('');
}

// Handle checkbox changes
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

// Event listeners for checkboxes
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

// Event listener for slider input
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

// Event listener for copy button
document.querySelector("button img").parentElement.addEventListener('click', () => {
    if (passwordDisplay.value) copyContent();
});

// Event listener for generate button
generateButton.addEventListener('click', () => {
    if (checkCount <= 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // Reset password
    password = "";

    let funcArr = [];
    if (uppercaseCheck.checked) funcArr.push(generateUppercase);
    if (lowercaseCheck.checked) funcArr.push(generateLowercase);
    if (numbersCheck.checked) funcArr.push(generateRandomNumber);
    if (symbolsCheck.checked) funcArr.push(generateSymbols);

    // Add one character of each selected type
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // Add remaining characters randomly
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // Shuffle and display the password
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;

    // Calculate and set strength
    calcStrength();
});

// Initialize slider
handleSlider();


  