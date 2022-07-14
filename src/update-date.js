import fs from "fs"
import path from "path"
import converter from "json-2-csv"

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function Transform(origin, destiny) {
  fs.readFile(path.join(process.cwd(), origin), "utf-8", (err, data) => {
    if (err) return console.error(err);
    data = JSON.parse(data);
    let sec = 67;
    const new_data = JSON.stringify(
      data.map((item) => {
        sec += randomIntFromInterval(2, 10);
        return {
          ...item,
          send_at: new Date(`July 01, 2022 11:12:${sec % 60}`).toUTCString(),
        };
      })
    );
    fs.writeFileSync("updated", new_data);
    converter.json2csv(JSON.parse(new_data), (err, csv) => {
      if (err) {
        throw err;
      }

      // print CSV string
      console.log(csv);

      // write CSV to a file
      fs.writeFileSync(destiny, csv);
    });
  });
}

Transform('Phomenta-b2b_phomenta_course_captacao', 'phomenta')
