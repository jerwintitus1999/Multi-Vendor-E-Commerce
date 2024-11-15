import userModel from "../models/user.model.js";
import adminModel from "../models/admin.model.js"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { addImgToCloudinary, deleteProfileImage } from "../middleware/cloudinaryMiddleware.js";

//create jwt token
const createToken = async(_id) => {
    return await jwt.sign({_id}, process.env.JWT_SECRET)
    }

// Route for user login
const loginUser = async (req, res) => {
    const {email,password} = req.body;

    const user = await userModel.findOne({email})
    
    if(!user){
         return res.status(404).json({message: "User not found"})
    }
    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(400).json({message: "Invalid password"})
        }
    const token = await createToken(user._id)
    
    res.status(200).json({
        message: "User logged in successfully",
        success: true,
        token: token
    })
};

// Route for user register
const registerUser = async (req, res) => {
    try {
        const {name,email,password} = req.body;

    //checking user already exists or not
    const userEmail = await userModel.findOne({email});
    if(userEmail) {
        return res.status(400).json({success:false, message: "Email already exists"});
    };

    // validationg email format & strong password
    if(!validator.isEmail(email)){
        return res.status(400).json({success:false, message: "Please enter a valid email"});
    }

    if(password.length < 8){
        return res.status(400).json({success:false, message: "Please Enter Strong Email"})
    }
    // hashing user password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt);
    // creating new user
    const newUser = new userModel({
        name,
        email,
        password: hashedPassword
    });
    // saving user to database
    const user = await newUser.save();
    // generating token
    const token = await createToken(user._id)
    // sending response
    res.status(200).json({success:true, message: "User created successfully", token})


    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        })
    }
} 

const userUpdate = async (req, res) => {
    const { userId, name, surname, email, address, phone, dob } = req.body;
    const img = req.file; // Image provided for update
  console.log("funvtion")
    try {
      // Find the user by ID
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Update user fields
      user.name = name || user.name;
      user.surname = surname || user.surname;
      user.email = email || user.email;
      user.phone = phone || user.phone;
  
      // Convert dob string to Date object, if provided
      if (dob) {
        user.dob = new Date(dob);
      }
  
      // Update address fields if provided
      if (address) {
        user.address = {
          street: address.street || user.address.street,
          city: address.city || user.address.city,
          state: address.state || user.address.state,
          zipcode: address.zipcode || user.address.zipcode,
          country: address.country || user.address.country,
        };
      }
  
      // If a new image is provided, delete the old one and upload the new one
      if (img) {
        await deleteProfileImage(user); // Delete old image from Cloudinary
        console.log("called")
        const imageUrl = await addImgToCloudinary([img]); // Upload new image
        if (imageUrl && imageUrl.length > 0) {
          user.image = imageUrl[0]; // Assign new image URL to the user
        }
      }
  
      // Save the updated user to the database
      const updatedUser = await user.save();
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        updatedUser,
      });
  
    } catch (error) {
      console.error(error.message+"hiiiii");
      return res.status(500).json({
        success: false,
        message: "Error updating user profile",
        error: error.message,
      });
    }
  };
  

const getUserDetails = async(req,res)=>{
    
    const { userId } = req.body

    try {
        const userData = await userModel.findById(userId);
        
        if (userData) {
     
            const user = {
                fname:userData.name,
                surname:userData.surname?userData.surname:"",
                email:userData.email?userData.email:"",
                phone:userData.phone?userData.phone:"",
                dob:userData.dob?userData.dob.toISOString().split('T')[0]:"",
                address:userData.address?userData.address:userData.address,
                image:userData.image||"",
                role:userData.role||""
            }

            res.status(200).json({ success: true, user });

            }

    } catch (error) {
        console.log(error.message+"gett");
        res.json({
            success: false,
            message: "Error getting user details",
            error: error.message
            });
    }
}




export { loginUser, registerUser, userUpdate, getUserDetails, createToken};
