const fs = require("fs");
const {v4: uuidv4} = require('uuid');
const regex = /\b(?:companyName|profession|fullName|charter)\b/gi

class XmlGeneratorService {
  generateWorldDocument (companyName, profession, fullName, charter) {
    return new Promise((resolve, reject) => {
      fs.readFile(
        `./static/example-document.txt`,
        "utf-8",
        async (err, data) => {
          if (err) {
            reject(err);
          }
          const mapObj = {
            companyName,
            profession,
            fullName,
            charter
          }
          data = data.replace(regex, function (matched) {
            return mapObj[matched]
          })
          let pathToNewFile = `static/${uuidv4()}.xml`
          await fs.writeFile(`./${pathToNewFile}`, data, (err) => {
            reject(err);
            console.log('The file has been saved!' + pathToNewFile)
          })
          resolve(pathToNewFile)
        }
      )
    })
  }
}

module.exports = new XmlGeneratorService();