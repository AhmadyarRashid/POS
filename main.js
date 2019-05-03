const electron = require('electron');
const path = require('path');
const url = require('url');
var mysql = require('mysql');
const mysqlDump = require('mysqldump');
var printer = require('node-thermal-printer');
var fs = require('fs');
// SET ENV
process.env.NODE_ENV = 'production';
let cid;

const {app, BrowserWindow, Menu, ipcMain} = electron;

let loginWindow;
let mainWindow;
let addWindow;
let addItemWindow;
let saleWindow;
let billWindow;
let billDetailWindow;
let addCusWindow;
let notificationWindow;


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: null,
    database: 'atoshop'
});


// Listen for app to be ready
app.on('ready', function () {

    connection.connect(function (err) {
        if (err) {
            console.log(err.code);
            console.log(err.fatal);
            console.log('unable to connect db');
            app.quit();
        } else {

        }
    });

    // Create new window
    loginWindow = new BrowserWindow({
        width: 500,
        height: 400,
        title: 'Login Window'
    });
    loginWindow.setMenu(null);
    // Load html in window
    loginWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'loginWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    loginWindow.center();
    loginWindow.setMaximizable(false);
});

function openMainWindow(cid) {
    if (cid !== undefined || cid > 0) {

        // Create new window
        mainWindow = new BrowserWindow({
            width: 1300,
            height: 800
        });
        // Load html in window
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'mainWindow.html'),
            protocol: 'file:',
            slashes: true
        }));

        mainWindow.maximize();


        $getAllItems = `SELECT * from items where cid = ${cid} ORDER BY id DESC`;

        connection.query($getAllItems, function (err1, rows1, fields1) {
            if (err1) {
                console.log("An error ocurred performing the query.");
                console.log(err1);
                return;
            }
            // console.log('after get data res ', rows1);
            if (rows1.length > 0) {
                // console.log('data exists', rows1[0]);
                setTimeout(() => {
                    mainWindow.webContents.send('mainHtml:sendAllData', rows1);
                }, 2000);
            } else {

            }


        });


        // Quit app when closed
        mainWindow.on('closed', function () {
            mainWindow = null;
        });

        // Build menu from template
        const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
        // Insert menu
        Menu.setApplicationMenu(mainMenu);
    }
}

function openSaleWindow() {
    saleWindow = new BrowserWindow({});

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'saleWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    saleWindow.maximize();

}

function addInventoryItem() {
    addItemWindow = new BrowserWindow({});

    addItemWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addItemWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    addItemWindow.setMenu(null);

    addItemWindow.on('close', function () {
        addItemWindow = null;
    });

}


function GeneratePrintedBill(data) {
    //console.log('enter in bill function ------------- : ', data);
    data = parseInt(data);
    // data = 174;
    if (data) {
        $getBillDetails = `SELECT DISTINCT s.SerialNo,s.Model, s.quantity,s.saleType as saleType ,d.billid, s.id as itemId ,s.description,s.unit_price, s.price,d.amount,d.paid,d.pending, d.dis as discount,d.date ,d.cid as customerId from 
                     (SELECT  i.id,i.Model,i.description,i.unit_price,s.quantity , s.saleType,s.SerialNo, s.price from sales as s INNER JOIN items as i WHERE i.id = s.itemid AND s.saleid in (SELECT bd.sid from bill as b INNER JOIN billdes as bd WHERE b.billid = bd.bid and b.billid = ${data} )) as s INNER JOIN
                     (SELECT b.cid,b.dis,b.billid, b.date,b.amount,b.paid,bd.sid,b.pending from bill as b INNER JOIN billdes as bd WHERE b.billid = bd.bid and b.billid = ${data}) as d;`;
        connection.query($getBillDetails, function (err, rows, fields) {
            if (err) {
                console.log(err);
                return;
            }
            // console.log('in generate Bill ------------------ : ', rows);
            //console.log('customer Id is = ', rows[0]['customerId']);
            $customerInfoQuery = `SELECT * from customer WHERE cusid = ${rows[0]['customerId']}`;
            connection.query($customerInfoQuery, function (e, rowCus, field) {
                if (e) {
                    console.log(e);
                    return;
                }
                setTimeout(() => {
                    billDetailWindow.webContents.send('billDetail:cusInfo', rowCus);
                }, 1200);
            });
            billDetailWindow = new BrowserWindow({});
            billDetailWindow.maximize();
            billDetailWindow.setMenu(null);
            billDetailWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'billDetailWindow.html'),
                protocol: 'file:',
                slashes: true
            }));


            billDetailWindow.on('close', function (e) {
                mainWindow.webContents.send('BillSaveSubmit', 'Bill Print Sucessfully');
                billDetailWindow = null;
            });

            $getCompanyInfo = `select * from company where cid = ${cid}`;
            connection.query($getCompanyInfo, function (e, rowsCom, field) {
                if (err) {
                    console.log(err);
                    return;
                }
                setTimeout(() => {
                    billDetailWindow.webContents.send('billDetail:sendBillDetails', rows);
                    billDetailWindow.webContents.send('billDetail:sendCompanyInfo', rowsCom);

                }, 1000);
            })


        })
    }
}

function generateBill(res) {
    billWindow = new BrowserWindow({});

    billWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'billWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    billWindow.on('close', function (e) {
        billWindow = null;
    });
}

function editItemWindow(id) {
    addItemWindow = new BrowserWindow({});

    addItemWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addItemWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    addItemWindow.on('close', function () {
        addItemWindow = null;
    });

    addItemWindow.setMenu(null);

    $getItem = `SELECT * from items WHERE id = ${id}`;

    setTimeout(() => {
        connection.query($getItem, function (e, rows, fields) {
            if (e) {
                console.log(e);
                return;
            }
            console.log('get data sucessfully', rows);
            addItemWindow.webContents.send('addWindow:editData', rows[0]);
        });

    }, 1000);

}

ipcMain.on('searchCus', function (e, item) {

    //$Items = `SELECT * from items where id = ${item} or description = ${item}`;


    var sql = "SELECT * FROM customer";
    var inserts = [];
    sql = mysql.format(sql, inserts);
    connection.query(sql, function (error, results, fields) {
        // if (error) throw error;
        // console.log(results.insertId);
        if (error) {
            console.log("An error ocurred performing the query.");
            console.log(error);
            return;
        }
        saleWindow.webContents.send('resultCus', results);
    });

})

ipcMain.on('addCustomer', function (e) {
    addCusWindow = new BrowserWindow({});

    addCusWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addCusWindow.html'),
        protocol: 'file',
        slashes: true
    }));
    addCusWindow.setMenu(null);

    addCusWindow.on('close', function () {
        addCusWindow = null;
    });
});

ipcMain.on('addcustomerData', function (e, s) {

    //console.log(res);
    Cname = s['name'];
    email = s['email'];
    address = s['address'];
    phone = s['phone'];

    $checkCustomer = `SELECT * from customer WHERE name = '${Cname}'`;
    connection.query($checkCustomer, function (e, row, fields) {
        if (e) {
            console.log(e);
            return;
        }
        if (row.length == 0) {
            connection.query('INSERT INTO customer SET ?', {
                name: Cname,
                address: address,
                email: email,
                phone: phone,
                pending: 0
            }, function (error, results, fields) {
                // if (error) throw error;
                // console.log(results.insertId);
                if (error) {
                    console.log("An error ocurred performing the query.");
                    console.log(err1);
                    return;
                }
                mainWindow.webContents.send('RefreshSaleTvb', Cname);
                console.log('data insert sucessfully');
                addCusWindow.close();
                addCusWindow = null;
            });
        } else {
            addCusWindow.webContents.send('addCusError', 'User Name is already Exist.Please Enter other one.');
        }
    })
});


ipcMain.on('main:refreshData', function (e, data) {
    // console.log(data);
    $getAllItems = `SELECT * from items where cid = ${cid}`;

    connection.query($getAllItems, function (err1, rows1, fields1) {
        if (err1) {
            console.log("An error ocurred performing the query.");
            console.log(err1);
            return;
        }
        // console.log('after get data res ' , rows1);
        if (rows1.length > 0) {
            // console.log('data exists' , rows1);
            mainWindow.webContents.send('mainHtml:sendAllData', rows1);
        } else {

        }


    });
});


// Catch login:validator
ipcMain.on('login:auth', function (e, res) {
    console.log(res);

    $query = "SELECT * FROM user where email = '" + res['email'] + "' and password = '" + res['pass'] + "'";
    let uid = -1;
    connection.query($query, function (err, rows, fields) {
        if (err) {
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }
        // openMainWindow();
        // openMainWindow();
        // loginWindow.close();
        // loginWindow = null;
        if (rows[0] == undefined) {
            // console.log('email ur password are wrong');
            loginWindow.webContents.send('loginSms', 'User and Password is wrong');
            return;
        }
        // console.log(rows[0]);
        uid = rows[0]['uid'];
        // console.log(uid);

        if (uid > 0) {
            // get company id
            $queryTogetCid = `SELECT DISTINCT cid from company where uid in (SELECT uid from user where user.uid = ${uid})`;
            connection.query($queryTogetCid, function (err1, rows1, fields1) {
                if (err1) {
                    console.log("An error ocurred performing the query.");
                    console.log(err1);
                    return;
                }
                // console.log(rows1);
                if (rows1.length > 0) {
                    cid = rows1[0]['cid'];
                    openMainWindow(rows1[0]['cid']);
                    loginWindow.close();
                    loginWindow = null;
                }


            });
        } else {
            // open company info login
            console.log('no company registered');
        }

    });


});

// get bill detail
ipcMain.on('main:getBillDetail', function (e, data) {
    // console.log(data);

    $getBillDetail = `SELECT DISTINCT s.quantity,s.saleType as saleType ,d.billid, s.id as itemId ,s.description,s.unit_price,d.amount,d.paid,d.pending, d.dis as discount,d.date ,d.cid as customerId from 
                     (SELECT  i.id,i.description,i.unit_price,s.quantity , s.saleType from sales as s INNER JOIN items as i WHERE i.id = s.itemid AND s.saleid in (SELECT bd.sid from bill as b INNER JOIN billdes as bd WHERE b.billid = bd.bid and b.billid = ${data} )) as s INNER JOIN
                     (SELECT b.cid,b.dis,b.billid, b.date,b.amount,b.paid,bd.sid,b.pending from bill as b INNER JOIN billdes as bd WHERE b.billid = bd.bid and b.billid = ${data}) as d;`;
    connection.query($getBillDetail, function (err, rows, fields) {
        if (err) {
            console.log(err);
            return;
        }

        $customerInfoQuery = `SELECT * from customer WHERE cusid = ${rows[0]['customerId']}`;
        connection.query($customerInfoQuery, function (e, rowCus, field) {
            if (e) {
                console.log(e);
                return;
            }
            setTimeout(() => {
                billDetailWindow.webContents.send('billDetail:cusInfo', rowCus);
            }, 1200);
        });
        billDetailWindow = new BrowserWindow({});
        billDetailWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'billDetailWindow.html'),
            protocol: 'file:',
            slashes: true
        }));


        billDetailWindow.on('close', function (e) {
            billDetailWindow = null;
        });

        $getCompanyInfo = `select * from company where cid = ${cid}`;
        connection.query($getCompanyInfo, function (e, rowsCom, field) {
            if (err) {
                console.log(err);
                return;
            }
            setTimeout(() => {
                billDetailWindow.webContents.send('billDetail:sendBillDetails', rows);
                billDetailWindow.webContents.send('billDetail:sendCompanyInfo', rowsCom);

            }, 1000);
        })


    })
});


// save next btn in add item
ipcMain.on('SaveNextaddInventoryItem', function (e, res) {
    sn = '';
    codeP = res['codeP'];
    des = res['des'];
    date = res['date'];
    items = res['items'];
    up = res['unitPrice'];
    model = res['model'];

    //  console.log('date formate is  = ', date);

    $itemExist = `SELECT * from items WHERE Model = '${model}'`;
    connection.query($itemExist, function (e, res, field) {
        if (e) {
            console.log(e);
            return;
        }
        //console.log(res);
        if (res.length == 0) {
            connection.query('INSERT INTO items SET ?', {
                cid: cid,
                serial_no: sn,
                description: des,
                items: items,
                unit_price: up,
                date: date,
                CodeP: codeP,
                Model: model
            }, function (error, results, fields) {
                // if (error) throw error;
                // console.log(results.insertId);
                if (error) {
                    console.log("An error ocurred performing the query.");
                    console.log(error);
                    return;
                }
                // console.log('data insert sucessfully');

                refresAllItems();
                addItemWindow.webContents.send('AddItemNextRes', 'Sucess');

            });
        }
        if (res.length > 0) {
            addItemWindow.webContents.send('AddItemSms', `Model ${model} already exists.`);
        }
    });
})

//cancel add item window
ipcMain.on('cancelAddItemWindow', function (e, data) {
    addItemWindow.close();
    addItemWindow = null;
});
//catch add:item
ipcMain.on('addInventoryItem', function (e, res) {
    sn = '';
    codeP = res['codeP'];
    des = res['des'];
    date = res['date'];
    items = res['items'];
    up = res['unitPrice'];
    model = res['model'];


    $itemExist = `SELECT * from items WHERE Model = '${model}'`;
    connection.query($itemExist, function (e, res, field) {
        if (e) {
            console.log(e);
            return;
        }
        //console.log(res);
        if (res.length == 0) {
            connection.query('INSERT INTO items SET ?', {
                cid: cid,
                serial_no: sn,
                description: des,
                items: items,
                unit_price: up,
                date: date,
                CodeP: codeP,
                Model: model
            }, function (error, results, fields) {
                if (error) {
                    console.log("An error ocurred performing the query.");
                    console.log(error);
                    return;
                }
                // console.log('data insert sucessfully');

                refresAllItems();
                addItemWindow.close();
                addItemWindow = null;

            });
        }
        if (res.length > 0) {
            addItemWindow.webContents.send('sendNotify', `Model : ${model} already exists.`);
        }
    })

});

ipcMain.on('Edit:addInventoryItem', function (e, res) {
    sn = '';
    codeP = res['codeP'];
    des = res['des'];
    date = res['date'];
    items = res['items'];
    up = res['unitPrice'];
    model = res['model'];

    $updateData = `UPDATE items SET  description = '${des}', items = ${items}, unit_price = ${up}, date = '${date}', CodeP = '${codeP}' WHERE Model = '${model}'`;
    connection.query($updateData, function (erroru, rowsu, fieldsu) {
        if (erroru) {
            console.log(erroru);
            return;
        }
        refresAllItems();
        addItemWindow.close();
        addItemWindow = null;

    })
});

ipcMain.on('report:getSummary', function (e, data) {
    console.log('======== report button event =========')

    getTotalItems();
    getCashSale();
    getCustomerSale();

})

async function getTotalItems() {

    $summary = 'SELECT SUM(items) as totalItems from items';
    connection.query($summary, function (err, rows, field) {
        if (err)
            return
        else {
            mainWindow.send('main:totalItems', rows[0]);
        }
    })

}

async function getCashSale() {

    $cashSale = `SELECT SUM(paid) as cashSale from bill WHERE billid IN (SELECT bid  from billdes WHERE sid IN (SELECT saleid from sales WHERE saleType = 'Cash Sale'))`
    connection.query($cashSale, function (err, rows, field) {
        if (err)
            return
        else {
            console.log(rows)
            mainWindow.send('main:cashSale', rows[0]);
        }
    })


}

async function getCustomerSale() {

    $customerSale = `SELECT SUM(paid) as customerSale from bill WHERE billid IN (SELECT bid  from billdes WHERE sid IN (SELECT saleid from sales WHERE saleType != 'Cash Sale'))`;
    connection.query($customerSale, function (err, rows, field) {
        if (err)
            return
        else {
            console.log(rows)
            mainWindow.send('main:customerSale', rows[0]);
        }
    })


}


function refresAllItems() {
    $getAllItems = `SELECT * from items where cid = ${cid} ORDER BY id DESC`;
    connection.query($getAllItems, function (err1, rows1, fields1) {
        if (err1) {
            console.log("An error ocurred performing the query.");
            console.log(err1);
            return;
        }
        // console.log('after get data res ' , rows1);
        if (rows1.length > 0) {
            // console.log('data exists' , rows1);
            mainWindow.webContents.send('mainHtml:sendAllData', rows1);

        } else {

        }


    });
}

// Catch item:add
ipcMain.on('item:add', function (e, item) {
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
    // Still have a reference to addWindow in memory. Need to reclaim memory (Grabage collection)
    addWindow = null;
});

// when addbtn btn click listener main:addbtn
ipcMain.on('main:addbtn', function (e, txt) {
    // console.log(txt);
    addInventoryItem();
});

ipcMain.on('main:bill', function (e, res) {
    // console.log(res);
    generateBill(res);
});

ipcMain.on('bill:searchBill', function (e, res) {
    searchBill(res);
});

// when logout btn click listener
ipcMain.on('main:logout', function (e) {
    // console.log('logoutbtn pressed');
    logoutBtn();
});

// when sale btn click listener
ipcMain.on('main:sale', function (e) {
    // console.log('sale pressed');
    sale();
});

ipcMain.on('main:searchItem', function (e, data) {
    // console.log('search on keyup in main.js');
    if (data == 'showUnfill') {
        $searchItem = `SELECT * FROM items WHERE  CodeP = '' OR description = '' OR items = 0 OR unit_price = 0  ORDER BY id DESC`;
        connection.query($searchItem, function (err, rows, field) {
            if (err) {
                console.log(err);
                return;
            }
            // console.log(rows);

            mainWindow.webContents.send('mainHtml:sendAllData', rows);
        })
    } else {
        $searchItem = `SELECT * FROM items WHERE  CodeP LIKE '%${data}%' OR description LIKE '%${data}%' OR Model LIKE '%${data}%' ORDER BY id DESC`;
        connection.query($searchItem, function (err, rows, field) {
            if (err) {
                console.log(err);
                return;
            }
            // console.log(rows);

            mainWindow.webContents.send('mainHtml:sendAllData', rows);
        })
    }

});

ipcMain.on('main:delItem', function (e, data) {
    $delQuery = `DELETE FROM items WHERE id = ${data}`;
    connection.query($delQuery, function (err, rows, field) {
        if (err) {
            console.log(err);
            mainWindow.webContents.send('delItemError', `Transacted Item cannot delete`);
            return;
        }
        refresAllItems();
        mainWindow.webContents.send('mainWindow:delSucess', 'Done');
    });
});

ipcMain.on('main:editItem', function (e, data) {
    editItemWindow(data);
});


//===================Sale Events=====================
ipcMain.on('getAllCustomer', function (e, data) {
    $getCustomer = `SELECT name from customer`;
    connection.query($getCustomer, function (err, rows, fields) {
        if (err) {
            console.log(err);
            return;
        }
        mainWindow.webContents.send('sendAllCusName', rows);
    })
});

ipcMain.on('saleItemSearch', function (e, data) {
    // console.log(data);
    $searchItem = `SELECT * FROM items WHERE id LIKE '%${data}%' OR serial_no LIKE '%${data}%' OR description LIKE '%${data}%'`;
    connection.query($searchItem, function (err, rows, field) {
        if (err) {
            console.log(err);
            return;
        }
        // console.log(rows);

        mainWindow.webContents.send('SendItemTOLeftSale', rows);
    })
})

ipcMain.on('SaveBill', function (e, data) {
    //console.log(data);
    // BillId = 0;
    $billQuery = `INSERT INTO bill (cid,amount,paid,pending,dis,date,comment) VALUES (${data.Cid},${data.Amount},${data.Paid},${((Number(data.Amount)) - Number(data.Discount)) - Number(data.Paid)},${data.Discount},'${data.Detail[0].Date}','${data.Comment}');`;
    connection.query($billQuery, function (e, Brows, field) {
        if (e) {
            console.log(e);
            return;
        }


        // BillId = Brows.insertId;
        for (var index in data.Detail) {
            // console.log(data.Detail[index]);
            obj = data.Detail[index];
            $saleQuery = `INSERT INTO sales (itemid,date,price,quantity,saleType,SerialNo) VALUES (${parseInt(obj.Id)},'${obj.Date}',${parseInt(obj.Price)},${obj.Qty},'${data.SaleType}','${obj.SerialNo}')`;
            connection.query($saleQuery, function (e, rows, field) {
                if (e) {
                    console.log(e);
                    return;
                }


                //========== insert in Bill des ==================
                $insertBillDes = `INSERT INTO billdes (bid,sid) VALUES (${Brows.insertId},${rows.insertId})`;
                connection.query($insertBillDes, function (e, data) {
                    if (e) {
                        console.log(e);
                        return;
                    }

                });


            });

            //========== update Item in items Table============
            $updateItem = `UPDATE items as i SET  i.items = i.items - ${obj.Qty}  WHERE i.id =${obj.Id};`;
            connection.query($updateItem, function (e, rows) {
                if (e) {
                    console.log(e);
                    return;
                }
            });

        }

        if (data.Cid !== 0) {
            $updateCusInfo = `UPDATE customer SET pending = ${((Number(data.Amount)) - Number(data.Discount)) - Number(data.Paid)} WHERE cusid = ${data.Cid};`;
            connection.query($updateCusInfo, function (e, r) {
                if (e) {
                    console.log(e);
                    return;
                }

            })
        }

        // console.log(BillId);
    });


    console.log('Bill Save Sucessfully');
    mainWindow.webContents.send('BillSaveSubmit', 'Bill Save Sucessfully');


});


ipcMain.on('SaveAndPrintbill', function (e, data) {
    $billQuery = `INSERT INTO bill (cid,amount,paid,pending,dis,date,comment) VALUES (${data.Cid},${data.Amount},${data.Paid},${((Number(data.Amount)) - Number(data.Discount)) - Number(data.Paid)},${data.Discount},'${data.Detail[0].Date}','${data.Comment}');`;
    connection.query($billQuery, function (e, Brows, field) {
        if (e) {
            console.log(e);
            return;
        }

        // BillId = Brows.insertId;
        for (var index in data.Detail) {
            // console.log(data.Detail[index]);
            obj = data.Detail[index];
            $saleQuery = `INSERT INTO sales (itemid,date,price,quantity,saleType,SerialNo) VALUES (${parseInt(obj.Id)},'${obj.Date}',${parseInt(obj.Price)},${obj.Qty},'${data.SaleType}','${obj.SerialNo}')`;
            connection.query($saleQuery, function (e, rows, field) {
                if (e) {
                    console.log(e);
                    return;
                }

                //========== insert in Bill des ==================
                $insertBillDes = `INSERT INTO billdes (bid,sid) VALUES (${Brows.insertId},${rows.insertId})`;
                connection.query($insertBillDes, function (e, data) {
                    if (e) {
                        console.log(e);
                        return;
                    }
                });
            });

            //========== update Item in items Table============
            $updateItem = `UPDATE items as i SET  i.items = i.items - ${obj.Qty}  WHERE i.id =${obj.Id};`;
            connection.query($updateItem, function (e, rows) {
                if (e) {
                    console.log(e);
                    return;
                }
            });

        }

        if (data.Cid !== 0) {
            $updateCusInfo = `UPDATE customer SET pending = ${((Number(data.Amount)) - Number(data.Discount)) - Number(data.Paid)} WHERE cusid = ${data.Cid};`;
            connection.query($updateCusInfo, function (e, r) {
                if (e) {
                    console.log(e);
                    return;
                }

            })
        }

        //console.log(Brows.insertId);
        mainWindow.webContents.send('PrintBillHtml', Brows.insertId);
        setTimeout(() => {
            GeneratePrintedBill(Brows.insertId);
        }, 1500);

        // console.log(BillId);
    });


    console.log('Save & Print Sucessfully');

    // mainWindow.webContents.send('BillSaveSubmit', 'Bill Save Sucessfully');


});

ipcMain.on('getCustomerBalance', function (e, data) {
    console.log('Enter in get Cus Bal', data);
    $getCusInfo = `SELECT cusid,pending from customer WHERE name = '${data}';`;
    connection.query($getCusInfo, function (e, rows, fields) {
        if (e) {
            console.log(e);
            return;
        }
        console.log('Result :', rows);
        mainWindow.webContents.send('SendCusIDPend', rows);
    })
});

// sale item serach
ipcMain.on('sale:saleItemSearch', function (e, data) {
    //console.log('sale Item = ', data);
    $GetItemsquery = `SELECT id, description, Model,items FROM items where description LIKE '%${data}%' or Model LIKE '%${data}%'`;
    connection.query($GetItemsquery, function (e, rows, field) {
        if (e) {
            console.log(e);
            return;
        }
        mainWindow.webContents.send('Sale:sendItems', rows);
    })
});

ipcMain.on('getItemsFromDb', function (e, data) {
    $GetItemsquery = `SELECT id, description, Model,items FROM items`;
    connection.query($GetItemsquery, function (e, rows, field) {
        if (e) {
            console.log(e);
            return;
        }
        mainWindow.webContents.send('Sale:sendItems', rows);
    })
});

ipcMain.on('main:getItemDetail', function (e, data) {
    if (data) {
        $itemDetailQ = `SELECT * FROM items WHERE id = '${data}'`;
        connection.query($itemDetailQ, function (e, row) {
            if (e) {
                console.log(e);
                return;
            }
            mainWindow.webContents.send('Sale:sendItemDetail', row);
        })
    }
});


// calculate next bill id
ipcMain.on('getBillId', function (e, data) {
    $query = `SELECT max(billid) as billNo from bill`;
    connection.query($query, function (e, row) {
        if (row.length > 0) {
            mainWindow.webContents.send('sendPredictedBillId', row);
        }
    })
});

// ====================== bill window socket listener ===============
ipcMain.on('main:getAllBillId', function (e, data) {
    if (data) {
        $getCustomerId = `SELECT cusid from customer WHERE name = '${data['cusType']}'`;
        connection.query($getCustomerId, function (e, rows) {
            if (e) {
                console.log(e);
                return;
            }
            if (rows.length == 0) {
                $billDetail = `SELECT billid from bill WHERE cid = 0 AND date BETWEEN '${data['fromD']}' AND '${data['toD']}'`;
                connection.query($billDetail, function (e, rowBD, fields) {
                    if (e) {
                        console.log(e);
                        return;
                    }
                    mainWindow.webContents.send('main:sendBilldetail', rowBD);
                })
            } else {
                $billDetail = `SELECT billid from bill WHERE cid = ${rows[0]['cusid']} AND date BETWEEN '${data['fromD']}' AND '${data['toD']}'`;
                connection.query($billDetail, function (e, rowBD, fields) {
                    if (e) {
                        console.log(e);
                        return;
                    }
                    mainWindow.webContents.send('main:sendBilldetail', rowBD);
                })
            }
        })
    }
})

ipcMain.on('main:getAllBillDetail', function (e, data) {
    if (data) {
        $billDetail = `SELECT DISTINCT s.SerialNo,s.Model,s.items as Stock,s.CodeP as Code , s.quantity,s.price, s.id as itemId ,s.description,s.unit_price,d.amount,d.paid,d.pending, d.dis as discount from 
                     (SELECT  i.id,i.Model,i.CodeP,i.description,i.items,i.unit_price,s.quantity , s.saleType,s.SerialNo,s.price from sales as s INNER JOIN items as i WHERE i.id = s.itemid AND s.saleid in (SELECT bd.sid from bill as b INNER JOIN billdes as bd WHERE b.billid = bd.bid and b.billid = ${data} )) as s INNER JOIN
                     (SELECT b.dis, b.date,b.amount,b.paid,bd.sid,b.pending from bill as b INNER JOIN billdes as bd WHERE b.billid = bd.bid and b.billid = ${data}) as d`;
        connection.query($billDetail, function (e, r, f) {
            if (e) {
                console.log(e);
                return;
            }
            mainWindow.webContents.send('billWindow:billDetails', r);
        })
    }
});

ipcMain.on('mainjs:updateBill', function (e, data) {
    if (data) {
        $updateBill = `UPDATE bill SET paid = ${data['paid']} , dis = ${data['dis']}, pending = ${Number(data['totalAmt']) - (Number(data['dis']) + Number(data['paid']))} WHERE billid = ${data['billId']}`;
        connection.query($updateBill, function (e, r, f) {
            if (e) {
                console.log(e);
                return;
            }


            $updateCusBal = `UPDATE customer SET pending = ${Number(data['totalAmt']) - (Number(data['dis']) + Number(data['paid']))} WHERE name = '${data['cusName']}'`;
            connection.query($updateCusBal, function (e, r, f) {
                if (e) {
                    console.log(e);
                    return;
                }

                GeneratePrintedBill(data['billId']);
            })

        })
    }
})

//==================== back up window =============

function takeBackUp() {
    try {
        mysqlDump({
            connection: {
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'atoshop'
            },
            dumpToFile: `./backup/${new Date().toDateString()}.sql`
        });


    } catch (e) {
        console.log(e);
    }
}

function showBackupWindow() {
    takeBackUp();

    notificationWindow = new BrowserWindow({});
    notificationWindow.maximize();
    notificationWindow.setMaximizable(false);
    notificationWindow.setMinimizable(false);
    notificationWindow.setClosable(false);
    notificationWindow.setMenu(null);


    notificationWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'notificationWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    notificationWindow.on('close', function () {
        notificationWindow = null;
    });

    setTimeout(() => {
        notificationWindow.setClosable(true);
        notificationWindow.close();
        notificationWindow = null;
        mainWindow.send('delItemError', 'Backup Created Sucessfully');
    }, 6500);
}


// ===================================================================
// create login menu template
const loginMenuTemplate = []

// Create menu template
const mainMenuTemplate = [
    // Each object is a dropdown
    {
        label: 'Menu',
        submenu: [
            {
                label: 'Add New',
                accelerator: process.platform == 'darwin' ? 'Command+A' : 'Alt+A',
                click() {
                    if (addItemWindow == null) {
                        addInventoryItem();
                    } else {
                        addItemWindow.webContents.send('sendNotify', 'Add New Window is already open');
                    }
                }
            },
            {
                label: 'Backup',
                click() {
                    if (notificationWindow == null) {
                        showBackupWindow();
                    } else {
                    }

                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Alt+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

// If OSX, add empty object to menu
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

// Add developer tools option if in dev
if (process.env.NODE_ENV !== 'production') {
    loginMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                role: 'reload',
                accelerator: process.platform == 'darwin' ? 'Command+R' : 'Ctrl+R',
            },
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    });

    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                role: 'reload'
            },
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    });
}