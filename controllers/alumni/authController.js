// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// import {User} from '../../model/admin/user.js';





// export const register = async (req, res) => {
   
//   const email = req.body.email;
//   const password = req.body.password;
  

//   const domain = email.split('@')[1];

//   // Define rules to assign roles based on domains
//   const domainToRole = {
//     '@tut.ac.za': 'Admin',
//     '@tut4life.ac.za': 'Alumni',
//     // Add more domain-role mappings as needed
//   };

//   const role = domainToRole[domain]


//   try {


//     const hashedPassword = await bcrypt.hash(password, 12);
//     const userDetails = {
    
//       email: email,
//       password: hashedPassword,
//       role: role,

//     };

//     const result = await User.save(userDetails);

//     res.status(201).json({ message: 'User registered!' });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//   }
// };

// export const login = async (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;
 
  
//   try {
//     const user = await User.find(email);
//     if (err) return res.status(500).json(err);
//     if (data.length) return res.status(409).json("User already exists!");
  

//     if (user[0].length !== 1) {

//       const error = new Error('A User with this email could not be found.');
//       error.statusCode = 401;
//       throw error;
      
//     }

//     const storedUser = user[0][0];

//     const isEqual = await bcrypt.compare(password, storedUser.password);

//     if (!isEqual) {
//       const error = new Error('Wrong password!');
//       error.statusCode = 401;
//       throw error;
//     }

//     const token = jwt.sign(
//       {
//         email: storedUser.email,
//         UserId: storedUser.id,
//       },
//       'secretfortoken',
//       { expiresIn: '1h' }
//     );
//     res.status(200).json({ token: token, UserId: storedUser.id });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// export const logout = (req, res) => {
//   res.clearCookie("access_token",{
//     sameSite:"none",
//     secure:true
//   }).status(200).json("User has been logged out.")
// };
