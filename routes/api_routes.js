const express = require('express');
const controller = require('../controller/api_controller');
const router = express.Router();
const auth = require('./auth');

//GET API
router.get('/', auth.required, controller.showIndex);

router.get("/api/listalinhas", auth.required, function (req, res) {
    var query = "select 'FR' tipo_operacao,lin.codlin,lin.porto_origem,lin.descri_porto_origem,lin.estado_porto_origem,lin.porto_destino,lin.descri_porto_destino,lin.estado_porto_destino,tar.vlrpor_kg,tar.vlrpor_m3,tar.vlrtaxa_cte,tar.pesomin_kg,tar.m3min,tar.perc_advalorem_receber,tar.perc_advalorem_pagar,tar.perc_gris,tar.vlrcusto_referencia,tar.vlrfrete_peso,tar.vlrpedagio,tar.vlradicional,tar.faixapeso_inicial,tar.faixapeso_final from db_webcab.dbo.cotacao_tabela_linha_servicos lin inner join db_webcab.dbo.cotacao_tabela_tarifas tar on tar.id_servico = lin.indice where lin.situacao = 'A' and lin.id_tabela = 1 and tar.situacao = 'A' order by lin.codlin";
    controller.executeQuery(res, query);
});

module.exports = router;