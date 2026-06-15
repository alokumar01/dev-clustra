
import { cookies } from "next/headers";


export default async function getCurrentuser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
    {
      headers: {
        Cookie:  `accessToken=${accessToken}`
      },
      cache: "no-store"
    }
  );


  const data = await response.json();
  
  return data.user;
}