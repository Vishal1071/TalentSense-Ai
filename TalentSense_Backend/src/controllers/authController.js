import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// User registration
export const register = async (req, res, next) =>{
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }

        const exist = await User.findOne({ email });
        if(exist){
            return res.status(409).json({ message: "User already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password :passwordHash });
        
        res.json({
            ok: true,
            message: "User registerd successfully",
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        next(error);
    }
}


// User login
export const login = async ( req, res, next ) =>{
    try {
        const { email, password } = req.body;

       const user = await User.findOne({ email });
       if(!user) return res.status(404).json({ message: "User not found" });

       const match = await bcrypt.compare(password, user.password);
       if(!match) return res.status(401).json({ message: "invalid password" });

       const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '2d' }
       );

        res.json({
            ok: true,
            token,
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
}


// ME (PROFILE)
export const getMe = async ( req, res, next ) =>{
    try {
        const user = await User.findById(req.user.id).select('-password');       
        res.json({ ok: true, user });
    } catch (error) {
        next(error);
    }
};