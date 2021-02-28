import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

class UserController {
    async create(req: Request, res: Response) {
        const {name, email} = req.body;

        const schema = yup.object().shape({
            name: yup.string().required("O nome é obrigatorio!"),
            email: yup.string().email().required("E-mail incorreto!")
        })

        /*
        if (!(await schema.isValid(req.body)) ) {
            return res.status(400).json({error: "Validation Failed!"})
        }
        */

        try {
            await schema.validate(req.body, {abortEarly: false})
        } catch (err) {
            throw new AppError(err);
        }
        const usersRepository = getCustomRepository(UserRepository);

        // SELECT * FROM USERS WHERE EMAIL = "EMAIL"
        const userAlreadyExistes = await usersRepository.findOne({
            email
        })

        if (userAlreadyExistes) {
            throw new AppError("User already exists!")
        }

        const user =  usersRepository.create({
            name,
            email,
        })

        await usersRepository.save(user);

        return res.status(201).json(user);
    }

    async show(req: Request, res: Response) {
        const usersRepository = getCustomRepository(UserRepository);

        const all = await usersRepository.find();

        return res.json(all);
    }
}

export { UserController };

