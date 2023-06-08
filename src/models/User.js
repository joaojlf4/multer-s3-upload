require('dotenv').config();

import database from '../database';
import bcryptjs from 'bcryptjs';
import aws from 'aws-sdk';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const s3 = new aws.S3();

const UserSchema = new database.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        unique: true
    },
    twitterId: {
        type: String,
		default: Date.now()
    },
    // birthday: {
    //     type: Date,
    //     required: true
    // },
    // gender: {
    //     type: [String],
    //     required: true,
    //     isPublic: Boolean
    // },
    // show: {
    //     type: String,
    //     required: true,
    // },
    // interests: {
    //     type: [String],
    // },
    picturesUrls: {
        type: [String],
        required: true,
    },
	created_at: {
		type: Date,
		default: Date.now
	}
 });

 UserSchema.pre('save', async function (next){
    const hash = await bcryptjs.hash(this.password, 10);
    this.password = hash;

    this.picturesUrls.map(item => {
        if(!item) {
            item = `${process.env.APP_URL}/files/${this.key}`;
        }
    })

    next();
 })

 UserSchema.pre('remove', async function (next) {
     if(process.env.STORAGE_TYPE === 'S3') {

        this.picturesUrls.map(item => {

            const itemKey = item.splice('amazonaws.com')[1]

            return s3.deleteObject({
                Bucket: process.env.BUCKET_NAME,
                Key: itemKey
            }).promise();
        })
        
     }else {
        this.picturesUrls.map(item => {

            return promisify(fs.unlink)(path.resolve(__dirname, '..', 'tmp', 'uploads', item));
        })

        return promisify(fs.unlink)(path.resolve(__dirname, '..', 'tmp', 'uploads', ));
     }
 })


export default database.model('User', UserSchema);