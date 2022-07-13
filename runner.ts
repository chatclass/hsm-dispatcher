import axios from "axios";
import fs from "fs";
import converter from "json-2-csv";
import GoogleSheets from "./gsheet";
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const client = axios.create({
  baseURL: "http://localhost:3100/v1",
});

type Input = {
  channel: string;
  instance: string;
  cliente: string;
  courseId: string;
  template: (phone: number) => any;
  phones: number[];
  chatclass: number[];
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export async function Run(input: Input) {
  let error = 0;
  let success = 0;
  let total = 0;
  const result: any[] = [];
  console.log("Sending HSM batch");
  console.log({
    ...input,
    phones: input.phones.length,
    template_name: input.template(12345).template.name,
  });
  await delay(5000)
  const gsheet = new GoogleSheets();
  await gsheet.start("Resultado");
  for (const phone of input.chatclass) {
    total += 1;
    await client
      .post(
        `/channel/internal/${input.instance}/${input.channel}`,
        input.template(phone)
      )
      .then(async () => {
        success += 1;
        const data = {
          course_id: input.courseId,
          client: input.cliente,
          status: "success",
          phone: phone,
          template: input.template(phone).template.name,
          send_at: new Date().toUTCString(),
        };
        process.stdout.write("I");
      })
      .catch(async () => {
        const data = {
          course_id: input.courseId,
          client: input.cliente,
          status: "error",
          phone: phone,
          template: input.template(phone).template.name,
          send_at: new Date().toUTCString(),
        };
        process.stdout.write(String(`X:${phone}`));
        error += 1;
      });
  }
  const answer = await new Promise(resolve => {
    rl.question("Continuar envio dos HSM", resolve)
  })

  if(String(answer) === 'n') process.exit();

  for (const phone of input.phones) {
    total += 1;
    await client
      .post(
        `/channel/internal/${input.instance}/${input.channel}`,
        input.template(phone)
      )
      .then(async () => {
        success += 1;
        const data = {
          course_id: input.courseId,
          client: input.cliente,
          status: "success",
          phone: phone,
          template: input.template(phone).template.name,
          send_at: new Date().toUTCString(),
        };
        await gsheet.sheet?.addRow(data);
        result.push(data);
        process.stdout.write("I");
      })
      .catch(async () => {
        const data = {
          course_id: input.courseId,
          client: input.cliente,
          status: "error",
          phone: phone,
          template: input.template(phone).template.name,
          send_at: new Date().toUTCString(),
        };
        await gsheet.sheet?.addRow(data);
        result.push(data);
        console.error(`Erro no numero: ${phone}\n`);
        process.stdout.write(`X:${phone}`);
        error += 1;
      });
    const data = JSON.stringify(result);
    fs.writeFileSync(`${input.cliente}-${input.courseId}`, data);
    converter.json2csv(result, (err, csv: any) => {
      if (err) {
        console.error("Error", err);
        throw err;
      }
      // write CSV to a file
      fs.writeFileSync(`data/${input.cliente}-${input.courseId}.csv`, csv);
    });
  }
  process.stdout.write(`\n`);
  console.table({
    erros: error,
    success,
    total,
  });
}
