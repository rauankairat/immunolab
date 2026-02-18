import { prisma } from "../lib/prisma";

async function main() {
   const user = await prisma.user.create({
    data: {

    }
   })


main()
 .catch(e =>{
    console.error(e.message)
 })
 .finally(async ()=>{
    await prisma.$disconnect()
 })
}