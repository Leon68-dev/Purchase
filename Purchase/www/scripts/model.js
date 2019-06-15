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
            //if (isReload == 1)
                cnt = 0;
            if (cnt == 0) {
                tx.executeSql("DROP TABLE IF EXISTS types;");
                tx.executeSql("CREATE TABLE IF NOT EXISTS types (id integer primary key, name text);");
                tx.executeSql(strInsertType("---Разное---"));
                tx.executeSql(strInsertType("Мясное"));
                tx.executeSql(strInsertType("Овощи"));
                tx.executeSql(strInsertType("Зелень"));
                tx.executeSql(strInsertType("Фрукты"));
                tx.executeSql(strInsertType("Рыба"));
                tx.executeSql(strInsertType("Молочные"));
                tx.executeSql(strInsertType("Напитки"));
                tx.executeSql(strInsertType("Крупы"));
                tx.executeSql(strInsertType("Мучное"));
                tx.executeSql(strInsertType("Специи"));
                tx.executeSql("CREATE UNIQUE INDEX 'ix_name' on types ('name' ASC);");
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql("DROP TABLE IF EXISTS product;");
                tx.executeSql("CREATE TABLE IF NOT EXISTS product (id integer primary key, value_w text, is_checked integer);");
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql("DROP TABLE IF EXISTS relations;");
                tx.executeSql("CREATE TABLE IF NOT EXISTS relations (id integer primary key, id_product integer, id_type text);");
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertProduct("Колбаса полукопченая"));
                tx.executeSql(strInsertProduct("Колбаса сырокопченая"));
                tx.executeSql(strInsertProduct("Колбаса вяленая"));
                tx.executeSql(strInsertProduct("Колбаса вареная"));
                tx.executeSql(strInsertProduct("Сосиски вареные"));
                tx.executeSql(strInsertProduct("Сосиски капченные"));
                tx.executeSql(strInsertProduct("Сердели"));
                tx.executeSql(strInsertProduct("Фарш мясной"));
                tx.executeSql(strInsertProduct("Фарш куриный"));
                tx.executeSql(strInsertProduct("Свенина"));
                tx.executeSql(strInsertProduct("Говядина"));
                tx.executeSql(strInsertProduct("Курица"));
                tx.executeSql(strInsertRelation("Мясное"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertProduct("Капуста"));
                tx.executeSql(strInsertProduct("Морква"));
                tx.executeSql(strInsertProduct("Капуста цветная"));
                tx.executeSql(strInsertProduct("Буряк"));
                tx.executeSql(strInsertProduct("Цибуля"));
                tx.executeSql(strInsertProduct("Цибуля зеленая"));
                tx.executeSql(strInsertProduct("Картофель"));
                tx.executeSql(strInsertProduct("Помидоры"));
                tx.executeSql(strInsertProduct("Огурцы"));
                tx.executeSql(strInsertRelation("Овощи"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertProduct("Укроп"));
                tx.executeSql(strInsertProduct("Петрушка"));
                tx.executeSql(strInsertProduct("Сельдирей"));
                tx.executeSql(strInsertRelation("Зелень"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertProduct("Яблоки"));
                tx.executeSql(strInsertProduct("Сливы"));
                tx.executeSql(strInsertProduct("Персики"));
                tx.executeSql(strInsertProduct("Бананы"));
                tx.executeSql(strInsertProduct("Апельсины"));
                tx.executeSql(strInsertProduct("Мандарины"));
                tx.executeSql(strInsertProduct("Лемон"));
                tx.executeSql(strInsertRelation("Фрукты"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertProduct("Молоко"));
                tx.executeSql(strInsertProduct("Кефир"));
                tx.executeSql(strInsertProduct("Сметана"));
                tx.executeSql(strInsertProduct("Ряженка"));
                tx.executeSql(strInsertProduct("Сливки"));
                tx.executeSql(strInsertProduct("Масло сливочное"));
                tx.executeSql(strInsertProduct("Сир дорогой"));
                tx.executeSql(strInsertProduct("Сир дешевый"));
                tx.executeSql(strInsertRelation("Молочные"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertProduct("Чай черный"));
                tx.executeSql(strInsertProduct("Чай зеленый"));
                tx.executeSql(strInsertProduct("Кофе растворимый"));
                tx.executeSql(strInsertProduct("Кофе в зернах"));
                tx.executeSql(strInsertProduct("Кофе молотый"));
                tx.executeSql(strInsertProduct("Какао"));
                tx.executeSql(strInsertProduct("Сахар"));
                tx.executeSql(strInsertProduct("Сок томатный"));
                tx.executeSql(strInsertProduct("Сок апельсиновый"));
                tx.executeSql(strInsertProduct("Сок овощной"));
                tx.executeSql(strInsertProduct("Сок мультифрук"));
                tx.executeSql(strInsertProduct("Сок персиковый"));
                tx.executeSql(strInsertProduct("Сок ..."));
                tx.executeSql(strInsertRelation("Напитки"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertProduct("Рис круглый"));
                tx.executeSql(strInsertProduct("Рис длинозернистый"));
                tx.executeSql(strInsertProduct("Гречка"));
                tx.executeSql(strInsertProduct("Пшено"));
                tx.executeSql(strInsertProduct("Пшеничная"));
                tx.executeSql(strInsertProduct("Овсянка"));
                tx.executeSql(strInsertProduct("Ячневая"));
                tx.executeSql(strInsertRelation("Крупы"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertProduct("Макароны"));
                tx.executeSql(strInsertProduct("Вареники с вишней"));
                tx.executeSql(strInsertProduct("Вареники с капустой"));
                tx.executeSql(strInsertProduct("Вареники с картошкой"));
                tx.executeSql(strInsertProduct("Вареники с творогом"));
                tx.executeSql(strInsertProduct("Пельмени"));
                tx.executeSql(strInsertRelation("Мучное"));

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


