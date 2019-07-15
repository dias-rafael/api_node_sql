//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var app = express();

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
                            linhas.push({
                                "tipo_operacao":rs.recordset[i].tipo_operacao,
                                "codlin":rs.recordset[i].codlin,
                                "codigo_porto_origem":rs.recordset[i].porto_origem,
                                "porto_origem":rs.recordset[i].descri_porto_origem,
                                "uf_porto_origem":rs.recordset[i].estado_porto_origem,
                                "codigo_porto_destino":rs.recordset[i].porto_destino,
                                "porto_destino":rs.recordset[i].descri_porto_destino,
                                "uf_porto_destino":rs.recordset[i].estado_porto_destino,
                                "tarifa_kg":rs.recordset[i].vlrpor_kg || 0,
                                "tarifa_m3":rs.recordset[i].vlrpor_m3 || 0,
                                "taxa_cte":rs.recordset[i].vlrtaxa_cte || 0,
                                "peso_kg_minimo":rs.recordset[i].pesomin_kg || 0,
                                "m3_minimo":rs.recordset[i].m3min || 0,
                                "perc_advalorem_receber":rs.recordset[i].perc_advalorem_receber || 0,
                                "perc_advalorem_pagar":rs.recordset[i].perc_advalorem_pagar || 0,
                                "perc_gris":rs.recordset[i].perc_gris || 0,
                                "total_custo_referencia":rs.recordset[i].vlrcusto_referencia || 0,
                                "frete_peso":rs.recordset[i].vlrfrete_peso || 0,
                                "pedagio":rs.recordset[i].vlrpedagio || 0,
                                "total_adicional":rs.recordset[i].vlradicional || 0,
                                "faixa_inicial_peso":rs.recordset[i].faixapeso_inicial || 0,
                                "faixa_final_peso":rs.recordset[i].faixapeso_final || 0
                            });
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

//GET API
app.get("/api/listalinhas", function (req, res) {
    var query = "select 'FR' tipo_operacao,lin.codlin,lin.porto_origem,lin.descri_porto_origem,lin.estado_porto_origem,lin.porto_destino,lin.descri_porto_destino,lin.estado_porto_destino,tar.vlrpor_kg,tar.vlrpor_m3,tar.vlrtaxa_cte,tar.pesomin_kg,tar.m3min,tar.perc_advalorem_receber,tar.perc_advalorem_pagar,tar.perc_gris,tar.vlrcusto_referencia,tar.vlrfrete_peso,tar.vlrpedagio,tar.vlradicional,tar.faixapeso_inicial,tar.faixapeso_final from db_webcab.dbo.cotacao_tabela_linha_servicos lin inner join db_webcab.dbo.cotacao_tabela_tarifas tar on tar.id_servico = lin.indice where lin.situacao = 'A' and lin.id_tabela = 1 and tar.situacao = 'A' order by lin.codlin";
    executeQuery(res, query);
});