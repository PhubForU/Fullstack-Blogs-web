import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default function Home() {

  async function main(){
    const user = await prisma.comment.findMany({
      where:{
        cmntAuthorId:'668ed39235409dd433dfe420'
      },
      include:{
        cmntAuthor:{
          include:{
            password:false
          }
        },
        post:{
          include:true
        }
      }
    })
    console.log(user);
  }
return(
  <div className='border h-full'>this is a hero section</div>
)
}
