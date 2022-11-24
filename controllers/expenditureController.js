import multer from "multer";
import sharp from "sharp";
import Expenditure from "../models/expenditureModel";

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
  fileFilter: multerFilter
});

// const upload = multer({ dest: 'public/img/user' });
export const uploadUserPhoto = upload.single('photo');
export const resizeUserPhoto = (async (req, res, next) => {
    try{
        if (!req.file) return next();
        req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
      
        await sharp(req.file.buffer)
          .resize(500, 500)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/images/expenditures/${req.file.filename}`);
      
        next();
    }catch(error){
        console.log(error)
    }

});

//filter unwanted objects when inserting data
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};


export const addExpenditure = async (req, res) => {
    try {
        const image = req.file;

        console.log({image});
        console.log(req.body);
        const filteredBody = filterObj(
            req.body,
            'name',
            'description',
            'amount',
            'date',
          );
          
        
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
