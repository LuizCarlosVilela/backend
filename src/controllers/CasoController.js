
const connection = require("../database/connection");

module.exports = {
  async create(request, response) {
    const { id } = request.body;

    const { nome_paciente, data_ocorrido, hora_ocorrido } = request.body;

    const { rua, bairro, cidade, uf, latitude, longitude } = request.body;

    await connection("casos").insert({
      nome_paciente,
      data_ocorrido,
      hora_ocorrido,
      local_id: 25,
      medico_id: id
    });

    //console.log("Caso ID " + idCaso);

    response.json({ msg: "ok"});
  },
  async select(request, response) {
    const casos = await connection("casos").select("*");

    casos.forEach(async (caso, index) => {
      const { local_id } = caso;
      const [local] = await connection("locais")
        .where("id", local_id)
        .select("*");

      var newC = {
        id: caso.id,
        nome_paciente: caso.nome_paciente,
        data_ocorrido: caso.data_ocorrido,
        hora_ocorrido: caso.hora_ocorrido,
        local,
        medico_id: caso.medico_id,
      };
      casos[index] = newC;
    });

    setTimeout(() => {
      response.json(casos);
    }, 3000);
  },

  async delete(request, response) {
    const { id } = request.params;

    await connection("casos").where("id", id).delete();

    response.json({ msg: "Deletado" });
  },

  async updateCaso(request, response) {
    const { caso_id } = request.body;

    const { local_id } = request.body;

    const { nome_paciente, data_ocorrido, hora_ocorrido } = request.body;

    const { rua, bairro, cidade, uf, latitude, longitude } = request.body;

    await connection("locais").where("id", local_id).update({
      rua,
      bairro,
      cidade,
      uf,
      latitude,
      longitude,
    });

    await connection("casos").where("id", caso_id).update({
      nome_paciente,
      data_ocorrido,
      hora_ocorrido,
    });

    response.json({ msg: "Update feito" });
  },
};
