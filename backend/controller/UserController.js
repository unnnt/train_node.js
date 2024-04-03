import { Op } from "sequelize";
import User from "../models/UserModel.js";

export const getUsers = async (req, res) => {
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

export const updateUser = async(req, res) =>{
    try{
        await User.update(req.body,{
            where:{
                id: req.params.id
            }
        } );
    res.status(200).json({msg : "User Updated"});
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