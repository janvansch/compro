/*
        *************************************************************
        * Product: PolOwn                                           *
        * Description: JavaScript for frontend functionality        * 
        * Created by: Johannes van Schalkwyk                        *
        * License: All rights reserved                              *
        * Location: c:\Node\PolOwn\frontend\js\script.js            *
        *************************************************************
*/

/*********************************************
 * Setting up the modal window functionality *
 *********************************************/

/*************************************************************************************************
 * The modal window, containing the data edit form, to be displayed when the trigger is clicked, *
 * and to be hidden when any of a number of different events take place - when the 'close' link  *
 * is clicked, the 'Esc' key is pressed, or when a mouse click occurs outside the modal window   *
 * Original JavaScript code by Chirp Internet: www.chirp.com.au                                  *
 * Please acknowledge use of this code by including this header.                                 *
 *************************************************************************************************/

    var modalWrapper = document.getElementById("modal_wrapper");
    var modalWindow  = document.getElementById("modal_window");

    // var openModal = function(e) {
    function openModal() {
        modalWrapper.className = "overlay";
        modalWindow.style.marginTop = (-modalWindow.offsetHeight)/2 + "px";
        modalWindow.style.marginLeft = (-modalWindow.offsetWidth)/2 + "px";
        //e.preventDefault();
    };

    var closeModal = function(e) {
        modalWrapper.className = "";
        e.preventDefault();
    };

    var clickHandler = function(e) {
        if(e.target.tagName == "DIV") {
            if(e.target.id != "modal_window") closeModal(e);
            toggleOverlay();
        }
    };

    var keyHandler = function(e) {
        if(e.keyCode == 27) {
            closeModal(e);
            toggleOverlay();
        }
    };

    // document.getElementById("modal_open").addEventListener("click", openModal, false);
    //document.getElementById("dataList").addEventListener("click", openModal, false);
    document.getElementById("modal_close").addEventListener("click", closeModal, false);
    document.addEventListener("click", clickHandler, false);
    document.addEventListener("keydown", keyHandler, false);

/**********************************************
 * Functions used to configure user session *
 **********************************************/
// =============
// Setup Control
// =============
function setup() {
    if (typeof(Storage) !== "undefined") {
        console.log("<<< local storage is supported in this browser >>>");
        console.log("<<< Session setup started ... >>>");
        setupModalForm();
        console.log("<<< Started updating reference data >>>");
        //
        // Clear local storage
        //
        sessionStorage.clear();
        console.log("<<< Cleared local reference data >>>");
        //
        // Load insurance company reference data
        //
        console.log("<<< Started loading Company reference data >>>");
        loadCoData();
        //
        // Load Adviser data sets - advList & advCode
        //
        console.log("<<< Started loading Adviser reference data >>>");
        loadAdvData();
        //
        // Link Entity data sets - bacList, LCO & LBA
        //
        console.log("<<< Started loading Branch Agent reference data >>>");
        loadLnkData();
    }
    else {
        console.log("Problem - local storage is not supported in this browser..");
        result = "Problem - local storage is not supported in this browser";
    }
    //
    // Setup done
    //
    console.log("<<< Session initiation complete >>>");
}
// ===================================
// Add content to modal data edit form
// ===================================
function setupModalForm() {
    console.log("<<< Setup Modal Form fields >>>");
    //
    // Load file data definition
    //
    var dataDef = readRules();
    console.log("<<< Modal form setup - data definitions loaded >>>");
    var inputTag = '';
    //
    // Setup Type A - first field that will have focus
    //
    appendElement(document.getElementById('modal_feedback'),'p','ptag0','');
    // appendElement(document.getElementById('wrapper'),'p','ptag0','');
    appendElement(document.getElementById('ptag0'),'label','label0', dataDef.filedef[0].label);
    appendElement(document.getElementById('label0'),'strong','',' * ');
    appendElement(document.getElementById('label0'),'select','selectA','');
    appendElement(document.getElementById('label0'),'button','buttonA','');
    //
    // Set Type A field attributes
    //
    inputTag = document.getElementById('selectA');
    inputTag.type = "text";
    inputTag.autofocus = true;
    inputTag.required = true;
    inputTag.size = "1";
    inputTag.name = "inputField";
    inputTag.readOnly = true;

    var buttonTag = document.getElementById('buttonA');
    buttonTag.onmousedown = function() {toggleOverlay();};
    buttonTag.innerHTML = "Select";
    //
    // Process loop for Type B - the rest of the fields
    //
    var ptagB = '',
        labelB = '',
        inputB = '',
        buttonB = '';

    for (var i = 1; i < dataDef.filedef.length; i++) {
        ptagB = 'ptag' + i.toString();
        labelB = 'label' + i.toString();
        inputB = 'input' + i.toString();
        buttonB = 'button' + i.toString();
        appendElement(document.getElementById('modal_feedback'),'p',ptagB,'');
        appendElement(document.getElementById(ptagB),'label',labelB, dataDef.filedef[i].label);
        appendElement(document.getElementById(labelB),'strong','',' * ');
        //
        // Check if field is a field with reference data
        //
        if(dataDef.filedef[i].ref == 'true') {
            //
            // Fields with reference data lookup
            //
            appendElement(document.getElementById(labelB),'select',inputB,'');
            if (dataDef.filedef[i].fname == 'source_code' || dataDef.filedef[i].fname == 'branch_agent') {
                if(dataDef.filedef[i].fname == 'source_code') {
                    //
                    // Add button for source code link entity selection list
                    //
                    appendElement(document.getElementById(labelB),'button',buttonB,'');
                }
                if(dataDef.filedef[i].fname == 'branch_agent') {
                    //
                    // Add button for branch agent code link entity selection list
                    //
                    appendElement(document.getElementById(labelB),'button',buttonB,'');
                }
                //
                // Set button attributes
                //
                var buttonTag = document.getElementById(buttonB);
                buttonTag.onmousedown = function() {toggleOverlay();};
                buttonTag.innerHTML = "Select";
                //
                // Set input field attributes - remove once the final design and dropdowns not required for thess fields
                //
                inputTag = document.getElementById(inputB);
                //inputTag.type = "text";
                inputTag.size = "1";
                inputTag.name = "inputField";
                if (dataDef.filedef[i].blank == 'false') {
                    inputTag.required = true;
                }
            }
            else {
                //
                // Set input field attributes 
                //
                inputTag = document.getElementById(inputB);
                //inputTag.type = "text";
                inputTag.size = "1";
                inputTag.name = "inputField";
                if (dataDef.filedef[i].blank == 'false') {
                    inputTag.required = true;
                }
            }
        }
        else {
            //
            // Field with no reference data lookup
            //
            appendElement(document.getElementById(labelB),'input',inputB,'');
            //
            // Set field attributes
            //
            inputTag = document.getElementById(inputB);
            inputTag.type = "text";
            inputTag.size = "20";
            inputTag.name = "inputField";
            if(dataDef.filedef[i].edit == 'false') {
                inputTag.readOnly = true;
            }
            if (dataDef.filedef[i].blank == 'false') {
                inputTag.required = true;
            }
        }
    }
    //
    // Add reset and submit buttons
    //
    appendElement(document.getElementById('modal_feedback'),'p','ptagC','');
    appendElement(document.getElementById('ptagC'),'input','inputD','');
    appendElement(document.getElementById('ptagC'),'input','inputC','');
    //
    // Type C
    //
    inputTag = document.getElementById('inputC');
    inputTag.type="submit";
    inputTag.name="feedbackForm";
    inputTag.value="Submit";
    //
    // Type D
    //
    inputTag = document.getElementById('inputD');
    inputTag.type="reset";
    inputTag.name="feedbackForm";

    console.log("<<< Modal form setup complete >>>");
}

/**********************************************************
 * Functions to load reference data for -                 *
 * 1. The options for the select fields of the modal form *
 * 2. The lookup data stored in the local session         *
 **********************************************************/
//
// Insurance Company (S01 - insurance_co_code) Data
//
function loadCoData() {
    console.log("<<< Company setup - request reference data:", dataRequest);
    var dataRequest = 'req=company';
    requestRefData(dataRequest, function(err, result) {
        if (!err) {
            console.log(">>> Company setup - data received: ", result);
            /* result.refData def:
                coCode  : ins_co_code
                lob     : LOB_Code
                coName  : PROVIDER_Name
                active  : PROVIDER_Active_Ind
                bookType: Provider_BookType
            */
            var record = '',
                key = '',
                optionDesc = '',
                optionValue = '';
            //
            // Load file data definition
            //
            var dataDef = readRules();
            console.log("<<< Company setup - data definitions loaded >>>");
            //
            // Load DOM element
            //
            var inputTag = document.getElementById('selectA');
            //
            // Processing loop for reference data received
            //
            for (var i = 0; i < result.refData.length; i++) {
                //
                // Create options for Company select dropdown
                //
                if (result.refData[i].active == "YES") {
                    optionDesc = result.refData[i].coCode + ' ' + result.refData[i].coName;
                    // console.log(">>> Company setup - option description: ", optionDesc);
                    optionValue = result.refData[i].coCode;
                    // console.log(">>> Company setup - option value: ", optionValue);
                    inputTag[inputTag.length]=new Option(optionDesc, optionValue);
                }
                //
                // Build Company Code reference data
                //
                // record = JSON.stringify(result.refData[i]);
                // key = "'coCode" + result.refData[i].coCode + "'";
                // sessionStorage.setItem(key, record);
            }
        }
        else {
            console.log("<<< Company reference data request failed:", dataRequest);
        }
        console.log("<<< Company reference data loaded >>>");
    });
}
//
// Adviser (S03 - source_code) Data
// Also called:
//      marketers_code_2 (S17), marketers_code_3 (S18) and marketers_code_4 (S19) in commission file
//      adviser_code in the Linked Entity and Agent Profile files
//
function loadAdvData() {
    console.log("<<< Adviser setup - request reference data:", dataRequest);
    var dataRequest = 'req=adviser';
    requestRefData(dataRequest, function(err, result) {
        if (!err) {
            console.log(">>> Adviser setup - data received: ", result);
            /* result.refData def:
                advCode : adviser_code
                advName : adviser_full_name
            */
            var record = '',
                key = '',
                optionDesc = '',
                optionValue = '';
            //
            // Load file data definition
            //
            var dataDef = readRules();
            console.log("<<< Adviser setup - data definitions loaded >>>");
            //
            // Get field number to determine value of inputB for getElementById method
            //
            for (var j = 0; j < dataDef.filedef.length; j++) {
                if(dataDef.filedef[j].fname == 'source_code') {
                    var inputAdv = 'input' + j.toString();
                    var inputAdvTag = document.getElementById(inputAdv);
                }
                if(dataDef.filedef[j].fname == 'marketers_code_2') {
                    var inputMC2 = 'input' + j.toString();
                    var inputMC2Tag = document.getElementById(inputMC2);
                }
                if(dataDef.filedef[j].fname == 'marketers_code_3') {
                    var inputMC3 = 'input' + j.toString();
                    var inputMC3Tag = document.getElementById(inputMC3);
                }
                if(dataDef.filedef[j].fname == 'marketers_code_4') {
                    var inputMC4 = 'input' + j.toString();
                    var inputMC4Tag = document.getElementById(inputMC4);
                }
            }
            //
            // Processing loop for reference data received
            //
            for (var i = 0; i < result.refData.length; i++) {
                //
                // Create options for Adviser select dropdown
                //
                optionDesc = result.refData[i].advCode + ' ' + result.refData[i].advName;
                // console.log(">>> Adviser setup - option description: ", optionDesc);
                optionValue = result.refData[i].advCode;
                //console.log(">>> Adviser setup - option value: ", optionValue);
                inputAdvTag[inputAdvTag.length] = new Option(optionDesc, optionValue);
                inputMC2Tag[inputMC2Tag.length] = new Option(optionDesc, optionValue);
                inputMC3Tag[inputMC3Tag.length] = new Option(optionDesc, optionValue);
                inputMC4Tag[inputMC4Tag.length] = new Option(optionDesc, optionValue);
                //
                // Build Adviser Code reference data
                //
                // record = JSON.stringify(result.refData[i]);
                // key = "'advCode" + result.refData[i].advCode + "'";
                // sessionStorage.setItem(key, record);
            }
            console.log(">>> Adviser setup - option value: ", optionValue);
        }
        else {
            console.log("<<< Adviser reference data request failed:", dataRequest);
        }
        console.log("<<< Adviser reference data loaded >>>");
    });
}
//
// Branch Agent (S15 - branch_agent) Data
// Also called branch_agent_code in the Entity Link file
//
function loadLnkData() {
    console.log("<<< Branch Agent setup - request reference data:", dataRequest);
    var dataRequest = 'req=agent';
    requestRefData(dataRequest, function(err, result) {
        if (!err) {
            console.log(">>> Branch Agent setup - data received: ", result);
            /* Record def:
                branchAgentCode : branch_agent_code
                coCode          : ins_co_code
                advCode         : adviser_code
                active          : active
            */
            var record = '',
                key = '',
                optionDesc = '',
                optionValue = '';
            //
            // Update linklist table with link entity data
            //
            populateLinkList(result);
            //
            // Load file data definition
            //
            var dataDef = readRules();
            console.log("<<< Branch Agent setup - data definitions loaded >>>");
            //
            // Get field number to determine value of inputB for getElementById method
            //
            for (var j = 0; j < dataDef.filedef.length; j++) {
                if(dataDef.filedef[j].fname == 'branch_agent') {
                    var inputB = 'input' + j.toString();
                    var inputTag = document.getElementById(inputB);
                    break;
                }
            }
            //
            // Processing loop for reference data received
            //
            for (var i = 0; i < result.refData.length; i++) {
                //
                // Create options for Adviser select dropdown
                //
                optionDesc = result.refData[i].branchAgentCode;
                // console.log(">>> Branch Agent setup - option description: ", optionDesc);
                optionValue = result.refData[i].branchAgentCode;
                // console.log(">>> Branch Agent setup - option value: ", optionValue);
                inputTag[inputTag.length] = new Option(optionDesc, optionValue);

                //
                // Create company code lookup dataset
                //
                // record = JSON.stringify(result.refData[i]);
                // key = "'LCO" + result.refData[i].coCode + "'";
                // sessionStorage.setItem(key, record);
                //
                // Create branch agent code lookup dataset
                //
                // key = "'LBA" + result.refData[i].branchAgentCode + "'";
                // sessionStorage.setItem(key, record);
            }
        }
        else {
            console.log("<<< Branch Agent reference data request failed:", dataRequest);
        }
        console.log("<<< Branch Agent reference data loaded >>>");
    });
}

//
// Request reference data from server via xhttp (AJAX)
//
function requestRefData(request, callback) {
    //
    // Open connection to server
    //
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    }
    else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange = function() {
        // console.log("Ready state:", xhttp.readyState);
        //
        // Receive data from server
        //
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var response = xhttp.responseText; // content string from server
            // console.log(">>> Response String: ", response);
            var refData = JSON.parse(response);
            if (refData !== null) {
                console.log(">>> xhttp request response: ", refData);
                //
                // Execute callback function with result as the parameter
                //
                var err = false;
                if(typeof callback === "function"){
                    callback(err, refData);
                }
                else {
                    console.log("<<< ERROR - the callback is not a function >>>");
                }
            }
            else { // obj.state == 'err')
                err = true;
                console.log("<<< xhttp request failed :", request, response, refData);
                callback(err, '')
            }
        }
    }
    // Request transact data from server
    xhttp.open('POST', '/getRefData');
    xhttp.setRequestHeader("Content-type", "text/html");
    xhttp.send(request);
}

/********************************************
 * File load and display functions sectionb *
 ********************************************/
//
// Extract file data from text file and load into an array for processing of the format rules
//
function Upload() {
    //
    // load file data definition
    //
    var objRules = readRules();
    //
    // Extract data from selected file
    //
    var fileData = [];
    var rowCount = 0;
    var columnCount = 0;
    var fileUpload = document.getElementById("fileUpload");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/; // a regular expression
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) !== "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) { // e = the current event
                //
                // split file at line break into rows
                //
                var rows = e.target.result.split("\n"); // rows is an array of file rows
                // determine the number of rows
                rowCount = rows.length;
                //
                // split rows into cells using the selected delimiter
                //
                // determine the selected delimiter
                var radioButton = document.getElementsByName("fileDelimiter");
                for (var j=0; j < radioButton.length; j++) {
                    if (radioButton[j].checked) {
                        var cellDelimiter = radioButton[j].value;
                        console.log(">>> Delimiter:", cellDelimiter);
                    }
                }
                // now process each row
                for (var i = 0; i < rowCount; i++) {
                    //
                    // split row into cells at delimiter
                    // cells is an array of the content of the cells of a row
                    //
                    if (cellDelimiter == 0) {
                        var cells = rows[i].split(",");
                    }
                    else {
                        var cells = rows[i].split(";");
                    }
                    // console.log(">>> Rows[x]", rows);
                    // console.log(">>> Cells:", cells);
                    //
                    // detemine the number of columns
                    //
                    columnCount = cells.length;
                    //
                    // Validate that number of columns ara correct
                    //
                    try {
                        if (columnCount != 19) throw "Number of columns incorrect";
                    }
                    catch(err) {
                        console.log("Error: " + err);
                        alert("column error");
                    }
                    //
                    // Validate cell data type and size
                    //
                    for (var j = 0; j < columnCount; j++) {
                        var nodeContent = cells[j].trim();
                        var typeRule = objRules.filedef[j].datatype;
                        var lenRule = objRules.filedef[j].size;
                        try {
                            if (typeRule == "string") {
                                if (!isString(nodeContent)) throw "Data Error: String expected";
                                if (!(nodeContent.length <= lenRule)) throw "Data Error: length incorrect";
                            }
                            else {
                                if (!isNumber(nodeContent)) throw "Data Error: Number expected";
                               // if (!(nodeContent.length <= lenRule)) throw "Data Error: Number expected";
                            }
                        }
                        catch(err) {
                            console.log("Error: " + err);
                        }
                    }
                    // Load row with node data into array
                    fileData.push(cells); // insert cells array into rows array
                } // end of row processing
                //
                // Display data loaded
                //
                // console.log(">>> Call dispDataList: ", fileData)
                var listPrompt = 'Data list - File data';
                dispDataList(fileData, listPrompt);
            } // end of file read function definition
            reader.readAsText(fileUpload.files[0]);

        } // end of if
        else {
            alert("This browser does not support HTML5.");
        }
    }
    else {
        alert("Please upload a valid CSV file.");
    }
}
//
// Create table to display list content in DOM 
//
function dispDataList(listContent, listPrompt) {
    //
    // Setup
    //
    var rowCount = listContent.length;
    var colCount = listContent[0].length;
    var objRules = readRules();
    //
    // creates a table element
    //
    var table = document.createElement('table');
    //
    // Give table an id to reference it
    //
    table.setAttribute('id','dataList');
    //
    // create header
    //
    var header = table.createTHead();
    //
    // create header row
    //
    var headerRow = header.insertRow(0);
    //
    // create cells and insert label content
    //
    for (var j = 0; j < colCount; j++) {
        var headerCell = headerRow.insertCell(-1);
        headerCell.innerHTML = objRules.filedef[j].label;
    }
    //
    // create body
    //
    var body = table.createTBody();
    //
    //
    // create a body row for each data row
    //
    for (var i = 0; i < rowCount; i++) {
        //
        // insert a body row for each data row
        //
        var tableRow = body.insertRow(-1);
        //
        // insert a cell for each data column
        //
        for (var j = 0; j < colCount; j++) {
            //
            // insert a cell
            //
            var tableCell = tableRow.insertCell(-1);
            //
            // handle the &amp problem
            //
            if (j == 4 || j == 5) {
                listContent[i][j] = listContent[i][j].replace(/&/g, '%26'); 
                // "/&/g" = regular expression to replace all
                // "/&/gi" = regular expression to replace all, not case sensitive
            }
            //
            // insert cell content
            //
            tableCell.innerHTML = listContent[i][j].trim(); 
        } // end of column loop
    } // end of row loop
    // console.log(">>> Data display table created", table);
    //
    // Insert Table into DOM for display
    //
    var tablePos = document.getElementById("tablePos");
    tablePos.innerHTML = "";
    tablePos.appendChild(table); // add child element to document
    //
    // Update list section heading
    //
    if (listPrompt !== null){
    document.getElementById("dList").innerHTML = listPrompt;
    }
    console.log("<<< Data list display updated >>>");
}
//
// Execute commit request and store file data
//
function commitFileData() {
    //
    // Send file register data and commission data to server
    // Server will create the file register entry and save the 
    // commission data
    //
    // Get the file register input parameters from DOM input
    //
    var input = document.getElementsByName("fileRegData");
    console.log("File Register:", input);
    console.log("Input data:", input[0].value, input[1].value, input[2].value);
    // create send data string
    var fileRegData = "source=" + input[0].value +
                        "&rem_per=" + input[1].value +
                        "&rem_year=" + input[2].value;
    console.log("File Register:", fileRegData);
    //
    // Set up connection to server
    //
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } 
    else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    //
    // Monitor request state changes reported by server
    //
    xhttp.onreadystatechange = function() {
        console.log("Ready state:", xhttp.readyState);
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //
            // Request complete and successful response from server, start stage two
            //
            var response = xhttp.responseText; 
            console.log("response:", response);
            var respJ = JSON.parse(response.substring(0, response.indexOf("|")));
            console.log("JSON part of response", respJ);
            var respH = response.substring(response.indexOf("|")+1, response.length);
            console.log("HTML part of response", respH);

            // var response = JSON.parse(xhttp.responseText);
            // var response = JSON.parse(response);
            console.log("send:", response);
            // The response can be either - 
            //      "stage":"two", "info":"record index" or 
            //      "stage":"done", "info":"file register table content in HTML"
            //
            if (respJ.stage == 'two') {
                //
                // Stage one, create file register entry, is complete.
                // Start stage two to save the file data.
                //
                var objTrxData = {
                    'data': []
                };
                var objRules = readRules();
                var trxTable = document.getElementById("dataList");
                console.log("Data List Table:", trxTable);
                var rowCount = trxTable.rows.length;
                //
                // extract transaction rows from table ignoring the header row
                //
                for (var r = 1, n = trxTable.rows.length; r < n; r++) {
                    //
                    // Fill object data array with extracted data rows
                    //
                    objTrxData.data[r-1] = ({
                        file_id: respJ.info,
                        trx_type: 'F',
                        insurance_co_code: trxTable.rows[r].cells[0].innerHTML,
                        marketers_code: trxTable.rows[r].cells[1].innerHTML,
                        source_code: trxTable.rows[r].cells[2].innerHTML,
                        policy_no: trxTable.rows[r].cells[3].innerHTML,
                        policy_holder: trxTable.rows[r].cells[4].innerHTML,
                        initials: trxTable.rows[r].cells[5].innerHTML,
                        commission_type: trxTable.rows[r].cells[6].innerHTML,
                        commission_amount: trxTable.rows[r].cells[7].innerHTML,
                        vat_amount: trxTable.rows[r].cells[8].innerHTML,
                        broker_fee_amount: trxTable.rows[r].cells[9].innerHTML,
                        month_commission_amount: trxTable.rows[r].cells[10].innerHTML,
                        revised_policy_no: trxTable.rows[r].cells[11].innerHTML,
                        premium_amount: trxTable.rows[r].cells[12].innerHTML,
                        line_of_business: trxTable.rows[r].cells[13].innerHTML,
                        branch_agent: trxTable.rows[r].cells[14].innerHTML,
                        period: trxTable.rows[r].cells[15].innerHTML,
                        marketers_code_2: trxTable.rows[r].cells[16].innerHTML,
                        marketers_code_3: trxTable.rows[r].cells[17].innerHTML,
                        marketers_code_4: trxTable.rows[r].cells[18].innerHTML
                    });
                }
                // console.log("<<< TRX Data Obj >>> ", objTrxData);
                //
                // Now stringify data obj into JSON string for data transfer
                //
                var jTrxData = JSON.stringify(objTrxData);
                // console.log("TRX JSON Data:", jTrxData);
                //
                // Send file data to server
                //
                xhttp.open("POST", "/postTrxData");
                // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                // xhttp.setRequestHeader("Content-type", "text/html");
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(jTrxData);
            }
            else { // response.stage == 'done')
                //
                // Stage two, file data saved and data validation is complete.
                // Stage three is to update file register table display.
                //
                document.getElementById("fileReg").innerHTML = respH;
            }
        }
    }
    //
    // First stage: send file register data to create File Register entry
    //
    xhttp.open("POST", "/postFileReg");
    // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.setRequestHeader("Content-type", "text/html");
    xhttp.send(fileRegData);
}

/****************************************************
 * Functions to display file rows in selected state *
 ****************************************************/
//
// For selected state retrieve the data from the DB and format it for display
//
function getTrxDetail(fileId, col) {
    console.log(">>> Data request parameters:", fileId, col);
    // Create transaction detail request string fom parameters provided
    var request = "fileId=" + fileId +  
                    "&col=" + col;
    console.log(">>> Send Request:", request);
    //
    // Request data from server
    //
    requestStateData(request, function(response) {
        // console.log(">>> Query Response String: ", response);
        var listData = [],
            listRow = '',
            cells = [],
            recCount = response.trxData.length,
            record = '',
            key = '';
        for (i=0; i < recCount; i++) { 
            listRow =   response.trxData[i].insurance_co_code + ',' +
                        response.trxData[i].marketers_code + ',' +
                        response.trxData[i].source_code + ',' +
                        response.trxData[i].policy_no + ',' +
                        response.trxData[i].policy_holder + ',' +
                        response.trxData[i].initials + ',' +
                        response.trxData[i].commission_type + ',' +
                        response.trxData[i].commission_amount + ',' +
                        response.trxData[i].vat_amount + ',' +
                        response.trxData[i].broker_fee_amount + ',' +
                        response.trxData[i].month_commission_amount + ',' +
                        response.trxData[i].revised_policy_no + ',' +
                        response.trxData[i].premium_amount + ',' +
                        response.trxData[i].line_of_business + ',' +
                        response.trxData[i].branch_agent + ',' +
                        response.trxData[i].period + ',' +
                        response.trxData[i].marketers_code_2 + ',' +
                        response.trxData[i].marketers_code_3 + ',' +
                        response.trxData[i].marketers_code_4
            ;
            // console.log(">>> List Row: ", listRow);
            cells = listRow.split(",");
            // console.log(">>> List row cells: ", cells);
            listData.push(cells);
            //
            // Extract associated messages and store locally
            //
            // console.log(">>> Record Data: ", record);
            record = JSON.stringify(response.trxData[i].messages);
            key = 'MES' + i.toString();
            // console.log(">>> Record Data: ", record);
            sessionStorage.setItem(key, record);
            //console.log("<<< Messages Stored Locally >>>")

        }
        console.log("<<< List data retrieved and messages Stored Locally >>>")
        // console.log(">>> Data list:", listData);
        console.log(">>> row Count:", listData.length);
        console.log(">>> cell Count:", listData[0].length);
        //
        // Define data list prompts
        //
        var promptList = ['Data list - Data loaded',
                            'Data list - Warnings',
                            'Data list - Errors',
                            'Data list - Valid',
                            'Data list - Adjustments',
                            'Data list - Deleted',
                            'Data list - Posted'];
        var listPrompt = promptList[col-6];

        console.log("<<< Display list >>>")
        //
        // Call function to display selected list data
        //
        dispDataList(listData, listPrompt);
        //
        // Add row handlers to enable editing of rows
        //
        addRowHandlers();
        console.log("<<< Row handlers added >>>")
    });
}
//
// Request server to get data from DB
//
function requestStateData(request, callback) {
    //
    // Open connection to server
    //
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    }
    else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange = function() {
        console.log("Ready state:", xhttp.readyState);
        //
        // Receive data from server
        //
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var response = xhttp.responseText; // content string from server
            // console.log(">>> Query Response String: ", response);
            var jContent = JSON.parse(response);
            console.log(">>> TRX Query Response Obj: ", jContent);
            if (jContent !== null) {
                //
                // Execute callback function
                //
                callback(jContent);
            }
            else { // obj.state == 'err') 
                console.log("<<< Data request failed >>>", request);
            }
        }
    }
    // Send request to server
    xhttp.open('POST', '/getTrxData');
    xhttp.setRequestHeader("Content-type", "text/html");
    xhttp.send(request);
}

/**************************************************************
 * Functions to enable data edit of selected row in data list *
 **************************************************************/
//
// Add functionality to data list rows to enable editing of data
//
function addRowHandlers() {
    console.log("<<< Start adding Row Handlers >>>");
    var rows = document.getElementById("dataList").rows;
    for (i = 1; i < rows.length; i++) {
        // ignore header, row 0
        rows[i].onclick = function(){ editRow(this); };
        rows[i].onmouseover = function(){ ChangeColor(this, true); };
        rows[i].onmouseout = function(){ ChangeColor(this, false); };
    }
    console.log("<<< Row Handlers Added >>>");
}
//
// Edit selected Row
//
function editRow(rowData) {
    //
    // Extract data from selected row in DOM and insert into modal form fields
    //
    console.log(">>> Edit Row param: ", rowData);
    var inputTag = document.getElementById('selectA');
    inputTag.value = rowData.cells[0].innerHTML;
    console.log(">>> Row length: ", rowData.cells.length);
    for (var c = 1, m = rowData.cells.length; c < m; c++) {
        inputB = 'input' + c.toString();
        // console.log(">>> Tag ID: ", inputB);
        // console.log(">>> Cell content: ", rowData.cells[c].innerHTML);
        inputTag = document.getElementById(inputB);
        inputTag.value = rowData.cells[c].innerHTML;
    }
    //
    // Display modal form 
    //
    openModal();

    //console.log(">>> Call Modal Form >>>");
    //modalEdit();
}

    /*
    if error state
        form to edit data
        form to delete

    if warning state
        select edit or force

    Get error messages and flag fields
    Edit form
        Change data - select from reference data, use TRIO to validate input
            Amend reference data
        if warning allow force -remove warning
        On exit Save Data and update audit data
    If all errors resoved
        if all warnings resolved
            Update trx status to valid
        else Update trx status to warning
        Update counts in file register

    */

function hamburger() {
    console.log("<<< Hamburger >>>");
    /*
    to:
        export valid and adjustments - view/stored procedure that provides acces to valid trx for export data
        create adjustment
        edit reference data
        change password
        remove file register entry - deletes everything
        truncate tables ?????????
        view audit history
    */
}

function updateAudit(rowData) {
    console.log("<<< Audit >>>");
}

/*****************************************************************
 * Overlay Function Section for link entity selection list table *
 *****************************************************************/
//
// *** Original overlay code credit to https://www.developphp.com/ ***
// ===================================================================
var filters = ['hide_company','hide_agent','hide_adviser'];
//
// Hide rows
//
function ExcludeRows(cls){
    var skipRows = [];
    for( i = 0; i < filters.length; i++)
        if(filters[i] != cls) skipRows.push(filters[i]);
    var pattern = skipRows.join('|')
    return pattern;
}
//
// Process filter
//
function Filter(srcField){
    var node = srcField.parentNode;
    var index = srcField.parentNode.cellIndex;
    //
    //all the DATA rows
    //
    var dataRows = document.getElementsByClassName("row");
    //
    //ensure that dataRows do not have any filter class added already
    var rowLen = dataRows.length;
    var filter = 'hide_' + srcField.id;
    var pattern = ExcludeRows(filter);
    var skipRow = new RegExp(pattern,"gi");
    var searchReg = new RegExp('^' + srcField.value,'gi');
    var replaceCls = new RegExp(filter,'gi');
    for(i = 0; i < rowLen; i++){
        //skip if already filter applied
        if(dataRows[i].className.match(skipRow)) continue;
        //now we know which column to search
        //remove current filter
        dataRows[i].className = dataRows[i].className.replace(replaceCls,'');
        if(!dataRows[i].cells[index].innerHTML.trim().match(searchReg))
            dataRows[i].className = dataRows[i].className +' '+ filter;
    }
}
//
// Overlay on/off
// 
function toggleOverlay(){
    var overlay = document.getElementById('overlay');
    var specialBox = document.getElementById('specialBox');
    overlay.style.opacity = .8;
    if(overlay.style.display == "block"){
        overlay.style.display = "none";
        specialBox.style.display = "none";
    } else {
        overlay.style.display = "block";
        specialBox.style.display = "block";
    }
}
// end================================================================
//
// Build link list table from link entity data
//
function populateLinkList(linkList) {
    console.log("<<< Start building Link Select table >>>");
    // console.log(">>> Link list data:", linkList);
    /* linkList.refData[]:
                branchAgentCode : branch_agent_code
                coCode          : ins_co_code
                advCode         : adviser_code
                active          : active
    */
    var lnkBody = document.getElementById("linkbody");
    //
    // create a body row for each data row
    //
    for (var i = 0; i < linkList.refData.length; i++) {
        if (linkList.refData[i].active == 'Y') {
            //
            // insert a data row
            //
            //var lnkRow = lnkBody.insertRow(-1);
            var trId = 'x' + i.toString();
            appendElement(lnkBody,'tr',trId,'');
            // console.log("<<< Link list table - row added >>>");
            var trRef = document.getElementById(trId);
            trRef.className = "row";
            //
            // add cells and insert content
            //
            appendElement(trRef,'td','',linkList.refData[i].coCode);
            //var lnkCell = lnkRow.insertCell(-1);
            //lnkCell.innerHTML = linkList.refData[i].coCode;
            appendElement(trRef,'td','',linkList.refData[i].branchAgentCode);
            //var lnkCell = lnkRow.insertCell(-1);
            //lnkCell.innerHTML = linkList.refData[i].branchAgentCode;
            appendElement(trRef,'td','',linkList.refData[i].advCode);
            //var lnkCell = lnkRow.insertCell(-1);
            //lnkCell.innerHTML = linkList.refData[i].advCode;
        }
    } // end of row loop
    console.log("<<< Link Select table created >>>");
    //
    // Add row select functionality
    //
    console.log("<<< Enable row select for linklist table >>>");
    addRowSelect();
}
//
// Add row select functionality to Link List table rows
//
function addRowSelect() {
    console.log("<<< Start adding row select functionality >>>");
    var rows = document.getElementById("linkbody").rows;
    for (i = 0; i < rows.length; i++) {
        // ignore header, row 0 and filter, row 1
        rows[i].onclick = function(){ inputSelect(this); };
        rows[i].onmouseover = function(){ ChangeColor(this, true); };
        rows[i].onmouseout = function(){ ChangeColor(this, false); };
    }
    console.log("<<< Row select functionality added >>>");
}
//
// Insert data of selected row into modal edit form
//
function inputSelect(rowData) {
    //
    // Load file data definition
    //
    var dataDef = readRules();
    console.log("<<< Input Select - data definitions loaded >>>");
    //
    // Extract data from selected row in DOM and insert into modal form fields
    //
    console.log(">>> Edit Row param: ", rowData);
    for (var j = 0; j < dataDef.filedef.length; j++) {
        if(dataDef.filedef[j].fname == 'source_code') {
            var inputB = 'input' + j.toString();
            var inputAdv = document.getElementById(inputB);
        }
        if(dataDef.filedef[j].fname == 'branch_agent') {
            var inputB = 'input' + j.toString();
            var inputBAC = document.getElementById(inputB);
        }
    }
    var inputCo = document.getElementById('selectA');
    // var inputBAC = document.getElementById(inputBAC);
    // var inputAdv = document.getElementById(inputAdv);
    inputCo.value = rowData.cells[0].innerHTML;
    inputBAC.value = rowData.cells[1].innerHTML;
    inputAdv.value = rowData.cells[2].innerHTML;
    //
    // Close link list overlay
    //
    toggleOverlay();
}

/*********************
 * General Functions *
 *********************/
//
// Function that return the data definitions as an object
//
function readRules() {
    // string with JSON syntax
    var jText = '{ "filedef" : [' + 
        '{ "fcode":"S01" , "fname":"insurance_co_code" , "label":"Product Provider Code" , "datatype":"string" , "size":"3" , "used":"true" , "edit":"true" , "blank":"false" , "ref":"true" },' +
        '{ "fcode":"S02" , "fname":"marketers_code" , "label":"Marketers Code" , "datatype":"string" , "size":"8" , "used":"false" , "edit":"true" , "blank":"true" , "ref":"false" },' +
        '{ "fcode":"S03" , "fname":"source_code" , "label":"AGT Code" , "datatype":"string" , "size":"20" , "used":"true" , "edit":"true" , "blank":"false" , "ref":"true" },' +
        '{ "fcode":"S04" , "fname":"policy_no" , "label":"Policy Number" , "datatype":"string" , "size":"15" , "used":"true" , "edit":"false" , "blank":"false" , "ref":"false" },' +
        '{ "fcode":"S05" , "fname":"policy_holder" , "label":"Policy Holder" , "datatype":"string" , "size":"50" , "used":"true" , "edit":"false" , "blank":"true" , "ref":"false" },' +
        '{ "fcode":"S06" , "fname":"initials" , "label":"Initials" , "datatype":"string" , "size":"8" , "used":"true" , "edit":"false" , "blank":"true" , "ref":"false" },' +
        '{ "fcode":"S07" , "fname":"commission_type" , "label":"Comm Type" , "datatype":"string" , "size":"2" , "used":"false" , "edit":"false" , "blank":"true" , "ref":"false" },' +
        '{ "fcode":"S08" , "fname":"commission_amount" , "label":"Commission (inclusive)" , "datatype":"number" , "size":"12" , "used":"true" , "edit":"false" , "blank":"false" , "ref":"false" },' +
        '{ "fcode":"S09" , "fname":"vat_amount" , "label":"VAT charged" , "datatype":"number" , "size":"12" , "used":"false" , "edit":"false" , "blank":"true" , "ref":"false" },' +
        '{ "fcode":"S10" , "fname":"broker_fee_amount" , "label":"Policy Fee" , "datatype":"number" , "size":"12" , "used":"true" , "edit":"false" , "blank":"true" , "ref":"false" },' +
        '{ "fcode":"S11" , "fname":"month_commission_amount" , "label":"Monthly Commission" , "datatype":"number" , "size":"12" , "used":"false" , "edit":"false" , "blank":"true" , "ref":"false" },' +
        '{ "fcode":"S12" , "fname":"revised_policy_no" , "label":"New Policy Number" , "datatype":"string" , "size":"15" , "used":"false" , "edit":"false" , "blank":"true" , "ref":"false" },' +
        '{ "fcode":"S13" , "fname":"premium_amount" , "label":"GWP" , "datatype":"number" , "size":"12" , "used":"true" , "edit":"false" , "blank":"true" , "ref":"false" },' +
        '{ "fcode":"S14" , "fname":"line_of_business" , "label":"Policy Type" , "datatype":"number" , "size":"1" , "used":"true" , "edit":"false" , "ref":"true" },' +
        '{ "fcode":"S15" , "fname":"branch_agent" , "label":"Branch Agent Code" , "datatype":"string" , "size":"7" , "used":"true" , "edit":"true" , "blank":"false" , "ref":"true" },' +
        '{ "fcode":"S16" , "fname":"period" , "label":"Commission Period" , "datatype":"string" , "size":"6" , "used":"true" , "edit":"false" , "blank":"false" , "ref":"false" },' +
        '{ "fcode":"S17" , "fname":"marketers_code_2" , "label":"1st Referrer" , "datatype":"string" , "size":"8" , "used":"true" , "edit":"true" , "blank":"true" , "ref":"true" },' +
        '{ "fcode":"S18" , "fname":"marketers_code_3" , "label":"2nd Referrer" , "datatype":"string" , "size":"8" , "used":"true" , "edit":"true" , "blank":"true" , "ref":"true" },' +
        '{ "fcode":"S19" , "fname":"marketers_code_4" , "label":"3rd Referrer" , "datatype":"string" , "size":"8" , "used":"true" , "edit":"true" , "blank":"true" , "ref":"true" } ]}';

    var obj = JSON.parse(jText); // convert JSON text into JS object
    console.log("Rules Obj", obj);
    return obj;
}

/*********************
 * General Utilities *
 *********************/
//
// disable & enable form
//
function formDisable() {
    // Call to disable -> document.getElementById("btnPlaceOrder").disabled = true;
    var limit = document.forms[0].elements.length;
    for (i=0;i < limit; i++) {
       document.forms[0].elements[i].disabled = true;
    }
}
function formEnable() {
    // Call to enable  -> document.getElementById("btnPlaceOrder").disabled = false;
    var limit = document.forms[0].elements.length;
    for (i=0;i < limit; i++) {
       document.forms[0].elements[i].disabled = false;
    }
}
//
// Highlight a row/cell in a table
// 
function ChangeColor(tableRow, highLight) {
    if (highLight) {
        // tableRow.style.backgroundColor = '#dcfac9';
        tableRow.style.backgroundColor = '#F7B733';
    }
    else {
        tableRow.style.backgroundColor = 'white';
    }
}
//
// Test if data item is a string
//
function isString(o) {
    return typeof o == "string" || (typeof o == "object" && o.constructor === String);
}
//
// Test if data item is a string
//
function isNumber(o) {
    return typeof o == "number" || (typeof o == "object" && o.constructor === Number);
}
// 
// DOM edit functions by https://www.scribd.com/document/2279811/DOM-Append-Text-and-Elements-With-Javascript 
//
// add text to existing element
//
function appendText(node,txt) {
    node.appendChild(document.createTextNode(txt));
}
//
// Add new element
//      node = element where to add new element
//      tag = the type of element to add
//      id = optional id for element
//      htm = optional internal html text for element
//
function appendElement(node,tag,id,htm) {
    var ne = document.createElement(tag);
    if(id) ne.id = id;
    if(htm) ne.innerHTML = htm;
    node.appendChild(ne);
}
function addElementBefore(node,tag,id,htm) {
    var ne = document.createElement(tag);
    if(id) ne.id = id;
    if(htm) ne.innerHTML = htm;
    node.parentNode.insertBefore(ne,node);
}
function addElementAfter(node,tag,id,htm) {
    var ne = document.createElement(tag);
    if(id) ne.id = id;
    if(htm) ne.innerHTML = htm;
    node.parentNode.insertBefore(ne,node.nextSibling);
}