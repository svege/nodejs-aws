import { Transform, Writable } from "stream";
import { createReadStream, createWriteStream } from "fs";
import csv from "csvtojson";
import { pipeline } from "stream/promises";
import { PATHS } from "../constants";

const streamTransformCsvToTxt = () =>
    new Transform({
        transform(chunk, encoding, callback) {
            callback(null, String(chunk));
        }
    });

(async () => {
    try {
        const readStream = createReadStream(PATHS.input, {
            highWaterMark: 5
        });

        class CustomWriter extends Writable {
            writeStreamToFile = createWriteStream(PATHS.outputFile, {
                highWaterMark: 2
            });
            writeStreamToDB = createWriteStream(PATHS.outputDB, {
                highWaterMark: 1
            });

            _write(chunk: Buffer, encoding: string, cb: any) {
                const canWriteToFile = this.writeStreamToFile.write(chunk);
                const canWriteToDB = this.writeStreamToDB.write(chunk);

                if (!canWriteToFile) {
                    this.writeStreamToFile.once("drain", cb);
                    return;
                }
                if (!canWriteToDB) {
                    this.writeStreamToDB.once("drain", cb);
                    return;
                }
            }
        }

        const writeToDifferentTargets = new CustomWriter();

        await pipeline(
            readStream,
            csv(),
            streamTransformCsvToTxt(),
            writeToDifferentTargets
        );
    } catch (error) {
        console.log(error);
    }
})();
