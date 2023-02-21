function getDateNow() {
    const dateNow = new Date()
        .toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
        .replace(/[:/]+/g, "-")
        .replace(",", "")
        .replace(" ", "H");

    return dateNow;
}

module.exports = getDateNow;