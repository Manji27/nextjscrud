import Client from "../../../models/Client";
import dbConnection from "../../../services/dbConnection";

dbConnection();

export default async function handler(req, res){
    const {method} = req;
    const {ClientID} = req.query;

    switch(method){
        case "PUT":
            try {
                const {name, email} = req.body;
                if(!name, !email) throw "invalid data"
                await Client.updateOne({_id:ClientID}, {name, email});
                res.status(200).json({sucess:true})
            } catch (error) {
                console.log(error)
                res.status(500).json({sucess: false, error})
            }
            break;

        case "DELETE":
            try {
                await Client.deleteOne({_id:ClientID});
                res.status(200).json({sucess:true})
            } catch (error) {
                console.log(error)
                res.status(500).json({sucess: false, error})
            }
            break;
    }
}