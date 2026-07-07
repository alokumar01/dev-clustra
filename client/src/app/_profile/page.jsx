// TEST WORKING WITH SERVER COMPONENT 
// Current mindset:

// Profile Page
// ↓
// Read Zustand
// ↓
// Show User

// New mindset:

// Profile Page (Server)
// ↓
// Read Cookie
// ↓
// Call Express API
// ↓
// Get User
// ↓
// Show User

// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// import React from 'react'
// import Image from 'next/image'
// import { api } from '@/lib/api/axios'

// export default async function Profile() {
//   // const response = await api
//   // const response = await fetch(
//   //   "http://localhost:5000/api/v1/auth/me",
//   //   {
//   //     credentials: "include",
//   //     cache: "no-store",
//   //   }
//   // );
//   // const data = await response.json();




//   return (
//     <Card>
//       <h1 className='text-2xl m-4'>My profile</h1>

//       <div className='border shadow-2xl w-1/2 rounded-sm p-4 m-4'>
//         <div className='flex gap-4'>
//           <div>
//             <Image 
//               src={data.user.avatar}
//               alt='profile_image'
//               width={60}
//               height={60}
//               unoptimized
//               className='rounded-full'
//             />
//           </div>
//           <div>
//             <p className='text-xl font-bold'>{data.user.username}</p>
//           </div>
//           <p>{data.user.bio}</p>
//         </div>

//       </div>

//       <div className='border shadow-2xl w-1/2 rounded-sm p-4 m-4'>
//         <h1 className='text-2xl m-4'>Personal Information</h1>
        

          

//       </div>








//     </Card>
//   ) 
// }


import getCurrentuser from "../services/auth.service.server"

export default async function ProfilePage() {
  const user = await getCurrentuser();

  return (
    <div>
      <h1>{user.username}</h1>
    </div>
  )
}