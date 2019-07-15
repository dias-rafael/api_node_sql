//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var app = express();

// Body Parser Middleware
//app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

//Setting up server
var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

//Initiallising connection string
var dbConfig = {
    user: 'user_node',
    password: '#4dm!n#2020',
    server: '207.180.244.218',
    port: 1433,
    database: 'db_web'
};

//Function to connect to database and execute query
var executeQuery = function (res, query) {
    sql.connect(dbConfig, function (err) {
        if (err) {
            console.log("Error while connecting database :- " + err);
            res.send(err);
        }
        else {
            // create Request object
            var request = new sql.Request();
            // query to the database
            request.query(query, function (err, rs) {
                if (err) {
                    console.log("Error while querying database :- " + err);
                    res.send(err);
                }
                else {
                    res.setHeader('Content-Type', 'application/json');
                    if (rs.recordset.length !== 0) {
                        var linhas = [];
                        rs.recordset.forEach(function(value, i){
                            linhas.push({"codlin":rs.recordset[i].CODLIN});
                        })
                        res.send(JSON.stringify({
                            "errorcode" : 0,
                            "linhas" : linhas
                            }));
                    } else {
                        res.send(JSON.stringify({
                        "errorcode" : 1,
                        "status" : "Nenhuma linha encontrada"
                        }));
                    }
                    sql.close();
                }
            });
        }
    });
}

/*
//GET API
app.get("/api/listaocorrencias", function (req, res) {
    var query = "select id id, cnpj cnpj, nf nf,convert(varchar(20),cast(data as smalldatetime),103) data, ocorrencia speech from tracking";
    executeQuery(res, query);
});
*/

//GET API
app.get("/api/listalinhas", function (req, res) {
    var query = "select * from db_webcab.dbo.cotacao_tabela_linha_servicos where situacao = 'A' and id_tabela = 1 order by codlin";
    executeQuery(res, query);
});

/*
//POST API
app.post("/api/registraocorrencia", function (req, res) {
    var query = "INSERT INTO tracking (cnpj,nf,data,ocorrencia) VALUES ('" + req.body.result.parameters.cnpj + "','" + req.body.result.parameters.nf + "',convert(date,'" + req.body.result.parameters.data + "',103),upper('" + req.body.result.parameters.ocorrencia + "'))";
    //console.log(query);
    executeInsertQuery(res, query);
});
*/

/*
//PUT API
app.put("/api/user/:id", function (req, res) {
    var query = "UPDATE teste_node SET nome= '" + req.query.nome + "' , preco= '" + req.query.preco + "' WHERE Id= " + req.params.id;
    //console.log(query);
    executeQuery(res, query);
});

//DELETE API
app.delete("/api/user/:id", function (req, res) {
    var query = "DELETE FROM teste_node WHERE Id=" + req.params.id;
    //console.log(query);
    executeQuery(res, query);
});
*/