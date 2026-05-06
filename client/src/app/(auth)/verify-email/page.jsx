'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner';
import { verifyVerificationEmail } from '@/app/services/auth.service';
import { Spinner } from '@/components/ui/spinner';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    async function verify() {
      try {
        setStatus("loading");

        const res = await verifyVerificationEmail(token);
        // toast.success(res.message);
        setStatus("success")
      } catch (error) {
        // toast.error(
        //   (error.response?.data?.message || "Verification failed")
        // )
        setStatus("error")
      }
    }
    if (token) verify();
  }, [token]);

  return (
    <div className='flex items-center justify-center h-screen'>
      {status === "loading" && (
        <div className='flex items-center gap-4'>
          Verifying your email... 
          <Spinner />
        </div>
      )}

      {status === "success" && (
        <div className='text-green-600 text-lg'> Your Email has been verified successfully! </div>
      )}

      {status === "error" && (
        <div className='text-red-600 text-lg'> Verification failed or token expired request new ones from login page! </div>
      )}

    </div>
  )
}
