const TronWeb = require("tronweb");

//Tronweb örneği
const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",
  privateKey: "",
});

export const newAccount = () => {
  return tronWeb
    .createAccount()
    .then((result) => {
      return result; // Sonucu döndürün
    })
    .catch((err) => {
      console.error("Hata: ", err);
      throw err; // Hataları yönetin
    });
};
