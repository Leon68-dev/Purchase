﻿var editWordID = -1;
var editCategorieID = -1;
var prevEditForm = 0;
var currentForm = 0;
var currentWordType = 0;
var itemsFound = 0;
var currentCategorieID = -1;
var typeOpen = -1;

var dbLocation = 'default';
var model_dbname = "purchase.db";
var model_dbname_backup = "purchase_bak.db";

var CHK = 1000;
var ALL = 0;
//var ANY = 1;
//var ADJECTIVE = 2;
//var ANIMALS = 3;
//var CLOTHING = 4;
//var CRIME_PUNISHMENT = 5;
//var FOOD = 6;
//var HOUSE = 7;
//var MEDICAL = 8;
//var MONEY = 9;
//var NATURAL = 10;
//var NEW = 11;
//var OFFICE = 12;
//var PERSON_FAMILY = 14;
//var REST = 15;
//var TRANSPORT = 16;
//var VERB = 17;
//var VERB_IRREG = 18;
//var PHRASES = 19;
//var COLLOCATION = 20;
//var IDIOM = 21;
//var TONGUE_TWISTER = 22;

//var BTN_WORDS_PHRASES = 100;
//var BTN_NEW_WORDS = 101;
var BTN_ALL_WORDS = 102;
var BTN_CHK_WORDS = 103;
var BTN_ADD_WORD = 104;
var BTN_BACKUP = 105;
var BTN_EDT_WORD = 106;
var BTN_CATEG = 107;
var BTN_ADD_CATEG = 108;
var BTN_EDT_CATEG = 109;
var BTN_CATEG_VIEW = 110;
var BTN_CATEG_VIEW_DETAIL = 111;

var BTN_BACKUP_EXPORT = 1000;
var BTN_BACKUP_IMPORT = 1001;

var BTN_ADD_WORD_SAVE = 2000;
var BTN_ADD_WORD_CANCEL = 2001;
var BTN_EDT_WORD_SAVE = 2100;
var BTN_EDT_WORD_CANCEL = 2101;

var BTN_ADD_CATEG_SAVE = 3000;
var BTN_ADD_CATEG_CANCEL = 3001;
var BTN_EDT_CATEG_SAVE = 3100;
var BTN_EDT_CATEG_CANCEL = 3101;

//var BTN_PHRASES = 11100;
//var BTN_ANY = 11101;
//var BTN_VERB = 11102;
//var BTN_VERBS = 111020;
//var BTN_VERBS_IRREG = 111021;
//var BTN_HOUSE = 11103;
//var BTN_CLOTHING = 11104;
//var BTN_FOOD = 11105;
//var BTN_ADJECTIVE = 11106;
//var BTN_OFFICE = 11107;
//var BTN_COLLOCATION = 11108;
//var BTN_TRANSPORT = 11109;
//var BTN_MONEY = 11110;
//var BTN_NATURAL = 11111;
//var BTN_ANIMALS = 11112;
//var BTN_REST = 11113;
//var BTN_MEDICAL = 11114;
//var BTN_IDIOM = 11115;
//var BTN_CRIME_PUNISHMENT = 11116;
//var BTN_PERSON_FAMILY = 11117;
//var BTN_TONGUE_TWISTER = 11118;


function confirmCreateTables() {
    if (confirm('Are you sure you want to reload data?')) {
        createTablesWithCheck(1);
    } else {
        // Do nothing!
    }
}

function insertWordById(id, value_w, value_w2, is_checked, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("INSERT INTO words(value_w, value_w2, is_checked) VALUES(?,?,?);", [value_w, value_w2, is_checked], function (res) {
            callBack(0);
        });
    }, function (tx, error) {
        console.log('Transaction error: ' + error.message);
    });
}

function updateWordById(id, value_w, value_w2, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("UPDATE words SET value_w=?, value_w2=? WHERE id=?;", [value_w, value_w2, id], function (res) {
            callBack(0);
        });
    }, function (tx, error) {
        console.log('Transaction error: ' + error.message);
    });
}

function selectWordById(id, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM vrows WHERE id=? ORDER BY value_w, value_w2;", [id], function (tx, res) {
            callBack(res);
        }, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}

function deleteWordById(id, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM words WHERE id=?;", [id], function (res) {
            callBack(0);
        });
    }, function (tx, error) {
        console.log('Transaction error: ' + error.message);
    });
}

function insertRelation(id_words, id_type, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("INSERT INTO relations(id_words, id_type) VALUES(?,?);", [id_words, id_type], function (res) {
            callBack(0);
        });
    }, function (tx, error) {
        console.log('Transaction error: ' + error.message);
    });
}

function updateRelation(id_words, id_type, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("UPDATE relations SET id_type=? WHERE id_words=?;", [id_type, id_words], function (res) {
            callBack(0);
        });
    }, function (tx, error) {
        console.log('Transaction error: ' + error.message);
    });
}

function deleteRelation(id_words, id_type, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM relations WHERE id_words=? AND id_type=?;", [id_words, id_type], function (res) {
            callBack(0);
        });
    }, function (tx, error) {
        console.log('Transaction error: ' + error.message);
    });
}

function selectMaxWordsID(callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("select max(ID) as maxID from words", [], function (tx, res) {
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

function strInsertWords(sqlValue) {
    var strSql = "INSERT INTO words(value_w, is_checked) VALUES('" + sqlValue + "', 0);";
    return strSql;
}

function strInsertWords(sqlValue, sqlValue2) {
    var strSql = "INSERT INTO words(value_w, value_w2, is_checked) VALUES('" + sqlValue + "', '" + sqlValue2 + "',0);";
    return strSql;
}

function strInsertRelation(sqlValue) {
    var strSql = "INSERT INTO relations (id_words, id_type) select w.id, (select id from types where name = '" + sqlValue + "')"
        + " from words w where w.id between (select min(t.id) from words t where t.id not in "
        + "(select id_words from relations)) and (select max(t.id) from words t where t.id not in (select id_words from relations));";
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

function selectWordsCHK(callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("select * from vrows where is_checked = 1 order by id desc;", [], function (tx, res) {
            callBack(res);
        }, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}

function selectWordsCHK(callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("select * from vrows where is_checked = 1 order by id desc;", [], function (tx, res) {
            callBack(res);
        }, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}

function setWordCheckBox(id, checked) {
    var db = openDatabase();
    db.transaction(function (tx) {
        var chk = 0;
        if (checked == true)
            chk = 1;
        tx.executeSql("update words set is_checked = " + chk + " where id = " + id);
    });
}

function selectFindWordsAll(searchText, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("select * from vrows where (value_w like'%" + searchText + "%' or value_w2 like'%" + searchText + "%') order by value_w desc;", [], function (tx, res) {
            callBack(res);
        }, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}

function selectFindWordsCHK(searchText, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("select * from vrows where is_checked = 1 and (value_w like'%" + searchText + "%' or value_w2 like'%" + searchText + "%') order by id desc;", [], function (tx, res) {
            callBack(res);
        }, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}

function selectFindWordsByType(code, searchText, callBack) {
    var db = openDatabase();
    db.transaction(function (tx) {
        tx.executeSql("select * from vrows where code = " + code + " and (value_w like'%" + searchText + "%' or value_w2 like'%" + searchText + "%') order by value_w desc;", [], function (tx, res) {
            callBack(res);
        }, function (tx, error) {
            console.log('SELECT error: ' + error.message);
        });
    });
}

function selectWordsByCode(code, callBack) {
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
        tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='words'", [], function (tx, res) {
            var cnt = res.rows.length;
            if (isReload == 1)
                cnt = 0;
            if (cnt == 0) {
                tx.executeSql("DROP TABLE IF EXISTS types;");
                tx.executeSql("CREATE TABLE IF NOT EXISTS types (id integer primary key, name text);");
                tx.executeSql(strInsertType("ANY"));
                tx.executeSql(strInsertType("ADJECTIVE"));
                tx.executeSql(strInsertType("ANIMALS"));
                tx.executeSql(strInsertType("CLOTHING"));
                tx.executeSql(strInsertType("CRIME_PUNISHMENT"));
                tx.executeSql(strInsertType("FOOD"));
                tx.executeSql(strInsertType("HOUSE"));
                tx.executeSql(strInsertType("MEDICAL"));
                tx.executeSql(strInsertType("MONEY"));
                tx.executeSql(strInsertType("NATURAL"));
                tx.executeSql(strInsertType("NEW"));
                tx.executeSql(strInsertType("OFFICE"));
                tx.executeSql(strInsertType("---"));
                tx.executeSql(strInsertType("PERSON_FAMILY"));
                tx.executeSql(strInsertType("REST"));
                tx.executeSql(strInsertType("TRANSPORT"));
                tx.executeSql(strInsertType("VERB"));
                tx.executeSql(strInsertType("VERB_IRREG"));
                tx.executeSql(strInsertType("PHRASES"));
                tx.executeSql(strInsertType("COLLOCATION"));
                tx.executeSql(strInsertType("IDIOM"));
                tx.executeSql(strInsertType("TONGUE_TWISTER"));
                tx.executeSql("delete from types where name = '---';");
                tx.executeSql("CREATE UNIQUE INDEX 'ix_name' on types ('name' ASC);");
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql("DROP TABLE IF EXISTS words;");
                tx.executeSql("CREATE TABLE IF NOT EXISTS words (id integer primary key, value_w text, value_w2 text, is_checked integer);");
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql("DROP TABLE IF EXISTS relations;");
                tx.executeSql("CREATE TABLE IF NOT EXISTS relations (id integer primary key, id_words integer, id_type text);");
                //NEW//////////////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql(strInsertWords("can get by in ...", "смогу выкрутиться ..."));
                tx.executeSql(strInsertWords("to vote (voting)", "голосовать"));
                tx.executeSql(strInsertWords("critisise", "критиковать"));
                tx.executeSql(strInsertWords("fluent", "беглый"));
                tx.executeSql(strInsertWords("reason", "причина"));
                tx.executeSql(strInsertWords("rusty", "ржавый"));
                tx.executeSql(strInsertWords("according", "в соответствии"));
                tx.executeSql(strInsertWords("enthusiasm", "энтузиазм"));
                tx.executeSql(strInsertWords("immersion", "погружение"));
                tx.executeSql(strInsertWords("accommodation", "жилье"));
                tx.executeSql(strInsertWords("pretend", "делать вид"));
                tx.executeSql(strInsertWords("amusement", "развлечение"));
                tx.executeSql(strInsertWords("shoulder", "плечо"));
                tx.executeSql(strInsertWords("adult", "взрослый"));
                tx.executeSql(strInsertWords("reach", "достичь"));
                //-
                tx.executeSql(strInsertWords("to postpone", "отложить"));
                tx.executeSql(strInsertWords("wedding", "свадьба"));
                tx.executeSql(strInsertWords("funeral", "похороны"));
                tx.executeSql(strInsertWords("tulip", "тюльпан"));
                tx.executeSql(strInsertWords("to spread", "распространять"));
                tx.executeSql(strInsertWords("to be proud of", "гордиться"));
                tx.executeSql(strInsertWords("the tulip bulb", "луковица тюльпана"));
                tx.executeSql(strInsertWords("though", "хоть"));
                tx.executeSql(strInsertWords("even though", "хотя"));
                tx.executeSql(strInsertWords("treasure", "сокровище"));
                tx.executeSql(strInsertWords("to smash", "громить"));
                tx.executeSql(strInsertWords("twice as much", "в два раза больше"));
                tx.executeSql(strInsertWords("to go mad", "сойти с ума"));
                //-
                tx.executeSql(strInsertWords("look through", "просматривать"));
                tx.executeSql(strInsertWords("honestly speaking, actually", "честно говоря, на самом деле"));
                tx.executeSql(strInsertWords("It seems to me", "мне кажется"));
                tx.executeSql(strInsertWords("pocket", "карман"));
                tx.executeSql(strInsertWords("It happens like this", "это происходит так"));
                tx.executeSql(strInsertWords("a banquet", "банкет"));
                tx.executeSql(strInsertWords("murder", "убийство"));
                tx.executeSql(strInsertWords("recall", "вспомнить"));
                tx.executeSql(strInsertWords("scytale", "скитала"));
                tx.executeSql(strInsertWords("to achieve a goal", "достигнуть цель"));
                tx.executeSql(strInsertWords("out-going", "исходящий"));
                //-
                tx.executeSql(strInsertWords("diary", "дневник"));
                tx.executeSql(strInsertWords("honest", "честный"));//-
                tx.executeSql(strInsertWords("peak", "вершина"));
                tx.executeSql(strInsertWords("fellow", "соотечественник"));
                tx.executeSql(strInsertWords("jokingly", "шутливо"));
                tx.executeSql(strInsertWords("to explode", "взорваться"));
                tx.executeSql(strInsertWords("observation", "наблюдение"));
                tx.executeSql(strInsertWords("undoubtedly", "несомненно"));
                tx.executeSql(strInsertWords("estimate", "оценить"));
                tx.executeSql(strInsertWords("conduct", "поведение"));
                //-
                tx.executeSql(strInsertWords("undervalued", "недооцененный"));
                tx.executeSql(strInsertWords("misused", "неправильно использованный"));
                tx.executeSql(strInsertWords("anti-nuclear", "антиядерный"));
                tx.executeSql(strInsertWords("overestimate", "переоценивать"));
                tx.executeSql(strInsertWords("postgraduate", "аспирантский"));
                tx.executeSql(strInsertWords("ex-vice", "бывший вице"));
                tx.executeSql(strInsertWords("multinational", "многофункциональные"));
                tx.executeSql(strInsertWords("self-reliant", "самостоятельный"));
                tx.executeSql(strInsertWords("pro-hunting", "про-охота"));
                tx.executeSql(strInsertWords("redefined", "переопределенный"));
                tx.executeSql(strInsertWords("preview", "предварительный просмотр"));
                //-
                tx.executeSql(strInsertWords("rather", "скорее"));
                tx.executeSql(strInsertWords("sophisticated", "изощренных"));
                tx.executeSql(strInsertWords("decipher", "расшифровывать"));
                tx.executeSql(strInsertWords("strip", "полоса"));
                tx.executeSql(strInsertWords("stick", "палка"));
                tx.executeSql(strInsertWords("at the table", "за столом")); 
                tx.executeSql(strInsertWords("passer-by", "прохожий"));
                tx.executeSql(strInsertWords("disappointed", "разочарован"));
                //-
                tx.executeSql(strInsertWords("steganography", "стеганография"));
                tx.executeSql(strInsertWords("reached", "достигнуто"));
                tx.executeSql(strInsertWords("ancient", "древний"));
                tx.executeSql(strInsertWords("silk", "шелк"));
                tx.executeSql(strInsertWords("scrunch", "хрустеть"));
                tx.executeSql(strInsertWords("tiny", "крошечный"));
                tx.executeSql(strInsertWords("wax", "воск"));
                tx.executeSql(strInsertWords("swallow", "глотать"));
                tx.executeSql(strInsertWords("stomach", "желудок"));
                tx.executeSql(strInsertWords("described", "описанный"));
                tx.executeSql(strInsertWords("conceal", "скрывать"));
                tx.executeSql(strInsertWords("ink", "чернила"));
                tx.executeSql(strInsertWords("vinegar", "уксус"));
                tx.executeSql(strInsertWords("alum", "квасцы"));
                tx.executeSql(strInsertWords("porous", "пористый"));
                tx.executeSql(strInsertWords("through", "через"));
                tx.executeSql(strInsertWords("weakness", "слабое место"));
                tx.executeSql(strInsertWords("rearrange", "перестраивать"));
                tx.executeSql(strInsertWords("reveal", "раскрывать"));
                tx.executeSql(strInsertWords("leather", "кожа"));
                tx.executeSql(strInsertWords("wood", "дерево"));
                tx.executeSql(strInsertWords("strip", "полоса"));
                tx.executeSql(strInsertWords("wind", "ветер"));
                tx.executeSql(strInsertWords("invented", "изобрел"));
                //--
                tx.executeSql(strInsertWords("to iron clothes", "гладить одежду утюгом"));
                tx.executeSql(strInsertWords("an iron", "утюг"));
                tx.executeSql(strInsertWords("to make stupid jokes"));
                tx.executeSql(strInsertWords("besides", "помимо"));
                tx.executeSql(strInsertWords("to get to know", "узнать"));
                tx.executeSql(strInsertWords("to achieve", "достигать"));
                tx.executeSql(strInsertWords("to scold", "ругать, вычитывать, отчитывать"));
                tx.executeSql(strInsertWords("to be used by someone", "быть кем то использованым"));
                tx.executeSql(strInsertWords("to keep the word", "сдержать слово"));
                //-
                tx.executeSql(strInsertWords("to interrupt a conversation", "прервать разговор"));
                tx.executeSql(strInsertWords("I am sorry for interrupting your conversation", "извините за прерывание разговора"));
                tx.executeSql(strInsertWords("to deserve", "заслуживать"));
                tx.executeSql(strInsertWords("shout out", "выкрикнуть"));
                tx.executeSql(strInsertWords("staring angrily", "злобно глядеть"));
                //--
                tx.executeSql(strInsertWords("take for granted", "принимать кого-то (что-то) само собой разумеющееся"));
                tx.executeSql(strInsertWords("take advantage", "воспользоваться в угоду себе (ситуацией или кем-то)"));
                tx.executeSql(strInsertWords("take any notice of", "обращать на кого-то внимание"));
                tx.executeSql(strInsertWords("take time", "не спешить, не торопиться, дать себе время"));
                tx.executeSql(strInsertWords("take side", "принимать (занимать) сторону"));
                tx.executeSql(strInsertWords("engage in conversation", "вовлекаться в разговор"));
                tx.executeSql(strInsertWords("chilly", "прохладный"));
                tx.executeSql(strInsertWords("tricky", "запутанный"));
                tx.executeSql(strInsertWords("indeed", "конечно"));
                //-
                tx.executeSql(strInsertWords("hoax", "обман, развод"));
                tx.executeSql(strInsertWords("apart from one thing", "кроме одного"));
                tx.executeSql(strInsertWords("instead of", "вместо того"));
                tx.executeSql(strInsertWords("spite", "злоба, делать назло, досаждать"));
                tx.executeSql(strInsertWords("despite (in spite of)", "несмотря на"));
                tx.executeSql(strInsertWords("whereas", "хотя, а"));
                tx.executeSql(strInsertWords("due to (because of)", "из-за"));
                tx.executeSql(strInsertWords("as (since)", "так как (в начале фразы)"));
                tx.executeSql(strInsertWords("even though", "даже хотя"));
                tx.executeSql(strInsertWords("nevertheless", "тем не менее"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertRelation("NEW"));
                //ANY//////////////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql(strInsertWords("for date", "за дату"));
                tx.executeSql(strInsertWords("as usual", "как обычно, как всегда"));
                tx.executeSql(strInsertWords("to wait in a queue", "ждат в очереди"));
                tx.executeSql(strInsertWords("to wait for somebody''s turn", "ждать своей очереди"));
                tx.executeSql(strInsertWords("take turns", "сделайте по очереди"));
                tx.executeSql(strInsertWords("lose consciousness", "терять сознание"));
                tx.executeSql(strInsertWords("out of fear", "от страха"));
                tx.executeSql(strInsertWords("bench", "скамейка"));
                tx.executeSql(strInsertWords("make mistace", "ошибиться"));
                tx.executeSql(strInsertWords("to do washing-up", "мыть посуду"));
                tx.executeSql(strInsertWords("make dinner", "готовить ужин"));
                tx.executeSql(strInsertWords("to master a language", "овладеть языком"));
                tx.executeSql(strInsertWords("to make an excuse", "отговариваться"));
                tx.executeSql(strInsertWords("to make somebody laugh", "заставить смеяться"));
                tx.executeSql(strInsertWords("to do someone a favour", "сделать одолжение"));
                tx.executeSql(strInsertWords("nearby", "рядом, поблизости"));
                tx.executeSql(strInsertWords("ledge", "уступ"));
                tx.executeSql(strInsertWords("pass on", "передавать"));
                tx.executeSql(strInsertWords("make up (story)", "придумать историю"));
                tx.executeSql(strInsertWords("ran over", "переехать (сбить)"));
                tx.executeSql(strInsertWords("gone off", "взрываться"));
                tx.executeSql(strInsertWords("running away", "убегать"));
                tx.executeSql(strInsertWords("work out", "вычислить,выяснить,понять,врубиться,упражняться,разрабатывать план,оказаться в результате подсчета,срабатывать,удаваться,получаться"));
                tx.executeSql(strInsertWords("takes off", "взлетать"));
                tx.executeSql(strInsertWords("knocked off", "выбить, сбить"));
                tx.executeSql(strInsertWords("come round", "прийти в себя"));
                //-
                tx.executeSql(strInsertWords("used to", "раньше ..."));
                tx.executeSql(strInsertWords("be used to", "быть привыкший"));
                tx.executeSql(strInsertWords("get used to", "привыкАющий"));
                //-
                tx.executeSql(strInsertWords("being", "являющийся"));
                tx.executeSql(strInsertWords("slower pace", "медленный темп"));
                tx.executeSql(strInsertWords("apology", "извинение"));
                tx.executeSql(strInsertWords("attitude", "отношение"));
                tx.executeSql(strInsertWords("obviously", "очевидно, явно"));
                tx.executeSql(strInsertWords("climbing", "альпинизм, восхождение"));
                tx.executeSql(strInsertWords("stuff", "материал, вещи"));
                tx.executeSql(strInsertWords("The Little Red Riding Hood", "Красная Шапочка"));
                tx.executeSql(strInsertWords("put on", "надевать"));
                tx.executeSql(strInsertWords("irritation", "раздражение"));
                tx.executeSql(strInsertWords("My friend was at the wheel", "мой друг за рулем"));
                tx.executeSql(strInsertWords("mine", "мой"));
                tx.executeSql(strInsertWords("write down", "записывать"));
                tx.executeSql(strInsertWords("get wet", "промокнуть"));
                tx.executeSql(strInsertWords("I don''t like", "Мне не нравится"));
                tx.executeSql(strInsertWords("He didn''t like it there", "Он не любил там"));
                tx.executeSql(strInsertWords("The service was poor", "Служба была плохой"));
                tx.executeSql(strInsertWords("misunderstandings", "недоразумение"));
                tx.executeSql(strInsertWords("servant", "слуга"));
                tx.executeSql(strInsertWords("wake somebody up", "разбудить кого-нибудь"));
                tx.executeSql(strInsertWords("It''s time to get up!", "время вставать!"));
                tx.executeSql(strInsertWords("due", "должное"));
                tx.executeSql(strInsertWords("reasonably", "разумно"));
                tx.executeSql(strInsertWords("sure", "конечно"));
                tx.executeSql(strInsertWords("unless", "если не"));
                tx.executeSql(strInsertWords("impress = if not", "произвести впечатление = если не"));
                tx.executeSql(strInsertWords("worse", "хуже"));
                tx.executeSql(strInsertWords("global warming", "глобальное потепление"));
                tx.executeSql(strInsertWords("processed food", "обработанная пища"));
                tx.executeSql(strInsertWords("definitely", "определенно"));
                tx.executeSql(strInsertWords("strip", "полоса"));
                tx.executeSql(strInsertWords("dip", "падение"));
                tx.executeSql(strInsertWords("nowadays", "в наше время"));
                tx.executeSql(strInsertWords("plate", "пластина"));
                tx.executeSql(strInsertWords("get on the bus/plane/train", "попасть на автобусе / поезде / самолете"));
                tx.executeSql(strInsertWords("get into a car", "сесть в машину"));
                tx.executeSql(strInsertWords("on the whole", "в целом"));
                tx.executeSql(strInsertWords("complain", "жаловаться"));
                tx.executeSql(strInsertWords("check-in desk", "стойка регистрации"));
                tx.executeSql(strInsertWords("get there", "достичь цели"));
                tx.executeSql(strInsertWords("Where do you want me to drop you off?", "Где вы хотите, чтобы я высадил вас?"));
                tx.executeSql(strInsertWords("I want you to drop me here", "Я хочу, чтобы ты высадил меня здесь"));
                tx.executeSql(strInsertWords("pick", "выбор"));
                tx.executeSql(strInsertWords("liquid", "жидкость"));
                tx.executeSql(strInsertWords("jewellery", "ювелирные изделия"));
                tx.executeSql(strInsertWords("wish", "желание"));
                tx.executeSql(strInsertWords("Don''t bother me!", "Не мешай мне!"));
                tx.executeSql(strInsertWords("giant", "гигант"));
                tx.executeSql(strInsertWords("pack", "пакет"));
                tx.executeSql(strInsertWords("by yourself", "самостоятельно"));
                tx.executeSql(strInsertWords("impact", "удар"));
                tx.executeSql(strInsertWords("light bulb", "лампочка"));
                tx.executeSql(strInsertWords("to go green", "вести экологичный образ жизни"));
                tx.executeSql(strInsertWords("to give it a go", "что бы дать этому ход"));
                tx.executeSql(strInsertWords("heatwave", "пекло"));
                tx.executeSql(strInsertWords("aerosol cans", "аэрозольные флаконы"));
                tx.executeSql(strInsertWords("industial waste", "промышленные отходы"));
                tx.executeSql(strInsertWords("car exhaust fumes", "автомобильные выхлопные газы"));
                tx.executeSql(strInsertWords("plenty, plenty of", "много, достаточно (несчисляемые)"));
                tx.executeSql(strInsertWords("aspiration", "стремление"));
                tx.executeSql(strInsertWords("feat", "подвиг"));
                tx.executeSql(strInsertWords("quest", "поиск"));
                tx.executeSql(strInsertWords("instead", "вместо"));
                tx.executeSql(strInsertWords("cave", "пещера"));
                tx.executeSql(strInsertWords("mess", "беспорядок"));
                tx.executeSql(strInsertWords("decade", "декада, десятилетие"));
                tx.executeSql(strInsertWords("appeal", "аппелировать к, нацеливаться на, удовлетворить интересы"));
                tx.executeSql(strInsertWords("what''s more, moreover", "более того"));
                tx.executeSql(strInsertWords("unstable", "не стабильный"));
                tx.executeSql(strInsertWords("foreign", "иностранный"));
                tx.executeSql(strInsertWords("tribe", "племя"));
                tx.executeSql(strInsertWords("inervitable", "неизбежно"));
                tx.executeSql(strInsertWords("revolution", "революция"));
                tx.executeSql(strInsertWords("turning point", "поворотный пункт"));
                tx.executeSql(strInsertWords("development", "развитие, разработка"));
                tx.executeSql(strInsertWords("advance", "продвижение"));
                tx.executeSql(strInsertWords("movement", "движение"));
                tx.executeSql(strInsertWords("invention", "изобретение"));
                tx.executeSql(strInsertWords("foundation", "фундамент, основа"));
                tx.executeSql(strInsertWords("discovery", "открытие"));
                tx.executeSql(strInsertWords("progress", "прогресс"));
                tx.executeSql(strInsertWords("a high achiever", "человек многого достиг"));
                tx.executeSql(strInsertWords("apprenticeship", "практическое обучение"));
                tx.executeSql(strInsertWords("emerge", "проявилось"));
                tx.executeSql(strInsertWords("rural", "сельский"));
                tx.executeSql(strInsertWords("turnout", "оказывается"));
                tx.executeSql(strInsertWords("caught fire", "загораться"));
                tx.executeSql(strInsertWords("knock of a door", "стучать в дверь"));
                tx.executeSql(strInsertWords("take your time", "не спешите"));
                tx.executeSql(strInsertWords("for free", "бесплатно"));
                tx.executeSql(strInsertWords("instant", "мгонвенный"));
                tx.executeSql(strInsertWords("greeting", "приветствие"));
                tx.executeSql(strInsertWords("if I were you", "если б я был на твоем месте"));
                tx.executeSql(strInsertWords("have a seat", "присаживайтесь"));
                tx.executeSql(strInsertWords("it depends", "когда как, смотря по обстоятельствам"));
                tx.executeSql(strInsertWords("council", "совет"));
                tx.executeSql(strInsertWords("pupil", "ученик"));
                tx.executeSql(strInsertWords("depend on", "зависит от"));
                tx.executeSql(strInsertWords("succeed in", "добиться успеха в"));
                tx.executeSql(strInsertWords("pay attention in", "обратить внимание на"));
                tx.executeSql(strInsertWords("rely on", "полагаться на"));
                tx.executeSql(strInsertWords("pick up on", "поднять на"));
                tx.executeSql(strInsertWords("have a talent for", "иметь талант для"));
                tx.executeSql(strInsertWords("think about", "думать о"));
                tx.executeSql(strInsertWords("have access to", "иметь доступ к"));
                tx.executeSql(strInsertWords("straightaway", "сразу"));
                tx.executeSql(strInsertWords("incredible ability", "невероятные способности"));
                tx.executeSql(strInsertWords("hats", "головные уборы"));
                tx.executeSql(strInsertWords("dyslexic", "дислексический"));
                tx.executeSql(strInsertWords("struggled with", "боролись с"));
                tx.executeSql(strInsertWords("spread the world", "распространять"));
                tx.executeSql(strInsertWords("recently", "в последнее время"));
                tx.executeSql(strInsertWords("shoe laces", "шнурки обувные"));
                tx.executeSql(strInsertWords("nightmare", "кошмар"));
                tx.executeSql(strInsertWords("desperately", "в отчаянии"));
                tx.executeSql(strInsertWords("granny", "бабуля"));
                tx.executeSql(strInsertWords("tears", "слезы"));
                tx.executeSql(strInsertWords("impresse", "впечатление"));
                tx.executeSql(strInsertWords("darkness", "темнота"));
                tx.executeSql(strInsertWords("parkin lot", "небольшая стоянка"));
                tx.executeSql(strInsertWords("a babysitter", "няня"));
                tx.executeSql(strInsertWords("first aid", "первая помощь"));
                tx.executeSql(strInsertWords("award", "награда"));
                tx.executeSql(strInsertWords("in all likelihood", "скорее всего"));
                tx.executeSql(strInsertWords("in all probability", "вероятнее всего"));
                tx.executeSql(strInsertWords("obsession", "навождение"));
                tx.executeSql(strInsertWords("to get united", "обединяться"));
                tx.executeSql(strInsertWords("split up", "расколотся"));
                tx.executeSql(strInsertWords("on anothere occasion", "в другом случае"));
                tx.executeSql(strInsertWords("accidentally", "случайно"));
                tx.executeSql(strInsertWords("silk", "шелк"));
                tx.executeSql(strInsertWords("apart from that", "кроме того"));
                tx.executeSql(strInsertWords("pretended", "притворятся"));
                tx.executeSql(strInsertWords("procrastination", "откладывание на потом"));
                tx.executeSql(strInsertWords("procrastinator", "откладывающий на потом"));
                tx.executeSql(strInsertWords("smash into pieces", "раздовить"));
                tx.executeSql(strInsertWords("get rid of ...", "избавиться"));
                tx.executeSql(strInsertWords("get rid of stress", "избавиться от стресса"));
                tx.executeSql(strInsertWords("get on me nerves", "действует мне на нервы"));
                tx.executeSql(strInsertWords("to deal with (to cope with)", "справляться с чем либо"));
                tx.executeSql(strInsertWords("society", "общество"));
                tx.executeSql(strInsertWords("feel down", "чувствовать подавленным"));
                tx.executeSql(strInsertWords("deep breath", "глубокий вдох"));
                tx.executeSql(strInsertWords("fed up", "надоело"));
                tx.executeSql(strInsertWords("upset", "расстройство, расстроенный"));
                tx.executeSql(strInsertWords("laughter", "смех"));
                tx.executeSql(strInsertWords("thousand", "тысяча"));
                tx.executeSql(strInsertWords("meditation", "размышление"));
                tx.executeSql(strInsertWords("anger", "гнев"));
                tx.executeSql(strInsertWords("distress", "скорбь"));
                tx.executeSql(strInsertWords("promts", "проворство"));
                tx.executeSql(strInsertWords("sadness", "грусть"));
                tx.executeSql(strInsertWords("joy", "радость"));
                tx.executeSql(strInsertWords("rejoice", "радуйся"));
                tx.executeSql(strInsertWords("predictable", "предсказуемый"));
                tx.executeSql(strInsertWords("surprise", "удивление"));
                tx.executeSql(strInsertWords("disgust", "отвращение"));
                tx.executeSql(strInsertWords("smell", "запах"));
                tx.executeSql(strInsertWords("to bear a name", "носить имя"));
                tx.executeSql(strInsertWords("speak up", "говорить громко"));
                tx.executeSql(strInsertWords("further", "далее"));
                tx.executeSql(strInsertWords("a flair for tracking down inconsistencies", "чутье для отслеживания несоответствий"));
                tx.executeSql(strInsertWords("a wider range of experience", "более широкий диапазон знаний (опыта)"));
                tx.executeSql(strInsertWords("boredom", "скука"));
                tx.executeSql(strInsertWords("lifting", "подъем"));
                tx.executeSql(strInsertWords("purpose", "цель, назначение"));
                tx.executeSql(strInsertWords("particularly", "особенно, в частности"));
                tx.executeSql(strInsertWords("rot", "гниль"));
                tx.executeSql(strInsertWords("potentially", "потенциально"));
                tx.executeSql(strInsertWords("facility", "объект, возможность"));
                tx.executeSql(strInsertWords("wonder", "чудо"));
                tx.executeSql(strInsertWords("inquiry/look into", "интересоватся, узнать, запросить"));
                tx.executeSql(strInsertWords("reply/to reply", "ответ, отвечать"));
                tx.executeSql(strInsertWords("miller", "мельник"));
                tx.executeSql(strInsertWords("Dutch", "голандец"));
                tx.executeSql(strInsertWords("find out", "выяснить"));
                tx.executeSql(strInsertWords("tidal wave", "приливная волна"));
                tx.executeSql(strInsertWords("wrestler", "борец"));
                tx.executeSql(strInsertWords("heavier", "тяжелее"));
                tx.executeSql(strInsertWords("constellation of stars", "созвездия"));
                tx.executeSql(strInsertWords("unconscious", "без сознания"));
                tx.executeSql(strInsertWords("although", "несмотря на то что, хотя"));
                tx.executeSql(strInsertWords("eyebrows", "брови"));
                tx.executeSql(strInsertWords("chest", "грудь, грудная клетка"));
                tx.executeSql(strInsertWords("arm", "рука"));
                tx.executeSql(strInsertWords("leg", "нога"));
                tx.executeSql(strInsertWords("mouth", "рот"));
                tx.executeSql(strInsertWords("fee", "взнос, гонорар, сбор, пошлина"));
                tx.executeSql(strInsertWords("treat", "угощение, обращение, лечить"));
                tx.executeSql(strInsertWords("entrepreneur", "предприниматель"));
                tx.executeSql(strInsertWords("influential", "влиятельный"));
                tx.executeSql(strInsertWords("via", "через"));
                tx.executeSql(strInsertWords("unfit", "плохая форма"));
                tx.executeSql(strInsertWords("to get fit", "прийти в форму"));
                tx.executeSql(strInsertWords("wanted", "розыскивается"));
                tx.executeSql(strInsertWords("caretaker", "хранитель, смотритель, лицо, присматривающее за домом"));
                tx.executeSql(strInsertWords("luxury", "роскошь"));
                tx.executeSql(strInsertWords("election", "выборы"));
                tx.executeSql(strInsertWords("pass by", "проходить мимо"));
                tx.executeSql(strInsertWords("for fun", "для развлечения"));
                tx.executeSql(strInsertWords("consider", "рассматривать (вопрос)"));
                tx.executeSql(strInsertWords("lately", "последнее время"));
                tx.executeSql(strInsertWords("put up", "терпеть (толерантный)"));
                tx.executeSql(strInsertWords("set off", "отправляться"));
                tx.executeSql(strInsertWords("get around", "передвигаться (от одного места к другому)"));
                tx.executeSql(strInsertWords("bring back", "привозить откуда то"));
                tx.executeSql(strInsertWords("deal with", "справляться, решать вопросы"));
                tx.executeSql(strInsertWords("check into", "въехать, поселяться (гостиница)"));
                tx.executeSql(strInsertWords("check out of", "выселяться (гостиница)"));
                tx.executeSql(strInsertWords("see somebody of", "провожать кого то"));
                tx.executeSql(strInsertWords("pick somebody up", "подобрать"));
                tx.executeSql(strInsertWords("get back", "возвращаться"));
                tx.executeSql(strInsertWords("at last", "наконец то"));
                tx.executeSql(strInsertWords("challenge", "вызов"));
                tx.executeSql(strInsertWords("thorn", "шип, колючка"));
                tx.executeSql(strInsertWords("on my own, by my self", "сам"));
                tx.executeSql(strInsertWords("sufficient", "достаточный, удовлетворительный"));
                tx.executeSql(strInsertWords("wave", "волна"));
                tx.executeSql(strInsertWords("to hurry", "торопиться"));
                tx.executeSql(strInsertWords("take part", "принимать участи"));
                tx.executeSql(strInsertWords("earliest", "раннее"));
                tx.executeSql(strInsertWords("simultaneously", "одновременно"));
                tx.executeSql(strInsertWords("multitasking", "многозадачность"));
                tx.executeSql(strInsertWords("vocabulary", "запас слов"));
                tx.executeSql(strInsertWords("themselves", "самих себя"));
                tx.executeSql(strInsertWords("psychologist", "психолог"));
                tx.executeSql(strInsertWords("brain", "головной мозг"));
                tx.executeSql(strInsertWords("enhances", "усиливает"));
                tx.executeSql(strInsertWords("indeed", "действительно"));
                tx.executeSql(strInsertWords("spreadsheet", "таблица"));
                tx.executeSql(strInsertWords("alienate", "отчуждать"));
                tx.executeSql(strInsertWords("leisure", "досуг"));
                tx.executeSql(strInsertWords("even", "даже"));
                tx.executeSql(strInsertWords("far from", "далеко от"));
                tx.executeSql(strInsertWords("cellular", "сотовая связь"));
                tx.executeSql(strInsertWords("amount", "количество"));
                tx.executeSql(strInsertWords("drawer", "выдвижной ящик"));
                tx.executeSql(strInsertWords("plaque", "бляшка"));
                tx.executeSql(strInsertWords("insisting", "настаивая на том"));
                tx.executeSql(strInsertWords("nodded", "кивнул"));
                tx.executeSql(strInsertWords("hesitate", "колебаться, стесняться"));
                tx.executeSql(strInsertWords("figure", "фигура"));
                tx.executeSql(strInsertWords("slip", "скольжение"));
                tx.executeSql(strInsertWords("property", "имущество"));
                tx.executeSql(strInsertWords("fond", "увлекаться"));
                tx.executeSql(strInsertWords("somebody", "кто то"));
                tx.executeSql(strInsertWords("laugh", "смеяться"));
                tx.executeSql(strInsertWords("fuse", "пробка электро"));
                tx.executeSql(strInsertWords("I''m plased", "мне приятно"));
                tx.executeSql(strInsertWords("sign", "знак"));
                tx.executeSql(strInsertWords("it a pity", "жаль"));
                tx.executeSql(strInsertWords("reproach", "упрек"));
                tx.executeSql(strInsertWords("disapproval", "неодобрение"));
                tx.executeSql(strInsertWords("regret", "сожаление"));
                tx.executeSql(strInsertWords("wicked", "злой"));
                tx.executeSql(strInsertWords("to be ashamed", "стыдиться"));
                tx.executeSql(strInsertWords("suitable time", "подходящее время"));
                tx.executeSql(strInsertWords("dreadful news", "устрашающие (ужасные) новости"));
                tx.executeSql(strInsertWords("to complain", "жаловаться"));
                tx.executeSql(strInsertWords("to obey", "подчиняться"));
                tx.executeSql(strInsertWords("to arrange a meeting", "назначить встречу"));
                tx.executeSql(strInsertWords("to make an appointment", "договориться о встрече"));
                tx.executeSql(strInsertWords("no wonder", "не удивительно"));
                tx.executeSql(strInsertWords("eventually", "в конце концов"));
                tx.executeSql(strInsertWords("motto", "девиз"));
                tx.executeSql(strInsertWords("outline", "наметить в общих чертах"));
                tx.executeSql(strInsertWords("requirement", "требование"));
                tx.executeSql(strInsertWords("convenience", "удобство"));
                tx.executeSql(strInsertWords("apprentice", "ученик, подмастерье, стажер"));
                tx.executeSql(strInsertWords("contestant", "соперник, участник соревнования "));
                tx.executeSql(strInsertWords("fascinating (extremely interesting)", "очаровательный, обворожительный (чрезвычайно интересно)"));
                tx.executeSql(strInsertWords("crew", "команда(корабельная)"));
                tx.executeSql(strInsertWords("blast off", "взлетать"));
                tx.executeSql(strInsertWords("sword", "меч"));
                tx.executeSql(strInsertWords("mansion", "особняк"));
                tx.executeSql(strInsertWords("incredibly", "невероятно"));
                tx.executeSql(strInsertWords("attend", "посещать"));
                tx.executeSql(strInsertWords("duties", "обязанности"));
                tx.executeSql(strInsertWords("imagined", "представить"));
                tx.executeSql(strInsertWords("chance", "шанс"));
                tx.executeSql(strInsertWords("trip", "поездка"));
                tx.executeSql(strInsertWords("jellyfish", "медуза"));
                tx.executeSql(strInsertWords("quite", "довольно"));
                tx.executeSql(strInsertWords("climbed", "поднялись"));
                tx.executeSql(strInsertWords("venom", "яд"));
                tx.executeSql(strInsertWords("headache", "головная боль"));
                tx.executeSql(strInsertWords("rushed", "бросился"));
                tx.executeSql(strInsertWords("survive", "выживать"));
                tx.executeSql(strInsertWords("insist", "настаивать"));
                tx.executeSql(strInsertWords("immensely", "очень"));
                tx.executeSql(strInsertWords("mention", "упомянуть"));
                tx.executeSql(strInsertWords("loneliness", "одиночество"));
                tx.executeSql(strInsertWords("turned out", "оказаться, оказалось"));
                tx.executeSql(strInsertWords("tiny", "крошечный"));
                tx.executeSql(strInsertWords("surf", "прибой"));
                tx.executeSql(strInsertWords("illness", "болезнь"));
                tx.executeSql(strInsertWords("speeches", "речи"));
                tx.executeSql(strInsertWords("involved", "участие"));
                tx.executeSql(strInsertWords("obligation", "обязательство"));
                tx.executeSql(strInsertWords("in order to", "для того, чтобы"));
                tx.executeSql(strInsertWords("fault", "вина"));
                tx.executeSql(strInsertWords("whatever", "неважно"));
                tx.executeSql(strInsertWords("against", "против"));
                tx.executeSql(strInsertWords("otherwise", "иначе"));
                tx.executeSql(strInsertWords("plural", "множественное число"));
                tx.executeSql(strInsertWords("degree", "степень, уровень, научная степень"));
                tx.executeSql(strInsertWords("suddenly", "внезапно"));
                tx.executeSql(strInsertWords("plywood", "фанера"));
                tx.executeSql(strInsertWords("strength", "прочность"));
                tx.executeSql(strInsertWords("durability", "долговечность"));
                tx.executeSql(strInsertWords("that will stop barriers", "стирание границ"));
                tx.executeSql(strInsertWords("to most straightforward way", "целенаправленный, наиболее простым способом"));
                tx.executeSql(strInsertWords("tend to use", "как правило, используют"));
                tx.executeSql(strInsertWords("through", "через"));
                tx.executeSql(strInsertWords("apologize", "извиняться"));
                tx.executeSql(strInsertWords("warn", "предупреждать"));
                tx.executeSql(strInsertWords("argue", "сориться"));
                tx.executeSql(strInsertWords("boast", "хвастаться"));
                tx.executeSql(strInsertWords("moan", "стонать, жаловаться"));
                tx.executeSql(strInsertWords("compliment", "комплимент"));
                tx.executeSql(strInsertWords("gossip", "сплетничать"));
                tx.executeSql(strInsertWords("simply", "просто"));
                tx.executeSql(strInsertWords("almost", "почти"));
                tx.executeSql(strInsertWords("around", "вокруг"));
                tx.executeSql(strInsertWords("nearly", "почти"));
                tx.executeSql(strInsertWords("roughly", "грубо"));
                tx.executeSql(strInsertWords("increas", "рост"));
                tx.executeSql(strInsertWords("recent", "недавние"));
                tx.executeSql(strInsertWords("turn out", "разворачивается"));
                tx.executeSql(strInsertWords("straight", "прямо"));
                tx.executeSql(strInsertWords("white lies", "безобидная лож"));
                tx.executeSql(strInsertWords("the same traits as her", "характерные черты"));
                tx.executeSql(strInsertWords("guess", "мне кажется, я полагаю"));
                tx.executeSql(strInsertWords("exactly", "точно"));
                tx.executeSql(strInsertWords("seem", "казаться"));
                tx.executeSql(strInsertWords("artificial intelligence", "искусственный интеллект"));
                tx.executeSql(strInsertWords("certain", "точно"));
                tx.executeSql(strInsertWords("master", "хозяин"));
                tx.executeSql(strInsertWords("likely", "вероятно"));
                tx.executeSql(strInsertWords("conclude", "делать вывод"));
                tx.executeSql(strInsertWords("mind", "ум"));
                tx.executeSql(strInsertWords("close", "близко"));
                tx.executeSql(strInsertWords("wealth", "богатство"));
                tx.executeSql(strInsertWords("challenge authority", "ставить под вопрос"));
                tx.executeSql(strInsertWords("realm", "сфера"));
                tx.executeSql(strInsertWords("loneliness, solitude", "одиночество"));
                tx.executeSql(strInsertWords("rather than", "скорее чем"));
                tx.executeSql(strInsertWords("memo", "меморандум"));
                tx.executeSql(strInsertWords("poor background", "бедная часть населения"));
                tx.executeSql(strInsertWords("either", "либо, так как"));
                tx.executeSql(strInsertWords("self confident", "уверенный в себе"));
                tx.executeSql(strInsertWords("too", "тоже"));
                tx.executeSql(strInsertWords("so", "так, также"));
                tx.executeSql(strInsertWords("advice", "уведомление, совет"));
                tx.executeSql(strInsertWords("district", "район"));
                tx.executeSql(strInsertWords("permission", "разрешение"));
                tx.executeSql(strInsertWords("quote", "ссылка"));
                tx.executeSql(strInsertWords("anyway", "в любом случае"));
                tx.executeSql(strInsertWords("pipeline", "трубопровод"));
                tx.executeSql(strInsertWords("absence", "отсутствие"));
                tx.executeSql(strInsertWords("pleasant", "приятно"));
                tx.executeSql(strInsertWords("surprisingly", "поразительно, удивительно"));
                tx.executeSql(strInsertWords("apparently", "явно"));
                tx.executeSql(strInsertWords("doubts", "сомнения"));
                tx.executeSql(strInsertWords("leap", "прыжок"));
                tx.executeSql(strInsertWords("arrangement", "условие, расположение, приведение в порядок"));
                tx.executeSql(strInsertWords("an attempt", "попытка"));
                tx.executeSql(strInsertWords("therefore", "в последствии, поэтому"));
                tx.executeSql(strInsertWords("imagination", "воображение, представление"));
                tx.executeSql(strInsertWords("appearance", "внешность, появление"));
                tx.executeSql(strInsertWords("pleasure", "удовольствие"));
                tx.executeSql(strInsertWords("attention", "внимание"));
                tx.executeSql(strInsertWords("dean", "декан"));
                tx.executeSql(strInsertWords("shake hands", "пожать друг другу руки"));
                tx.executeSql(strInsertWords("offer", "предложение"));
                tx.executeSql(strInsertWords("rather", "скорее, лучше, довольно"));
                tx.executeSql(strInsertWords("enthusiasm", "энтузиазм"));
                tx.executeSql(strInsertWords("gene", "ген"));
                tx.executeSql(strInsertWords("impress", "впечатление"));
                tx.executeSql(strInsertWords("related to", "связанные с"));
                tx.executeSql(strInsertWords("ability", "способность"));
                tx.executeSql(strInsertWords("probably", "вероятно, наверное"));
                tx.executeSql(strInsertWords("opportunity", "возможность"));
                tx.executeSql(strInsertWords("godfather and godmother", "крестный отец и крестная мать"));
                tx.executeSql(strInsertWords("mentor and pupil", "наставник и ученик"));
                tx.executeSql(strInsertWords("fiancee and fiance", "невеста и жених"));
                tx.executeSql(strInsertWords("follow", "следовать"));
                tx.executeSql(strInsertWords("still", "по прежнему, еще"));
                tx.executeSql(strInsertWords("together", "вместе"));
                tx.executeSql(strInsertWords("flow", "поток"));
                tx.executeSql(strInsertWords("slowly", "медленно"));
                tx.executeSql(strInsertWords("soon", "скоро"));
                tx.executeSql(strInsertWords("loudly", "громко"));
                tx.executeSql(strInsertWords("quietly", "тихо"));
                tx.executeSql(strInsertWords("normally", "нормально"));
                tx.executeSql(strInsertWords("things", "вещи"));
                tx.executeSql(strInsertWords("wet", "сыро"));
                tx.executeSql(strInsertWords("toothpaste", "зубная паста"));
                tx.executeSql(strInsertWords("take away", "забрать"));
                tx.executeSql(strInsertWords("stamp", "марка"));
                tx.executeSql(strInsertWords("scales", "весы"));
                tx.executeSql(strInsertWords("parcel", "посылка, пакет"));
                tx.executeSql(strInsertWords("over there", "вон там"));
                tx.executeSql(strInsertWords("this", "это"));
                tx.executeSql(strInsertWords("that", "тот"));
                tx.executeSql(strInsertWords("these", "эти"));
                tx.executeSql(strInsertWords("them", "им"));
                tx.executeSql(strInsertWords("their", "их"));
                tx.executeSql(strInsertWords("us", "нам"));
                tx.executeSql(strInsertWords("our", "наши"));
                tx.executeSql(strInsertWords("on tour", "на гастролях, в поездке"));
                tx.executeSql(strInsertWords("singer", "певец"));
                tx.executeSql(strInsertWords("yet", "еще"));
                tx.executeSql(strInsertWords("certainly", "конечно, безусловно"));
                tx.executeSql(strInsertWords("everybody", "все"));
                tx.executeSql(strInsertWords("north", "север"));
                tx.executeSql(strInsertWords("really", "действительно"));
                tx.executeSql(strInsertWords("pair", "пара"));
                tx.executeSql(strInsertWords("busy", "занят"));
                tx.executeSql(strInsertWords("life", "жизнь"));
                tx.executeSql(strInsertWords("seaside", "берег моря"));
                tx.executeSql(strInsertWords("degrees celsius", "градусы"));
                tx.executeSql(strInsertWords("divorced", "в разводе"));
                tx.executeSql(strInsertWords("fog", "туман"));
                tx.executeSql(strInsertWords("brochure", "брошюра"));
                tx.executeSql(strInsertWords("glass", "стекло"));
                tx.executeSql(strInsertWords("sand", "песок"));
                tx.executeSql(strInsertWords("most", "большинство"));
                tx.executeSql(strInsertWords("wrong", "неправильно"));
                tx.executeSql(strInsertWords("rare", "редкий"));
                tx.executeSql(strInsertWords("opinion", "мнение"));
                tx.executeSql(strInsertWords("occasion", "случай"));
                tx.executeSql(strInsertWords("fortunately", "к счастью"));
                tx.executeSql(strInsertWords("shy", "стеснительный"));
                tx.executeSql(strInsertWords("fear", "боязнь, страх"));
                tx.executeSql(strInsertWords("pollution", "загрязнение(окружающей среды)"));
                tx.executeSql(strInsertWords("fun", "весело"));
                tx.executeSql(strInsertWords("be outside", "быть на улице"));
                tx.executeSql(strInsertWords("hiking", "поход"));
                tx.executeSql(strInsertWords("all kinds of", "все виды"));
                tx.executeSql(strInsertWords("completely normal", "совершенно нормально"));
                tx.executeSql(strInsertWords("feeding", "кормление"));
                tx.executeSql(strInsertWords("thought", "мысль"));
                tx.executeSql(strInsertWords("outside", "снаружи"));
                tx.executeSql(strInsertWords("survey", "опрос, исследование"));
                tx.executeSql(strInsertWords("land in", "на земле"));
                tx.executeSql(strInsertWords("wire", "провод"));
                tx.executeSql(strInsertWords("refund", "возврат"));
                tx.executeSql(strInsertWords("sincerely", "искренне"));
                tx.executeSql(strInsertWords("litter", "мусор"));
                tx.executeSql(strInsertWords("equipment", "оборудование"));
                tx.executeSql(strInsertWords("rubbish", "мусор"));
                tx.executeSql(strInsertWords("advertisement", "реклама"));
                tx.executeSql(strInsertWords("direct", "направить"));
                tx.executeSql(strInsertWords("in addition", "в дополнение"));
                tx.executeSql(strInsertWords("good-looking", "хорошо выглядеть, симпотичный"));
                tx.executeSql(strInsertWords("abroad", "за границей"));
                tx.executeSql(strInsertWords("commitment", "приверженность, обязанность, долг"));
                tx.executeSql(strInsertWords("mascot", "талисман"));
                tx.executeSql(strInsertWords("glory, fame", "известность"));
                tx.executeSql(strInsertWords("plot", "сюжет"));
                tx.executeSql(strInsertWords("by far", "намного"));
                tx.executeSql(strInsertWords("enquiry (inquiry)", "вопрос; запрос; расспрашивание; наведение справок"));
                tx.executeSql(strInsertWords("efficiency", "эффективность, продуктивность"));
                tx.executeSql(strInsertWords("behavior", "поведение"));
                tx.executeSql(strInsertWords("failed to", "провалить (экзамен), не удалось"));
                tx.executeSql(strInsertWords("failure to", "не способность"));
                tx.executeSql(strInsertWords("turn over", "переключить"));
                tx.executeSql(strInsertWords("ever", "когда-либо"));
                tx.executeSql(strInsertWords("cut-throat", "ожесточенной"));
                tx.executeSql(strInsertWords("such", "такой"));
                tx.executeSql(strInsertWords("rival", "соперник"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertRelation("ANY"));
                //ADJECTIVE////////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql(strInsertWords("appalling", "ужасающий"));
                tx.executeSql(strInsertWords("curious", "любопытный"));
                tx.executeSql(strInsertWords("dry", "сухой"));
                tx.executeSql(strInsertWords("naive", "наивный"));
                tx.executeSql(strInsertWords("realised", "реализованный, осуществленный"));
                tx.executeSql(strInsertWords("disappointed", "разочарованный"));
                tx.executeSql(strInsertWords("wonderful", "замечательный"));
                tx.executeSql(strInsertWords("hamful", "вредный"));
                tx.executeSql(strInsertWords("serious", "серьезный"));
                tx.executeSql(strInsertWords("ethical", "этичный"));
                tx.executeSql(strInsertWords("incredible", "неимоверный"));
                tx.executeSql(strInsertWords("impressed", "впечатленный"));
                tx.executeSql(strInsertWords("educational", "образовательный"));
                tx.executeSql(strInsertWords("outstanding", "выдающийся"));
                tx.executeSql(strInsertWords("contaminated", "загрязненный"));
                tx.executeSql(strInsertWords("heavily", "крепкий"));
                tx.executeSql(strInsertWords("exemplary, unique", "уникальный"));
                tx.executeSql(strInsertWords("divine", "божественный"));
                tx.executeSql(strInsertWords("extraordinary", "необычайный"));
                tx.executeSql(strInsertWords("mortal", "смертный"));
                tx.executeSql(strInsertWords("awe - inspiring", "внушающий благоговение"));
                tx.executeSql(strInsertWords("ordinary", "обычный"));
                tx.executeSql(strInsertWords("smooth", "гладкий, плавный"));
                tx.executeSql(strInsertWords("exhausted", "уставший"));
                tx.executeSql(strInsertWords("ruling", "господствующий"));
                tx.executeSql(strInsertWords("packed", "уплотненный"));
                tx.executeSql(strInsertWords("anxious", "озабоченный"));
                tx.executeSql(strInsertWords("spare", "запасной"));
                tx.executeSql(strInsertWords("hypothetical", "гипотетический"));
                tx.executeSql(strInsertWords("imaginary", "воображаемый"));
                tx.executeSql(strInsertWords("adventurous", "приключенческий"));
                tx.executeSql(strInsertWords("talanted", "талантливый"));
                tx.executeSql(strInsertWords("sensitive", "чувствительный"));
                tx.executeSql(strInsertWords("brave", "храбрый"));
                tx.executeSql(strInsertWords("determined", "определенный, решительный"));
                tx.executeSql(strInsertWords("organised", "организованный"));
                tx.executeSql(strInsertWords("stubbom", "упертый"));
                tx.executeSql(strInsertWords("ambitious", "амбициозный"));
                tx.executeSql(strInsertWords("confident", "уверенный"));
                tx.executeSql(strInsertWords("practical", "практичный"));
                tx.executeSql(strInsertWords("mean", "скупой"));
                tx.executeSql(strInsertWords("optimistic", "оптимистичный"));
                tx.executeSql(strInsertWords("pessimistic", "пессимистический"));
                tx.executeSql(strInsertWords("stressful", "напряженный"));
                tx.executeSql(strInsertWords("tasty", "вкусный"));
                tx.executeSql(strInsertWords("pretty", "симпатичная, прелестная, хорошенькая"));
                tx.executeSql(strInsertWords("furious", "яростный"));
                tx.executeSql(strInsertWords("boiling", "кипящий"));
                tx.executeSql(strInsertWords("addict", "зависимый"));
                tx.executeSql(strInsertWords("self-made", "самодельный"));
                tx.executeSql(strInsertWords("abandoned", "заброшенный"));
                tx.executeSql(strInsertWords("laughing", "смеющийся"));
                tx.executeSql(strInsertWords("embarrassed", "смущенный"));
                tx.executeSql(strInsertWords("annoyed", "раздраженный"));
                tx.executeSql(strInsertWords("satisfied", "удовлетворенный"));
                tx.executeSql(strInsertWords("frustrated", "обескураживающий"));
                tx.executeSql(strInsertWords("tense", "напряженный"));
                tx.executeSql(strInsertWords("delicious", "восхитительный"));
                tx.executeSql(strInsertWords("responsible", "ответственный"));
                tx.executeSql(strInsertWords("lovable", "привлекательный"));
                tx.executeSql(strInsertWords("peaceful", "спокойный, мирный"));
                tx.executeSql(strInsertWords("messy", "беспорядочный"));
                tx.executeSql(strInsertWords("hairy", "волосатый"));
                tx.executeSql(strInsertWords("explosive", "взрывной"));
                tx.executeSql(strInsertWords("uncommon", "редкий"));
                tx.executeSql(strInsertWords("precious", "драгоценный"));
                tx.executeSql(strInsertWords("struck", "пораженный"));
                tx.executeSql(strInsertWords("missareble", "жалкий, убогий, ничтожный"));
                tx.executeSql(strInsertWords("huge", "огромный"));
                tx.executeSql(strInsertWords("attentive", "внимательный"));
                tx.executeSql(strInsertWords("enormous", "огромный"));
                tx.executeSql(strInsertWords("gorgeous", "вычурный, эфектный"));
                tx.executeSql(strInsertWords("faulty", "неисправный"));
                tx.executeSql(strInsertWords("annoying", "раздражающий"));
                tx.executeSql(strInsertWords("motivated", "мотивированный"));
                tx.executeSql(strInsertWords("exact", "конкретный"));
                tx.executeSql(strInsertWords("biased", "пристрастный"));
                tx.executeSql(strInsertWords("censcientions", "добросовестный"));
                tx.executeSql(strInsertWords("enclosed", "закрытый"));
                tx.executeSql(strInsertWords("reliable", "надежный"));
                tx.executeSql(strInsertWords("sensible", "разумный"));
                tx.executeSql(strInsertWords("easy-going", "с легким характером"));
                tx.executeSql(strInsertWords("aggressive", "агрессивный"));
                tx.executeSql(strInsertWords("clever/bright", "умный/яркий"));
                tx.executeSql(strInsertWords("honest", "честный"));
                tx.executeSql(strInsertWords("punctual", "пунктуальный"));
                tx.executeSql(strInsertWords("moody", "угрюмый"));
                tx.executeSql(strInsertWords("independent", "независимый"));
                tx.executeSql(strInsertWords("inherited", "унаследованный"));
                tx.executeSql(strInsertWords("generous", "щедрый"));
                tx.executeSql(strInsertWords("lazy", "ленивый"));
                tx.executeSql(strInsertWords("valuable", "ценный"));
                tx.executeSql(strInsertWords("obvious", "очевидный"));
                tx.executeSql(strInsertWords("flexible", "гибкий"));
                tx.executeSql(strInsertWords("overactive", "сверхактивный"));
                tx.executeSql(strInsertWords("rough", "приблизительный"));
                tx.executeSql(strInsertWords("eager", "нетерпеливый"));
                tx.executeSql(strInsertWords("own", "собственный"));
                tx.executeSql(strInsertWords("endless", "нескончаемый, бесконечный"));
                tx.executeSql(strInsertWords("attractive", "привлекательный "));
                tx.executeSql(strInsertWords("fantastic", "прекрасный"));
                tx.executeSql(strInsertWords("tired", "уставший"));
                tx.executeSql(strInsertWords("amazing", "замечательный"));
                tx.executeSql(strInsertWords("terrible", "ужасный"));
                tx.executeSql(strInsertWords("lovely", "милый"));
                tx.executeSql(strInsertWords("awful", "ужасный (в большей степени чем terrible)"));
                tx.executeSql(strInsertWords("sad", "грустный"));
                tx.executeSql(strInsertWords("untidy", "неопрятный"));
                tx.executeSql(strInsertWords("exciting", "захватывающий"));
                tx.executeSql(strInsertWords("excited", "восхищенный, возбуждённый"));
                tx.executeSql(strInsertWords("funny", "веселый"));
                tx.executeSql(strInsertWords("great", "великий"));
                tx.executeSql(strInsertWords("loud - громкий (a) quiet - тихий"));
                tx.executeSql(strInsertWords("rich - богатый (a) poor - бедный"));
                tx.executeSql(strInsertWords("fast - быстрый (a) slow - медленный"));
                tx.executeSql(strInsertWords("early - рано (a) late - поздно"));
                tx.executeSql(strInsertWords("tasteless, bland", "безвкусный"));
                tx.executeSql(strInsertWords("spicy", "перченый"));
                tx.executeSql(strInsertWords("crumbly", "рассыпчатый"));
                tx.executeSql(strInsertWords("crunchy", "хрустящий"));
                tx.executeSql(strInsertWords("oily", "жирный"));
                tx.executeSql(strInsertWords("stale", "несвежий"));
                tx.executeSql(strInsertWords("bitter", "горький"));
                tx.executeSql(strInsertWords("sweet", "сладкое"));
                tx.executeSql(strInsertWords("salty", "соленый"));
                tx.executeSql(strInsertWords("sour", "кислый"));
                tx.executeSql(strInsertWords("boiled", "вареный"));
                tx.executeSql(strInsertWords("fried", "жареный"));
                tx.executeSql(strInsertWords("baked", "печеный"));
                tx.executeSql(strInsertWords("confused", "смущённый; озадаченный"));
                tx.executeSql(strInsertWords("uncomfortable", "неудобный"));
                tx.executeSql(strInsertWords("nervous", "нервный"));
                tx.executeSql(strInsertWords("lonely", "одинокий"));
                tx.executeSql(strInsertWords("worried", "озабоченный"));
                tx.executeSql(strInsertWords("amazed", "изумлённый, поражённый"));
                tx.executeSql(strInsertWords("bored", "скучающий"));
                tx.executeSql(strInsertWords("rude", "грубый"));
                tx.executeSql(strInsertWords("polite", "вежливый"));
                tx.executeSql(strInsertWords("perhaps", "возможно"));
                tx.executeSql(strInsertWords("violent", "злой, жестокий, насильственный"));
                tx.executeSql(strInsertWords("loyal", " верный, преданный, лояльный"));
                tx.executeSql(strInsertWords("unrivalled", "непревзойдённый"));
                tx.executeSql(strInsertWords("prompt", "быстрый"));
                tx.executeSql(strInsertWords("promptly", "быстро"));
                tx.executeSql(strInsertWords("thin", "тонкий"));
                tx.executeSql(strInsertWords("melted", "плавленый"));
                tx.executeSql(strInsertWords("healthy", "здоровый"));
                tx.executeSql(strInsertWords("supposed", "предполагаемый"));
                tx.executeSql(strInsertWords("careful", "осторожный"));
                tx.executeSql(strInsertWords("insulated", "изолированный"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertRelation("ADJECTIVE"));
                //ANIMALS//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql(strInsertWords("seals", "морские котики"));
                tx.executeSql(strInsertWords("barking", "лай"));
                tx.executeSql(strInsertWords("bear", "медведь"));
                tx.executeSql(strInsertWords("butterfly", "бабочка"));
                tx.executeSql(strInsertWords("camel", "верблюд"));
                tx.executeSql(strInsertWords("chimpanzee", "шимпанзе"));
                tx.executeSql(strInsertWords("cow", "корова"));
                tx.executeSql(strInsertWords("crocodile", "крокодил"));
                tx.executeSql(strInsertWords("dolphin", "дельфин"));
                tx.executeSql(strInsertWords("eagle", "орел"));
                tx.executeSql(strInsertWords("elephant", "слон"));
                tx.executeSql(strInsertWords("fly", "муха"));
                tx.executeSql(strInsertWords("gorilla", "горила"));
                tx.executeSql(strInsertWords("leopard", "леопард"));
                tx.executeSql(strInsertWords("lion", "лев"));
                tx.executeSql(strInsertWords("monkey", "обезьяна"));
                tx.executeSql(strInsertWords("ostrich", "страус"));
                tx.executeSql(strInsertWords("penguin", "пингвин"));
                tx.executeSql(strInsertWords("pigeon", "голубь"));
                tx.executeSql(strInsertWords("snake", "змея"));
                tx.executeSql(strInsertWords("spider", "паук"));
                tx.executeSql(strInsertWords("tiger", "тигр"));
                tx.executeSql(strInsertWords("whale", "кит"));
                tx.executeSql(strInsertWords("insects", "насекомые"));
                tx.executeSql(strInsertWords("jay", "сойка"));
                tx.executeSql(strInsertWords("lizard", "ящерица"));
                tx.executeSql(strInsertWords("swift", "стриж"));
                tx.executeSql(strInsertWords("python", "питон"));
                tx.executeSql(strInsertWords("larvae", "личинки"));
                tx.executeSql(strInsertWords("cockroach", "таракан"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertRelation("ANIMALS"));
                //CLOTHING/////////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql(strInsertWords("dress smartly", "красивая одежда"));
                tx.executeSql(strInsertWords("coat", "пальто"));
                tx.executeSql(strInsertWords("T-shirt", "футболка"));
                tx.executeSql(strInsertWords("jacket", "жакет, пиджак"));
                tx.executeSql(strInsertWords("trousers", "брюки, штаны"));
                tx.executeSql(strInsertWords("shoes", "туфля, полуботинок"));
                tx.executeSql(strInsertWords("socks", "носки"));
                tx.executeSql(strInsertWords("scarf", "шарф, кашне"));
                tx.executeSql(strInsertWords("jumper", "джампер"));
                tx.executeSql(strInsertWords("boots", "сапоги"));
                tx.executeSql(strInsertWords("trainer", "кроссовки"));
                tx.executeSql(strInsertWords("suit", "костюм"));
                tx.executeSql(strInsertWords("shirt ", "рубашка, блуза, сорочка"));
                tx.executeSql(strInsertWords("tie", " галстук"));
                tx.executeSql(strInsertWords("skirt", "юбка"));
                tx.executeSql(strInsertWords("dress", "одежда, платье"));
                tx.executeSql(strInsertWords("shorts", "шорты"));
                tx.executeSql(strInsertWords("swimsuit", "купальник"));
                tx.executeSql(strInsertWords("outfit", "одежда, снаряжение"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertRelation("CLOTHING"));
                //CRIME_PUNISHMENT/////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql(strInsertWords("thumbprints", "отпечатки"));
                tx.executeSql(strInsertWords("retina scan", "сканирование сетчатки"));
                tx.executeSql(strInsertWords("strike", "забастовка"));
                tx.executeSql(strInsertWords("disaster", "катастрофа"));
                tx.executeSql(strInsertWords("collapse", "коллапс"));
                tx.executeSql(strInsertWords("law", "закон"));
                tx.executeSql(strInsertWords("guilty", "виновен"));
                tx.executeSql(strInsertWords("fugitive", "беглец"));
                tx.executeSql(strInsertWords("hostage", "заложник"));
                tx.executeSql(strInsertWords("dishonest way", "нечестный способ"));
                tx.executeSql(strInsertWords("burglar", "взломщик"));
                tx.executeSql(strInsertWords("aim", "цель"));
                tx.executeSql(strInsertWords("sentence", "приговоренный"));
                tx.executeSql(strInsertWords("theft", "кража"));
                tx.executeSql(strInsertWords("pass away", "умер"));
                tx.executeSql(strInsertWords("prison", "тюрьма"));
                tx.executeSql(strInsertWords("victim", "жертва"));
                tx.executeSql(strInsertWords("evidence", "доказательства"));
                tx.executeSql(strInsertWords("graffiti", "граффити"));
                tx.executeSql(strInsertWords("murder", "убийство"));
                tx.executeSql(strInsertWords("drink driving", "вождение в нетрезвом виде"));
                tx.executeSql(strInsertWords("fraud", "мошенничество"));
                tx.executeSql(strInsertWords("shoplifting", "кража в магазине"));
                tx.executeSql(strInsertWords("fine", "штраф"));
                tx.executeSql(strInsertWords("thief", "вор"));
                tx.executeSql(strInsertWords("an opposition", "сопротивление"));
                tx.executeSql(strInsertWords("custody", "заключен под надзор"));
                tx.executeSql(strInsertWords("weapon", "оружие"));
                tx.executeSql(strInsertWords("crash", "авария"));
                tx.executeSql(strInsertWords("jail", "тюремное заключение"));
                tx.executeSql(strInsertWords("sharp items", "острые предметы"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertRelation("CRIME_PUNISHMENT"));
                //FOOD/////////////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql(strInsertWords("pure water", "чистая вода"));
                tx.executeSql(strInsertWords("unpurified water", "неочищенная вода"));
                tx.executeSql(strInsertWords("broccoli", "брокколи"));
                tx.executeSql(strInsertWords("walnuts", "грецкие орехи"));
                tx.executeSql(strInsertWords("soft", "без алкогольная выпивка"));
                tx.executeSql(strInsertWords("doughnuts", "пончики"));
                tx.executeSql(strInsertWords("waiter", "официант"));
                tx.executeSql(strInsertWords("pizza", "пица"));
                tx.executeSql(strInsertWords("feast", "праздник, банкет"));
                tx.executeSql(strInsertWords("snack", "закуска"));
                tx.executeSql(strInsertWords("catering", "общественное питание"));
                tx.executeSql(strInsertWords("meat", "мясо"));
                tx.executeSql(strInsertWords("eggs", "яйца"));
                tx.executeSql(strInsertWords("carrots", "морковь"));
                tx.executeSql(strInsertWords("wine", "вино"));
                tx.executeSql(strInsertWords("Coca", "кока-кола"));
                tx.executeSql(strInsertWords("coffee", "кофе"));
                tx.executeSql(strInsertWords("tea", "чай"));
                tx.executeSql(strInsertWords("soup", "суп"));
                tx.executeSql(strInsertWords("seafood", "морепродук"));
                tx.executeSql(strInsertWords("salad", "салат"));
                tx.executeSql(strInsertWords("potatoes", "картофель"));
                tx.executeSql(strInsertWords("tomato", "помидор"));
                tx.executeSql(strInsertWords("onion", "лук"));
                tx.executeSql(strInsertWords("garlic", "чеснок"));
                tx.executeSql(strInsertWords("fish", "рыба"));
                tx.executeSql(strInsertWords("salmon", "лосось"));
                tx.executeSql(strInsertWords("apple", "яблоко"));
                tx.executeSql(strInsertWords("orange", "апельсин"));
                tx.executeSql(strInsertWords("chicken", "цыплёнок, курица"));
                tx.executeSql(strInsertWords("cucumber", "огурец"));
                tx.executeSql(strInsertWords("pipe apple", "ананас"));
                tx.executeSql(strInsertWords("kiwi", "киви"));
                tx.executeSql(strInsertWords("strawberry", "клубника"));
                tx.executeSql(strInsertWords("herring", "селедка"));
                tx.executeSql(strInsertWords("salt", "соль"));
                tx.executeSql(strInsertWords("oil", "масло"));
                tx.executeSql(strInsertWords("lard", "сало"));
                tx.executeSql(strInsertWords("baked potatoes", "печеный картофель"));
                tx.executeSql(strInsertWords("corn", "зерно"));
                tx.executeSql(strInsertWords("wheat", "пшеница"));
                tx.executeSql(strInsertWords("duck", "утка"));
                tx.executeSql(strInsertWords("beefsteak", "бифштекс"));
                tx.executeSql(strInsertWords("leg of lamb", "бараний окорок"));
                tx.executeSql(strInsertWords("oats", "овсяная крупа"));
                tx.executeSql(strInsertWords("shrimps", "креветки"));
                tx.executeSql(strInsertWords("mussels", "мидии"));
                tx.executeSql(strInsertWords("lobster", "омар"));
                tx.executeSql(strInsertWords("milk", "молоко"));
                tx.executeSql(strInsertWords("cheese", "сыр"));
                tx.executeSql(strInsertWords("jelly", "желе"));
                tx.executeSql(strInsertWords("cake", "пирог"));
                tx.executeSql(strInsertWords("yogurt", "йогурт"));
                tx.executeSql(strInsertWords("cream", "сливки"));
                tx.executeSql(strInsertWords("biscuit", "печенье"));
                tx.executeSql(strInsertWords("ice cream", "мороженое"));
                tx.executeSql(strInsertWords("orange juse", "апельсиновый сок"));
                tx.executeSql(strInsertWords("fizzy drink", "газ вода"));
                tx.executeSql(strInsertWords("lettuce", "капуста"));
                tx.executeSql(strInsertWords("peas", "горох"));
                tx.executeSql(strInsertWords("courgettes", "кабачок"));
                tx.executeSql(strInsertWords("grapes", "виноград"));
                tx.executeSql(strInsertWords("grapefruit", "грейпфрут"));
                tx.executeSql(strInsertWords("bananas", "бананы"));
                tx.executeSql(strInsertWords("mango", "манго "));
                tx.executeSql(strInsertWords("melon", "дыня"));
                tx.executeSql(strInsertWords("watermelon", "арбуз"));
                tx.executeSql(strInsertWords("plums", "слива, изюм"));
                tx.executeSql(strInsertWords("lemon", "лимон"));
                tx.executeSql(strInsertWords("beer", "пиво"));
                tx.executeSql(strInsertWords("lunch", "обед"));
                tx.executeSql(strInsertWords("wafers", "вафли"));
                tx.executeSql(strInsertWords("dress the salad", "заправить салат"));
                tx.executeSql(strInsertWords("taste", "вкус"));
                tx.executeSql(strInsertWords("dish", "блюдо"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertRelation("FOOD"));
                //HOUSE////////////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql(strInsertWords("house", "дом"));
                tx.executeSql(strInsertWords("huts", "хижина"));
                tx.executeSql(strInsertWords("tree house", "деревянный дом"));
                tx.executeSql(strInsertWords("flat", "квартира"));
                tx.executeSql(strInsertWords("living room", "жилая комната"));
                tx.executeSql(strInsertWords("dining room", "столовая"));
                tx.executeSql(strInsertWords("bedroom", "спальня"));
                tx.executeSql(strInsertWords("bathroom", "ванная"));
                tx.executeSql(strInsertWords("kitchen", "кухня"));
                tx.executeSql(strInsertWords("a bed", "кровать"));
                tx.executeSql(strInsertWords("a cooker", "плита (газовая)"));
                tx.executeSql(strInsertWords("a sofa", "софа, диван"));
                tx.executeSql(strInsertWords("a TV (telly)", "телевизор"));
                tx.executeSql(strInsertWords("a shower", "душевая кабина"));
                tx.executeSql(strInsertWords("a toilet", "унитаз"));
                tx.executeSql(strInsertWords("a table", "стол"));
                tx.executeSql(strInsertWords("a fridge", "холодильник"));
                tx.executeSql(strInsertWords("an armchair ", "кресло"));
                tx.executeSql(strInsertWords("a lamp", "лампа"));
                tx.executeSql(strInsertWords("a picture", "картина"));
                tx.executeSql(strInsertWords("a magazine", "журнал"));
                tx.executeSql(strInsertWords("a DVD player", "ДВД плеер"));
                tx.executeSql(strInsertWords("a laptop", "портативный компьютер"));
                tx.executeSql(strInsertWords("a desk", "стол (письменный)"));
                tx.executeSql(strInsertWords("a roof", "крыша"));
                tx.executeSql(strInsertWords("lobby", "вестибюль"));
                tx.executeSql(strInsertWords("a large screen", "большой экран"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertRelation("HOUSE"));
                //MEDICAL//////////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql(strInsertWords("bless you got", "будте здоровы"));
                tx.executeSql(strInsertWords("medicine", "лекарство"));
                tx.executeSql(strInsertWords("dicease", "заболевание"));
                tx.executeSql(strInsertWords("detoxify", "детоксикация"));
                tx.executeSql(strInsertWords("pill (painkiller)", "таблетка"));
                tx.executeSql(strInsertWords("to have a headache", "головная боль"));
                tx.executeSql(strInsertWords("to catch cold", "простудиться"));
                tx.executeSql(strInsertWords("hurt", "травма, рана"));
                tx.executeSql(strInsertWords("painful", "причиняющий боль, болезненный"));
                tx.executeSql(strInsertWords("sleep", "сон, дремота"));
                tx.executeSql(strInsertWords("sick", " больной, нездоровый"));
                tx.executeSql(strInsertWords("pandemic", "пандемия"));
                tx.executeSql(strInsertWords("harmless", "безвредный"));
                tx.executeSql(strInsertWords("surgeon", "хирург"));
                tx.executeSql(strInsertWords("life expectancy", "продолжительность жизни"));
                tx.executeSql(strInsertWords("immune", "иммунный"));
                tx.executeSql(strInsertWords("sick pay", "больничный"));
                tx.executeSql(strInsertWords("a neck", "шея"));
                tx.executeSql(strInsertWords("an arm", "часть руки"));
                tx.executeSql(strInsertWords("a back", "спина"));
                tx.executeSql(strInsertWords("a belly (stomack)", "живот"));
                tx.executeSql(strInsertWords("a palm", "ладонь"));
                tx.executeSql(strInsertWords("a leg", "нога"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertRelation("MEDICAL"));
                //MONEY////////////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql(strInsertWords("currency", "валюта"));
                tx.executeSql(strInsertWords("type of money from one country", "Тип денег из одной страны"));
                tx.executeSql(strInsertWords("cash", "наличные деньги"));
                tx.executeSql(strInsertWords("bank statement", "банковская выписка"));
                tx.executeSql(strInsertWords("cheque", "чек"));
                tx.executeSql(strInsertWords("notes", "банкноты"));
                tx.executeSql(strInsertWords("ATM", "банкомат"));
                tx.executeSql(strInsertWords("credit card", "кредитная карта"));
                tx.executeSql(strInsertWords("coins", "монеты"));
                tx.executeSql(strInsertWords("bill", "счет"));
                tx.executeSql(strInsertWords("receipt", "квитанция"));
                tx.executeSql(strInsertWords("invest money in", "инвестировать в ..."));
                tx.executeSql(strInsertWords("to borrow", "брать в займы [borrow from]"));
                tx.executeSql(strInsertWords("waste money = spend money", "транжирить"));
                tx.executeSql(strInsertWords("cost of living", "стоимость жизни"));
                tx.executeSql(strInsertWords("standard of living", "прожиточный минимум"));
                tx.executeSql(strInsertWords("tip", "чаевые"));
                tx.executeSql(strInsertWords("1-free", "бесплатно"));
                tx.executeSql(strInsertWords("2-cheap", "дешевый"));
                tx.executeSql(strInsertWords("3-reasonable", "не дорогой"));
                tx.executeSql(strInsertWords("4-quit expensive", "достаточно дорогой"));
                tx.executeSql(strInsertWords("5-very expensive", "очень дорогой"));
                tx.executeSql(strInsertWords("6-incredibly expensive", "очень, очень, очень дорогой"));
                tx.executeSql(strInsertWords("to charge = to ask", "запрашивать цену"));
                tx.executeSql(strInsertWords("value = it''s worth", "стоимость"));
                tx.executeSql(strInsertWords("wallet", "бумажник"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertRelation("MONEY"));
                //NATURAL//////////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql(strInsertWords("ocean", "океан"));
                tx.executeSql(strInsertWords("lake", "озеро"));
                tx.executeSql(strInsertWords("river", "река"));
                tx.executeSql(strInsertWords("waterfall", "водопад"));
                tx.executeSql(strInsertWords("mountain range", "горный хребет"));
                tx.executeSql(strInsertWords("desert", "пустыня"));
                tx.executeSql(strInsertWords("glacier", "ледник"));
                tx.executeSql(strInsertWords("rain forest", "тропический лес"));
                tx.executeSql(strInsertWords("coastline", "береговая линия"));
                tx.executeSql(strInsertWords("flood", "наводнение"));
                tx.executeSql(strInsertWords("earthquake", "землетрясение"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertRelation("NATURAL"));
                //OFFICE///////////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql(strInsertWords("an industrial city", "промышленный город"));
                tx.executeSql(strInsertWords("an industrilised country", "промышленно развитая страна"));
                tx.executeSql(strInsertWords("a developer", "разработчик"));
                tx.executeSql(strInsertWords("political", "политический"));
                tx.executeSql(strInsertWords("economics", "экономика"));
                tx.executeSql(strInsertWords("economist", "экономист"));
                tx.executeSql(strInsertWords("enviromental issues", "экологические проблемы"));
                tx.executeSql(strInsertWords("demand", "спрос"));
                tx.executeSql(strInsertWords("bankrupt", "банкрот"));
                tx.executeSql(strInsertWords("quiz", "проверка"));
                tx.executeSql(strInsertWords("to hold a meeting", "проводить встречу"));
                tx.executeSql(strInsertWords("in time", "во время, в нужный момент"));
                tx.executeSql(strInsertWords("on time", "по рассписанию"));
                tx.executeSql(strInsertWords("business trip", "командировка"));
                tx.executeSql(strInsertWords("funds", "средства"));
                tx.executeSql(strInsertWords("benefit", "выгода"));
                tx.executeSql(strInsertWords("to benefit", "приносить выгоду"));
                tx.executeSql(strInsertWords("issue", "спорный вопрос"));
                tx.executeSql(strInsertWords("apply (for a job)", "наниматься на работу"));
                tx.executeSql(strInsertWords("accountancy", "бухгалтерия; бухгалтерское дело"));
                tx.executeSql(strInsertWords("attend (an interview)", "приходить (на); присутствовать на собеседовании"));
                tx.executeSql(strInsertWords("be in a position to do sth.", "иметь возможность сделать что-либо"));
                tx.executeSql(strInsertWords("be invited to", "быть приглашенным (на)"));
                tx.executeSql(strInsertWords("be responsible for sth.", "отвечать за что-либо;  входить в чьи-либо обязанности"));
                tx.executeSql(strInsertWords("before we go any further прежде чем мы продолжим "));
                tx.executeSql(strInsertWords("by Friday", "к пятнице"));
                tx.executeSql(strInsertWords("candidate, applicant", "кандидат, претендент"));
                tx.executeSql(strInsertWords("career ladder", "служебная лестница, продвижение по службе"));
                tx.executeSql(strInsertWords("CV (Curriculum Vitae)", "биография"));
                tx.executeSql(strInsertWords("competition", "конкуренция, конкурсный экзамен, соревнование"));
                tx.executeSql(strInsertWords("develop a flair (for sth.)", "развить (в себе) талант (умение)"));
                tx.executeSql(strInsertWords("graduate (s.) (e. g. graduated engineer)", "выпускник (университета) (дипломированный инженер)"));
                tx.executeSql(strInsertWords("to graduate", "оканчивать (высшее учебное заведение)"));
                tx.executeSql(strInsertWords("graduate trainee posts", "место стажера (практиканта) для выпускника (университета)"));
                tx.executeSql(strInsertWords("high-profile client", "серьезный (влиятельный) клиент"));
                tx.executeSql(strInsertWords("hand over (to)", " предоставить кому-либо слово"));
                tx.executeSql(strInsertWords("Human Resources", "трудовые ресурсы; кадры"));
                tx.executeSql(strInsertWords("impress ", "впечатлять; заинтересовать"));
                tx.executeSql(strInsertWords("inconsistency", "несоответствие; несогласованность"));
                tx.executeSql(strInsertWords("interview (for a job)", "проводить собеседование (с целью принятия на работу)"));
                tx.executeSql(strInsertWords("interview panel", "комиссия, состоящая из лиц, проводящих собеседование"));
                tx.executeSql(strInsertWords("junior partner – младший партнер (фирмы)"));
                tx.executeSql(strInsertWords("post, job", "должность; работа"));
                tx.executeSql(strInsertWords("progress up the career ladder", "успешно продвигаться по служебной лестнице (делать карьеру)"));
                tx.executeSql(strInsertWords("prospective employee", "потенциальный служащий"));
                tx.executeSql(strInsertWords("provide on", "предоставить; сообщить"));
                tx.executeSql(strInsertWords("qualify (as)", "получить диплом (по специальности); сдавать квалификационный экзамен (в широком значении)"));
                tx.executeSql(strInsertWords("range of experience", "опыт по определенному кругу вопросов"));
                tx.executeSql(strInsertWords("reach a stage", "быть допущенным к какому-то этапу (собеседования)"));
                tx.executeSql(strInsertWords("scheme", "программа, проект"));
                tx.executeSql(strInsertWords("senior partner", "старший партнер (компании, фирмы)"));
                tx.executeSql(strInsertWords("skills and experience", "умения и опыт"));
                tx.executeSql(strInsertWords("strike sb. as, struck (past part.)", " создавать впечатление; впечатлять"));
                tx.executeSql(strInsertWords("suitable", "подходящий (соответствующий)"));
                tx.executeSql(strInsertWords("taxation", "налогообложение"));
                tx.executeSql(strInsertWords("tough", "жесткий (о конкуренции)"));
                tx.executeSql(strInsertWords("track down", "проследить (вернуться к исходным данным)"));
                tx.executeSql(strInsertWords("train for a career ", "готовить себя к работе (в какой-либо области)"));
                tx.executeSql(strInsertWords("cost", "стоимость"));
                tx.executeSql(strInsertWords("think outside the box ", "нестандартное решение"));
                tx.executeSql(strInsertWords("competitive", "конкурентоспособный"));
                tx.executeSql(strInsertWords("indecisive", "нерешительный"));
                tx.executeSql(strInsertWords("invitational", "пригласительный"));
                tx.executeSql(strInsertWords("the whole team", "Вся команда"));
                tx.executeSql(strInsertWords("bargain", "торговец"));
                tx.executeSql(strInsertWords("provide", "производить"));
                tx.executeSql(strInsertWords("claims", "претензии"));
                tx.executeSql(strInsertWords("bear the cost", "нести расходы"));
                tx.executeSql(strInsertWords("maintenance", "обслуживание"));
                tx.executeSql(strInsertWords("an order", "заказ"));
                tx.executeSql(strInsertWords("an inquiry", "запрос, наведение справки"));
                tx.executeSql(strInsertWords("a quotation", "цена, предложение, заказ"));
                tx.executeSql(strInsertWords("to be satisfied", "быть удовлетвореным"));
                tx.executeSql(strInsertWords("a complaint", "жалоба"));
                tx.executeSql(strInsertWords("skills", "навыки"));
                tx.executeSql(strInsertWords("break", "перерыв"));
                tx.executeSql(strInsertWords("boss", "босс"));
                tx.executeSql(strInsertWords("employee", "работник"));
                tx.executeSql(strInsertWords("goods", "товары"));
                tx.executeSql(strInsertWords("warehouse", "товарный склад"));
                tx.executeSql(strInsertWords("supplier", "поставщик"));
                tx.executeSql(strInsertWords("turnover", "оборот, оборачиваемость"));
                tx.executeSql(strInsertWords("invoice", "счет, накладная"));
                tx.executeSql(strInsertWords("agent", "агент"));
                tx.executeSql(strInsertWords("unemployed", "безработный"));
                tx.executeSql(strInsertWords("consumer", "потребитель"));
                tx.executeSql(strInsertWords("profit", "прибыль"));
                tx.executeSql(strInsertWords("share", "доля"));
                tx.executeSql(strInsertWords("worth", "стоимость"));
                tx.executeSql(strInsertWords("loan", "заем"));
                tx.executeSql(strInsertWords("enough", "достаточно"));
                tx.executeSql(strInsertWords("salary, wage", "зарплата"));
                tx.executeSql(strInsertWords("payment", "оплата"));
                tx.executeSql(strInsertWords("decision", "решение"));
                tx.executeSql(strInsertWords("store", "запас, резерв"));
                tx.executeSql(strInsertWords("customer", "заказчик"));
                tx.executeSql(strInsertWords("bushiness card", "деловая карта"));
                tx.executeSql(strInsertWords("state-of-art", "современный"));
                tx.executeSql(strInsertWords("start-up", "пробный проект"));
                tx.executeSql(strInsertWords("stock", "доля акций"));
                tx.executeSql(strInsertWords("at work", "на работе"));
                tx.executeSql(strInsertWords("in work", "занят (работают)"));
                tx.executeSql(strInsertWords("out of work", "безработный"));
                tx.executeSql(strInsertWords("revenue", "доход"));
                tx.executeSql(strInsertWords("policy", "страхование"));
                tx.executeSql(strInsertWords("an intermediary", "посредник"));
                tx.executeSql(strInsertWords("on demand", "по заказу, по требованию"));
                tx.executeSql(strInsertWords("method of delivery", "метод поставки"));
                tx.executeSql(strInsertWords("partner", "партнер"));
                tx.executeSql(strInsertWords("teammate", "товарищь по команде"));
                tx.executeSql(strInsertWords("member", "член"));
                tx.executeSql(strInsertWords("retail", "розничная торговля"));
                tx.executeSql(strInsertWords("purchase", "покупка"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertRelation("OFFICE"));
                //PERSON_FAMILY////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql(strInsertWords("the wedding ring", "обручальное кольцо"));
                tx.executeSql(strInsertWords("wedding", "свадьба"));
                tx.executeSql(strInsertWords("campaing", "кампания"));
                tx.executeSql(strInsertWords("mankind", "человечество"));
                tx.executeSql(strInsertWords("resident", "житель"));
                tx.executeSql(strInsertWords("community", "сообщество"));
                tx.executeSql(strInsertWords("personality", "личность"));
                tx.executeSql(strInsertWords("extended family", "расширенная семья"));
                tx.executeSql(strInsertWords("ancestor", "предок"));
                tx.executeSql(strInsertWords("relative", "родственники"));
                tx.executeSql(strInsertWords("niece", "племянница"));
                tx.executeSql(strInsertWords("nephew", "племянник"));
                tx.executeSql(strInsertWords("stepmother", "мачеха"));
                tx.executeSql(strInsertWords("stepfather", "отчим"));
                tx.executeSql(strInsertWords("flatmate", "товарищь по комнате"));
                tx.executeSql(strInsertWords("mother in law", "теща, свекровь"));
                tx.executeSql(strInsertWords("father in law", "тесть, свекр"));
                tx.executeSql(strInsertWords("dad, father", "отец"));
                tx.executeSql(strInsertWords("mom, mother", "мама"));
                tx.executeSql(strInsertWords("neighbours", "соседи"));
                tx.executeSql(strInsertWords("twin", "близнец"));
                tx.executeSql(strInsertWords("stranger", "незнакомец"));
                tx.executeSql(strInsertWords("acquaintance", "знакомый"));
                tx.executeSql(strInsertWords("classmate", "одноклассник"));
                tx.executeSql(strInsertWords("great-grandparent", "прадед/прабабушка"));
                tx.executeSql(strInsertWords("roots", "семейные корни"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertRelation("PERSON_FAMILY"));
                //REST/////////////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql(strInsertWords("jorney", "морское путешествие"));
                tx.executeSql(strInsertWords("theatre", "театр"));
                tx.executeSql(strInsertWords("mountains", "горы"));
                tx.executeSql(strInsertWords("sailing", "парусный спорт"));
                tx.executeSql(strInsertWords("sights", "достопримечательности"));
                tx.executeSql(strInsertWords("biopic", "биографический фильм"));
                tx.executeSql(strInsertWords("docudrama", "документальная драма"));
                tx.executeSql(strInsertWords("romantic comedy", "романтическая комендия"));
                tx.executeSql(strInsertWords("period drama", "историческая драма"));
                tx.executeSql(strInsertWords("fantasy/science fiction", "фэнтези / фантастика"));
                tx.executeSql(strInsertWords("psychological thriller", "психологический триллер"));
                tx.executeSql(strInsertWords("action/adventure", "приключение"));
                tx.executeSql(strInsertWords("mystery/crime", "тайна / криминал"));
                tx.executeSql(strInsertWords("inaccurate", "неточный"));
                tx.executeSql(strInsertWords("scuba-diving", "подводное плавание с аквалангом"));
                tx.executeSql(strInsertWords("fencing", "фехтование"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertRelation("REST"));
                //TRANSPORT////////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql(strInsertWords("pedestrian", "пешеход"));
                tx.executeSql(strInsertWords("ferry", "паром"));
                tx.executeSql(strInsertWords("boarding", "посадка"));
                tx.executeSql(strInsertWords("luggage", "багаж"));
                tx.executeSql(strInsertWords("boarding card", "посадочный талон"));
                tx.executeSql(strInsertWords("aeroplane", "самолет"));
                tx.executeSql(strInsertWords("coach", "автобус(междугородний)"));
                tx.executeSql(strInsertWords("wheel", "колесо"));
                tx.executeSql(strInsertWords("helicopter", "вертолет"));
                tx.executeSql(strInsertWords("hot air balloon", "воздушный шар"));
                tx.executeSql(strInsertWords("lorry", "грузовик"));
                tx.executeSql(strInsertWords("minibus", "микроавтобус"));
                tx.executeSql(strInsertWords("moped", "мопед"));
                tx.executeSql(strInsertWords("motorbike", "мотоцикл"));
                tx.executeSql(strInsertWords("ship", "морской корабль"));
                tx.executeSql(strInsertWords("speedboat", "катер"));
                tx.executeSql(strInsertWords("taxi", "такси"));
                tx.executeSql(strInsertWords("tram", "трамвай"));
                tx.executeSql(strInsertWords("underground", "метро"));
                tx.executeSql(strInsertRelation("TRANSPORT"));
                //-------------------------------------------------------------------------------------------------------------
                //VERB/////////////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql(strInsertWords("to avoid", "избежать"));
                tx.executeSql(strInsertWords("to achieve", "достигать"));
                tx.executeSql(strInsertWords("to heat", "обогревать"));
                tx.executeSql(strInsertWords("to proceed", "продолжать"));
                tx.executeSql(strInsertWords("to purify", "очистить"));
                tx.executeSql(strInsertWords("to surround", "окружить"));
                tx.executeSql(strInsertWords("to cover", "покрывать"));
                tx.executeSql(strInsertWords("to melt", "плавиться"));
                tx.executeSql(strInsertWords("to starve", "голодать"));
                tx.executeSql(strInsertWords("to improve", "улучшать"));
                tx.executeSql(strInsertWords("to threat", "угрожать"));
                tx.executeSql(strInsertWords("to doubt", "сомневаться"));
                tx.executeSql(strInsertWords("to hire", "нанимать"));
                tx.executeSql(strInsertWords("to overcook", "пережарить"));
                tx.executeSql(strInsertWords("to fry-overcook", "жарить-сверхготовить"));
                tx.executeSql(strInsertWords("to satisfy (needs)", "удовлетворить"));
                tx.executeSql(strInsertWords("to admit", "признавать"));
                tx.executeSql(strInsertWords("to describe", "описывать"));
                tx.executeSql(strInsertWords("to survive", "выживать"));
                tx.executeSql(strInsertWords("to convince", "убедить (с доказательствами)"));
                tx.executeSql(strInsertWords("to raise, rise", "поднимать"));
                tx.executeSql(strInsertWords("to claim", "утверждать"));
                tx.executeSql(strInsertWords("to prove", "доказать"));
                tx.executeSql(strInsertWords("to adore", "обожать"));
                tx.executeSql(strInsertWords("to cheat", "обманывать"));
                tx.executeSql(strInsertWords("to enjoy", "наслаждаться"));
                tx.executeSql(strInsertWords("to afford", "предоставлять"));
                tx.executeSql(strInsertWords("to earn", "зарабатывать"));
                tx.executeSql(strInsertWords("to improvise", "импровизировать"));
                tx.executeSql(strInsertWords("to invent", "изобретать"));
                tx.executeSql(strInsertWords("to invite", "приглашать"));
                tx.executeSql(strInsertWords("to injure", "ранить"));
                tx.executeSql(strInsertWords("to notice", "отмечать"));
                tx.executeSql(strInsertWords("to post", "отправить почту"));
                tx.executeSql(strInsertWords("to resign", "уходить в отставку"));
                tx.executeSql(strInsertWords("to sunbathe", "загорать"));
                tx.executeSql(strInsertWords("to store", "хранить"));
                tx.executeSql(strInsertWords("to try on", "примерять"));
                tx.executeSql(strInsertWords("to appear", "появляться"));
                tx.executeSql(strInsertWords("to adopt", "принимать"));
                tx.executeSql(strInsertWords("to believe", "верить"));
                tx.executeSql(strInsertWords("to rent", "арендовать"));
                tx.executeSql(strInsertWords("to insist", "настаивать"));
                tx.executeSql(strInsertWords("to rob", "ограбить"));
                tx.executeSql(strInsertWords("to be excited", "волноваться"));
                tx.executeSql(strInsertWords("to explain", "объяснять"));
                tx.executeSql(strInsertWords("to argue", "спросить"));
                tx.executeSql(strInsertWords("to prefer", "предпологать"));
                tx.executeSql(strInsertWords("to fear", "бояться"));
                tx.executeSql(strInsertWords("to annoy", "раздражать"));
                tx.executeSql(strInsertWords("to escape", "убегать"));
                tx.executeSql(strInsertWords("to care", "носить"));
                tx.executeSql(strInsertWords("to fetch", "приносить убитую дичь (о собаке)"));
                tx.executeSql(strInsertWords("to redo", " делать вновь"));
                tx.executeSql(strInsertWords("to represent", "представлять"));
                tx.executeSql(strInsertWords("to bully", "дразнить"));
                tx.executeSql(strInsertWords("to project (to plan)", "проектировать"));
                tx.executeSql(strInsertWords("to refuse", "отвергать, отказываться"));
                tx.executeSql(strInsertWords("to alter", "изменять"));
                tx.executeSql(strInsertWords("to pick", "выбирать"));
                tx.executeSql(strInsertWords("to reinvent", "воссоздать, изобретать"));
                tx.executeSql(strInsertWords("to promise", "обещать"));
                tx.executeSql(strInsertWords("to posses", "владеть"));
                tx.executeSql(strInsertWords("to hide", "прятать"));
                tx.executeSql(strInsertWords("to reveal", "раскрывать, показывать, обнаруживать"));
                tx.executeSql(strInsertWords("to obtain", "завладеть"));
                tx.executeSql(strInsertWords("to procrastinate", "откладывать на потом"));
                tx.executeSql(strInsertWords("to persuade", "уговаривать, убеждать"));
                tx.executeSql(strInsertWords("to emphasise", "выделить"));
                tx.executeSql(strInsertWords("to solve", "решать"));
                tx.executeSql(strInsertWords("to consider", "рассматривать, предпологать"));
                tx.executeSql(strInsertWords("to mention", "упоминать"));
                tx.executeSql(strInsertWords("to involve", "включать, вовлекать"));
                tx.executeSql(strInsertWords("to encourage", "поощрять"));
                tx.executeSql(strInsertWords("to chat", "общаться"));
                tx.executeSql(strInsertWords("to advise", "уведомлять"));
                tx.executeSql(strInsertWords("to disturb", "беспокоить"));
                tx.executeSql(strInsertWords("to attack", "нападать"));
                tx.executeSql(strInsertWords("to reduce", "уменьшить, ослабить"));
                tx.executeSql(strInsertWords("to censor", "проверять"));
                tx.executeSql(strInsertWords("to ought to", "должен (моральные обязятельства)"));
                tx.executeSql(strInsertWords("to suck", "впиваться"));
                tx.executeSql(strInsertWords("to laugh", "смеяться"));
                tx.executeSql(strInsertWords("to spread", "распространять"));
                tx.executeSql(strInsertWords("to waste", "тратить по напрасну"));
                tx.executeSql(strInsertWords("to increase", "увеличивать"));
                tx.executeSql(strInsertWords("to introduce", "представлять"));
                tx.executeSql(strInsertWords("to head", "направлять"));
                tx.executeSql(strInsertWords("to bet", "спорить, заключать пари"));
                tx.executeSql(strInsertWords("to vote", "голосовать"));
                tx.executeSql(strInsertWords("to knock", "стучать"));
                tx.executeSql(strInsertWords("to be ill", "болеть"));
                tx.executeSql(strInsertWords("to wonder", "удивляться"));
                tx.executeSql(strInsertWords("to estimate", "оценить"));
                tx.executeSql(strInsertWords("to question", "ставить под вопрос"));
                tx.executeSql(strInsertWords("to attract", "привлекать"));
                tx.executeSql(strInsertWords("to cause", "приченять"));
                tx.executeSql(strInsertWords("to pull", "вытащить"));
                tx.executeSql(strInsertWords("to breed", "разводить"));
                tx.executeSql(strInsertWords("to hatch", "вылупиться"));
                tx.executeSql(strInsertWords("to measure", "измерять"));
                tx.executeSql(strInsertWords("to reach", "добираться"));
                tx.executeSql(strInsertWords("to chew", "жевать"));
                tx.executeSql(strInsertWords("to last", "длиться"));
                tx.executeSql(strInsertWords("to clap", "хлопать (в ладоши)"));
                tx.executeSql(strInsertWords("to strengthen", "укреплять"));
                tx.executeSql(strInsertWords("to sluggish", "тормозить, замедляться"));
                tx.executeSql(strInsertWords("to refund", "возвращать"));
                tx.executeSql(strInsertWords("to concentrate", "концентрироваться"));
                tx.executeSql(strInsertWords("to acquire", "приобретать"));
                tx.executeSql(strInsertWords("to expose", "разоблачать"));
                tx.executeSql(strInsertWords("to cure", "лечить"));
                tx.executeSql(strInsertWords("to admire", "восхищаться"));
                tx.executeSql(strInsertWords("to rescue", "спасать, выручать"));
                tx.executeSql(strInsertWords("to climb", "возрастать, карабкаться"));
                tx.executeSql(strInsertWords("to farm", "культивировать землю"));
                tx.executeSql(strInsertWords("to assassinate", "убить"));
                tx.executeSql(strInsertWords("to declare", "объявить"));
                tx.executeSql(strInsertWords("to destroy", "разрушать"));
                tx.executeSql(strInsertWords("to elect", "выбирать"));
                tx.executeSql(strInsertWords("to release", "выпускать, освободить"));
                tx.executeSql(strInsertWords("to identify", "идентифицировать"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertRelation("VERB"));
                //VERB_IRREG///////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql(strInsertWords("to be-was-were-been", "быть"));
                tx.executeSql(strInsertWords("to become-became-become", "становиться"));
                tx.executeSql(strInsertWords("to begin-began-begun", "начинать"));
                tx.executeSql(strInsertWords("to bring-brought-brought", "приносить"));
                tx.executeSql(strInsertWords("to build-built-built", "строить"));
                tx.executeSql(strInsertWords("to buy-bought-bought", "покупать"));
                tx.executeSql(strInsertWords("to beat-beat-beaten", "бить"));
                tx.executeSql(strInsertWords("to bend-bent-bent", "гнуть"));
                tx.executeSql(strInsertWords("to bet-bet-bet", "быть уверенным"));
                tx.executeSql(strInsertWords("to bite-bit-bitten", "кусать"));
                tx.executeSql(strInsertWords("to blow-blew-blown", "дуть"));
                tx.executeSql(strInsertWords("to break-broke-broken", "ломать"));
                tx.executeSql(strInsertWords("to broadcast-broadcast-broadcast", "распространять"));
                tx.executeSql(strInsertWords("to burst-burst-burst", "взрываться"));
                tx.executeSql(strInsertWords("to can-could", "мочь"));
                tx.executeSql(strInsertWords("to catch-caught-caught", "ловить"));
                tx.executeSql(strInsertWords("to come-came-come", "приходить"));
                tx.executeSql(strInsertWords("to cost-cost-cost", "стоить"));
                tx.executeSql(strInsertWords("to choose-chose-chosen", "выбирать"));
                tx.executeSql(strInsertWords("to creep-crept-crept", "ползать"));
                tx.executeSql(strInsertWords("to cut-cut-cut", "резать"));
                tx.executeSql(strInsertWords("to deal-dealt-dealt", "иметь дело, распределять"));
                tx.executeSql(strInsertWords("to dig-dug-dug", "копать, рыть"));
                tx.executeSql(strInsertWords("to do-did-done", "делать, выполнять"));
                tx.executeSql(strInsertWords("to draw-drew-drawn", "рисовать, чертить"));
                tx.executeSql(strInsertWords("to drink-drank-drunk", "пить"));
                tx.executeSql(strInsertWords("to drive-drove-driven", "ездить, подвозить"));
                tx.executeSql(strInsertWords("to eat-ate-eaten", "есть, поглощать, поедать"));
                tx.executeSql(strInsertWords("to fall-fell-fallen -	падать"));
                tx.executeSql(strInsertWords("to feed-fed-fed -	кормить"));
                tx.executeSql(strInsertWords("to feel-felt-felt", "чувствовать, ощущать"));
                tx.executeSql(strInsertWords("to fight-fought-fought", "драться, сражаться, воевать"));
                tx.executeSql(strInsertWords("to find-found-found -	находить, обнаруживать"));
                tx.executeSql(strInsertWords("to flee-fled-fled", "убегать, спасаться бегством"));
                tx.executeSql(strInsertWords("to fly-flew-flown", "летать"));
                tx.executeSql(strInsertWords("to forbid-forbade-forbidden", "запрещать"));
                tx.executeSql(strInsertWords("to forget-forgot-forgotten", "забывать о (чём-либо)"));
                tx.executeSql(strInsertWords("to forgive-forgave-forgiven -	прощать"));
                tx.executeSql(strInsertWords("to freeze-froze-frozen", "замерзать, замирать"));
                tx.executeSql(strInsertWords("to get-got-got", "получать, добираться"));
                tx.executeSql(strInsertWords("to give-gave-given", "дать, подать, дарить"));
                tx.executeSql(strInsertWords("to go-went-gone", "идти, двигаться"));
                tx.executeSql(strInsertWords("to grow-grew-grown", "расти, вырастать"));
                tx.executeSql(strInsertWords("to hang-hung-hung", "вешать, развешивать, висеть"));
                tx.executeSql(strInsertWords("to have-had-had -	иметь, обладать"));
                tx.executeSql(strInsertWords("to hear-heard-heard -	слышать, услышать"));
                tx.executeSql(strInsertWords("to hide-hid-hidden", "прятать, скрывать"));
                tx.executeSql(strInsertWords("to hit-hit-hit", "ударять, поражать"));
                tx.executeSql(strInsertWords("to hold-held-held", "держать, удерживать, задерживать"));
                tx.executeSql(strInsertWords("to hurt-hurt-hurt", "ранить, причинять боль, ушибить"));
                tx.executeSql(strInsertWords("to keep-kept-kept", "хранить, сохранять, поддерживать"));
                tx.executeSql(strInsertWords("to know-knew-known", "знать, иметь представление"));
                tx.executeSql(strInsertWords("to lay-laid-laid", "класть, положить, покрывать"));
                tx.executeSql(strInsertWords("to lead-led-led", "вести за собой, сопровождать, руководить"));
                tx.executeSql(strInsertWords("to leave-left-left", "покидать, уходить, уезжать, оставлять"));
                tx.executeSql(strInsertWords("to lend-lent-lent", "одалживать, давать взаймы (в долг)"));
                tx.executeSql(strInsertWords("to let-let-let", "позволять, разрешать"));
                tx.executeSql(strInsertWords("to lie-lay-lain", "лежать"));
                tx.executeSql(strInsertWords("to light-lit-lit", "зажигать, светиться, освещать"));
                tx.executeSql(strInsertWords("to lose-lost-lost", "терять, лишаться, утрачивать"));
                tx.executeSql(strInsertWords("to make-made-made", "делать, создавать, изготавливать"));
                tx.executeSql(strInsertWords("to mean-meant-meant", "значить, иметь в виду, подразумевать"));
                tx.executeSql(strInsertWords("to meet-met-met", "встречать, знакомиться"));
                tx.executeSql(strInsertWords("to pay-paid-paid", "платить, оплачивать, рассчитываться"));
                tx.executeSql(strInsertWords("to put-put-put", "ставить, помещать, класть"));
                tx.executeSql(strInsertWords("to read-read-read", "читать, прочитать"));
                tx.executeSql(strInsertWords("to ride-rode-ridden", "ехать верхом, кататься"));
                tx.executeSql(strInsertWords("to ring-rang-rung", "звенеть, звонить"));
                tx.executeSql(strInsertWords("to rise-rose-risen", "восходить, вставать, подниматься"));
                tx.executeSql(strInsertWords("to run-ran-run", "бежать, бегать, управлять"));
                tx.executeSql(strInsertWords("to say-said-said", "говорить, сказать, произносить"));
                tx.executeSql(strInsertWords("to see-saw-seen", "видеть"));
                tx.executeSql(strInsertWords("to seek-sought-sought", "искать, разыскивать"));
                tx.executeSql(strInsertWords("to sell-sold-sold", "продавать, торговать"));
                tx.executeSql(strInsertWords("to send-sent-sent", "посылать, отправлять, отсылать"));
                tx.executeSql(strInsertWords("to set-set-set", "устанавливать, задавать, назначать"));
                tx.executeSql(strInsertWords("to shake-shook-shaken", "трясти, встряхивать"));
                tx.executeSql(strInsertWords("to shine-shone-shone", "светить, сиять, озарять"));
                tx.executeSql(strInsertWords("to shoot-shot-shot", "стрелять"));
                tx.executeSql(strInsertWords("to show-showed-shown, showed", "показывать"));
                tx.executeSql(strInsertWords("to shut-shut-shut", "закрывать, запирать, затворять"));
                tx.executeSql(strInsertWords("to sing-sang-sung", "петь, напевать"));
                tx.executeSql(strInsertWords("to sink-sank-sunk", "тонуть, погружаться"));
                tx.executeSql(strInsertWords("to sit-sat-sat", "сидеть, садиться"));
                tx.executeSql(strInsertWords("to sleep-slept-slept", "спать"));
                tx.executeSql(strInsertWords("to speak-spoke-spoken", "говорить, разговаривать, высказываться"));
                tx.executeSql(strInsertWords("to spend-spent-spent", "тратить, расходовать, проводить (время) "));
                tx.executeSql(strInsertWords("to stand-stood-stood", "стоять"));
                tx.executeSql(strInsertWords("to steal-stole-stolen", "воровать, красть"));
                tx.executeSql(strInsertWords("to stick-stuck-stuck", "втыкать, приклеивать, застрять"));
                tx.executeSql(strInsertWords("to strike-struck-struck, stricken", "ударять, бить, поражать"));
                tx.executeSql(strInsertWords("to swear-swore-sworn", "клясться, присягать"));
                tx.executeSql(strInsertWords("to sweep-swept-swept", "мести, подметать, смахивать"));
                tx.executeSql(strInsertWords("to swim-swam-swum", "плавать, плыть"));
                tx.executeSql(strInsertWords("to swing-swung-swung", "качаться, вертеться"));
                tx.executeSql(strInsertWords("to take-took-taken", "брать, хватать, взять"));
                tx.executeSql(strInsertWords("to teach-taught-taught", "учить, обучать"));
                tx.executeSql(strInsertWords("to tear-tore-torn", "рвать, отрывать"));
                tx.executeSql(strInsertWords("to tell-told-told", "рассказывать"));
                tx.executeSql(strInsertWords("to think-thought-thought", "думать, мыслить, размышлять"));
                tx.executeSql(strInsertWords("to throw-threw-thrown", "бросать, кидать, метать"));
                tx.executeSql(strInsertWords("to understand-understood-understood", "понимать, постигать"));
                tx.executeSql(strInsertWords("to wake-woke-woken", "просыпаться, будить"));
                tx.executeSql(strInsertWords("to wear-wore-worn", "носить (одежду)"));
                tx.executeSql(strInsertWords("to win-won-won", "победить, выиграть"));
                tx.executeSql(strInsertWords("to write-wrote-written", "писать, записывать"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertRelation("VERB_IRREG"));
                //PHRASES//////////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql(strInsertWords("I''m buzzing to day", "мне сегодня классно"));
                tx.executeSql(strInsertWords("I don''t get what you mean", "Я не понял о чем идет речь"));
                tx.executeSql(strInsertWords("I don''t want my son to...", "Я не хочу, чтобы мой сын ..."));
                tx.executeSql(strInsertWords("contact you", "get hold of you"));
                tx.executeSql(strInsertWords("talk to", "to have a chat with"));
                tx.executeSql(strInsertWords("contacted", "to get in touch with"));
                tx.executeSql(strInsertWords("understand", "to get what you meand"));
                tx.executeSql(strInsertWords("talk too much", "to go on and on"));
                tx.executeSql(strInsertWords("maintained contact", "to stay in touch"));
                tx.executeSql(strInsertWords("apologised", "to say sorry for"));
                tx.executeSql(strInsertWords("disagree", "to have argument about"));
                tx.executeSql(strInsertWords("Have a nice day!", "Приятного дня!"));
                tx.executeSql(strInsertWords("Nice to meet you!", "Приятно познакомиться!"));
                tx.executeSql(strInsertWords("See you late!", "Увидемся позже!"));
                tx.executeSql(strInsertWords("Sleep well!", "Приятного сна!"));
                tx.executeSql(strInsertWords("Good luck!", "Удачи!"));
                tx.executeSql(strInsertWords("I''m afraid I have a complain", "Боюсь у меня есть жалобы"));
                tx.executeSql(strInsertWords("There''s (also) a problem with ...", "Есть проблема с ..."));
                tx.executeSql(strInsertWords("Can you look into it?", "Можете посмотреть в ..."));
                tx.executeSql(strInsertWords("I''m really sorry about that", "Я очень сожалею об этом"));
                tx.executeSql(strInsertWords("We had a problem with...", "У нас была проблема с ..."));
                tx.executeSql(strInsertWords("I''ll look into it", "Я буду смотреть в"));
                tx.executeSql(strInsertWords("They would like a holiday in a hot country", ""));
                tx.executeSql(strInsertWords("Would it be possible to rent car at the airport?", ""));
                tx.executeSql(strInsertWords("Would you be able to get me a ticket?", ""));
                tx.executeSql(strInsertWords("Could you recommend a good doctor?", ""));
                tx.executeSql(strInsertWords("Shall I speak to your teacher about the problem?", ""));
                tx.executeSql(strInsertWords("Do you want me to take that bag for you?", ""));
                tx.executeSql(strInsertWords("Would you like me to find a good restaurant?", ""));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertRelation("PHRASES"));
                //COLLOCATION//////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql(strInsertWords("give instractions", ""));
                tx.executeSql(strInsertWords("give a call", ""));
                tx.executeSql(strInsertWords("give diretions", ""));
                tx.executeSql(strInsertWords("give a talk", ""));
                tx.executeSql(strInsertWords("have a fun (a good time)", ""));
                tx.executeSql(strInsertWords("have an idea", ""));
                tx.executeSql(strInsertWords("have a trouble", ""));
                tx.executeSql(strInsertWords("have a rest (a break)", ""));
                tx.executeSql(strInsertWords("make a choice", ""));
                tx.executeSql(strInsertWords("make a mess", ""));
                tx.executeSql(strInsertWords("make an implrovement (progress)", ""));
                tx.executeSql(strInsertWords("make a profit", ""));
                tx.executeSql(strInsertWords("we did it", "получилось"));
                tx.executeSql(strInsertWords("we made it", "успели"));
                tx.executeSql(strInsertWords("safe to say", "безопасно сказать"));
                tx.executeSql(strInsertWords("tried on", "примерил"));
                tx.executeSql(strInsertWords("take off", "снимать"));
                tx.executeSql(strInsertWords("log off", "выйти"));
                tx.executeSql(strInsertWords("chatted up", "разговорить"));
                tx.executeSql(strInsertWords("dress up", "нарядиться"));
                tx.executeSql(strInsertWords("scroll up", "переместиться на верх"));
                tx.executeSql(strInsertWords("settle down", "обосноваться"));
                tx.executeSql(strInsertWords("dresse down", "снимать одежду"));
                tx.executeSql(strInsertWords("shut down", "выкл. комп"));
                tx.executeSql(strInsertWords("to be tired", "быть занятым, устать"));
                tx.executeSql(strInsertWords("a little over", "чуть более"));
                tx.executeSql(strInsertWords("far less", "гораздо меньше"));
                tx.executeSql(strInsertWords("considerable more that", "значительная более, что"));
                tx.executeSql(strInsertWords("much less then", "гораздо меньше, чем"));
                tx.executeSql(strInsertWords("slightly more that", "немногим более"));
                tx.executeSql(strInsertWords("bad habit", "плохая привычка"));
                tx.executeSql(strInsertWords("to be in a", "когда я спешу"));
                tx.executeSql(strInsertWords("to be patient", "быть терпеливым"));
                tx.executeSql(strInsertWords("to be nosy", "быть навязчивым"));
                tx.executeSql(strInsertWords("cope with", "справиться с чем то"));
                tx.executeSql(strInsertWords("like to read", "люблю читать/привычка"));
                tx.executeSql(strInsertWords("like reading", "люблю читать/информация"));
                tx.executeSql(strInsertWords("same as", "такой же как"));
                tx.executeSql(strInsertWords("similar to", "схожий с, похожий с"));
                tx.executeSql(strInsertWords("to be firm", "быть твердым"));
                tx.executeSql(strInsertWords("to be flexible", "быть гибким"));
                tx.executeSql(strInsertWords("to be sad", "грустить"));
                tx.executeSql(strInsertWords("what is more", "что еще, больше того"));
                tx.executeSql(strInsertWords("get addicted", "привыкать, увлекаются"));
                tx.executeSql(strInsertWords("get into", "попадать кудато ( в )"));
                tx.executeSql(strInsertWords("meet and talk to", "встретиться и поговорить с"));
                tx.executeSql(strInsertWords("to look for", "искать"));
                tx.executeSql(strInsertWords("to dream about, of", "мечтать"));
                tx.executeSql(strInsertWords("to give up", "отказаться"));
                tx.executeSql(strInsertWords("to travel around", "путешествовать"));
                tx.executeSql(strInsertWords("to move to", "перейти"));
                tx.executeSql(strInsertWords("to think about , of", "думать"));
                tx.executeSql(strInsertWords("to go back to", "вернуться"));
                tx.executeSql(strInsertWords("to wait for", "ждать"));
                tx.executeSql(strInsertWords("to listen to", "слушать"));
                tx.executeSql(strInsertWords("to agree with", "соглашаться"));
                tx.executeSql(strInsertWords("to depend on", "зависить"));
                tx.executeSql(strInsertWords("to suffer for, from", "беспокоить"));
                tx.executeSql(strInsertWords("to get married to", "жениться"));
                tx.executeSql(strInsertWords("to worry about", "беспокоиться"));
                tx.executeSql(strInsertWords("to complain to", "пожаловаться"));
                tx.executeSql(strInsertWords("to spend on", "тратить"));
                tx.executeSql(strInsertWords("to belong to", "принадлежать"));
                tx.executeSql(strInsertWords("to be good at", "быть хорошим"));
                tx.executeSql(strInsertWords("to shout at", "кричать на"));
                tx.executeSql(strInsertWords("to be interested in", "быть заинтересованным"));
                tx.executeSql(strInsertWords("to be afraid of", "бояться"));
                tx.executeSql(strInsertWords("account for smth", "объяснять причину"));
                tx.executeSql(strInsertWords("accuse someone of", "обвинять кого либо"));
                tx.executeSql(strInsertWords("add smth to smth", "ставить вместе"));
                tx.executeSql(strInsertWords("agree about/on smth", "соглашаться по каким то вопросам"));
                tx.executeSql(strInsertWords("agree with someone/smth", "соглашаться с кем либо"));
                tx.executeSql(strInsertWords("answer for smth", "отвечать за поступок"));
                tx.executeSql(strInsertWords("apply for smth", "подать заявку"));
                tx.executeSql(strInsertWords("approve for smth", "утвердить"));
                tx.executeSql(strInsertWords("argue about smth", "спорить о чем-то"));
                tx.executeSql(strInsertWords("argue with smb", "спорить c кем-то"));
                tx.executeSql(strInsertWords("arrive in (some city)", "прибывает в (некоторые города)"));
                tx.executeSql(strInsertWords("ask about smb/smth", "спрашивать информацию"));
                tx.executeSql(strInsertWords("ask for smth", "спрашивать "));
                tx.executeSql(strInsertWords("be above smb/smth", "быть выше..."));
                tx.executeSql(strInsertWords("be after", "быть позже указаного времени"));
                tx.executeSql(strInsertWords("handing out with your friends", "проводить время с друзьями"));
                tx.executeSql(strInsertWords("texting your friends - SMS"));
                tx.executeSql(strInsertWords("waste a lot of time", "растрачивать время в пустую"));
                tx.executeSql(strInsertWords("gonna = going to", ""));
                tx.executeSql(strInsertWords("wanna = want to", ""));
                tx.executeSql(strInsertWords("gotta = have got to", ""));
                tx.executeSql(strInsertWords("to be aware", "быть осторожным"));
                tx.executeSql(strInsertWords("make friends", "подружиться"));
                tx.executeSql(strInsertWords("make up your mind", "решиться, принять решение"));
                tx.executeSql(strInsertWords("make a fortune", "сделать состояние (финансы)"));
                tx.executeSql(strInsertWords("make a noise", "шуметь"));
                tx.executeSql(strInsertWords("do a course", "сделать курс"));
                tx.executeSql(strInsertWords("do the  washing-up", "помыть посуды"));
                tx.executeSql(strInsertWords("do me a favour", "сделайте мне одолжение"));
                tx.executeSql(strInsertWords("do my best", "приложить все усилия"));
                tx.executeSql(strInsertWords("do homework", "делать домашнее задание"));
                tx.executeSql(strInsertWords("do research", "делать исследование"));
                tx.executeSql(strInsertWords("do someone a favour", "делать кому-то одолжение"));
                tx.executeSql(strInsertWords("do exercise", "делать упражнения"));
                tx.executeSql(strInsertWords("do a hobby", "заниматься хобби"));
                tx.executeSql(strInsertWords("do well", "хорошо что то сделать"));
                tx.executeSql(strInsertWords("do you best", "показать лучьший результат"));
                tx.executeSql(strInsertWords("do the cleaning", "наводить порядок"));
                tx.executeSql(strInsertWords("do you good", "сделать приятное"));
                tx.executeSql(strInsertWords("do nothing for you", "ничего не делать"));
                tx.executeSql(strInsertWords("go grey", "седеть"));
                tx.executeSql(strInsertWords("go home", "идти домой"));
                tx.executeSql(strInsertWords("go for a drink", "пойти выпить"));
                tx.executeSql(strInsertWords("go off something", "уйти куда либо"));
                tx.executeSql(strInsertWords("go blind", "слепнуть"));
                tx.executeSql(strInsertWords("go crazy", "сходить с ума"));
                tx.executeSql(strInsertWords("go well", "все идет хорошо"));
                tx.executeSql(strInsertWords("go badly", "все идет плохо"));
                tx.executeSql(strInsertWords("go by bus", "ехать автобусом"));
                tx.executeSql(strInsertWords("go on holiday", "ехать отдыхать"));
                tx.executeSql(strInsertWords("go together", "ехать вместе"));
                tx.executeSql(strInsertWords("go with", "ехать с"));
                tx.executeSql(strInsertWords("take a taxi", "взять такси"));
                tx.executeSql(strInsertWords("take part in something", "принять участие в чем-то"));
                tx.executeSql(strInsertWords("take after", "походить на"));
                tx.executeSql(strInsertWords("take responsibility", "взять на себя ответственность"));
                tx.executeSql(strInsertWords("take a photo", "сделать фотографию"));
                tx.executeSql(strInsertWords("take care", "проявить заботу"));
                tx.executeSql(strInsertWords("take a long time", "потребуется много времени"));
                tx.executeSql(strInsertWords("take two tablets a day", "принимать две таблетки в день"));
                tx.executeSql(strInsertWords("take medicine", "принимать лекарство"));
                tx.executeSql(strInsertWords("take sugar", "употреблять сахар"));
                tx.executeSql(strInsertWords("take ten minutes", "получить перерыв"));
                tx.executeSql(strInsertWords("take ages", "взять время (в годах)"));
                tx.executeSql(strInsertWords("take a look", "взглянуть"));
                tx.executeSql(strInsertWords("take the blame", "взьять чьюто вину"));
                tx.executeSql(strInsertWords("get married", "жениться/выйти замуж"));
                tx.executeSql(strInsertWords("get here", "получить здесь"));
                tx.executeSql(strInsertWords("get on with someone", "ладить с кем-то"));
                tx.executeSql(strInsertWords("get angry", "cердиться"));
                tx.executeSql(strInsertWords("get better", "поправиться"));
                tx.executeSql(strInsertWords("get ready", "подготовиться"));
                tx.executeSql(strInsertWords("get on well with someone", "преуспейть с кем-то"));
                tx.executeSql(strInsertWords("get a good salary", "получить хорошую зарплату"));
                tx.executeSql(strInsertWords("get a price", "получить приз"));
                tx.executeSql(strInsertWords("get a job", "получить работу"));
                tx.executeSql(strInsertWords("get a fired", "быть уволенным"));
                tx.executeSql(strInsertWords("get a flu/ a cold", "заболеть грипом/простудиться"));
                tx.executeSql(strInsertWords("get a food poisoning", "получить писчевое отравление"));
                tx.executeSql(strInsertWords("get depressed", "входить в дипрессию"));
                tx.executeSql(strInsertWords("get excited", "получать удовольствие"));
                tx.executeSql(strInsertWords("speak clearly", "говорить четко"));
                tx.executeSql(strInsertWords("answer briefly", "кратко ответить"));
                tx.executeSql(strInsertWords("shake hands firmly", "крепкое рукопожатие"));
                tx.executeSql(strInsertWords("avoid eye contact", "избегать зрительного контакта"));
                tx.executeSql(strInsertWords("What do you need? Please let us know your requirements - Что вам нужно? Пожалуйста, дайте нам знать ваши требования"));
                tx.executeSql(strInsertWords("Thanks for the email of 12 Feb. - Thank you for your email received 12 February. -- Спасибо за письма от 12 февраля - Спасибо за ваше письмо получили 12 февраля."));
                tx.executeSql(strInsertWords("Sorry, I can''t make it. - I am afraid I will not be able to attend. -- К сожалению, я не могу сделать это. - Я боюсь, что не смогут присутствовать."));
                tx.executeSql(strInsertWords("I''m sorry to tell you that - We regret to advise you that... -- Мне очень жаль сообщить вам, что - Мы сожалеем сообщить Вам, что ..."));
                tx.executeSql(strInsertWords("I promise ... - I can assure you that ... -- Я обещаю ... - Я могу заверить вас, что ..."));
                tx.executeSql(strInsertWords("Could you...? - I was wondering if you could -- Не могли бы вы ...? - Мне было интересно, если бы вы могли "));
                tx.executeSql(strInsertWords("You haven''t - We note from our records that you have not... -- Вы должны не - Отметим, из наших записей, что вы не ..."));
                tx.executeSql(strInsertWords("Don''t forgot... - We would you like to remind you that... -- Не забыл ... - Мы хотели бы Вы, чтобы напомнить вам, что ..."));
                tx.executeSql(strInsertWords("I need to -It is necessary for me to... -- Мне нужно, чтобы - Это необходимо для меня, чтобы ..."));
                tx.executeSql(strInsertWords("Shall I ...? - Would you like me to -- Должен ли я ...? - Хотите, чтобы я"));
                tx.executeSql(strInsertWords("But... / Also... / So... - However... / In addition... / Therefore... -- Но ... / Также ... / Так ...  - Однако ... / Кроме того ... / Поэтому ..."));
                tx.executeSql(strInsertWords("Please could you... - I would be grateful if you could... -- Пожалуйста, не могли бы вы ... - Я был бы признателен, если бы могли ..."));
                tx.executeSql(strInsertWords("I''m sorry for... - Please accept our apologies for... -- Я прошу прощения за ...  - Пожалуйста, примите наши извинения за ..."));
                tx.executeSql(strInsertWords("Re... - With regard to... (With reference to) -- Что касается ... (со ссылкой на)"));
                tx.executeSql(strInsertWords("See you next week. - I look forward to meeting you next week. -- Увидимся на следующей неделе. - Я с нетерпением жду встречи с вами на следующей неделе."));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertRelation("COLLOCATION"));
                //IDIOM////////////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql(strInsertWords("spill the beans", "выдавать секрет"));
                tx.executeSql(strInsertWords("top dog", "хозяин положения"));
                tx.executeSql(strInsertWords("small talk", "..."));
                tx.executeSql(strInsertWords("work against the clock", "выполнить работу в короткий промежуток времени"));
                tx.executeSql(strInsertWords("on our mind", "..."));
                tx.executeSql(strInsertWords("be everyone''s cup of tea", "..."));
                tx.executeSql(strInsertWords("close to my heart", "близко сердцу (понимать)"));
                tx.executeSql(strInsertWords("gave someone a hand", "поздороваться"));
                tx.executeSql(strInsertWords("a dark horse", "темная лошадка"));
                tx.executeSql(strInsertWords("put foot in it", "поставить себя в неудобное положение"));
                tx.executeSql(strInsertWords("in hot water", "попасть в неприятности (быть в проблемах)"));
                tx.executeSql(strInsertWords("break the ice", "разрядить обстановку"));
                tx.executeSql(strInsertWords("learn (something) by heart", "выучить наизусть"));
                tx.executeSql(strInsertWords("go window shopping", "ходить по магазинам без цели покупки"));
                tx.executeSql(strInsertWords("travel light", "путешествовать налегке"));
                tx.executeSql(strInsertWords("let your hair down", "отдохнуть (распустить волосы)"));
                tx.executeSql(strInsertWords("be in a mind", "..."));
                tx.executeSql(strInsertWords("Don''t hold your breath", "Держи карман шире! (An expression to tell someone not wait for something)"));
                tx.executeSql(strInsertWords("To get a sinking feeling (To start to tell unhappy about something)"));
                tx.executeSql(strInsertWords("To get into hiding (When someone goes to hidden place for a period of time)"));
                tx.executeSql(strInsertWords("To lay someone off (To dismiss someone from their job, usually for financial reasons)"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertRelation("IDIOM"));
                //TONGUE_TWISTER///////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql(strInsertWords("1 - I think that this is the theme that we thought of together with them on Thursday"));
                tx.executeSql(strInsertWords("2 - We were very very worried where thought of were You were on Wednsday"));
                tx.executeSql(strInsertWords("3 - A very very great rock drowned in a very very rapid river on Friday"));
                //-------------------------------------------------------------------------------------------------------------
                tx.executeSql(strInsertRelation("TONGUE_TWISTER"));
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                tx.executeSql("CREATE INDEX 'ix_value_w' on words ('value_w' ASC);");
                tx.executeSql("DROP VIEW IF EXISTS vRows;");
                tx.executeSql("CREATE VIEW IF NOT EXISTS vRows AS select w.value_w, w.value_w2, t.id as code, t.name, w.id, w.is_checked from words w join relations r on w.id = r.id_words join types t on t.id = r.id_type order by w.value_w;");
                //-------------------------------------------------------------------------------------------------------------    
                window.plugins.toast.showShortBottom("Data was uploaded");
            }
        });
    });
}
