//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var app = express();

// Body Parser Middleware
app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

//Setting up server
var server = app.listen(process.env.PORT || 1025, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

//Initiallising connection string
//    user: 'user_node',
//password: 'user_node',
var dbConfig = {
    user: 'user_node',
    password: 'user_node',
    server: '207.180.244.218',
    port: '1433',
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
                        //var json = rs;
                        //obj = JSON.parse(json);
                        //var json = '{"id": 4,"nf": "1234","data": "2019-04-16 13:12","speech": "MERCADORIA RECEBIDA NO CD"}';
                        //obj = JSON.parse(json);
                        if(rs.length > 0)
                        {
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify({
                            
                                //"speech" : "teste",
                                //"displayText" : "teste2"
                                
                                "speech" : "A posição atual da sua carga é " + rs[0].speech + " em " + rs[0].data,
                                "displayText" : "A posição atual da sua carga é " + rs[0].speech,
                                "nf" : rs[0].nf,
                                "cnpj" : rs[0].cnpj,
                                "data" : rs[0].data
                            })); 
                        }else{
                            res.setHeader('Content-Type', 'application/json');
                            res.send(JSON.stringify({                              
                            "speech" : "Não encontrei essa NF no sistema",
                            "displayText" : ""
                            }));                           
                        }
                    //res.send(rs[0]);
                }
            });
        }
    });
}

//Function to connect to database and execute query
var executeInsertQuery = function (res, query) {
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
                    res.send(JSON.stringify({                              
                    "speech" : "Ocorrência registrada com sucesso",
                    "displayText" : ""
                    })); 
                    //res.send(rs);
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
app.post("/api/consultanf", function (req, res) {
    var query = "select top 1 id id, cnpj cnpj, nf nf,convert(varchar(20),cast(data as smalldatetime),103) data, upper(ocorrencia) speech from tracking where nf=" + req.body.result.parameters.nf + " and cnpj=" + req.body.result.parameters.cnpj + " order by cast(data as smalldatetime) desc,id desc";
    executeQuery(res, query);
});

//POST API
app.post("/api/registraocorrencia", function (req, res) {
    var query = "INSERT INTO tracking (cnpj,nf,data,ocorrencia) VALUES ('" + req.body.result.parameters.cnpj + "','" + req.body.result.parameters.nf + "',convert(date,'" + req.body.result.parameters.data + "',103),upper('" + req.body.result.parameters.ocorrencia + "'))";
    //console.log(query);
    executeInsertQuery(res, query);
});

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