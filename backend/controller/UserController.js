import { Op } from "sequelize";
import User from "../models/UserModel.js";
import UserHistory from "../models/history.js";

export const getUsersSearch = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search_query || "";
    const offset = limit * page;
    console.log("Received request to search users with query:", search, "Page:", page, "Limit:", limit);

    try {
        const totalRows = await User.count({
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: '%' + search + '%'
                        }
                    },
                    {
                        email: {
                            [Op.like]: '%' + search + '%'
                        }
                    }
                ]
            }
        });

        console.log("Total Rows Found:", totalRows);
        const totalPage = Math.ceil(totalRows / limit);
        console.log("Total Pages:", totalPage);
        const result = await User.findAll({
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: '%' + search + '%'
                        }
                    },
                    {
                        email: {
                            [Op.like]: '%' + search + '%'
                        }
                    }
                ]
            },
            offset: offset,
            limit: limit,
            order: [
                ['id', 'DESC']
            ]
        });
        console.log("Search Result:", result);
        res.json({
            result: result,
            page: page,
            limit: limit,
            totalRows: totalRows,
            totalPage: totalPage
        });
    } catch (error) {
        console.error("Error occurred during user search:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const getUserById = async(req, res) =>{
    try{
        const response = await User.findAll({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error){
        console.log(error.message);
    }
}

export const createUser = async(req, res) =>{
    try{
        await User.create(req.body);
    res.status(201).json({msg : "User Created"});
    } catch (error){
        console.log(error.message);
    }
}

export const deleteUser = async(req, res) =>{
    try{
        await User.destroy({
            where:{
                id: req.params.id
            }
        } );
    res.status(200).json({msg : "User Deleted"});
    } catch (error){
        console.log(error.message);
    }
}
export const getUsersSorted = async (req, res) => {
    console.log("Function getUsersSorted is being executed...");

    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'id';
    const sortOrder = req.query.sortOrder || 'ASC';
    const offset = limit * page;

    const allowedSortByFields = ['id', 'name', 'email', 'gender', 'createdAt', 'updatedAt'];
    const allowedSortOrders = ['ASC', 'DESC'];
    const validSortBy = allowedSortByFields.includes(sortBy) ? sortBy : 'id';
    const validSortOrder = allowedSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';
  
    try {
        const totalRows = await User.count();
        const totalPage = Math.ceil(totalRows / limit);
  
        const result = await User.findAll({
            offset: offset,
            limit: limit,
            order: [[validSortBy, validSortOrder]],
            attributes: { exclude: ['password'] }
        });

        console.log('Sorted Users:', result);
  
        res.json({
            result,
            page: page,
            limit: limit,
            totalRows,
            totalPage
        });
    } catch (error) {
        console.error('Error occurred while fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const saveUserHistory = async (userId, action, columnChanged, oldValue, newValue) => {
    try {
        await UserHistory.create({
            userId: userId,
            action: action,
            columnChanged: columnChanged,
            oldValue: oldValue,
            newValue: newValue,
            updatedAt: new Date()
        });
    } catch (error) {
        console.error("Error occurred while saving user history:", error);
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, gender } = req.body;

        const userBeforeUpdate = await User.findByPk(id);

        await User.update({ name, email, gender }, { where: { id } });

        if (userBeforeUpdate.name !== name) {
            await saveUserHistory(id, "update", "name", userBeforeUpdate.name, name);
        }
        if (userBeforeUpdate.email !== email) {
            await saveUserHistory(id, "update", "email", userBeforeUpdate.email, email);
        }
        if (userBeforeUpdate.gender !== gender) {
            await saveUserHistory(id, "update", "gender", userBeforeUpdate.gender, gender);
        }

        res.status(200).json({ msg: "User Updated" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getUserHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const history = await UserHistory.findAll({ where: { userId: id } });
        res.json(history);
    } catch (error) {
        console.error("Error fetching user history:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};




