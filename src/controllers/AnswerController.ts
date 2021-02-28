import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";


class AnswerController {


    // http://localhost:8484/answers/1?u=bec3e037-a038-4797-aaba-40fa082a2f4b
    /**
     * 
     * Route Params => Parametros que compõe a rota
     * routes.get("/answers/:value")
     * 
     *  Query Params => Busca, Paginação, Não obrigatorio
     * ?
     * chave=valor
     */

        async execute(req: Request, res: Response) {
        const { value } = req.params;
        const { u } = req.query;


        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);


        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u)
        })

        if(!surveyUser) {
            throw new AppError("Survey User does not exist!")

        }

        surveyUser.value = Number(value);

        await surveysUsersRepository.save(surveyUser);

        return res.json(surveyUser)
    }
}

export { AnswerController }