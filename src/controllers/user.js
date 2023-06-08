import User from '../models/User';


export default {
    async create(req, res){

        const { name, password, phone, email } = req.body; // futuramente receber mais dados data: 30/04


        
        if(await User.findOne({ 
            $or: [
                { phone: phone || null }, // o null é pra ele nao pegar undefined repetido
            ] 
            })
        ) {
            
            return res.send({ error: "User already exists." })
        }


        

        const picturesUrls = req.files.map(item => {
            return item.location;
        });

        const user = await User.create({
            name,
            password,
            phone,
            email,
            picturesUrls,
        });
		
		// // tratar duplicatas

		user.password = undefined;
		
        return res.send(user); 
    }

};