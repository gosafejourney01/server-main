import Admin from '../models/admin.js';

export const root = async (req, res) => {
    const data = await Admin.find();
    res.status(200).json(data);
};

export const updateDetails = async (req, res) => {
    const { comission } = req.body;
    try {
        if (!comission) {
            res.status(400).json({ message: "Invalid data" });
        }
        let data = await Admin.findOneAndUpdate({ comission, key: "secretkey" });
        res.status(200).json({comission});
    
        if (!data) {
            data = await Admin.create({ comission, key: "secretkey" });
            res.status(200).json({comission});
        }
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}