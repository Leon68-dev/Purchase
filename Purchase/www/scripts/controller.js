function test() {
    Alert('function test()');
}

function hideAll() {
    $("#frmVerbs").hide();
    $("#frmVerbs").submit(function () {
        return false;
    });

    $("#frmProduct").hide();
    $("#frmProduct").submit(function () {
        return false;
    });

    $("#frmVerbs").hide();
    $("#frmVerbs").submit(function () {
        return false;
    });

    $("#frmList").hide();
    $("#frmList").submit(function () {
        return false;
    });

    $("#frmBackup").hide();
    $("#frmBackup").submit(function () {
        return false;
    });

    $("#frmAddProduct").hide();
    $("#frmAddProduct").submit(function () {
        return false;
    });
    
    $("#frmEditProduct").hide();
    $("#frmEditProduct").submit(function () {
        return false;
    });

    $("#frmCategories").hide();
    $("#frmCategories").submit(function () {
        return false;
    });
    
    $("#frmAddCategories").hide();
    $("#frmAddCategories").submit(function () {
        return false;
    });
    
    $("#frmEditCategories").hide();
    $("#frmEditCategories").submit(function () {
        return false;
    });

    $("#frmCategoriesButtons").hide();
    $("#frmCategoriesButtons").submit(function () {
        return false;
    });
}

function checkedValue(val) {
    if (val == 1)
        return "checked";
    else
        return "";
}

function addStrValue(value_text, value_text2, id, isChecked) {
    var value_t = "";
    if (value_text && value_text != "undefined")
        value_t = value_text;

    if (value_text2 && value_text2 != "undefined")
        value_t += ("<br> - " + value_text2);

    var str = "<tr ><td width='20%' style='text-align:center'><input type='checkbox' style='zoom:3' onclick='onClickCheckBox(this);' value ='"
            + id + "' " + checkedValue(isChecked)
            + "></td><td style='word-wrap:break-word'>" + value_t
            + "</td><td width='10%'><a href='#' class='ui-btn ui-corner-all ui-icon-edit ui-btn-icon-notext ui-btn-inline' onclick='editProduct(" + id + ");'>Edit</a>"
            + "<a href='#' class='ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-inline' onclick='delProduct(" + id + ");'>Delete</a>"
            + "</td></tr>";
    $("#gridProduct > tbody:last").after(str);
}

function addStrValueCategories(id, name) {
    var value_t = name  /* ("<br> - " + name) */;
    var str = "<tr ><td style='word-wrap:break-word'>" + value_t
            + "</td><td width='10%'><a href='#' class='ui-btn ui-corner-all ui-icon-edit ui-btn-icon-notext ui-btn-inline' onclick='editCategorie(" + id + ");'>Edit</a>"
            + "<a href='#' class='ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-inline' onclick='delCategorie(" + id + ");'>Delete</a>"
            + "</td></tr>";
    $("#gridCategories > tbody:last").after(str);
}

function editProduct(idProduct) {
    selectProductById(idProduct, function (res) {
        setDataToSelect('selectedGroupsEdit', res.rows.item(0).code);
        $("#inputProductNameEdit").val(res.rows.item(0).value_w);
        editProductID = idProduct;
        onClickButton(BTN_EDT_PRODUCT);
    });
}

function delProduct(idProduct) {
    var r = confirm('Would you like to delete data?');
    if (r == true) {
        selectProductById(idProduct, function (res) {
            var idType = res.rows.item(0).code;
            deleteRelation(idProduct, idType, function (res2) {
                deleteProductById(idProduct, function (res3) {
                    setGridProductBody(currentProductType);
                    window.plugins.toast.showShortBottom("Data was deleted");
                });
            });
        });
    }
}

function getToastCountItems(itemsFound) {
    if (getSearchText() != "") {
        if (itemsFound > 0)
            window.plugins.toast.showShortBottom("There are " + itemsFound + " items");
        else
            window.plugins.toast.showShortBottom("Data didn't find");
    }
}

function setGridProductBody(productType) {
    $("#searchText").val("");
    clearTBody();

    if (productType == CHK) {
        selectProductCHK(function(res){
            var cnt = res.rows.length;
            for (i = 0; i < cnt; i++) {
                addStrValue(res.rows.item(i).value_w, res.rows.item(i).id, res.rows.item(i).is_checked);
            }
            getToastCountItems(cnt);
        });
    } else {
        selectProductByCode(productType, function (res) {
            var cnt = res.rows.length;
            for (i = 0; i < cnt; i++) {
                addStrValue(res.rows.item(i).value_w, res.rows.item(i).id, res.rows.item(i).is_checked);
            }
            getToastCountItems(cnt);
        });
   }
}

function onClickCheckBox(param) {
    var id = param.value;
    var isChecked = param.checked;
    setProductCheckBox(id, isChecked);
}

function onClickButton(index) {
    if (index == BTN_ADD_PRODUCT || index == BTN_CHK_PRODUCT || index == BTN_ALL_PRODUCT || index == BTN_CATEG_VIEW) {
        typeOpen = index;
    }
    currentForm = index;
    showCurrentForm(currentForm);
}

function clearTBody() {
    var table = document.getElementById("gridProduct");
    for (var i = table.rows.length - 1; i >= 0; i--) {
        table.deleteRow(i);
    }
}

function clearTBodyCategories() {
    var table = document.getElementById("gridCategories");
    for (var i = table.rows.length - 1; i >= 0; i--) {
        table.deleteRow(i);
    }
}

function getSearchText() {
    var str = $("#searchText").val().toLowerCase();
    return str;
}

function onClickButtonFind() {
    clearTBody();
    if (currentProductType == ALL) {
        selectFindProductAll(getSearchText(), function (res) {
            var cnt = res.rows.length;
            for (i = 0; i < cnt; i++) {
                addStrValue(res.rows.item(i).value_w, res.rows.item(i).id, res.rows.item(i).is_checked);
            }
            getToastCountItems(cnt);
        });
    } else if (currentProductType == CHK) {
        selectFindProductCHK(getSearchText(), function (res) {
            var cnt = res.rows.length;
            for (i = 0; i < cnt; i++) {
                addStrValue(res.rows.item(i).value_w, res.rows.item(i).id, res.rows.item(i).is_checked);
            }
            getToastCountItems(cnt);
        });
    } else {
        selectFindProductByType(currentProductType, searchText, function (res) {
            var cnt = res.rows.length;
            for (i = 0; i < cnt; i++) {
                addStrValue(res.rows.item(i).value_w, res.rows.item(i).id, res.rows.item(i).is_checked);
            }
            getToastCountItems(cnt);
        });
    }
}

function deviceReady() {
    hideAll();
    setGridProductBody(ALL);
    $("#frmList").show();
    createTablesWithCheck(0);
}



function addZerro(param) {
    if (param < 10)
        return ('0' + param);
    return param;
}

function dateFormat() {
    var today = new Date();
    var dt = today.getFullYear()
        + '-'
        + addZerro(today.getMonth() + 1)
        + '-'
        + addZerro(today.getDate())
        + '_'
        + addZerro(today.getHours())
        + '-'
        + addZerro(today.getMinutes())
        + '-'
        + addZerro(today.getSeconds())
        + '-'
        + today.getMilliseconds();
    return dt;
}

function failFiles(error) {
    if (error.code == FileError.NOT_FOUND_ERR) alert("Message : NOT_FOUND_ERR")
    else if (error.code == FileError.SECURITY_ERR) alert("Message : SECURITY_ERR")
    else if (error.code == FileError.ABORT_ERR) alert("Message : ABORT_ERR")
    else if (error.code == FileError.NOT_READABLE_ERR) alert("Message : NOT_READABLE_ERR")
    else if (error.code == FileError.ENCODING_ERR) alert("Message : ENCODING_ERR")
    else if (error.code == FileError.NO_MODIFICATION_ALLOWED_ERR) alert("Message : NO_MODIFICATION_ALLOWED_ERR")
    else if (error.code == FileError.INVALID_STATE_ERR) alert("Message : INVALID_STATE_ERR")
    else if (error.code == FileError.SYNTAX_ERR) alert("Message : SYNTAX_ERR")
    else if (error.code == FileError.INVALID_MODIFICATION_ERR) alert("Message :  INVALID_MODIFICATION_ERR")
    else if (error.code == FileError.QUOTA_EXCEEDED_ERR) alert("Message : QUOTA_EXCEEDED_ERR")
    else if (error.code == FileError.PATH_EXISTS_ERR) alert("Message : PATH_EXISTS_ERR")
    showCurrentForm(BTN_BACKUP);
}

function exportDatabase() {
    var r = confirm('Would you like to export data?');
    if (r == true) {
        var source = cordova.file.dataDirectory + "";
        source = source.replace("/files/", "/databases/") + model_dbname;
        var destination = cordova.file.externalRootDirectory;
        window.resolveLocalFileSystemURL(source, function (fs) {
            window.resolveLocalFileSystemURL(destination, function (directoryEntry) {
                var filename = 'purchase_' + dateFormat() + '.db';
                fs.copyTo(directoryEntry, filename, function () { }, failFiles);
                fs.copyTo(directoryEntry, model_dbname_backup, function () {
                    showCurrentForm(BTN_ALL_PRODUCT);
                    alert("Export ok");
                }, failFiles);
            }, failFiles);
        }, failFiles);
    } else {
        showCurrentForm(BTN_BACKUP);
    }
}

function importDatabase() {
    var r = confirm('Would you like to import data?');
    if (r == true) {
        var source = cordova.file.externalRootDirectory + model_dbname_backup;
        var destination = cordova.file.dataDirectory + "";
        destination = destination.replace("/files/", "/databases/");
        window.resolveLocalFileSystemURL(source, function (fs) {
            window.resolveLocalFileSystemURL(destination, function (directoryEntry) {
                fs.copyTo(directoryEntry, model_dbname, function () {
                    showCurrentForm(BTN_ALL_PRODUCT);
                    alert("Import ok");
                }, failFiles);
            }, failFiles);
        }, failFiles);
    } else {
        showCurrentForm(BTN_BACKUP);
    }
}

function setDataToSelect(nameSelector, selectID) {
    $('#' + nameSelector).empty();
    selectTypes(function (res) {
        var cnt = res.rows.length;
        if (cnt > 0) {
            for (var i = 0; i < cnt; i++) {
                $('#' + nameSelector).append('<option value=' + res.rows.item(i).id + '>' + res.rows.item(i).name + '</option>');
            }
            if (selectID > 0)
                $('#' + nameSelector).val(selectID).selectmenu("refresh");
            else
                $('#' + nameSelector).val(res.rows.item(0).id).selectmenu("refresh");
        }
    });
}

function saveNewProduct() {
    var value_w = $("#inputProductName").val();
    var id_type = $("#selectedGroups").val();

    if (value_w) {
        insertProductById(0, value_w, 0, function (res) {
            selectMaxProductID(function (res) {
                if (res && res.rows && res.rows.length) {
                    var id_product = res.rows.item(0).maxID;
                    insertRelation(id_product, id_type, function (res3) {
                        $("#inputProductName").val('');
                        currentForm = BTN_ADD_PRODUCT;
                        showCurrentForm(BTN_ADD_PRODUCT);
                        window.plugins.toast.showShortBottom("Data was saved");
                    });
                }
            });
        })
    } else {
        $("#inputProductName").val('');
        currentForm = BTN_ADD_PRODUCT;
        showCurrentForm(BTN_ADD_PRODUCT);
        window.plugins.toast.showShortBottom("Data was not saved");
    }
}

function cancelNewProduct() {
    $("#inputProductName").val('');
    showCurrentForm(BTN_ADD_PRODUCT);
    window.plugins.toast.showShortBottom("Data was canceled");
}

function saveEditProduct() {
    var value_w = $("#inputProductNameEdit").val();
    var id_type = $("#selectedGroupsEdit").val();
    if (value_w && id_type) {
        updateProductById(editProductID, value_w, function (res) {
            updateRelation(editProductID, id_type, function (res) {
                if (typeOpen == BTN_ALL_PRODUCT) {
                    currentForm = BTN_ALL_PRODUCT;
                    showCurrentForm(BTN_ALL_PRODUCT);
                } else if (typeOpen == BTN_CHK_PRODUCT) {
                    currentForm = BTN_CHK_PRODUCT;
                    showCurrentForm(BTN_CHK_PRODUCT);
                } else if (typeOpen == BTN_CATEG_VIEW) {
                    onClickCategorieButton(currentCategorieID);
                } else {
                    showCurrentForm(prevEditForm);
                    currentForm = BTN_ALL_PRODUCT;
                }
                window.plugins.toast.showShortBottom("Data was saved");
            });
        });
    } else {
        showCurrentForm(prevEditForm);
        currentForm = BTN_ALL_PRODUCT;
        window.plugins.toast.showShortBottom("Data was not saved");
    }
}

function cancelEditProduct() {
    if (typeOpen == BTN_ALL_PRODUCT) {
        currentForm = BTN_ALL_PRODUCT;
        showCurrentForm(BTN_ALL_PRODUCT);
    } else if (typeOpen == BTN_CHK_PRODUCT) {
        currentForm = BTN_CHK_PRODUCT;
        showCurrentForm(BTN_CHK_PRODUCT);
    } else if (typeOpen == BTN_CATEG_VIEW) {
        onClickCategorieButton(currentCategorieID);
    } else {
        showCurrentForm(prevEditForm);
        currentForm = BTN_ALL_PRODUCT;
    }
    window.plugins.toast.showShortBottom("Data was canceled");
}

function setGridCategoriesBody() {
    clearTBodyCategories();
    selectCategories(function (res) {
        var cnt = res.rows.length;
        for (i = 0; i < cnt; i++) {
            addStrValueCategories(res.rows.item(i).id, res.rows.item(i).name);
        }
        getToastCountItems(cnt);
    });
}

function saveNewCategorie() {
    var name = $("#inputCategorie").val();
    if (name) {
        insertCategorie(name.trim().toLocaleUpperCase(), function (res) {
            $("#inputCategorie").val('');
            showCurrentForm(BTN_CATEG);
            window.plugins.toast.showShortBottom("Data was saved");
        });
    } else {
        $("#inputCategorie").val('');
        showCurrentForm(BTN_CATEG);
        window.plugins.toast.showShortBottom("Data was not saved");
    }
}

function cancelCategorie() {
    $("#inputCategorie").val('');
    $("#inputCategorieEdit").val('');
    showCurrentForm(BTN_CATEG);
    window.plugins.toast.showShortBottom("Data was canceled");
}

function editCategorie(idCategorie) {
    selectCategorieById(idCategorie, function (res) {
        $("#inputCategorieEdit").val(res.rows.item(0).name);
        editCategorieID = idCategorie;
        onClickButton(BTN_EDT_CATEG);
    });
}

function delCategorie(id) {
    var r = confirm('Would you like to delete data?');
    if (r == true) {
        checkCategoriesInRelations(id, function (res) {
            if (res == 0) {
                deleteCategorieById(id, function (res) {
                    setGridCategoriesBody();
                    window.plugins.toast.showShortBottom("Data was deleted");
                });
            } else {
                window.plugins.toast.showShortBottom("Data cannot be deleted");
            }
        });
    }
}

function saveEditCategorie() {
    var name = $("#inputCategorieEdit").val();
    if (name) {
        updateCategorie(editCategorieID, name.trim().toUpperCase(), function (res) {
            $("#inputCategorieEdit").val('');
            showCurrentForm(BTN_CATEG);
            window.plugins.toast.showShortBottom("Data was saved");
        });
    } else {
        $("#inputCategorieEdit").val('');
        showCurrentForm(BTN_CATEG);
        window.plugins.toast.showShortBottom("Data was not saved");
    }
}

function setCategoriesButtons() {
    $("#categoriesButtons").empty();
    selectCategoriesButtons(function (res) {
        var cnt = res.rows.length;
        for (i = 0; i < cnt; i++) {
            var li = '<li style="text-align:center;"><button class="ui-btn ui-corner-all" onclick="onClickCategorieButton(' + res.rows.item(i).id + ');">' + res.rows.item(i).name + '</button></li>';
            $("#categoriesButtons").append(li);
        }
    });
}

function onClickCategorieButton(id) {
    currentCategorieID = id;
    hideAll();
    currentForm = BTN_CATEG_VIEW_DETAIL;
    prevEditForm = BTN_CATEG_VIEW;
    setGridProductBody(id);
    $("#frmList").show();
}

function showCurrentForm(index) {
    hideAll();
    switch (index) {
        case 0:
        case BTN_ALL_PRODUCT:
            prevEditForm = BTN_ALL_PRODUCT;
            setGridProductBody(ALL);
            $("#frmList").show();
            break;
        case BTN_CHK_PRODUCT:
            setGridProductBody(CHK);
            $("#frmList").show();
            break;
        case BTN_BACKUP:
            $("#frmBackup").show();
            break;
        case BTN_BACKUP_EXPORT:
            exportDatabase();
            break;
        case BTN_BACKUP_IMPORT:
            importDatabase();
            break;
        case BTN_ADD_PRODUCT:
            currentForm = BTN_ADD_PRODUCT;
            setDataToSelect('selectedGroups', 0);
            $("#frmAddProduct").show();
            break;
        case BTN_ADD_PRODUCT_SAVE:
            saveNewProduct();
            break;
        case BTN_ADD_PRODUCT_CANCEL:
            cancelNewProduct()
            break;
        case BTN_EDT_PRODUCT:
            $("#frmEditProduct").show();
            break;
        case BTN_EDT_PRODUCT_SAVE:
            saveEditProduct();
            break;
        case BTN_EDT_PRODUCT_CANCEL:
            cancelEditProduct();
            break;
        case BTN_CATEG:
            setGridCategoriesBody();
            $("#frmCategories").show();
            break;
        case BTN_ADD_CATEG:
            $("#frmAddCategories").show();
            break;
        case BTN_ADD_CATEG_SAVE:
            saveNewCategorie();
            break;
        case BTN_EDT_CATEG:
            $("#frmEditCategories").show();
            break;
        case BTN_EDT_CATEG_SAVE:
            saveEditCategorie();
            break;
        case BTN_ADD_CATEG_CANCEL:
        case BTN_EDT_CATEG_CANCEL:
            cancelCategorie();
            break;
        case BTN_CATEG_VIEW:
            setCategoriesButtons();
            $("#frmCategoriesButtons").show();
            break;

        default:
    }
}

function onClickBack() {
    switch (currentForm) {
        case BTN_CATEG_VIEW:
        case BTN_CATEG:
        case BTN_ADD_PRODUCT:
        //case BTN_PRODUCT_PHRASES:
        //case BTN_NEW_PRODUCT:
        case BTN_BACKUP:
        case BTN_BACKUP_EXPORT:
        case BTN_BACKUP_IMPORT:
            currentForm = 0;
            showCurrentForm(currentForm);
            break;
        //case BTN_PHRASES:
        //case BTN_ANY:
        //case BTN_VERB:
        //    currentForm = BTN_PRODUCT_PHRASES;
        //    showCurrentForm(currentForm);
        //    break;
        //case BTN_VERBS:
        //    currentForm = BTN_VERB;
        //    showCurrentForm(currentForm);
        //    break;
        //case BTN_VERBS_IRREG:
        //    currentForm = BTN_VERB;
        //    showCurrentForm(currentForm);
        //    break;
        //case BTN_HOUSE:
        //case BTN_CLOTHING:
        //case BTN_FOOD:
        //case BTN_ADJECTIVE:
        //case BTN_OFFICE:
        //case BTN_COLLOCATION:
        //case BTN_TRANSPORT:
        //case BTN_MONEY:
        //case BTN_NATURAL:
        //case BTN_ANIMALS:
        //case BTN_REST:
        //case BTN_MEDICAL:
        //case BTN_IDIOM:
        //case BTN_CRIME_PUNISHMENT:
        //case BTN_PERSON_FAMILY:
        //    currentForm = BTN_PRODUCT_PHRASES;
        //    showCurrentForm(currentForm);
        //    break;
        case BTN_ALL_PRODUCT:
        case BTN_CHK_PRODUCT:
        case BTN_EDT_PRODUCT:
            //currentForm = BTN_EDT_PRODUCT;
            //showCurrentForm(prevEditForm);
            if (typeOpen == BTN_ALL_PRODUCT) {
                currentForm = BTN_ALL_PRODUCT;
                showCurrentForm(BTN_ALL_PRODUCT);
            } else if (typeOpen == BTN_CHK_PRODUCT) {
                currentForm = BTN_CHK_PRODUCT;
                showCurrentForm(BTN_CHK_PRODUCT);
            } else if (typeOpen == BTN_CATEG_VIEW) {
                onClickCategorieButton(currentCategorieID);
            } else {
                showCurrentForm(prevEditForm);
                currentForm = BTN_ALL_PRODUCT;
            }

            break;
        case BTN_ADD_CATEG:
        case BTN_EDT_CATEG:
            currentForm = BTN_CATEG;
            //showCurrentForm(prevEditForm);
            showCurrentForm(BTN_CATEG);
            break;
        case BTN_CATEG_VIEW_DETAIL:
            currentForm = BTN_CATEG_VIEW;
            showCurrentForm(BTN_CATEG_VIEW);
            //onClickCategorieButton(currentCategorieID);
            break;
        default:
            navigator.app.exitApp();
    }
}