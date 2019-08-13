const sql = require("mssql");

//Initiallising connection string
var dbConfig = {
    user: '//usuario sql',
    password: '//senha sql',
    server: '//ip sql',
    port: 1433,
    database: '//base sql'
};

exports.showIndex = (req, res, next) => {
    res.send('Running API Simulador Costa Brasil');
}

//Function to connect to database and execute query
exports.getTarifas = (req, res, next) => {
    sql.connect(dbConfig, function (err) {
        if (err) {
            //console.log("Error while connecting database :- " + err);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                "errorcode" : 3,
                "status" : "database connection error"
                }));
            res.send(err);
        }
        else {
            // create Request object
            var request = new sql.Request();
            // query to the database
            const {linha,municipio_origem,municipio_destino} = req.query;
            let where = "";
       
            if (linha) {
               where = "and lin.codlin = '"+ linha + "'";
            }
            if (municipio_origem) {
                where = "and mun_ori.codmun = '"+ municipio_origem + "'";
            }
            if (municipio_destino) {
                where = "and mun_des.codmun = '"+ municipio_destino + "'";
            }
            var query = "select 'FR' tipo_operacao,mun_ori.codmun codigo_municipio_origem,mun_ori.descri municipio_origem,mun_ori.estado uf_municipio_origem,mun_des.codmun codigo_municipio_destino,mun_des.descri municipio_destino,mun_des.estado uf_municipio_destino,lin.codlin,lin.porto_origem,lin.descri_porto_origem,lin.estado_porto_origem,lin.porto_destino,lin.descri_porto_destino,lin.estado_porto_destino,tar.vlrpor_kg,tar.vlrpor_m3,tar.vlrtaxa_cte,tar.pesomin_kg,tar.m3min,tar.perc_advalorem_receber,tar.perc_advalorem_pagar,tar.perc_gris,tar.vlrcusto_referencia,tar.vlrfrete_peso,tar.vlrpedagio,tar.vlradicional,tar.faixapeso_inicial,tar.faixapeso_final from db_webcab.dbo.cotacao_tabela_linha_servicos lin inner join db_webcab.dbo.cotacao_tabela_tarifas tar on tar.id_servico = lin.indice inner join db_webcab.dbo.rodlin rl on rl.codlin = lin.codlin inner join db_webcab.dbo.rodmun mun_ori on mun_ori.coditn = rl.ponini inner join db_webcab.dbo.rodmun mun_des on mun_des.coditn = rl.ponfim where lin.situacao = 'A' and lin.id_tabela = 1 and tar.situacao = 'A' "+ where +" order by lin.codlin";
            //console.log(query);
            request.query(query, function (err, rs) {
                if (err) {
                    //console.log("Error while querying database :- " + err);
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({
                        "errorcode" : 5,
                        "status" : "database querying error"
                        }));
                    res.send(err);
                }
                else {
                    if (rs.recordset.length !== 0) {
                        var linhas = [];
                        rs.recordset.forEach(function(value, i){
                            linhas.push({
                                "tipo_operacao":rs.recordset[i].tipo_operacao,
                                "codlin":rs.recordset[i].codlin,
                                "codigo_municipio_origem":rs.recordset[i].codigo_municipio_origem,
                                "municipio_origem":rs.recordset[i].municipio_origem,
                                "uf_municipio_origem":rs.recordset[i].uf_municipio_origem,
                                "codigo_municipio_destino":rs.recordset[i].codigo_municipio_destino,
                                "municipio_destino":rs.recordset[i].municipio_destino,
                                "uf_municipio_destino":rs.recordset[i].uf_municipio_destino,
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
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({
                            "errorcode" : 0,
                            "linhas" : linhas
                            }));
                    } else {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(JSON.stringify({
                        "errorcode" : 1,
                        "status" : "no routes found"
                        }));
                    }
                }
                sql.close();
            });
        }
    });
}
