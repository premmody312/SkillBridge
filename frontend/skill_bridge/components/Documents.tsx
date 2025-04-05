import { auth } from "@clerk/nextjs/server";
import AllDocuments from "./AllDocuments";

async function Documents() {
	auth.protect();

	const {userId} = await auth()

	if(!userId){
		throw new Error("User Not Found")
	}

	return (
		
		<div className='flex flex-wrap p-5 bg-gray-100 justify-center lg:justify-start rounded-xl gap-5 w-full mx-auto'>
			
			<AllDocuments />
		</div>
	);
}

export default Documents;
