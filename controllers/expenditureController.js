import multer from 'multer';
import sharp from 'sharp';
import Expenditure from '../models/expenditureModel';
import fs from 'fs';
import util from 'util';
import S3 from 'aws-sdk/clients/s3';
import moment from 'moment';
import uuid from 'uuid4';

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(Error('Not an image Please Upload Only Images', 400));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// const upload = multer({ dest: 'public/img/user' });
export const uploadUserPhoto = upload.single('photo');
export const resizeUserPhoto = async (req, res, next) => {
  try {
    if (!req.file) return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/images/expenditures/${req.file.filename}`);

    next();
  } catch (error) {
    console.log(error);
  }
};

//filter unwanted objects when inserting data
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const uploadFile = async (files, folder) => {
  const S3_BUCKET_NAME = 'vsas';
  const S3_ENDPOINT = 'https://eu-central-1.linodeobjects.com';
  const S3_REGION = 'eu-central-1';
  const S3_ACCESS_KEY_ID = 'VCFPYVWG6K7AR54D632Q';
  const S3_SECRET_KEY = 'nzJWh3iEqJ4wCBAyOcc4Kmc7dwf6LAKGhIXLnD2c';

  const unlinkFile = util.promisify(fs.unlink);
  try {
    const region = S3_REGION;
    const endpoint = S3_ENDPOINT;
    const accessKeyId = S3_ACCESS_KEY_ID;
    const secretAccessKey = S3_SECRET_KEY;
    const config = { region, endpoint, accessKeyId, secretAccessKey };
    const s3 = new S3(config);
    const ACL = 'public-read';

    console.log('Uploading ::::> ', files);
    const fileStream = await fs.createReadStream(files.path);

    const uploadParams = {
      Bucket: S3_BUCKET_NAME,
      Body: fileStream,
      ACL,
      Key: `${folder}/${files.originalname}`,
      ContentType: files.mimetype,
    };

    const uploaded = await s3.upload(uploadParams).promise();

    return uploaded.Location;
  } catch (error) {
    console.log({ error });
    throw error;
    // Cache files that were not uploaded
    // for (let i = 0; i < files.length; i++) {
    //   await unlinkFile(files[i].path);
    // }
  }
};

export const addExpenditure = async (req, res) => {
  try {
    const image = req.file;

    const filteredBody = filterObj(
      req.body,
      'name',
      'description',
      'amount',
      'date',
      'invoiceNumber',
      'vendorName',
    );

    const photo = await uploadFile(image, 'expenditures');
    //2b) Filtered out unwanted fields names that are not allowed to be updated
    if (req.file) filteredBody.photo = photo;

    filteredBody.date = moment(filteredBody.date).format('YYYY-MM-DD');
    filteredBody.uuid = uuid();

    const newExpenditure = await Expenditure.create(filteredBody);

    return res.status(201).json({
      message: 'Expenditure created successfully',
      newExpenditure,
    });
  } catch (error) {
    console.log(error);
  }

  return res.status(400).json({
    message: 'Internal server error',
    success: false,
  });
};

export const getAllExpenditures = async (req, res) => {
  try {
    const expenditures = await Expenditure.find({});

    if (expenditures.length === 0) {
      return res.status(404).json({
        message: 'Not Found, Add some',
      });
    }

    return res.status(200).json({
      message: 'success',
      expenditures,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: 'Internal server error',
      success: false,
    });
  }
};
