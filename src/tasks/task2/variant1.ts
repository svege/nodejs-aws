import { createReadStream, createWriteStream } from "fs";
import csv from "csvtojson";
import { PATHS } from "../constants";

const readStream = createReadStream(PATHS.input);
const writeStream = createWriteStream(PATHS.outputFile);

(() => readStream.pipe(csv()).on("data", (chunk) => writeStream.write(chunk))
    .on("end", () => writeStream.end())
    .on("error", err => {
        console.log(err.message);
        process.exit(1);
    }
    ))();
