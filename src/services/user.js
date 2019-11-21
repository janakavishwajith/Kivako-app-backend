
/********
* user.js file (services/users)
********/
const express = require('express');
const User = require('../models/user');


const checkIfUserAlreadyRegistered = async (req, res, next) => {

    try {

        console.log("[DEBUG]Checking if user " + req.user.email + " is already registered!");

        if (req.user.email) {
            const email = req.user.email;

            let isEmailExists = await User.findOne({
                "email": email
            });

            if (isEmailExists != null) {
                console.log("[INFO]User " + req.user.email + " is already registered!");
                return res.status(200).json({
                    'data': 'true',
                    'email': email
                });
            } else {
                console.log("[INFO]User " + req.user.email + " is not registered!");
                return res.status(200).json({
                    'data': 'false'
                });
            }
        } else {
            console.log("[INFO]User " + req.user.email + " is not registered!");
            return res.status(201).json({
                'data': 'false'
            });
        }


    } catch (error) {
        console.log("[ERROR]Error during check if user " + req.user.email + " is already registered!");
        return res.status(404).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const getUsers = async (req, res, next) => {
    try {

        let users = await User.find({});

        if (users.length > 0) {
            return res.status(200).json({
                //'message': 'users fetched successfully',
                'data': users
            });
        }

        return res.status(404).json({
            'code': 'BAD_REQUEST_ERROR',
            'description': 'No users found in the system'
        });
    } catch (error) {
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const getUserInformation = async (req, res, next) => {
    try {

        const email = req.user.email;
        let user = await User.findOne({
            "email": email
        });

        if (user) {
            return res.status(200).json({
                'message': `User informations fetched successfully`,
                'data': user
            });
        }

        return res.status(404).json({
            'code': 'BAD_REQUEST_ERROR',
            'description': 'No users found in the system'
        });

    } catch (error) {

        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const createUser = async (req, res, next) => {
    try {

        const {
            firstName,
            lastName,
            email,
            cities,
            descriptionText,
            languagesToTeach,
            languagesToLearn,
            userIsActivie
        } = req.body;

        /*
        if (name === undefined || name === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'name is required',
                'field': 'name'
            });
        }*/

        if (email === undefined || email === '') {
            return res.status(422).json({
                'code': 'REQUIRED_FIELD_MISSING',
                'description': 'email is required',
                'field': 'email'
            });
        }

        let isEmailExists = await User.findOne({
            "email": email
        });

        //console.log("teste");
        //console.log(isEmailExists._id)

        if (isEmailExists) {
            return res.status(409).json({
                'code': 'ENTITY_ALREAY_EXISTS',
                'description': 'email already exists',
                'field': 'email'
            });
        }

        const temp = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            cities: cities,
            descriptionText: descriptionText,
            languagesToTeach: languagesToTeach,
            languagesToLearn: languagesToLearn,
            userIsActivie: userIsActivie
        };

        let newUser = await User.create(temp);

        if (newUser) {
            return res.status(201).json({
                'message': 'user created successfully',
                'data': newUser
            });
        } else {
            throw new Error('something went worng');
        }
    } catch (error) {
        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const updateUser = async (req, res, next) => {
    try {
        console.log("função chamada");
        const userEmail = req.user.email;

        console.log(userEmail)
        let user = await User.findOne({
            "email": userEmail
        });
        console.log(user)
        const userId = user._id;
        console.log("user id");
        console.log(userId)

        const {
            firstName,
            lastName,
            email,
            cities,
            descriptionText,
            languagesToTeach,
            languagesToLearn,
            userIsActivie
        } = req.body;

        let isUserExists = await User.findById(userId);

        if (!isUserExists) {
            return res.status(404).json({
                'code': 'BAD_REQUEST_ERROR',
                'description': 'No user found in the system'
            });
        }

        const temp = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            cities: cities,
            descriptionText: descriptionText,
            languagesToTeach: languagesToTeach,
            languagesToLearn: languagesToLearn,
            userIsActivie: userIsActivie
        }

        let updateUser = await User.findByIdAndUpdate(userId, temp, {
            new: true // TODO REMOVE THIS
        });

        if (updateUser) {
            return res.status(200).json({
                'update': true,
                'data': updateUser
            });
        } else {
            throw new Error('something went worng');
        }
    } catch (error) {

        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}

const deleteUser = async (req, res, next) => {
    try {
        let user = await User.findByIdAndRemove(req.params.id);
        if (user) {
            return res.status(204).json({
                'message': `user with id ${req.params.id} deleted successfully`
            });
        }

        return res.status(404).json({
            'code': 'BAD_REQUEST_ERROR',
            'description': 'No users found in the system'
        });

    } catch (error) {

        return res.status(500).json({
            'code': 'SERVER_ERROR',
            'description': 'something went wrong, Please try again'
        });
    }
}



module.exports = {
    getUsers: getUsers,
    getUserInformation: getUserInformation,
    createUser: createUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    checkIfUserAlreadyRegistered: checkIfUserAlreadyRegistered
}