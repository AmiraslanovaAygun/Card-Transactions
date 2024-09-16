let form = document.querySelector("form");
let historyList = document.querySelector(".history-list");

let checkedInputs = document.querySelector(".checks");
let checkbox1 = document.getElementById("checkbox1");
let checkbox2 = document.getElementById("checkbox2");

let mdBtn = document.querySelector(".md-btn");
let mxBtn = document.querySelector(".mx-btn");
let allBtn = document.querySelector(".all-btn");

let balance = document.querySelector(".amount");

let now = new Date();
let date = now.getDate() + "/" + now.getMonth() + "/" + now.getFullYear();
let operationsList = JSON.parse(localStorage.getItem("operationStore")) || [];
let mdList = JSON.parse(localStorage.getItem("operationMD")) || [];
let mxList = JSON.parse(localStorage.getItem("operationMX")) || [];

form.addEventListener("submit", function (event) {
    event.preventDefault();

    let descInput = this.elements["description"];
    let descValue = descInput.value.trim();
    let amountInput = this.elements["amount"];
    let amountValue = amountInput.value.trim();
    let checkInput = this.elements["type"];


    if (descValue && amountValue && (checkbox1.checked || checkbox2.checked)) {
        let operation = {
            amount: amountValue,
            description: descValue,
            type: checkInput.value,
            createdAt: date
        };

        operationsList.push(operation);
        localStorage.setItem("operationStore", JSON.stringify(operationsList))

        if (checkInput.value === "medaxil") {
            mdList.push(operation);
            localStorage.setItem("operationMD", JSON.stringify(mdList))
        } else if (checkInput.value === "mexaric") {
            mxList.push(operation);
            localStorage.setItem("operationMX", JSON.stringify(mxList))
        }

        allBtn.style.backgroundColor = "grey";
        mdBtn.style.backgroundColor = "lightgrey";
        mdBtn.style.color = "rgb(6, 200, 6)";
        mxBtn.style.backgroundColor = "lightgrey";
        mxBtn.style.color = "red";
        descInput.style.borderColor = "transparent";
        amountInput.style.borderColor = "transparent";
        checkedInputs.style.borderColor = "transparent";

        ShowList(operationsList);
        updateBalance();

        descInput.value = "";
        amountInput.value = "";
        descInput.focus();
        checkbox1.checked = false;
        checkbox2.checked = false;
    } else {
        if (!descValue) {
            descInput.style.borderColor = "red";
        }
        if (!amountValue) {
            amountInput.style.borderColor = "red";
        }
        if (!checkbox1.checked && !checkbox2.checked) {
            checkedInputs.style.borderColor = "red";
        }
    }
});

function ShowList(inputList) {
    historyList.innerHTML = "";
    inputList.forEach((operation, index) => {
        let newLi = document.createElement("li");

        let newLiItem = document.createElement("div");
        newLiItem.textContent = `${operation.type === "medaxil" ? "+" : "-"}${operation.amount} `;
        let newFontKit = document.createElement("i");
        newFontKit.className = "fa-solid fa-manat-sign";
        newLiItem.appendChild(newFontKit);
        newLi.appendChild(newLiItem);
        let newContent = document.createElement("p");
        newContent.textContent = `${operation.description}   ${operation.createdAt}`;
        newLi.appendChild(newContent);


        let newBtn = document.createElement("button");
        newBtn.addEventListener("click", function () {
            operationsList.splice(index, 1);
            localStorage.setItem("operationStore", JSON.stringify(operationsList))
            mdList.splice(mdList.indexOf(operation), 1);
            localStorage.setItem("operationMD", JSON.stringify(mdList))
            mxList.splice(mxList.indexOf(operation), 1);
            localStorage.setItem("operationMX", JSON.stringify(mxList))
            ShowList(operationsList);
            updateBalance();
        });
        newBtn.textContent = "Sil";

        newLi.append(newLiItem, newBtn);
        historyList.appendChild(newLi);
    });
}

function ShowBalance(inputList) {
    let sum = 0;
    inputList.forEach((operation) => {
        if (operation.type === "medaxil") {
            sum += Number(operation.amount);
        }
        else if (operation.type === "mexaric") {
            sum -= Number(operation.amount);
        }

    });

    return Math.abs(sum);
}


function updateBalance() {
    balance.textContent = `${ShowBalance(operationsList)} `;
    mdBtn.textContent = `Mədaxil ${ShowBalance(mdList)} AZN`;
    mxBtn.textContent = `Məxaric ${ShowBalance(mxList)} AZN`;
}

updateBalance();


allBtn.addEventListener("click", function () {
    ShowList(operationsList);
    allBtn.style.backgroundColor = "grey";
    mdBtn.style.backgroundColor = "lightgrey";
    mdBtn.style.color = "rgb(6, 200, 6)";
    mxBtn.style.backgroundColor = "lightgrey";
    mxBtn.style.color = "red";
})

mdBtn.addEventListener("click", function () {
    ShowList(mdList);
    allBtn.style.backgroundColor = "lightgrey";
    mdBtn.style.backgroundColor = "rgb(6, 200, 6)";
    mdBtn.style.color = "white";
    mxBtn.style.backgroundColor = "lightgrey";
    mxBtn.style.color = "red";
})

mxBtn.addEventListener("click", function () {
    ShowList(mxList);
    allBtn.style.backgroundColor = "lightgrey";
    mdBtn.style.backgroundColor = "lightgrey";
    mdBtn.style.color = "rgb(6, 200, 6)";
    mxBtn.style.backgroundColor = "red";
    mxBtn.style.color = "white";
})