import multer from 'multer';
import sharp from 'sharp';
import Expenditure from '../models/expenditureModel';
import fs from 'fs';
import util from 'util';
import S3 from 'aws-sdk/clients/s3';

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
  const AWS_BUCKET_NAME = 'bluescope-property-images';
  const AWS_REGION = 'EU (Paris) eu-west-3';
  const SPACES_ENDPOINT = 'ams3.digitaloceanspaces.com';
  const AWS_ACCESS_KEY = 'AKIA5FDWB6UI7HV557XV';
  const AWS_SECRET_KEY = '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';

  const unlinkFile = util.promisify(fs.unlink);
  try {
    const region = AWS_REGION;
    const accessKeyId = AWS_ACCESS_KEY;
    const secretAccessKey = AWS_SECRET_KEY;
    const s3 = new S3({ region, accessKeyId, secretAccessKey });

    console.log('Uploading ::::> ', files);
    const fileStream = await fs.createReadStream(files.path);

    const uploadParams = {
      Bucket: config.AWS_BUCKET_NAME,
      Body: fileStream,
      Key: `${folder}/${files.originalname}`,
      ContentType: files[i].mimetype,
    };

    const result = await s3
      .upload(uploadParams)
      .promise()
      .then(async (result) => {
        await unlinkFile(files.path);
        return result;
      })
      .catch(async (error) => {
        throw error;
      });

    return result.Location;
  } catch (error) {
    // Cache files that were not uploaded
    // for (let i = 0; i < files.length; i++) {
    //   await unlinkFile(files[i].path);
    // }
  }
};

export const addExpenditure = async (req, res) => {
  try {
    const filteredBody = filterObj(
      req.body,
      'name',
      'description',
      'amount',
      'date'
    );

    await uploadFile(req.file, 'expenditures');
    //2b) Filtered out unwanted fields names that are not allowed to be updated
    if (req.file) filteredBody.photo = req.file.filename;

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
