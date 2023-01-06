//Global Variables
var masterArray = [];
var dupCount = 0;
var masterPojoArray = [];
var isEdit = false;
var isDelete = false;

//Initialize the CSV file to the choose file button
function init() {
    document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
}

//Handles the function after file selection
function handleFileSelect(event) {
    const reader = new FileReader()
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0]);
}

//Load the data for further process and arrangement
function handleFileLoad(event) {
    clear();
    var result = event.target.result;
    parse(result);
}

//Perform all the required operations 
parse = (result) => {
    clear();
    if (result !== null && result !== undefined && result.trim() !== '') {
        createHeader();
        addTools();
        createTable();
        result.split('\n').forEach(e => createRow(e));
        updateHeader(result);
        updatePojo();
        updateUI();
    }
}

//Display the data in the form of table with required operation
updateUI = () => {
    //Parent Div
    var outerBox = document.getElementById('fileContent');
    outerBox.style.background = '#ccffff';
    outerBox.style.border = '4px Solid gray';
    outerBox.style.padding = '10px 10px 10px 10px';
    outerBox.style.marginTop = '10px';
    outerBox.style.overflow = 'auto';
    outerBox.style.textAlign = 'center';
    //h4

    //Elements div
    var elements = document.getElementById('toolBar');
    elements.style.borderBlock = 'inherit';
    elements.style.borderBlockColor = 'red';
    elements.style.marginBottom = '10px';
    elements.style.textAlign = 'center';
    elements.childNodes.forEach(item => {
        if (item.type == 'button') {
            var color = null;
            if (item.id == 'add') {
                color = 'lightblue';
            }
            if (item.id == 'edit') {
                color = 'lightgreen';
            }
            if (item.id == 'delete') {
                color = 'lightcoral';
            }
            if (item.id == 'save') {
                color = 'lightpink';
            }
            if (item.id == 'cancel') {
                color = 'lightsalmon';
            }
            if (item.id == 'download') {
                color = 'lightyellow';
            }
            if (item.id == 'filter') {
                color = 'lightseagreen';
            }
            if (item.id == 'removeDuplicate') {
                color = 'lightsteelblue';
            }
            if (item.id == 'addCol') {
                color = 'aquamarine';
            }
            if (item.id == 'enableChart') {
                color = 'darkkhaki';
            }


            item.style.margin = '5px';
            item.style.background = color;
        }

    });
    //table
    var table = document.getElementById('resultTable');
    table.style.width = '100%';

}

//Update the data in the file
updatePojo = () => {
    var masterPojoArray = [];
    for (var i = 0; i < masterArray.length; i++) {
        var item = masterArray[i];
        var items = item.split(',');
        var pojo = {};
        for (var j = 0; j < items.length; j++) {
            pojo[j] = items[j];
        }
        masterPojoArray.push(pojo);
    }

}

//Create the Header Section
createHeader = () => {
    var item = document.getElementById('fileContent');
    var header = document.createElement("h4");
    header.id = 'count';
    item.appendChild(header);
}

//Update the Header Section
updateHeader = (result) => {
    var header = document.getElementById("count");
    rows = result.split('\n').length;
    cols = result.split('\n')[0].split(',').length;
    header.innerHTML = 'Rows : ' + rows + ', Columns : ' + cols + ', Duplicates : ' + dupCount;
}

//Create the table for displaying data of the CSV file
createTable = () => {
    masterArray = [];
    masterPojoArray = [];
    var item = document.getElementById('fileContent');
    var table = document.createElement("table");
    table.id = 'resultTable';
    table.style.border = '1px solid black';
    table.style.borderCollapse = 'collapse';
    item.appendChild(table);
}

//Display the results of CSV file
getTable = () => {
    return document.getElementById('resultTable');
}

//Display the number of total rows present in the CSV file
getNthRow = (n) => {
    var table = getTable();
    return table.childNodes[n - 1];
}

//Display the number of total columns present in the CSV file
getNthColumn = (n) => {
    var column = [];
    var table = getTable();
    table.childNodes.forEach(row => {
        column.push(row.childNodes[n]);
    });
    return column;
}

//Create Row in the table and add the entries one by one
function createRow(e) {
    e = e.trim();
    if (e === '') return null;
    var table = document.getElementById('resultTable');
    var tr = document.createElement("tr");
    var items = e.split(',');
    items.forEach(e1 => tr.appendChild(createCol(e1)));
    if (masterArray.includes(e)) {
        console.log('duplicate entry ' + e);
        tr.style.color = 'red';
        dupCount++;
    }
    masterArray.push(e);
    var pojo = {};
    for (var j = 0; j < items.length; j++) {
        pojo[j] = items[j];
    }
    masterPojoArray.push(pojo);
    table.appendChild(tr);
}

////Create Column in the table 
createCol = (e) => {
    var td = document.createElement("td");
    td.style.border = '1px solid black';
    var node = document.createTextNode(e);
    td.setAttribute('onclick', 'editCol(this)');
    td.appendChild(node);
    return td;

}

//Update Column in the table 
editCol = (td) => {
    debugger;
    var itemType = td.childNodes[0].type;
    if (itemType != undefined) return;
    if (!isEdit) {
        isEdit = true;
        addRowSelectionUI(null);
    }
    var item = document.createElement('input');
    item.type = 'text';
    item.value = td.innerHTML;
    td.innerHTML = '';
    td.appendChild(item);
    displayAllButtons('none');
    displaySaveAndCancel('block');
}

clear = () => {
    masterArray = [];
    dupCount = 0;
    masterPojoArray = [];
    isEdit = false;
    isDelete - false;
    document.getElementById('fileContent').innerHTML = '';
}

//Add all the required operations 
addTools = () => {
    var item = document.getElementById('fileContent');
    var toolBar = document.createElement('div');
    toolBar.id = 'toolBar';
    toolBar.style.padding = '10px 10px 10px 10px';
    item.appendChild(toolBar);
    populateToolBar(toolBar);
}

//Display the available operations
populateToolBar = (toolBar) => {
    addAddRowButton(toolBar);
    addAddColButton(toolBar);
    addEditRowButton(toolBar);
    addDeleteRowButton(toolBar);
    addSaveButton(toolBar);
    addCancelButton(toolBar);
    addRemoveDuplicateButton(toolBar);
    addDownloadButton(toolBar);
    addCreateChartButton(toolBar);
}

//Create button for chart
addCreateChartButton = (toolBar) => {
    var button = document.createElement('input');
    button.type = 'button';
    button.id = 'enableChart';
    button.value = 'Create Chart';
    button.setAttribute("onclick", "enableChart(this);");
    toolBar.appendChild(button);
}

//Make the chart button visible in the webpage
enableChart = (button) => {
    document.getElementById('bg_mask').style.visibility = 'visible';
    document.getElementById('frontlayer').style.visibility = 'visible';
}

//Hide the button in the webpage
hideChart = (button) => {
    document.getElementById('bg_mask').style.visibility = 'hidden';
    document.getElementById('frontlayer').style.visibility = 'hidden';
}

//Add another column in the table
addAddColButton = (toolbar) => {
    var button = document.createElement('input');
    button.type = 'button';
    button.id = 'addCol';
    button.value = 'Add Column';
    button.setAttribute("onclick", "createInTable(this,'col');");
    toolBar.appendChild(button);
}

//Add the row button in the table
addEditRowButton = (toolBar) => {
    var button = document.createElement('input');
    button.type = 'button';
    button.id = 'edit';
    button.value = 'Edit';
    button.setAttribute("onclick", "editRows(this);");
    toolBar.appendChild(button);
}

//Update the rows in the table
editRows = (button) => {
    isEdit = true;
    addRowSelectionUI(button);
    displayAllButtons('none');
    displaySaveAndCancel('block');
}

////Add the Save button in the table
addSaveButton = (toolBar) => {
    var button = document.createElement('input');
    button.type = 'button';
    button.id = 'save';
    button.value = 'Save';
    button.setAttribute("onclick", "save(this);");
    button.style.display = 'none';
    toolBar.appendChild(button);
}

//Add the Cancel button in the table
addCancelButton = (toolBar) => {
    var button = document.createElement('input');
    button.type = 'button';
    button.id = 'cancel';
    button.value = 'Cancel';
    button.setAttribute("onclick", "cancel(this);");
    button.style.display = 'none';
    toolBar.appendChild(button);
}

//Function to save the data in the rows
save = (button) => {
    var table = getTable();
    var rows = table.childNodes;
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var firstCol = row.childNodes[0];
        //in case of delete
        if (isDelete && i > 0) {
            if (!firstCol.checked) {
                var item = masterArray.splice(i, 1, null);
            }
        }
        if (isEdit) {
            var updatedRow = '';
            //iterate whole row to get content
            while (firstCol.nextSibling != null) {
                firstCol = firstCol.nextSibling;
                var children = firstCol.childNodes[0];
                debugger;
                if (children.type != 'text') {
                    //it's a text
                    updatedRow += ',' + children.textContent;
                } else {
                    updatedRow += ',' + children.value;
                }
            }
            var item = masterArray.splice(i, 1, updatedRow.substring(1));
        }
    }

    //fitler out null values
    masterArray = masterArray.filter(item => {
        return item != null;
    });

    refreshUI(false);
}

//Close the popup
cancel = (button) => {
    refreshUI(false);
}

////Add the Delete Row button in the table
addDeleteRowButton = (toolBar) => {
    var button = document.createElement('input');
    button.type = 'button';
    button.id = 'delete';
    button.value = 'Delete';
    button.setAttribute("onclick", "deleteRow(this);");
    toolBar.appendChild(button);
}

//Function to delete the row
deleteRow = (button) => {
    isDelete = true;
    addRowSelectionUI(button);
    displayAllButtons('none');
    displaySaveAndCancel('block');
}

//Display save and cancel button
displaySaveAndCancel = (value) => {
    var saveButton = document.getElementById('save');
    saveButton.style.display = value;
    var cancelButton = document.getElementById('cancel');
    cancelButton.style.display = value;
}

//Add the UI while selecting the row
addRowSelectionUI = (button) => {
    var table = getTable();
    var rows = table.childNodes;
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var item = null;
        if (i > 0) {
            item = document.createElement('input');
            item.id = 'checkbox ' + i;
            item.type = 'checkbox';
            item.checked = (isDelete) ? true : false;
            if (isEdit) {
                item.setAttribute('onclick', 'makeRowEditable(this);');
            }
        } else {//no checkbox for header
            item = document.createTextNode('Rows Selected');
        }
        var firstTd = row.childNodes[0];
        row.insertBefore(item, firstTd);
    }
}

//Function to make row editable
makeRowEditable = (checkbox) => {
    var isEditable = checkbox.checked;
    while (checkbox != null) {
        checkbox = checkbox.nextSibling;
        var item = null;
        if (isEditable) {
            item = document.createElement('input');
            item.type = 'text';
            item.value = checkbox.textContent;
        } else {
            item = document.createTextNode(checkbox.childNodes[0].value);
        }
        checkbox.innerHTML = '';
        checkbox.appendChild(item);
    }
}

//Dispaly all the buttons
displayAllButtons = (type) => {
    var toolBar = document.getElementById('toolBar');
    toolBar.childNodes.forEach(item => {
        item.style.display = type;
    });
}

//Add the Add Row button in the table
addAddRowButton = (toolBar) => {
    var button = document.createElement('input');
    button.type = 'button';
    button.id = 'add';
    button.value = 'Add Row';
    button.setAttribute("onclick", "createInTable(this,'row');");
    toolBar.appendChild(button);
}

//Function to Create rows and columns in the table
createInTable = (button, item) => {
    var table = getTable();
    if (item == 'row') {
        var colsCount = getNthRow(1).childNodes.length;
        var tr = document.createElement('tr');
        while (colsCount > 0) {
            var td = document.createElement('td');
            var inputBox = document.createElement('input');
            inputBox.type = 'text';
            td.appendChild(inputBox);
            tr.appendChild(td);
            colsCount--;
        }
        table.appendChild(tr);
    }
    else if (item == 'col') {
        var rowCount = table.childNodes.length;
        while (rowCount > 0) {
            var row = getNthRow(rowCount);
            var td = document.createElement('td');
            var inputBox = document.createElement('input');
            inputBox.type = 'text';
            td.appendChild(inputBox);
            row.appendChild(td);
            rowCount--;
        }
    }
    isEdit = true;
    addRowSelectionUI(button);
    displayAllButtons('none');
    displaySaveAndCancel('block');
}

//Add the Download button in the table
addDownloadButton = (toolBar) => {
    var button = document.createElement('input');
    button.type = 'button';
    button.id = 'download';
    button.value = 'Download';
    button.setAttribute("onclick", "exportToCSV(this);");
    toolBar.appendChild(button);
}

//Function to download the CSV file from the webpage
exportToCSV = (button) => {
    filename = prompt('Save As (.csv)');
    if (filename == null) {
        return;
    }
    filename += '.csv';
    var table = getTable();
    var csv = [];
    var rows = table.childNodes;

    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].childNodes;

        for (var j = 0; j < cols.length; j++)
            row.push(cols[j].innerText);

        csv.push(row.join(","));
    }
    csv = csv.join("\n");
    var csvFile;
    var downloadLink;
    // CSV FILE
    csvFile = new Blob([csv], { type: "text/csv" });

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Make sure that the link is not displayed
    downloadLink.style.display = "none";

    // Add the link to your DOM
    document.body.appendChild(downloadLink);

    // Lanzamos
    downloadLink.click();
}

//Add the Remove Duplicate button in the table
addRemoveDuplicateButton = (toolBar) => {
    var button = document.createElement('input');
    button.type = 'button';
    button.id = 'removeDuplicate';
    button.value = 'Remove Duplicates';
    button.setAttribute("onclick", "removeDup(this);");
    toolBar.appendChild(button);
}

//Function to remove duplicates from the table
removeDup = (button) => {
    if (dupCount < 1) {
        alert('0 Duplicates found.');
        return;
    }
    button.setAttribute('disabled', 'true');
    refreshUI(false);
}

//Function to update the UI after any changes
refreshUI = (updateMasterArrayFromPojo) => {
    var temp = '';
    var tempArray = [];
    if (updateMasterArrayFromPojo) {
        tempArray.push(masterArray[0]);//add first/header
        masterPojoArray.forEach(item => {
            temp = '';
            for (i in item) {
                temp += ', ' + item[i];
            }
            temp = temp.substring(1);
            tempArray.push(temp);

        });
        masterArray = tempArray;
        tempArray = [];
        temp = '';
    }
    masterArray.forEach(e => {
        if (!tempArray.includes(e)) {
            tempArray.push(e);
            temp += e + '\n';
        }
    });

    parse(temp);
}

//Create the chart from the given CSV file data
createChart = (xData, yData) => {
    if (xData === '' || yData === '') {
        console.log('Either X-axis OR Y-axis is blank');
        return;
    }
    var canvas = document.getElementById('myChart');
    var ctx = canvas.getContext('2d');
    canvas.style.border = '1px solid Black';
    var label = xData.split(',');
    var dataSet = yData.split(',');
    var chartType = document.getElementById('chartType').value;
    console.log('Labels : ' + label);
    console.log('Data : ' + dataSet);
    console.log('chartType : ' + chartType);
    var myChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: label,
            datasets: [{
                label: chartType,
                data: dataSet,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

//Generate the chart by taking x-axis and y-axis values
generateChart = () => {
    var xAxis = document.getElementById('xAxis').value;
    var yAxis = document.getElementById('yAxis').value;
    if (xAxis === '' || yAxis === '') {
        alert('Provide both Column numbers.');
        return;
    }
    createChart(getDelimInput(xAxis, ','), getDelimInput(yAxis, ','));
}


getDelimInput = (colNumber, delim) => {
    var colNum = parseInt(colNumber);
    var finalVal = [];
    for (var i = 1; i < masterPojoArray.length; i++) {
        var pojo = masterPojoArray[i];
        var item = pojo[colNum - 1];
        if (finalVal.indexOf(item) == -1) {
            finalVal.push(item);
        }
    }
    return finalVal.join(delim);
}

