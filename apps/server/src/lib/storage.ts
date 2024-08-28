import { Client } from "minio";

export const minio = new Client({
    endPoint: process.env.MINIO_ENDPOINT!,
    port: +(process.env.MINIO_PORT ?? 9000),
    accessKey: process.env.MINIO_ACCESS_KEY!,
    secretKey: process.env.MINIO_SECRET_KEY!,
    useSSL: true,
});

minio.bucketExists(process.env.MINIO_BUCKET!).then((exists) => {
    if (exists) {
        console.log("Bucket " + process.env.MINIO_BUCKET + " exists.");
    } else {
        console.log("Bucket " + process.env.MINIO_BUCKET + " does not exist.");
        return new Response("Bucket does not exist", {
            status: 500,
        });
    }
}, console.error);
