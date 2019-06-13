var editProductID = -1;
var editCategorieID = -1;
var prevEditForm = 0;
var currentForm = 0;
var currentProductType = 0;
var itemsFound = 0;
var currentCategorieID = -1;
var typeOpen = -1;

var dbLocation = 'default';
var model_dbname = "purchase1.db";
var model_dbname_backup = "purchase1_bak.db";

var CHK = 1000;
var ALL = 0;

//var BTN_PRODUCT_PHRASES = 100;
//var BTN_NEW_PRODUCT = 101;
var BTN_ALL_PRODUCT = 102;
var BTN_CHK_PRODUCT = 103;
var BTN_ADD_PRODUCT = 104;
var BTN_BACKUP = 105;
var BTN_EDT_PRODUCT = 106;
var BTN_CATEG = 107;
var BTN_ADD_CATEG = 108;
var BTN_EDT_CATEG = 109;
var BTN_CATEG_VIEW = 110;
var BTN_CATEG_VIEW_DETAIL = 111;

var BTN_BACKUP_EXPORT = 1000;
var BTN_BACKUP_IMPORT = 1001;

var BTN_ADD_PRODUCT_SAVE = 2000;
var BTN_ADD_PRODUCT_CANCEL = 2001;
var BTN_EDT_PRODUCT_SAVE = 2100;
var BTN_EDT_PRODUCT_CANCEL = 2101;

var BTN_ADD_CATEG_SAVE = 3000;
var BTN_ADD_CATEG_CANCEL = 3001;
var BTN_EDT_CATEG_SAVE = 3100;
var BTN_EDT_CATEG_CANCEL = 3101;



function confirmCreateTables() {
    if (confirm('Вы хотите перезагрузить данные?')) {
        createTablesWithCheck(1);
    } else {
        // Do nothing!
    }
}

function insertProductById(id, value_w, is_checked, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("INSERT INTO product(value_w, is_checked) VALUES(?,?);", [value_w, is_checked], function (res) {
            callBack(0);
        });
    }, function (tx, error) {
        console.log('Transaction error: ' + error.message);
    });
}

function updateProductById(id, value_w, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("UPDATE product SET value_w=? WHERE id=?;", [value_w, id], function (res) {
            callBack(0);
        });
    }, function (tx, error) {
        console.log('Transaction error: ' + error.message);
    });
}

function selectProductById(id, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM vrows WHERE id=? ORDER BY value_w;", [id], function (tx, res) {
            callBack(res);
        }, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}

function deleteProductById(id, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM product WHERE id=?;", [id], function (res) {
            callBack(0);
        });
    }, function (tx, error) {
        console.log('Transaction error: ' + error.message);
    });
}

function insertRelation(id_product, id_type, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("INSERT INTO relations(id_product, id_type) VALUES(?,?);", [id_product, id_type], function (res) {
            callBack(0);
        });
    }, function (tx, error) {
        console.log('Transaction error: ' + error.message);
    });
}

function updateRelation(id_product, id_type, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("UPDATE relations SET id_type=? WHERE id_product=?;", [id_type, id_product], function (res) {
            callBack(0);
        });
    }, function (tx, error) {
        console.log('Transaction error: ' + error.message);
    });
}

function deleteRelation(id_product, id_type, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM relations WHERE id_product=? AND id_type=?;", [id_product, id_type], function (res) {
            callBack(0);
        });
    }, function (tx, error) {
        console.log('Transaction error: ' + error.message);
    });
}

function selectMaxProductID(callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("select max(ID) as maxID from product", [], function (tx, res) {
            callBack(res);
        }, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}

function selectTypes(callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("select * from types order by name;", [], function (tx, res) {
            callBack(res);
        }, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}

function strInsertType(sqlValue) {
    var strSql = "INSERT INTO types(name) VALUES('" + sqlValue + "');";
    return strSql;
}

function strInsertProduct(sqlValue) {
    var strSql = "INSERT INTO product(value_w, is_checked) VALUES('" + sqlValue + "', 0);";
    return strSql;
}

function strInsertProduct(sqlValue) {
    var strSql = "INSERT INTO product(value_w, is_checked) VALUES('" + sqlValue + "', 0);";
    return strSql;
}

function strInsertRelation(sqlValue) {
    var strSql = "INSERT INTO relations (id_product, id_type) select w.id, (select id from types where name = '" + sqlValue + "')"
        + " from product w where w.id between (select min(t.id) from product t where t.id not in "
        + "(select id_product from relations)) and (select max(t.id) from product t where t.id not in (select id_product from relations));";
    return strSql;
}

function selectCategories(callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM types ORDER BY name DESC;", [], function (tx, res) {
            callBack(res);
        }, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}

function selectCategoriesButtons(callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM types ORDER BY name;", [], function (tx, res) {
            callBack(res);
        }, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}

function insertCategorie(name, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("INSERT INTO types(name) VALUES(?);", [name], function (res) {
            callBack(0);
        });
    }, function (tx, error) {
        console.log('Transaction error: ' + error.message);
    });
}

function updateCategorie(id, name, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("UPDATE types SET name=? WHERE id=?;", [name, id], function (res) {
            callBack(0);
        });
    }, function (tx, error) {
        console.log('Transaction error: ' + error.message);
    });
}

function selectCategorieById(id, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM types WHERE id=? ORDER BY name LIMIT 1;", [id], function (tx, res) {
            callBack(res);
        }, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}

function checkCategoriesInRelations(id_categ, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("SELECT count(*) cnt FROM relations WHERE id_type=?;", [id_categ], function (tx, res) {
            var cnt = res.rows.item(0).cnt;
            callBack(cnt);
        }, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}

function deleteCategorieById(id, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM types WHERE id=?;", [id], function (res) {
            callBack(0);
        });
    }, function (tx, error) {
        console.log('Transaction error: ' + error.message);
    });
}

function selectProductCHK(callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("select * from vrows where is_checked = 1 order by id desc;", [], function (tx, res) {
            callBack(res);
        }, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}

function setProductCheckBox(id, checked) {
    var db = openDatabase();
    db.transaction(function (tx) {
        var chk = 0;
        if (checked == true)
            chk = 1;
        tx.executeSql("update product set is_checked = " + chk + " where id = " + id);
    }, function (tx, error) {
        console.log('Transaction error: ' + error.message);
    });
}

function selectFindProductAll(searchText, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("select * from vrows where (value_w like'%" + searchText + "%') order by value_w desc;", [], function (tx, res) {
            callBack(res);
        }, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}

function selectFindProductCHK(searchText, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("select * from vrows where is_checked = 1 and (value_w like'%" + searchText + "%') order by id desc;", [], function (tx, res) {
            callBack(res);
        }, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}

function selectFindProductByType(code, searchText, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("select * from vrows where code = " + code + " and (value_w like'%" + searchText + "%') order by value_w desc;", [], function (tx, res) {
            callBack(res);
        }, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}

function selectProductByCode(code, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("select * from vrows where code = " + code + " order by value_w desc;", [], function (tx, res) {
            callBack(res);
        }, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}

function openDatabase() {
    var db = window.sqlitePlugin.openDatabase({ name: model_dbname, location: dbLocation });
    return db;
}

function createTablesWithCheck(isReload) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='product'", [], function (tx, res) {
            var cnt = res.rows.length;
            if (isReload == 1)
                cnt = 0;
            if (cnt == 0) {
                tx.executeSql("DROP TABLE IF EXISTS types;");
                tx.executeSql("CREATE TABLE IF NOT EXISTS types (id integer primary key, name text);");
                tx.executeSql(strInsertType("Разное"));
                tx.executeSql(strInsertType("Мясо"));
                tx.executeSql(strInsertType("Овощи"));
                tx.executeSql(strInsertType("Фрукты"));
                tx.executeSql("CREATE UNIQUE INDEX 'ix_name' on types ('name' ASC);");
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql("DROP TABLE IF EXISTS product;");
                tx.executeSql("CREATE TABLE IF NOT EXISTS product (id integer primary key, value_w text, is_checked integer);");
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql("DROP TABLE IF EXISTS relations;");
                tx.executeSql("CREATE TABLE IF NOT EXISTS relations (id integer primary key, id_product integer, id_type text);");
                //-------------------------------------------------------------------------------------------------------------
                //sample
                //tx.executeSql(strInsertProduct("cut-throat", "ожесточенной"));
                //tx.executeSql(strInsertProduct("such", "такой"));
                //tx.executeSql(strInsertProduct("rival", "соперник"));
                ////-------------------------------------------------------------------------------------------------------------
                //tx.executeSql(strInsertRelation("ANY"));

                
                //-------------------------------------------------------------------------------------------------------------
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql("CREATE INDEX 'ix_value_w' on product ('value_w' ASC);");
                tx.executeSql("DROP VIEW IF EXISTS vRows;");
                tx.executeSql("CREATE VIEW IF NOT EXISTS vRows AS select w.value_w, t.id as code, t.name, w.id, w.is_checked from product w join relations r on w.id = r.id_product join types t on t.id = r.id_type order by w.value_w;");
                //-------------------------------------------------------------------------------------------------------------    
                window.plugins.toast.showShortBottom("Data was uploaded");
            }
        });
    });
}
