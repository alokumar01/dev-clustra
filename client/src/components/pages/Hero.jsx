'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function Hero() {
  return (
    <div className="overflow-x-hidden bg-gray-50">

      {/* ================= HEADER ================= */}
      <header className="relative py-4 md:py-6">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold">DevClustra</h1>
          </div>

          {/* Nav */}
          {/* <div className="hidden lg:flex gap-10">
            <a href="#" className="text-gray-900 hover:opacity-60"></a>
            <a href="#" className="text-gray-900 hover:opacity-60">Community</a>
            <a href="#" className="text-gray-900 hover:opacity-60">Support</a>
          </div> */}

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <a href="/login" className="text-gray-900">Login</a>
            <Button variant="outline" className="rounded-xl" >
                <Link href="/signup">Sign Up</Link>
            </Button>
          </div>

        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="py-16 lg:pt-20">
        <div className="max-w-3xl mx-auto text-center px-4">

          {/* Badge */}
          <p className="inline-flex px-4 py-2 border rounded-full text-gray-900">
            Made by Developers, for Developers
          </p>

          {/* Title */}
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Quality resources shared by the community
          </h1>

          {/* Description */}
          <p className="mt-6 text-gray-600 max-w-md mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Vehicula massa in enim luctus.
          </p>

          {/* CTA with glow effect */}
          <div className="relative inline-flex mt-10 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-pink-400 to-red-400 rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition"></div>

            <Button className="relative px-8 py-6 text-lg rounded-xl">
                Join Us and connect with you friends``
            </Button>
          </div>
        </div>

        {/* Illustration */}
        {/* <div className="mt-16">
          <img
            src="https://d33wubrfki0l68.cloudfront.net/54780decfb9574945bc873b582cdc6156144a2ba/d9fa1/images/hero/4/illustration.png"
            alt="hero"
            className="w-full max-w-6xl mx-auto"
          />
        </div> */}
      </section>
    </div>
  )
}