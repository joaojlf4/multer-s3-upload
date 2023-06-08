require('dotenv').config();

import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

import multerS3 from 'multer-s3';
import aws from 'aws-sdk';


const storageConfig = {
    local: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, path.resolve(__dirname, '..', 'tmp', 'uploads'))
            },
            filename: (req, file, cb) => {
                crypto.randomBytes(16, (err, hash) => {
                    if (err) cb(err);
                    
                    file.key = `${hash.toString('hex')}-${file.originalname}`;

                    cb(null, file.key);
                })
            },
    }),
    s3: multerS3({
        s3: new aws.S3(),
        bucket: process.env.BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {
                fieldName: file.fieldname
            });
        },
        key: function (req, file, cb) {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);
                
                file.key = `${hash.toString('hex')}-${file.originalname}`;

                cb(null, file.key);
            })
        }
    })
};

export default {
    dest: path.resolve(__dirname, '..', 'tmp', 'uploads'),
    
    storage: storageConfig[process.env.STORAGE_TYPE],

    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png'
        ]

        if(allowedMimes.includes(file.mimetype)) {
            cb(null, true)
        }else {
            cb(new Error('Invalid file type.'))
        }
    }
};

